import React, { useState, useEffect } from 'react';
import { BellRing, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { apiFetch } from '../../services/api';

export const AdminNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState('PUSH');
  const [audience, setAudience] = useState('ALL');
  const [sending, setSending] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await apiFetch('/notifications');
      if (res.success) {
        setNotifications(res.notifications);
      }
    } catch (err) {
      console.error('Fetch Notifications Error:', err);
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    setSending(true);
    try {
      const res = await apiFetch('/notifications/broadcast', {
        method: 'POST',
        body: JSON.stringify({ title, message, channel, audience })
      });

      if (res.success) {
        setTitle('');
        setMessage('');
        setStatusMsg(`Broadcast notification sent successfully via ${channel} to ${audience}!`);
        fetchNotifications();
        setTimeout(() => setStatusMsg(''), 4000);
      }
    } catch (err: any) {
      alert('Broadcast failed: ' + err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <BellRing className="w-5 h-5 text-amber-500" />
          Broadcast Public Announcements & Alert Composer
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Send emergency alerts, Gram Sabha reminders, and utility notices directly to citizens' mobile apps via Push & SMS.
        </p>
      </div>

      {statusMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {statusMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Composer Form */}
        <form onSubmit={handleBroadcast} className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Broadcast Composer</h3>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Notification Channel</label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
            >
              <option value="PUSH">App Push Notification</option>
              <option value="SMS">SMS Gateway Stub</option>
              <option value="WHATSAPP">WhatsApp Business Alert</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Target Audience</label>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
            >
              <option value="ALL">All Village Residents</option>
              <option value="WARD_1">Ward 1 Residents Only</option>
              <option value="WARD_2">Ward 2 Residents Only</option>
              <option value="STAFF">Gram Panchayat Staff</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Alert Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Gram Sabha Reminder"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Alert Message</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write broadcast text..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              required
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {sending ? 'Broadcasting...' : 'Broadcast Alert Now'}
          </button>
        </form>

        {/* History Log */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Past Broadcast Log</h3>
          <div className="divide-y divide-slate-100 max-h-[450px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-xs text-slate-500 p-4">No broadcast history.</div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="py-3 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{n.title}</span>
                    <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                      {n.channel} • {n.audience}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{n.message}</p>
                  <div className="text-[10px] text-slate-400">
                    Sent at: {new Date(n.sentAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
