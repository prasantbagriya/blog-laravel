import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import DeleteButton from '../DeleteButton';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const res = await fetch((typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '') + '/api/admin/businesses');
      const data = await res.json();
      if (Array.isArray(data)) setBusinesses(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', color: '#64748b' }}>Loading Businesses...</div>;

  return (
    <div>
      <Head title="Businesses | Admin" />
      <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Business Listings</h1>
      <p style={{ color: '#64748b', marginBottom: '32px' }}>Manage user-submitted business profiles across the platform.</p>

      <div style={{ width: '100%', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Business</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Category</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Stats</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Date Added</th>
                <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {businesses.map(business => (
                <tr key={business.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img 
                        src={business.logo} 
                        alt={business.name} 
                        style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e2e8f0' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '15px' }}>{business.name}</div>
                        <a href={`/reviews/${business.category_name}/${business.slug}`} target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none' }}>
                          View Live ↗
                        </a>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#475569' }}>
                    <span style={{ display: 'inline-block', padding: '4px 8px', background: '#f1f5f9', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}>
                      {business.category_name}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#475569' }}>
                    <div><span style={{ fontWeight: 600 }}>{business.trust_score}</span> Trust Score</div>
                    <div style={{ fontSize: '12px', marginTop: '2px' }}>{business.review_count} Reviews</div>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#475569' }}>
                    {new Date(business.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', alignItems: 'center' }}>
                      {/* Using existing DeleteButton component pattern */}
                      <DeleteButton 
                        endpoint="/api/admin/businesses"
                        id={business.id}
                        onSuccess={fetchBusinesses}
                        label="Delete"
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {businesses.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
                    <div style={{ fontSize: '16px', fontWeight: 500 }}>No businesses listed yet.</div>
                    <p style={{ marginTop: '8px' }}>User submitted businesses will appear here.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

BusinessesPage.layout = page => <AdminLayout>{page}</AdminLayout>;
