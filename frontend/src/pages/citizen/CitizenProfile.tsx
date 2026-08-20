import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User as UserIcon, AlertCircle, CreditCard, FileText, Globe, LogOut, Phone, Home as HouseIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../services/api';
import { Complaint, TaxBill, CertificateApp } from '../../types';

export const CitizenProfile: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout, setLanguage } = useAuth();

  const [activeTab, setActiveTab] = useState<'complaints' | 'taxes' | 'certs'>('complaints');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [bills, setBills] = useState<TaxBill[]>([]);
  const [certs, setCerts] = useState<CertificateApp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [cmpRes, taxRes, certRes] = await Promise.all([
        apiFetch('/complaints'),
        apiFetch('/taxes/bills'),
        apiFetch('/certificates')
      ]);
      if (cmpRes.success) setComplaints(cmpRes.complaints);
      if (taxRes.success) setBills(taxRes.bills);
      if (certRes.success) setCerts(certRes.apps);
    } catch (err) {
      console.error('Fetch Profile Data Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 shadow-xs max-w-md mx-auto space-y-3 my-8">
        <UserIcon className="w-12 h-12 text-slate-400 mx-auto" />
        <h3 className="text-base font-bold text-slate-900">Citizen Profile</h3>
        <p className="text-xs text-slate-500">Please log in using your mobile number and OTP to view your history and applications.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 lg:pb-6">
      {/* Profile Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-600 to-teal-800 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg">
            {user.name[0]}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{user.name}</h2>
            <div className="text-xs text-slate-500 font-medium flex items-center gap-3 mt-0.5">
              <span>📱 +91 {user.mobile || '—'}</span>
              <span>🏠 House {user.houseNo || 'H-102'} (Ward {user.wardNo || '1'})</span>
            </div>
            <span className="inline-block mt-2 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
              Registered Citizen (नागरिक)
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      {/* History Tabs */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex border-b border-slate-100 bg-slate-50">
          <button
            onClick={() => setActiveTab('complaints')}
            className={`flex-1 py-3 text-xs font-bold text-center transition-all ${
              activeTab === 'complaints'
                ? 'bg-white text-emerald-700 border-b-2 border-emerald-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <AlertCircle className="w-4 h-4 inline mr-1 mb-0.5" />
            My Complaints ({complaints.length})
          </button>

          <button
            onClick={() => setActiveTab('taxes')}
            className={`flex-1 py-3 text-xs font-bold text-center transition-all ${
              activeTab === 'taxes'
                ? 'bg-white text-emerald-700 border-b-2 border-emerald-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <CreditCard className="w-4 h-4 inline mr-1 mb-0.5" />
            My Tax Receipts ({bills.length})
          </button>

          <button
            onClick={() => setActiveTab('certs')}
            className={`flex-1 py-3 text-xs font-bold text-center transition-all ${
              activeTab === 'certs'
                ? 'bg-white text-emerald-700 border-b-2 border-emerald-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-1 mb-0.5" />
            My Certificates ({certs.length})
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center text-slate-500 text-xs py-6">Loading History...</div>
          ) : activeTab === 'complaints' ? (
            <div className="space-y-3">
              {complaints.length === 0 ? (
                <div className="text-xs text-slate-500">No complaints logged.</div>
              ) : (
                complaints.map((c) => (
                  <div key={c.id} className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{c.title}</div>
                      <div className="text-[11px] text-slate-500">Ticket: {c.ticketNo} • {new Date(c.createdAt).toLocaleDateString()}</div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      c.status === 'RESOLVED' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          ) : activeTab === 'taxes' ? (
            <div className="space-y-3">
              {bills.length === 0 ? (
                <div className="text-xs text-slate-500">No tax records found.</div>
              ) : (
                bills.map((b) => (
                  <div key={b.id} className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{b.taxType} (Bill: {b.billNo})</div>
                      <div className="text-[11px] text-slate-500">Amount: ₹{b.amount.toFixed(2)} • Year: {b.assessmentYear}</div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      b.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {b.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {certs.length === 0 ? (
                <div className="text-xs text-slate-500">No certificate applications found.</div>
              ) : (
                certs.map((app) => (
                  <div key={app.id} className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{app.certType} Certificate</div>
                      <div className="text-[11px] text-slate-500">App No: {app.applicationNo} • {new Date(app.appliedAt).toLocaleDateString()}</div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      app.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
