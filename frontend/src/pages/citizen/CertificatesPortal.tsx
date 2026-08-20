import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Plus, Download, X } from 'lucide-react';
import { apiFetch } from '../../services/api';
import { CertificateApp } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const CertificatesPortal: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [apps, setApps] = useState<CertificateApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  // Form Fields
  const [certType, setCertType] = useState<'BIRTH' | 'DEATH' | 'RESIDENCE' | 'NO_DUES' | 'INCOME_REF'>('RESIDENCE');
  const [fatherName, setFatherName] = useState('');
  const [reason, setReason] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) fetchApplications();
    else setLoading(false);
  }, [user]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/certificates');
      if (res.success) {
        setApps(res.apps);
      }
    } catch (err) {
      console.error('Fetch Certificates Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to apply for certificates');
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiFetch('/certificates/apply', {
        method: 'POST',
        body: JSON.stringify({
          certType,
          applicantDetails: {
            fatherName,
            reason,
            dob,
            address
          }
        })
      });

      if (res.success) {
        setIsApplyOpen(false);
        setFatherName('');
        setReason('');
        fetchApplications();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to submit certificate application');
    } finally {
      setSubmitting(false);
    }
  };

  const generateCertPDF = (app: CertificateApp) => {
    const printWin = window.open('', '_blank');
    if (!printWin) return;

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Digital Certificate - Gram Panchayat Londhave</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #0f172a; border: 10px double #881337; }
          .header { text-align: center; border-bottom: 3px double #881337; padding-bottom: 15px; }
          .header h1 { margin: 0; color: #881337; text-transform: uppercase; font-size: 24px; }
          .header p { margin: 5px 0 0; font-size: 13px; color: #475569; }
          .title { text-align: center; font-size: 20px; font-weight: bold; margin: 30px 0; text-decoration: underline; color: #881337; }
          .body { font-size: 15px; line-height: 2; margin-top: 20px; text-align: justify; }
          .footer { margin-top: 60px; display: flex; justify-content: space-between; font-weight: bold; }
          .seal { text-align: right; color: #881337; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>ग्रामपंचायत लोंढवे (Gram Panchayat Londhave)</h1>
          <p>ता. अमळनेर, जि. जळगाव, महाराष्ट्र शासन • डिजिटल दाखला / प्रमाणपत्र</p>
        </div>
        <div class="title">
          ${app.certType} CERTIFICATE (दाखला)
        </div>
        <div class="body">
          <p>Application No: <strong>${app.applicationNo}</strong></p>
          <p>This is to officially certify that <strong>${app.citizenName}</strong>, S/D/o <strong>${app.applicantDetails?.fatherName || 'Patil'}</strong>, is a permanent bona fide resident of <strong>Londhave Village, Taluka Amalner, District Jalgaon</strong>.</p>
          <p>Reason for Certificate Issue: <strong>${app.applicantDetails?.reason || 'Official Purpose'}</strong>.</p>
          <p>Issued Date: <strong>${new Date().toLocaleDateString()}</strong></p>
        </div>
        <div class="footer">
          <div>
            Verification Code: LND-VER-2026<br/>
            Valid across GoM & GoI Portals
          </div>
          <div class="seal">
            ग्रामसेवक / सरपंच<br/>
            ग्रामपंचायत लोंढवे
          </div>
        </div>
        <script>window.print();</script>
      </body>
      </html>
    `);
    printWin.document.close();
  };

  return (
    <div className="space-y-6 pb-16 lg:pb-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#881337] via-[#4c0519] to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-400" />
            {t('pages.certificates_title')}
          </h2>
          <p className="text-xs text-rose-200 mt-1">
            {t('pages.certificates_subtitle')}
          </p>
        </div>

        <button
          onClick={() => setIsApplyOpen(true)}
          className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t('home.apply_certificate')}</span>
        </button>
      </div>

      {/* Applications Queue */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900">{t('nav.certificates')}</h3>

        {!user ? (
          <div className="p-8 bg-amber-50 border border-amber-200 rounded-3xl text-center space-y-2">
            <p className="text-xs font-bold text-amber-900">Please log in to submit certificate requests and download issued certificates.</p>
          </div>
        ) : loading ? (
          <div className="p-8 text-center text-slate-500 text-xs">{t('common.loading')}</div>
        ) : apps.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs bg-white rounded-3xl border border-slate-200">
            No certificate applications found.
          </div>
        ) : (
          <div className="space-y-4">
            {apps.map((app) => (
              <div key={app.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-slate-900 text-white font-mono text-[11px] font-bold rounded">
                      {app.applicationNo}
                    </span>
                    <span className="px-2.5 py-0.5 bg-rose-50 text-[#881337] text-[10px] font-bold rounded border border-rose-200">
                      {app.certType}
                    </span>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    app.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {app.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">{app.certType} Certificate</h4>
                  <p className="text-xs text-slate-500">Applicant: {app.citizenName} • Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="text-[11px] text-slate-400">
                    Reason: <strong className="text-slate-700">{app.applicantDetails?.reason || 'Official Purpose'}</strong>
                  </div>

                  {app.status === 'APPROVED' && (
                    <button
                      onClick={() => generateCertPDF(app)}
                      className="px-4 py-2 bg-[#881337] hover:bg-[#6b0f2b] text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                    >
                      <Download className="w-4 h-4" /> Download Certificate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {isApplyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-[#881337] text-white p-5 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                {t('home.apply_certificate')}
              </h3>
              <button onClick={() => setIsApplyOpen(false)} className="text-rose-200 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApply} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Certificate Type (प्रमाणपत्र प्रकार)</label>
                <select
                  value={certType}
                  onChange={(e: any) => setCertType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  <option value="RESIDENCE">Residence Certificate (रहिवासी दाखला)</option>
                  <option value="NO_DUES">No-Dues Certificate (थकबाकी नसल्याचा दाखला)</option>
                  <option value="BIRTH">Birth Certificate (जन्म दाखला reference)</option>
                  <option value="DEATH">Death Certificate (मृत्यू दाखला reference)</option>
                  <option value="INCOME_REF">Income Reference Certificate</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Father's / Husband's Name</label>
                <input
                  type="text"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  placeholder="e.g. Anand Patil"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Reason for Requirement</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Bank Loan, School Admission, Electricity Meter Transfer"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsApplyOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-[#881337] hover:bg-[#6b0f2b] text-white text-xs font-bold rounded-xl shadow-md disabled:opacity-50"
                >
                  {submitting ? t('common.loading') : t('common.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
