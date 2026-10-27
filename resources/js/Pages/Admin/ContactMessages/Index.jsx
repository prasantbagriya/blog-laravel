import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import {
  Search,
  RefreshCw,
  Mail,
  Phone,
  Clock,
  Trash2,
  CheckCircle2,
  Check,
  Inbox,
  X,
  Filter
} from 'lucide-react';

const AdminLayout = React.lazy(() => import('../../../Layouts/AdminLayout'));

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchMessages = () => {
    setLoading(true);
    axios.get((typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '') + '/api/admin/contact-messages')
      .then(res => {
        setMessages(res.data || []);
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
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'read' } : m));
    } catch (e) {
      alert('Error updating message status');
    }
  };

  const deleteMessage = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await axios.delete((typeof window !== 'undefined' && window.BASE_PATH ? window.BASE_PATH : '') + `/api/admin/contact-messages/${id}`);
      setMessages(prev => prev.filter(m => m.id !== id));
    } catch (e) {
      alert('Error deleting message');
    }
  };

  // Filter messages by search query and status filter
  const filteredMessages = useMemo(() => {
    return messages.filter(msg => {
      // Status filter
      if (statusFilter !== 'all' && msg.status !== statusFilter) {
        return false;
      }

      // Search term
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const name = (msg.name || '').toLowerCase();
      const email = (msg.email || '').toLowerCase();
      const phone = (msg.phone || '').toLowerCase();
      const subject = (msg.subject || '').toLowerCase();
      const message = (msg.message || '').toLowerCase();

      return name.includes(q) || email.includes(q) || phone.includes(q) || subject.includes(q) || message.includes(q);
    });
  }, [messages, searchQuery, statusFilter]);

  const unreadCount = useMemo(() => messages.filter(m => m.status === 'unread').length, [messages]);
  const readCount = useMemo(() => messages.filter(m => m.status === 'read').length, [messages]);

  return (
    <div className="space-y-6">
      <Head title="Contact Messages | Admin" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Mail className="w-8 h-8 text-blue-600" />
            <span>Contact Messages</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
            View and manage inquiries received through the public Contact Us form.
          </p>
        </div>

        <button
          onClick={fetchMessages}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Theme-Matching Search Bar */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        {/* Search Bar matching theme */}
        <div className="relative flex items-center flex-1 max-w-lg w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone, subject, or message content..."
            className="w-full h-10 pl-10 pr-9 bg-slate-100 dark:bg-zinc-800 border border-slate-200/60 dark:border-zinc-700/60 focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-900 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-white outline-none transition"
            style={{ fontFamily: 'var(--font-sans, "Outfit", system-ui, -apple-system, sans-serif)' }}
          />
          {searchQuery && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition cursor-pointer flex items-center justify-center p-1"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-1 bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
            }`}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setStatusFilter('unread')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              statusFilter === 'unread'
                ? 'bg-white dark:bg-zinc-900 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
            }`}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setStatusFilter('read')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              statusFilter === 'read'
                ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
            }`}
          >
            Read ({readCount})
          </button>
        </div>
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 text-slate-500 text-xs">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-500 mb-2" />
          Loading messages...
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 space-y-2">
          <Inbox className="w-10 h-10 mx-auto text-slate-300 dark:text-zinc-700" />
          <h3 className="font-bold text-slate-800 dark:text-zinc-200 text-base">
            {searchQuery ? 'No matching messages found' : 'No messages found'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto">
            {searchQuery ? `No contact inquiries match "${searchQuery}". Clear your search query to see all messages.` : 'Inquiries submitted through the Contact Us page will appear here.'}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="mt-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs hover:bg-blue-100 transition cursor-pointer"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredMessages.map(msg => (
            <div
              key={msg.id}
              className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col gap-4 transition hover:shadow-md"
              style={{
                borderLeftWidth: '4px',
                borderLeftColor: msg.status === 'unread' ? '#f59e0b' : '#10b981',
              }}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white m-0">
                      {msg.subject || 'No Subject'}
                    </h3>
                    {msg.status === 'unread' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                        New
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                        Read
                      </span>
                    )}
                  </div>

                  <div className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 font-medium">
                    From: <span className="font-extrabold text-slate-900 dark:text-white">{msg.name}</span> &lt;<a href={`mailto:${msg.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">{msg.email}</a>&gt;
                  </div>

                  {msg.phone && (
                    <div className="text-xs text-slate-600 dark:text-zinc-400 font-medium flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>Phone:</span>
                      <a href={`tel:${msg.phone}`} className="text-blue-600 dark:text-blue-400 hover:underline font-bold">
                        {msg.phone}
                      </a>
                    </div>
                  )}

                  <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    <span>Received: {new Date(msg.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                  {msg.status === 'unread' && (
                    <button
                      onClick={() => markAsRead(msg.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-bold transition cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Mark as Read</span>
                    </button>
                  )}
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 text-xs font-bold transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-zinc-800/60 p-4 rounded-xl text-sm text-slate-700 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap border border-slate-100 dark:border-zinc-800">
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
  <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Messages...</div>}>
    <AdminLayout>{page}</AdminLayout>
  </Suspense>
);
