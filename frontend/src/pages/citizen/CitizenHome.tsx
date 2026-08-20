import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  CreditCard, 
  AlertCircle, 
  FileText, 
  Bell, 
  Award, 
  PhoneCall, 
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { apiFetch } from '../../services/api';
import { ContentItem } from '../../types';

export const CitizenHome: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [notices, setNotices] = useState<ContentItem[]>([]);
  const [schemes, setSchemes] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const currentLang = i18n.language || 'en';

  useEffect(() => {
    fetchHomeData();
  }, [currentLang]);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const [noticeRes, schemeRes] = await Promise.all([
        apiFetch(`/content?type=NOTICE&lang=${currentLang}`),
        apiFetch(`/content?type=SCHEME&lang=${currentLang}`)
      ]);

      if (noticeRes.success) setNotices(noticeRes.items.slice(0, 4));
      if (schemeRes.success) setSchemes(schemeRes.items.slice(0, 3));
    } catch (err) {
      console.error('Fetch Home Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Multilingual sample notice cards
  const noticeCardData: Record<string, Array<{ type: string; typeColor: string; date: string; title: string }>> = {
    en: [
      { type: 'Event', typeColor: 'bg-blue-600', date: '2026-03-26', title: 'Ram Navami Celebration & Cultural Program' },
      { type: 'Event', typeColor: 'bg-emerald-600', date: '2026-03-03', title: 'Holi Colors Festival & Village Harmony Event' },
      { type: 'Notice', typeColor: 'bg-teal-600', date: '2026-01-26', title: 'Republic Day Flag Hoisting & Gram Sabha Assembly' },
      { type: 'Notice', typeColor: 'bg-rose-600', date: '2026-05-01', title: 'Maharashtra Din & Worker Day Gram Sabha Meeting' }
    ],
    mr: [
      { type: 'Event', typeColor: 'bg-blue-600', date: '2026-03-26', title: 'राम नवमी भगवान रामाच्या जन्मोत्सावाचा पवित्र दिवस' },
      { type: 'Event', typeColor: 'bg-emerald-600', date: '2026-03-03', title: 'होळी – रंग, आनंद आणि मैत्रीचे प्रतीक म्हणून साजरा होणारा उत्सव' },
      { type: 'Notice', typeColor: 'bg-teal-600', date: '2026-01-26', title: 'प्रजासत्ताक दिन २०२६ : राष्ट्राभिमान व संविधान सोहळा.' },
      { type: 'Notice', typeColor: 'bg-rose-600', date: '2026-05-01', title: '१ मे महाराष्ट्र दिन व कामगार दिन विशेष सभा' }
    ],
    hi: [
      { type: 'Event', typeColor: 'bg-blue-600', date: '2026-03-26', title: 'राम नवमी महोत्सव एवं सांस्कृतिक कार्यक्रम' },
      { type: 'Event', typeColor: 'bg-emerald-600', date: '2026-03-03', title: 'होली – रंगों और सौहार्द का पावन उत्सव' },
      { type: 'Notice', typeColor: 'bg-teal-600', date: '2026-01-26', title: 'गणतंत्र दिवस 2026 : ध्वजारोहण एवं ग्राम सभा बैठक' },
      { type: 'Notice', typeColor: 'bg-rose-600', date: '2026-05-01', title: '1 मई महाराष्ट्र दिवस एवं श्रम दिवस सभा' }
    ]
  };

  const currentNoticeCards = noticeCardData[currentLang.slice(0, 2)] || noticeCardData['en'];

  // Multilingual quick service tiles
  const quickActionTiles = [
    { title: t('nav.taxes', 'Tax Payment'), desc: t('home.pay_tax_now', 'Pay Property & Water Tax'), path: '/taxes', icon: CreditCard, color: 'bg-[#881337] text-white' },
    { title: t('nav.complaints', 'Grievance'), desc: t('home.file_complaint', 'File a Grievance'), path: '/complaints', icon: AlertCircle, color: 'bg-amber-600 text-white' },
    { title: t('nav.certificates', 'Certificates'), desc: t('home.apply_certificate', 'Apply for Certificates'), path: '/certificates', icon: FileText, color: 'bg-blue-700 text-white' },
    { title: t('nav.schemes', 'Govt Schemes'), desc: t('home.view_schemes', 'Explore Schemes'), path: '/schemes', icon: Award, color: 'bg-teal-700 text-white' },
    { title: t('nav.development', 'Development'), desc: t('nav.development', 'Village Progress'), path: '/development', icon: TrendingUp, color: 'bg-emerald-800 text-white' },
    { title: t('nav.contacts', 'Contacts'), desc: t('home.emergency_call', '24x7 Contacts'), path: '/contacts', icon: PhoneCall, color: 'bg-rose-700 text-white' },
  ];

  return (
    <div className="space-y-6 pb-16 lg:pb-6 font-devanagari">
      {/* Hero Banner with Rural Panoramic Landscape */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent min-h-[360px] sm:min-h-[420px] flex items-center justify-center text-center p-6 sm:p-12 border border-slate-200">
        <div 
          className="absolute inset-0 bg-cover bg-center brightness-[0.75] contrast-[1.05]"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80')` }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />

        <div className="relative z-10 max-w-4xl space-y-4 text-white">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight drop-shadow-lg text-white">
            {t('app_name')}
          </h2>

          <p className="text-xl sm:text-3xl font-bold drop-shadow-md text-amber-300">
            {t('home.welcome')}
          </p>

          <p className="text-xs sm:text-sm text-slate-200 font-semibold max-w-2xl mx-auto drop-shadow-sm">
            {t('app_tagline')} • {t('smart_portal')}
          </p>

          <div className="flex justify-center gap-3 pt-3">
            <Link
              to="/services"
              className="px-6 py-3 bg-[#881337] hover:bg-[#6b0f2b] text-white text-xs font-extrabold rounded-xl shadow-lg transition-all flex items-center gap-2 border border-maroon-700"
            >
              {t('nav.services')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-2">
          <span className="w-6 h-1.5 bg-amber-400 rounded-full" />
          <span className="w-2 h-1.5 bg-white/60 rounded-full" />
          <span className="w-2 h-1.5 bg-white/60 rounded-full" />
        </div>
      </div>

      {/* Announcement Ticker Bar */}
      <div className="bg-gold-100 border border-amber-200/80 p-3 rounded-2xl shadow-xs flex items-center gap-3 overflow-hidden text-xs font-bold text-slate-900">
        <span className="bg-red-600 text-white font-extrabold px-3 py-1 rounded-lg text-xs shrink-0 shadow-xs uppercase tracking-wide">
          {t('home.notice_banner')}:
        </span>
        <div className="truncate text-slate-800 font-semibold">
          {currentLang.startsWith('hi') 
            ? 'सब मिलकर स्वच्छता रखें और सुंदर गांव बनाएं! • 15 अगस्त स्वतंत्रता दिवस पर विशेष ग्राम सभा सुबह 10:00 बजे।' 
            : currentLang.startsWith('en') 
              ? 'Let us maintain cleanliness together for a clean village! • Special Independence Day Gram Sabha on 15th Aug at 10:00 AM.'
              : 'सर्वांनी मिळून स्वच्छता पाळूया आणि स्वच्छ गाव घडवूया ! • स्वांतत्र्य दिन विशेष ग्रामसभा १५ ऑगस्ट रोजी सकाळी १०:०० वाजता आयोजित.'}
        </div>
      </div>

      {/* Important Notices Section */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div className="border-l-[5px] border-[#881337] pl-3 flex items-center">
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {t('home.notice_banner', 'Important Notices')}
            </h3>
          </div>

          <Link
            to="/notices"
            className="px-4 py-2 bg-[#881337] hover:bg-[#6b0f2b] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            {t('nav.notices')}
          </Link>
        </div>

        {/* Notice Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentNoticeCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 text-white text-[11px] font-bold rounded-md ${card.typeColor}`}>
                  {card.type}
                </span>
                <span className="text-[11px] font-mono text-slate-400 font-semibold">
                  {card.date}
                </span>
              </div>

              <p className="text-xs font-bold text-slate-800 leading-relaxed min-h-[48px]">
                {card.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Database Notices */}
      {notices.length > 0 && (
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-[#881337] font-bold text-sm">
            <Bell className="w-4 h-4" />
            <span>{t('home.latest_news')}</span>
          </div>

          <div className="divide-y divide-slate-200">
            {notices.map((n) => (
              <div key={n.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{n.translation?.title}</h4>
                  {n.translation?.subtitle && (
                    <p className="text-[11px] text-slate-600 line-clamp-1">{n.translation.subtitle}</p>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 font-mono shrink-0">
                  {new Date(n.publishAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Citizen Services Grid */}
      <div className="space-y-4 pt-2">
        <div className="border-l-[5px] border-[#881337] pl-3 flex items-center">
          <h3 className="text-xl font-extrabold text-slate-900">
            {t('home.quick_actions')}
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActionTiles.map((tile, idx) => {
            const Icon = tile.icon;
            return (
              <Link
                key={idx}
                to={tile.path}
                className={`p-4 rounded-2xl ${tile.color} shadow-md hover:scale-[1.03] transition-all duration-200 flex flex-col justify-between h-32 group`}
              >
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 stroke-[2.2px]" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold leading-tight group-hover:underline">{tile.title}</h4>
                  <p className="text-[10px] opacity-80 mt-0.5">{tile.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
