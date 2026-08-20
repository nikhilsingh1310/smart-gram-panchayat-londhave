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
  CloudSun, 
  Calendar, 
  ChevronRight, 
  MapPin, 
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Vote
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

  const sampleNoticeCards = [
    {
      type: 'Event',
      typeColor: 'bg-blue-600',
      date: '2026-03-26',
      title: 'राम नवमी भगवान रामाच्या जन्मोत्सावाचा पवित्र दिवस'
    },
    {
      type: 'Event',
      typeColor: 'bg-emerald-600',
      date: '2026-03-03',
      title: 'होळी – रंग, आनंद आणि मैत्रीचे प्रतीक म्हणून साजरा होणारा उत्सव'
    },
    {
      type: 'Event',
      typeColor: 'bg-teal-600',
      date: '2026-01-26',
      title: 'प्रजासत्ताक दिन २०२६ : राष्ट्राभिमान, सांस्कृतिक वैविध्य आणि संविधान सोहळा.'
    },
    {
      type: 'Event',
      typeColor: 'bg-rose-600',
      date: '2026-05-01',
      title: '१ मे महाराष्ट्र दिन , कामगार दिन'
    }
  ];

  const quickActionTiles = [
    { title: 'कर भरणा (Tax Payment)', desc: 'घरपट्टी व पाणीपट्टी ऑनलाइन भरा', path: '/taxes', icon: CreditCard, color: 'bg-maroon-850 text-white' },
    { title: 'तक्रार निवारण (Grievance)', desc: 'गावातील समस्यांची तक्रार नोंदवा', path: '/complaints', icon: AlertCircle, color: 'bg-amber-600 text-white' },
    { title: 'प्रमाणपत्रे दाखला (Certificates)', desc: 'रहिवासी, जन्म, मृत्यू दाखला', path: '/certificates', icon: FileText, color: 'bg-blue-700 text-white' },
    { title: 'सरकारी योजना (Schemes)', desc: 'पीएम किसान, आवास, जल जीवन', path: '/schemes', icon: Award, color: 'bg-teal-700 text-white' },
    { title: 'विकास डॅशबोर्ड (Development)', desc: 'गावाचा अर्थसंकल्प व रस्ते विकास', path: '/development', icon: TrendingUp, color: 'bg-emerald-800 text-white' },
    { title: 'महत्त्वाचे संपर्क (Contacts)', desc: '२४x७ आपत्कालीन व अधिकारी नंबर', path: '/contacts', icon: PhoneCall, color: 'bg-rose-700 text-white' },
  ];

  return (
    <div className="space-y-6 pb-16 lg:pb-6 font-devanagari">
      {/* Hero Banner with Rural Panoramic Landscape (khamshet.in style) */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent min-h-[360px] sm:min-h-[420px] flex items-center justify-center text-center p-6 sm:p-12 border border-slate-200">
        {/* Background Rural Village Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center brightness-[0.75] contrast-[1.05]"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80')` }}
        />
        
        {/* Overlay Dark Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />

        <div className="relative z-10 max-w-4xl space-y-4 text-white">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight drop-shadow-lg text-white">
            ग्रामपंचायत लोंढवे
          </h2>

          <p className="text-xl sm:text-3xl font-bold drop-shadow-md text-amber-300">
            ग्रामपंचायत लोंढवे मध्ये आपले स्वागत आहे!
          </p>

          <p className="text-xs sm:text-sm text-slate-200 font-semibold max-w-2xl mx-auto drop-shadow-sm">
            तालुका अमळनेर, जिल्हा जळगाव • डिजिटल नागरिक सेवा, कर भरणा, तक्रार निवारण व गाव विकास पोर्टल
          </p>

          <div className="flex justify-center gap-3 pt-3">
            <Link
              to="/services"
              className="px-6 py-3 bg-maroon-850 hover:bg-maroon-800 text-white text-xs font-extrabold rounded-xl shadow-lg transition-all flex items-center gap-2 border border-maroon-700"
            >
              सर्व नागरीक सेवा पहा <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Carousel indicator dots */}
        <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-2">
          <span className="w-6 h-1.5 bg-amber-400 rounded-full" />
          <span className="w-2 h-1.5 bg-white/60 rounded-full" />
          <span className="w-2 h-1.5 bg-white/60 rounded-full" />
        </div>
      </div>

      {/* Announcement Ticker Bar (khamshet.in style: #fef3c7 cream bar with red badge) */}
      <div className="bg-gold-100 border border-amber-200/80 p-3 rounded-2xl shadow-xs flex items-center gap-3 overflow-hidden text-xs font-bold text-slate-900">
        <span className="bg-red-600 text-white font-extrabold px-3 py-1 rounded-lg text-xs shrink-0 shadow-xs uppercase tracking-wide">
          नवी घोषणा:
        </span>
        <div className="truncate text-slate-800 font-semibold">
          सर्वांनी मिळून स्वच्छता पाळूया आणि स्वच्छ गाव घडवूया ! • स्वांतत्र्य दिन विशेष ग्रामसभा १५ ऑगस्ट रोजी सकाळी १०:०० वाजता आयोजित.
        </div>
      </div>

      {/* Important Notices Section (khamshet.in style: | महत्त्वाची सूचना) */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div className="border-l-[5px] border-[#881337] pl-3 flex items-center">
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              महत्त्वाची सूचना
            </h3>
          </div>

          <Link
            to="/notices"
            className="px-4 py-2 bg-maroon-850 hover:bg-maroon-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            सर्व घोषणा / कार्यक्रम हायलाइट्स पहा
          </Link>
        </div>

        {/* Notice Cards Grid matching screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sampleNoticeCards.map((card, idx) => (
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
          <div className="flex items-center gap-2 text-maroon-850 font-bold text-sm">
            <Bell className="w-4 h-4" />
            <span>अधिकृत अद्ययावत सूचना व परिपत्रके (Official Database Notices)</span>
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
            नागरिक सेवा (Citizen Quick Services)
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
