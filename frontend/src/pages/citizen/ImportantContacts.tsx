import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PhoneCall, ShieldAlert, Ambulance, Building, Phone } from 'lucide-react';
import { apiFetch } from '../../services/api';

export const ImportantContacts: React.FC = () => {
  const { i18n } = useTranslation();
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const lang = i18n.language || 'en';

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
      <div className="bg-gradient-to-r from-rose-700 to-red-800 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <PhoneCall className="w-6 h-6 text-amber-300" />
          महत्त्वाचे संपर्क (Emergency & Official Directory)
        </h2>
        <p className="text-xs text-rose-100">
          Instant click-to-call helpline numbers for Police, Ambulance, Fire, Talathi, BDO, and Gram Panchayat officers.
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500 text-xs">Loading Directory...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {contacts.map((c) => (
            <div key={c.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  c.category === 'Emergency' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
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
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <Phone className="w-3.5 h-3.5" /> Call Now
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
