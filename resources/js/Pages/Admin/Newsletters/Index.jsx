import React, { useState, useEffect, Suspense } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';

const AdminLayout = React.lazy(() => import('../../../Layouts/AdminLayout'));

export default function NewslettersPage() {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSubscribers = () => {
        setLoading(true);
        axios.get((typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '') + '/api/admin/newsletters')
            .then(res => {
                setSubscribers(res.data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const deleteSubscriber = async (id) => {
        if (!confirm('Are you sure you want to delete this subscriber?')) return;
        try {
            await axios.delete((typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '') + `/api/admin/newsletters/${id}`);
            fetchSubscribers();
        } catch (e) {
            alert('Error deleting subscriber');
        }
    };

    return (
        <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
            <Head title="Newsletters | Admin" />
            <div style={{ marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Newsletter Subscribers</h1>
                    <p style={{ color: '#64748b', margin: 0 }}>View and manage newsletter subscribers</p>
                </div>
                <button onClick={fetchSubscribers} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                    Refresh
                </button>
            </div>

            {loading ? (
                <div>Loading subscribers...</div>
            ) : subscribers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#64748b' }}>
                    No subscribers found.
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {subscribers.map(sub => (
                        <div key={sub.id} style={{ 
                            background: '#fff', 
                            border: '1px solid #e2e8f0', 
                            borderLeft: '4px solid #3b82f6',
                            borderRadius: '12px', 
                            padding: '1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                            {sub.email}
                                        </h3>
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
                                        Source: <span style={{ color: '#0f172a', fontWeight: 700 }}>{sub.source || 'N/A'}</span>
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
                                        Type: <span style={{ color: '#0f172a', fontWeight: 700 }}>{sub.type || 'N/A'}</span>
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                                        Subscribed on: {new Date(sub.created_at).toLocaleString()}
                                    </div>
                                </div>
                                <div>
                                    <button 
                                        onClick={() => deleteSubscriber(sub.id)}
                                        style={{ background: '#fef2f2', color: '#ef4444', border: 'none', padding: '8px 12px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

NewslettersPage.layout = page => (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Admin Workspace...</div>}>
        <AdminLayout>{page}</AdminLayout>
    </Suspense>
);
