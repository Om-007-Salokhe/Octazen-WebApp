import React, { useState } from 'react';
import {
  Search,
  Plus,
  Download,
  Eye,
  Edit,
  MoreVertical,
  ChevronDown,
  Filter,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Users,
  ShieldAlert,
  GraduationCap,
} from 'lucide-react';

export default function StudentsList({
  students,
  onAddStudent,
  onEditStudent,
  onViewStudent,
  onDeleteStudent,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [courseFilter, setCourseFilter] = useState('All');
  const [stateVariant, setStateVariant] = useState('active'); // 'active' | 'empty'
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter students based on search and dropdowns
  const filteredStudents = (stateVariant === 'empty' ? [] : students).filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.mobile.includes(searchQuery);

    const matchesStatus =
      statusFilter === 'All' || student.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesCourse =
      courseFilter === 'All' || student.coursesCount.toString() === courseFilter;

    return matchesSearch && matchesStatus && matchesCourse;
  });

  const getAvatarColor = (color) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 text-blue-700';
      case 'purple':
        return 'bg-purple-100 text-purple-700';
      case 'orange':
        return 'bg-amber-100 text-amber-700';
      case 'green':
      case 'emerald':
        return 'bg-emerald-100 text-emerald-700';
      case 'red':
        return 'bg-red-100 text-red-700';
      case 'teal':
        return 'bg-teal-100 text-teal-700';
      case 'indigo':
        return 'bg-indigo-100 text-indigo-700';
      case 'slate':
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Active
          </span>
        );
      case 'Expired':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            Expired
          </span>
        );
      case 'Inactive':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            Inactive
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      
      {/* ========================================================= */}
      {/* PAGE HEADER & TOP ACTION BUTTONS (Matching Screenshot) */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Students
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
            Manage student enrollments, institutional credentials, and course access privileges.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => alert('Exporting student directory report as encrypted CSV...')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export</span>
          </button>

          <button
            onClick={onAddStudent}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#162544] hover:bg-[#111e3b] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* FILTER & SEARCH BAR + STATE SWITCHER PILL */}
      {/* ========================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1">
        
        {/* Left: Search input & dropdown filters */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1 max-w-2xl">
          
          {/* Search box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, username or mobile..."
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all shadow-xs font-medium"
            />
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 pr-8 text-xs font-semibold text-slate-700 outline-none focus:border-blue-600 cursor-pointer shadow-xs"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
              <option value="Inactive">Inactive</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Courses Dropdown */}
          <div className="relative">
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 pr-8 text-xs font-semibold text-slate-700 outline-none focus:border-blue-600 cursor-pointer shadow-xs"
            >
              <option value="All">All Courses</option>
              <option value="1">1 Course</option>
              <option value="2">2 Courses</option>
              <option value="3">3 Courses</option>
              <option value="4">4 Courses</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Filter icon button */}
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('All');
              setCourseFilter('All');
            }}
            title="Reset filters"
            className="p-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-600 cursor-pointer shadow-xs transition-colors"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* Right: State Switcher Pill (Active Directory vs Empty State Variant) */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs self-start lg:self-auto text-xs">
          <button
            type="button"
            onClick={() => setStateVariant('active')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              stateVariant === 'active'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Active Directory (8 Students)</span>
          </button>

          <button
            type="button"
            onClick={() => setStateVariant('empty')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              stateVariant === 'empty'
                ? 'bg-[#162544] text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Empty State Variant</span>
          </button>
        </div>

      </div>

      {/* ========================================================= */}
      {/* MAIN STUDENTS TABLE OR EMPTY STATE */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {filteredStudents.length === 0 ? (
          /* Empty State View */
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
              <Users className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                No Student Records Found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-normal">
                {stateVariant === 'empty'
                  ? 'Currently there are no enrolled candidates cataloged in this cohort variant.'
                  : 'No student accounts match the active search filter criteria.'}
              </p>
            </div>
            <button
              onClick={onAddStudent}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#162544] text-white text-xs font-bold shadow-md cursor-pointer hover:bg-[#111e3b] transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Student</span>
            </button>
          </div>
        ) : (
          /* Populated Table View */
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-5">STUDENT</th>
                    <th className="py-3.5 px-5">MOBILE</th>
                    <th className="py-3.5 px-5">ENROLLED COURSES</th>
                    <th className="py-3.5 px-5">VALID UNTIL</th>
                    <th className="py-3.5 px-5">STATUS</th>
                    <th className="py-3.5 px-5 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Student Avatar + Name + Username */}
                      <td className="py-4 px-5 align-middle">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${getAvatarColor(
                              student.avatarColor
                            )}`}
                          >
                            {student.initials}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 text-xs truncate">
                              {student.name}
                            </div>
                            <div className="text-[11px] text-slate-400 font-medium truncate">
                              {student.username}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Mobile Number */}
                      <td className="py-4 px-5 align-middle font-mono text-xs text-slate-600 font-semibold whitespace-nowrap">
                        {student.mobile}
                      </td>

                      {/* Enrolled Courses Pill */}
                      <td className="py-4 px-5 align-middle whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          <span>{student.coursesCount} Courses</span>
                        </span>
                      </td>

                      {/* Valid Until + Expiry Calculation */}
                      <td className="py-4 px-5 align-middle whitespace-nowrap">
                        <div className="font-semibold text-slate-900 text-xs">
                          {student.validUntil}
                        </div>
                        <div
                          className={`text-[11px] font-medium mt-0.5 ${
                            student.status === 'Expired'
                              ? 'text-red-500'
                              : student.status === 'Inactive'
                              ? 'text-slate-400'
                              : 'text-emerald-600'
                          }`}
                        >
                          {student.validDaysText}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5 align-middle whitespace-nowrap">
                        {getStatusBadge(student.status)}
                      </td>

                      {/* Actions (Eye, Pencil, More) */}
                      <td className="py-4 px-5 text-right align-middle whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => onViewStudent && onViewStudent(student)}
                            title="View Student"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onEditStudent && onEditStudent(student)}
                            title="Edit Student"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <div className="relative">
                            <button
                              onClick={() =>
                                setActiveMenuId(activeMenuId === student.id ? null : student.id)
                              }
                              title="More actions"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {/* Dropdown Menu */}
                            {activeMenuId === student.id && (
                              <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 text-xs text-left animate-fadeIn">
                                <button
                                  onClick={() => {
                                    alert(`Extended 30 days access for ${student.name}`);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full px-3.5 py-1.5 text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                                >
                                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                                  <span>Extend Access</span>
                                </button>
                                <button
                                  onClick={() => {
                                    alert(`Generated temporary OTP credentials for ${student.name}`);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full px-3.5 py-1.5 text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                                >
                                  <User className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Reset Credentials</span>
                                </button>
                                <div className="border-t border-slate-100 my-1" />
                                <button
                                  onClick={() => {
                                    onDeleteStudent && onDeleteStudent(student.id, student.name);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full px-3.5 py-1.5 text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                                >
                                  <ShieldAlert className="w-3.5 h-3.5" />
                                  <span>Deactivate Account</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Pagination Footer (Matching Screenshot) */}
            <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <div>
                Showing <strong className="text-slate-900">1</strong> to{' '}
                <strong className="text-slate-900">8</strong> of{' '}
                <strong className="text-slate-900">142</strong> students
              </div>

              <div className="flex items-center gap-1 text-xs">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-white text-slate-600 font-semibold cursor-pointer transition-colors"
                >
                  &lt; Previous
                </button>

                <button
                  onClick={() => setCurrentPage(1)}
                  className={`w-8 h-8 rounded-lg font-bold flex items-center justify-center transition-colors cursor-pointer ${
                    currentPage === 1
                      ? 'bg-[#162544] text-white shadow-xs'
                      : 'border border-slate-300 hover:bg-white text-slate-700'
                  }`}
                >
                  1
                </button>

                <button
                  onClick={() => setCurrentPage(2)}
                  className={`w-8 h-8 rounded-lg font-bold flex items-center justify-center transition-colors cursor-pointer ${
                    currentPage === 2
                      ? 'bg-[#162544] text-white shadow-xs'
                      : 'border border-slate-300 hover:bg-white text-slate-700'
                  }`}
                >
                  2
                </button>

                <button
                  onClick={() => setCurrentPage(3)}
                  className="w-8 h-8 rounded-lg border border-slate-300 hover:bg-white text-slate-700 font-semibold flex items-center justify-center cursor-pointer transition-colors"
                >
                  3
                </button>

                <button
                  onClick={() => setCurrentPage(4)}
                  className="w-8 h-8 rounded-lg border border-slate-300 hover:bg-white text-slate-700 font-semibold flex items-center justify-center cursor-pointer transition-colors"
                >
                  4
                </button>

                <span className="px-1 text-slate-400">...</span>

                <button
                  onClick={() => setCurrentPage(18)}
                  className="w-8 h-8 rounded-lg border border-slate-300 hover:bg-white text-slate-700 font-semibold flex items-center justify-center cursor-pointer transition-colors"
                >
                  18
                </button>

                <button
                  onClick={() => setCurrentPage(Math.min(18, currentPage + 1))}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-white text-slate-600 font-semibold cursor-pointer transition-colors"
                >
                  Next &gt;
                </button>
              </div>
            </div>
          </>
        )}

      </div>

      {/* ========================================================= */}
      {/* BOTTOM COMPLIANCE FOOTER (Matching Screenshot) */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 font-medium pt-2">
        <div>
          Aegis Academy Identity & Access Framework • Revision 4.12.0 (FIPS 140-3 Accredited)
        </div>
        <div>
          All student records cryptographically signed and immutable.
        </div>
      </div>

    </div>
  );
}
