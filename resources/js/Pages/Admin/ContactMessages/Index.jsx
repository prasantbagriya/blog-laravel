import React, { useState, useEffect, Suspense } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';

const AdminLayout = React.lazy(() => import('../../../Layouts/AdminLayout'));

export default function ContactMessagesPage() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMessages = () => {
        setLoading(true);
        axios.get((typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '') + '/api/admin/contact-messages')
            .then(res => {
                setMessages(res.data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const markAsRead = async (id) => {
        try {
            await axios.patch((typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '') + `/api/admin/contact-messages/${id}/read`);
            fetchMessages();
        } catch (e) {
            alert('Error updating message status');
        }
    };

    const deleteMessage = async (id) => {
        if (!confirm('Are you sure you want to delete this message?')) return;
        try {
            await axios.delete((typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '') + `/api/admin/contact-messages/${id}`);
            fetchMessages();
        } catch (e) {
            alert('Error deleting message');
        }
    };

    return (
        <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
            <Head title="Contact Messages | Admin" />
            <div style={{ marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Contact Messages</h1>
                    <p style={{ color: '#64748b', margin: 0 }}>View and manage inquiries from the Contact Us page</p>
                </div>
                <button onClick={fetchMessages} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                    Refresh
                </button>
            </div>

            {loading ? (
                <div>Loading messages...</div>
            ) : messages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#64748b' }}>
                    No messages found.
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {messages.map(msg => (
                        <div key={msg.id} style={{ 
                            background: '#fff', 
                            border: '1px solid #e2e8f0', 
                            borderLeft: msg.status === 'unread' ? '4px solid #f59e0b' : '4px solid #10b981',
                            borderRadius: '12px', 
                            padding: '1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{msg.subject}</h3>
                                        {msg.status === 'unread' ? (
                                            <span style={{ background: '#fef3c7', color: '#d97706', padding: '2px 8px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                                                New
                                            </span>
                                        ) : (
                                            <span style={{ background: '#d1fae5', color: '#059669', padding: '2px 8px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z"/><path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10"/></svg>
                                                Read
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>
                                        From: <span style={{ color: '#0f172a', fontWeight: 700 }}>{msg.name}</span> &lt;<a href={`mailto:${msg.email}`} style={{ color: '#2563eb', textDecoration: 'none' }}>{msg.email}</a>&gt;
                                    </div>
                                    {msg.phone && (
                                        <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500, marginTop: '4px' }}>
                                            Phone: <a href={`tel:${msg.phone}`} style={{ color: '#2563eb', textDecoration: 'none' }}>{msg.phone}</a>
                                        </div>
                                    )}
                                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                                        Received: {new Date(msg.created_at).toLocaleString()}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {msg.status === 'unread' && (
                                        <button 
                                            onClick={() => markAsRead(msg.id)}
                                            style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '8px 12px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg> 
                                            Mark as Read
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => deleteMessage(msg.id)}
                                        style={{ background: '#fef2f2', color: '#ef4444', border: 'none', padding: '8px 12px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', fontSize: '15px', color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                                {msg.message}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

ContactMessagesPage.layout = page => (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Admin Workspace...</div>}>
        <AdminLayout>{page}</AdminLayout>
    </Suspense>
);
