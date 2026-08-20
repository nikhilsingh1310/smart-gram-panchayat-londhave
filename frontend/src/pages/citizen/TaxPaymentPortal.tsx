import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, CheckCircle2, Download, QrCode, ShieldCheck, FileText, ArrowRight, X } from 'lucide-react';
import { apiFetch } from '../../services/api';
import { TaxBill } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const TaxPaymentPortal: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [bills, setBills] = useState<TaxBill[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected Bill for Payment Gateway Modal
  const [selectedBill, setSelectedBill] = useState<TaxBill | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CREDIT_CARD' | 'NET_BANKING'>('UPI');
  const [paying, setPaying] = useState(false);
  const [paidReceipt, setPaidReceipt] = useState<any>(null);

  useEffect(() => {
    if (user) fetchTaxBills();
    else setLoading(false);
  }, [user]);

  const fetchTaxBills = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/taxes/bills');
      if (res.success) {
        setBills(res.bills);
      }
    } catch (err) {
      console.error('Fetch Bills Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async () => {
    if (!selectedBill) return;

    setPaying(true);
    try {
      const res = await apiFetch('/taxes/pay', {
        method: 'POST',
        body: JSON.stringify({
          billId: selectedBill.id,
          paymentMethod
        })
      });

      if (res.success) {
        setPaidReceipt(res.payment);
        fetchTaxBills();
      }
    } catch (err: any) {
      alert(err.message || 'Payment failed');
    } finally {
      setPaying(false);
    }
  };

  const generateReceiptPDF = (receipt: any, bill: TaxBill) => {
    // Generate Printable HTML Window for Tax Receipt
    const printWin = window.open('', '_blank');
    if (!printWin) return;

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Tax Receipt - Gram Panchayat Londhave</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 30px; color: #1e293b; }
          .header { text-align: center; border-bottom: 2px solid #064e3b; padding-bottom: 15px; }
          .header h2 { margin: 0; color: #064e3b; }
          .header p { margin: 5px 0 0; font-size: 13px; color: #64748b; }
          .details { margin-top: 25px; line-height: 1.8; font-size: 14px; }
          .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .table th, .table td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
          .table th { background: #f1f5f9; }
          .stamp { margin-top: 40px; text-align: right; font-weight: bold; color: #064e3b; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>ग्रामपंचायत लोंढवे (Gram Panchayat Londhave)</h2>
          <p>ता. अमळनेर, जि. जळगाव • अधिकृत कर भरणा पावती (Tax Payment Receipt)</p>
        </div>
        <div class="details">
          <p><strong>Receipt No:</strong> ${receipt.receiptNo || 'LND-REC-2026'}</p>
          <p><strong>Transaction ID:</strong> ${receipt.transactionId}</p>
          <p><strong>Citizen Name:</strong> ${bill.citizenName}</p>
          <p><strong>Property No:</strong> ${bill.propertyNo} (House: ${bill.houseNo}, Ward: ${bill.wardNo})</p>
          <p><strong>Date & Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>Tax Assessment Type</th>
              <th>Assessment Year</th>
              <th>Status</th>
              <th>Amount Paid (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${bill.taxType}</td>
              <td>${bill.assessmentYear}</td>
              <td style="color: green; font-weight: bold;">PAID (यशस्वी)</td>
              <td>₹${bill.amount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        <div class="stamp">
          <p>स्वाक्षरी / ग्रामसेवक लोंढवे<br/>Digital Gram Panchayat Seal</p>
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
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-amber-400" />
            कर भरणा व ऑनलाइन पावती (Tax Payment Portal)
          </h2>
          <p className="text-xs text-emerald-200 mt-1">
            Pay Property House Tax, Water Tax, Street Light Tax with instant QR Code & downloadable official receipt.
          </p>
        </div>
      </div>

      {/* Tax Bills List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Assessed Property Tax Bills</h3>

        {!user ? (
          <div className="p-8 bg-amber-50 border border-amber-200 rounded-3xl text-center space-y-2">
            <p className="text-xs font-bold text-amber-900">Please log in with your mobile number to view and pay your tax bills.</p>
          </div>
        ) : loading ? (
          <div className="p-8 text-center text-slate-500 text-xs">Loading Tax Bills...</div>
        ) : bills.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs bg-white rounded-3xl border border-slate-200">
            No tax dues found for your account.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bills.map((bill) => (
              <div key={bill.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-slate-900 text-white font-mono text-[10px] font-bold rounded">
                    {bill.billNo}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    bill.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {bill.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">{bill.taxType}</h4>
                  <p className="text-xs text-slate-500">Property No: {bill.propertyNo} • House: {bill.houseNo} (Ward {bill.wardNo})</p>
                </div>

                <div className="flex items-baseline justify-between pt-2 border-t border-slate-100">
                  <div>
                    <div className="text-[10px] text-slate-400">Assessment Year: {bill.assessmentYear}</div>
                    <div className="text-lg font-extrabold text-slate-900">₹{bill.amount.toFixed(2)}</div>
                  </div>

                  {bill.status === 'UNPAID' ? (
                    <button
                      onClick={() => { setSelectedBill(bill); setPaidReceipt(null); }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                    >
                      Pay Now (कर भरा) <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => generateReceiptPDF(bill.payments?.[0] || { receiptNo: 'LND-REC-2026', transactionId: 'TXN-PAID' }, bill)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-600" /> Download Receipt
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mock Sandbox Payment Modal */}
      {selectedBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-950 to-teal-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold">Mock Gateway Checkout</h3>
                  <p className="text-[10px] text-emerald-200">Gram Panchayat Londhave Sandbox Payment</p>
                </div>
              </div>
              <button onClick={() => setSelectedBill(null)} className="text-emerald-200 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!paidReceipt ? (
              <div className="p-6 space-y-4">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-600">Tax Type:</span>
                    <span className="text-slate-900 font-bold">{selectedBill.taxType}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-600">Bill No:</span>
                    <span className="text-slate-900 font-mono">{selectedBill.billNo}</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-sm pt-1 border-t border-slate-200 text-emerald-800">
                    <span>Total Amount Dues:</span>
                    <span>₹{selectedBill.amount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Method Tabs */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">Select Payment Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['UPI', 'CREDIT_CARD', 'NET_BANKING'].map((m) => (
                      <button
                        type="button"
                        key={m}
                        onClick={() => setPaymentMethod(m as any)}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                          paymentMethod === m
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {m === 'UPI' ? 'BHIM UPI / QR' : m === 'CREDIT_CARD' ? 'Card' : 'Net Banking'}
                      </button>
                    ))}
                  </div>
                </div>

                {paymentMethod === 'UPI' && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
                    <div className="w-32 h-32 bg-white border-2 border-slate-900 p-2 rounded-xl mx-auto flex items-center justify-center font-bold text-slate-800">
                      <QrCode className="w-24 h-24 text-emerald-800" />
                    </div>
                    <p className="text-[11px] text-slate-500 font-semibold">Scan QR with Google Pay, PhonePe, or Paytm</p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handlePayNow}
                  disabled={paying}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {paying ? 'Processing Sandbox Txn...' : `Pay ₹${selectedBill.amount.toFixed(2)} Now`}
                </button>
              </div>
            ) : (
              <div className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Payment Successful!</h4>
                  <p className="text-xs text-slate-500">Receipt No: {paidReceipt.receiptNo}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => generateReceiptPDF(paidReceipt, selectedBill)}
                    className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-4 h-4" /> Download Official Receipt
                  </button>
                  <button
                    onClick={() => setSelectedBill(null)}
                    className="py-3 px-4 border border-slate-200 text-slate-600 rounded-xl font-bold text-xs"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
