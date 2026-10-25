import React, { useState, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Briefcase, FileCheck, PenSquare, Building2, User, Settings, UploadCloud, AlertTriangle, RefreshCw, Sparkles, ExternalLink, CheckCircle2, ThumbsUp, MessageSquare, Repeat, Send, Globe, X } from 'lucide-react';

export default function LinkedInHubPage({
  needsMigration = false,
  isConfigured,
  clientId,
  hasClientSecret,
  redirectUri,
  account,
  savedOrgId = '',
  savedOrgName = '',
  pendingApprovals = [],
  recentShares = [],
  authUrl,
  errorMessage = null,
}) {
  const [activeTab, setActiveTab] = useState('approvals');
  const [approvingId, setApprovingId] = useState(null);
  const [editCommentaries, setEditCommentaries] = useState({});

  // Direct Post Composer state
  const [customCommentary, setCustomCommentary] = useState('');
  const [customImage, setCustomImage] = useState('');
  const [customLink, setCustomLink] = useState('');
  const [isPublishingCustom, setIsPublishingCustom] = useState(false);
  const [publishFeedback, setPublishFeedback] = useState({});

  // Direct file upload state
  const fileInputRef = useRef(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showManualUrl, setShowManualUrl] = useState(false);

  // Settings form state
  const [inputClientId, setInputClientId] = useState(clientId || '');
  const [inputClientSecret, setInputClientSecret] = useState('');
  const [isSavingCreds, setIsSavingCreds] = useState(false);
  const [copiedUri, setCopiedUri] = useState(false);

  // Company Page settings state
  const [inputOrgId, setInputOrgId] = useState(account?.organization_id || savedOrgId || '');
  const [inputOrgName, setInputOrgName] = useState(account?.organization_name || savedOrgName || 'Coachings in Sikar');
  const [inputPostAs, setInputPostAs] = useState(account?.post_as || 'organization');
  const [isSavingPageSettings, setIsSavingPageSettings] = useState(false);
  const [isFetchingPages, setIsFetchingPages] = useState(false);
  const [pageSettingsFeedback, setPageSettingsFeedback] = useState(null);

  const handleAutoFetchPages = async () => {
    setIsFetchingPages(true);
    setPageSettingsFeedback(null);

    try {
      const res = await fetch('/api/admin/linkedin/fetch-pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      const data = await res.json();
      if (data.success && data.selected) {
        setInputOrgId(data.selected.urn);
        setInputOrgName(data.selected.name);
        setInputPostAs('organization');
        setPageSettingsFeedback(`Auto-detected: ${data.selected.name} (${data.selected.urn})!`);
        setTimeout(() => {
          router.reload({ only: ['account'] });
        }, 1500);
      } else {
        alert(data.message || 'Could not auto-fetch pages.');
      }
    } catch (err) {
      alert('Error fetching company pages: ' + err.message);
    } finally {
      setIsFetchingPages(false);
    }
  };

  const handleCopyUri = () => {
    navigator.clipboard.writeText(redirectUri);
    setCopiedUri(true);
    setTimeout(() => setCopiedUri(false), 2000);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/social/upload-image', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setCustomImage(data.url);
      } else {
        alert(data.message || 'Image upload failed');
      }
    } catch (err) {
      alert('Upload error: ' + err.message);
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleApprove = async (share) => {
    setApprovingId(share.id);
    const finalCommentary = editCommentaries[share.id] !== undefined ? editCommentaries[share.id] : share.commentary;

    try {
      const response = await fetch('/api/admin/linkedin/approve-publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          share_id: share.id,
          commentary: finalCommentary,
          media_url: share.media_url,
          target_link: share.target_link,
          title: share.title,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setPublishFeedback((prev) => ({
          ...prev,
          [share.id]: { success: true, permalink: data.permalink },
        }));
        setTimeout(() => {
          router.reload({ only: ['pendingApprovals', 'recentShares', 'account'] });
        }, 1500);
      } else {
        alert(data.message || 'Publishing to LinkedIn failed.');
      }
    } catch (err) {
      alert('Network error: ' + err.message);
    } finally {
      setApprovingId(null);
    }
  };

  const handlePublishCustom = () => {
    if (!customCommentary.trim()) {
      alert('Please enter post commentary for LinkedIn.');
      return;
    }

    setIsPublishingCustom(true);
    router.post(
      '/admin/linkedin/custom-post',
      {
        commentary: customCommentary,
        media_url: customImage || null,
        target_link: customLink || null,
      },
      {
        onFinish: () => setIsPublishingCustom(false),
        onSuccess: () => {
          setCustomCommentary('');
          setCustomImage('');
          setCustomLink('');
        },
      }
    );
  };

  const handleSaveCredentials = (e) => {
    e.preventDefault();
    setIsSavingCreds(true);
    router.post(
      '/admin/linkedin/credentials',
      {
        client_id: inputClientId,
        client_secret: inputClientSecret,
      },
      {
        onFinish: () => setIsSavingCreds(false),
      }
    );
  };

  const handleSavePageSettings = (e) => {
    e.preventDefault();
    setIsSavingPageSettings(true);
    setPageSettingsFeedback(null);
    router.post(
      '/admin/linkedin/page-settings',
      {
        organization_id: inputOrgId,
        organization_name: inputOrgName,
        post_as: inputPostAs,
      },
      {
        onFinish: () => setIsSavingPageSettings(false),
        onSuccess: () => {
          setPageSettingsFeedback('LinkedIn Company Page settings updated successfully!');
          setTimeout(() => setPageSettingsFeedback(null), 3500);
        },
      }
    );
  };

  const handleDisconnect = () => {
    if (confirm('Are you sure you want to disconnect this LinkedIn account?')) {
      router.post('/admin/linkedin/disconnect');
    }
  };

  const countHashtags = (text) => {
    const matches = text.match(/#[a-zA-Z0-9_]+/g);
    return matches ? matches.length : 0;
  };

  const liBlue = '#0a66c2';

  const isOrgMode = (account?.post_as || inputPostAs) === 'organization';
  const effectiveDisplayName = isOrgMode
    ? (account?.organization_name || inputOrgName || 'Coachings in Sikar')
    : (account?.name || 'LinkedIn Member');

  return (
    <AdminLayout>
      <Head title="LinkedIn Hub - Company Page & Member Posts" />

      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 16px', color: '#0f172a' }}>
        {/* Header Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0a66c2 0%, #004182 100%)',
            borderRadius: '16px',
            padding: '28px 32px',
            color: '#fff',
            marginBottom: '24px',
            boxShadow: '0 10px 25px -5px rgba(10, 102, 194, 0.3)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <div style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Briefcase size={28} color="#fff" />
              <span
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(8px)',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                }}
              >
                LinkedIn Company Page & UGC API
              </span>
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 900, margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
              LinkedIn Page Management Hub
            </h1>
            <p style={{ margin: 0, fontSize: '13.5px', opacity: 0.95, lineHeight: 1.5 }}>
              Publish educational articles, coaching analyses, and student alerts directly to your official <strong>LinkedIn Company Page</strong>.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
            {account ? (
              <div
                style={{
                  background: 'rgba(255,255,255,0.96)',
                  color: '#0f172a',
                  padding: '12px 18px',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: isOrgMode ? '#e0f2fe' : '#f1f5f9',
                    color: isOrgMode ? '#0284c7' : liBlue,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    border: '1px solid #cbd5e1',
                  }}
                >
                  isOrgMode ? <Building2 size={20} /> : <User size={20} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 900, fontSize: '14px' }}>
                      {effectiveDisplayName}
                    </span>
                    <span
                      style={{
                        background: isOrgMode ? '#0a66c2' : '#64748b',
                        color: '#fff',
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: '6px',
                        textTransform: 'uppercase',
                      }}
                    >
                      {isOrgMode ? 'Company Page' : 'Personal'}
                    </span>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                    Target URN: {account.effective_author_urn || account.organization_id || account.person_id}
                  </div>
                </div>
              </div>
            ) : (
              authUrl && (
                <a
                  href={authUrl}
                  style={{
                    background: '#fff',
                    color: '#0a66c2',
                    padding: '12px 22px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '13px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    transition: 'all 0.2s',
                  }}
                >
                  <Briefcase size={16} style={{ marginRight: "6px" }} /> Connect with LinkedIn
                </a>
              )
            )}
          </div>
        </div>

        {/* Database Migration Warning */}
        {needsMigration && (
          <div
            style={{
              background: '#fef3c7',
              border: '1px solid #fde68a',
              borderRadius: '12px',
              padding: '14px 18px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle size={20} color="#b45309" />
              <div>
                <strong style={{ color: '#92400e', fontSize: '13px' }}>Database Upgrade Required</strong>
                <div style={{ fontSize: '12px', color: '#b45309' }}>
                  LinkedIn database tables are being installed. Click Upgrade to finalize database sync.
                </div>
              </div>
            </div>
            <a
              href="/app-upgrade"
              style={{
                background: '#d97706',
                color: '#fff',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Run /app-upgrade
            </a>
          </div>
        )}

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            borderBottom: '2px solid #e2e8f0',
            marginBottom: '24px',
            overflowX: 'auto',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('approvals')}
            style={{
              padding: '12px 18px',
              border: 'none',
              background: 'transparent',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              color: activeTab === 'approvals' ? '#0a66c2' : '#64748b',
              borderBottom: activeTab === 'approvals' ? '3px solid #0a66c2' : '3px solid transparent',
              marginBottom: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <FileCheck size={16} style={{ marginRight: "6px" }} /> Approvals Queue
            {pendingApprovals.length > 0 && (
              <span
                style={{
                  background: '#0a66c2',
                  color: '#fff',
                  borderRadius: '12px',
                  padding: '1px 7px',
                  fontSize: '10px',
                  fontWeight: 900,
                }}
              >
                {pendingApprovals.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('composer')}
            style={{
              padding: '12px 18px',
              border: 'none',
              background: 'transparent',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              color: activeTab === 'composer' ? '#0a66c2' : '#64748b',
              borderBottom: activeTab === 'composer' ? '3px solid #0a66c2' : '3px solid transparent',
              marginBottom: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <PenSquare size={16} style={{ marginRight: "6px" }} /> Direct Post Composer
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('company_page')}
            style={{
              padding: '12px 18px',
              border: 'none',
              background: 'transparent',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              color: activeTab === 'company_page' ? '#0a66c2' : '#64748b',
              borderBottom: activeTab === 'company_page' ? '3px solid #0a66c2' : '3px solid transparent',
              marginBottom: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Building2 size={16} style={{ marginRight: "6px" }} /> LinkedIn Page & Account
            {account?.organization_id && (
              <span
                style={{
                  background: '#e0f2fe',
                  color: '#0369a1',
                  borderRadius: '12px',
                  padding: '1px 7px',
                  fontSize: '10px',
                  fontWeight: 800,
                }}
              >
                Page Active
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            style={{
              padding: '12px 18px',
              border: 'none',
              background: 'transparent',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              color: activeTab === 'settings' ? '#0a66c2' : '#64748b',
              borderBottom: activeTab === 'settings' ? '3px solid #0a66c2' : '3px solid transparent',
              marginBottom: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Settings size={16} style={{ marginRight: "6px" }} /> App & API Settings
          </button>
        </div>

        {/* TAB 1: Approvals Queue */}
        {activeTab === 'approvals' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 4px 0' }}>Pending LinkedIn Approvals</h2>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                  Review professional educational updates and coaching insights drafted for <strong>{effectiveDisplayName}</strong>.
                </p>
              </div>
              <a
                href="/admin/posts"
                style={{
                  background: '#f1f5f9',
                  color: '#334155',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                + Write New Post
              </a>
            </div>

            {pendingApprovals.length === 0 ? (
              <div
                style={{
                  background: '#fff',
                  border: '1px dashed #cbd5e1',
                  borderRadius: '16px',
                  padding: '48px 24px',
                  textAlign: 'center',
                  color: '#64748b',
                }}
              >
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}><Briefcase size={36} color="#64748b" /></div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', margin: '0 0 6px 0' }}>
                  No pending LinkedIn approvals
                </h3>
                <p style={{ fontSize: '13px', margin: '0 0 16px 0', maxWidth: '440px', marginLeft: 'auto', marginRight: 'auto' }}>
                  When you publish or draft a blog post, an authoritative LinkedIn post draft will automatically be generated here for your review and approval.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('composer')}
                  style={{
                    background: liBlue,
                    color: '#fff',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '12.5px',
                    cursor: 'pointer',
                  }}
                >
                  Create Standalone Post →
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px' }}>
                {pendingApprovals.map((share) => {
                  const currentCommentary = editCommentaries[share.id] !== undefined ? editCommentaries[share.id] : share.commentary;
                  const isApproving = approvingId === share.id;
                  const feedback = publishFeedback[share.id];

                  return (
                    <div
                      key={share.id}
                      style={{
                        background: '#fff',
                        borderRadius: '16px',
                        border: '1px solid #e2e8f0',
                        overflow: 'hidden',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {/* LinkedIn Header */}
                      <div
                        style={{
                          padding: '12px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          borderBottom: '1px solid #f1f5f9',
                        }}
                      >
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            background: liBlue,
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '14px',
                          }}
                        >
                          in
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ fontWeight: 800, fontSize: '13px', color: '#0f172a' }}>
                              {effectiveDisplayName}
                            </div>
                            <span
                              style={{
                                background: isOrgMode ? '#e0f2fe' : '#f1f5f9',
                                color: isOrgMode ? '#0284c7' : '#64748b',
                                fontSize: '10px',
                                fontWeight: 800,
                                padding: '1px 6px',
                                borderRadius: '4px',
                              }}
                            >
                              isOrgMode ? 'Company Page' : 'Member Profile'
                            </span>
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>
                            Education & Institute Advisory • {share.created_at}
                          </div>
                        </div>
                      </div>

                      {/* Photo or Link Preview */}
                      {share.media_url && (
                        <div style={{ width: '100%', height: '220px', background: '#f8fafc', overflow: 'hidden' }}>
                          <img
                            src={share.media_url}
                            alt={share.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      )}

                      {/* Editable Commentary */}
                      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b' }}>
                            POST COMMENTARY ({currentCommentary.length} / 3000 chars)
                          </span>
                          <span style={{ fontSize: '11px', color: '#0a66c2', fontWeight: 700 }}>
                            {countHashtags(currentCommentary)} hashtags
                          </span>
                        </div>
                        <textarea
                          rows={7}
                          value={currentCommentary}
                          onChange={(e) =>
                            setEditCommentaries({
                              ...editCommentaries,
                              [share.id]: e.target.value,
                            })
                          }
                          style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            fontSize: '12px',
                            lineHeight: 1.45,
                            marginBottom: '12px',
                            fontFamily: 'inherit',
                            resize: 'vertical',
                          }}
                        />

                        {feedback?.success && (
                          <div
                            style={{
                              padding: '10px',
                              background: '#ecfdf5',
                              border: '1px solid #a7f3d0',
                              borderRadius: '8px',
                              color: '#065f46',
                              fontSize: '12px',
                              marginBottom: '12px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <span>Published to LinkedIn {isOrgMode ? 'Company Page' : ''}!</span>
                            {feedback.permalink && (
                              <a
                                href={feedback.permalink}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#047857', fontWeight: 800 }}
                              >
                                View Post ↗
                              </a>
                            )}
                          </div>
                        )}

                        <div style={{ marginTop: 'auto' }}>
                          <button
                            type="button"
                            onClick={() => handleApprove(share)}
                            disabled={isApproving || !account}
                            style={{
                              width: '100%',
                              background: !account ? '#94a3b8' : liBlue,
                              color: '#fff',
                              border: 'none',
                              padding: '10px',
                              borderRadius: '8px',
                              fontWeight: 800,
                              fontSize: '12.5px',
                              cursor: !account ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                            }}
                          >
                            {isApproving
                              ? 'Publishing to LinkedIn...'
                              : `Approve & Publish to ${isOrgMode ? 'Company Page' : 'LinkedIn'}`}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Recent Shares Log */}
            {recentShares.length > 0 && (
              <div style={{ marginTop: '40px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 12px 0' }}>Recent LinkedIn Publishing Audit</h3>
                <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                        <th style={{ padding: '10px 16px', fontWeight: 700 }}>Post Title / Snippet</th>
                        <th style={{ padding: '10px 16px', fontWeight: 700 }}>Status</th>
                        <th style={{ padding: '10px 16px', fontWeight: 700 }}>Published At</th>
                        <th style={{ padding: '10px 16px', fontWeight: 700 }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentShares.map((s) => (
                        <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0f172a' }}>
                            {s.post_title || s.commentary?.slice(0, 45) + '...'}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span
                              style={{
                                background: s.status === 'published' ? '#ecfdf5' : '#fef2f2',
                                color: s.status === 'published' ? '#059669' : '#dc2626',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                              }}
                            >
                              {s.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '12px' }}>
                            {s.published_at || 'Just now'}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            {s.permalink ? (
                              <a
                                href={s.permalink}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#0a66c2', fontWeight: 800, textDecoration: 'none' }}
                              >
                                View on LinkedIn ↗
                              </a>
                            ) : (
                              <span style={{ color: '#94a3b8' }}>—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Direct Post Composer */}
        {activeTab === 'composer' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '28px', alignItems: 'start' }}>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 4px 0' }}>Create Standalone LinkedIn Post</h2>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                    Write thought leadership articles, institute alerts, or career guidance directly for your LinkedIn audience.
                  </p>
                </div>
                <div
                  style={{
                    background: isOrgMode ? '#e0f2fe' : '#f1f5f9',
                    color: isOrgMode ? '#0369a1' : '#475569',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 800,
                  }}
                >
                  Posting As: {isOrgMode ? 'Company Page' : 'Personal Profile'}
                </div>
              </div>

              {/* Photo Upload Zone */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
                  ATTACH IMAGE (OPTIONAL)
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/png,image/jpeg,image/webp"
                  style={{ display: 'none' }}
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: '2px dashed #cbd5e1',
                    borderRadius: '12px',
                    padding: '24px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: '#f8fafc',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#0a66c2')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#cbd5e1')}
                >
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}><UploadCloud size={32} color="#0a66c2" /></div>
                  <div style={{ fontWeight: 800, fontSize: '13px', color: '#1e293b' }}>
                    {isUploadingImage ? 'Uploading & Optimizing WebP...' : 'Click to Upload Image from Device'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                    Automatically converted to WebP and registered via LinkedIn Digital Media Asset API
                  </div>
                </div>

                <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => setShowManualUrl(!showManualUrl)}
                    style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    {showManualUrl ? 'Hide URL input' : 'Or enter image URL directly'}
                  </button>

                  {customImage && (
                    <button
                      type="button"
                      onClick={() => setCustomImage('')}
                      style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '11px', cursor: 'pointer' }}
                    >
                      Remove Photo
                    </button>
                  )}
                </div>

                {showManualUrl && (
                  <input
                    type="text"
                    value={customImage}
                    onChange={(e) => setCustomImage(e.target.value)}
                    placeholder="https://coachingsinsikar.com/uploads/..."
                    style={{
                      width: '100%',
                      marginTop: '8px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '12px',
                    }}
                  />
                )}
              </div>

              {/* Destination Link */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
                  ARTICLE / DESTINATION LINK (OPTIONAL)
                </label>
                <input
                  type="text"
                  value={customLink}
                  onChange={(e) => setCustomLink(e.target.value)}
                  placeholder="https://coachingsinsikar.com/blog/..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '12.5px',
                  }}
                />
              </div>

              {/* Commentary */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: '#475569' }}>
                    POST COMMENTARY (MAX 3,000 CHARACTERS) *
                  </label>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: customCommentary.length > 3000 ? '#ef4444' : '#64748b' }}>
                    {customCommentary.length} / 3000
                  </span>
                </div>
                <textarea
                  rows={8}
                  value={customCommentary}
                  onChange={(e) => setCustomCommentary(e.target.value)}
                  placeholder="Write an authoritative post with key takeaways, bullet points, and hashtags for your coaching network..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '12.5px',
                    lineHeight: 1.5,
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <button
                type="button"
                onClick={handlePublishCustom}
                disabled={isPublishingCustom || !customCommentary.trim() || !account}
                style={{
                  width: '100%',
                  background: !customCommentary.trim() || !account ? '#94a3b8' : liBlue,
                  color: '#fff',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: !customCommentary.trim() || !account ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(10, 102, 194, 0.25)',
                }}
              >
                {isPublishingCustom
                  ? 'Publishing to LinkedIn...'
                  : `Publish to ${effectiveDisplayName}`}
              </button>
            </div>

            {/* Live Feed Mockup */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', marginBottom: '8px', letterSpacing: '0.5px' }}>
                LINKEDIN FEED PREVIEW
              </div>
              <div
                style={{
                  background: '#fff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                }}
              >
                {/* Header */}
                <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: isOrgMode ? '8px' : '50%',
                      background: liBlue,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '14px',
                    }}
                  >
                    isOrgMode ? <Building2 size={16} /> : 'in'
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 800, fontSize: '13px', color: '#0f172a' }}>
                        {effectiveDisplayName}
                      </span>
                      <span
                        style={{
                          background: isOrgMode ? '#e0f2fe' : '#f1f5f9',
                          color: isOrgMode ? '#0284c7' : '#64748b',
                          fontSize: '9.5px',
                          fontWeight: 800,
                          padding: '1px 5px',
                          borderRadius: '4px',
                        }}
                      >
                        {isOrgMode ? 'Company Page' : 'Member'}
                      </span>
                    </div>
                    <div style={{ fontSize: '10.5px', color: '#64748b' }}>Now • Public</div>
                  </div>
                </div>

                {/* Commentary */}
                <div style={{ padding: '0 14px 12px 14px', fontSize: '12.5px', lineHeight: 1.5, color: '#1e293b', whiteSpace: 'pre-wrap', maxHeight: '160px', overflowY: 'auto' }}>
                  {customCommentary || 'Post commentary preview will appear here with professional takeaways and hashtags...'}
                </div>

                {/* Photo Preview */}
                {customImage && (
                  <div style={{ width: '100%', height: '220px', background: '#f8fafc', overflow: 'hidden' }}>
                    <img src={customImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}

                {/* Action Toolbar */}
                <div
                  style={{
                    padding: '8px 14px',
                    display: 'flex',
                    justifyContent: 'space-around',
                    borderTop: '1px solid #f1f5f9',
                    fontSize: '12px',
                    color: '#64748b',
                    fontWeight: 700,
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><ThumbsUp size={13} /> Like</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><MessageSquare size={13} /> Comment</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Repeat size={13} /> Repost</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Send size={13} /> Send</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Company Page & Profile Management */}
        {activeTab === 'company_page' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
            {/* Card 1: Company Page Settings */}
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <Building2 size={24} color="#0a66c2" />
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 900, margin: 0 }}>LinkedIn Company Page Settings</h2>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    Manage the organization page identity used for publishing blogs & updates.
                  </div>
                </div>
              </div>

              {/* One-Click Auto-Detect from LinkedIn */}
              <div
                style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: '13px', color: '#166534', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Sparkles size={14} color="#16a34a" /> Auto-Fetch Ready</span>
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#15803d', marginTop: '2px' }}>
                    LinkedIn login karte hi aapka Company Page auto-detect ho jata hai, ya aap abhi direct fetch kar sakte hain:
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAutoFetchPages}
                  disabled={isFetchingPages || !account}
                  style={{
                    background: '#16a34a',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '12px',
                    cursor: !account ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 6px rgba(22, 163, 74, 0.25)',
                  }}
                >
                  <RefreshCw size={14} className={isFetchingPages ? 'animate-spin' : ''} />
                  <span>{isFetchingPages ? 'Detecting Pages...' : 'Auto-Fetch My Company Pages'}</span>
                </button>
              </div>

              {pageSettingsFeedback && (
                <div
                  style={{
                    padding: '10px 14px',
                    background: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    borderRadius: '8px',
                    color: '#065f46',
                    fontSize: '12px',
                    fontWeight: 700,
                    marginBottom: '16px',
                  }}
                >
                  {pageSettingsFeedback}
                </div>
              )}

              <form onSubmit={handleSavePageSettings}>
                {/* Publishing Mode selector */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>
                    PUBLISHING TARGET MODE *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setInputPostAs('organization')}
                      style={{
                        padding: '12px',
                        borderRadius: '10px',
                        border: inputPostAs === 'organization' ? '2px solid #0a66c2' : '1px solid #cbd5e1',
                        background: inputPostAs === 'organization' ? '#eff6ff' : '#fff',
                        color: inputPostAs === 'organization' ? '#1d4ed8' : '#475569',
                        fontWeight: 800,
                        fontSize: '12px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                      }}
                    >
                      <span>Company Page</span>
                      <span style={{ fontSize: '10px', fontWeight: 500, color: '#64748b' }}>(Recommended for Brand)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setInputPostAs('person')}
                      style={{
                        padding: '12px',
                        borderRadius: '10px',
                        border: inputPostAs === 'person' ? '2px solid #0a66c2' : '1px solid #cbd5e1',
                        background: inputPostAs === 'person' ? '#eff6ff' : '#fff',
                        color: inputPostAs === 'person' ? '#1d4ed8' : '#475569',
                        fontWeight: 800,
                        fontSize: '12px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                      }}
                    >
                      <span>Member Profile</span>
                      <span style={{ fontSize: '10px', fontWeight: 500, color: '#64748b' }}>(Personal Feed)</span>
                    </button>
                  </div>
                </div>

                {/* Organization ID */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 800, color: '#475569' }}>
                      ORGANIZATION ID / PAGE URL / VANITY HANDLE
                    </label>
                    {(account?.organization_id || savedOrgId) && (
                      <span style={{ background: '#ecfdf5', color: '#047857', padding: '2px 8px', borderRadius: '6px', fontSize: '10.5px', fontWeight: 800 }}>
                        ✓ Permanently Saved
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={inputOrgId}
                    onChange={(e) => setInputOrgId(e.target.value)}
                    placeholder="e.g. 12345678, coachings-in-sikar, ya poora Page URL"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      fontFamily: 'monospace',
                    }}
                  />
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                    <strong>Permanent Storage:</strong> Ek baar yahan apna ID, Page URL ya handle save kar lene ke baad ye system configuration me permanent save rahega — bar-bar enter karne ki jarurat nahi hogi!
                  </div>
                </div>

                {/* Organization Name */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
                    COMPANY / PAGE NAME
                  </label>
                  <input
                    type="text"
                    value={inputOrgName}
                    onChange={(e) => setInputOrgName(e.target.value)}
                    placeholder="Coachings in Sikar"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSavingPageSettings}
                  style={{
                    width: '100%',
                    background: liBlue,
                    color: '#fff',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  {isSavingPageSettings ? 'Saving Settings...' : 'Save LinkedIn Page Settings'}
                </button>
              </form>

              {/* Developer Verification Notice */}
              <div
                style={{
                  marginTop: '24px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px',
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '12px', color: '#0f172a', marginBottom: '4px' }}>
                  Company Page Verification Link:
                </div>
                <div style={{ fontSize: '11.5px', color: '#475569', lineHeight: 1.5, marginBottom: '10px' }}>
                  To link your Company Page (Coachings in Sikar) to your developer app, open the verification link while logged in as the Page Admin:
                </div>
                <a
                  href="https://www.linkedin.com/developers/apps/verification/68e868d0-1a74-4df8-8d19-ef9019c559ec"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#fff',
                    border: '1px solid #0a66c2',
                    color: '#0a66c2',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '11.5px',
                    fontWeight: 800,
                    textDecoration: 'none',
                  }}
                >
                  Open Page Verification URL ↗
                </a>
              </div>
            </div>

            {/* Card 2: Connected Personal Admin Account */}
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <User size={24} color="#0a66c2" />
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 900, margin: 0 }}>Connected LinkedIn Administrator</h2>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    OAuth 2.0 authorized member managing publishing permissions.
                  </div>
                </div>
              </div>

              {account ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                    {account.avatar ? (
                      <img
                        src={account.avatar}
                        alt={account.name}
                        style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #0a66c2' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '50%',
                          background: liBlue,
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '24px',
                          fontWeight: 900,
                        }}
                      >
                        in
                      </div>
                    )}
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 900, margin: '0 0 2px 0' }}>{account.name}</h3>
                      <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>{account.email || 'OpenID Email Verified'}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>
                        URN: {account.person_id}
                      </div>
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', marginBottom: '4px' }}>CONNECTION STATUS</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                      Authorized & Ready to Publish via UGC Posts API
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDisconnect}
                    style={{
                      background: '#fef2f2',
                      color: '#dc2626',
                      border: '1px solid #fecaca',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '12.5px',
                      cursor: 'pointer',
                      width: '100%',
                    }}
                  >
                    Disconnect LinkedIn Account
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}><Briefcase size={36} color="#0a66c2" /></div>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 6px 0' }}>No LinkedIn Account Connected</h3>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 16px 0' }}>
                    Connect your LinkedIn member account using official OAuth 2.0 OpenID Connect.
                  </p>
                  {authUrl ? (
                    <a
                      href={authUrl}
                      style={{
                        background: liBlue,
                        color: '#fff',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        fontWeight: 800,
                        fontSize: '12.5px',
                        textDecoration: 'none',
                        display: 'inline-block',
                      }}
                    >
                      Connect with LinkedIn →
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveTab('settings')}
                      style={{
                        background: '#0f172a',
                        color: '#fff',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        fontWeight: 700,
                        fontSize: '12px',
                      }}
                    >
                      Configure Client ID in Settings →
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: App & API Settings */}
        {activeTab === 'settings' && (
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 6px 0' }}>LinkedIn App Credentials</h2>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 20px 0' }}>
                Enter your credentials from the official LinkedIn Developer Portal.
              </p>

              <form onSubmit={handleSaveCredentials}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
                    LINKEDIN CLIENT ID *
                  </label>
                  <input
                    type="text"
                    value={inputClientId}
                    onChange={(e) => setInputClientId(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                    }}
                    placeholder="e.g. 86jg1ugggbwrzn"
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
                    LINKEDIN CLIENT SECRET {hasClientSecret && '(Configured in .env)'}
                  </label>
                  <input
                    type="password"
                    value={inputClientSecret}
                    onChange={(e) => setInputClientSecret(e.target.value)}
                    placeholder={hasClientSecret ? '••••••••••••••••••••••••' : 'Enter Client Secret'}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#475569', marginBottom: '6px' }}>
                    OAUTH REDIRECT URL (ADD TO LINKEDIN APP SETTINGS)
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      readOnly
                      value={redirectUri}
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '12px',
                        background: '#f8fafc',
                        color: '#64748b',
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleCopyUri}
                      style={{
                        padding: '10px 16px',
                        background: '#f1f5f9',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      {copiedUri ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSavingCreds}
                  style={{
                    background: '#0f172a',
                    color: '#fff',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  {isSavingCreds ? 'Saving...' : 'Save Credentials'}
                </button>
              </form>
            </div>

            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px', lineHeight: 1.6, color: '#475569' }}>
              <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>LinkedIn Developer Portal Steps:</div>
              <ol style={{ paddingLeft: '18px', margin: 0 }}>
                <li>Go to <a href="https://www.linkedin.com/developers/apps" target="_blank" rel="noopener noreferrer" style={{ color: '#0a66c2', fontWeight: 700 }}>linkedin.com/developers/apps</a> and select your app.</li>
                <li>Under the <strong>Products</strong> tab, request access to:
                  <ul style={{ margin: '4px 0' }}>
                    <li><strong>Sign In with LinkedIn using OpenID Connect</strong></li>
                    <li><strong>Share on LinkedIn</strong></li>
                    <li><strong>Community Management API</strong> (for Company Pages)</li>
                  </ul>
                </li>
                <li>Under the <strong>Auth</strong> tab, add the Redirect URL shown above.</li>
                <li>Under the <strong>Settings</strong> tab, associate your LinkedIn Page (Coachings in Sikar) via Page Verification.</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
