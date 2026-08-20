import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  IndianRupee, 
  Award, 
  TrendingUp, 
  FileText, 
  ShieldCheck,
  Plus,
  ArrowUpRight
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { apiFetch } from '../../services/api';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/admin/metrics');
      if (res.success) {
        setData(res);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load metrics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold">Loading Admin Analytics & Metrics...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-2xl m-6 border border-red-200">
        <p className="font-bold">Dashboard Error</p>
        <p className="text-xs">{error}</p>
        <button onClick={fetchMetrics} className="mt-3 px-4 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg">
          Retry
        </button>
      </div>
    );
  }

  const { metrics, charts, recentActivity } = data;

  const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6'];

  const metricCards = [
    { label: t('admin.total_citizens'), value: metrics.totalCitizens, icon: Users, color: 'from-blue-600 to-indigo-700', bg: 'bg-blue-50 text-blue-700' },
    { label: t('admin.total_complaints'), value: metrics.totalComplaints, icon: AlertCircle, color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50 text-amber-700' },
    { label: t('admin.resolved_complaints'), value: metrics.resolvedComplaints, icon: CheckCircle2, color: 'from-emerald-600 to-teal-700', bg: 'bg-emerald-50 text-emerald-700' },
    { label: t('admin.pending_complaints'), value: metrics.pendingComplaints, icon: Clock, color: 'from-rose-500 to-red-600', bg: 'bg-rose-50 text-rose-700' },
    { label: t('admin.tax_collected'), value: `₹${metrics.totalTaxCollected.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'from-emerald-700 to-green-800', bg: 'bg-emerald-50 text-emerald-800' },
    { label: t('admin.scheme_beneficiaries'), value: metrics.schemeBeneficiaries, icon: Award, color: 'from-purple-600 to-indigo-700', bg: 'bg-purple-50 text-purple-700' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl border border-emerald-900/40">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Gram Panchayat Londhave Admin Center</h2>
          <p className="text-xs text-emerald-300 mt-1">
            Real-time governance dashboard • Amalner Taluka, Jalgaon District
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/content"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Trilingual Content</span>
          </Link>
          <Link
            to="/admin/notifications"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5 transition-all"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Broadcast Alert</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-xl ${card.bg}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-lg font-extrabold text-slate-900 tracking-tight">{card.value}</div>
              <div className="text-[11px] font-semibold text-slate-500 mt-0.5 truncate">{card.label}</div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Complaints by Category Chart */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Complaints by Category</h3>
              <p className="text-[11px] text-slate-500">Distribution of citizen grievances</p>
            </div>
            <Link to="/admin/complaints" className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-0.5">
              Manage Queue <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.complaintsByCategory}>
                <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="count" fill="#059669" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Complaint Status Breakdown Pie */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Grievance Resolution Status</h3>
              <p className="text-[11px] text-slate-500">Live progress of citizen tickets</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.complaintStatusBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {charts.complaintStatusBreakdown.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Audit & System Log Activity */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Recent Admin & Staff Activity Log</h3>
          </div>
          <Link to="/admin/audit" className="text-xs text-emerald-700 font-bold hover:underline">
            View All Audit Logs →
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {recentActivity.map((log: any) => (
            <div key={log.id} className="py-3 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 shrink-0">
                  {log.actorName[0]}
                </div>
                <div>
                  <div className="font-semibold text-slate-900">
                    <span className="text-emerald-700 font-bold">{log.actorName}</span> ({log.actorRole}) performed <span className="font-mono text-slate-800 bg-slate-100 px-1 py-0.5 rounded">{log.action}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Entity: {log.entity} • IP: {log.ipAddress || '127.0.0.1'}
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-slate-400 whitespace-nowrap">
                {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
