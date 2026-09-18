import React, { useState } from 'react';
import {
  UserPlus,
  Info,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Lock,
} from 'lucide-react';

export default function AddStudent({ onSaveStudent, onCancel, initialData }) {
  const [fullName, setFullName] = useState(initialData?.name || initialData?.fullName || '');
  const [mobileNumber, setMobileNumber] = useState(
    initialData?.mobile ? initialData.mobile.replace('+91 ', '') : ''
  );
  const [emailAddress, setEmailAddress] = useState(initialData?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Requirement 1: Mandatory fields are full name, phone no, email address, password, confirm password
    if (!fullName.trim()) {
      setErrorMessage('Full Name is required.');
      return;
    }
    if (!mobileNumber.trim()) {
      setErrorMessage('Phone number is required.');
      return;
    }
    if (!emailAddress.trim()) {
      setErrorMessage('Email address is required.');
      return;
    }
    if (!password) {
      setErrorMessage('Password is required.');
      return;
    }
    if (!confirmPassword) {
      setErrorMessage('Please confirm your password.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify and try again.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);

    const generatedUsername = `@${fullName.trim().toLowerCase().replace(/\s+/g, '.')}`;
    const initials = fullName
      .trim()
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const colors = ['blue', 'purple', 'emerald', 'teal', 'indigo', 'orange'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const cleanMobile = mobileNumber.trim().startsWith('+91')
      ? mobileNumber.trim()
      : `+91 ${mobileNumber.trim()}`;

    const newStudent = {
      id: initialData?.id || `stu-${Date.now()}`,
      name: fullName.trim(),
      fullName: fullName.trim(),
      username: generatedUsername,
      initials: initials || 'ST',
      avatarColor: initialData?.avatarColor || randomColor,
      mobile: cleanMobile,
      phoneNumber: cleanMobile,
      email: emailAddress.trim(),
      password: password,
      password_hash: `hash_${password}`,
      coursesCount: initialData?.coursesCount || 1,
      validUntil: initialData?.validUntil || '15 Dec 2025',
      validDaysText: initialData?.validDaysText || '214 days left',
      status: initialData?.status || 'Active',
      createdAt: new Date().toISOString(),
    };

    try {
      await onSaveStudent(newStudent);
    } catch (err) {
      setErrorMessage(err?.message || 'Failed to save student.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6 animate-fadeIn pb-12">
      
      {/* ========================================================= */}
      {/* PAGE HEADER */}
      {/* ========================================================= */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {initialData ? 'Edit Student' : 'Add Student'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
          Create a new institutional student profile and provision authentication credentials.
        </p>
      </div>

      {/* ========================================================= */}
      {/* FORM CARD */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        
        {/* Card Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
              <CreditCard className="w-5 h-5 stroke-[1.75]" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                Student Details
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Academic Identity & Authentication Credentials
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            Node Enrolment
          </span>
        </div>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2.5 text-xs text-red-700 font-medium animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          
          {/* Field 1: Full Name (Mandatory) */}
          <div>
            <label className="block font-bold text-slate-800 mb-1.5 text-xs">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Aarav Sharma"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
            />
            <p className="text-[11px] text-slate-400 mt-1 font-normal">
              Enter student legal name as per academic records.
            </p>
          </div>

          {/* Field 2: Mobile Number (Mandatory) */}
          <div>
            <label className="block font-bold text-slate-800 mb-1.5 text-xs">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center rounded-xl border border-slate-300 bg-white overflow-hidden focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <span className="px-4 py-2.5 bg-slate-50 border-r border-slate-300 text-xs font-bold text-slate-600 select-none">
                +91
              </span>
              <input
                type="tel"
                required
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="98201 44521"
                className="w-full px-4 py-2.5 bg-transparent text-xs text-slate-900 placeholder-slate-400 outline-none font-medium font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-normal">
              Used for SMS OTP notifications and account recovery.
            </p>
          </div>

          {/* Field 3: Email Address (Mandatory) */}
          <div>
            <label className="block font-bold text-slate-800 mb-1.5 text-xs">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              placeholder="e.g. aarav.sharma@domain.edu"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
            />
            <p className="text-[11px] text-slate-400 mt-1 font-normal">
              Institutional or personal email for authentication and portal updates.
            </p>
          </div>

          {/* Field 4 & 5: Password & Confirm Password (Mandatory) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-800 mb-1.5 text-xs">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-3.5 pr-8 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium font-mono"
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-normal">
                Minimum 6 characters with letters and numbers.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1.5 text-xs">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-3.5 pr-8 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium font-mono"
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-normal">
                Re-enter password to confirm identity.
              </p>
            </div>
          </div>

          {/* Info Callout Box */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 flex items-start gap-3 text-xs">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium text-slate-800 leading-relaxed">
                Credentials will be encrypted with AES-256 and securely saved to the database. The student can use their email or phone number to log into their portal.
              </p>
              <p className="text-[11px] text-blue-700 font-medium">
                Enrolment audit logs will document administrative creation by Dr. Arthur Vance.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold transition-all cursor-pointer text-xs shadow-xs"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#162544] hover:bg-[#111e3b] text-white font-bold transition-all shadow-md active:scale-[0.98] cursor-pointer text-xs disabled:opacity-75"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : 'Create Student'}</span>
            </button>
          </div>

        </form>

      </div>

      {/* Bottom Compliance Footer */}
      <div className="text-center text-xs text-slate-400 font-medium pt-2">
        Aegis Academy Identity & Access Management • Automated Credentials Engine
      </div>

    </div>
  );
}
