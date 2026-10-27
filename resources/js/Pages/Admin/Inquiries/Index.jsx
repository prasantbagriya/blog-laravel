import React, { useState, useEffect, Suspense } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import {
  Phone,
  MessageCircle,
  GraduationCap,
  Building2,
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Trash2,
  RefreshCw,
  User,
  Inbox,
  Send,
  AlertCircle,
  Check,
  ChevronDown
} from 'lucide-react';

const AdminLayout = React.lazy(() => import('../../../Layouts/AdminLayout'));

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [stats, setStats] = useState({ total: 0, new: 0, contacted: 0, admitted: 0, closed: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const res = await axios.get(`/api/admin/inquiries?${params.toString()}`);
      if (res.data?.success) {
        setInquiries(res.data.inquiries?.data || []);
        if (res.data.stats) setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchInquiries();
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await axios.patch(`/api/admin/inquiries/${id}/status`, { status: newStatus });
      setInquiries(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      // Refresh stats
      const statsRes = await axios.get('/api/admin/inquiries?per_page=1');
      if (statsRes.data?.stats) setStats(statsRes.data.stats);
    } catch (err) {
      alert('Error updating inquiry status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this inquiry?')) return;
    try {
      await axios.delete(`/api/admin/inquiries/${id}`);
      setInquiries(prev => prev.filter(item => item.id !== id));
      setStats(prev => ({ ...prev, total: Math.max(0, prev.total - 1) }));
    } catch (err) {
      alert('Error deleting inquiry');
    }
  };

  const cleanPhone = (phoneStr) => {
    const raw = (phoneStr || '').replace(/[^0-9]/g, '');
    return raw.startsWith('91') ? raw : (raw.length === 10 ? `91${raw}` : raw);
  };

  const statusBadge = (status) => {
    switch (status) {
      case 'new':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">New Lead</span>;
      case 'contacted':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">Contacted</span>;
      case 'admitted':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">Admitted</span>;
      case 'closed':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-400">Closed</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-600">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <Head title="Direct Student Inquiries & Leads | Admin" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <GraduationCap className="w-8 h-8 text-amber-500" />
            <span>Institute Inquiries & Leads</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Real-time admission inquiries and WhatsApp leads submitted through institute profiles.
          </p>
        </div>

        <button
          onClick={fetchInquiries}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Leads</span>
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Leads</div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">{stats.total}</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-amber-200 dark:border-amber-900/40 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">New (Uncontacted)</div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">{stats.new}</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-blue-200 dark:border-blue-900/40 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Contacted</div>
          <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">{stats.contacted}</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Admitted</div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{stats.admitted}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, phone, course, or institute..."
            className="w-full pl-10 pr-24 py-2 bg-slate-100 dark:bg-zinc-800 border border-transparent focus:border-amber-500 rounded-xl text-xs font-medium text-slate-900 dark:text-white outline-none"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition"
          >
            Search
          </button>
        </form>

        {/* Status Filter Tabs */}
        <div className="flex gap-1 bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All' },
            { id: 'new', label: 'New' },
            { id: 'contacted', label: 'Contacted' },
            { id: 'admitted', label: 'Admitted' },
            { id: 'closed', label: 'Closed' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries Table / Cards */}
      {loading ? (
        <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 text-slate-500 text-xs">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-500 mb-2" />
          Loading inquiries...
        </div>
      ) : inquiries.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-2">
          <Inbox className="w-10 h-10 mx-auto text-slate-300 dark:text-zinc-700" />
          <h3 className="font-bold text-slate-800 dark:text-zinc-200 text-base">No inquiries found</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto">
            {searchQuery ? 'Try adjusting your search terms or filter.' : 'Inquiries submitted through institute pages will appear here.'}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-xs border-collapse">
              <thead className="bg-slate-50 dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-400 uppercase font-bold border-b border-slate-200 dark:border-zinc-700">
                <tr>
                  <th className="p-3.5">Student / Contact</th>
                  <th className="p-3.5">Target Institute</th>
                  <th className="p-3.5">Course & Query</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Received</th>
                  <th className="p-3.5 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 font-medium">
                {inquiries.map((item) => {
                  const targetWa = cleanPhone(item.phone);
                  const isUpdating = updatingId === item.id;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition">
                      {/* Student info */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                            {item.student_name?.[0]?.toUpperCase() || 'S'}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900 dark:text-white text-sm">{item.student_name}</div>
                            <div className="text-slate-500 font-mono text-[11px] flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <a href={`tel:${item.phone}`} className="hover:text-blue-600 hover:underline">
                                {item.phone}
                              </a>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Institute */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5 text-slate-800 dark:text-zinc-200 font-bold">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{item.business?.name || item.business_name || 'Direct Institute'}</span>
                        </div>
                      </td>

                      {/* Course & Message */}
                      <td className="p-3.5 max-w-xs">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-bold text-[11px] mb-1">
                          {item.course || 'General Inquiry'}
                        </span>
                        {item.message && (
                          <p className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                            "{item.message}"
                          </p>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        <select
                          value={item.status}
                          disabled={isUpdating}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className="text-xs font-bold rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2.5 py-1 text-slate-800 dark:text-zinc-200 outline-none focus:ring-2 focus:ring-amber-500/20"
                        >
                          <option value="new">🟡 New</option>
                          <option value="contacted">🔵 Contacted</option>
                          <option value="admitted">🟢 Admitted</option>
                          <option value="closed">⚪ Closed</option>
                        </select>
                      </td>

                      {/* Date */}
                      <td className="p-3.5 text-slate-500 whitespace-nowrap text-[11px]">
                        {new Date(item.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* WhatsApp Button */}
                          <a
                            href={`https://wa.me/${targetWa}?text=${encodeURIComponent(`Hello ${item.student_name}, thank you for inquiring about ${item.course || 'admission'} at ${item.business_name || 'the coaching institute'}. How can we assist you?`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Chat on WhatsApp"
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>

                          {/* Call Button */}
                          <a
                            href={`tel:${item.phone}`}
                            title="Call Student"
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                          >
                            <Phone className="w-4 h-4" />
                          </a>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(item.id)}
                            title="Delete Lead"
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

InquiriesPage.layout = page => (
  <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Inquiries...</div>}>
    <AdminLayout>{page}</AdminLayout>
  </Suspense>
);
