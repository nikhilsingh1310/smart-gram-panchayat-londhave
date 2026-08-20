import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Plus, X } from 'lucide-react';
import { apiFetch } from '../../services/api';
import { Complaint } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const ComplaintPortal: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, language } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('STREETLIGHT');
  const [priority, setPriority] = useState('MEDIUM');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [wardNo, setWardNo] = useState('1');
  const [submitting, setSubmitting] = useState(false);

  const lang = (language || i18n.language || 'mr').slice(0, 2);

  useEffect(() => {
    if (user) fetchMyComplaints();
    else setLoading(false);
  }, [user]);

  const fetchMyComplaints = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/complaints');
      if (res.success) {
        setComplaints(res.complaints);
      }
    } catch (err) {
      console.error('Fetch Complaints Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in with your mobile OTP to submit a complaint');
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiFetch('/complaints', {
        method: 'POST',
        body: JSON.stringify({
          title,
          category,
          priority,
          description,
          location,
          wardNo
        })
      });

      if (res.success) {
        setIsSubmitOpen(false);
        setTitle('');
        setDescription('');
        setLocation('');
        fetchMyComplaints();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 lg:pb-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-700 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-white" />
            {t('pages.complaints_title')}
          </h2>
          <p className="text-xs text-amber-100 mt-1">
            {t('pages.complaints_subtitle')}
          </p>
        </div>

        <button
          onClick={() => setIsSubmitOpen(true)}
          className="px-5 py-2.5 bg-white text-slate-950 hover:bg-amber-50 font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all shrink-0"
        >
          <Plus className="w-4 h-4 text-amber-600" />
          <span>{t('home.file_complaint')}</span>
        </button>
      </div>

      {/* Complaints History */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900">{t('nav.complaints')}</h3>

        {!user ? (
          <div className="p-8 bg-amber-50 border border-amber-200 rounded-3xl text-center space-y-2">
            <p className="text-xs font-bold text-amber-900">Please log in to view your complaints & track ticket status.</p>
          </div>
        ) : loading ? (
          <div className="p-8 text-center text-slate-500 text-xs">{t('common.loading')}</div>
        ) : complaints.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs bg-white rounded-3xl border border-slate-200">
            No complaints submitted yet.
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map((c) => (
              <div key={c.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-slate-900 text-white font-mono text-[11px] font-bold rounded">
                      {c.ticketNo}
                    </span>
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded">
                      {c.category}
                    </span>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    c.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                    c.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {c.status}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900">{c.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{c.description}</p>

                <div className="text-[11px] text-slate-400">
                  Location: <strong className="text-slate-700">{c.location} (Ward {c.wardNo})</strong> • Submitted: {new Date(c.createdAt).toLocaleDateString()}
                </div>

                {c.resolutionRemarks && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 space-y-1">
                    <div className="font-bold text-emerald-900">Resolution Remarks:</div>
                    <div>{c.resolutionRemarks}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Modal */}
      {isSubmitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-amber-600 text-white p-5 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {t('home.file_complaint')}
              </h3>
              <button onClick={() => setIsSubmitOpen(false)} className="text-amber-200 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Issue Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  <option value="STREETLIGHT">Solar / Electric Streetlight</option>
                  <option value="WATER">Water Supply Pipeline</option>
                  <option value="ROADS">Roads & Potholes</option>
                  <option value="GARBAGE">Garbage Collection</option>
                  <option value="DRAINAGE">Drainage Leakage</option>
                  <option value="OTHER">Other Issue</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Complaint Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Streetlight not working near Temple corner"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Ward Number</label>
                  <select
                    value={wardNo}
                    onChange={(e) => setWardNo(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="1">Ward 1</option>
                    <option value="2">Ward 2</option>
                    <option value="3">Ward 3</option>
                    <option value="4">Ward 4</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Exact Location / Landmark</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Near House H-102, Main Bazaar Road"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-md disabled:opacity-50"
                >
                  {submitting ? t('common.loading') : t('common.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
