import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  AlertCircle, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  FileText, 
  X, 
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';
import { apiFetch } from '../../services/api';
import { Complaint, User } from '../../types';

export const AdminComplaints: React.FC = () => {
  const { t } = useTranslation();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [staffUsers, setStaffUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [search, setSearch] = useState('');

  // Selected Complaint Modal for Updating
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [newStatus, setNewStatus] = useState<string>('PENDING');
  const [assignedToId, setAssignedToId] = useState<string>('');
  const [resolutionRemarks, setResolutionRemarks] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchComplaints();
    fetchStaff();
  }, [statusFilter, categoryFilter]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (categoryFilter) params.append('category', categoryFilter);

      const res = await apiFetch(`/complaints?${params.toString()}`);
      if (res.success) {
        setComplaints(res.complaints);
      }
    } catch (err) {
      console.error('Fetch Complaints Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await apiFetch('/admin/users?role=EMPLOYEE');
      if (res.success) {
        setStaffUsers(res.users);
      }
    } catch (err) {
      console.error('Fetch Staff Error:', err);
    }
  };

  const handleOpenModal = (cmp: Complaint) => {
    setSelectedComplaint(cmp);
    setNewStatus(cmp.status);
    setAssignedToId(cmp.assignedTo?.id || '');
    setResolutionRemarks(cmp.resolutionRemarks || '');
  };

  const handleUpdateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    setUpdating(true);
    try {
      const res = await apiFetch(`/complaints/${selectedComplaint.id}/status`, {
        method: 'PUT',
        body: JSON.stringify({
          status: newStatus,
          assignedToId: assignedToId || null,
          resolutionRemarks
        })
      });

      if (res.success) {
        setSelectedComplaint(null);
        fetchComplaints();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update complaint');
    } finally {
      setUpdating(false);
    }
  };

  const filtered = complaints.filter(c => {
    if (!search) return true;
    return c.ticketNo.toLowerCase().includes(search.toLowerCase()) ||
           c.title.toLowerCase().includes(search.toLowerCase()) ||
           c.citizenName.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            Complaint & Grievance Processing Queue
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Assign incoming citizen issues to department staff, monitor status, and log official resolution remarks.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ticket no, title, citizen..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="">All Categories</option>
            <option value="WATER">Water Supply</option>
            <option value="STREETLIGHT">Streetlight</option>
            <option value="ROADS">Roads & Potholes</option>
            <option value="GARBAGE">Garbage Collection</option>
            <option value="DRAINAGE">Drainage Leakage</option>
          </select>
        </div>
      </div>

      {/* Complaints List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs">Loading Grievance Queue...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">No complaints found.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((cmp) => (
              <div key={cmp.id} className="p-5 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 bg-slate-900 text-white font-mono text-[10px] font-bold rounded">
                      {cmp.ticketNo}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-semibold rounded uppercase">
                      {cmp.category}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      cmp.priority === 'URGENT' ? 'bg-red-100 text-red-800' :
                      cmp.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {cmp.priority} Priority
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      cmp.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                      cmp.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {cmp.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{cmp.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{cmp.description}</p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                    <span>Citizen: <strong className="text-slate-700">{cmp.citizenName}</strong> (+91 {cmp.citizenMobile})</span>
                    <span>Location: <strong className="text-slate-700">{cmp.location}</strong></span>
                    {cmp.assignedTo && (
                      <span>Assigned Staff: <strong className="text-emerald-700">{cmp.assignedTo.name}</strong></span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenModal(cmp)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                  >
                    Process & Assign
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">Process Complaint {selectedComplaint.ticketNo}</h3>
                <p className="text-[11px] text-slate-400">{selectedComplaint.title}</p>
              </div>
              <button onClick={() => setSelectedComplaint(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateComplaint} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Update Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Assign to Staff Member</label>
                <select
                  value={assignedToId}
                  onChange={(e) => setAssignedToId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  <option value="">Unassigned</option>
                  {staffUsers.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.name} ({staff.department || 'Staff'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Resolution Remarks / Notes</label>
                <textarea
                  rows={3}
                  value={resolutionRemarks}
                  onChange={(e) => setResolutionRemarks(e.target.value)}
                  placeholder="Enter details about action taken or resolution provided..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md disabled:opacity-50"
                >
                  {updating ? 'Saving...' : 'Update Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
