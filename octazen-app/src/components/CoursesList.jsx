import React, { useState } from 'react';
import {
  Search,
  Plus,
  Video,
  Eye,
  Edit,
  Trash2,
  Filter,
  CheckCircle2,
  Clock,
  Layers,
  FileText,
  Shield,
  ShieldCheck,
  Cpu,
  Lock,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';

export default function CoursesList({
  courses = [],
  onAddCourseClick,
  onEditCourse,
  onDeleteCourse,
  onViewCourse,
  onImportSampleCourses,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [disciplineFilter, setDisciplineFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Filter courses based on search query, status, and discipline
  const filteredCourses = courses.filter((course) => {
    const titleMatch = (course.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = (course.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const discMatch = (course.discipline || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearch = titleMatch || descMatch || discMatch;

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'PUBLISHED' && course.status === 'Published') ||
      (statusFilter === 'DRAFT' && course.status === 'Draft');

    const matchesDiscipline =
      disciplineFilter === 'ALL' ||
      (course.discipline &&
        course.discipline.toLowerCase().includes(disciplineFilter.toLowerCase()));

    return matchesSearch && matchesStatus && matchesDiscipline;
  });

  const itemsPerPage = 6;
  const totalCoursesCount = filteredCourses.length;
  const totalPages = Math.ceil(totalCoursesCount / itemsPerPage) || 1;
  const displayedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* ========================================================= */}
      {/* TOP HEADER SECTION (Matching Image 1 & 2) */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Courses
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
            Manage institutional curriculum, lecture streams, and student cohort enrollments
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onAddCourseClick}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#162544] hover:bg-[#111e3b] text-white text-sm font-semibold shadow-md transition-all cursor-pointer flex-shrink-0 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Course</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SEARCH AND FILTER BAR (Matching Image 1 & 2) */}
      {/* ========================================================= */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search courses..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/40 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800 placeholder:text-slate-400"
          />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>

          {/* Discipline Dropdown */}
          <select
            value={disciplineFilter}
            onChange={(e) => {
              setDisciplineFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 outline-none cursor-pointer"
          >
            <option value="ALL">All Disciplines</option>
            <option value="Computer Science">Computer Science & Cryptography</option>
            <option value="Law">Law & Governance</option>
            <option value="Engineering">Microelectronics & VLSI</option>
            <option value="Finance">Finance & Economics</option>
            <option value="AI">AI & Machine Learning</option>
            <option value="History">History & Geopolitics</option>
          </select>

          {/* Filter Toggle Button Icon */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            title="Toggle Filter Options"
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              showAdvancedFilters
                ? 'bg-blue-50 border-blue-300 text-blue-600'
                : 'border-slate-200 hover:bg-slate-50 text-slate-600'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* COURSES DISPLAY: EMPTY STATE (Image 2) OR POPULATED TABLE (Image 1) */}
      {/* ========================================================= */}

      {courses.length === 0 ? (
        /* Empty State View (Image 2) */
        <div className="space-y-6">
          {/* Main Empty State Container matching Image 2 */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 sm:p-16 text-center flex flex-col items-center justify-center relative overflow-hidden">
            
            {/* Central Book / Grad Cap Icon Badge */}
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-2xl bg-slate-100/90 border border-slate-200 flex items-center justify-center text-slate-700 shadow-sm">
                <BookOpen className="w-9 h-9 text-slate-700 stroke-[1.8]" />
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white shadow">
                <GraduationCap className="w-4 h-4 stroke-[2]" />
              </div>
            </div>

            {/* Heading & Description */}
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-2.5">
              No courses yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-lg leading-relaxed mb-6 font-normal">
              Get started by creating your first academic syllabus and uploading video lectures. Once published, cohorts will become eligible for secure identity verification and proctored examinations.
            </p>

            {/* Central Primary Add Course Button */}
            <button
              onClick={onAddCourseClick}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#162544] hover:bg-[#111e3b] text-white text-sm font-bold shadow-lg hover:shadow-xl active:scale-[0.99] transition-all cursor-pointer mb-3"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Course</span>
            </button>

            {/* Import from CSV link */}
            <button
              onClick={() => {
                if (onImportSampleCourses) {
                  onImportSampleCourses();
                }
              }}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1 cursor-pointer mb-8"
            >
              <span>or import curriculum from CSV / LMS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Bottom Encryption Footer */}
            <div className="pt-6 border-t border-slate-100 w-full max-w-md flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>All course materials are secured via Aegis End-to-End Institutional Encryption.</span>
            </div>
          </div>

          {/* 3 Bottom Feature Highlights Cards Grid (Image 2) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Card 1: Automated Syllabus Parser */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5">
                <FileText className="w-5 h-5 text-blue-600 stroke-[1.8]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 leading-tight">
                  Automated Syllabus Parser
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed font-normal">
                  Upload standard PDF or Word syllabi to auto-generate weekly lecture modules.
                </p>
              </div>
            </div>

            {/* Card 2: Proctor Rig Integration */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5">
                <Cpu className="w-5 h-5 text-blue-600 stroke-[1.8]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 leading-tight">
                  Proctor Rig Integration
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed font-normal">
                  Assign automated biometric check-ins or live proctor rosters to each exam room.
                </p>
              </div>
            </div>

            {/* Card 3: Accreditation Audit Ready */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 stroke-[1.8]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 leading-tight">
                  Accreditation Audit Ready
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed font-normal">
                  Every curriculum change is cryptographically logged for institutional compliance.
                </p>
              </div>
            </div>

          </div>
        </div>
      ) : filteredCourses.length === 0 ? (
        /* No Search / Filter Results */
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Search className="w-10 h-10 text-slate-400 mx-auto stroke-[1.5]" />
          <h3 className="text-base font-bold text-slate-900">No courses match your filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query or discipline filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('ALL');
              setDisciplineFilter('ALL');
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        /* Populated Courses Table View (Image 1) */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5 w-24">Thumbnail</th>
                  <th className="py-3.5 px-4 min-w-[280px]">Course Title</th>
                  <th className="py-3.5 px-4 text-center">Videos</th>
                  <th className="py-3.5 px-4 text-center">Students</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {displayedCourses.map((course) => (
                  <tr
                    key={course.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => onViewCourse && onViewCourse(course)}
                  >
                    {/* Thumbnail Image */}
                    <td className="py-4 px-5 align-middle">
                      <div className="w-14 h-11 rounded-lg overflow-hidden border border-slate-200 bg-slate-900 flex-shrink-0 relative shadow-sm">
                        <img
                          src={course.thumbnailUrl}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </td>

                    {/* Course Title & Description */}
                    <td className="py-4 px-4 align-middle">
                      <div className="max-w-lg">
                        <h4 className="font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors text-xs sm:text-sm">
                          {course.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 font-normal">
                          {course.description}
                        </p>
                      </div>
                    </td>

                    {/* Videos Count Badge (Image 1) */}
                    <td className="py-4 px-4 text-center align-middle" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/90 border border-slate-200 text-xs font-semibold text-slate-700">
                        <Video className="w-3.5 h-3.5 text-slate-500 stroke-[2]" />
                        <span>{course.videoCount || 0}</span>
                        <span className="text-[10px] text-slate-400 font-normal">Videos</span>
                      </div>
                    </td>

                    {/* Enrolled Students Count */}
                    <td className="py-4 px-4 text-center align-middle" onClick={(e) => e.stopPropagation()}>
                      <div>
                        <div className="font-extrabold text-slate-900 text-sm">
                          {course.studentsCount ? course.studentsCount.toLocaleString() : '0'}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          Enrolled Cohort
                        </div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4 text-center align-middle" onClick={(e) => e.stopPropagation()}>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          course.status === 'Published'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {course.status}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-5 text-right align-middle" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => onViewCourse && onViewCourse(course)}
                          title="View Course Syllabus & Videos"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4 stroke-[1.8]" />
                        </button>
                        <button
                          onClick={() => onEditCourse && onEditCourse(course)}
                          title="Edit Course Details"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                        >
                          <Edit className="w-4 h-4 stroke-[1.8]" />
                        </button>
                        <button
                          onClick={() => onDeleteCourse && onDeleteCourse(course.id, course.title)}
                          title="Archive / Delete Course"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 stroke-[1.8]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer matching Image 1 */}
          <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 bg-slate-50/40">
            <div>
              Showing <span className="font-bold text-slate-800">
                {displayedCourses.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
              </span> to <span className="font-bold text-slate-800">
                {Math.min(currentPage * itemsPerPage, totalCoursesCount)}
              </span> of <span className="font-bold text-slate-800">{totalCoursesCount}</span> courses
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  currentPage === 1
                    ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-white'
                    : 'border-slate-300 text-slate-700 hover:bg-slate-100 bg-white'
                }`}
              >
                &lt; Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentPage === page
                      ? 'bg-[#162544] text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  currentPage === totalPages
                    ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-white'
                    : 'border-slate-300 text-slate-700 hover:bg-slate-100 bg-white'
                }`}
              >
                Next &gt;
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
