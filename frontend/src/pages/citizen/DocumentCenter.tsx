import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Download } from 'lucide-react';
import { apiFetch } from '../../services/api';
import { ContentItem } from '../../types';

export const DocumentCenter: React.FC = () => {
  const { i18n } = useTranslation();
  const [docs, setDocs] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const lang = i18n.language || 'en';

  useEffect(() => {
    fetchDocs();
  }, [lang]);

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const res = await apiFetch(`/content?type=DOCUMENT&lang=${lang}`);
      if (res.success) {
        setDocs(res.items);
      }
    } catch (err) {
      console.error('Fetch Docs Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 lg:pb-6">
      <div className="bg-gradient-to-r from-emerald-950 to-teal-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <FileText className="w-6 h-6 text-amber-400" />
          कागदपत्रे सेंटर (Official Document Download Center)
        </h2>
        <p className="text-xs text-emerald-200">
          Official Government Resolutions (GRs), Gram Panchayat circulars, and certificate application forms in PDF.
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500 text-xs">Loading Documents...</div>
      ) : (
        <div className="space-y-3">
          {docs.map((d) => (
            <div key={d.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
              <div>
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-full">
                  {d.category || 'Official PDF'}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-1">{d.translation?.title}</h4>
                {d.translation?.subtitle && (
                  <p className="text-xs text-slate-500 line-clamp-1">{d.translation.subtitle}</p>
                )}
              </div>

              <a
                href={d.docUrl || '#'}
                download
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 shrink-0"
              >
                <Download className="w-4 h-4" /> Download PDF
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
