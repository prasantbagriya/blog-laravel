import React, { useState } from 'react';
import { X, Building, Link as LinkIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Category } from '../types';

interface CreateBusinessModalProps {
  onClose: () => void;
  categories: Category[];
  onSubmitSuccess: (business: any) => void;
  initialData?: any;
  isEdit?: boolean;
}

export const CreateBusinessModal: React.FC<CreateBusinessModalProps> = ({ onClose, categories, onSubmitSuccess, initialData, isEdit }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    website: initialData?.website || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    address: initialData?.address || '',
    claimed_by_owner: initialData?.claimedByOwner || false,
    category_name: initialData?.categoryName || categories[0]?.name || '',
    description: initialData?.description || ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const url = isEdit && initialData?.id ? `/api/businesses/${initialData.id}` : '/api/businesses';
      const method = isEdit ? 'PUT' : 'POST';
      
      const userElement = document.getElementById('auth-user-data');
      const authUser = userElement && userElement.textContent ? JSON.parse(userElement.textContent) : null;
      
      const payload = {
        ...formData,
        user_id: authUser?.id
      };

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ''
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to list business');
      }

      const newBusiness = await response.json();
      setSuccess(true);
      setTimeout(() => {
        onSubmitSuccess(newBusiness);
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
          <h2 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-600" />
            {isEdit ? 'Edit Business' : 'List a Business'}
          </h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center flex flex-col items-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4 animate-in zoom-in duration-300" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {isEdit ? 'Business Updated Successfully!' : 'Business Listed Successfully!'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {isEdit ? 'Your changes have been saved.' : 'Taking you to the new business profile...'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
            {error && (
              <div className="p-3 mb-4 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm flex items-start gap-2 border border-red-100 dark:border-red-800/30 shrink-0">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Business Name *</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-black dark:text-white text-sm"
                  placeholder="e.g. Acme Corporation"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Company Slug (Optional)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-black dark:text-white text-sm"
                  placeholder="e.g. acme-corp"
                  value={formData.slug}
                  onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                />
                <p className="text-[10px] text-gray-500 mt-1">Leave empty to auto-generate from name.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Website URL *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="url"
                    required
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-black dark:text-white text-sm"
                    placeholder="https://example.com"
                    value={formData.website}
                    onChange={e => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Category *</label>
                <select
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-black dark:text-white text-sm"
                  value={formData.category_name}
                  onChange={e => setFormData({ ...formData, category_name: e.target.value })}
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Phone Number (Optional)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-black dark:text-white text-sm"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email Address (Optional)</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-black dark:text-white text-sm"
                  placeholder="contact@company.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Address (Optional)</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-black dark:text-white text-sm"
                placeholder="123 Business St, City, Country"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-2 p-3 bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <input
                type="checkbox"
                id="claimed_by_owner"
                checked={formData.claimed_by_owner}
                onChange={e => setFormData({ ...formData, claimed_by_owner: e.target.checked })}
                className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-600 dark:focus:ring-blue-600 dark:ring-offset-black focus:ring-2 dark:bg-black dark:border-gray-600"
              />
              <label htmlFor="claimed_by_owner" className="text-sm font-medium text-gray-900 dark:text-gray-300">
                I am the owner or authorized representative of this business
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Description *</label>
              <textarea
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-black dark:text-white text-sm resize-none"
                placeholder="What does this business do?"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3 mt-4 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-[#0040CC] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {isEdit ? 'Saving...' : 'Listing...'}
                  </>
                ) : (
                  isEdit ? 'Save Changes' : 'List Business'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
