import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import DeleteButton from '../DeleteButton';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function CommunityPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch((typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '') + '/api/admin/community-posts');
      const data = await res.json();
      if (Array.isArray(data)) setPosts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', color: '#64748b' }}>Loading Community Posts...</div>;

  return (
    <div>
      <Head title="Community Posts | Admin" />
      <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Community Posts</h1>
      <p style={{ color: '#64748b', marginBottom: '32px' }}>Manage all posts submitted to communities. These posts are separate from the main blog.</p>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Post</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Community</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Author</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Date</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => {
                const isReported = post.reports_count > 0;
                return (
                <tr key={post.id} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: isReported ? '#fee2e2' : 'transparent' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontWeight: 600, color: isReported ? '#b91c1c' : '#0f172a', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {post.title}
                      {isReported && (
                        <span style={{ fontSize: '10px', background: '#ef4444', color: 'white', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                          {post.reports_count} Reports
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '13px', color: isReported ? '#991b1b' : '#64748b', marginTop: '4px', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {post.content ? post.content.replace(/<[^>]*>?/gm, '') : 'No content'}
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#475569' }}>
                    <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>
                      {post.community ? post.community.name : post.community_id}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#475569' }}>
                    {post.author ? post.author.name || post.author.username : 'Unknown'}
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#475569' }}>
                    {new Date(post.created_at || post.date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', alignItems: 'center' }}>
                      {/* You can add an external link here to view the post on the community if needed */}
                      <DeleteButton 
                        endpoint="/api/admin/posts"
                        id={post.id}
                        onSuccess={fetchPosts}
                        label="Delete"
                      />
                    </div>
                  </td>
                </tr>
              )})}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>No community posts found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

CommunityPostsPage.layout = page => <AdminLayout>{page}</AdminLayout>;
