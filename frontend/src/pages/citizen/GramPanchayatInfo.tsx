import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, Phone, Clock, Mail } from 'lucide-react';
import { apiFetch } from '../../services/api';
import { PanchayatMember } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const GramPanchayatInfo: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { language } = useAuth();
  const [members, setMembers] = useState<PanchayatMember[]>([]);
  const [loading, setLoading] = useState(true);

  const lang = (language || i18n.language || 'mr').slice(0, 2);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/utilities/panchayat-members');
      if (res.success) {
        setMembers(res.members);
      }
    } catch (err) {
      console.error('Fetch Members Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDesignation = (m: PanchayatMember) => {
    if (lang.startsWith('mr')) return m.designationMr || m.designationEn;
    if (lang.startsWith('hi')) return m.designationHi || m.designationEn;
    return m.designationEn;
  };

  const getDesc = (m: PanchayatMember) => {
    if (lang.startsWith('mr')) return m.roleDescriptionMr || m.roleDescriptionEn;
    if (lang.startsWith('hi')) return m.roleDescriptionHi || m.roleDescriptionEn;
    return m.roleDescriptionEn;
  };

  return (
    <div className="space-y-6 pb-16 lg:pb-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#881337] via-[#4c0519] to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <Building2 className="w-6 h-6 text-amber-400" />
          {t('pages.gp_info_title')}
        </h2>
        <p className="text-xs text-rose-200">
          {t('pages.gp_info_subtitle')} • {t('app_name')}
        </p>
      </div>

      {/* Office Timing & Quick Contact Card */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Office Working Hours</div>
            <div className="text-xs text-slate-500">10:00 AM - 05:45 PM (Mon - Sat)</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#881337] flex items-center justify-center font-bold">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Gramsevak Office Phone</div>
            <a href="tel:9422200002" className="text-xs font-semibold text-[#881337] hover:underline">+91 9422200002</a>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Official Email</div>
            <div className="text-xs text-slate-500 font-mono">londhave.gp@maharashtra.gov.in</div>
          </div>
        </div>
      </div>

      {/* Panchayat Members Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900">{t('pages.gp_info_title')}</h3>

        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs">{t('common.loading')}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((m) => (
              <div key={m.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#881337] to-[#4c0519] text-white font-bold text-lg flex items-center justify-center shadow-md">
                    {m.name[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{m.name}</h4>
                    <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold rounded-full">
                      {getDesignation(m)}
                    </span>
                  </div>
                </div>

                {getDesc(m) && (
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {getDesc(m)}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500">{m.wardNo || 'Londhave GP'}</span>
                  <a
                    href={`tel:${m.contact}`}
                    className="px-3 py-1 bg-rose-50 text-[#881337] font-bold text-xs rounded-xl hover:bg-rose-100 flex items-center gap-1 border border-rose-200"
                  >
                    <Phone className="w-3.5 h-3.5" /> {t('common.call_now')}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
