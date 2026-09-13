import React, { useState, useEffect } from 'react';
import { Link, Head } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import axios from 'axios';

export default function MediaLibraryPage() {
  const BASE = typeof window !== 'undefined' && window.location.pathname.startsWith('/list/public') ? '/list/public' : '';
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isReplacing, setIsReplacing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  const fetchMedia = () => {
    setLoading(true);
    axios.get((typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '') + '/api/admin/media')
      .then(res => {
        if (Array.isArray(res.data)) setMedia(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleReplace = async (e, oldFilename) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsReplacing(true);
    const formData = new FormData();
    formData.append('oldFilename', oldFilename);
    formData.append('file', file);

    try {
      const res = await axios.post((typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '') + '/api/admin/media', formData);
      alert('Image replaced successfully! All articles have been updated.');
      setSelectedMedia(null);
      fetchMedia();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Failed to replace image.';
      alert(errorMsg);
    } finally {
      setIsReplacing(false);
    }
  };

  const handleDelete = async (filename) => {
    const item = media.find(m => m.name === filename);
    if (item && item.usedIn && item.usedIn.length > 0) {
      if (!confirm(`WARNING: This image is used in ${item.usedIn.length} places. Deleting it will break those images. Are you absolutely sure?`)) {
        return;
      }
    } else {
      if (!confirm('Are you sure you want to delete this image?')) return;
    }

    try {
      await axios.delete((window.location.pathname.startsWith('/list/public') ? '/list/public' : '') + `/api/admin/media?filename=${filename}`);
      setSelectedMedia(null);
      fetchMedia();
    } catch (e) {
      alert('Error deleting file');
    }
  };

  if (loading) return <div>Loading Media Library...</div>;

  const filteredMedia = media.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <Head title="Media Library | Admin" />
      <div style={{ marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Media Library</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Manage uploaded images and see where they are used</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <label style={{ background: '#2563eb', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', margin: 0 }}>
              Upload Image
              <input 
                type="file" 
                style={{ display: 'none' }} 
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const formData = new FormData();
                  formData.append('file', file);
                  try {
                    await axios.post((typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '') + '/api/admin/media', formData);
                    fetchMedia();
                  } catch(e) { 
                    alert(e.response?.data?.message || 'Upload error'); 
                  }
                }}
              />
            </label>
            <input 
              type="text" 
              placeholder="Search images..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', width: '250px' }}
            />
          </div>
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
      </div>
      {filteredMedia.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '16px', color: '#64748b' }}>
          No media files found.
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {filteredMedia.map(item => (
            <div 
              key={item.id || item.name} 
              onClick={() => setSelectedMedia(item)}
              style={{ 
                background: '#fff', 
                border: selectedMedia?.id === item.id ? '2px solid #2563eb' : '1px solid #e2e8f0', 
                borderRadius: '12px', 
                overflow: 'hidden', 
                cursor: 'pointer',
                position: 'relative',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s ease, border-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ width: '100%', paddingBottom: '100%', position: 'relative', background: '#f1f5f9' }}>
                <img loading="lazy" decoding="async" fetchPriority="low" 
                  src={item.url} 
                  alt={item.name} 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <div style={{ padding: '12px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.name}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{formatSize(item.sizeBytes)}</span>
                  {item.usedIn && item.usedIn.length > 0 && (
                    <span style={{ background: '#dbeafe', color: '#1e40af', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      Used: {item.usedIn.length}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredMedia.map(item => (
            <div 
              key={item.id || item.name} 
              onClick={() => setSelectedMedia(item)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px', 
                background: '#fff', 
                border: selectedMedia?.id === item.id ? '2px solid #2563eb' : '1px solid #e2e8f0', 
                borderRadius: '12px', 
                padding: '12px', 
                cursor: 'pointer',
                transition: 'transform 0.1s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
            >
              <img loading="lazy" decoding="async" fetchPriority="low" src={item.url} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', background: '#f1f5f9' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.name}</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</div>
              </div>
              <div style={{ width: '100px', fontSize: '13px', color: '#475569', fontWeight: 600 }}>
                {formatSize(item.sizeBytes)}
              </div>
              <div style={{ width: '100px', textAlign: 'right' }}>
                {item.usedIn && item.usedIn.length > 0 ? (
                  <span style={{ background: '#dbeafe', color: '#1e40af', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}>
                    {item.usedIn.length} Uses
                  </span>
                ) : (
                  <span style={{ color: '#94a3b8', fontSize: '12px' }}>Unused</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Modal view */}
      {selectedMedia && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '800px', maxHeight: '90vh', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.2s ease' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Media Details</h2>
              <button onClick={() => setSelectedMedia(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748b' }}>×</button>
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', flex: 1, overflowY: 'auto' }}>
              {/* Image Preview */}
              <div style={{ flex: '1 1 300px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', borderRight: '1px solid #e2e8f0' }}>
                <img loading="lazy" decoding="async" fetchPriority="low" src={selectedMedia.url} style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }} alt="Preview" />
              </div>
              
              {/* Image Meta & Usage */}
              <div style={{ flex: '1 1 300px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#64748b', textTransform: 'uppercase' }}>File Info</h3>
                  <div style={{ fontWeight: 600, fontSize: '14px', wordBreak: 'break-all' }}>{selectedMedia.name}</div>
                  <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>Size: {formatSize(selectedMedia.sizeBytes)}</div>
                  <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>Date: {selectedMedia.createdAt ? new Date(selectedMedia.createdAt).toLocaleDateString() : ''}</div>
                  <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>URL: <a href={selectedMedia.url} target="_blank" rel="noreferrer" style={{ color: '#2563eb' }}>{selectedMedia.url}</a></div>
                </div>

                <div>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#64748b', textTransform: 'uppercase' }}>Where is this used?</h3>
                  {!selectedMedia.usedIn || selectedMedia.usedIn.length === 0 ? (
                    <div style={{ padding: '12px', background: '#f1f5f9', borderRadius: '8px', fontSize: '13px', color: '#475569' }}>
                      This image is not currently used in any Posts, Stories, or Author Profiles. Safe to delete.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                      {selectedMedia.usedIn.map((usage, i) => (
                        <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', background: '#fff' }}>
                          <div style={{ fontSize: '11px', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', marginBottom: '4px' }}>{usage.type}</div>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{usage.title}</div>
                          <Link href={BASE + usage.editUrl} style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>Edit {usage.type} →</Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleReplace(e, selectedMedia.name)}
                      style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                      disabled={isReplacing}
                    />
                    <button 
                      style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', opacity: isReplacing ? 0.7 : 1, whiteSpace: 'nowrap' }}
                      disabled={isReplacing}
                    >
                      {isReplacing ? 'Replacing...' : 'Replace Image'}
                    </button>
                  </div>

                  <button 
                    onClick={() => handleDelete(selectedMedia.name)}
                    style={{ background: '#fef2f2', color: '#ef4444', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                    disabled={isReplacing}
                  >
                    Delete Permanently
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

MediaLibraryPage.layout = page => <AdminLayout>{page}</AdminLayout>;
