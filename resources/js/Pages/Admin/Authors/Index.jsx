import React, { useState, useEffect } from 'react';
import { Link, Head } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function AuthorsPage() {
  const BASE = typeof window !== 'undefined' && window.location.pathname.startsWith('/list/public') ? '/list/public' : '';
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/authors')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAuthors(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this author?')) return;
    try {
      const res = await fetch((window.location.pathname.startsWith('/list/public') ? '/list/public' : '') + `/api/admin/authors?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAuthors(prev => prev.filter(a => a.id !== id));
      } else {
        alert('Failed to delete');
      }
    } catch (e) {
      alert('Error deleting author');
    }
  };

  if (loading) return <div>Loading authors...</div>;

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <Head title="Authors | Admin" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Author Profiles</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Manage writers and their E-E-A-T credentials</p>
        </div>
        <Link href={BASE + "/admin/authors/new"} style={{ background: '#2563eb', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, textDecoration: 'none' }}>
          + Add New Author
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {authors.map(author => (
          <div key={author.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img src={author.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80'} alt={author.name} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>{author.name}</h3>
                <div style={{ fontSize: '14px', color: '#64748b' }}>{author.jobTitle}</div>
              </div>
            </div>
            
            <p style={{ fontSize: '14px', color: '#475569', margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {author.bio}
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
              <Link href={BASE + `/admin/authors/edit/${author.id}`} style={{ flex: 1, textAlign: 'center', background: '#eff6ff', color: '#2563eb', padding: '8px', borderRadius: '8px', fontWeight: 700, textDecoration: 'none', fontSize: '14px' }}>Edit Profile</Link>
              <button onClick={() => handleDelete(author.id)} style={{ flex: 1, background: '#fef2f2', color: '#ef4444', padding: '8px', borderRadius: '8px', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '14px' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      
      {authors.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '16px', color: '#64748b' }}>
          No authors created yet. Create one to easily select them when writing articles.
        </div>
      )}
    </div>
  );
}

AuthorsPage.layout = page => <AdminLayout>{page}</AdminLayout>;
