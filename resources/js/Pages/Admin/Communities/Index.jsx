import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Edit, Trash2, Loader2, FolderSearch } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCommunities = async () => {
    try {
      const res = await fetch((typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '') + '/api/admin/communities');
      const data = await res.json();
      if (Array.isArray(data)) setCommunities(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this community?')) return;
    try {
      const res = await fetch(`${typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : ''}/api/admin/communities?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCommunities(communities.filter(c => c.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const thStyle = { padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' };
  const tdStyle = { padding: '16px 24px', fontSize: '14px', color: '#334155', borderBottom: '1px solid #e2e8f0' };

  return (
    <AdminLayout>
      <Head title="Admin - Communities" />
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>Communities</h1>
        </div>

        <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '64px 20px', textAlign: 'center', color: '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <Loader2 size={32} style={{ color: '#cbd5e1', animation: 'spin 1s linear infinite' }} />
              <div style={{ fontSize: '15px', fontWeight: 500 }}>Loading communities...</div>
              <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            </div>
          ) : communities.length === 0 ? (
            <div style={{ padding: '80px 20px', textAlign: 'center', color: '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ background: '#f1f5f9', padding: '16px', borderRadius: '50%' }}>
                <FolderSearch size={40} style={{ color: '#94a3b8' }} />
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>No communities found</div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>Get started by creating a new community.</div>
              </div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', whiteSpace: 'nowrap' }}>
                <thead style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <tr>
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Owner</th>
                    <th style={thStyle}>Members</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {communities.map(community => (
                    <tr key={community.id} style={{ transition: 'background-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <td style={tdStyle}>{community.id}</td>
                      <td style={tdStyle}>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{community.display_name || community.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>r/{community.name}</div>
                      </td>
                      <td style={tdStyle}>
                        {community.owner ? (community.owner.name || community.owner.username) : 'System'}
                      </td>
                      <td style={tdStyle}>{community.members_count || 0}</td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {community.is_private && <span style={{ background: '#fee2e2', color: '#ef4444', padding: '2px 8px', borderRadius: '9999px', fontSize: '11px', fontWeight: 600 }}>Private</span>}
                          {community.is_nsfw && <span style={{ background: '#fef3c7', color: '#f59e0b', padding: '2px 8px', borderRadius: '9999px', fontSize: '11px', fontWeight: 600 }}>NSFW</span>}
                          {!community.is_private && !community.is_nsfw && <span style={{ background: '#dcfce7', color: '#22c55e', padding: '2px 8px', borderRadius: '9999px', fontSize: '11px', fontWeight: 600 }}>Public</span>}
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Link href={`${typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : ''}/admin/communities/edit/${community.id}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#f8fafc', color: '#475569', borderRadius: '6px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }} onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.transform = 'scale(1.02)'; }} onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'scale(1)'; }}>
                            <Edit size={14} /> Edit
                          </Link>
                          <button onClick={() => handleDelete(community.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#fff', color: '#ef4444', borderRadius: '6px', fontSize: '13px', fontWeight: 600, border: '1px solid #fecaca', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }} onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.transform = 'scale(1.02)'; }} onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'scale(1)'; }}>
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
