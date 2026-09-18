import React, { useState } from 'react';
import {
  Shield,
  UploadCloud,
  CheckCircle2,
  X,
  Eye,
  Info,
  Check,
  ArrowLeft,
  FileCheck,
  ImageIcon,
  RefreshCw,
} from 'lucide-react';

export default function AddCourse({
  onSaveCourse,
  onCancel,
  initialData = null,
}) {
  // Form Fields matching Image 3
  const [title, setTitle] = useState(
    initialData?.title || 'Advanced Distributed Systems & Cryptographic Protocols'
  );
  const [description, setDescription] = useState(
    initialData?.description ||
      'This rigorous graduate-level curriculum covers consensus mechanisms, Byzantine fault tolerance, zero-knowledge proofs, and decentralized transaction routing architectures. Students will perform formal verification of state machines and implement audited cryptographic contracts.'
  );
  const [discipline, setDiscipline] = useState(
    initialData?.discipline || 'Computer Science'
  );
  const [isPublished, setIsPublished] = useState(
    initialData ? initialData.status === 'Published' : true
  );

  // Thumbnail Asset States
  const [thumbnailTab, setThumbnailTab] = useState('active'); // 'active' | 'dropzone'
  const [thumbnailUrl, setThumbnailUrl] = useState(
    initialData?.thumbnailUrl ||
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&auto=format&fit=crop&q=80'
  );
  const [fileName, setFileName] = useState('quantum-cryptography-banner.jpg');
  const [fileSize, setFileSize] = useState('1.4 MB');
  const [isSaving, setIsSaving] = useState(false);

  const wordCount = description.trim() ? description.trim().split(/\s+/).length : 0;
  const charCount = description.length;

  const handleSubmit = (saveStatus = null) => {
    if (!title.trim()) {
      alert('Please enter a course title.');
      return;
    }

    setIsSaving(true);
    const finalStatus = saveStatus || (isPublished ? 'Published' : 'Draft');

    setTimeout(() => {
      const savedCourse = {
        id: initialData?.id || `course_${Date.now()}`,
        code: initialData?.code || 'CS-409',
        title: title.trim(),
        description: description.trim(),
        thumbnailUrl: thumbnailUrl,
        videoCount: initialData?.videoCount || 42,
        studentsCount: initialData?.studentsCount || 1420,
        status: finalStatus,
        discipline: discipline,
        createdAt: initialData?.createdAt || new Date().toISOString(),
      };

      if (onSaveCourse) {
        onSaveCourse(savedCourse);
      }
      setIsSaving(false);
    }, 400);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setThumbnailUrl(event.target.result);
        setFileName(file.name);
        setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
        setThumbnailTab('active');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn pb-12">
      
      {/* Top Header Badge & Navigation matching Image 3 */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Courses</span>
          </button>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 tracking-wider uppercase">
            CURRICULUM CREATION
          </span>
          <span className="text-xs text-slate-400 font-medium">
            • Fall Academic Cohort 2025
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {initialData ? 'Edit Course' : 'Add Course'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-normal">
          Create and configure curriculum details, media assets, and publishing status for institutional cohorts.
        </p>
      </div>

      {/* Main Course Information Form Card matching Image 3 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-7">
        
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Course Information
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Mandatory metadata registered with the academic registry.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Accreditation Mode Active</span>
          </div>
        </div>

        {/* Course Title Field */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="courseTitle" className="block text-xs sm:text-sm font-bold text-slate-800">
              Course Title <span className="text-red-500">*</span>
            </label>
            <span className="text-xs text-slate-400 font-medium font-mono">
              Max 120 chars
            </span>
          </div>
          <input
            id="courseTitle"
            type="text"
            required
            maxLength={120}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Advanced Distributed Systems & Cryptographic Protocols"
            className="w-full px-4 py-2.5 sm:py-3 text-sm rounded-xl border border-slate-200 bg-slate-50/40 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-900 font-medium"
          />
          <p className="text-[11px] text-slate-400 mt-1.5 font-normal">
            A distinct and accreditation-compliant academic title for the syllabus.
          </p>
        </div>

        {/* Discipline Selection */}
        <div>
          <label htmlFor="discipline" className="block text-xs sm:text-sm font-bold text-slate-800 mb-2">
            Academic Discipline / Faculty
          </label>
          <select
            id="discipline"
            value={discipline}
            onChange={(e) => setDiscipline(e.target.value)}
            className="w-full px-4 py-2.5 sm:py-3 text-sm rounded-xl border border-slate-200 bg-slate-50/40 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-900 font-medium cursor-pointer"
          >
            <option value="Computer Science">Computer Science & Cryptography</option>
            <option value="AI & Machine Learning">Artificial Intelligence & Data Science</option>
            <option value="Engineering">Microelectronics & VLSI Engineering</option>
            <option value="Law & Governance">Law & Constitutional Governance</option>
            <option value="Finance & Economics">Financial Markets & Economics</option>
            <option value="History & Geopolitics">History & International Relations</option>
          </select>
        </div>

        {/* Description Field */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="description" className="block text-xs sm:text-sm font-bold text-slate-800">
              Description
            </label>
            <span className="text-xs text-slate-400 font-medium">
              Optional Overview
            </span>
          </div>
          <textarea
            id="description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide a comprehensive academic syllabus description..."
            className="w-full p-4 text-sm rounded-xl border border-slate-200 bg-slate-50/40 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-900 font-normal leading-relaxed resize-y"
          />
          <div className="flex items-center justify-between mt-1.5 text-[11px] text-slate-400">
            <span>Recommended 150-300 words. Markdown supported.</span>
            <span className="font-mono">{wordCount} words / {charCount} chars</span>
          </div>
        </div>

        {/* Course Thumbnail Selector (Tabs: Active Asset vs Empty Dropzone matching Image 3) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-xs sm:text-sm font-bold text-slate-800">
              Course Thumbnail
            </label>

            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-100/80 text-xs">
              <button
                type="button"
                onClick={() => setThumbnailTab('active')}
                className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  thumbnailTab === 'active'
                    ? 'bg-[#162544] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Active Asset
              </button>
              <button
                type="button"
                onClick={() => setThumbnailTab('dropzone')}
                className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  thumbnailTab === 'dropzone'
                    ? 'bg-[#162544] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Empty Dropzone
              </button>
            </div>
          </div>

          {thumbnailTab === 'active' ? (
            /* Active Asset Preview Card (Image 3) */
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
              <div className="flex items-center gap-4">
                {/* 16:9 Thumbnail Image */}
                <div className="relative w-28 h-18 rounded-lg overflow-hidden border border-slate-300 shadow-sm bg-slate-900 flex-shrink-0">
                  <img
                    src={thumbnailUrl}
                    alt="Course Preview"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-bold text-white tracking-wider">
                    16:9 HD
                  </span>
                </div>

                {/* File Details */}
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>{fileName}</span>
                    <span className="text-slate-400 text-xs font-normal">({fileSize})</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Uploaded today at 09:42 EST by Academic Registry
                  </div>
                  
                  <div className="flex items-center gap-3 mt-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
                      <span>Upload complete</span>
                    </span>

                    <label className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer">
                      Replace Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => setThumbnailTab('dropzone')}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
                title="Remove asset"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Empty Dropzone Card */
            <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-8 text-center transition-all bg-slate-50/40 hover:bg-blue-50/20 cursor-pointer relative animate-fadeIn group">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-11 h-11 rounded-full bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-colors">
                  <UploadCloud className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="text-sm font-semibold text-slate-700">
                  <span className="text-blue-600 group-hover:underline">Click to upload</span> or drag and drop
                </div>
                <p className="text-xs text-slate-400">
                  SVG, PNG, JPG or WebP (max. 1920x1080px, 16:9 ratio recommended)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Publish Status Toggle matching Image 3 */}
        <div className="p-4 rounded-xl bg-slate-50/60 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPublished(!isPublished)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                isPublished ? 'bg-[#162544]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isPublished ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">
                  Publish this course
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isPublished
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-normal">
                Students can only see published courses in their academic portal.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <Eye className="w-4 h-4 text-slate-500" />
            <span>Public Enrollment</span>
          </div>
        </div>

        {/* Form Action Buttons matching Image 3 */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSubmit('Draft')}
              className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              Save as Draft
            </button>

            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSubmit('Published')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#162544] hover:bg-[#111e3b] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Save Course</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* ISO/IEC 27001 Cryptographic Compliance Notice (Image 3) */}
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-3 text-xs text-blue-900 leading-relaxed shadow-sm">
        <Info className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
        <p>
          <span className="font-bold">Accreditation Standard ISO/IEC 27001 compliant:</span> All curricular updates, syllabi records, and attached cohort assets are cryptographically logged with an immutable timestamp attributed to the signing credential of the Dean of Academics.
        </p>
      </div>

    </div>
  );
}
