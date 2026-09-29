import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import MediaPicker from '../components/MediaPicker';

// ─── Confirmation Modal ───────────────────────────────────────────────────────
function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
    }}>
      <div style={{
        background: '#fff', borderRadius: '16px', padding: '32px', maxWidth: '420px', width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', animation: 'fadeInScale 0.2s ease'
      }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', fontSize: '22px' }}>🗑️</div>
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>{title}</h3>
        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px', lineHeight: 1.6 }}>{message}</p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onCancel}
            style={{ flex: 1, padding: '11px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', color: '#475569', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{ flex: 1, padding: '11px', border: 'none', borderRadius: '8px', background: '#ef4444', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}
          >
            Yes, Delete
          </button>
        </div>
      </div>
      <style>{`@keyframes fadeInScale { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }`}</style>
    </div>
  );
}

// ─── Input / Label helpers ────────────────────────────────────────────────────
const inputStyle = { width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', color: '#0f172a', background: '#fff', boxSizing: 'border-box' };
const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' };
const sectionBox = { padding: '24px', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc', marginBottom: '20px' };

// ─── Field helper ─────────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}


export default function PagesIndex() {
  const BASE = typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '';

  const [pages, setPages]             = useState([]);
  const [categories, setCategories]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [tableError, setTableError]   = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, title }
  const [isDeleting, setIsDeleting]   = useState(false);
  const [saving, setSaving]           = useState(false);

  // Form fields
  const [editingId, setEditingId]         = useState(null);
  const [title, setTitle]                 = useState('');
  const [slug, setSlug]                   = useState('');
  const [type, setType]                   = useState('feed');
  const [categoryId, setCategoryId]       = useState('');
  const [content, setContent]             = useState('');
  const [schemaType, setSchemaType]       = useState('Article');
  const [seoTitle, setSeoTitle]           = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords]     = useState('');
  const [ogTitle, setOgTitle]             = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage]             = useState('');
  const [isUploading, setIsUploading]     = useState(false);
  const [faqs, setFaqs]                   = useState([]);

  useEffect(() => { fetchPages(); fetchCategories(); }, []);

  const fetchPages = async () => {
    try {
      const res  = await fetch(BASE + '/api/admin/pages');
      const data = await res.json();
      if (!res.ok || data?.error === 'pages_table_missing') { setTableError(true); }
      else if (Array.isArray(data)) { setPages(data); setTableError(false); }
    } catch { setTableError(true); }
    finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    try {
      const res  = await fetch(BASE + '/api/admin/categories');
      const data = await res.json();
      if (Array.isArray(data)) setCategories(data);
    } catch {}
  };

  const resetForm = () => {
    setEditingId(null); setTitle(''); setSlug(''); setType('feed');
    setCategoryId(''); setContent(''); setSchemaType('Article');
    setSeoTitle(''); setSeoDescription(''); setSeoKeywords('');
    setOgTitle(''); setOgDescription(''); setOgImage(''); setFaqs([]);
    setIsFormVisible(false);
  };

  const handleEdit = (page) => {
    setEditingId(page.id);
    setTitle(page.title); setSlug(page.slug);
    setType(page.type || 'feed'); setCategoryId(page.category_id || '');
    setContent(page.content || ''); setSchemaType(page.schema_type || 'Article');
    setSeoTitle(page.seo_title || ''); setSeoDescription(page.seo_description || '');
    setSeoKeywords(page.seo_keywords || ''); setOgTitle(page.og_title || '');
    setOgDescription(page.og_description || ''); setOgImage(page.og_image || '');
    setFaqs(Array.isArray(page.faqs) ? page.faqs : []);
    setIsFormVisible(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(BASE + '/api/admin/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '' },
        body: JSON.stringify({
          id: editingId || undefined, title,
          slug: slug.toLowerCase().replace(/[^a-z0-9\-]+/g, '-').replace(/(^-|-$)+/g, ''),
          type, category_id: categoryId || null, content, schema_type: schemaType,
          seo_title: seoTitle, seo_description: seoDescription, seo_keywords: seoKeywords,
          og_title: ogTitle, og_description: ogDescription, og_image: ogImage,
          faqs: faqs.filter(f => f.question?.trim() || f.answer?.trim()),
        })
      });
      if (res.ok) { resetForm(); fetchPages(); }
      else { const err = await res.json(); alert(err.message || 'Save failed'); }
    } catch { alert('Connection error'); }
    finally { setSaving(false); }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${BASE}/api/admin/pages?id=${deleteTarget.id}`, {
        method: 'DELETE', headers: { 'Accept': 'application/json' }
      });
      if (res.ok) { setDeleteTarget(null); fetchPages(); }
      else { alert('Delete failed'); }
    } catch { alert('Connection error'); }
    finally { setIsDeleting(false); }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const fd = new FormData(); fd.append('file', file);
    try {
      const res  = await fetch(BASE + '/api/admin/upload-category', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) setOgImage(data.url); else alert('Upload failed');
    } catch { alert('Upload error'); }
    setIsUploading(false);
  };

  // ── Loading / Error states ─────────────────────────────────────────────────
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '12px', color: '#64748b' }}>
      <div style={{ width: '24px', height: '24px', border: '3px solid #e2e8f0', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      Loading Pages...
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (tableError) return (
    <div style={{ padding: '60px 24px', textAlign: 'center' }}>
      <div style={{ fontSize: '52px', marginBottom: '16px' }}>⚠️</div>
      <h2 style={{ color: '#0f172a', fontWeight: 800, marginBottom: '8px' }}>Database Not Ready</h2>
      <p style={{ color: '#64748b', marginBottom: '28px' }}>The <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>pages</code> table doesn't exist yet. Please run migrations.</p>
    </div>
  );

  // ── LIST VIEW ──────────────────────────────────────────────────────────────
  if (!isFormVisible) return (
    <div>
      <Head title="Dynamic Pages | Admin" />

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <ConfirmModal
          title="Delete Page?"
          message={`Are you sure you want to delete "${deleteTarget.title}"? This action cannot be undone and will remove the public page.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>Dynamic Pages</h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>Create and manage public pages like <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>/blog</code> or <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>/news</code> with custom SEO & FAQs.</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsFormVisible(true); }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#2563eb', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(37,99,235,0.2)', whiteSpace: 'nowrap' }}
        >
          + Create New Page
        </button>
      </div>

      {/* Table card */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: '580px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Page Title', 'URL Slug', 'Type', 'FAQs', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', textAlign: h === 'Actions' ? 'right' : 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pages.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                    <div style={{ fontSize: '36px', marginBottom: '12px' }}>📄</div>
                    No pages created yet. Click "Create New Page" to get started.
                  </td>
                </tr>
              ) : pages.map(page => (
                <tr key={page.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}
                >
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>{page.title}</div>
                    {page.seo_title && <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{page.seo_title}</div>}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <a href={`/${page.slug}`} target="_blank" rel="noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#eff6ff', color: '#2563eb', padding: '4px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}
                    >
                      /{page.slug} ↗
                    </a>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{
                      display: 'inline-block', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700,
                      background: page.type === 'feed' ? '#ecfdf5' : '#f0f9ff',
                      color: page.type === 'feed' ? '#059669' : '#0284c7'
                    }}>
                      {page.type === 'feed' ? '📰 Post Feed' : '📄 Static'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: '#64748b' }}>
                    {Array.isArray(page.faqs) && page.faqs.length > 0
                      ? <span style={{ background: '#fef9c3', color: '#854d0e', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>{page.faqs.length} FAQ{page.faqs.length > 1 ? 's' : ''}</span>
                      : <span style={{ color: '#cbd5e1' }}>—</span>
                    }
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleEdit(page)}
                        style={{ padding: '6px 14px', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '6px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ id: page.id, title: page.title })}
                        disabled={isDeleting}
                        style={{ padding: '6px 14px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ── FORM VIEW ──────────────────────────────────────────────────────────────

  return (
    <div>
      <Head title={editingId ? 'Edit Page | Admin' : 'Create Page | Admin'} />

      {/* Back bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button onClick={resetForm} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#475569', padding: '8px 14px', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
          ← Back
        </button>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>{editingId ? 'Edit Page & SEO' : 'Create New Page'}</h1>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>

          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Basic Info */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', marginTop: 0 }}>Page Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Field label="Page Title *">
                  <input style={inputStyle} type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. News Feed" />
                </Field>
                <Field label="URL Slug *">
                  <input style={inputStyle} type="text" value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9\-]+/g, '-'))} required placeholder="e.g. news" />
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Public URL: /{slug || 'your-slug'}</div>
                </Field>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                <Field label="Page Type">
                  <select style={inputStyle} value={type} onChange={e => setType(e.target.value)}>
                    <option value="feed">📰 Post Feed (Shows articles)</option>
                    <option value="static">📄 Static Page (Custom content)</option>
                  </select>
                </Field>
                {type === 'feed' && (
                  <Field label="Schema Type">
                    <select style={inputStyle} value={schemaType} onChange={e => setSchemaType(e.target.value)}>
                      <option value="Article">Article (Standard Blog)</option>
                      <option value="NewsArticle">NewsArticle (News/Updates)</option>
                      <option value="BlogPosting">BlogPosting (Personal Blog)</option>
                      <option value="EducationalArticle">EducationalArticle (Study Material)</option>
                      <option value="Report">Report (Results/Reports)</option>
                    </select>
                  </Field>
                )}
              </div>
              {type === 'static' && (
                <div style={{ marginTop: '16px' }}>
                  <Field label="Page Content">
                    <textarea style={{ ...inputStyle, resize: 'vertical' }} value={content} onChange={e => setContent(e.target.value)} rows={6} placeholder="Write your page content here..." />
                  </Field>
                </div>
              )}
            </div>

            {/* SEO */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '4px', marginTop: 0 }}>SEO & Social Meta</h3>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>Optimise this page for Google and social sharing.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <Field label="Meta Title"><input style={inputStyle} type="text" value={seoTitle} onChange={e => setSeoTitle(e.target.value)} placeholder="Title for Google Search" /></Field>
                <Field label="OG Title (Facebook / X)"><input style={inputStyle} type="text" value={ogTitle} onChange={e => setOgTitle(e.target.value)} placeholder="Title for Social Sharing" /></Field>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <Field label="Meta Description"><textarea style={{ ...inputStyle, resize: 'vertical' }} value={seoDescription} onChange={e => setSeoDescription(e.target.value)} rows={3} placeholder="Description for Google Search" /></Field>
                <Field label="OG Description"><textarea style={{ ...inputStyle, resize: 'vertical' }} value={ogDescription} onChange={e => setOgDescription(e.target.value)} rows={3} placeholder="Description for Social Sharing" /></Field>
              </div>
              <Field label="Meta Keywords">
                <input style={inputStyle} type="text" value={seoKeywords} onChange={e => setSeoKeywords(e.target.value)} placeholder="news, blog, updates, sikar" />
              </Field>

              {/* OG Image */}
              <div style={{ marginTop: '20px' }}>
                <label style={labelStyle}>Open Graph Cover Image</label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button type="button" onClick={() => setMediaPickerTarget('ogImage')}
                    style={{ padding: '8px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontWeight: 600, fontSize: '13px', color: '#475569', cursor: 'pointer' }}>
                    📁 Media Library
                  </button>
                  <label style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
                    {isUploading ? 'Uploading...' : '☁️ Upload Image'}
                    <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                  </label>
                </div>
                {ogImage && (
                  <div style={{ position: 'relative', display: 'inline-block', marginTop: '12px' }}>
                    <img src={ogImage} alt="OG" style={{ height: '100px', borderRadius: '8px', objectFit: 'cover', border: '2px solid #e2e8f0' }} />
                    <button type="button" onClick={() => setOgImage('')}
                      style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#ef4444', color: '#fff', borderRadius: '50%', width: '22px', height: '22px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>×</button>
                  </div>
                )}
              </div>
            </div>

            {/* FAQ Editor */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>FAQ Section</h3>
                <button type="button" onClick={() => setFaqs([...faqs, { question: '', answer: '' }])}
                  style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '7px 14px', borderRadius: '6px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                  + Add FAQ
                </button>
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>FAQs appear on the public page and generate FAQPage rich results in Google.</p>
              {faqs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8', border: '1px dashed #e2e8f0', borderRadius: '8px', fontSize: '13px' }}>
                  No FAQs yet — click "+ Add FAQ" to start.
                </div>
              ) : faqs.map((faq, idx) => (
                <div key={idx} style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '12px', background: '#f8fafc' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>FAQ #{idx + 1}</span>
                    <button type="button" onClick={() => setFaqs(faqs.filter((_, i) => i !== idx))}
                      style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '3px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>Remove</button>
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <label style={labelStyle}>Question</label>
                    <input style={inputStyle} type="text" value={faq.question}
                      onChange={e => { const u = [...faqs]; u[idx] = { ...u[idx], question: e.target.value }; setFaqs(u); }}
                      placeholder="e.g. What is the best coaching in Sikar?" />
                  </div>
                  <div>
                    <label style={labelStyle}>Answer</label>
                    <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={3} value={faq.answer}
                      onChange={e => { const u = [...faqs]; u[idx] = { ...u[idx], answer: e.target.value }; setFaqs(u); }}
                      placeholder="Write the answer here..." />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN — sticky save panel */}
          <div style={{ position: 'sticky', top: '88px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', marginTop: 0 }}>Publish</h3>
              <button type="submit" disabled={saving}
                style={{ width: '100%', background: saving ? '#93c5fd' : '#2563eb', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 700, fontSize: '15px', cursor: saving ? 'not-allowed' : 'pointer', marginBottom: '10px', boxShadow: '0 4px 6px -1px rgba(37,99,235,0.2)' }}>
                {saving ? 'Saving...' : editingId ? '✓ Save Changes' : '🚀 Publish Page'}
              </button>
              <button type="button" onClick={resetForm}
                style={{ width: '100%', background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', padding: '11px', borderRadius: '8px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>

            {editingId && (
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '8px', marginTop: 0 }}>Quick Info</h3>
                <div style={{ fontSize: '13px', color: '#64748b' }}>
                  <div style={{ marginBottom: '6px' }}>Slug: <strong style={{ color: '#0f172a' }}>/{slug}</strong></div>
                  <div style={{ marginBottom: '6px' }}>Type: <strong style={{ color: '#0f172a' }}>{type === 'feed' ? 'Post Feed' : 'Static'}</strong></div>
                  <div>FAQs: <strong style={{ color: '#0f172a' }}>{faqs.length}</strong></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>

      {mediaPickerTarget && (
        <MediaPicker onSelect={(url) => { setOgImage(url); setMediaPickerTarget(null); }} onClose={() => setMediaPickerTarget(null)} />
      )}
    </div>
  );
}

PagesIndex.layout = page => <AdminLayout>{page}</AdminLayout>;
