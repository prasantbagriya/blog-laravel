'use client';

import { useState, useEffect } from 'react';

interface MediaItem {
  id: string;
  name: string;
  url: string;
  sizeBytes: number;
  createdAt: number;
}

interface MediaPickerProps {
  onSelect: (url: string) => void;
  onClose: () => void;
  open?: boolean;
}

export default function MediaPicker({ onSelect, onClose, open = true }: MediaPickerProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    if (!open) return;
    fetch((typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '') + '/api/admin/media')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setMedia(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [open]);

  if (!open) return null;

  const handleUpload = async () => {
    if (!uploadFile) return;
    setUploading(true);
    setUploadError('');
    const formData = new FormData();
    formData.append('file', uploadFile);
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        headers: { 'X-CSRF-TOKEN': csrfToken },
        body: formData
      });
      let data: any = {};
      try { data = await res.json(); } catch { data = {}; }

      if (res.ok && data.success) {
        onSelect(data.url);
        setUploadFile(null);
      } else if (res.status === 419) {
        setUploadError('Session expired. Please refresh the page and try again.');
      } else if (res.status === 422) {
        setUploadError(data.message || 'Invalid file. Please upload JPG, PNG, GIF or WebP under 20MB.');
      } else if (res.status === 413) {
        setUploadError('File too large. Maximum size is 20MB.');
      } else {
        setUploadError(data.message || data.error || `Upload failed (${res.status}). Please try again.`);
      }
    } catch (err) {
      setUploadError('Network error. Please check your connection and try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleReplace = async (e: React.ChangeEvent<HTMLInputElement>, oldFilename: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!window.confirm(`Are you sure you want to replace ${oldFilename}? This will update the image everywhere it's used.`)) {
        e.target.value = '';
        return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('oldFilename', oldFilename);
    
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        headers: { 'X-CSRF-TOKEN': csrfToken },
        body: formData
      });
      
      if (res.ok) {
        // Refetch to bust cache and show new image
        const mediaRes = await fetch((typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '') + '/api/admin/media');
        const data = await mediaRes.json();
        if (Array.isArray(data)) setMedia(data);
      } else {
        alert('Failed to replace image. It might be too large or invalid format.');
      }
    } catch (err) {
      alert('Network error replacing image.');
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredMedia = media.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: '#fff', width: '100%', maxWidth: '900px', height: '80vh', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'fadeIn 0.2s ease', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
        
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>Media Library</h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>Select an existing image or upload a new one.</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: '#64748b', lineHeight: 1 }}>&times;</button>
        </div>
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <button onClick={() => setActiveTab('library')} style={{ padding: '12px 24px', fontWeight: 700, fontSize: '14px', border: 'none', borderBottom: activeTab === 'library' ? '2px solid #2563eb' : '2px solid transparent', color: activeTab === 'library' ? '#2563eb' : '#64748b', background: 'transparent', cursor: 'pointer' }}>Library</button>
          <button onClick={() => setActiveTab('upload')} style={{ padding: '12px 24px', fontWeight: 700, fontSize: '14px', border: 'none', borderBottom: activeTab === 'upload' ? '2px solid #2563eb' : '2px solid transparent', color: activeTab === 'upload' ? '#2563eb' : '#64748b', background: 'transparent', cursor: 'pointer' }}>Upload New</button>
        </div>

        {/* Controls */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
          <input 
            type="text" 
            placeholder="Search images..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', width: '300px' }}
          />
          <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
            <button 
              onClick={() => setViewMode('grid')}
              style={{ background: viewMode === 'grid' ? '#fff' : 'transparent', color: viewMode === 'grid' ? '#2563eb' : '#64748b', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', boxShadow: viewMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
            >
              Grid
            </button>
            <button 
              onClick={() => setViewMode('list')}
              style={{ background: viewMode === 'list' ? '#fff' : 'transparent', color: viewMode === 'list' ? '#2563eb' : '#64748b', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
            >
              List
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'upload' ? (
          <div style={{ flex: 1, overflowY: 'auto', padding: '32px', background: 'linear-gradient(135deg, #f0f4ff 0%, #f8fafc 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
            <div style={{ background: '#fff', borderRadius: '20px', border: '2px dashed #bfdbfe', padding: '48px 40px', width: '100%', maxWidth: '500px', textAlign: 'center', boxShadow: '0 4px 24px rgba(37,99,235,0.07)' }}>
              {/* SVG Icon */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #dbeafe, #eff6ff)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="3" stroke="#2563eb" strokeWidth="1.5"/>
                    <circle cx="8.5" cy="8.5" r="1.5" fill="#2563eb"/>
                    <path d="M3 15l5-5 4 4 3-3 6 6" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 3v9m0 0-3-3m3 3 3-3" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0"/>
                  </svg>
                </div>
              </div>
              <h3 style={{ margin: '0 0 8px', fontWeight: 800, color: '#0f172a', fontSize: '20px' }}>Upload Image</h3>
              <p style={{ margin: '0 0 28px', color: '#64748b', fontSize: '14px', lineHeight: '1.6' }}>Choose an image from your device.<br/>Supports JPG, PNG, GIF, WebP</p>

              {/* Custom File Input */}
              <label style={{ display: 'block', cursor: 'pointer', marginBottom: '16px' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => { setUploadFile(e.target.files?.[0] || null); setUploadError(''); }}
                  style={{ display: 'none' }}
                />
                <div style={{
                  padding: '14px 24px',
                  background: uploadFile ? '#eff6ff' : '#f1f5f9',
                  border: uploadFile ? '2px solid #2563eb' : '2px dashed #cbd5e1',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  transition: 'all 0.2s ease',
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={uploadFile ? '#2563eb' : '#94a3b8'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <span style={{ fontWeight: 600, fontSize: '14px', color: uploadFile ? '#2563eb' : '#64748b' }}>
                    {uploadFile ? uploadFile.name : 'Click to choose file'}
                  </span>
                  {uploadFile && (
                    <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: '4px' }}>
                      ({(uploadFile.size / 1024).toFixed(1)} KB)
                    </span>
                  )}
                </div>
              </label>

              {/* Image Preview */}
              {uploadFile && (
                <div style={{ marginBottom: '20px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                  <img
                    src={URL.createObjectURL(uploadFile)}
                    alt="Preview"
                    style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              )}

              {uploadError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#dc2626', marginBottom: '16px', padding: '10px 14px', background: '#fef2f2', borderRadius: '10px', border: '1px solid #fecaca' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {uploadError}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button onClick={onClose} style={{ padding: '11px 24px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: 600, cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!uploadFile || uploading}
                  style={{ padding: '11px 28px', borderRadius: '10px', border: 'none', background: uploadFile && !uploading ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : '#94a3b8', color: '#fff', fontWeight: 700, cursor: uploadFile && !uploading ? 'pointer' : 'not-allowed', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: uploadFile && !uploading ? '0 4px 12px rgba(37,99,235,0.35)' : 'none', transition: 'all 0.2s ease' }}
                >
                  {uploading ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      Upload & Use
                    </>
                  )}
                </button>
              </div>
            </div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <>
            {/* Controls */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
              <input 
                type="text" 
                placeholder="Search images..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', width: '300px' }}
              />
              <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
                <button 
                  onClick={() => setViewMode('grid')}
                  style={{ background: viewMode === 'grid' ? '#fff' : 'transparent', color: viewMode === 'grid' ? '#2563eb' : '#64748b', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', boxShadow: viewMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
                >
                  Grid
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  style={{ background: viewMode === 'list' ? '#fff' : 'transparent', color: viewMode === 'list' ? '#2563eb' : '#64748b', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
                >
                  List
                </button>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: '#f8fafc' }}>
              {loading ? (
                <div style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>Loading media...</div>
              ) : filteredMedia.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#64748b', padding: '3rem', background: '#fff', borderRadius: '12px' }}>No media files found.</div>
              ) : viewMode === 'grid' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                  {filteredMedia.map(item => (
                    <div 
                      key={item.id} 
                      onClick={() => onSelect(item.url)}
                      style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', position: 'relative', transition: 'transform 0.1s ease, border-color 0.1s ease' }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = '#2563eb'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                    >
                      <div style={{ width: '100%', paddingBottom: '100%', position: 'relative', background: '#f1f5f9' }}>
                        <img loading="lazy" decoding="async" src={item.url} alt={item.name} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ overflow: 'hidden', flex: 1, paddingRight: '8px' }}>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{formatSize(item.sizeBytes)}</div>
                        </div>
                        <label onClick={(e) => e.stopPropagation()} style={{ cursor: 'pointer', background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, color: '#2563eb', border: '1px solid #e2e8f0', transition: 'all 0.1s ease' }} onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'} onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}>
                          Replace
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleReplace(e, item.name)} />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {filteredMedia.map(item => (
                    <div 
                      key={item.id} 
                      onClick={() => onSelect(item.url)}
                      style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px', cursor: 'pointer', transition: 'transform 0.1s ease, border-color 0.1s ease' }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.borderColor = '#2563eb'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                    >
                      <img loading="lazy" decoding="async" src={item.url} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', background: '#f1f5f9' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{new Date(item.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ fontSize: '13px', color: '#475569', fontWeight: 600 }}>{formatSize(item.sizeBytes)}</div>
                        <label onClick={(e) => e.stopPropagation()} style={{ cursor: 'pointer', background: '#f1f5f9', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, color: '#2563eb', border: '1px solid #e2e8f0', transition: 'all 0.1s ease' }} onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'} onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}>
                          Replace
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleReplace(e, item.name)} />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
