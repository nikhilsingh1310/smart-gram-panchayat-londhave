import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';
import { apiFetch } from '../../services/api';
import { VillageFacility, VillageStat } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const VillageInfo: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { language } = useAuth();
  const [facilities, setFacilities] = useState<VillageFacility[]>([]);
  const [stats, setStats] = useState<VillageStat[]>([]);
  const [loading, setLoading] = useState(true);

  const lang = (language || i18n.language || 'mr').slice(0, 2);

  useEffect(() => {
    fetchVillageData();
  }, []);

  const fetchVillageData = async () => {
    try {
      setLoading(true);
      const [facRes, statRes] = await Promise.all([
        apiFetch('/utilities/village-facilities'),
        apiFetch('/utilities/village-stats')
      ]);
      if (facRes.success) setFacilities(facRes.facilities);
      if (statRes.success) setStats(statRes.stats);
    } catch (err) {
      console.error('Fetch Village Data Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getFacName = (f: VillageFacility) => {
    if (lang.startsWith('mr')) return f.nameMr || f.nameEn;
    if (lang.startsWith('hi')) return f.nameHi || f.nameEn;
    return f.nameEn;
  };

  const getFacDesc = (f: VillageFacility) => {
    if (lang.startsWith('mr')) return f.descMr || f.descEn;
    if (lang.startsWith('hi')) return f.descHi || f.descEn;
    return f.descEn;
  };

  return (
    <div className="space-y-6 pb-16 lg:pb-6">
      {/* Village Banner & Overview */}
      <div className="bg-gradient-to-r from-[#881337] via-[#4c0519] to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-3">
        <h2 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2">
          <MapPin className="w-6 h-6 text-amber-400" />
          {t('pages.village_info_title')}
        </h2>
        <p className="text-xs text-rose-200 leading-relaxed max-w-3xl">
          {t('pages.village_info_subtitle')}
        </p>
      </div>

      {/* Village Demographics & Infrastructure Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s) => (
          <div key={s.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-[11px] font-semibold text-slate-500">
              {lang.startsWith('mr') ? s.labelMr : lang.startsWith('hi') ? s.labelHi : s.labelEn}
            </div>
            <div className="text-xl font-extrabold text-[#881337] mt-1">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Village Facilities Directory */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900">{t('pages.village_info_title')}</h3>

        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs">{t('common.loading')}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {facilities.map((f) => (
              <div key={f.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-rose-50 text-[#881337] text-[10px] font-bold rounded-full uppercase border border-rose-200">
                    {f.category}
                  </span>
                  {f.phone && (
                    <a href={`tel:${f.phone}`} className="text-xs text-[#881337] font-bold hover:underline">
                      📞 {f.phone}
                    </a>
                  )}
                </div>

                <h4 className="text-sm font-bold text-slate-900">{getFacName(f)}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{getFacDesc(f)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
