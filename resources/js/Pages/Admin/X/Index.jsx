import React, { useState, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function XHubPage({
  needsMigration = false,
  isConfigured,
  clientId,
  hasClientSecret,
  consumerKey,
  hasConsumerSecret,
  redirectUri,
  account,
  pendingApprovals = [],
  recentShares = [],
  recentTweets = [],
  authUrl,
  errorMessage = null,
}) {
  const [activeTab, setActiveTab] = useState('approvals');
  const [approvingId, setApprovingId] = useState(null);
  const [editText, setEditText] = useState({});
  const [customText, setCustomText] = useState('');
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

  // Manual Access Token state
  const [manualToken, setManualToken] = useState('');
  const [manualSecret, setManualSecret] = useState('');
  const [manualUsername, setManualUsername] = useState('');
  const [isSavingManual, setIsSavingManual] = useState(false);

  const handleCopyUri = () => {
    navigator.clipboard.writeText(redirectUri);
    setCopiedUri(true);
    setTimeout(() => setCopiedUri(false), 2000);
  };

  const handleApprove = async (share) => {
    setApprovingId(share.id);
    const finalText = editText[share.id] !== undefined ? editText[share.id] : share.text;

    try {
      const response = await fetch('/api/admin/x/approve-publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          share_id: share.id,
          text: finalText,
          media_url: share.media_url,
          target_link: share.target_link,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setPublishFeedback((prev) => ({
          ...prev,
          [share.id]: { success: true, permalink: data.permalink },
        }));
        router.reload({ only: ['pendingApprovals', 'recentShares', 'recentTweets'] });
      } else {
        alert(data.message || 'Publishing to X failed');
      }
    } catch (e) {
      alert('Network or server error: ' + e.message);
    } finally {
      setApprovingId(null);
    }
  };

  const handleCustomTweetSubmit = (e) => {
    e.preventDefault();
    if (!customText.trim() || customText.length > 280) return;

    setIsPublishingCustom(true);
    router.post(
      '/admin/x/custom-tweet',
      {
        text: customText,
        image_url: customImage,
        target_link: customLink,
      },
      {
        onFinish: () => {
          setIsPublishingCustom(false);
          setCustomText('');
          setCustomImage('');
          setCustomLink('');
        },
      }
    );
  };

  const handleManualTokenSubmit = (e) => {
    e.preventDefault();
    if (!manualToken.trim()) return;

    setIsSavingManual(true);
    router.post(
      '/admin/x/credentials',
      {
        access_token: manualToken,
        access_token_secret: manualSecret,
        username: manualUsername,
      },
      {
        onFinish: () => {
          setIsSavingManual(false);
          setManualToken('');
          setManualSecret('');
        },
      }
    );
  };

  return (
    <AdminLayout>
      <div style={{ animation: 'fadeIn 0.3s ease-out', paddingBottom: '40px' }}>
        <Head title="X (Twitter) Hub & Profile Manager | Admin" />

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
                ⚠️ X (Twitter) Database Tables Setup Required
              </strong>
              <span style={{ fontSize: '13px' }}>
                X integration tables are not created yet in the database. Run the system database upgrade once to activate all features.
              </span>
            </div>
            <a
              href="/app-upgrade"
              style={{
                background: '#000',
                color: '#fff',
                padding: '9px 18px',
                borderRadius: '8px',
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: '13px',
                whiteSpace: 'nowrap',
              }}
            >
              Run Database Upgrade 🚀
            </a>
          </div>
        )}

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
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Header Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #09090b, #18181b)',
            border: '1px solid #27272a',
            borderRadius: '16px',
            padding: '28px 32px',
            color: '#fff',
            marginBottom: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                background: '#000',
                border: '1px solid #3f3f46',
                color: '#fff',
                width: '54px',
                height: '54px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                flexShrink: 0,
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>
                  X (Twitter) Hub & Profile Manager
                </h1>
                {account ? (
                  <span style={{ background: '#10b981', color: '#fff', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '12px' }}>
                    CONNECTED
                  </span>
                ) : (
                  <span style={{ background: '#3f3f46', color: '#d4d4d8', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '12px' }}>
                    NOT CONNECTED
                  </span>
                )}
              </div>
              <p style={{ margin: '4px 0 0 0', opacity: 0.85, fontSize: '14px' }}>
                Manage @{account?.username || 'profile'}, review 280-char blog drafts, and approve direct photo tweets to X via API v2.
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            {account ? (
              <>
                <button
                  onClick={() => router.post('/admin/x/sync-profile')}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
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
                  🔄 Re-Sync Profile
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to disconnect X account?')) {
                      router.post('/admin/x/disconnect');
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
                  color: '#000',
                  padding: '11px 22px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '14px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(255,255,255,0.2)',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Connect with 𝕏
              </a>
            ) : null}
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #e2e8f0', marginBottom: '24px' }}>
          {[
            { id: 'approvals', label: '📋 Approvals Queue', badge: pendingApprovals.length },
            { id: 'compose', label: '✍️ Quick Tweet Composer' },
            { id: 'feed', label: '📊 Profile & Live Tweets' },
            { id: 'settings', label: '⚙️ 𝕏 App & API Keys' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '12px 18px',
                  fontWeight: isActive ? 700 : 600,
                  fontSize: '14px',
                  border: 'none',
                  background: 'none',
                  color: isActive ? '#000' : '#64748b',
                  borderBottom: isActive ? '3px solid #000' : '3px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '-2px',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{tab.label}</span>
                {tab.badge > 0 && (
                  <span
                    style={{
                      background: '#ef4444',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '2px 7px',
                      borderRadius: '10px',
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: APPROVALS QUEUE */}
        {activeTab === 'approvals' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Pending Approval Blog Tweets
                </h2>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                  Auto-drafted from published blog posts. Review, edit caption, and approve for instant posting to X.
                </p>
              </div>
            </div>

            {pendingApprovals.length === 0 ? (
              <div
                style={{
                  background: '#fff',
                  border: '1px dashed #cbd5e1',
                  borderRadius: '14px',
                  padding: '48px 24px',
                  textAlign: 'center',
                  color: '#64748b',
                }}
              >
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>🎉</div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', margin: '0 0 6px 0' }}>
                  No Pending Tweets Waiting
                </h3>
                <p style={{ fontSize: '13px', margin: 0, maxWidth: '440px', marginInline: 'auto' }}>
                  When you create or publish a blog post, a smart 280-character draft will automatically appear here for review.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {pendingApprovals.map((share) => {
                  const currentText = editText[share.id] !== undefined ? editText[share.id] : share.text;
                  const charCount = currentText.length;
                  const isOverLimit = charCount > 280;

                  return (
                    <div
                      key={share.id}
                      style={{
                        background: '#fff',
                        borderRadius: '16px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                            Blog Post #{share.post_id}
                          </div>
                          <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                            {share.post?.title || 'Standalone Tweet Draft'}
                          </h3>
                        </div>
                        <span style={{ background: '#fef3c7', color: '#92400e', fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '12px', whiteSpace: 'nowrap' }}>
                          Pending Approval
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: share.media_url ? '1fr 220px' : '1fr', gap: '20px' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
                              Tweet Text (Edit before posting):
                            </label>
                            {/* Live 280-char Counter */}
                            <span
                              style={{
                                fontSize: '12px',
                                fontWeight: 800,
                                padding: '2px 8px',
                                borderRadius: '8px',
                                background: isOverLimit ? '#fee2e2' : (charCount > 250 ? '#fef3c7' : '#f1f5f9'),
                                color: isOverLimit ? '#dc2626' : (charCount > 250 ? '#d97706' : '#475569'),
                              }}
                            >
                              {charCount} / 280
                            </span>
                          </div>
                          <textarea
                            rows={5}
                            value={currentText}
                            onChange={(e) => setEditText({ ...editText, [share.id]: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '12px',
                              borderRadius: '10px',
                              border: isOverLimit ? '2px solid #ef4444' : '1px solid #cbd5e1',
                              fontSize: '14px',
                              lineHeight: 1.5,
                              fontFamily: 'inherit',
                              outline: 'none',
                              boxSizing: 'border-box',
                            }}
                          />
                          {isOverLimit && (
                            <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px', fontWeight: 600 }}>
                              ⚠️ Tweet exceeds 280 character limit by {charCount - 280} characters. Shorten text before approving.
                            </div>
                          )}
                        </div>

                        {share.media_url && (
                          <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                              Cover Image Preview:
                            </label>
                            <img
                              src={share.media_url}
                              alt="Post Preview"
                              style={{
                                width: '100%',
                                height: '140px',
                                objectFit: 'cover',
                                borderRadius: '10px',
                                border: '1px solid #e2e8f0',
                              }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Action Bar */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          Target: <strong>@{account?.username || 'x_account'}</strong>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button
                            type="button"
                            disabled={approvingId === share.id || isOverLimit}
                            onClick={() => handleApprove(share)}
                            style={{
                              background: isOverLimit ? '#94a3b8' : '#000',
                              color: '#fff',
                              border: 'none',
                              padding: '10px 20px',
                              borderRadius: '8px',
                              fontWeight: 700,
                              fontSize: '13px',
                              cursor: isOverLimit ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            {approvingId === share.id ? 'Publishing...' : 'Approve & Post to 𝕏 🚀'}
                          </button>
                        </div>
                      </div>

                      {publishFeedback[share.id]?.permalink && (
                        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '10px 14px', borderRadius: '8px', fontSize: '13px' }}>
                          ✓ Tweet published!{' '}
                          <a href={publishFeedback[share.id].permalink} target="_blank" rel="noreferrer" style={{ fontWeight: 700, color: '#047857' }}>
                            View on X →
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: QUICK COMPOSER */}
        {activeTab === 'compose' && (
          <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0', maxWidth: '700px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
              ✍️ Compose Standalone Tweet
            </h2>
            <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#64748b' }}>
              Create and publish an instant post to your X account (@{account?.username || 'not connected'}).
            </p>

            <form onSubmit={handleCustomTweetSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
                    Tweet Text <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 800,
                      color: customText.length > 280 ? '#dc2626' : (customText.length > 250 ? '#d97706' : '#64748b'),
                    }}
                  >
                    {customText.length} / 280
                  </span>
                </div>
                <textarea
                  rows={4}
                  required
                  placeholder="What's happening in Sikar? #Sikar #Education..."
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: customText.length > 280 ? '2px solid #ef4444' : '1px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
                    Tweet Photo (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowManualUrl(!showManualUrl)}
                    style={{ background: 'none', border: 'none', color: '#000', fontSize: '12px', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                  >
                    {showManualUrl ? '📁 Upload File Instead' : '🔗 Or Paste Image URL'}
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
                            ✓ Photo uploaded to /uploads/social/
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
                              background: '#f4f4f5',
                              color: '#000',
                              border: '1px solid #d4d4d8',
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
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#000' }}>
                            ⏳ Uploading and optimizing photo to /uploads/social/...
                          </div>
                        ) : (
                          <div>
                            <div style={{ fontSize: '28px', marginBottom: '6px' }}>📸</div>
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
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Optional Target Link
                </label>
                <input
                  type="url"
                  placeholder="https://coachingsinsikar.com/news/article"
                  value={customLink}
                  onChange={(e) => setCustomLink(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <button
                type="submit"
                disabled={isPublishingCustom || !customText.trim() || customText.length > 280}
                style={{
                  background: customText.length > 280 ? '#94a3b8' : '#000',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: customText.length > 280 ? 'not-allowed' : 'pointer',
                  alignSelf: 'flex-start',
                }}
              >
                {isPublishingCustom ? 'Publishing to 𝕏...' : 'Publish Tweet 🚀'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: LIVE PROFILE & METRICS */}
        {activeTab === 'feed' && (
          <div>
            {account ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Stats Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Followers</div>
                    <div style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a', marginTop: '4px' }}>
                      {account.followers_count?.toLocaleString() || 0}
                    </div>
                  </div>
                  <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Following</div>
                    <div style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a', marginTop: '4px' }}>
                      {account.following_count?.toLocaleString() || 0}
                    </div>
                  </div>
                  <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Tweets</div>
                    <div style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a', marginTop: '4px' }}>
                      {account.tweet_count?.toLocaleString() || 0}
                    </div>
                  </div>
                </div>

                {/* Profile Details Card */}
                <div style={{ background: '#fff', padding: '24px', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', gap: '20px', alignItems: 'center' }}>
                  {account.avatar && (
                    <img src={account.avatar} alt={account.name} style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid #000' }} />
                  )}
                  <div>
                    <h3 style={{ margin: '0 0 2px 0', fontSize: '18px', fontWeight: 800 }}>{account.name}</h3>
                    <div style={{ color: '#64748b', fontSize: '13px', fontWeight: 600 }}>@{account.username}</div>
                    {account.bio && <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#334155' }}>{account.bio}</p>}
                    <a href={account.x_url} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '8px', fontSize: '12px', fontWeight: 700, color: '#0284c7' }}>
                      Open Profile on X →
                    </a>
                  </div>
                </div>

                {/* Recent Tweets Grid */}
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '14px' }}>
                    Recent Published Tweets
                  </h3>
                  {recentTweets.length === 0 ? (
                    <div style={{ background: '#fff', padding: '32px', borderRadius: '12px', textAlign: 'center', color: '#64748b', border: '1px solid #e2e8f0' }}>
                      No recent tweets fetched or account timeline is empty.
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                      {recentTweets.map((t) => (
                        <div key={t.id} style={{ background: '#fff', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <p style={{ margin: '0 0 12px 0', fontSize: '13px', lineHeight: 1.5, color: '#1e293b' }}>{t.text}</p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                            <span>❤️ {t.likes} | 🔁 {t.retweets}</span>
                            <a href={t.permalink} target="_blank" rel="noreferrer" style={{ color: '#0284c7', fontWeight: 700 }}>
                              View on X →
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ background: '#fff', padding: '48px', borderRadius: '14px', textAlign: 'center', color: '#64748b', border: '1px solid #e2e8f0' }}>
                Connect an X account to see profile statistics and recent tweets.
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SETTINGS & DIRECT ACCESS TOKEN */}
        {activeTab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
            {/* Direct Access Token Form */}
            <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
                🔑 Direct Access Token & Secret Connection
              </h3>
              <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#64748b' }}>
                If you already generated an Access Token with <em>Read and Write</em> permissions in your X Developer Portal, paste it here to connect immediately.
              </p>

              <form onSubmit={handleManualTokenSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Access Token <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter Access Token..."
                    value={manualToken}
                    onChange={(e) => setManualToken(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Access Token Secret (Optional for OAuth 2.0 Bearer)
                  </label>
                  <input
                    type="password"
                    placeholder="Enter Access Token Secret..."
                    value={manualSecret}
                    onChange={(e) => setManualSecret(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    X Handle / Username
                  </label>
                  <input
                    type="text"
                    placeholder="coachingsinsikar"
                    value={manualUsername}
                    onChange={(e) => setManualUsername(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSavingManual || !manualToken.trim()}
                  style={{
                    background: '#000',
                    color: '#fff',
                    border: 'none',
                    padding: '11px 22px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    alignSelf: 'flex-start',
                  }}
                >
                  {isSavingManual ? 'Verifying...' : 'Save & Connect Access Token 🔒'}
                </button>
              </form>
            </div>

            {/* App Credentials Info */}
            <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: '0 0 16px 0' }}>
                𝕏 Developer App Details
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    OAuth 2.0 Client ID (Used for "Connect with 𝕏" button)
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={clientId || '(Not set in .env)'}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#f8fafc', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    OAuth 2.0 Client Secret Status
                  </label>
                  <div style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#f8fafc', color: hasClientSecret ? '#059669' : '#dc2626', fontWeight: 700 }}>
                    {hasClientSecret ? '✓ Configured & Encrypted' : '⚠️ Missing in .env'}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Consumer Key (API Key for OAuth 1.0a)
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={consumerKey || '(Not set in .env)'}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#f8fafc', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Consumer Secret Key
                  </label>
                  <div style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#f8fafc', color: hasConsumerSecret ? '#059669' : '#dc2626', fontWeight: 700 }}>
                    {hasConsumerSecret ? '✓ Configured & Encrypted' : '⚠️ Missing in .env'}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    OAuth 2.0 Redirect URI (Paste in developer.twitter.com User Authentication Settings)
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      readOnly
                      value={redirectUri}
                      style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#f8fafc', boxSizing: 'border-box' }}
                    />
                    <button
                      type="button"
                      onClick={handleCopyUri}
                      style={{ background: '#000', color: '#fff', border: 'none', padding: '0 16px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                    >
                      {copiedUri ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
