import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search } from 'lucide-react';
import { apiFetch } from '../../services/api';

export const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/admin/audit-logs');
      if (res.success) {
        setLogs(res.logs);
      }
    } catch (err) {
      console.error('Fetch Logs Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = logs.filter(l => {
    if (!search) return true;
    return l.actorName.toLowerCase().includes(search.toLowerCase()) ||
           l.action.toLowerCase().includes(search.toLowerCase()) ||
           l.entity.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Security & System Audit Logs
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Immutable tracking log of administrative actions for CERT-In governance compliance.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit trail..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs">Loading Audit Logs...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">No audit logs found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Actor / User</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Entity</th>
                  <th className="p-4">Details</th>
                  <th className="p-4">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono text-slate-500 text-[11px]">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4 font-bold text-slate-900">
                      {log.actorName} <span className="text-[10px] text-slate-400 font-normal">({log.actorRole})</span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 bg-slate-100 font-mono text-slate-800 text-[10px] font-bold rounded">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-emerald-700 font-semibold">
                      {log.entity}
                    </td>
                    <td className="p-4 text-slate-600 font-mono text-[11px] max-w-xs truncate">
                      {JSON.stringify(log.details || {})}
                    </td>
                    <td className="p-4 text-slate-400 font-mono">
                      {log.ipAddress || '127.0.0.1'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
