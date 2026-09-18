import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  Shield,
  RotateCcw,
  Ban,
  Plus,
  Calendar,
  MinusCircle,
  Laptop,
  CheckCircle2,
  Clock,
  BookOpen,
  X,
  Check,
  Info,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export default function StudentDetail({
  student,
  courses = [],
  onBack,
  onUpdateStudent,
  showToast,
}) {
  const studentName = student?.name || student?.fullName || 'Priya Deshmukh';
  const studentUsername = student?.username || '@priya.deshmukh';
  const studentInitials = student?.initials || 'PD';
  const studentAvatarColor = student?.avatarColor || 'purple';
  const studentPhone = student?.mobile || student?.phoneNumber || '+91 98190 23410';
  const studentEmail = student?.email || 'priya.deshmukh@domain.edu';
  const studentStatus = student?.status || 'Active';
  const studentCode = student?.studentCode || (student?.id ? `STU-2024-${String(student.id).slice(-4).toUpperCase()}` : 'STU-2024-8B42');
  const enrolledDate = student?.createdAt ? new Date(student.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '12 Jan 2024';

  // Assigned Courses state matching Image 1
  const [assignedCourses, setAssignedCourses] = useState([
    {
      id: 'ac-1',
      courseId: 'course-7',
      title: 'Java Programming Basics',
      code: 'CS-204',
      badge: 'Core Academic Credit',
      validFrom: '10 Jan 2025',
      validUntil: '10 Jan 2026',
      daysLeftText: '240 days left',
      status: 'Active',
    },
    {
      id: 'ac-2',
      courseId: 'course-1',
      title: 'Advanced Algorithms & Data Structures',
      code: 'CS-301',
      badge: 'Proctored Stream',
      validFrom: '15 Aug 2024',
      validUntil: '25 May 2025',
      daysLeftText: '5 days left',
      status: 'Expiring Soon',
    },
    {
      id: 'ac-3',
      courseId: 'course-4',
      title: 'Database Management Systems & SQL',
      code: 'CS-202',
      badge: 'Completed Session',
      validFrom: '01 Feb 2024',
      validUntil: '01 Feb 2025',
      daysLeftText: 'Expired 105 days ago',
      status: 'Expired',
    },
  ]);

  // Watch Progress telemetry matching Image 1
  const [watchProgress, setWatchProgress] = useState([
    {
      id: 'wp-1',
      title: '01. Introduction to Java Virtual Machine (JVM) & JDK Setup',
      course: 'Java Programming Basics (CS-204)',
      progress: 100,
      timestamp: 'Today, 10:42 AM',
      isCompleted: true,
    },
    {
      id: 'wp-2',
      title: '02. Bytecode Verification & ClassLoading Lifecycle',
      course: 'Java Programming Basics (CS-204)',
      progress: 85,
      timestamp: 'Yesterday, 04:15 PM',
      isCompleted: false,
    },
    {
      id: 'wp-3',
      title: '03. Stack & Heap Memory Architecture',
      course: 'Java Programming Basics (CS-204)',
      progress: 45,
      timestamp: '18 May 2025',
      isCompleted: false,
    },
    {
      id: 'wp-4',
      title: '04. Asymptotic Notation & Amortized Analysis',
      course: 'Advanced Algorithms (CS-301)',
      progress: 60,
      timestamp: '14 May 2025',
      isCompleted: false,
    },
    {
      id: 'wp-5',
      title: '01. Relational Algebra & Tuple Calculus Fundamentals',
      course: 'Database Management Systems (CS-202)',
      progress: 100,
      timestamp: '28 Jan 2025',
      isCompleted: true,
    },
  ]);

  // Device state matching Image 1
  const [deviceInfo, setDeviceInfo] = useState({
    name: 'Apple MacBook Air (M2, 2023) - macOS 14.4',
    ip: '103.211.54.18 (Mumbai, India)',
    client: 'Aegis Desktop Client v2.4',
    firstLogin: '12 Jan 2024, 09:18 AM IST',
    isTrusted: true,
  });

  // Assign Course Modal State (Matching Image 2)
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || 'course-7');
  const [validFrom, setValidFrom] = useState('16 Sep 2026');
  const [validUntil, setValidUntil] = useState('15 Dec 2026');
  const [selectedDuration, setSelectedDuration] = useState('3 Months'); // '1 Month' | '3 Months' | '6 Months' | '1 Year'
  const [isAssigning, setIsAssigning] = useState(false);

  // Available courses list (from catalog / database fallback)
  const availableCoursesList = courses.length > 0 ? courses : [
    { id: 'course-7', title: 'Java Programming Basics', code: 'CS-204' },
    { id: 'course-1', title: 'Advanced Data Structures & Algorithms in Java', code: 'CS-501' },
    { id: 'course-5', title: 'Artificial Intelligence & Machine Learning with Python', code: 'AI-601' },
    { id: 'course-2', title: 'Constitutional Law & Public Administration of India', code: 'LAW-302' },
    { id: 'course-3', title: 'VLSI Design & Microelectronics Engineering', code: 'EE-410' },
  ];

  const selectedCourseObj = availableCoursesList.find((c) => String(c.id) === String(selectedCourseId)) || availableCoursesList[0];

  const handleDurationSelect = (duration) => {
    setSelectedDuration(duration);
    const now = new Date();
    const fromStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    setValidFrom(fromStr);

    const untilDate = new Date(now);
    if (duration === '1 Month') untilDate.setMonth(untilDate.getMonth() + 1);
    else if (duration === '3 Months') untilDate.setMonth(untilDate.getMonth() + 3);
    else if (duration === '6 Months') untilDate.setMonth(untilDate.getMonth() + 6);
    else if (duration === '1 Year') untilDate.setFullYear(untilDate.getFullYear() + 1);

    setValidUntil(untilDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }));
  };

  const handleAssignCourseSubmit = (e) => {
    e.preventDefault();
    setIsAssigning(true);

    const newAssignment = {
      id: `ac-${Date.now()}`,
      courseId: selectedCourseObj?.id || 'c-new',
      title: selectedCourseObj?.title || 'Java Programming Basics',
      code: selectedCourseObj?.code || 'CS-204',
      badge: 'Core Academic Credit',
      validFrom: validFrom || '16 Sep 2026',
      validUntil: validUntil || '15 Dec 2026',
      daysLeftText: '90 days left',
      status: 'Active',
    };

    setTimeout(() => {
      setAssignedCourses((prev) => [newAssignment, ...prev]);
      setIsAssigning(false);
      setShowAssignModal(false);
      if (onUpdateStudent && student) {
        onUpdateStudent({
          ...student,
          coursesCount: (student.coursesCount || assignedCourses.length) + 1,
        });
      }
      if (showToast) {
        showToast(`Course "${newAssignment.title}" successfully assigned to ${studentName}!`);
      }
    }, 200);
  };

  const handleExtendCourse = (id, title) => {
    setAssignedCourses((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              validUntil: '15 Jan 2027',
              daysLeftText: 'Extended (+30d)',
              status: 'Active',
            }
          : c
      )
    );
    if (showToast) showToast(`Access extended by 30 days for "${title}"`);
  };

  const handleRevokeCourse = (id, title) => {
    if (window.confirm(`Revoke course enrollment for "${title}"?`)) {
      setAssignedCourses((prev) => prev.filter((c) => c.id !== id));
      if (showToast) showToast(`Enrollment for "${title}" has been revoked.`);
    }
  };

  const handleResetPassword = () => {
    if (showToast) {
      showToast(`Temporary OTP password reset credentials dispatched to ${studentEmail}`);
    }
  };

  const handleResetDevice = () => {
    if (window.confirm(`Reset registered hardware binding for ${studentName}?`)) {
      setDeviceInfo((prev) => ({
        ...prev,
        isTrusted: false,
        name: 'No registered hardware (Pending first authentication)',
      }));
      if (showToast) {
        showToast(`Hardware DRM binding reset for ${studentName}. Authorization required on next login.`);
      }
    }
  };

  const handleDeactivate = () => {
    if (window.confirm(`Deactivate student account for ${studentName}?`)) {
      if (onUpdateStudent) {
        onUpdateStudent({ ...student, status: 'Inactive', Is_verify: false });
      }
      if (showToast) {
        showToast(`Student account ${studentName} deactivated.`);
      }
    }
  };

  const getAvatarColorClass = (color) => {
    switch (color) {
      case 'purple':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'blue':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'emerald':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'orange':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'red':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'teal':
        return 'bg-teal-100 text-teal-700 border-teal-200';
      default:
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* ========================================================= */}
      {/* TOP PROFILE HEADER CARD (Matching Image 1) */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-7 relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Left: Avatar + Details */}
          <div className="flex items-start sm:items-center gap-4">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center font-extrabold text-xl flex-shrink-0 border ${getAvatarColorClass(
                studentAvatarColor
              )}`}
            >
              {studentInitials}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {studentName}
                </h2>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{studentStatus}</span>
                </span>
                <span className="text-xs text-slate-400 font-mono font-medium">
                  {studentUsername}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-600 font-medium flex-wrap">
                <span>{studentPhone}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600">{studentEmail}</span>
              </div>

              <p className="text-[11px] text-slate-400 font-mono pt-0.5">
                ID: <strong className="text-slate-700">{studentCode}</strong> • Enrolled: {enrolledDate} • Academic Status: <strong className="text-slate-700 font-sans">Regular Scholar</strong>
              </p>
            </div>
          </div>

          {/* Right: 3 Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap flex-shrink-0 self-start lg:self-center">
            <button
              onClick={handleResetPassword}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Password</span>
            </button>

            <button
              onClick={handleResetDevice}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Device</span>
            </button>

            <button
              onClick={handleDeactivate}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-red-200 hover:bg-red-50 text-red-600 text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Ban className="w-3.5 h-3.5 text-red-500" />
              <span>Deactivate</span>
            </button>
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: ASSIGNED COURSES (Matching Image 1) */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Card Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
              Assigned Courses
            </h3>
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold border border-slate-200 text-slate-600 bg-slate-50">
              {assignedCourses.length} Assigned
            </span>
          </div>

          <button
            onClick={() => setShowAssignModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#162544] hover:bg-[#111e3b] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Assign Course</span>
          </button>
        </div>

        {/* Assigned Courses Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-5">COURSE</th>
                <th className="py-3 px-4">VALID FROM</th>
                <th className="py-3 px-4">VALID UNTIL</th>
                <th className="py-3 px-4">DAYS LEFT</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-5 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {assignedCourses.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                  
                  {/* Course Name & Badge */}
                  <td className="py-4 px-5 align-middle">
                    <div className="font-bold text-slate-900 text-xs">
                      {c.title}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {c.code} • {c.badge}
                    </div>
                  </td>

                  {/* Valid From */}
                  <td className="py-4 px-4 align-middle font-medium text-slate-600 whitespace-nowrap">
                    {c.validFrom}
                  </td>

                  {/* Valid Until */}
                  <td className="py-4 px-4 align-middle font-medium text-slate-600 whitespace-nowrap">
                    {c.validUntil}
                  </td>

                  {/* Days Left */}
                  <td className="py-4 px-4 align-middle whitespace-nowrap font-medium">
                    <span
                      className={
                        c.status === 'Expired'
                          ? 'text-red-500 font-semibold'
                          : c.status === 'Expiring Soon'
                          ? 'text-amber-600 font-semibold flex items-center gap-1'
                          : 'text-slate-900 font-bold'
                      }
                    >
                      {c.status === 'Expiring Soon' && <Clock className="w-3.5 h-3.5 text-amber-500 inline" />}
                      {c.daysLeftText}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-4 align-middle whitespace-nowrap">
                    {c.status === 'Active' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Active</span>
                      </span>
                    )}

                    {c.status === 'Expiring Soon' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>Expiring Soon</span>
                      </span>
                    )}

                    {c.status === 'Expired' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        <span>Expired</span>
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5 text-right align-middle whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleExtendCourse(c.id, c.title)}
                        title="Extend Course Validity"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        <Calendar className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleRevokeCourse(c.id, c.title)}
                        title="Revoke Course Enrollment"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <MinusCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* ========================================================= */}
      {/* SECTION 2: WATCH PROGRESS (Matching Image 1) */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div>
          <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
            Watch Progress
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Video lecture playback telemetry and retention metrics
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {watchProgress.map((wp) => (
            <div
              key={wp.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              {/* Left Title & Course */}
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-slate-900 truncate">
                  {wp.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {wp.course}
                </p>
              </div>

              {/* Center Progress Bar */}
              <div className="flex items-center gap-3 sm:w-72 flex-shrink-0">
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      wp.progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${wp.progress}%` }}
                  />
                </div>
                <span className="font-mono text-xs font-bold text-slate-700 w-10 text-right">
                  {wp.progress}%
                </span>
              </div>

              {/* Right Timestamp */}
              <div className="text-right text-[11px] text-slate-400 whitespace-nowrap flex items-center gap-1 sm:justify-end">
                {wp.isCompleted && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                <span>{wp.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 3: DEVICE BINDING (Matching Image 1) */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div>
          <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
            Device
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Single-device DRM authorization & hardware binding
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 flex-shrink-0">
              <Laptop className="w-6 h-6 stroke-[1.75]" />
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-bold text-slate-900 text-sm">
                  {deviceInfo.name}
                </h4>
                {deviceInfo.isTrusted && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    <ShieldCheck className="w-3 h-3 text-blue-600" />
                    <span>Authorized Hardware Node</span>
                  </span>
                )}
              </div>

              <div className="text-slate-500 text-xs">
                First Login: <strong className="text-slate-800 font-semibold">{deviceInfo.firstLogin}</strong>
              </div>

              <div className="text-slate-400 text-[11px] font-mono">
                {deviceInfo.ip} • {deviceInfo.client}
              </div>
            </div>
          </div>

          <div className="text-right flex flex-col items-start sm:items-end gap-1.5 flex-shrink-0">
            <button
              onClick={handleResetDevice}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-white text-slate-700 text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Device</span>
            </button>
            <p className="text-[11px] text-slate-400 max-w-xs leading-tight">
              Clearing device binding will require the student to authorize on next login.
            </p>
          </div>
        </div>
      </div>

      {/* Compliance Footer */}
      <div className="text-center text-[11px] text-slate-400 font-medium pt-2">
        Aegis Academy Identity & Access Framework • Student Profile {studentCode} cryptographically verified • ISO/IEC 27001
      </div>

      {/* ========================================================= */}
      {/* MODAL: ASSIGN COURSE (Matching Image 2) */}
      {/* ========================================================= */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-5 animate-scaleUp">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <BookOpen className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                      Assign Course
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      Enrollment Provisioning
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">
                    Student: {studentName} ({studentCode})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAssignModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAssignCourseSubmit} className="space-y-4 text-xs">
              
              {/* Select Course */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5 text-xs">
                  Select Course <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold text-xs outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer shadow-xs"
                >
                  {availableCoursesList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.code || 'CS-204'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Inputs: Valid From & Valid Until */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5 text-xs">
                    Valid From <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={validFrom}
                    onChange={(e) => setValidFrom(e.target.value)}
                    placeholder="16 Sep 2026"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 font-medium text-xs outline-none focus:border-blue-600 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1.5 text-xs">
                    Valid Until <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    placeholder="15 Dec 2026"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 font-medium text-xs outline-none focus:border-blue-600 shadow-xs"
                  />
                </div>
              </div>

              {/* Quick Select Duration */}
              <div>
                <label className="block font-bold text-slate-500 text-[11px] uppercase tracking-wider mb-1.5">
                  QUICK SELECT DURATION
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['1 Month', '3 Months', '6 Months', '1 Year'].map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => handleDurationSelect(dur)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                        selectedDuration === dur
                          ? 'bg-[#162544] text-white shadow-xs'
                          : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              </div>

              {/* Enrollment Summary Info Box */}
              <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-3.5 flex items-start gap-2.5 text-xs">
                <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-slate-700 font-medium leading-relaxed">
                  <strong>Enrollment Summary:</strong> {studentName} will get access to{' '}
                  <strong className="text-slate-900">{selectedCourseObj?.title}</strong> until{' '}
                  <strong className="text-slate-900">{validUntil}</strong> ({selectedDuration === '1 Month' ? '30' : selectedDuration === '3 Months' ? '90' : selectedDuration === '6 Months' ? '180' : '365'} days).
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold transition-all cursor-pointer text-xs"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isAssigning}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#162544] hover:bg-[#111e3b] text-white font-bold transition-all shadow-md active:scale-[0.98] cursor-pointer text-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>{isAssigning ? 'Assigning...' : 'Assign Course'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
