import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch((typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '') + '/api/admin/users')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setUsers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch((window.location.pathname.startsWith('/list/public') ? '/list/public' : '') + `/api/admin/users?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== id));
      } else {
        alert('Failed to delete user');
      }
    } catch (e) {
      alert('Error deleting user');
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <Head title="Users | Admin" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Registered Users</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Manage community members and users</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '1.5rem' }}>
        {users.map(user => (
          <div key={user.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img loading="lazy" decoding="async" fetchPriority="low" src={user.profile_picture || 'https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png'} alt={user.username} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>{user.name}</h3>
                <div style={{ fontSize: '14px', color: '#64748b' }}>@{user.username}</div>
              </div>
            </div>
            
            <p style={{ fontSize: '14px', color: '#475569', margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {user.bio || 'No bio provided'}
            </p>

            <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
                <span>Role: {user.role || (user.is_admin ? 'Admin' : 'User')}</span>
                <span>Karma: {(user.post_karma || 0) + (user.comment_karma || 0)}</span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
              <button onClick={() => handleDelete(user.id)} style={{ flex: 1, background: '#fef2f2', color: '#ef4444', padding: '8px', borderRadius: '8px', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '14px', whiteSpace: 'nowrap' }}>Delete User</button>
            </div>
          </div>
        ))}
      </div>
      
      {users.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '16px', color: '#64748b' }}>
          No users registered yet.
        </div>
      )}
    </div>
  );
}

UsersPage.layout = page => <AdminLayout>{page}</AdminLayout>;
