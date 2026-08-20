import React, { useState } from 'react';
import { X, Smartphone, ShieldCheck, ArrowRight, UserCheck, Crown, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { loginCitizenOTP } = useAuth();

  const [loginMode, setLoginMode] = useState<'CITIZEN' | 'ADMIN'>('CITIZEN');
  const [mobile, setMobile] = useState('9876543210');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [devOtpHint, setDevOtpHint] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSelectMode = (mode: 'CITIZEN' | 'ADMIN') => {
    setLoginMode(mode);
    setError('');
    setOtpSent(false);
    if (mode === 'ADMIN') {
      setMobile('9422200001'); // Sarpanch / GP Admin Mobile
    } else {
      setMobile('9876543210'); // Citizen Mobile
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!mobile || mobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    try {
      const res = await apiFetch('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ mobile })
      });
      if (res.success) {
        setOtpSent(true);
        setDevOtpHint(res.devOTP || '123456');
        setOtpCode(res.devOTP || '123456'); // Auto-fill for 1-tap ease
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginCitizenOTP(mobile, otpCode);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-850 to-emerald-950 px-6 py-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-200 hover:text-white bg-emerald-950/40 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center border border-amber-400/30">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Smart Portal Login</h3>
              <p className="text-xs text-emerald-200">Gram Panchayat Londhave Digital Gateway</p>
            </div>
          </div>
        </div>

        {/* 2 Login Selection Buttons */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSelectMode('CITIZEN')}
              className={`p-3.5 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                loginMode === 'CITIZEN'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md font-bold'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-xs">Citizen Login (नागरिक)</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectMode('ADMIN')}
              className={`p-3.5 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                loginMode === 'ADMIN'
                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md font-bold'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Crown className="w-5 h-5" />
              <span className="text-xs">Admin Login (प्रशासन / सरपंच)</span>
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 font-medium">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          {!otpSent ? (
            <form onSubmit={handleSendOTP} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {loginMode === 'ADMIN' ? 'Admin / Sarpanch Mobile Number' : 'Citizen Mobile Number'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-medium text-sm">
                    +91
                  </div>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 text-white rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 ${
                  loginMode === 'ADMIN'
                    ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/25'
                    : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25'
                }`}
              >
                {loading ? 'Sending OTP...' : `Login as ${loginMode === 'ADMIN' ? 'Gram Panchayat Admin' : 'Citizen'}`}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4 pt-1">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
                <span>OTP sent to +91 {mobile}</span>
                <span className="font-mono bg-amber-200/80 px-2 py-0.5 rounded font-bold">Code: {devOtpHint}</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Enter 6-Digit OTP Code
                </label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  className="w-full text-center tracking-widest text-lg font-mono py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="w-1/3 py-3 border border-slate-200 text-slate-600 rounded-xl font-semibold text-xs hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify & Enter'}
                  <UserCheck className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
