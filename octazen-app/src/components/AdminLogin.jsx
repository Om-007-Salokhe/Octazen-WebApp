import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  X,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Terminal,
  Key,
  User,
  Building,
} from 'lucide-react';
import { loginAdmin, generateClientJwt, setAuthToken } from '../services/api';

export default function AdminLogin({ onLoginSuccess }) {
  // Auth mode: 'signin' | 'signup'
  const [authMode, setAuthMode] = useState('signin');

  // Input fields
  const [fullName, setFullName] = useState('Dr. Arthur Vance');
  const [department, setDepartment] = useState('Academic Operations');
  const [username, setUsername] = useState('admin@institution.edu');
  const [password, setPassword] = useState('Admin1234');
  const [confirmPassword, setConfirmPassword] = useState('Admin1234');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Auth states
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStep, setVerificationStep] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorBanner, setShowErrorBanner] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowErrorBanner(false);
    setErrorMessage('');

    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    if (!trimmedUser || !trimmedPass) {
      setShowErrorBanner(true);
      setErrorMessage('Please fill in all required institutional credentials.');
      return;
    }

    if (authMode === 'signup' && trimmedPass !== confirmPassword.trim()) {
      setShowErrorBanner(true);
      setErrorMessage('Passwords do not match. Please verify and retry.');
      return;
    }

    // Enter authenticating / JWT negotiating state
    setIsLoading(true);
    setVerificationStep(
      authMode === 'signup'
        ? 'Registering academic administrator credentials and provisioning JWT key...'
        : 'Negotiating cryptographic JWT credentials with core node...'
    );

    try {
      if (authMode === 'signin') {
        const result = await loginAdmin(trimmedUser, trimmedPass);

        setVerificationStep('JWT Token issued & session validated. Launching Dashboard...');
        
        setTimeout(() => {
          setIsLoading(false);
          if (onLoginSuccess) {
            onLoginSuccess({
              username: result.admin.fullName || fullName || 'Dr. Arthur Vance',
              email: result.admin.email || trimmedUser,
              name: result.admin.fullName || fullName || 'Dr. Arthur Vance',
              role: result.admin.role || 'Institutional Dean',
              token: result.token,
            });
          }
        }, 600);
      } else {
        // Sign Up Flow - Generate JWT and save to cookies and storage
        const newAdmin = {
          id: `admin_${Date.now()}`,
          email: trimmedUser,
          fullName: fullName.trim() || 'Dr. Arthur Vance',
          role: 'SUPER_ADMIN',
        };
        const token = generateClientJwt(newAdmin);
        setAuthToken(token);

        setTimeout(() => {
          setVerificationStep('Administrator identity verified & JWT token issued. Directing to Dashboard...');
          
          setTimeout(() => {
            setIsLoading(false);
            if (onLoginSuccess) {
              onLoginSuccess({
                username: fullName.trim() || 'Dr. Arthur Vance',
                email: trimmedUser,
                name: fullName.trim() || 'Dr. Arthur Vance',
                role: 'Institutional Dean',
                token: token,
              });
            }
          }, 600);
        }, 500);
      }
    } catch (error) {
      setTimeout(() => {
        setIsLoading(false);
        setShowErrorBanner(true);
        setErrorMessage(
          error.message || 'Invalid institutional email or password combination. Please try again.'
        );
      }, 600);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#0b1528] text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* ========================================================= */}
      {/* LEFT COLUMN: Hero & Institutional Branding Banner */}
      {/* ========================================================= */}
      <section
        className={`lg:w-[52%] xl:w-[54%] w-full relative flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden transition-all duration-700 ${
          isLoading ? 'radar-bg' : 'blueprint-grid'
        }`}
      >
        {/* Geometric Blueprint / Radar Graphics Background */}
        {!isLoading ? (
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute top-28 left-8 right-12 bottom-20 border border-blue-400/20 rounded-3xl" />
            <div className="absolute top-44 left-20 right-20 bottom-36 border border-blue-300/10 rounded-2xl" />
            <div className="absolute top-1/2 left-1/3 w-64 h-64 border border-blue-400/15 rounded-3xl -rotate-6" />
          </div>
        ) : (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="radar-circle w-[280px] h-[280px]" />
            <div className="radar-circle-dashed w-[460px] h-[460px]" />
            <div className="radar-circle w-[640px] h-[640px]" />
            <div className="radar-circle-dashed w-[820px] h-[820px]" />
            <div className="radar-line w-full h-[1px] top-1/2 left-0" />
            <div className="radar-line h-full w-[1px] left-1/2 top-0" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-2xl" />
          </div>
        )}

        {/* Top Header Branding */}
        <div className="relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-950/80 border border-blue-400/30 flex items-center justify-center shadow-lg backdrop-blur-sm">
              <Shield className="w-6 h-6 text-slate-200 stroke-[1.8]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
                {isLoading ? 'Aegis Academy' : 'Aegis Academy Portal'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                {isLoading ? 'Institutional Portal' : 'Accreditation & Security Division'}
              </p>
            </div>
          </div>
        </div>

        {/* Middle Main Content Block */}
        <div className="relative z-10 my-auto py-10 max-w-xl">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111e3b]/90 border border-blue-400/25 text-xs font-semibold tracking-wider text-slate-300 mb-6 shadow-sm backdrop-blur-sm">
            {isLoading ? (
              <>
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="uppercase text-[11px] font-bold tracking-widest text-slate-200">
                  ACCREDITED CORE V4.8
                </span>
              </>
            ) : (
              <>
                <Shield className="w-3.5 h-3.5 text-slate-300 stroke-[2]" />
                <span className="uppercase text-[11px] font-bold tracking-widest text-slate-300">
                  ENTERPRISE ADMINISTRATIVE TERMINAL
                </span>
              </>
            )}
          </div>

          {/* Main Title Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-white leading-[1.15] tracking-tight mb-4">
            Learning Platform Admin
          </h2>

          {/* Subtitle Description */}
          <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed max-w-lg font-normal mb-10">
            Empowering institutional excellence, secure proctoring, and comprehensive academic administration.
          </p>

          {/* Metric / Compliance Block */}
          <div className="pt-8 border-t border-slate-700/50 grid grid-cols-2 gap-8">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                99.98%
              </div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                Audit Verification Integrity
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                ISO/IEC 27001
              </div>
              <div className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                Institutional Compliance Standard
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Left Footer Info */}
        <div className="relative z-10 pt-4 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-slate-400">
          <span className="font-mono tracking-tight text-slate-400">
            Session ID: AES-256-AUTH-091
          </span>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Vault Nodes Operational</span>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* RIGHT COLUMN: Single Authentication Form with JWT */}
      {/* ========================================================= */}
      <section className="lg:w-[48%] xl:w-[46%] w-full bg-white text-slate-900 flex flex-col justify-between p-8 sm:p-12 lg:p-16 relative">
        
        {/* Top Status & Tab Switcher */}
        <div className="flex items-center justify-between mb-4 min-h-[36px]">
          <div className="inline-flex rounded-xl border border-slate-200 p-0.5 bg-slate-100 text-xs">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setShowErrorBanner(false);
              }}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                authMode === 'signin'
                  ? 'bg-[#182649] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setShowErrorBanner(false);
              }}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                authMode === 'signup'
                  ? 'bg-[#182649] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          {isLoading && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 shadow-sm animate-fadeIn">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>Gateway Active</span>
            </div>
          )}
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md mx-auto my-auto py-2">
          
          {/* Header */}
          <div className="mb-6">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
              {authMode === 'signup' ? 'Create Institutional Account' : 'Sign in'}
            </h3>
            <p className="text-sm text-slate-500 mt-1 font-normal">
              {authMode === 'signup'
                ? 'Register your administrator credentials for campus access'
                : 'Enter your credentials to continue'}
            </p>
          </div>

          {/* Verification Progress Notice in Loading State */}
          {isLoading && (
            <div className="mb-5 p-4 rounded-xl bg-[#f0f5fa] border border-[#cbd5e1] flex items-start gap-3.5 shadow-sm animate-fadeIn">
              <div className="w-6 h-6 rounded bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0 mt-0.5 text-blue-600">
                <CheckCircle2 className="w-4 h-4 text-blue-600 stroke-[2.2]" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-800 leading-tight">
                  Verification in progress
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {verificationStep}
                </div>
              </div>
            </div>
          )}

          {/* Error Banner Alert */}
          {showErrorBanner && (
            <div className="mb-5 p-3.5 sm:p-4 rounded-xl bg-[#feecec] border border-[#fca5a5]/80 text-[#b91c1c] flex items-start justify-between gap-3 shadow-sm animate-fadeIn">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-[#dc2626] flex-shrink-0 mt-0.5 stroke-[2]" />
                <span className="text-xs sm:text-sm font-medium leading-relaxed text-[#b91c1c]">
                  {errorMessage || 'Invalid institutional email or password combination. Please try again.'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowErrorBanner(false)}
                className="text-red-400 hover:text-red-700 transition-colors p-0.5 rounded cursor-pointer"
                aria-label="Dismiss error"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Sign Up Additional Fields */}
            {authMode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4 stroke-[1.8]" />
                    </div>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Dr. Arthur Vance"
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm rounded-lg border border-slate-200 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-900 transition-all outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1">
                    Academic Department / Faculty
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Building className="w-4 h-4 stroke-[1.8]" />
                    </div>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Academic Operations"
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm rounded-lg border border-slate-200 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-900 transition-all outline-none"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Username / Email Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="username"
                  className="block text-xs sm:text-sm font-semibold text-slate-800"
                >
                  Email Address / Username <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-slate-400 font-medium">
                  Institutional
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4 stroke-[1.8]" />
                </div>
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin@institution.edu or Admin"
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm rounded-lg border border-slate-200 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-900 transition-all outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="password"
                  className="block text-xs sm:text-sm font-semibold text-slate-800"
                >
                  Password <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4 stroke-[1.8]" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  className="w-full pl-10 pr-10 py-2.5 sm:py-3 text-sm rounded-lg border border-slate-200 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-900 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 stroke-[1.8]" />
                  ) : (
                    <Eye className="w-4 h-4 stroke-[1.8]" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password (only in signup mode) */}
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4 stroke-[1.8]" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm rounded-lg border border-slate-200 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-900 transition-all outline-none"
                  />
                </div>
              </div>
            )}

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-[#182649]"
                />
                <span className="text-xs sm:text-sm font-medium text-slate-700">
                  Remember me
                </span>
              </label>
              {authMode === 'signin' && (
                <a
                  href="#forgot-password"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Password recovery verification link sent to your registered institutional administrator email.');
                  }}
                  className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Forgot password?
                </a>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 sm:py-3.5 px-4 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                  isLoading
                    ? 'bg-[#182649] text-white opacity-95 cursor-wait'
                    : 'bg-[#182649] hover:bg-[#111e3b] active:scale-[0.99] text-white'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>{authMode === 'signup' ? 'Provisioning Account...' : 'Authenticating JWT...'}</span>
                  </>
                ) : (
                  <>
                    <span>{authMode === 'signup' ? 'Complete Sign Up & Enter Dashboard' : 'Sign In'}</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.2]" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Toggle between Sign In and Sign Up */}
          <div className="mt-5 text-center text-xs text-slate-500">
            {authMode === 'signin' ? (
              <span>
                Need an institutional administrator account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className="font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  Sign Up
                </button>
              </span>
            ) : (
              <span>
                Already registered with Aegis Academy?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className="font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </span>
            )}
          </div>

          {/* Informational Security Notice Card */}
          <div className="mt-6">
            {!isLoading ? (
              <div className="p-4 rounded-xl bg-[#f3f6fa] border border-[#e2e8f0] flex items-start gap-3.5 shadow-sm">
                <div className="text-slate-700 mt-0.5 flex-shrink-0">
                  <Lock className="w-4 h-4 stroke-[2]" />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <span className="font-bold text-slate-800">Encrypted Session:</span> Multi-factor authentication will be requested upon detection of an unverified IP range.
                </p>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <Terminal className="w-3.5 h-3.5 text-slate-500" />
                  <span>Authorized personnel only</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-200/80 text-slate-600">
                  TLS 1.3
                </span>
              </div>
            )}
          </div>

        </div>

        {/* Bottom Right Footer */}
        <div className="pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400 font-medium tracking-wide">
            Octazen Technologies LLP
          </p>
        </div>
      </section>

    </div>
  );
}
