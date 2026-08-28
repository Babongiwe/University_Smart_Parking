import React, { useState } from 'react';
import { 
  Car, 
  ShieldCheck, 
  KeyRound, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  Mail,
  ChevronLeft,
  UserPlus,
  LogIn,
  AlertCircle,
  Users
} from 'lucide-react';
import { useParking } from '../context/ParkingContext';
import { UserRole } from '../types';

export const AuthView: React.FC = () => {
  const { login, registerVisitorAccount, registeredVisitors } = useParking();

  const [activeTab, setActiveTab] = useState<UserRole>('student');
  
  // Login Form State
  const [identifier, setIdentifier] = useState('2024098124');
  const [password, setPassword] = useState('kovsie@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Visitor Sub-Mode ('login' vs 'register')
  const [visitorAuthMode, setVisitorAuthMode] = useState<'login' | 'register'>('login');

  // Visitor Registration Form State
  const [visFirstName, setVisFirstName] = useState('');
  const [visSurname, setVisSurname] = useState('');
  const [visIdNumber, setVisIdNumber] = useState('');
  const [visPassword, setVisPassword] = useState('');
  const [visConfirmPassword, setVisConfirmPassword] = useState('');
  const [visError, setVisError] = useState('');
  const [visSuccessMsg, setVisSuccessMsg] = useState('');

  // Forgot password flow
  const [isForgotPassView, setIsForgotPassView] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetDispatched, setResetDispatched] = useState(false);

  const handleTabChange = (role: UserRole) => {
    setActiveTab(role);
    setVisError('');
    setVisSuccessMsg('');
    if (role === 'student') {
      setIdentifier('2024098124');
      setPassword('kovsie@2026');
    } else if (role === 'staff') {
      setIdentifier('UFS-STAFF-4891');
      setPassword('staff@2026');
    } else if (role === 'security') {
      setIdentifier('SEC-2024-007');
      setPassword('security@2026');
    } else if (role === 'admin') {
      setIdentifier('ADM-2024-001');
      setPassword('admin@2026');
    } else if (role === 'visitor') {
      setIdentifier('9204155123088');
      setPassword('password123');
      setVisitorAuthMode('login');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return;

    if (activeTab === 'visitor') {
      const matched = registeredVisitors.find(v => v.idNumber.trim() === identifier.trim());
      const customName = matched ? `${matched.name} ${matched.surname}` : undefined;
      login('visitor', identifier.trim(), customName);
    } else {
      login(activeTab, identifier.trim());
    }
  };

  const handleVisitorRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setVisError('');
    setVisSuccessMsg('');

    if (!visFirstName.trim()) {
      setVisError('Please enter your First Name.');
      return;
    }
    if (!visSurname.trim()) {
      setVisError('Please enter your Surname.');
      return;
    }
    if (!visIdNumber.trim()) {
      setVisError('Please enter your SA ID or Passport Number.');
      return;
    }
    if (!visPassword) {
      setVisError('Please create a secure password.');
      return;
    }
    if (visPassword !== visConfirmPassword) {
      setVisError('Passwords do not match! Please check your confirm password.');
      return;
    }

    const visitorData = {
      name: visFirstName.trim(),
      surname: visSurname.trim(),
      idNumber: visIdNumber.trim(),
      password: visPassword
    };

    registerVisitorAccount(visitorData);

    setIdentifier(visitorData.idNumber);
    setPassword(visitorData.password);
    
    setVisitorAuthMode('login');
    setVisSuccessMsg(
      `Account successfully registered for ${visitorData.name} ${visitorData.surname}! Your credentials have been populated below. Click "Sign In" to access your Visitor Dashboard.`
    );
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetDispatched(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden text-slate-800 font-sans">
      <div className="w-full max-w-lg relative z-10 space-y-6">
        {/* University Branding Logo */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-bold text-3xl shadow-lg shadow-amber-500/20 border-2 border-amber-300 mx-auto">
            <Car className="w-9 h-9 text-slate-950" />
          </div>
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#002B49]">
              University of the Free State
            </p>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Kovsie<span className="text-amber-600">Park</span>
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Smart Parking & Permit Management System
            </p>
          </div>
        </div>

        {/* Main Auth Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          {!isForgotPassView ? (
            <>
              {/* Role Selection Tabs */}
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-500 mb-2 px-1">Select User Portal</p>
                <div className="grid grid-cols-5 gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
                  {[
                    { id: 'student', label: 'Student' },
                    { id: 'staff', label: 'Staff' },
                    { id: 'security', label: 'Security' },
                    { id: 'admin', label: 'Admin' },
                    { id: 'visitor', label: 'Visitor' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleTabChange(t.id as UserRole)}
                      className={`py-2 px-1 text-center rounded-xl transition-all capitalize ${
                        activeTab === t.id
                          ? 'bg-[#002B49] text-white shadow-sm font-extrabold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Visitor Mode Sub-Toggle */}
              {activeTab === 'visitor' && (
                <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setVisitorAuthMode('login');
                      setVisError('');
                    }}
                    className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                      visitorAuthMode === 'login'
                        ? 'bg-white text-slate-900 shadow-sm font-bold border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <LogIn className="w-3.5 h-3.5 text-amber-600" />
                    <span>Visitor Sign In</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVisitorAuthMode('register');
                      setVisError('');
                      setVisSuccessMsg('');
                    }}
                    className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                      visitorAuthMode === 'register'
                        ? 'bg-white text-slate-900 shadow-sm font-bold border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5 text-amber-600" />
                    <span>Create Visitor Account</span>
                  </button>
                </div>
              )}

              {/* SUCCESS MESSAGE AFTER VISITOR REGISTRATION */}
              {visSuccessMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                  <p className="leading-relaxed font-medium">{visSuccessMsg}</p>
                </div>
              )}

              {/* ERROR MESSAGE */}
              {visError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <p className="leading-relaxed font-medium">{visError}</p>
                </div>
              )}

              {/* VISITOR REGISTRATION FORM */}
              {activeTab === 'visitor' && visitorAuthMode === 'register' ? (
                <form onSubmit={handleVisitorRegister} className="space-y-4 text-xs animate-in fade-in duration-200">
                  <div className="border-b border-slate-100 pb-2">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <UserPlus className="w-4 h-4 text-amber-600" />
                      <span>Create New Visitor Account</span>
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Register as a university guest to pre-book parking bays and obtain ALPR gate access.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={visFirstName}
                        onChange={(e) => setVisFirstName(e.target.value)}
                        placeholder="e.g. Lerato"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Surname / Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={visSurname}
                        onChange={(e) => setVisSurname(e.target.value)}
                        placeholder="e.g. Khumalo"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      National ID Number / Passport Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={visIdNumber}
                      onChange={(e) => setVisIdNumber(e.target.value)}
                      placeholder="e.g. 9204155123088"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 text-xs font-mono font-medium"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      This ID number will serve as your unique login username for future visits.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Create Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        value={visPassword}
                        onChange={(e) => setVisPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        value={visConfirmPassword}
                        onChange={(e) => setVisConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 text-xs"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 transform active:scale-[0.98] mt-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-slate-950 font-bold" />
                    <span>Register & Proceed to Sign In</span>
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setVisitorAuthMode('login')}
                      className="text-xs text-slate-600 hover:text-amber-700 transition-colors font-medium"
                    >
                      Already created an account? <span className="text-amber-600 font-bold underline">Sign in here</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* STANDARD SIGN IN FORM FOR ALL ROLES (STUDENT, STAFF, SECURITY, ADMIN, VISITOR) */
                <form onSubmit={handleLogin} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1.5">
                      {activeTab === 'student'
                        ? 'Student Number / Username'
                        : activeTab === 'staff'
                        ? 'Staff ID Number / Username'
                        : activeTab === 'security'
                        ? 'Security Officer ID / Username'
                        : activeTab === 'admin'
                        ? 'Administrator ID / Username'
                        : 'Visitor ID Number / Passport'}
                    </label>
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={
                        activeTab === 'student'
                          ? 'e.g. 2024098124'
                          : activeTab === 'staff'
                          ? 'e.g. UFS-STAFF-4891'
                          : activeTab === 'security'
                          ? 'e.g. SEC-2024-007'
                          : activeTab === 'admin'
                          ? 'e.g. ADM-2024-001'
                          : 'e.g. 9204155123088'
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 text-xs font-mono font-medium"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-slate-700 font-semibold">Password</label>
                      <button
                        type="button"
                        onClick={() => setIsForgotPassView(true)}
                        className="text-[11px] text-amber-700 hover:text-amber-800 font-medium"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700 text-[11px]">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="accent-amber-500"
                      />
                      <span>Remember my credentials</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#002B49] hover:bg-[#001c30] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400 font-bold" />
                    <span>
                      {activeTab === 'visitor' 
                        ? 'Sign In to Visitor Dashboard' 
                        : `Sign In to ${activeTab.toUpperCase()} Portal`}
                    </span>
                  </button>

                  {/* Visitor signup prompt link if in visitor tab */}
                  {activeTab === 'visitor' && (
                    <div className="text-center pt-2 border-t border-slate-100 mt-2">
                      <p className="text-xs text-slate-600">
                        First time visiting UFS?{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setVisitorAuthMode('register');
                            setVisSuccessMsg('');
                            setVisError('');
                          }}
                          className="text-amber-600 font-bold hover:underline"
                        >
                          Create a visitor account
                        </button>
                      </p>
                    </div>
                  )}
                </form>
              )}
            </>
          ) : (
            /* Reset Password Flow */
            <div className="space-y-4 text-xs animate-in fade-in duration-200">
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassView(false);
                  setResetDispatched(false);
                }}
                className="flex items-center gap-1 text-slate-600 hover:text-slate-900 text-xs font-semibold mb-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Sign In</span>
              </button>

              <h3 className="text-base font-bold text-slate-900">Reset UFS KovsiePark Password</h3>
              <p className="text-slate-600">
                Enter your university email address or student number to receive a secure password reset link.
              </p>

              {!resetDispatched ? (
                <form onSubmit={handleResetPassword} className="space-y-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">University Email / ID Number</label>
                    <input
                      type="text"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="e.g. 2024098124@ufs4life.ac.za"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-sm"
                  >
                    Dispatch Password Reset Link
                  </button>
                </form>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in zoom-in-95 duration-200">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Reset Instructions Dispatched!</h4>
                    <p className="text-[11px] text-slate-600 mt-1">
                      We sent password reset instructions to <strong>{resetEmail}</strong>. Please check your inbox.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassView(false);
                      setResetDispatched(false);
                    }}
                    className="px-4 py-2 bg-[#002B49] hover:bg-[#001c30] text-white rounded-xl font-bold text-xs"
                  >
                    Return to Sign In
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-500">
          <p>© 2026 University of the Free State • Directorate of Protection Services</p>
        </div>
      </div>
    </div>
  );
};
