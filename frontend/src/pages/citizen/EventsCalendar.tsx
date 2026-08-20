import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { apiFetch } from '../../services/api';
import { ContentItem } from '../../types';

export const EventsCalendar: React.FC = () => {
  const { i18n } = useTranslation();
  const [events, setEvents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const lang = i18n.language || 'en';

  useEffect(() => {
    fetchEvents();
  }, [lang]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await apiFetch(`/content?type=EVENT&lang=${lang}`);
      if (res.success) {
        setEvents(res.items);
      }
    } catch (err) {
      console.error('Fetch Events Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 lg:pb-6">
      <div className="bg-gradient-to-r from-emerald-950 to-teal-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <Calendar className="w-6 h-6 text-amber-400" />
          कार्यक्रम व ग्रामसभा (Events & Gram Sabha Calendar)
        </h2>
        <p className="text-xs text-emerald-200">
          Upcoming health camps, tree plantation drives, cultural programs, and Gram Sabha meetings in Londhave.
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500 text-xs">Loading Events...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((ev) => (
            <div key={ev.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full">
                {ev.category || 'Village Event'}
              </span>
              <h3 className="text-base font-bold text-slate-900">{ev.translation?.title}</h3>
              {ev.translation?.subtitle && (
                <p className="text-xs text-slate-600">{ev.translation.subtitle}</p>
              )}
              {ev.translation?.body && (
                <p className="text-xs text-slate-600 leading-relaxed">{ev.translation.body}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
