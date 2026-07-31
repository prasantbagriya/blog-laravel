import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import MediaPicker from '../components/MediaPicker';

export default function SliderManager() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState(null);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = () => {
    const basePath = typeof window !== 'undefined' && window.location.pathname.startsWith('/list/public') ? '/list/public' : '';
    fetch(basePath + '/api/admin/sliders')
      .then(res => res.json())
      .then(data => {
        setSlides(data);
        setLoading(false);
      });
  };

  const handleAddSlide = () => {
    setEditingSlideId(null);
    setIsMediaPickerOpen(true);
  };

  const handleMediaSelected = (url) => {
    setIsMediaPickerOpen(false);
    
    if (editingSlideId) {
      // Update existing
      setSlides(slides.map(s => s.id === editingSlideId ? { ...s, image_url: url } : s));
      saveSlide({ id: editingSlideId, image_url: url });
    } else {
      // Create new
      const newSlide = {
        id: crypto.randomUUID(),
        image_url: url,
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
      const basePath = typeof window !== 'undefined' && window.location.pathname.startsWith('/list/public') ? '/list/public' : '';
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
      const basePath = typeof window !== 'undefined' && window.location.pathname.startsWith('/list/public') ? '/list/public' : '';
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
    
    // Update order values
    const ordered = newSlides.map((s, i) => ({ ...s, order: i }));
    setSlides(ordered);
    
    // Save all to backend (inefficient but works for small numbers)
    ordered.forEach(s => saveSlide(s));
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

            <div style={{ position: 'relative', width: '250px', height: '140px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, border: '1px solid #e2e8f0' }}>
              <img src={slide.image_url} alt="Slide" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button onClick={() => { setEditingSlideId(slide.id); setIsMediaPickerOpen(true); }} style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(255,255,255,0.9)', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                Change Image
              </button>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
