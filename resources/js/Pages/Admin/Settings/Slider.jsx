import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import MediaPicker from '../components/MediaPicker';

export default function SliderManager() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState(null);
  const [editingField, setEditingField] = useState('image_url'); // 'image_url' or 'mobile_image_url'

  const basePath = typeof window !== 'undefined' && window.location.pathname.startsWith('/list/public') ? '/list/public' : '';

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = () => {
    fetch(basePath + '/api/admin/sliders')
      .then(res => res.json())
      .then(data => {
        setSlides(data);
        setLoading(false);
      });
  };

  const handleAddSlide = () => {
    setEditingSlideId(null);
    setEditingField('image_url');
    setIsMediaPickerOpen(true);
  };

  const openMediaPicker = (slideId, field) => {
    setEditingSlideId(slideId);
    setEditingField(field);
    setIsMediaPickerOpen(true);
  };

  const handleMediaSelected = (url) => {
    setIsMediaPickerOpen(false);
    
    if (editingSlideId) {
      const updated = slides.map(s => s.id === editingSlideId ? { ...s, [editingField]: url } : s);
      setSlides(updated);
      const slide = updated.find(s => s.id === editingSlideId);
      saveSlide(slide);
    } else {
      const newSlide = {
        id: crypto.randomUUID(),
        image_url: url,
        mobile_image_url: '',
        title: '',
        subtitle: '',
        link: '',
        order: slides.length
      };
      setSlides([...slides, newSlide]);
      saveSlide(newSlide);
    }
  };

  const saveSlide = async (slideData) => {
    try {
      await fetch(basePath + '/api/admin/sliders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slideData)
      });
    } catch (e) {
      console.error(e);
      alert('Failed to save slide');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this slide?')) return;
    try {
      await fetch(basePath + `/api/admin/sliders`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      setSlides(slides.filter(s => s.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleFieldChange = (id, field, value) => {
    const updated = slides.map(s => s.id === id ? { ...s, [field]: value } : s);
    setSlides(updated);
  };
  
  const handleFieldBlur = (slide) => {
    saveSlide(slide);
  };

  const moveSlide = (index, dir) => {
    if (index + dir < 0 || index + dir >= slides.length) return;
    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[index + dir];
    newSlides[index + dir] = temp;
    const ordered = newSlides.map((s, i) => ({ ...s, order: i }));
    setSlides(ordered);
    ordered.forEach(s => saveSlide(s));
  };

  const removeMobileImage = (slide) => {
    const updated = { ...slide, mobile_image_url: '' };
    setSlides(slides.map(s => s.id === slide.id ? updated : s));
    saveSlide(updated);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <Head title="Home Slider | Admin" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Home Slider</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Manage the main rotating banners on the homepage</p>
        </div>
        <button onClick={handleAddSlide} style={{ background: '#2563eb', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, textDecoration: 'none', border: 'none', cursor: 'pointer' }}>
          + Add Slide
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {slides.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', background: '#f8fafc', borderRadius: '16px', color: '#64748b' }}>
            No slides configured. Add some images to show a slider on the homepage.
          </div>
        )}

        {slides.map((slide, index) => (
          <div key={slide.id} style={{ display: 'flex', gap: '1.5rem', background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center' }}>
              <button onClick={() => moveSlide(index, -1)} disabled={index === 0} style={{ padding: '8px', cursor: index === 0 ? 'not-allowed' : 'pointer', background: '#f1f5f9', border: 'none', borderRadius: '8px' }}>↑</button>
              <button onClick={() => moveSlide(index, 1)} disabled={index === slides.length - 1} style={{ padding: '8px', cursor: index === slides.length - 1 ? 'not-allowed' : 'pointer', background: '#f1f5f9', border: 'none', borderRadius: '8px' }}>↓</button>
            </div>

            {/* Desktop Image */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>🖥️ Desktop Image</span>
              <div style={{ position: 'relative', width: '200px', height: '120px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, border: '2px solid #3b82f6' }}>
                <img src={slide.image_url} alt="Desktop Slide" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button onClick={() => openMediaPicker(slide.id, 'image_url')} style={{ position: 'absolute', bottom: '6px', right: '6px', background: 'rgba(255,255,255,0.95)', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                  Change
                </button>
              </div>
            </div>

            {/* Mobile Image */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>📱 Mobile Image</span>
              {slide.mobile_image_url ? (
                <div style={{ position: 'relative', width: '70px', height: '120px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, border: '2px solid #10b981' }}>
                  <img src={slide.mobile_image_url} alt="Mobile Slide" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button onClick={() => openMediaPicker(slide.id, 'mobile_image_url')} style={{ position: 'absolute', bottom: '4px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.95)', padding: '3px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 700, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    Change
                  </button>
                  <button onClick={() => removeMobileImage(slide)} style={{ position: 'absolute', top: '4px', right: '4px', background: '#ef4444', color: '#fff', padding: '2px 5px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                    ✕
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => openMediaPicker(slide.id, 'mobile_image_url')}
                  style={{ width: '70px', height: '120px', borderRadius: '12px', border: '2px dashed #10b981', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#f0fdf4', gap: '4px', flexShrink: 0 }}
                >
                  <span style={{ fontSize: '20px' }}>📱</span>
                  <span style={{ fontSize: '9px', fontWeight: 700, color: '#10b981', textAlign: 'center', lineHeight: 1.2 }}>Add Mobile Image</span>
                </div>
              )}
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: '#f0fdf4', borderRadius: '8px', padding: '8px 12px', fontSize: '11px', color: '#166534', fontWeight: 500 }}>
                💡 Mobile image (portrait 9:16) dikhegi chhote screens par. Agar mobile image nahi lagayi toh desktop image hi crop hokar dikhegi.
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Main Title (Optional)</label>
                  <input type="text" value={slide.title || ''} onChange={e => handleFieldChange(slide.id, 'title', e.target.value)} onBlur={() => handleFieldBlur(slide)} style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }} placeholder="e.g., Welcome to Coaching" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Subtitle (Optional)</label>
                  <input type="text" value={slide.subtitle || ''} onChange={e => handleFieldChange(slide.id, 'subtitle', e.target.value)} onBlur={() => handleFieldBlur(slide)} style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }} placeholder="e.g., Learn from the best" />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Link URL (Optional)</label>
                <input type="text" value={slide.link || ''} onChange={e => handleFieldChange(slide.id, 'link', e.target.value)} onBlur={() => handleFieldBlur(slide)} style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }} placeholder="e.g., /category/news" />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <button onClick={() => handleDelete(slide.id)} style={{ padding: '8px', background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {isMediaPickerOpen && (
        <MediaPicker
          onSelect={handleMediaSelected}
          onClose={() => setIsMediaPickerOpen(false)}
        />
      )}
    </div>
  );
}

SliderManager.layout = page => <AdminLayout>{page}</AdminLayout>;
