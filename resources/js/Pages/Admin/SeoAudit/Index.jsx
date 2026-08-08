import React, { useState, useEffect } from 'react';
import { Link, Head } from '@inertiajs/react';
import { format } from 'date-fns';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function SeoAuditDashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch((typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '') + '/api/admin/posts')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Sort posts by SEO score ascending (lowest first) to highlight ones needing work
          const sorted = data.sort((a, b) => (a.seoScore || 0) - (b.seoScore || 0));
          setPosts(sorted);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading SEO Data...</div>;
  }

  return (
    <div>
      <Head title="SEO Audit | Admin" />
      <div style={{ marginBottom: '32px' }}>
         <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '8px' }}>
            SEO Audit Dashboard
         </h1>
         <p style={{ color: '#64748b', fontSize: '15px', maxWidth: '600px' }}>
            Identify posts with low SEO scores and use AI to automatically generate missing metadata, tags, and FAQs.
         </p>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Article</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>SEO Score</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => {
               const score = post.seoScore || 0;
               const scoreColor = score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
               const scoreBg = score >= 80 ? '#ecfdf5' : score >= 50 ? '#fffbeb' : '#fef2f2';

               return (
                  <tr key={post.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                     <td style={{ padding: '16px 24px' }}>
                        <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '4px', fontSize: '15px' }}>{post.title}</div>
                        <div style={{ fontSize: '13px', color: '#64748b' }}>Updated: {format(new Date(post.date || new Date()), 'MMM d, yyyy')}</div>
                     </td>
                     <td style={{ padding: '16px 24px' }}>
                        <span style={{ 
                           display: 'inline-block',
                           padding: '4px 8px', 
                           borderRadius: '4px', 
                           fontSize: '11px', 
                           fontWeight: 700, 
                           textTransform: 'uppercase',
                           background: post.published ? '#eff6ff' : '#f1f5f9',
                           color: post.published ? '#2563eb' : '#64748b'
                        }}>
                           {post.published ? 'Published' : 'Draft'}
                        </span>
                     </td>
                     <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                           <div style={{ 
                              background: scoreBg, 
                              color: scoreColor, 
                              fontWeight: 800, 
                              padding: '4px 10px', 
                              borderRadius: '20px',
                              fontSize: '13px',
                              border: `1px solid ${scoreColor}30`
                           }}>
                              {score}/100
                           </div>
                           {score < 80 && (
                              <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: 600 }}>Needs Work</span>
                           )}
                        </div>
                     </td>
                     <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        <Link 
                           href={window.BASE_PATH + `/admin/posts/edit/${post.id}`}
                           style={{
                              display: 'inline-block',
                              background: score < 80 ? '#9333ea' : '#f1f5f9',
                              color: score < 80 ? '#fff' : '#475569',
                              padding: '8px 16px',
                              borderRadius: '6px',
                              textDecoration: 'none',
                              fontSize: '13px',
                              fontWeight: 600,
                              transition: 'all 0.2s',
                              border: score < 80 ? 'none' : '1px solid #cbd5e1',
                              whiteSpace: 'nowrap'
                           }}
                        >
                           {score < 80 ? '✨ Improve with AI' : 'Edit Post'}
                        </Link>
                     </td>
                  </tr>
               );
            })}
            {posts.length === 0 && (
                <tr>
                    <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No posts available for audit.</td>
                </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

SeoAuditDashboard.layout = page => <AdminLayout>{page}</AdminLayout>;
