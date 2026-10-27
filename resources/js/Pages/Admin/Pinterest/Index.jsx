import React, { useState, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Pin, Send, RefreshCw, FileCheck, PenSquare, FolderPlus, Settings, AlertTriangle, UploadCloud, Link, Key, Lock, CheckCircle2 } from 'lucide-react';

export default function PinterestHubPage({
  needsMigration = false,
  isConfigured,
  clientId,
  hasClientSecret,
  redirectUri,
  account,
  boards = [],
  defaultBoard,
  pendingApprovals = [],
  recentShares = [],
  recentPins = [],
  authUrl,
  errorMessage = null,
}) {
  const [activeTab, setActiveTab] = useState('approvals');
  const [approvingId, setApprovingId] = useState(null);
  const [editTitles, setEditTitles] = useState({});
  const [editDescriptions, setEditDescriptions] = useState({});
  const [selectedBoards, setSelectedBoards] = useState({});

  // Custom Pin state
  const [customBoardId, setCustomBoardId] = useState(defaultBoard?.id || (boards[0]?.id || ''));
  const [customTitle, setCustomTitle] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [customImage, setCustomImage] = useState('');
  const [customLink, setCustomLink] = useState('');
  const [isPublishingCustom, setIsPublishingCustom] = useState(false);
  const [publishFeedback, setPublishFeedback] = useState({});

  // Direct file upload state
  const fileInputRef = useRef(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showManualUrl, setShowManualUrl] = useState(false);

  // New Board state
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardDescription, setNewBoardDescription] = useState('');
  const [newBoardPrivacy, setNewBoardPrivacy] = useState('PUBLIC');
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);

  // Manual Access Token state
  const [manualToken, setManualToken] = useState('');
  const [isSavingManual, setIsSavingManual] = useState(false);
  const [copiedUri, setCopiedUri] = useState(false);

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
    const finalTitle = editTitles[share.id] !== undefined ? editTitles[share.id] : share.title;
    const finalDescription = editDescriptions[share.id] !== undefined ? editDescriptions[share.id] : share.description;
    const targetBoardId = selectedBoards[share.id] || share.pinterest_board_id || defaultBoard?.id;

    if (!targetBoardId) {
      alert('Please select a target Pinterest board first.');
      setApprovingId(null);
      return;
    }

    try {
      const response = await fetch('/api/admin/pinterest/approve-publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          share_id: share.id,
          pinterest_board_id: targetBoardId,
          title: finalTitle,
          description: finalDescription,
          image_url: share.image_url,
          target_link: share.target_link,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setPublishFeedback((prev) => ({
          ...prev,
          [share.id]: { success: true, pin_url: data.pin_url },
        }));
        router.reload({ only: ['pendingApprovals', 'recentShares', 'recentPins'] });
      } else {
        alert(data.message || 'Pin publishing failed');
      }
    } catch (e) {
      alert('Network or server error: ' + e.message);
    } finally {
      setApprovingId(null);
    }
  };

  const handleCustomPinSubmit = (e) => {
    e.preventDefault();
    if (!customTitle.trim() || !customImage.trim() || !customBoardId) return;

    setIsPublishingCustom(true);
    router.post(
      '/admin/pinterest/custom-pin',
      {
        pinterest_board_id: customBoardId,
        title: customTitle,
        description: customDescription,
        image_url: customImage,
        target_link: customLink,
      },
      {
        onFinish: () => {
          setIsPublishingCustom(false);
          setCustomTitle('');
          setCustomDescription('');
          setCustomImage('');
          setCustomLink('');
        },
      }
    );
  };

  const handleCreateBoardSubmit = (e) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;

    setIsCreatingBoard(true);
    router.post(
      '/admin/pinterest/boards',
      {
        name: newBoardName,
        description: newBoardDescription,
        privacy: newBoardPrivacy,
      },
      {
        onFinish: () => {
          setIsCreatingBoard(false);
          setNewBoardName('');
          setNewBoardDescription('');
        },
      }
    );
  };

  const handleManualTokenSubmit = (e) => {
    e.preventDefault();
    if (!manualToken.trim()) return;

    setIsSavingManual(true);
    router.post(
      '/admin/pinterest/credentials',
      {
        access_token: manualToken,
      },
      {
        onFinish: () => {
          setIsSavingManual(false);
          setManualToken('');
        },
      }
    );
  };

  return (
    <AdminLayout>
      <div style={{ animation: 'fadeIn 0.3s ease-out', paddingBottom: '40px' }}>
        <Head title="Pinterest Hub & Board Manager | Admin" />

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
                Pinterest Database Tables Setup Required
              </strong>
              <span style={{ fontSize: '13px' }}>
                Pinterest integration tables are not created yet in the database. Run the system upgrade to activate all features.
              </span>
            </div>
            <a
              href="/app-upgrade"
              style={{
                background: '#e60023',
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

        {/* Critical Error Alert */}
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

        {/* Header Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #e60023, #ad081b)',
            borderRadius: '16px',
            padding: '28px 32px',
            color: '#fff',
            marginBottom: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
            boxShadow: '0 10px 25px -5px rgba(230, 0, 35, 0.35)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                background: '#fff',
                color: '#e60023',
                width: '54px',
                height: '54px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                flexShrink: 0,
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.357-.053.211-.174.256-.402.151-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
              </svg>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>
                  Pinterest Hub & Board Manager
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
                Manage Pinterest boards, auto-draft SEO pin titles & descriptions, and publish visual pins via API v5.
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            {account ? (
              <>
                <button
                  onClick={() => router.post('/admin/pinterest/sync-boards')}
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
                  Re-Sync Boards
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to disconnect Pinterest?')) {
                      router.post('/admin/pinterest/disconnect');
                    }
                  }}
                  style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
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
                  color: '#e60023',
                  padding: '11px 22px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '14px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                }}
              >
                Connect with Pinterest
              </a>
            ) : null}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b-2 border-slate-200 mb-6 overflow-x-auto no-scrollbar flex-nowrap" style={{ WebkitOverflowScrolling: 'touch' }}>
          {[
            { id: 'approvals', label: 'Approvals Queue', icon: <FileCheck size={16} />, badge: pendingApprovals.length },
            { id: 'compose', label: 'Direct Pin Composer', icon: <PenSquare size={16} /> },
            { id: 'boards', label: 'Boards Manager', icon: <FolderPlus size={16} />, badge: boards.length },
            { id: 'settings', label: 'App & API Settings', icon: <Settings size={16} /> },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="whitespace-nowrap shrink-0 flex items-center gap-2 transition cursor-pointer"
                style={{
                  padding: '12px 18px',
                  fontWeight: isActive ? 700 : 600,
                  fontSize: '14px',
                  border: 'none',
                  background: 'none',
                  color: isActive ? '#e60023' : '#64748b',
                  borderBottom: isActive ? '3px solid #e60023' : '3px solid transparent',
                  marginBottom: '-2px',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  {tab.icon}
                  <span>{tab.label}</span>
                </span>
                {tab.badge > 0 && (
                  <span
                    style={{
                      background: '#e60023',
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
                  Pending Approval Pins
                </h2>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                  Auto-drafted from published blog posts. Review title, SEO description, choose board, and approve.
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
                <div style={{ fontSize: '36px', marginBottom: '12px' }}></div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', margin: '0 0 6px 0' }}>
                  No Pending Pins Waiting
                </h3>
                <p style={{ fontSize: '13px', margin: 0, maxWidth: '440px', marginInline: 'auto' }}>
                  When you publish a new blog post, a visual Pin draft will appear here for one-click approval.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {pendingApprovals.map((share) => {
                  const currentTitle = editTitles[share.id] !== undefined ? editTitles[share.id] : share.title;
                  const currentDescription = editDescriptions[share.id] !== undefined ? editDescriptions[share.id] : (share.description || '');
                  const currentBoardId = selectedBoards[share.id] || share.pinterest_board_id || defaultBoard?.id;

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
                          <div style={{ fontSize: '12px', fontWeight: 700, color: '#e60023', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                            Blog Post #{share.post_id}
                          </div>
                          <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                            {share.post?.title || share.title}
                          </h3>
                        </div>
                        <span style={{ background: '#fef3c7', color: '#92400e', fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '12px', whiteSpace: 'nowrap' }}>
                          Pending Approval
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-5">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {/* Board Selector */}
                          <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                              Target Pinterest Board:
                            </label>
                            <select
                              value={currentBoardId || ''}
                              onChange={(e) => setSelectedBoards({ ...selectedBoards, [share.id]: e.target.value })}
                              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff' }}
                            >
                              <option value="">Select a Board...</option>
                              {boards.map((b) => (
                                <option key={b.id} value={b.id}>
                                  {b.name} {b.is_default ? '⭐ (Default)' : ''}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Pin Title */}
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                                Pin Title:
                              </label>
                              <span style={{ fontSize: '11px', color: currentTitle.length > 100 ? '#ef4444' : '#64748b' }}>
                                {currentTitle.length} / 100
                              </span>
                            </div>
                            <input
                              type="text"
                              value={currentTitle}
                              maxLength={100}
                              onChange={(e) => setEditTitles({ ...editTitles, [share.id]: e.target.value })}
                              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                            />
                          </div>

                          {/* Pin Description */}
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                                Pin Description & Keywords:
                              </label>
                              <span style={{ fontSize: '11px', color: currentDescription.length > 500 ? '#ef4444' : '#64748b' }}>
                                {currentDescription.length} / 500
                              </span>
                            </div>
                            <textarea
                              rows={4}
                              value={currentDescription}
                              maxLength={500}
                              onChange={(e) => setEditDescriptions({ ...editDescriptions, [share.id]: e.target.value })}
                              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', lineHeight: 1.5, boxSizing: 'border-box' }}
                            />
                          </div>
                        </div>

                        {/* Image Preview */}
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                            Pin Graphic Preview:
                          </label>
                          <img
                            src={share.image_url}
                            alt="Pin Preview"
                            style={{
                              width: '100%',
                              height: '240px',
                              objectFit: 'cover',
                              borderRadius: '12px',
                              border: '1px solid #e2e8f0',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            }}
                          />
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          Target Link: <strong>{share.target_link}</strong>
                        </div>
                        <button
                          type="button"
                          disabled={approvingId === share.id}
                          onClick={() => handleApprove(share)}
                          style={{
                            background: '#e60023',
                            color: '#fff',
                            border: 'none',
                            padding: '10px 22px',
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: '13px',
                            cursor: 'pointer',
                          }}
                        >
                          {approvingId === share.id ? 'Pinning to Board...' : 'Approve & Pin to Pinterest'}
                        </button>
                      </div>

                      {publishFeedback[share.id]?.pin_url && (
                        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '10px 14px', borderRadius: '8px', fontSize: '13px' }}>
                           Pin created!{' '}
                          <a href={publishFeedback[share.id].pin_url} target="_blank" rel="noreferrer" style={{ fontWeight: 700, color: '#047857' }}>
                            View on Pinterest →
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

        {/* TAB 2: DIRECT PIN COMPOSER */}
        {activeTab === 'compose' && (
          <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0', maxWidth: '720px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
              <PenSquare size={16} style={{ marginRight: "6px" }} /> Direct Pin Composer
            </h2>
            <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#64748b' }}>
              Create and publish a visual Pin directly from your device to any Pinterest board.
            </p>

            <form onSubmit={handleCustomPinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Target Board <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  required
                  value={customBoardId}
                  onChange={(e) => setCustomBoardId(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#fff' }}
                >
                  <option value="">Select Board...</option>
                  {boards.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} {b.is_default ? '⭐ (Default)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
                    Pin Title <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{customTitle.length} / 100</span>
                </div>
                <input
                  type="text"
                  required
                  maxLength={100}
                  placeholder="e.g. Best IIT JEE Coaching in Sikar 2027"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              {/* Photo Uploader */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
                    Pin Photo <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowManualUrl(!showManualUrl)}
                    style={{ background: 'none', border: 'none', color: '#e60023', fontSize: '12px', fontWeight: 700, cursor: 'pointer', padding: 0 }}
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
                             Pin image uploaded to /uploads/social/
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
                              background: '#fef2f2',
                              color: '#e60023',
                              border: '1px solid #fecaca',
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
                              background: '#f1f5f9',
                              color: '#475569',
                              border: '1px solid #cbd5e1',
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
                        }}
                      >
                        {isUploadingImage ? (
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#e60023' }}>
                            ⏳ Uploading and optimizing photo to /uploads/social/...
                          </div>
                        ) : (
                          <div>
                            <div style={{ display: "flex", justifyContent: "center", marginBottom: "6px" }}><Pin size={28} color="#e60023" /></div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                              Click to upload Pin photo from your device
                            </div>
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                              Recommended: 2:3 vertical (1000x1500) or square JPG/PNG/WebP
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <input
                    type="text"
                    required
                    value={customImage}
                    onChange={(e) => setCustomImage(e.target.value)}
                    placeholder="https://coachingsinsikar.com/uploads/... or https://..."
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                )}
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
                    Pin Description & Search Keywords
                  </label>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{customDescription.length} / 500</span>
                </div>
                <textarea
                  rows={4}
                  maxLength={500}
                  placeholder="Explain what this pin is about, add helpful tips and high-traffic hashtags like #Sikar #JEECoaching..."
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Destination Website Link (Where users land when clicking the pin)
                </label>
                <input
                  type="url"
                  placeholder="https://coachingsinsikar.com/blog/jee-mains-guide"
                  value={customLink}
                  onChange={(e) => setCustomLink(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <button
                type="submit"
                disabled={isPublishingCustom || !customTitle.trim() || !customImage.trim() || !customBoardId}
                style={{
                  background: '#e60023',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  alignSelf: 'flex-start',
                }}
              >
                {isPublishingCustom ? 'Creating Pin on Pinterest...' : 'Create Pin'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: BOARDS MANAGER */}
        {activeTab === 'boards' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Create Board Card */}
            <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', maxWidth: '700px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '0 0 12px 0' }}>
                Create New Pinterest Board
              </h3>
              <form onSubmit={handleCreateBoardSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  type="text"
                  required
                  placeholder="Board Name (e.g. Sikar Coaching Reviews 2027)"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
                <input
                  type="text"
                  placeholder="Board Description (Optional)"
                  value={newBoardDescription}
                  onChange={(e) => setNewBoardDescription(e.target.value)}
                  style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
                <button
                  type="submit"
                  disabled={isCreatingBoard || !newBoardName.trim()}
                  style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', alignSelf: 'flex-start' }}
                >
                  {isCreatingBoard ? 'Creating Board...' : 'Create Board on Pinterest '}
                </button>
              </form>
            </div>

            {/* Boards Grid */}
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '14px' }}>
                Connected Pinterest Boards ({boards.length})
              </h3>
              {boards.length === 0 ? (
                <div style={{ background: '#fff', padding: '32px', borderRadius: '12px', textAlign: 'center', color: '#64748b', border: '1px solid #e2e8f0' }}>
                  No boards found. Click "Re-Sync Boards" or create your first board above.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '16px' }}>
                  {boards.map((b) => (
                    <div key={b.id} style={{ background: '#fff', padding: '20px', borderRadius: '14px', border: b.is_default ? '2px solid #e60023' : '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: b.privacy === 'PUBLIC' ? '#059669' : '#d97706', textTransform: 'uppercase' }}>
                            {b.privacy} BOARD
                          </span>
                          {b.is_default && (
                            <span style={{ background: '#fef2f2', color: '#e60023', fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '10px' }}>
                              DEFAULT BOARD
                            </span>
                          )}
                        </div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                          {b.name}
                        </h4>
                        {b.description && (
                          <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>
                            {b.description}
                          </p>
                        )}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: '12px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>
                          {b.pin_count} pins
                        </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {!b.is_default && (
                            <button
                              type="button"
                              onClick={() => router.post(`/admin/pinterest/default-board/${b.id}`)}
                              style={{ background: '#f1f5f9', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                            >
                              Make Default
                            </button>
                          )}
                          <a href={b.board_url} target="_blank" rel="noreferrer" style={{ fontSize: '11px', fontWeight: 700, color: '#e60023', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                            View ↗
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: APP & API SETTINGS */}
        {activeTab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
            {/* Direct Access Token */}
            <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
                Direct Access Token Connection
              </h3>
              <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#64748b' }}>
                If you generated a Pinterest User Token from developers.pinterest.com, paste it here to authenticate immediately.
              </p>

              <form onSubmit={handleManualTokenSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Pinterest Access Token <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="pina_..."
                    value={manualToken}
                    onChange={(e) => setManualToken(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSavingManual || !manualToken.trim()}
                  style={{
                    background: '#e60023',
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
                  {isSavingManual ? 'Verifying...' : 'Save & Connect Access Token '}
                </button>
              </form>
            </div>

            {/* App Credentials Info */}
            <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: '0 0 16px 0' }}>
                Pinterest Developer App Details
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Pinterest App ID (PINTEREST_APP_ID)
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
                    Pinterest App Secret
                  </label>
                  <div style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#f8fafc', color: hasClientSecret ? '#059669' : '#dc2626', fontWeight: 700 }}>
                    {hasClientSecret ? ' Configured & Encrypted' : 'Missing in .env'}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    OAuth 2.0 Redirect URI (Paste in Pinterest Developer Portal App Settings)
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
                      style={{ background: '#e60023', color: '#fff', border: 'none', padding: '0 16px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
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
