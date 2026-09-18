import React, { useState, useEffect } from 'react';
import {
  Shield,
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  ChevronDown,
  Plus,
  UserPlus,
  UploadCloud,
  Radio,
  Video,
  Clock,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  Server,
  Layers,
  Search,
  Check,
  ExternalLink,
  ShieldCheck,
  Cpu,
  X,
  Camera,
  Activity,
  UserCheck,
  RadioTower,
  Timer,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
} from 'lucide-react';
import CoursesList from './CoursesList';
import AddCourse from './AddCourse';
import CourseDetail from './CourseDetail';
import StudentsList from './StudentsList';
import AddStudent from './AddStudent';
import StudentDetail from './StudentDetail';
import {
  fetchStudentsFromDb,
  fetchCoursesFromDb,
  createStudentInDb,
  deleteStudentFromDb,
} from '../services/api';

export default function AdminDashboard({ onLogout, user }) {
  // Navigation tabs: 'Dashboard' | 'Courses' | 'Students' | 'Plans' | 'Settings'
  // Default to 'Dashboard' so after sign in/sign up the user immediately lands on the Dashboard page
  const [activeTab, setActiveTab] = useState('Dashboard');
  
  // Courses subviews: 'list' | 'detail' | 'add' | 'edit'
  const [courseSubView, setCourseSubView] = useState('list');
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Students subviews: 'list' | 'add' | 'edit'
  const [studentSubView, setStudentSubView] = useState('list');
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Modals & Popovers
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showProctoringModal, setShowProctoringModal] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);
  const [isRefreshingQueue, setIsRefreshingQueue] = useState(false);

  // Students Directory initial data matching screenshot
  const [students, setStudents] = useState([
    {
      id: 'stu-1',
      name: 'Aarav Sharma',
      username: '@aarav.sharma',
      initials: 'AS',
      avatarColor: 'blue',
      mobile: '+91 98201 44521',
      email: 'aarav.sharma@domain.edu',
      coursesCount: 3,
      validUntil: '15 Dec 2025',
      validDaysText: '214 days left',
      status: 'Active',
    },
    {
      id: 'stu-2',
      name: 'Priya Deshmukh',
      username: '@priya.deshmukh',
      initials: 'PD',
      avatarColor: 'purple',
      mobile: '+91 98190 23410',
      email: 'priya.deshmukh@domain.edu',
      coursesCount: 2,
      validUntil: '10 Jan 2026',
      validDaysText: '240 days left',
      status: 'Active',
    },
    {
      id: 'stu-3',
      name: 'Rohan Kulkarni',
      username: '@rohan_k',
      initials: 'RK',
      avatarColor: 'orange',
      mobile: '+91 97654 89201',
      email: 'rohan.kulkarni@domain.edu',
      coursesCount: 1,
      validUntil: '04 Apr 2025',
      validDaysText: 'Expired 18 days ago',
      status: 'Expired',
    },
    {
      id: 'stu-4',
      name: 'Ananya Iyer',
      username: '@ananya.iyer',
      initials: 'AI',
      avatarColor: 'emerald',
      mobile: '+91 98402 77123',
      email: 'ananya.iyer@domain.edu',
      coursesCount: 4,
      validUntil: '22 Aug 2025',
      validDaysText: '99 days left',
      status: 'Active',
    },
    {
      id: 'stu-5',
      name: 'Vikramaditya Reddy',
      username: '@vikram.reddy',
      initials: 'VR',
      avatarColor: 'red',
      mobile: '+91 99881 65432',
      email: 'vikram.reddy@domain.edu',
      coursesCount: 2,
      validUntil: '14 Feb 2025',
      validDaysText: 'Expired 68 days ago',
      status: 'Expired',
    },
    {
      id: 'stu-6',
      name: 'Meera Sundaram',
      username: '@meera.sundaram',
      initials: 'MS',
      avatarColor: 'teal',
      mobile: '+91 94448 18293',
      email: 'meera.sundaram@domain.edu',
      coursesCount: 3,
      validUntil: '30 Nov 2025',
      validDaysText: '199 days left',
      status: 'Active',
    },
    {
      id: 'stu-7',
      name: 'Arjun Patel',
      username: '@arjun_patel99',
      initials: 'AP',
      avatarColor: 'slate',
      mobile: '+91 98251 33412',
      email: 'arjun.patel@domain.edu',
      coursesCount: 1,
      validUntil: '12 Sep 2025',
      validDaysText: 'Inactive Account',
      status: 'Inactive',
    },
    {
      id: 'stu-8',
      name: 'Diya Sen',
      username: '@diya.sen',
      initials: 'DS',
      avatarColor: 'indigo',
      mobile: '+91 98310 99876',
      email: 'diya.sen@domain.edu',
      coursesCount: 2,
      validUntil: '05 Mar 2026',
      validDaysText: '294 days left',
      status: 'Active',
    },
  ]);

  // Initial Sample Courses Data
  const [courses, setCourses] = useState([
    {
      id: 'course-1',
      code: 'CS-501',
      title: 'Advanced Data Structures & Algorithms in Java',
      description: 'Comprehensive GATE & IIT curriculum with algorithmic complexity',
      thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
      videoCount: 42,
      studentsCount: 1420,
      status: 'Published',
      discipline: 'Computer Science',
      createdAt: '2025-01-10T10:00:00Z',
    },
    {
      id: 'course-2',
      code: 'LAW-302',
      title: 'Constitutional Law & Public Administration of India',
      description: 'Foundational UPSC & judicial services governance modules',
      thumbnailUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
      videoCount: 36,
      studentsCount: 980,
      status: 'Published',
      discipline: 'Law',
      createdAt: '2025-01-15T10:00:00Z',
    },
    {
      id: 'course-3',
      code: 'EE-410',
      title: 'VLSI Design & Microelectronics Engineering',
      description: 'RTL synthesis, CMOS layout & semiconductor architecture',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
      videoCount: 28,
      studentsCount: 640,
      status: 'Published',
      discipline: 'Engineering',
      createdAt: '2025-01-18T10:00:00Z',
    },
    {
      id: 'course-4',
      code: 'FIN-201',
      title: 'Indian Financial Markets & Banking Regulations',
      description: 'RBI frameworks, capital market dynamics & SEBI compliances',
      thumbnailUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80',
      videoCount: 30,
      studentsCount: 815,
      status: 'Published',
      discipline: 'Finance',
      createdAt: '2025-01-22T10:00:00Z',
    },
    {
      id: 'course-5',
      code: 'AI-601',
      title: 'Artificial Intelligence & Machine Learning with Python',
      description: 'Deep neural networks, OpenCV & natural language processing',
      thumbnailUrl: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=600&auto=format&fit=crop&q=80',
      videoCount: 54,
      studentsCount: 2130,
      status: 'Published',
      discipline: 'AI',
      createdAt: '2025-01-25T10:00:00Z',
    },
    {
      id: 'course-6',
      code: 'HIST-105',
      title: 'Modern Indian History & Geopolitics',
      description: 'Decolonization, international relations & post-independence policy',
      thumbnailUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&auto=format&fit=crop&q=80',
      videoCount: 18,
      studentsCount: 450,
      status: 'Draft',
      discipline: 'History',
      createdAt: '2025-02-01T10:00:00Z',
    },
    {
      id: 'course-7',
      code: 'CS-204',
      title: 'Java Programming Basics',
      description: 'A comprehensive foundational curriculum covering object-oriented programming paradigms, memory allocation, exception handling, multithreading, and standard collection frameworks for undergraduate engineering students.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
      videoCount: 12,
      studentsCount: 45,
      status: 'Published',
      discipline: 'Computer Science',
      createdAt: '2025-02-05T10:00:00Z',
    },
  ]);

  // Expiring cohorts matching screenshot
  const [expiringStudents, setExpiringStudents] = useState([
    {
      id: 'AEGIS-84920',
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      course: 'Advanced Cryptography',
      courseCode: 'CS-409',
      expiresIn: 'In 2 days',
      isExtended: false,
    },
    {
      id: 'AEGIS-77312',
      name: 'Marcus Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      course: 'Distributed Architectures',
      courseCode: 'SYS-502',
      expiresIn: 'In 4 days',
      isExtended: false,
    },
    {
      id: 'AEGIS-91044',
      name: 'Nia Adebayo',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      course: 'Formal Verification',
      courseCode: 'MATH-311',
      expiresIn: 'In 5 days',
      isExtended: false,
    },
    {
      id: 'AEGIS-60298',
      name: 'Julian Thorne',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      course: 'Quantum Algorithms',
      courseCode: 'PHYS-420',
      expiresIn: 'In 5 days',
      isExtended: false,
    },
  ]);

  // Video processing queue matching screenshot
  const [videoQueue, setVideoQueue] = useState([
    {
      id: 1,
      title: 'Lecture 08: Distributed Ledger Con...',
      course: 'CS-409 Cryptographic Protocols',
      progress: 78,
    },
    {
      id: 2,
      title: 'Module 4: Neural Architecture Sear...',
      course: 'AI-610 Deep Learning Foundations',
      progress: 45,
    },
    {
      id: 3,
      title: 'Seminar: Quantum Cryptography F...',
      course: 'PHYS-420 Applied Quantum Systems',
      progress: 92,
    },
    {
      id: 4,
      title: 'Lab 02: Kernel Exploit Mitigati...',
      course: 'SEC-305 Systems Hardening',
      progress: 18,
    },
  ]);

  const showToast = (msg) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3500);
  };

  // Fetch students & courses from Database on mount
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const [dbStudents, dbCourses] = await Promise.all([
          fetchStudentsFromDb(),
          fetchCoursesFromDb(),
        ]);
        if (isMounted) {
          if (Array.isArray(dbStudents) && dbStudents.length > 0) {
            setStudents(dbStudents);
          }
          if (Array.isArray(dbCourses) && dbCourses.length > 0) {
            setCourses(dbCourses);
          }
        }
      } catch (err) {
        console.warn('[AdminDashboard] DB initial load notice:', err);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaveCourse = (savedCourse) => {
    if (selectedCourse && courseSubView === 'edit') {
      setCourses((prev) =>
        prev.map((c) => (c.id === savedCourse.id ? savedCourse : c))
      );
      setSelectedCourse(savedCourse);
      showToast(`Course "${savedCourse.title}" updated successfully.`);
      setCourseSubView('detail');
    } else {
      setCourses((prev) => [savedCourse, ...prev]);
      setSelectedCourse(savedCourse);
      showToast(`Course "${savedCourse.title}" created and cataloged into syllabus.`);
      setCourseSubView('detail');
    }
  };

  const handleDeleteCourse = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      setCourses((prev) => prev.filter((c) => c.id !== id));
      if (selectedCourse?.id === id) {
        setSelectedCourse(null);
        setCourseSubView('list');
      }
      showToast(`Course "${title}" has been deleted.`);
    }
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setCourseSubView('edit');
    setActiveTab('Courses');
  };

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setCourseSubView('detail');
    setActiveTab('Courses');
  };

  const handleImportSampleCourses = () => {
    setCatalogStateMode('normal');
    showToast('Default institutional syllabi and lecture streams imported.');
  };

  const handleRefreshQueue = () => {
    setIsRefreshingQueue(true);
    setTimeout(() => {
      setVideoQueue((prev) =>
        prev.map((item) => ({
          ...item,
          progress: Math.min(100, item.progress + Math.floor(Math.random() * 8) + 2),
        }))
      );
      setIsRefreshingQueue(false);
      showToast('Media Transcode Queue refreshed');
    }, 500);
  };

  const handleExtendStudent = (id, name) => {
    setExpiringStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, expiresIn: 'Extended (+30d)', isExtended: true } : s))
    );
    showToast(`Access extended by 30 days for ${name}`);
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Courses', icon: BookOpen },
    { label: 'Students', icon: GraduationCap, badge: 142 },
    { label: 'Plans', icon: Layers },
    { label: 'Settings', icon: Settings },
  ];

  const adminName = user?.name || user?.fullName || 'Dr. Arthur Vance';
  const adminRole = user?.role || 'Dean of Academics';

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] text-slate-800 font-sans overflow-hidden select-none">
      
      {/* Toast Notification Alert */}
      {actionMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#162544] text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 animate-fadeIn text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* LEFT SIDEBAR (Dark Navy #162544 matching screenshots) */}
      {/* ========================================================= */}
      <aside className="w-64 bg-[#162544] text-slate-300 flex flex-col justify-between flex-shrink-0 z-20 border-r border-slate-800">
        <div>
          {/* Brand Header */}
          <div className="p-5 flex items-center gap-3 border-b border-slate-800/80">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center shadow-sm">
              <Shield className="w-5 h-5 text-white stroke-[2]" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white leading-tight">
                Aegis Academy
              </h1>
              <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Secure Portal</span>
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1.5 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    setActiveTab(item.label);
                    if (item.label === 'Courses') {
                      setCourseSubView('list');
                    }
                    if (item.label === 'Students') {
                      setStudentSubView('list');
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600/90 text-white shadow-md font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-800/90 text-blue-300 border border-slate-700/80">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Status & Controls */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          {/* Status Indicator (Matching Screenshot 1 & 2) */}
          <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-900/70 border border-slate-800 text-[11px] text-slate-300 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <div>
                <div className="text-white font-bold text-xs leading-tight">Node 01: Secure 99.9%</div>
                <div className="text-[10px] text-slate-400">System Status: Secure Node</div>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
          </div>

          {/* Help & Logout */}
          <div className="space-y-1 text-xs pt-1">
            <button
              onClick={() => showToast('Institutional documentation opened in new tab.')}
              className="w-full flex items-center gap-2.5 px-2 py-2 text-slate-400 hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-slate-800/50"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Documentation</span>
            </button>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2.5 px-2 py-2 text-slate-400 hover:text-red-400 transition-colors cursor-pointer rounded-lg hover:bg-slate-800/50 font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-10">
          
          {/* Left Title / Breadcrumbs */}
          <div className="flex items-center gap-2.5 text-xs font-medium text-slate-500">
            {activeTab === 'Dashboard' && (
              <h2 className="text-slate-900 font-extrabold text-xl tracking-tight">Dashboard</h2>
            )}

            {activeTab === 'Courses' && courseSubView === 'list' && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Curriculum Management</span>
                <span className="text-slate-300">/</span>
                <span className="text-slate-900 font-bold">Courses Catalog</span>
              </div>
            )}

            {activeTab === 'Courses' && courseSubView === 'detail' && (
              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => setCourseSubView('list')}
                  className="hover:text-blue-600 font-semibold flex items-center gap-1 cursor-pointer text-slate-600"
                >
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                  <span>Courses</span>
                </button>
                <span className="text-slate-300">/</span>
                <span className="text-slate-900 font-bold">
                  {selectedCourse?.title || 'Java Programming Basics'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {selectedCourse?.code || 'CS-204'}
                </span>
              </div>
            )}

            {activeTab === 'Courses' && (courseSubView === 'add' || courseSubView === 'edit') && (
              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => setCourseSubView('list')}
                  className="hover:text-blue-600 font-semibold flex items-center gap-1 cursor-pointer text-slate-600"
                >
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                  <span>Courses</span>
                </button>
                <span className="text-slate-300">/</span>
                <span className="text-slate-900 font-bold">
                  {courseSubView === 'edit' ? 'Edit Course' : 'Add Course'}
                </span>
              </div>
            )}

            {activeTab === 'Students' && studentSubView === 'list' && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Student Management</span>
                <span className="text-slate-300">/</span>
                <span className="text-slate-900 font-bold">Students Directory</span>
              </div>
            )}

            {activeTab === 'Students' && studentSubView === 'detail' && (
              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => setStudentSubView('list')}
                  className="hover:text-blue-600 font-semibold flex items-center gap-1.5 cursor-pointer text-slate-600"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
                  <span>Students</span>
                </button>
                <span className="text-slate-300">/</span>
                <span className="text-slate-900 font-bold">
                  {selectedStudent?.name || selectedStudent?.fullName || 'Priya Deshmukh'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                  {selectedStudent?.studentCode || (selectedStudent?.id ? `STU-2024-${String(selectedStudent.id).slice(-4).toUpperCase()}` : 'STU-2024-8842')}
                </span>
              </div>
            )}

            {activeTab === 'Students' && (studentSubView === 'add' || studentSubView === 'edit') && (
              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => setStudentSubView('list')}
                  className="hover:text-blue-600 font-semibold flex items-center gap-1 cursor-pointer text-slate-600"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                  <span>Students</span>
                </button>
                <span className="text-slate-300">/</span>
                <span className="text-slate-900 font-bold">
                  {studentSubView === 'edit' ? 'Edit Student' : 'Add Student'}
                </span>
              </div>
            )}

            {activeTab !== 'Dashboard' && activeTab !== 'Courses' && activeTab !== 'Students' && (
              <h2 className="text-slate-900 font-extrabold text-xl tracking-tight">{activeTab}</h2>
            )}
          </div>

          {/* Top Right Controls & Profile */}
          <div className="flex items-center gap-4">
            
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationModal(!showNotificationModal)}
                className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors relative cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 text-slate-600" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border border-white" />
              </button>

              {showNotificationModal && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-bold text-sm text-slate-900">System Alerts</span>
                    <span className="text-[11px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">2 New</span>
                  </div>
                  <div className="space-y-2.5 mt-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                      <p className="font-semibold text-amber-900">Academic Term 2024-25 Active</p>
                      <p className="text-amber-700 mt-0.5 text-[11px]">Curriculum accreditation registry synced with ABET standards.</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200">
                      <p className="font-semibold text-blue-900">DRM Media Pipeline Online</p>
                      <p className="text-blue-700 mt-0.5 text-[11px]">AES-256 automated hardware transcode rig online.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar & Info matching Screenshot */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2.5 hover:bg-slate-50 p-1.5 rounded-xl transition-colors cursor-pointer"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt={adminName}
                  className="w-8 h-8 rounded-full object-cover border border-slate-300"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    {adminName}
                  </div>
                  <div className="text-[11px] text-slate-500 font-normal">
                    {adminRole}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fadeIn text-xs">
                  <div className="px-4 py-2 border-b border-slate-100 font-semibold text-slate-700">
                    {adminRole}
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('Settings');
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 cursor-pointer"
                  >
                    Faculty Settings
                  </button>
                  <div className="border-t border-slate-100 my-1" />
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 font-medium cursor-pointer"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* ========================================================= */}
        {/* MAIN BODY SWITCHER */}
        {/* ========================================================= */}
        <main className="p-6 sm:p-8 max-w-[1400px] w-full mx-auto">
          
          {/* TAB 1: DASHBOARD VIEW (Matching the user's latest screenshot) */}
          {activeTab === 'Dashboard' && (
            <div className="space-y-6 animate-fadeIn pb-12">
              
              {/* Header Title & 4 Action Buttons */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    Academic Operations
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-normal">
                    Manage active student cohorts, syllabus deployments, and automated video pipelines.
                  </p>
                </div>

                {/* 4 Action Buttons matching screenshot */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => {
                      setActiveTab('Courses');
                      setSelectedCourse(null);
                      setCourseSubView('add');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#162544] hover:bg-[#111e3b] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Add Course</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setActiveTab('Students');
                      setSelectedStudent(null);
                      setStudentSubView('add');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm transition-all cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-slate-600" />
                    <span>Add Student</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('Courses');
                      setSelectedCourse(courses[6] || courses[0]);
                      setCourseSubView('detail');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#162544] hover:bg-[#111e3b] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload Video</span>
                  </button>

                  <button
                    onClick={() => showToast('Live broadcast encoder stream initiated.')}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm transition-all cursor-pointer"
                  >
                    <Radio className="w-3.5 h-3.5 text-slate-600" />
                    <span>Start Live Stream</span>
                  </button>
                </div>
              </div>

              {/* ========================================================= */}
              {/* 8 METRIC CARDS (2 rows of 4 matching screenshot) */}
              {/* ========================================================= */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Row 1, Card 1: TOTAL STUDENTS */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      TOTAL STUDENTS
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                      14,820
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <GraduationCap className="w-6 h-6 stroke-[1.8]" />
                  </div>
                </div>

                {/* Row 1, Card 2: ACTIVE STUDENTS */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      ACTIVE STUDENTS
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                      12,450
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                    <ShieldCheck className="w-6 h-6 stroke-[1.8]" />
                  </div>
                </div>

                {/* Row 1, Card 3: TOTAL COURSES */}
                <div
                  onClick={() => {
                    setActiveTab('Courses');
                    setCourseSubView('list');
                  }}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-blue-400 transition-all cursor-pointer group"
                >
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      TOTAL COURSES
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                      384
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0 group-hover:scale-105 transition-transform">
                    <BookOpen className="w-6 h-6 stroke-[1.8]" />
                  </div>
                </div>

                {/* Row 1, Card 4: TOTAL VIDEOS */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      TOTAL VIDEOS
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                      2,190
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 flex-shrink-0">
                    <Video className="w-6 h-6 stroke-[1.8]" />
                  </div>
                </div>

                {/* Row 2, Card 1: EXPIRED STUDENTS */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      EXPIRED STUDENTS
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                      320
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500 flex-shrink-0">
                    <Clock className="w-6 h-6 stroke-[1.8]" />
                  </div>
                </div>

                {/* Row 2, Card 2: EXPIRING IN 7 DAYS */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      EXPIRING IN 7 DAYS
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                      85
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 flex-shrink-0">
                    <Timer className="w-6 h-6 stroke-[1.8]" />
                  </div>
                </div>

                {/* Row 2, Card 3: PUBLISHED COURSES */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      PUBLISHED COURSES
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                      342
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 stroke-[1.8]" />
                  </div>
                </div>

                {/* Row 2, Card 4: VIDEOS PROCESSING */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      VIDEOS PROCESSING
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                      18
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 flex-shrink-0">
                    <RefreshCw className="w-6 h-6 stroke-[1.8]" />
                  </div>
                </div>

              </div>

              {/* ========================================================= */}
              {/* 2 BOTTOM CARDS: Expiring Soon (Left) & Videos Processing (Right) */}
              {/* ========================================================= */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* Left Card (7 cols): Expiring Soon */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-slate-700" />
                        <h4 className="font-extrabold text-slate-900 text-sm">
                          Expiring Soon
                        </h4>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">
                        Active Cohort Alerts
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse mt-2">
                        <thead>
                          <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            <th className="py-2.5 px-2">STUDENT</th>
                            <th className="py-2.5 px-2">COURSE</th>
                            <th className="py-2.5 px-2 text-center">EXPIRES ON</th>
                            <th className="py-2.5 px-2 text-right">ACTION</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                          {expiringStudents.map((s) => (
                            <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                              {/* Student Info */}
                              <td className="py-3 px-2 align-middle">
                                <div className="flex items-center gap-2.5">
                                  <img
                                    src={s.avatar}
                                    alt={s.name}
                                    className="w-8 h-8 rounded-full object-cover border border-slate-200 flex-shrink-0"
                                  />
                                  <div>
                                    <div className="font-bold text-slate-900">{s.name}</div>
                                    <div className="text-[10px] text-slate-400 font-mono">{s.id}</div>
                                  </div>
                                </div>
                              </td>

                              {/* Course Info */}
                              <td className="py-3 px-2 align-middle">
                                <div>
                                  <div className="font-bold text-slate-800">{s.course}</div>
                                  <div className="text-[10px] text-slate-400 font-mono">{s.courseCode}</div>
                                </div>
                              </td>

                              {/* Expires In */}
                              <td className="py-3 px-2 text-center align-middle">
                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                  s.isExtended
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                                }`}>
                                  {s.expiresIn}
                                </span>
                              </td>

                              {/* Extend Button */}
                              <td className="py-3 px-2 text-right align-middle">
                                <button
                                  onClick={() => handleExtendStudent(s.id, s.name)}
                                  className="px-3 py-1 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-all cursor-pointer"
                                >
                                  Extend
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                    <span>Showing 4 of 85 expiring accounts</span>
                    <button
                      onClick={() => showToast('Navigating to full student cohort directory')}
                      className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Cohort Directory</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Right Card (5 cols): Videos Processing */}
                <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 text-slate-700" />
                        <h4 className="font-extrabold text-slate-900 text-sm">
                          Videos Processing
                        </h4>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">
                        Media Cluster
                      </span>
                    </div>

                    <div className="space-y-4 mt-3">
                      {videoQueue.map((video) => (
                        <div key={video.id} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <div className="min-w-0 flex-1 pr-2">
                              <div className="font-bold text-slate-900 truncate">{video.title}</div>
                              <div className="text-[10px] text-slate-400 truncate">{video.course}</div>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex-shrink-0">
                              Processing
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-[#162544] h-full rounded-full transition-all duration-500"
                                style={{ width: `${video.progress}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-mono font-semibold text-slate-600 w-8 text-right">
                              {video.progress}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span className="text-slate-400">Encoding via Aegis Transcode Pipeline v4.2</span>
                    <button
                      onClick={handleRefreshQueue}
                      className="text-slate-700 hover:text-slate-900 font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingQueue ? 'animate-spin' : ''}`} />
                      <span>Refresh Queue</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: COURSES VIEW (Handling List | Detail | Add | Edit) */}
          {activeTab === 'Courses' && (
            <div>
              {courseSubView === 'list' && (
                <CoursesList
                  courses={courses}
                  onAddCourseClick={() => {
                    setSelectedCourse(null);
                    setCourseSubView('add');
                  }}
                  onEditCourse={handleEditCourse}
                  onDeleteCourse={handleDeleteCourse}
                  onViewCourse={handleViewCourse}
                  onImportSampleCourses={handleImportSampleCourses}
                />
              )}

              {courseSubView === 'detail' && (
                <CourseDetail
                  course={selectedCourse || courses[6] || courses[0]}
                  onBack={() => setCourseSubView('list')}
                  onEditCourse={handleEditCourse}
                />
              )}

              {(courseSubView === 'add' || courseSubView === 'edit') && (
                <AddCourse
                  initialData={courseSubView === 'edit' ? selectedCourse : null}
                  onSaveCourse={handleSaveCourse}
                  onCancel={() => {
                    if (selectedCourse && courseSubView === 'edit') {
                      setCourseSubView('detail');
                    } else {
                      setCourseSubView('list');
                    }
                  }}
                />
              )}
            </div>
          )}

          {/* TAB 3: STUDENTS */}
          {activeTab === 'Students' && (
            <div>
              {studentSubView === 'list' && (
                <StudentsList
                  students={students}
                  onAddStudent={() => {
                    setSelectedStudent(null);
                    setStudentSubView('add');
                  }}
                  onEditStudent={(student) => {
                    setSelectedStudent(student);
                    setStudentSubView('edit');
                  }}
                  onViewStudent={(student) => {
                    setSelectedStudent(student);
                    setStudentSubView('detail');
                  }}
                  onDeleteStudent={async (id, name) => {
                    if (window.confirm(`Are you sure you want to deactivate student ${name}?`)) {
                      setStudents((prev) => prev.filter((s) => s.id !== id));
                      await deleteStudentFromDb(id);
                      showToast(`Student record for ${name} removed from database.`);
                    }
                  }}
                />
              )}

              {studentSubView === 'detail' && (
                <StudentDetail
                  student={selectedStudent || students[1] || students[0]}
                  courses={courses}
                  onBack={() => setStudentSubView('list')}
                  onUpdateStudent={(updatedStudent) => {
                    setStudents((prev) =>
                      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
                    );
                    setSelectedStudent(updatedStudent);
                  }}
                  showToast={showToast}
                />
              )}

              {(studentSubView === 'add' || studentSubView === 'edit') && (
                <AddStudent
                  initialData={studentSubView === 'edit' ? selectedStudent : null}
                  onSaveStudent={async (savedStudent) => {
                    if (studentSubView === 'edit') {
                      setStudents((prev) =>
                        prev.map((s) => (s.id === savedStudent.id ? savedStudent : s))
                      );
                      showToast(`Student "${savedStudent.name}" profile updated.`);
                      return savedStudent;
                    } else {
                      try {
                        const persisted = await createStudentInDb(savedStudent);
                        setStudents((prev) => [persisted, ...prev.filter((s) => s.id !== persisted.id)]);
                        showToast(`Student "${persisted.name}" saved to database successfully.`);
                        return persisted;
                      } catch (dbErr) {
                        setStudents((prev) => [savedStudent, ...prev]);
                        showToast(`Student "${savedStudent.name}" enrolled & credentials generated.`);
                        return savedStudent;
                      }
                    }
                  }}
                  onStudentCreated={(newStudent) => {
                    setSelectedStudent(newStudent);
                    setStudentSubView('detail');
                  }}
                  onCancel={() => {
                    setSelectedStudent(null);
                    setStudentSubView('list');
                  }}
                />
              )}
            </div>
          )}

          {/* TAB 4: PLANS */}
          {activeTab === 'Plans' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <Layers className="w-12 h-12 text-indigo-600 mx-auto stroke-[1.5]" />
              <h3 className="text-xl font-bold text-slate-900">Academic Membership & Subscription Plans</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto font-normal">
                Enterprise tiers, student batch subscriptions, and institutional access licenses.
              </p>
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'Settings' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <Settings className="w-12 h-12 text-slate-600 mx-auto stroke-[1.5]" />
              <h3 className="text-xl font-bold text-slate-900">System & Security Settings</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto font-normal">
                Configure TLS 1.3 certificates, Bunny.net streaming keys, and administrator access control.
              </p>
            </div>
          )}

        </main>
      </div>

      {/* ========================================================= */}
      {/* PROCTORING TELEMETRY MODAL */}
      {/* ========================================================= */}
      {showProctoringModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 text-white rounded-2xl max-w-xl w-full border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-blue-500" />
                <h3 className="font-bold text-base">Aegis Biometric Proctoring Console</h3>
              </div>
              <button
                onClick={() => setShowProctoringModal(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Camera className="w-4 h-4 text-emerald-400" />
                  <span>Continuous Webcam Eye-Tracking Rig</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-700 text-[10px]">
                  ACTIVE (99.8% Conf)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <span>Browser Lockdown & Sandbox Isolation</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-bold border border-blue-700 text-[10px]">
                  ENFORCED
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4 text-indigo-400" />
                  <span>Active Proctored Sessions</span>
                </div>
                <span className="font-mono text-white font-bold">142 Candidates Online</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end">
              <button
                onClick={() => setShowProctoringModal(false)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer"
              >
                Close Console
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
