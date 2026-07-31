
import { useState, useEffect, useTransition, useRef } from 'react';
import { router } from '@inertiajs/react';

import { format } from 'date-fns';
import MediaPicker from "../components/MediaPicker";

export default function StoryForm({ story }: { story?: any }) {
  
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(story?.title || '');
  const [slug, setSlug] = useState(story?.slug || '');
  const [description, setDescription] = useState(story?.description || '');
  const [seoTitle, setSeoTitle] = useState(story?.seoTitle || '');
  const [category, setCategory] = useState(story?.category || 'General');
  const [tags, setTags] = useState<string[]>(story?.tags || []);
  const [posterImage, setPosterImage] = useState(story?.posterImage || '');
  // ✅ Google Discover: Square (1:1) and Landscape (16:9) covers
  const [squarePoster, setSquarePoster] = useState(story?.squarePoster || '');
  const [landscapePoster, setLandscapePoster] = useState(story?.landscapePoster || '');
  const [author, setAuthor] = useState(story?.author || 'SEO Expert');
  const [authorBio, setAuthorBio] = useState(story?.authorBio || '');
  const [authorImage, setAuthorImage] = useState(story?.authorImage || '');
  const [authorSocials, setAuthorSocials] = useState(story?.authorSocials || { twitter: '', linkedin: '', website: '' });
  const [publisherLogo, setPublisherLogo] = useState(story?.publisherLogo || 'https://blog.com/logo-96x96.png');
  const [slides, setSlides] = useState<any[]>(story?.slides || [
    { id: 'sl1', image: '', text: 'Slide 1' }
  ]);
  const [id, setId] = useState(story?.id || '');
  // ✅ GSC Policy: Indexing and disclosure controls
  const [isSponsored, setIsSponsored] = useState(story?.isSponsored || false);
  const [isNoIndex, setIsNoIndex] = useState(story?.isNoIndex || false);
  
  const [mediaPickerTarget, setMediaPickerTarget] = useState<{type: 'poster' | 'square' | 'landscape' | 'author' | 'slide', index?: number} | null>(null);

  useEffect(() => {
    if (!id && !story?.id) {
      setId(crypto.randomUUID());
    }
  }, [id, story?.id]);

  const [uploading, setUploading] = useState(false);
  const authorImgRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File): Promise<string> => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch((typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '') + '/api/admin/upload', { method: 'POST', body: formData });
      const result: any = await res.json();
      setUploading(false);
      if (result.success && result.url) {
        return result.url;
      } else {
        alert(`Upload failed: ${result.error || 'Unknown error'}`);
        return '';
      }
    } catch (e: any) {
      setUploading(false);
      alert(`Upload failed: ${e.message || 'Connection error'}`);
      return '';
    }
  };

  const addSlide = () => {
    setSlides([...slides, { id: `sl${Date.now()}`, image: '', text: '' }]);
  };

  const updateSlide = (index: number, field: string, value: string) => {
    const newSlides = [...slides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    setSlides(newSlides);
  };

  const removeSlide = (index: number) => {
    const newSlides = [...slides];
    newSlides.splice(index, 1);
    setSlides(newSlides);
  };

  const handleSave = async (published: boolean) => {
    startTransition(async () => {
      const cleanSlug = (slug || title)
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      const updatedStory: WebStory = {
        id: id,
        title,
        slug: cleanSlug,
        description,
        seoTitle: seoTitle || undefined,
        category,
        tags,
        posterImage: posterImage || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=640&h=853&q=80',
        // ✅ Google Discover: Square and Landscape fallbacks
        squarePoster: squarePoster || posterImage || undefined,
        landscapePoster: landscapePoster || posterImage || undefined,
        date: story?.date || format(new Date(), 'yyyy-MM-dd'),
        lastModified: format(new Date(), 'yyyy-MM-dd'),
        author,
        authorBio: authorBio || undefined,
        authorImage: authorImage || undefined,
        authorSocials: (authorSocials.twitter || authorSocials.linkedin || authorSocials.website) ? authorSocials : undefined,
        publisherLogo,
        slides,
        published,
        // ✅ GSC: Disclosure and indexing controls
        isSponsored: isSponsored || undefined,
        isNoIndex: isNoIndex || undefined,
      };

      try {
        const res = await fetch((typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '') + '/api/admin/stories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedStory)
        });
        
        if (!res.ok) {
          throw new Error('Failed to save story');
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
        const BASE = typeof window !== 'undefined' && window.location.pathname.startsWith('/list/public') ? '/list/public' : '';
        router.visit(BASE + '/admin/stories');
      } catch (error) {
        console.error('Save failed:', error);
        alert('Critical error: Web Story could not be deployed.');
      }
    });
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, background: '#f8fafc', overflowY: 'auto' }}>
      <div style={{ width: '100%', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={() => { const BASE = typeof window !== 'undefined' && window.location.pathname.startsWith('/list/public') ? '/list/public' : ''; router.visit(BASE + '/admin/stories'); }} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}>←</button>
            <h1 style={{ fontSize: '24px', fontWeight: 600, margin: 0 }}>{story ? 'Edit Web Story' : 'New Web Story'}</h1>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => handleSave(false)} disabled={isPending || uploading} style={draftBtn}>Save Draft</button>
          <button onClick={() => handleSave(true)} disabled={isPending || uploading} style={publishBtn}>{isPending ? 'Saving...' : 'Publish Story'}</button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* ✅ Story Details Panel */}
        <div style={panelStyle}>
          <h2 style={panelHeader}>Story Details</h2>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Story Title (max 90 chars)" maxLength={90} style={inputStyle} />
          <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="URL Slug (auto-generated if empty)" style={inputStyle} />
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Meta Description for SEO (150-160 chars)" style={{ ...inputStyle, minHeight: '80px' }} />
          <input value={seoTitle} onChange={e => setSeoTitle(e.target.value)} placeholder="SEO Title Override (max 90 chars, leave empty to use title)" maxLength={90} style={inputStyle} />
          <div style={{ display: 'flex', gap: '10px' }}>
            <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category (e.g. SEO, Technology)" style={{ ...inputStyle, flex: 1, marginBottom: 0 }} />
            <input
              value={tags.join(', ')}
              onChange={e => setTags(e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
              placeholder="Tags (comma separated)"
              style={{ ...inputStyle, flex: 2, marginBottom: 0 }}
            />
          </div>

          {/* ✅ GSC Controls */}
          <div style={{ display: 'flex', gap: '20px', marginTop: '16px', padding: '14px', background: '#f1f5f9', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
              <input type="checkbox" checked={isSponsored} onChange={e => setIsSponsored(e.target.checked)} />
              💰 Sponsored Story
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: isNoIndex ? '#dc2626' : '#475569' }}>
              <input type="checkbox" checked={isNoIndex} onChange={e => setIsNoIndex(e.target.checked)} />
              🚫 No Index (Exclude from Google)
            </label>
          </div>
        </div>

        {/* ✅ Google Discover Poster Covers Panel */}
        <div style={panelStyle}>
          <h2 style={panelHeader}>📸 Google Discover Covers</h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px', lineHeight: 1.5 }}>Google Discover requires all 3 aspect ratios. Missing covers will fall back to the portrait image.</p>
          
          <label style={fieldLabel}>Portrait Cover (9:16 — Required)</label>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <input value={posterImage} onChange={e => setPosterImage(e.target.value)} placeholder="Portrait Poster Image URL (9:16)" style={{ ...inputStyle, flex: 1, marginBottom: 0 }} />
            <button type="button" onClick={() => setMediaPickerTarget({type: 'poster'})} style={{ ...uploadBtnStyle, background: '#f8fafc', border: '1px solid #e2e8f0' }}>Library</button>
            <label style={uploadBtnStyle}>
              {uploading ? '...' : 'Upload'}
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async e => {
                if (e.target.files?.[0]) {
                  const url = await uploadFile(e.target.files[0]);
                  if (url) setPosterImage(url);
                }
              }} />
            </label>
          </div>

          <label style={fieldLabel}>Square Cover (1:1 — For Discover Grid)</label>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <input value={squarePoster} onChange={e => setSquarePoster(e.target.value)} placeholder="Square Poster Image URL (1:1) — Optional, falls back to portrait" style={{ ...inputStyle, flex: 1, marginBottom: 0 }} />
            <button type="button" onClick={() => setMediaPickerTarget({type: 'square'})} style={{ ...uploadBtnStyle, background: '#f8fafc', border: '1px solid #e2e8f0' }}>Library</button>
            <label style={uploadBtnStyle}>
              {uploading ? '...' : 'Upload'}
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async e => {
                if (e.target.files?.[0]) {
                  const url = await uploadFile(e.target.files[0]);
                  if (url) setSquarePoster(url);
                }
              }} />
            </label>
          </div>

          <label style={fieldLabel}>Landscape Cover (16:9 — For Search Thumbnails)</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input value={landscapePoster} onChange={e => setLandscapePoster(e.target.value)} placeholder="Landscape Poster Image URL (16:9) — Optional, falls back to portrait" style={{ ...inputStyle, flex: 1, marginBottom: 0 }} />
            <button type="button" onClick={() => setMediaPickerTarget({type: 'landscape'})} style={{ ...uploadBtnStyle, background: '#f8fafc', border: '1px solid #e2e8f0' }}>Library</button>
            <label style={uploadBtnStyle}>
              {uploading ? '...' : 'Upload'}
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async e => {
                if (e.target.files?.[0]) {
                  const url = await uploadFile(e.target.files[0]);
                  if (url) setLandscapePoster(url);
                }
              }} />
            </label>
          </div>
        </div>

        {/* ✅ Author & Publisher Panel */}
        <div style={panelStyle}>
          <h2 style={panelHeader}>Author & Publisher</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Author Name" style={{ ...inputStyle, flex: 1 }} />
            <input value={publisherLogo} onChange={e => setPublisherLogo(e.target.value)} placeholder="Publisher Logo URL" style={{ ...inputStyle, flex: 1 }} />
          </div>
          
          <label style={fieldLabel}>Author Avatar Image</label>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <input value={authorImage} onChange={e => setAuthorImage(e.target.value)} placeholder="Author image URL (https://...)" style={{ ...inputStyle, flex: 1, marginBottom: 0 }} />
            <button type="button" onClick={() => setMediaPickerTarget({type: 'author'})} style={{ ...uploadBtnStyle, background: '#f8fafc', border: '1px solid #e2e8f0' }}>Library</button>
            <label style={uploadBtnStyle}>
              {uploading ? '...' : 'Upload'}
              <input type="file" accept="image/*" ref={authorImgRef} style={{ display: 'none' }} onChange={async e => {
                if (e.target.files?.[0]) {
                  const url = await uploadFile(e.target.files[0]);
                  if (url) setAuthorImage(url);
                }
              }} />
            </label>
          </div>

          <textarea value={authorBio} onChange={e => setAuthorBio(e.target.value)} placeholder="Author biography / short professional summary..." style={{ ...inputStyle, minHeight: '80px' }} />
          
          <label style={fieldLabel}>Author Social Links (E-E-A-T)</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <input value={authorSocials.twitter || ''} onChange={e => setAuthorSocials({...authorSocials, twitter: e.target.value})} placeholder="Twitter URL" style={{ ...inputStyle, marginBottom: 0 }} />
            <input value={authorSocials.linkedin || ''} onChange={e => setAuthorSocials({...authorSocials, linkedin: e.target.value})} placeholder="LinkedIn URL" style={{ ...inputStyle, marginBottom: 0 }} />
            <input value={authorSocials.website || ''} onChange={e => setAuthorSocials({...authorSocials, website: e.target.value})} placeholder="Website URL" style={{ ...inputStyle, marginBottom: 0 }} />
          </div>
        </div>

        {/* ✅ Slides Panel */}
        <div style={panelStyle}>
          <h2 style={panelHeader}>Slides</h2>
          {slides.map((slide, index) => (
            <div key={slide.id} style={slideBox}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', fontWeight: 600 }}>
                    Slide {index + 1}
                    {slides.length > 1 && <button onClick={() => removeSlide(index)} style={delBtn}>Remove</button>}
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input value={slide.image} onChange={e => updateSlide(index, 'image', e.target.value)} placeholder="Image URL" style={{ ...inputStyle, marginBottom: 0 }} />
                    <button type="button" onClick={() => setMediaPickerTarget({type: 'slide', index})} style={{ ...uploadBtnStyle, background: '#f8fafc', border: '1px solid #e2e8f0', marginBottom: 0 }}>Library</button>
                    <label style={{ ...uploadBtnStyle, marginBottom: 0 }}>
                      {uploading ? '...' : 'Upload'}
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async e => {
                        if (e.target.files?.[0]) {
                          const url = await uploadFile(e.target.files[0]);
                          if (url) updateSlide(index, 'image', url);
                        }
                      }} />
                    </label>
                  </div>
                  <textarea value={slide.text || ''} onChange={e => updateSlide(index, 'text', e.target.value)} placeholder="Overlay Text" style={{ ...inputStyle, minHeight: '60px' }} />
                </div>
                {slide.image && (
                  <div style={{ width: '120px', height: '160px', background: '#e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                    <img src={slide.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
            </div>
          ))}
          <button onClick={addSlide} style={addBtn}>+ Add New Slide</button>
        </div>
      </div>
      </div>

      {mediaPickerTarget && (
        <MediaPicker 
          onSelect={(url) => {
            if (mediaPickerTarget.type === 'poster') setPosterImage(url);
            if (mediaPickerTarget.type === 'square') setSquarePoster(url);
            if (mediaPickerTarget.type === 'landscape') setLandscapePoster(url);
            if (mediaPickerTarget.type === 'author') setAuthorImage(url);
            if (mediaPickerTarget.type === 'slide' && mediaPickerTarget.index !== undefined) {
              updateSlide(mediaPickerTarget.index, 'image', url);
            }
            setMediaPickerTarget(null);
          }}
          onClose={() => setMediaPickerTarget(null)}
        />
      )}
    </div>
  );
}

const fieldLabel: React.CSSProperties = { fontSize: '12px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '6px' };
const draftBtn: React.CSSProperties = { background: '#f1f5f9', color: '#475569', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' };
const publishBtn: React.CSSProperties = { background: '#2563eb', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' };
const panelStyle: React.CSSProperties = { background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '20px' };
const panelHeader: React.CSSProperties = { margin: '0 0 20px 0', fontSize: '18px', fontWeight: 700 };
const inputStyle: React.CSSProperties = { width: '100%', padding: '12px 16px', marginBottom: '16px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', boxSizing: 'border-box' };
const uploadBtnStyle: React.CSSProperties = { background: '#f1f5f9', padding: '12px 20px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap' };
const slideBox: React.CSSProperties = { display: 'flex', gap: '20px', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '12px', marginBottom: '16px', background: '#f8fafc' };
const delBtn: React.CSSProperties = { background: '#fee2e2', color: '#dc2626', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' };
const addBtn: React.CSSProperties = { width: '100%', padding: '16px', background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 };
