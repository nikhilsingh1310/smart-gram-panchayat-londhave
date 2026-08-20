import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, CheckCircle2, Award, Building2 } from 'lucide-react';
import { apiFetch } from '../../services/api';

export const VillageDevelopmentDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDevData();
  }, []);

  const fetchDevData = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/utilities/development-dashboard');
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Fetch Dev Data Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 text-xs">Loading Development Dashboard...</div>;

  return (
    <div className="space-y-6 pb-16 lg:pb-6">
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-2">
        <h2 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-amber-400" />
          गाव विकास डॅशबोर्ड (Village Development Dashboard)
        </h2>
        <p className="text-xs text-emerald-200">
          Public transparency portal displaying progress on roads, Har Ghar Jal tap connections, solar lighting, and school digitalization in Londhave.
        </p>
      </div>

      {/* Progress Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.infrastructureMetrics.map((item: any, idx: number) => (
          <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">{item.name}</span>
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full">
                {item.percentage}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className="bg-gradient-to-r from-emerald-600 to-teal-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-500 font-semibold">{item.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
