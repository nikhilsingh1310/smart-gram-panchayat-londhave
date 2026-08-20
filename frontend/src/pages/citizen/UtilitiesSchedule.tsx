import React, { useState, useEffect } from 'react';
import { Droplets, Trash2, Zap, Clock } from 'lucide-react';
import { apiFetch } from '../../services/api';

export const UtilitiesSchedule: React.FC = () => {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/utilities/schedules');
      if (res.success) {
        setSchedules(res.schedules);
      }
    } catch (err) {
      console.error('Fetch Schedules Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 lg:pb-6">
      <div className="bg-gradient-to-r from-blue-900 to-teal-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <Clock className="w-6 h-6 text-amber-400" />
          वेळापत्रक (Water, Garbage & Electricity Schedules)
        </h2>
        <p className="text-xs text-blue-200">
          Area-wise water supply timing, door-to-door garbage collection routes, and scheduled electricity maintenance alerts.
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500 text-xs">Loading Schedules...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schedules.map((s) => (
            <div key={s.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  s.type === 'WATER_SUPPLY' ? 'bg-blue-100 text-blue-800' :
                  s.type === 'GARBAGE_COLLECTION' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                }`}>
                  {s.type.replace('_', ' ')}
                </span>
                <span className="text-[11px] font-semibold text-slate-500">{s.scheduleDate || 'Daily'}</span>
              </div>

              <h4 className="text-sm font-bold text-slate-900">{s.area}</h4>
              <div className="p-3 bg-slate-50 rounded-2xl text-xs font-bold text-slate-800 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" /> Timing: {s.timing}
              </div>

              {s.remarks && (
                <p className="text-xs text-slate-500">{s.remarks}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
