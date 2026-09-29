import React, { useState } from 'react';
import {
  Recycle,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  MapPin,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { ALL_38_DISTRICTS, getCitiesForDistrict, OTHER_INDIAN_STATES, NON_TN_BLOCKED_MESSAGE } from '../data/tamilNaduLocations.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import { LocationRestrictionAlert } from '../components/LocationRestrictionAlert.tsx';

interface RegisterPageProps {
  onSuccess: () => void;
  onNavigateLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onSuccess, onNavigateLogin }) => {
  const { register } = useAuth();
  const { language, t } = useLanguage();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [district, setDistrict] = useState<string>('Virudhunagar');
  const [city, setCity] = useState<string>('Sivakasi');
  const [profileImage, setProfileImage] = useState<string>('');

  const [attemptedOtherState, setAttemptedOtherState] = useState<string>('');
  const [isAttemptingOtherState, setIsAttemptingOtherState] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const availableCities = getCitiesForDistrict(district);

  const handleDistrictChange = (newDistrict: string) => {
    setDistrict(newDistrict);
    const cities = getCitiesForDistrict(newDistrict);
    if (cities.length > 0) {
      setCity(cities[0]);
    }
  };

  const handleSimulateOtherState = (otherState: string) => {
    setAttemptedOtherState(otherState);
    setError(NON_TN_BLOCKED_MESSAGE);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setIsLoading(true);
      await register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        confirmPassword,
        state: 'Tamil Nadu', // Strictly forced
        district,
        city,
        profileImage: profileImage.trim() || undefined
      });
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      <LocationRestrictionAlert />

      {attemptedOtherState && (
        <LocationRestrictionAlert
          attemptedState={attemptedOtherState}
          onDismiss={() => {
            setAttemptedOtherState('');
            setError('');
          }}
        />
      )}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-8 bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-3 border border-white/20">
            <Recycle className="w-7 h-7 text-emerald-300" />
          </div>
          <h2 className="text-2xl font-black">{t.register} for SWAPNEAT</h2>
          <p className="text-xs text-emerald-200/90 mt-1">
            Exclusive to residents of Tamil Nadu, India (38 Districts)
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          {error && (
            <div className="p-3 bg-amber-50 border-2 border-amber-500 rounded-xl text-amber-950 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
              <div>
                <span className="font-bold block">{error}</span>
                {error.includes('Tamil Nadu') && (
                  <span className="text-[11px] text-amber-800">
                    SwapNeat only operates in Tamil Nadu's 38 districts to maintain zero-carbon local community handoffs.
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Karthik Subramanian"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Email & Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@swapneat.in"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mobile Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9842100001"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* LOCATION SECTION - MANDATORY TAMIL NADU */}
          <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>Tamil Nadu Location Verification</span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-700 text-white px-2 py-0.5 rounded">
                Fixed State
              </span>
            </div>

            {/* State (LOCKED to Tamil Nadu) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                State (Strictly Fixed)
              </label>
              <div className="relative">
                <input
                  type="text"
                  disabled
                  value="Tamil Nadu"
                  className="w-full p-2.5 bg-white border border-emerald-300 rounded-xl text-xs font-black text-emerald-950 cursor-not-allowed"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  TAMIL NADU ONLY
                </span>
              </div>
            </div>

            {/* District & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  District (38 Districts) *
                </label>
                <select
                  value={district}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {ALL_38_DISTRICTS.map(d => (
                    <option key={d.id} value={d.name}>
                      {d.name} ({d.tamilName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  City / Town *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {availableCities.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Non-TN state test selector to demonstrate strict rejection */}
            <div className="pt-2 border-t border-emerald-200/60">
              <span className="text-[10px] text-slate-500 block mb-1">
                Attempt other state / international location test:
              </span>
              <div className="flex gap-1.5 flex-wrap">
                {['Kerala', 'Karnataka', 'Maharashtra', 'Delhi', 'Outside India'].map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleSimulateOtherState(st)}
                    className="px-2 py-0.5 text-[10px] rounded bg-white hover:bg-rose-50 hover:text-rose-700 border border-slate-200 text-slate-500 transition-colors"
                  >
                    Select {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Optional Profile Image */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Profile Photo URL (Optional)
            </label>
            <input
              type="url"
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
              placeholder="https://..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <span>{isLoading ? 'Creating Tamil Nadu Account...' : t.register}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center pt-2 text-xs text-slate-500">
            Already registered in Tamil Nadu?{' '}
            <button
              type="button"
              onClick={onNavigateLogin}
              className="font-bold text-emerald-700 hover:underline"
            >
              Sign in here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
