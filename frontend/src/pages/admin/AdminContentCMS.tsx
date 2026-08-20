import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FileEdit, 
  Plus, 
  Search, 
  Pin, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertTriangle, 
  Globe, 
  X,
  FileText,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { apiFetch } from '../../services/api';
import { ContentItem } from '../../types';

export const AdminContentCMS: React.FC = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('');
  const [search, setSearch] = useState('');

  // Modal State for Creation / Editing
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [type, setType] = useState<'NEWS' | 'NOTICE' | 'SCHEME' | 'EVENT' | 'DOCUMENT' | 'ANNOUNCEMENT'>('NOTICE');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>('PUBLISHED');
  const [category, setCategory] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [docUrl, setDocUrl] = useState('');

  // 3 Language Input Tabs
  const [activeTab, setActiveTab] = useState<'en' | 'mr' | 'hi'>('en');
  const [translations, setTranslations] = useState<{
    en: { title: string; subtitle: string; body: string };
    mr: { title: string; subtitle: string; body: string };
    hi: { title: string; subtitle: string; body: string };
  }>({
    en: { title: '', subtitle: '', body: '' },
    mr: { title: '', subtitle: '', body: '' },
    hi: { title: '', subtitle: '', body: '' }
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContent();
  }, [selectedType]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const query = selectedType ? `?type=${selectedType}` : '';
      const res = await apiFetch(`/content${query}`);
      if (res.success) {
        setItems(res.items);
      }
    } catch (err) {
      console.error('Fetch Content Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setType('NOTICE');
    setStatus('PUBLISHED');
    setCategory('');
    setIsPinned(false);
    setDocUrl('');
    setTranslations({
      en: { title: '', subtitle: '', body: '' },
      mr: { title: '', subtitle: '', body: '' },
      hi: { title: '', subtitle: '', body: '' }
    });
    setActiveTab('en');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ContentItem) => {
    setEditingId(item.id);
    setType(item.type);
    setStatus(item.status);
    setCategory(item.category || '');
    setIsPinned(item.isPinned);
    setDocUrl(item.docUrl || '');

    const transMap = {
      en: { title: '', subtitle: '', body: '' },
      mr: { title: '', subtitle: '', body: '' },
      hi: { title: '', subtitle: '', body: '' }
    };

    if (item.allTranslations) {
      item.allTranslations.forEach((t: any) => {
        if (t.lang === 'en' || t.lang === 'mr' || t.lang === 'hi') {
          transMap[t.lang as 'en' | 'mr' | 'hi'] = {
            title: t.title || '',
            subtitle: t.subtitle || '',
            body: t.body || ''
          };
        }
      });
    }

    setTranslations(transMap);
    setActiveTab('en');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!translations.en.title) {
      alert('English title is required!');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        type,
        status,
        category,
        isPinned,
        docUrl,
        translations
      };

      if (editingId) {
        await apiFetch(`/content/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } else {
        await apiFetch('/content', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }

      setIsModalOpen(false);
      fetchContent();
    } catch (err: any) {
      alert(err.message || 'Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content item?')) return;
    try {
      await apiFetch(`/content/${id}`, { method: 'DELETE' });
      fetchContent();
    } catch (err: any) {
      alert(err.message || 'Failed to delete content');
    }
  };

  const filteredItems = items.filter(item => {
    if (!search) return true;
    const title = item.translation?.title || '';
    return title.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileEdit className="w-5 h-5 text-emerald-600" />
            Trilingual Content Management System (CMS)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Create & publish News, Notices, Schemes, Events, Documents with tabbed 3-language editor (EN / मराठी / हिंदी).
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Trilingual Content</span>
        </button>
      </div>

      {/* Type Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {['', 'NOTICE', 'NEWS', 'SCHEME', 'EVENT', 'DOCUMENT', 'ANNOUNCEMENT'].map((tType) => (
          <button
            key={tType}
            onClick={() => setSelectedType(tType)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedType === tType
                ? 'bg-slate-900 text-white shadow-sm font-bold'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tType === '' ? 'All Types' : tType}
          </button>
        ))}
      </div>

      {/* Content Table / Cards List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search content by title..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Total Items: <span className="font-bold text-slate-800">{filteredItems.length}</span>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs">Loading Content Items...</div>
        ) : filteredItems.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">No content items found.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredItems.map((item) => (
              <div key={item.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded uppercase">
                      {item.type}
                    </span>
                    {item.category && (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-semibold rounded">
                        {item.category}
                      </span>
                    )}
                    {item.isPinned && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold rounded flex items-center gap-1">
                        <Pin className="w-3 h-3 fill-amber-500 text-amber-500" /> Pinned
                      </span>
                    )}
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      item.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">
                    {item.translation?.title || 'Untitled Content'}
                  </h4>
                  {item.translation?.subtitle && (
                    <p className="text-xs text-slate-500 line-clamp-1">{item.translation.subtitle}</p>
                  )}

                  {/* Translation completeness indicators */}
                  <div className="flex items-center gap-1.5 pt-1 text-[11px]">
                    <span className="text-slate-400 font-semibold">Languages:</span>
                    {['en', 'mr', 'hi'].map((l) => {
                      const hasLang = item.allTranslations?.some((t: any) => t.lang === l);
                      return (
                        <span
                          key={l}
                          className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                            hasLang ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700 border border-red-200'
                          }`}
                        >
                          {l.toUpperCase()} {hasLang ? '✓' : '⚠️ Missing'}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit 3-Tabs
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Editor Modal with 3 Language Tabs */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FileEdit className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold">
                  {editingId ? 'Edit Content Item' : 'Create New Trilingual Content'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Meta Config Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Content Type</label>
                  <select
                    value={type}
                    onChange={(e: any) => setType(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="NOTICE">NOTICE</option>
                    <option value="NEWS">NEWS</option>
                    <option value="SCHEME">SCHEME</option>
                    <option value="EVENT">EVENT</option>
                    <option value="DOCUMENT">DOCUMENT</option>
                    <option value="ANNOUNCEMENT">ANNOUNCEMENT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category / Tag</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Agriculture, Gram Sabha"
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="DRAFT">DRAFT</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>

                <div className="sm:col-span-3 flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPinned}
                      onChange={(e) => setIsPinned(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                    <span>Pin to Top of Notice Board / Home Slider</span>
                  </label>
                </div>
              </div>

              {/* 3-Language Editor Tabs (Non-negotiable) */}
              <div className="border border-emerald-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="bg-emerald-950 text-white p-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-400 ml-2" />
                    <span className="text-xs font-bold">Language Editor Tabs</span>
                  </div>
                  <div className="flex gap-1">
                    {[
                      { code: 'en', label: 'English' },
                      { code: 'mr', label: 'मराठी (Marathi)' },
                      { code: 'hi', label: 'हिंदी (Hindi)' }
                    ].map((tab) => (
                      <button
                        type="button"
                        key={tab.code}
                        onClick={() => setActiveTab(tab.code as any)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                          activeTab === tab.code
                            ? 'bg-amber-500 text-slate-950 shadow-md'
                            : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-800'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Input Panel */}
                <div className="p-4 space-y-4 bg-white">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Title ({activeTab.toUpperCase()}) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={translations[activeTab].title}
                      onChange={(e) => setTranslations({
                        ...translations,
                        [activeTab]: { ...translations[activeTab], title: e.target.value }
                      })}
                      placeholder={`Enter title in ${activeTab === 'mr' ? 'Marathi (मराठी)' : activeTab === 'hi' ? 'Hindi (हिंदी)' : 'English'}`}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required={activeTab === 'en'}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Subtitle / Brief Summary ({activeTab.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      value={translations[activeTab].subtitle}
                      onChange={(e) => setTranslations({
                        ...translations,
                        [activeTab]: { ...translations[activeTab], subtitle: e.target.value }
                      })}
                      placeholder="Short summary line..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Full Content Body ({activeTab.toUpperCase()})
                    </label>
                    <textarea
                      rows={5}
                      value={translations[activeTab].body}
                      onChange={(e) => setTranslations({
                        ...translations,
                        [activeTab]: { ...translations[activeTab], body: e.target.value }
                      })}
                      placeholder="Enter detailed body text..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Publish Content'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
