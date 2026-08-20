import React, { useState } from 'react';
import { BarChart3, Download, FileSpreadsheet, FileText, CheckCircle } from 'lucide-react';
import { apiFetch } from '../../services/api';
import * as XLSX from 'xlsx';

export const AdminReports: React.FC = () => {
  const [exporting, setExporting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const exportComplaintsExcel = async () => {
    setExporting(true);
    try {
      const res = await apiFetch('/complaints');
      if (res.success && res.complaints) {
        const rows = res.complaints.map((c: any) => ({
          'Ticket No': c.ticketNo,
          'Citizen Name': c.citizenName,
          'Mobile': c.citizenMobile,
          'Category': c.category,
          'Priority': c.priority,
          'Status': c.status,
          'Title': c.title,
          'Location': c.location,
          'Ward': c.wardNo || '1',
          'Assigned Staff': c.assignedTo?.name || 'Unassigned',
          'Created Date': new Date(c.createdAt).toLocaleDateString(),
        }));

        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Complaints Report');
        XLSX.writeFile(workbook, `Londhave_Complaints_Report_${Date.now()}.xlsx`);

        setSuccessMsg('Complaints Excel Report exported successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err: any) {
      alert('Export failed: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  const exportTaxesExcel = async () => {
    setExporting(true);
    try {
      const res = await apiFetch('/taxes/bills');
      if (res.success && res.bills) {
        const rows = res.bills.map((b: any) => ({
          'Bill No': b.billNo,
          'Citizen Name': b.citizenName,
          'Property No': b.propertyNo,
          'House No': b.houseNo,
          'Ward': b.wardNo,
          'Tax Type': b.taxType,
          'Amount (₹)': b.amount,
          'Assessment Year': b.assessmentYear,
          'Status': b.status,
        }));

        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Tax Collection Report');
        XLSX.writeFile(workbook, `Londhave_Tax_Report_${Date.now()}.xlsx`);

        setSuccessMsg('Tax Collection Excel Report exported successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err: any) {
      alert('Export failed: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-600" />
          Gram Panchayat Reports & Data Export Hub
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Generate official Excel (.xlsx) and formatted PDF reports for Gram Sabha audits and government submissions.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          {successMsg}
        </div>
      )}

      {/* Export Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Complaints & Grievances Report</h3>
              <p className="text-xs text-slate-500">Detailed queue history, response times, and staff assignments.</p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={exportComplaintsExcel}
              disabled={exporting}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" /> Export Excel (.xlsx)
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Property & Water Tax Collection Report</h3>
              <p className="text-xs text-slate-500">Complete assessment year revenue, paid/unpaid bills breakdown.</p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={exportTaxesExcel}
              disabled={exporting}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" /> Export Excel (.xlsx)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
