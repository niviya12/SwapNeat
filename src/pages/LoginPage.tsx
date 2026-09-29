import React, { useState } from 'react';
import {
  Recycle,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  MapPin,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import { LocationRestrictionAlert } from '../components/LocationRestrictionAlert.tsx';

interface LoginPageProps {
  onSuccess: () => void;
  onNavigateRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onNavigateRegister }) => {
  const { login } = useAuth();
  const { language, t } = useLanguage();

  const [identifier, setIdentifier] = useState<string>('karthik@swapneat.in');
  const [password, setPassword] = useState<string>('password123');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError('Please enter your email / mobile number and password.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await login(identifier.trim(), password);
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (email: string) => {
    setIdentifier(email);
    setPassword('password123');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <LocationRestrictionAlert />

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-8 bg-gradient-to-r from-emerald-800 to-teal-900 text-white text-center relative">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-3 border border-white/20">
            <Recycle className="w-7 h-7 text-emerald-300" />
          </div>
          <h2 className="text-2xl font-black">{t.login} to SWAPNEAT</h2>
          <p className="text-xs text-emerald-200/90 mt-1">
            Tamil Nadu's Smart Reuse & Exchange Network
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address or Mobile Number
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="name@swapneat.in or 9842100001"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <span>{isLoading ? 'Signing In...' : t.login}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick Demo Logins Bar */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Instant Demo Accounts (Click to test):
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickLogin('karthik@swapneat.in')}
                className="p-2 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border rounded-xl text-left font-medium text-slate-700"
              >
                <span className="font-bold block text-slate-900">Karthik S.</span>
                <span className="text-emerald-700 text-[10px]">Sivakasi, Virudhunagar</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('priya@swapneat.in')}
                className="p-2 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border rounded-xl text-left font-medium text-slate-700"
              >
                <span className="font-bold block text-slate-900">Priya S.</span>
                <span className="text-emerald-700 text-[10px]">T. Nagar, Chennai</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('anand@swapneat.in')}
                className="p-2 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border rounded-xl text-left font-medium text-slate-700"
              >
                <span className="font-bold block text-slate-900">Anand N.</span>
                <span className="text-emerald-700 text-[10px]">Coimbatore</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin@swapneat.in')}
                className="p-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl text-left font-medium text-purple-900"
              >
                <span className="font-bold block text-purple-950">TN Admin</span>
                <span className="text-purple-700 text-[10px]">State Moderator</span>
              </button>
            </div>
          </div>

          <div className="text-center pt-2 text-xs text-slate-500">
            Don’t have an account yet?{' '}
            <button
              type="button"
              onClick={onNavigateRegister}
              className="font-bold text-emerald-700 hover:underline"
            >
              Register here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
