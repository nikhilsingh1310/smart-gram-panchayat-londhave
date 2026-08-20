import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Download, FileText, Pin } from 'lucide-react';
import { apiFetch } from '../../services/api';
import { ContentItem } from '../../types';

export const NoticeBoard: React.FC = () => {
  const { i18n } = useTranslation();
  const [notices, setNotices] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const lang = i18n.language || 'en';

  useEffect(() => {
    fetchNotices();
  }, [lang]);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await apiFetch(`/content?type=NOTICE&lang=${lang}`);
      if (res.success) {
        setNotices(res.items);
      }
    } catch (err) {
      console.error('Fetch Notices Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 lg:pb-6">
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <Bell className="w-6 h-6 text-amber-400" />
          सूचना फलक (Notice Board & Official Circulars)
        </h2>
        <p className="text-xs text-emerald-200">
          Official announcements, Gram Sabha notices, utility schedules, and tender releases for Londhave village.
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500 text-xs">Loading Notices...</div>
      ) : (
        <div className="space-y-4">
          {notices.map((n) => (
            <div key={n.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full">
                    {n.category || 'Gram Sabha Notice'}
                  </span>
                  {n.isPinned && (
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full flex items-center gap-1">
                      <Pin className="w-3 h-3 text-amber-500 fill-amber-500" /> Pinned
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {new Date(n.publishAt).toLocaleDateString()}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{n.translation?.title}</h3>
              {n.translation?.subtitle && (
                <p className="text-xs text-emerald-800 font-semibold">{n.translation.subtitle}</p>
              )}
              {n.translation?.body && (
                <p className="text-xs text-slate-600 leading-relaxed">{n.translation.body}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
