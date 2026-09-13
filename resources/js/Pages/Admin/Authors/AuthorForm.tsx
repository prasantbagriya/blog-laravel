import { useState } from 'react';
import { router } from '@inertiajs/react';


import MediaPicker from "../components/MediaPicker";

export default function AuthorForm({ author }: { author?: any }) {
  const [name, setName] = useState(author?.name || '');
  const [bio, setBio] = useState(author?.bio || '');
  const [image, setImage] = useState(author?.image || '');
  const [jobTitle, setJobTitle] = useState(author?.jobTitle || '');
  const [experienceYears, setExperienceYears] = useState(author?.experienceYears || 0);
  
  const [twitter, setTwitter] = useState(author?.socials?.twitter || '');
  const [linkedin, setLinkedin] = useState(author?.socials?.linkedin || '');
  const [website, setWebsite] = useState(author?.socials?.website || '');

  const [awards, setAwards] = useState<string[]>(author?.awards || []);
  const [awardInput, setAwardInput] = useState('');

  const [alumniOf, setAlumniOf] = useState<{name: string, sameAs: string}[]>(author?.alumniOf || []);
  const [alumniName, setAlumniName] = useState('');
  const [alumniSameAs, setAlumniSameAs] = useState('');

  const [knowsAbout, setKnowsAbout] = useState<{name: string, sameAs: string}[]>(author?.knowsAbout || []);
  const [knowsAboutName, setKnowsAboutName] = useState('');
  const [knowsAboutSameAs, setKnowsAboutSameAs] = useState('');
  
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Clear the input so the same file can be selected again if needed
    event.target.value = '';

    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch((typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '') + '/api/admin/upload', { method: 'POST', body: formData });
      const result: any = await res.json();
      if (result.success && result.url) {
        setImage(result.url);
      } else {
        alert(`Upload failed: ${result.error || 'Unknown error'}`);
      }
    } catch (e: any) {
      console.error(e);
      alert(`Upload error: ${e.message || 'Unknown error'}`);
    }
  };

  const handleSave = async () => {
    if (!name) return alert('Name is required');
    setIsSaving(true);
    
    const newAuthor: any = {
      id: author?.id || crypto.randomUUID(),
      name,
      bio,
      image,
      jobTitle,
      experienceYears,
      awards: awards.length > 0 ? awards : undefined,
      alumniOf: alumniOf.length > 0 ? alumniOf : undefined,
      knowsAbout: knowsAbout.length > 0 ? knowsAbout : undefined,
      socials: { twitter, linkedin, website }
    };

    try {
      const res = await fetch((typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '') + '/api/admin/authors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAuthor)
      });
      if (res.ok) {
        const BASE = typeof window !== 'undefined' && window.location.pathname.startsWith('/list/public') ? '/list/public' : '';
        router.visit(BASE + '/admin/authors');
      } else {
        alert('Failed to save');
      }
    } catch (e) {
      console.error(e);
      alert('Error saving author');
    }
    setIsSaving(false);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
      <h2 style={{ marginBottom: '2rem' }}>{author ? 'Edit Author Profile' : 'New Author Profile'}</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: 700, fontSize: '14px', color: '#475569' }}>Name</label>
          <input value={name} onChange={e => setName(e.target.value)} style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }} placeholder="John Doe" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: 700, fontSize: '14px', color: '#475569' }}>Job Title</label>
          <input value={jobTitle} onChange={e => setJobTitle(e.target.value)} style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }} placeholder="Senior Editor" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: 700, fontSize: '14px', color: '#475569' }}>Bio</label>
          <textarea value={bio} onChange={e => setBio(e.target.value)} style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', minHeight: '100px' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: 700, fontSize: '14px', color: '#475569' }}>Profile Image URL</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input value={image} onChange={e => setImage(e.target.value)} style={{ flex: 1, padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }} />
            <button type="button" onClick={() => setIsMediaPickerOpen(true)} style={{ background: '#f8fafc', padding: '10px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer', fontWeight: 600, fontSize: '14px', color: '#475569' }}>
              Library
            </button>
            <label style={{ background: '#f1f5f9', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
              Upload
              <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
            </label>
          </div>
          {image && <img loading="lazy" decoding="async" fetchPriority="low" src={image} alt="Preview" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginTop: '10px' }} />}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: 700, fontSize: '14px', color: '#475569' }}>Experience (Years)</label>
          <input type="number" value={experienceYears} onChange={e => setExperienceYears(parseInt(e.target.value) || 0)} style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 700, fontSize: '14px', color: '#475569' }}>Twitter URL</label>
            <input value={twitter} onChange={e => setTwitter(e.target.value)} style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 700, fontSize: '14px', color: '#475569' }}>LinkedIn URL</label>
            <input value={linkedin} onChange={e => setLinkedin(e.target.value)} style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontWeight: 700, fontSize: '14px', color: '#475569' }}>Website URL</label>
            <input value={website} onChange={e => setWebsite(e.target.value)} style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }} />
          </div>
        </div>

        {/* EEAT: Awards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
          <label style={{ fontWeight: 700, fontSize: '14px', color: '#475569' }}>Awards & Recognitions</label>
          {awards.map((award, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '14px' }}>🏆 {award}</span>
              <button onClick={() => setAwards(awards.filter((_, idx) => idx !== i))} style={{ border: 'none', background: 'none', color: '#dc2626', cursor: 'pointer' }}>✕</button>
            </div>
          ))}
          <div style={{ display: 'flex', gap: '10px' }}>
            <input value={awardInput} onChange={e => setAwardInput(e.target.value)} placeholder="e.g. Best Editor 2023" style={{ flex: 1, padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }} />
            <button onClick={() => { if (awardInput.trim()) { setAwards([...awards, awardInput.trim()]); setAwardInput(''); } }} style={{ background: '#e2e8f0', border: 'none', padding: '0 16px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Add</button>
          </div>
        </div>

        {/* EEAT: Education / Alumni Of */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
          <label style={{ fontWeight: 700, fontSize: '14px', color: '#475569' }}>Education / Alumni Of</label>
          {alumniOf.map((alumni, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '14px' }}>🎓 {alumni.name}</span>
              <button onClick={() => setAlumniOf(alumniOf.filter((_, idx) => idx !== i))} style={{ border: 'none', background: 'none', color: '#dc2626', cursor: 'pointer' }}>✕</button>
            </div>
          ))}
          <div style={{ display: 'flex', gap: '10px' }}>
            <input value={alumniName} onChange={e => setAlumniName(e.target.value)} placeholder="Institution Name" style={{ flex: 1, padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }} />
            <input value={alumniSameAs} onChange={e => setAlumniSameAs(e.target.value)} placeholder="URL (e.g. Wikipedia link)" style={{ flex: 1, padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }} />
            <button onClick={() => { if (alumniName.trim()) { setAlumniOf([...alumniOf, { name: alumniName.trim(), sameAs: alumniSameAs.trim() }]); setAlumniName(''); setAlumniSameAs(''); } }} style={{ background: '#e2e8f0', border: 'none', padding: '0 16px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Add</button>
          </div>
        </div>

        {/* EEAT: Knows About (Expertise Topics) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
          <label style={{ fontWeight: 700, fontSize: '14px', color: '#475569' }}>Expertise Topics (Knows About)</label>
          {knowsAbout.map((topic, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '14px' }}>💡 {topic.name}</span>
              <button onClick={() => setKnowsAbout(knowsAbout.filter((_, idx) => idx !== i))} style={{ border: 'none', background: 'none', color: '#dc2626', cursor: 'pointer' }}>✕</button>
            </div>
          ))}
          <div style={{ display: 'flex', gap: '10px' }}>
            <input value={knowsAboutName} onChange={e => setKnowsAboutName(e.target.value)} placeholder="Topic Name" style={{ flex: 1, padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }} />
            <input value={knowsAboutSameAs} onChange={e => setKnowsAboutSameAs(e.target.value)} placeholder="URL (e.g. Wikipedia link)" style={{ flex: 1, padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }} />
            <button onClick={() => { if (knowsAboutName.trim()) { setKnowsAbout([...knowsAbout, { name: knowsAboutName.trim(), sameAs: knowsAboutSameAs.trim() }]); setKnowsAboutName(''); setKnowsAboutSameAs(''); } }} style={{ background: '#e2e8f0', border: 'none', padding: '0 16px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Add</button>
          </div>
        </div>

        <button 
          onClick={handleSave} 
          disabled={isSaving}
          style={{ marginTop: '1rem', background: '#2563eb', color: '#fff', padding: '14px', borderRadius: '10px', fontSize: '16px', fontWeight: 800, border: 'none', cursor: isSaving ? 'not-allowed' : 'pointer' }}
        >
          {isSaving ? 'Saving...' : 'Save Author Profile'}
        </button>
      </div>

      {isMediaPickerOpen && (
        <MediaPicker 
          onSelect={(url) => { setImage(url); setIsMediaPickerOpen(false); }}
          onClose={() => setIsMediaPickerOpen(false)}
        />
      )}
    </div>
  );
}
