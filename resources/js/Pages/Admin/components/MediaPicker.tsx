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
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '' },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        onSelect(data.url);
      } else {
        setUploadError(data.error || 'Upload failed');
      }
    } catch {
      setUploadError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
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
          <div style={{ flex: 1, overflowY: 'auto', padding: '32px', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <div style={{ background: '#fff', borderRadius: '16px', border: '2px dashed #cbd5e1', padding: '40px', width: '100%', maxWidth: '480px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🖼️</div>
              <h3 style={{ margin: '0 0 8px', fontWeight: 700, color: '#0f172a' }}>Upload Image</h3>
              <p style={{ margin: '0 0 20px', color: '#64748b', fontSize: '14px' }}>Select an image from your device to upload directly.</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => { setUploadFile(e.target.files?.[0] || null); setUploadError(''); }}
                style={{ display: 'block', width: '100%', marginBottom: '16px', fontSize: '14px' }}
              />
              {uploadFile && (
                <div style={{ fontSize: '13px', color: '#475569', marginBottom: '16px', padding: '8px 12px', background: '#f1f5f9', borderRadius: '8px' }}>
                  Selected: <strong>{uploadFile.name}</strong> ({(uploadFile.size / 1024).toFixed(1)} KB)
                </div>
              )}
              {uploadError && (
                <div style={{ fontSize: '13px', color: '#dc2626', marginBottom: '16px', padding: '8px 12px', background: '#fef2f2', borderRadius: '8px' }}>{uploadError}</div>
              )}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>Cancel</button>
                <button
                  onClick={handleUpload}
                  disabled={!uploadFile || uploading}
                  style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', background: uploadFile && !uploading ? '#2563eb' : '#94a3b8', color: '#fff', fontWeight: 700, cursor: uploadFile && !uploading ? 'pointer' : 'not-allowed', fontSize: '14px' }}
                >
                  {uploading ? 'Uploading...' : 'Upload & Use'}
                </button>
              </div>
            </div>
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
                      <div style={{ padding: '12px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{formatSize(item.sizeBytes)}</div>
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
                      <div style={{ fontSize: '13px', color: '#475569', fontWeight: 600, paddingRight: '12px' }}>{formatSize(item.sizeBytes)}</div>
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
