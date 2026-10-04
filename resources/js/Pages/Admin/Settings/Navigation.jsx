import React, { useState, useEffect, Suspense } from 'react';
import { Head } from '@inertiajs/react';

const AdminLayout = React.lazy(() => import('../../../Layouts/AdminLayout'));

export default function NavigationManager() {
  const [navItems, setNavItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const basePath = typeof window !== 'undefined' && window.location.pathname.startsWith('/list/public') ? '/list/public' : '';

  useEffect(() => {
    fetchNavItems();
  }, []);

  const fetchNavItems = () => {
    fetch(basePath + '/api/admin/navigations')
      .then(res => res.json())
      .then(data => {
        setNavItems(data);
        setLoading(false);
      });
  };

  const handleAddItem = () => {
    const newItem = {
      id: '', // Empty ID means it's new, backend will create one or we wait for save
      tempId: crypto.randomUUID(),
      name: '',
      url: '',
      order: navItems.length,
      is_active: true,
      parent_id: null
    };
    setNavItems([...navItems, newItem]);
  };

  const saveItem = async (item) => {
    if (!item.name.trim()) return; // Don't save if name is empty
    
    // If it's a new item, ID might be empty string
    const payload = { ...item };
    if (!payload.id) delete payload.id;

    try {
      const res = await fetch(basePath + '/api/admin/navigations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        // re-fetch to get accurate IDs from DB
        fetchNavItems();
      }
    } catch (e) {
      console.error(e);
      alert('Failed to save navigation item');
    }
  };

  const handleDelete = async (item) => {
    if (!confirm('Delete this navigation item?')) return;
    
    // If it hasn't been saved to DB yet
    if (!item.id) {
      setNavItems(navItems.filter(n => n.tempId !== item.tempId));
      return;
    }

    try {
      await fetch(basePath + `/api/admin/navigations`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id })
      });
      setNavItems(navItems.filter(n => n.id !== item.id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleFieldChange = (identifier, isNew, field, value) => {
    const updated = navItems.map(n => {
      if (isNew && n.tempId === identifier) return { ...n, [field]: value };
      if (!isNew && n.id === identifier) return { ...n, [field]: value };
      return n;
    });
    setNavItems(updated);
  };
  
  const handleFieldBlur = (item) => {
    saveItem(item);
  };

  const moveItem = (index, dir) => {
    if (index + dir < 0 || index + dir >= navItems.length) return;
    const newItems = [...navItems];
    const temp = newItems[index];
    newItems[index] = newItems[index + dir];
    newItems[index + dir] = temp;
    const ordered = newItems.map((n, i) => ({ ...n, order: i }));
    setNavItems(ordered);
    // Save all to update order
    ordered.forEach(n => {
      if (n.id) saveItem(n);
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <Head title="Navigation Menu | Admin" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Navigation Menu</h1>
          <p style={{ color: '#64748b', margin: 0 }}>Manage the main menu links shown on the website</p>
        </div>
        <button onClick={handleAddItem} style={{ background: '#2563eb', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, textDecoration: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          + Add Link
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {navItems.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', background: '#f8fafc', borderRadius: '16px', color: '#64748b' }}>
            No navigation links configured. Click "Add Link" to create one.
          </div>
        )}

        {navItems.map((item, index) => {
          const identifier = item.id || item.tempId;
          const isNew = !item.id;
          return (
            <div key={identifier} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: '#fff', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <button onClick={() => moveItem(index, -1)} disabled={index === 0} style={{ padding: '4px', cursor: index === 0 ? 'not-allowed' : 'pointer', background: '#f1f5f9', border: 'none', borderRadius: '4px' }}>↑</button>
                <button onClick={() => moveItem(index, 1)} disabled={index === navItems.length - 1} style={{ padding: '4px', cursor: index === navItems.length - 1 ? 'not-allowed' : 'pointer', background: '#f1f5f9', border: 'none', borderRadius: '4px' }}>↓</button>
              </div>

              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '1rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Label Name</label>
                  <input 
                    type="text" 
                    value={item.name} 
                    onChange={e => handleFieldChange(identifier, isNew, 'name', e.target.value)} 
                    onBlur={() => handleFieldBlur(item)} 
                    style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', width: '100%' }} 
                    placeholder="e.g., About Us" 
                  />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>URL or Path</label>
                  <input 
                    type="text" 
                    value={item.url || ''} 
                    onChange={e => handleFieldChange(identifier, isNew, 'url', e.target.value)} 
                    onBlur={() => handleFieldBlur(item)} 
                    style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', width: '100%', fontFamily: 'monospace' }} 
                    placeholder="e.g., /about or https://google.com" 
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%', paddingBottom: '4px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#475569' }}>
                    <input 
                      type="checkbox" 
                      checked={item.is_active} 
                      onChange={e => {
                        handleFieldChange(identifier, isNew, 'is_active', e.target.checked);
                        saveItem({ ...item, is_active: e.target.checked });
                      }}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    Active
                  </label>
                </div>
              </div>

              <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '1.5rem', display: 'flex', alignItems: 'center' }}>
                <button onClick={() => handleDelete(item)} style={{ padding: '8px', background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

NavigationManager.layout = page => (
  <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Admin Workspace...</div>}>
    <AdminLayout>{page}</AdminLayout>
  </Suspense>
);
