import React, { useState, useEffect } from 'react';
import { Link, Head } from '@inertiajs/react';
import DeleteButton from '../DeleteButton';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function StoriesDashboard() {
  const BASE = typeof window !== 'undefined' && window.location.pathname.startsWith('/list/public') ? '/list/public' : '';
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch((typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '') + '/api/admin/stories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setStories(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Stories...</div>;
  }

  return (
    <div style={{ margin: 0, padding: 0 }}>
      <Head title="Web Stories | Admin" />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, margin: 0, color: '#0f172a' }}>Web Stories</h1>
        <Link href={BASE + "/admin/stories/new"} style={{ background: '#2563eb', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, whiteSpace: 'nowrap' }}>+ Create Story</Link>
      </div>

      <div style={{ display: 'flex', gap: '24px', fontSize: '14px', marginBottom: '24px', color: '#64748b', fontWeight: 600 }}>
        <div>Total Stories: <span style={{ color: '#2563eb' }}>{stories.length}</span></div>
        <div>Published: <span style={{ color: '#059669' }}>{stories.filter(s => s.published).length}</span></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '20px' }}>
        {stories.map((story) => (
          <div key={story.id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4' }}>
              <img src={story.posterImage || 'https://images.unsplash.com/photo-1542435503-956c469947f6?w=800&q=80'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', color: '#fff' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>{story.title}</h3>
                <div style={{ fontSize: '11px', opacity: 0.8 }}>{story.slides?.length || 0} Slides</div>
              </div>
            </div>
            <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '12px', fontSize: '13px' }}>
                <Link href={BASE + `/admin/stories/edit/${story.id}`} style={{ color: '#2563eb', fontWeight: 600 }}>Edit</Link>
                <DeleteButton id={story.id} endpoint="/api/admin/stories" onSuccess={() => setStories(s => s.filter(x => x.id !== story.id))} label="Delete" />
              </div>
              <Link href={BASE + `/stories/${story.slug}`} style={{ fontSize: '12px', color: '#64748b' }}>View ↗</Link>
            </div>
          </div>
        ))}
        {stories.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', color: '#64748b' }}>
            No Web Stories found.
          </div>
        )}
      </div>
    </div>
  );
}

StoriesDashboard.layout = page => <AdminLayout>{page}</AdminLayout>;
