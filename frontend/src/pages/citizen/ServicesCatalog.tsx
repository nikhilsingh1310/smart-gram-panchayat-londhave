import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  CreditCard, 
  AlertCircle, 
  FileText, 
  Bell, 
  Award, 
  PhoneCall, 
  Calendar, 
  Grid, 
  Building2, 
  Vote, 
  Clock, 
  TrendingUp, 
  FolderDown,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const ServicesCatalog: React.FC = () => {
  const { t } = useTranslation();

  const services = [
    { title: t('home.pay_tax_now'), desc: 'House Property, Water, Light & Sanitation Tax', path: '/taxes', icon: CreditCard, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { title: t('home.file_complaint'), desc: 'Submit grievances with photo & location, track progress', path: '/complaints', icon: AlertCircle, color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { title: t('home.apply_certificate'), desc: 'Residence, Birth, Death, No-Dues & Income certificates', path: '/certificates', icon: FileText, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { title: t('nav.notices'), desc: 'Gram Sabha Notices, Tenders & Official Circulars', path: '/notices', icon: Bell, color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { title: t('home.view_schemes'), desc: 'PM-Kisan, PMAY-G, Jal Jeevan Mission, MGNREGA', path: '/schemes', icon: Award, color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    { title: t('nav.gp_info'), desc: 'Sarpanch, Gramsevak, Members list & office timing', path: '/gp-info', icon: Building2, color: 'bg-slate-100 text-slate-800 border-slate-200' },
    { title: t('nav.village_info'), desc: 'Schools, Health Center, Bank, Temples & Facilities', path: '/village-info', icon: Grid, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { title: t('nav.events'), desc: 'Gram Sabha, Health Camps, Tree Plantation', path: '/events', icon: Calendar, color: 'bg-rose-50 text-rose-700 border-rose-200' },
    { title: t('nav.development'), desc: 'Public charts on roads, tap water, lighting & schools', path: '/development', icon: TrendingUp, color: 'bg-teal-50 text-teal-800 border-teal-200' },
    { title: 'Utility Schedules', desc: 'Water supply timings, garbage route, power outages', path: '/utilities', icon: Clock, color: 'bg-amber-50 text-amber-800 border-amber-200' },
    { title: 'Surveys & Polls', desc: 'Citizen voting & community feedback', path: '/polls', icon: Vote, color: 'bg-blue-50 text-blue-800 border-blue-200' },
    { title: t('nav.documents'), desc: 'Download official forms, GRs & circulars in PDF', path: '/documents', icon: FolderDown, color: 'bg-emerald-50 text-emerald-900 border-emerald-200' },
    { title: t('nav.contacts'), desc: 'Police, Ambulance, Fire, Talathi, BDO click-to-call', path: '/contacts', icon: PhoneCall, color: 'bg-red-50 text-red-700 border-red-200' },
  ];

  return (
    <div className="space-y-6 pb-16 lg:pb-6">
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <Grid className="w-6 h-6 text-amber-400" />
          नागरिक सेवा दालन (Digital Citizen Services Catalog)
        </h2>
        <p className="text-xs text-emerald-200">
          Complete directory of digital e-governance services offered by Gram Panchayat Londhave.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((s, idx) => {
          const Icon = s.icon;
          return (
            <Link
              key={idx}
              to={s.path}
              className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex items-start justify-between gap-4 group"
            >
              <div className="space-y-2">
                <div className={`w-10 h-10 rounded-2xl ${s.color} border flex items-center justify-center font-bold`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {s.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{s.desc}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0 mt-2" />
            </Link>
          );
        })}
      </div>
    </div>
  );
};
