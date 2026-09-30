import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import DeleteButton from '../DeleteButton';
import AdminLayout from '../../../Layouts/AdminLayout';
import MediaPicker from '../components/MediaPicker';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  
  // SEO & Image state
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [image, setImage] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch((typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '') + '/api/admin/categories');
      const data = await res.json();
      if (Array.isArray(data)) setCategories(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setDescription('');
    setSeoTitle('');
    setSeoDescription('');
    setSeoKeywords('');
    setOgTitle('');
    setOgDescription('');
    setOgImage('');
    setImage('');
    setImageAlt('');
    setShowAdvanced(false);
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setName(category.name || '');
    setSlug(category.slug || '');
    setDescription(category.description || '');
    setSeoTitle(category.seo_title || '');
    setSeoDescription(category.seo_description || '');
    setSeoKeywords(category.seo_keywords || '');
    setOgTitle(category.og_title || '');
    setOgDescription(category.og_description || '');
    setOgImage(category.og_image || '');
    setImage(category.image || '');
    setImageAlt(category.image_alt || '');
    setShowAdvanced(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await fetch((typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '') + '/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId || undefined,
          name,
          slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
          description,
          seo_title: seoTitle,
          seo_description: seoDescription,
          seo_keywords: seoKeywords,
          og_title: ogTitle,
          og_description: ogDescription,
          og_image: ogImage,
          image,
          image_alt: imageAlt
        })
      });
      if (res.ok) {
        resetForm();
        fetchCategories();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div style={{ padding: '40px', color: '#64748b' }}>Loading Categories...</div>;

  return (
    <div>
      <Head title="Categories | Admin" />
      <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Category Management</h1>
      <p style={{ color: '#64748b', marginBottom: '32px' }}>Create and manage categories for your blog posts.</p>

      <div style={{ display: 'flex', flexDirection: isMobile ? 'column-reverse' : 'row', gap: '32px', alignItems: 'start' }}>
        {/* Categories List */}
        <div style={{ flex: 1, width: '100%', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ width: '100%', minWidth: '400px', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Name</th>
                  <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Slug</th>
                  <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '15px' }}>{cat.name}</div>
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '14px', color: '#475569' }}>/{cat.slug}</td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <button 
                          onClick={() => handleEdit(cat)}
                          style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 600, cursor: 'pointer', fontSize: '14px', whiteSpace: 'nowrap' }}
                        >
                          Edit
                        </button>
                        <DeleteButton 
                          endpoint="/api/admin/categories"
                          id={cat.id}
                          onSuccess={fetchCategories}
                          label="Delete"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={3} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>No categories found. Create one to get started.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create/Edit Form */}
        <div style={{ width: isMobile ? '100%' : '450px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', position: isMobile ? 'static' : 'sticky', top: '100px', maxHeight: isMobile ? 'none' : 'calc(100vh - 120px)', overflowY: 'auto' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>
            {editingId ? 'Edit Category' : 'Add New Category'}
          </h2>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Category Name *</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                placeholder="e.g. Technology"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Slug (Optional)</label>
              <input 
                type="text" 
                value={slug} 
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'))} 
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                placeholder="e.g. technology"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Description</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                rows={3}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', resize: 'vertical' }}
                placeholder="A short description..."
              />
            </div>

            <button 
              type="button" 
              onClick={() => setShowAdvanced(!showAdvanced)} 
              style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 600, fontSize: '13px', textAlign: 'left', cursor: 'pointer', padding: '8px 0' }}
            >
              {showAdvanced ? '- Hide' : '+ Show'} Advanced SEO & Images
            </button>

            {/* Category Feature Image - Always Visible */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', background: '#f8fafc' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Category Feature Image</h3>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Image URL</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="text" value={image} onChange={(e) => setImage(e.target.value)} style={{ flex: 1, padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }} placeholder="https://..." />
                  <button
                    type="button"
                    onClick={() => setMediaPickerTarget('image')}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> Browse
                  </button>
                </div>
              </div>
              {image && (
                <div style={{ marginBottom: '12px' }}>
                  <img src={image} alt={imageAlt || 'Preview'} style={{ width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0' }} />
                </div>
              )}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Image Alt Text</label>
                <input type="text" value={imageAlt} onChange={(e) => setImageAlt(e.target.value)} style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }} placeholder="Image description" />
              </div>
            </div>

            {showAdvanced && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Search Engine Optimization</h3>
                
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>SEO Title</label>
                  <input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }} placeholder="Ideal length: 50-60 characters" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>SEO Description</label>
                  <textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={2} style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', resize: 'vertical' }} placeholder="Ideal length: 150-160 characters" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>SEO Keywords (comma separated)</label>
                  <input type="text" value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }} placeholder="tech, news, review" />
                </div>

                <h3 style={{ margin: '12px 0 0 0', fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>Social Media (Open Graph)</h3>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>OG Title</label>
                  <input type="text" value={ogTitle} onChange={(e) => setOgTitle(e.target.value)} style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>OG Description</label>
                  <textarea value={ogDescription} onChange={(e) => setOgDescription(e.target.value)} rows={2} style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', resize: 'vertical' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>OG Image URL</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="text" value={ogImage} onChange={(e) => setOgImage(e.target.value)} style={{ flex: 1, padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }} placeholder="https://..." />
                    <button type="button" onClick={() => setMediaPickerTarget('ogImage')} style={{ padding: '0 12px', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Browse</button>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button 
                type="submit" 
                style={{ flex: 1, background: '#2563eb', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                {editingId ? 'Update' : 'Add'} Category
              </button>
              {editingId && (
                <button 
                  type="button" 
                  onClick={resetForm}
                  style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '10px 16px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      
      <MediaPicker
        open={!!mediaPickerTarget}
        onClose={() => setMediaPickerTarget(null)}
        onSelect={(url) => {
           if (mediaPickerTarget === 'ogImage') setOgImage(url);
           if (mediaPickerTarget === 'image') setImage(url);
           setMediaPickerTarget(null);
        }}
      />
    </div>
  );
}

CategoriesPage.layout = page => <AdminLayout>{page}</AdminLayout>;
