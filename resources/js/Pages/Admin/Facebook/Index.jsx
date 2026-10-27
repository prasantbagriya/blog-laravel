import React, { useState, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Share2, FileCheck, PenSquare, FileText, Settings, AlertTriangle, UploadCloud, ThumbsUp, MessageSquare, Globe, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function FacebookHubPage({
  needsMigration = false,
  isConfigured,
  clientId,
  hasClientSecret,
  redirectUri,
  account,
  pages = [],
  defaultPage,
  pendingApprovals = [],
  recentShares = [],
  recentFeed = [],
  insights = { impressions: 0, engagements: 0, views: 0 },
  authUrl,
  errorMessage = null,
}) {
  const [activeTab, setActiveTab] = useState('pages');
  const [approvingId, setApprovingId] = useState(null);
  const [editCaptions, setEditCaptions] = useState({});
  const [selectedPages, setSelectedPages] = useState({});
  const [customPageId, setCustomPageId] = useState(defaultPage?.id || (pages[0]?.id || ''));
  const [customCaption, setCustomCaption] = useState('');
  const [customImage, setCustomImage] = useState('');
  const [customLink, setCustomLink] = useState('');
  const [isPublishingCustom, setIsPublishingCustom] = useState(false);
  const [publishFeedback, setPublishFeedback] = useState({});
  const [copiedUri, setCopiedUri] = useState(false);

  const fileInputRef = useRef(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showManualUrl, setShowManualUrl] = useState(false);

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

  const handleCopyUri = () => {
    navigator.clipboard.writeText(redirectUri);
    setCopiedUri(true);
    setTimeout(() => setCopiedUri(false), 2000);
  };

  const handleApprove = async (share) => {
    setApprovingId(share.id);
    const targetPageId = selectedPages[share.id] || share.facebook_page_id || defaultPage?.id;
    const finalCaption = editCaptions[share.id] !== undefined ? editCaptions[share.id] : share.caption;

    try {
      const response = await fetch('/api/admin/facebook/approve-publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          share_id: share.id,
          post_id: share.post_id,
          facebook_page_id: targetPageId,
          caption: finalCaption,
          image_url: share.image_url,
          target_link: share.target_link,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setPublishFeedback((prev) => ({
          ...prev,
          [share.id]: { success: true, permalink: data.permalink },
        }));
        router.reload({ only: ['pendingApprovals', 'recentShares', 'recentFeed'] });
      } else {
        alert(data.message || 'Publishing failed');
      }
    } catch (e) {
      alert('Network or server error: ' + e.message);
    } finally {
      setApprovingId(null);
    }
  };

  const handleCustomPostSubmit = (e) => {
    e.preventDefault();
    if (!customCaption.trim()) return;

    setIsPublishingCustom(true);
    router.post(
      '/admin/facebook/custom-post',
      {
        facebook_page_id: customPageId,
        caption: customCaption,
        image_url: customImage,
        link: customLink,
      },
      {
        onFinish: () => {
          setIsPublishingCustom(false);
          setCustomCaption('');
          setCustomImage('');
          setCustomLink('');
        },
      }
    );
  };

  return (
    <AdminLayout>
      <div style={{ animation: 'fadeIn 0.3s ease-out', paddingBottom: '40px' }}>
        <Head title="Facebook Hub & Page Manager | Admin" />

        {/* Critical Error Alert if any */}
        {errorMessage && (
          <div
            style={{
              background: '#fee2e2',
              border: '1px solid #fca5a5',
              color: '#991b1b',
              padding: '14px 20px',
              borderRadius: '12px',
              marginBottom: '20px',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* Needs Migration Alert */}
        {needsMigration && (
          <div
            style={{
              background: '#fef3c7',
              border: '1px solid #fde68a',
              color: '#92400e',
              padding: '16px 20px',
              borderRadius: '12px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            }}
          >
            <div>
              <strong style={{ fontSize: '14px', display: 'block', marginBottom: '2px' }}>
                Facebook Database Tables Setup Required
              </strong>
              <span style={{ fontSize: '13px' }}>
                Facebook integration tables are not created yet in the database. Run the system database upgrade once to activate all features.
              </span>
            </div>
            <a
              href="/app-upgrade"
              style={{
                background: '#2563eb',
                color: '#fff',
                padding: '9px 18px',
                borderRadius: '8px',
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: '13px',
                whiteSpace: 'nowrap',
              }}
            >
              Run Database Upgrade
            </a>
          </div>
        )}

        {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1877f2, #0d5cb6)',
          borderRadius: '16px',
          padding: '28px 32px',
          color: '#fff',
          marginBottom: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          boxShadow: '0 10px 25px -5px rgba(24, 119, 242, 0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              background: '#fff',
              color: '#1877f2',
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              flexShrink: 0,
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>
                Facebook Hub & Page Manager
              </h1>
              {account ? (
                <span style={{ background: '#10b981', color: '#fff', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '12px' }}>
                  CONNECTED
                </span>
              ) : (
                <span style={{ background: 'rgba(255,255,255,0.25)', color: '#fff', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '12px' }}>
                  NOT CONNECTED
                </span>
              )}
            </div>
            <p style={{ margin: '4px 0 0 0', opacity: 0.9, fontSize: '14px' }}>
              Manage Facebook Pages, auto-draft blog captions, and approve instant photo publishing via Meta Graph API.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          {account ? (
            <>
              <button
                onClick={() => router.post('/admin/facebook/sync-pages')}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.4)',
                  color: '#fff',
                  padding: '9px 16px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                Re-Sync Pages
              </button>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to disconnect Facebook? This will remove synced pages.')) {
                    router.post('/admin/facebook/disconnect');
                  }
                }}
                style={{
                  background: 'rgba(239, 68, 68, 0.25)',
                  border: '1px solid rgba(239, 68, 68, 0.5)',
                  color: '#fff',
                  padding: '9px 16px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Disconnect
              </button>
            </>
          ) : authUrl ? (
            <a
              href={authUrl}
              style={{
                background: '#fff',
                color: '#1877f2',
                padding: '11px 22px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '14px',
                textDecoration: 'none',
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              Connect Facebook Account →
            </a>
          ) : (
            <button
              onClick={() => setActiveTab('settings')}
              style={{
                background: '#fff',
                color: '#1877f2',
                padding: '11px 22px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Setup App Credentials
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { key: 'pages', label: `Connected Pages (${pages.length})` },
          { key: 'approvals', label: `Pending Approvals (${pendingApprovals.length})` },
          { key: 'feed', label: 'Live Page Feed & Insights' },
          { key: 'custom', label: 'Quick Direct Post' },
          { key: 'settings', label: 'Meta App Setup' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '10px 18px',
              fontWeight: activeTab === tab.key ? 800 : 600,
              fontSize: '14px',
              color: activeTab === tab.key ? '#1877f2' : '#64748b',
              background: activeTab === tab.key ? '#eff6ff' : 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.key ? '3px solid #1877f2' : '3px solid transparent',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: CONNECTED PAGES */}
      {activeTab === 'pages' && (
        <div>
          {pages.length === 0 ? (
            <div style={{ background: '#fff', border: '1px dashed #cbd5e1', borderRadius: '16px', padding: '48px', textAlign: 'center' }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}><FileText size={40} color="#1877f2" /></div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', color: '#0f172a' }}>No Facebook Pages Connected Yet</h3>
              <p style={{ color: '#64748b', maxWidth: '480px', margin: '0 auto 20px auto', fontSize: '14px' }}>
                Connect your personal Facebook profile that manages your official Facebook Pages (e.g. Coachings in Sikar) to start auto-publishing.
              </p>
              {authUrl && (
                <a
                  href={authUrl}
                  style={{
                    background: '#1877f2',
                    color: '#fff',
                    padding: '11px 24px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-block',
                  }}
                >
                  Connect Facebook Account →
                </a>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '20px' }}>
              {pages.map((page) => (
                <div
                  key={page.id}
                  style={{
                    background: '#fff',
                    border: page.is_default ? '2px solid #1877f2' : '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '20px',
                    position: 'relative',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  {page.is_default && (
                    <span
                      style={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        background: '#eff6ff',
                        color: '#1877f2',
                        border: '1px solid #bfdbfe',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 800,
                      }}
                    >
                       Primary Default
                    </span>
                  )}

                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <img
                      src={page.picture_url || 'https://graph.facebook.com/v20.0/' + page.page_id + '/picture?type=large'}
                      alt={page.name}
                      style={{ width: '56px', height: '56px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #e2e8f0', background: '#f8fafc' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ margin: '0 0 2px 0', fontSize: '16px', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {page.name}
                      </h3>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{page.category || 'Education Page'}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>ID: {page.page_id}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', fontSize: '13px' }}>
                    <div>
                      <span style={{ color: '#64748b' }}>Followers: </span>
                      <strong style={{ color: '#0f172a' }}>{page.followers_count.toLocaleString()}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Page Likes: </span>
                      <strong style={{ color: '#0f172a' }}>{page.fan_count.toLocaleString()}</strong>
                    </div>
                  </div>

                  <div style={{ marginTop: 'auto', display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                    {!page.is_default && (
                      <button
                        onClick={() => router.post(`/admin/facebook/default-page/${page.id}`)}
                        style={{
                          flex: 1,
                          background: '#eff6ff',
                          color: '#1877f2',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        Set as Default
                      </button>
                    )}
                    <a
                      href={page.facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '8px 12px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        color: '#475569',
                        borderRadius: '8px',
                        fontWeight: 600,
                        fontSize: '12px',
                        textDecoration: 'none',
                      }}
                    >
                      Visit Page ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PENDING APPROVALS QUEUE */}
      {activeTab === 'approvals' && (
        <div>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 4px 0', color: '#0f172a' }}>
              Blog Posts Pending Facebook Approval
            </h2>
            <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
              Review the cover image and generated caption before approving. Once approved, it will be published immediately to your Facebook Page.
            </p>
          </div>

          {pendingApprovals.length === 0 ? (
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '40px', textAlign: 'center', color: '#64748b' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}></div>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>All Caught Up!</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
                There are no pending posts awaiting Facebook publication. New posts published from the blog editor will appear here automatically.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {pendingApprovals.map((share) => {
                const currentCaption = editCaptions[share.id] !== undefined ? editCaptions[share.id] : share.caption;
                const feedback = publishFeedback[share.id];

                return (
                  <div
                    key={share.id}
                    style={{
                      background: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.03)',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
                      gap: '0',
                    }}
                  >
                    {/* Left Column: Interactive Facebook Preview Mockup */}
                    <div style={{ background: '#f0f2f5', padding: '20px', borderRight: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '12px' }}>
                        Live Facebook Mockup Preview
                      </div>
                      <div
                        style={{
                          background: '#fff',
                          borderRadius: '12px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          overflow: 'hidden',
                        }}
                      >
                        {/* Mock FB Header */}
                        <div style={{ padding: '12px 14px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <img
                            src={defaultPage?.picture_url || 'https://via.placeholder.com/40'}
                            alt="Page"
                            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '14px', color: '#050505' }}>
                              {defaultPage?.name || 'CoachingsinSikar'}
                            </div>
                            <div style={{ fontSize: '12px', color: '#65676b' }}>Just now •  Public</div>
                          </div>
                        </div>

                        {/* Mock FB Caption */}
                        <div
                          style={{
                            padding: '0 14px 12px 14px',
                            fontSize: '13px',
                            color: '#050505',
                            lineHeight: 1.5,
                            whiteSpace: 'pre-wrap',
                            maxHeight: '180px',
                            overflowY: 'auto',
                          }}
                        >
                          {currentCaption}
                        </div>

                        {/* Mock FB Photo */}
                        {share.image_url && (
                          <div style={{ background: '#000', maxHeight: '240px', overflow: 'hidden' }}>
                            <img
                              src={share.image_url}
                              alt="Cover"
                              style={{ width: '100%', height: 'auto', maxHeight: '240px', objectFit: 'cover', display: 'block' }}
                            />
                          </div>
                        )}

                        {/* Mock FB Footer */}
                        <div
                          style={{
                            padding: '10px 14px',
                            borderTop: '1px solid #e4e6eb',
                            display: 'flex',
                            justifyContent: 'space-around',
                            color: '#65676b',
                            fontSize: '12px',
                            fontWeight: 600,
                          }}
                        >
                          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><ThumbsUp size={14} /> Like</span>
                          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><MessageSquare size={14} /> Comment</span>
                          <span>↗ Share</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Edit & Approval Controls */}
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <span style={{ background: '#fef3c7', color: '#92400e', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '6px' }}>
                            Awaiting Admin Approval
                          </span>
                          <h3 style={{ margin: '8px 0 0 0', fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                            {share.post?.title || 'Blog Post Announcement'}
                          </h3>
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                          Target Facebook Page:
                        </label>
                        <select
                          value={selectedPages[share.id] || share.facebook_page_id || defaultPage?.id}
                          onChange={(e) => setSelectedPages({ ...selectedPages, [share.id]: e.target.value })}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff' }}
                        >
                          {pages.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.followers_count} followers)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                          Edit Caption / Hashtags:
                        </label>
                        <textarea
                          rows={6}
                          value={currentCaption}
                          onChange={(e) => setEditCaptions({ ...editCaptions, [share.id]: e.target.value })}
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', lineHeight: 1.5, resize: 'vertical' }}
                        />
                      </div>

                      {feedback?.success && (
                        <div style={{ padding: '10px 14px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', color: '#065f46', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span> Published to Facebook!</span>
                          <a href={feedback.permalink} target="_blank" rel="noopener noreferrer" style={{ color: '#047857', fontWeight: 700 }}>
                            View Post on Facebook ↗
                          </a>
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                        <button
                          onClick={() => handleApprove(share)}
                          disabled={approvingId === share.id || feedback?.success}
                          style={{
                            flex: 1,
                            background: feedback?.success ? '#10b981' : '#1877f2',
                            color: '#fff',
                            border: 'none',
                            padding: '11px 20px',
                            borderRadius: '10px',
                            fontWeight: 700,
                            fontSize: '14px',
                            cursor: 'pointer',
                            opacity: approvingId === share.id ? 0.7 : 1,
                          }}
                        >
                          {approvingId === share.id ? 'Publishing to Meta...' : feedback?.success ? ' Published!' : 'Approve & Publish to Facebook'}
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
            <div style={{ marginTop: '36px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 12px 0' }}>Recent Facebook Publishing Audit</h3>
              <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <tr>
                      <th style={{ padding: '12px 16px', color: '#64748b' }}>Post Title</th>
                      <th style={{ padding: '12px 16px', color: '#64748b' }}>Target Page</th>
                      <th style={{ padding: '12px 16px', color: '#64748b' }}>Status</th>
                      <th style={{ padding: '12px 16px', color: '#64748b' }}>Date</th>
                      <th style={{ padding: '12px 16px', color: '#64748b', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentShares.map((s) => (
                      <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0f172a' }}>
                          {s.post?.title || s.caption?.slice(0, 40) + '...'}
                        </td>
                        <td style={{ padding: '12px 16px', color: '#475569' }}>{s.page?.name}</td>
                        <td style={{ padding: '12px 16px' }}>
                          {s.status === 'published' ? (
                            <span style={{ color: '#059669', fontWeight: 700 }}> Published</span>
                          ) : (
                            <span style={{ color: '#dc2626', fontWeight: 700 }}>Failed</span>
                          )}
                        </td>
                        <td style={{ padding: '12px 16px', color: '#64748b' }}>
                          {s.published_at ? new Date(s.published_at).toLocaleString() : '-'}
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          {s.fb_permalink && (
                            <a href={s.fb_permalink} target="_blank" rel="noopener noreferrer" style={{ color: '#1877f2', fontWeight: 600, textDecoration: 'none' }}>
                              View on FB ↗
                            </a>
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

      {/* TAB 3: LIVE FEED & INSIGHTS */}
      {activeTab === 'feed' && (
        <div>
          {/* Insights Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: '#fff', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
              <div style={{ color: '#64748b', fontSize: '13px', fontWeight: 600 }}>28-Day Impressions</div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#1877f2', marginTop: '4px' }}>
                {insights.impressions.toLocaleString()}
              </div>
            </div>
            <div style={{ background: '#fff', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
              <div style={{ color: '#64748b', fontSize: '13px', fontWeight: 600 }}>28-Day Engagements</div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#10b981', marginTop: '4px' }}>
                {insights.engagements.toLocaleString()}
              </div>
            </div>
            <div style={{ background: '#fff', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
              <div style={{ color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Page Views Total</div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#8b5cf6', marginTop: '4px' }}>
                {insights.views.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Recent Page Feed */}
          <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 16px 0', color: '#0f172a' }}>
            Recent Posts on {defaultPage?.name || 'Selected Page'}
          </h3>

          {recentFeed.length === 0 ? (
            <div style={{ background: '#fff', padding: '32px', borderRadius: '14px', textAlign: 'center', color: '#64748b', border: '1px solid #e2e8f0' }}>
              No recent posts found on the page or feed is loading.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {recentFeed.map((post) => (
                <div key={post.id} style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  {post.image && (
                    <img src={post.image} alt="" style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                  )}
                  <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      {post.created_time ? new Date(post.created_time).toLocaleDateString() : ''}
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: '#0f172a', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {post.message || '(Photo Post)'}
                    </p>
                    <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#64748b' }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><ThumbsUp size={12} /> {post.reactions_count} • <MessageSquare size={12} /> {post.comments_count}</span>
                      <a href={post.permalink} target="_blank" rel="noopener noreferrer" style={{ color: '#1877f2', fontWeight: 700, textDecoration: 'none' }}>
                        View ↗
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: DIRECT CUSTOM POST */}
      {activeTab === 'custom' && (
        <div style={{ maxWidth: '640px', background: '#fff', borderRadius: '16px', padding: '28px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 6px 0', color: '#0f172a' }}>
            Publish Direct Announcement to Facebook Page
          </h2>
          <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>
            Post quick updates, photo announcements, or admissions alerts to your Facebook Page directly from here.
          </p>

          <form onSubmit={handleCustomPostSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Select Target Page *
              </label>
              <select
                value={customPageId}
                onChange={(e) => setCustomPageId(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#fff' }}
              >
                {pages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.followers_count} followers)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Post Caption / Announcement *
              </label>
              <textarea
                rows={5}
                required
                value={customCaption}
                onChange={(e) => setCustomCaption(e.target.value)}
                placeholder="Write your announcement or post message with hashtags..."
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', lineHeight: 1.5 }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
                  Post Photo (Optional)
                </label>
                <button
                  type="button"
                  onClick={() => setShowManualUrl(!showManualUrl)}
                  style={{ background: 'none', border: 'none', color: '#1877f2', fontSize: '12px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                >
                  {showManualUrl ? 'Upload File Instead' : ' Or Paste Image URL'}
                </button>
              </div>

              {!showManualUrl ? (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />

                  {customImage ? (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '12px 14px',
                        background: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        borderRadius: '10px',
                      }}
                    >
                      <img
                        src={customImage}
                        alt="Uploaded preview"
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                           Photo uploaded to /uploads/social/
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', wordBreak: 'break-all' }}>
                          {customImage}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploadingImage}
                          style={{
                            background: '#eff6ff',
                            color: '#1877f2',
                            border: '1px solid #bfdbfe',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={() => setCustomImage('')}
                          style={{
                            background: '#fef2f2',
                            color: '#dc2626',
                            border: '1px solid #fecaca',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        border: '2px dashed #cbd5e1',
                        borderRadius: '12px',
                        padding: '24px 16px',
                        textAlign: 'center',
                        background: '#f8fafc',
                        cursor: isUploadingImage ? 'wait' : 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {isUploadingImage ? (
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#1877f2' }}>
                          ⏳ Uploading and optimizing photo to /uploads/social/...
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontSize: '28px', marginBottom: '6px' }}>️</div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                            Click to upload photo from your device
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                            JPG, PNG, WebP up to 10MB • Automatically saved in <code>uploads/social/</code>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <input
                  type="text"
                  value={customImage}
                  onChange={(e) => setCustomImage(e.target.value)}
                  placeholder="https://coachingsinsikar.com/uploads/... or https://..."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
                />
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Action Link (Optional)
              </label>
              <input
                type="text"
                value={customLink}
                onChange={(e) => setCustomLink(e.target.value)}
                placeholder="https://coachingsinsikar.com/..."
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
              />
            </div>

            <button
              type="submit"
              disabled={isPublishingCustom}
              style={{
                background: '#1877f2',
                color: '#fff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                opacity: isPublishingCustom ? 0.7 : 1,
              }}
            >
              {isPublishingCustom ? 'Publishing to Facebook...' : 'Publish Post Now'}
            </button>
          </form>
        </div>
      )}

      {/* TAB 5: META APP SETTINGS */}
      {activeTab === 'settings' && (
        <div style={{ maxWidth: '680px', background: '#fff', borderRadius: '16px', padding: '28px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 6px 0', color: '#0f172a' }}>
            Meta Developer Credentials & Webhook Setup
          </h2>
          <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '24px' }}>
            Configure your Meta App details from developers.facebook.com to enable Facebook Login and Page Publishing.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                Facebook App ID (FACEBOOK_CLIENT_ID)
              </label>
              <input
                type="text"
                readOnly
                value={clientId || '(Not yet set in .env)'}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#f8fafc' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                Facebook App Secret Status
              </label>
              <div style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#f8fafc', color: hasClientSecret ? '#059669' : '#dc2626', fontWeight: 700 }}>
                {hasClientSecret ? ' Configured & Encrypted' : 'Missing in .env'}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                Valid OAuth Redirect URI (Paste this in Meta App Settings)
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  readOnly
                  value={redirectUri}
                  style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#f8fafc' }}
                />
                <button
                  type="button"
                  onClick={handleCopyUri}
                  style={{ background: '#1877f2', color: '#fff', border: 'none', padding: '0 16px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                >
                  {copiedUri ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div style={{ marginTop: '16px', padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '13px', lineHeight: 1.6, color: '#475569' }}>
              <strong style={{ color: '#0f172a' }}>Quick Steps to set up your Meta App:</strong>
              <ol style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
                <li>Go to <a href="https://developers.facebook.com" target="_blank" rel="noreferrer" style={{ color: '#1877f2' }}>developers.facebook.com</a> and click <strong>Create App</strong>.</li>
                <li>Select <strong>Business</strong> as the app type.</li>
                <li>Add <strong>Facebook Login for Business</strong> and paste the Redirect URI above into <em>Valid OAuth Redirect URIs</em>.</li>
                <li>Copy your <strong>App ID</strong> and <strong>App Secret</strong> into your server's <code>.env</code> file under <code>FACEBOOK_CLIENT_ID</code> and <code>FACEBOOK_CLIENT_SECRET</code>.</li>
              </ol>
            </div>
          </div>
        </div>
      )}
      </div>
    </AdminLayout>
  );
}
