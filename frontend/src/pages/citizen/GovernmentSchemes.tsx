import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Award } from 'lucide-react';
import { apiFetch } from '../../services/api';
import { ContentItem } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const GovernmentSchemes: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { language } = useAuth();
  const [schemes, setSchemes] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const lang = (language || i18n.language || 'mr').slice(0, 2);

  useEffect(() => {
    fetchSchemes();
  }, [lang]);

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      const res = await apiFetch(`/content?type=SCHEME&lang=${lang}`);
      if (res.success) {
        setSchemes(res.items);
      }
    } catch (err) {
      console.error('Fetch Schemes Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Agriculture', 'PMAY Housing', 'Women & Child', 'Students', 'Jal Jeevan'];

  const filteredSchemes = schemes.filter(s => {
    if (!selectedCategory || selectedCategory === 'All') return true;
    return s.category === selectedCategory;
  });

  return (
    <div className="space-y-6 pb-16 lg:pb-6">
      <div className="bg-gradient-to-r from-[#881337] via-[#4c0519] to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-2">
        <h2 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2">
          <Award className="w-6 h-6 text-amber-400" />
          {t('pages.schemes_title')}
        </h2>
        <p className="text-xs text-rose-200">
          {t('pages.schemes_subtitle')}
        </p>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat === 'All' ? '' : cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              (selectedCategory === '' && cat === 'All') || selectedCategory === cat
                ? 'bg-[#881337] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-rose-50 border border-slate-200'
            }`}
          >
            {cat === 'All' ? t('common.all') : cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500 text-xs">{t('common.loading')}</div>
      ) : (
        <div className="space-y-4">
          {filteredSchemes.map((s) => (
            <div key={s.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full">
                  {s.category || t('nav.schemes')}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900">
                {s.translation?.title}
              </h3>
              {s.translation?.subtitle && (
                <p className="text-xs text-[#881337] font-semibold">{s.translation.subtitle}</p>
              )}
              {s.translation?.body && (
                <p className="text-xs text-slate-600 leading-relaxed">{s.translation.body}</p>
              )}

              {s.translation?.metadata && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {s.translation.metadata.eligibility && (
                    <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100 text-xs text-slate-900 space-y-1">
                      <div className="font-bold text-[#881337]">Eligibility / पात्रता:</div>
                      <div>{s.translation.metadata.eligibility}</div>
                    </div>
                  )}
                  {s.translation.metadata.docs && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-800 space-y-1">
                      <div className="font-bold text-slate-900">Documents / आवश्यक कागदपत्रे:</div>
                      <div>{s.translation.metadata.docs}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
