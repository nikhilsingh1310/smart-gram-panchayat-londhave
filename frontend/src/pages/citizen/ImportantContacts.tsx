import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PhoneCall, Phone } from 'lucide-react';
import { apiFetch } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const ImportantContacts: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { language } = useAuth();
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const lang = (language || i18n.language || 'mr').slice(0, 2);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/utilities/contacts');
      if (res.success) {
        setContacts(res.contacts);
      }
    } catch (err) {
      console.error('Fetch Contacts Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 lg:pb-6">
      <div className="bg-gradient-to-r from-[#881337] via-[#4c0519] to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <PhoneCall className="w-6 h-6 text-amber-300" />
          {t('pages.contacts_title')}
        </h2>
        <p className="text-xs text-rose-200">
          {t('pages.contacts_subtitle')}
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500 text-xs">{t('common.loading')}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {contacts.map((c) => (
            <div key={c.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  c.category === 'Emergency' ? 'bg-red-100 text-red-800' : 'bg-rose-50 text-[#881337] border border-rose-200'
                }`}>
                  {c.category}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-2">
                  {lang.startsWith('mr') ? c.nameMr : c.nameEn}
                </h4>
                <div className="text-xs font-mono font-bold text-slate-700 mt-1">{c.number}</div>
              </div>

              <a
                href={`tel:${c.number}`}
                className="w-full py-2.5 bg-[#881337] hover:bg-[#6b0f2b] text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <Phone className="w-3.5 h-3.5" /> {t('common.call_now')}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
