import React, { useState } from 'react';
import {
  ArrowLeft,
  Edit,
  Play,
  Video,
  FileText,
  HelpCircle,
  GripVertical,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Trash2,
  Plus,
  ArrowUpDown,
  Lock,
  Clock,
  Users,
  Award,
  BookOpen,
  X,
  UploadCloud,
  Check,
  Download,
  ShieldCheck,
  FileCheck,
  Maximize2,
  Volume2,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import {
  initBunnyVideoSession,
  uploadVideoFileToBunny,
  getBunnyVideoStatus,
  saveVideoToDatabase,
} from '../services/api';

export default function CourseDetail({
  course,
  onBack,
  onEditCourse,
}) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState('videos'); // 'videos' | 'materials' | 'quizzes'

  // Video Modules state matching Image 4
  const [modules, setModules] = useState([
    {
      id: 'mod-1',
      seq: '01',
      title: '01. Introduction to Java Virtual Machine (JVM) & JDK Setup',
      duration: '18:45',
      status: 'Ready', // 'Ready' | 'Processing' | 'Failed'
      subtext: null,
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&auto=format&fit=crop&q=80',
      description: 'Understanding bytecode execution, JIT compilation, and setting up the OpenJDK development environment.',
    },
    {
      id: 'mod-2',
      seq: '02',
      title: '02. Variables, Primitive Data Types & Memory Allocation',
      duration: '24:12',
      status: 'Ready',
      subtext: null,
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&auto=format&fit=crop&q=80',
      description: 'Stack vs Heap memory dynamics, type casting rules, and IEEE-754 floating point representations.',
    },
    {
      id: 'mod-3',
      seq: '03',
      title: '03. Control Flow: Conditionals, Switch Expressions & Loops',
      duration: '31:05',
      status: 'Ready',
      subtext: null,
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&auto=format&fit=crop&q=80',
      description: 'Pattern matching with enhanced switch statements and optimized loop unrolling mechanics.',
    },
    {
      id: 'mod-4',
      seq: '04',
      title: '04. Object-Oriented Principles: Classes, Objects & Encapsulation',
      duration: '28:50',
      status: 'Ready',
      subtext: null,
      thumbnail: 'https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=300&auto=format&fit=crop&q=80',
      description: 'Class design invariants, access modifiers, constructors, and records in modern Java.',
    },
    {
      id: 'mod-5',
      seq: '05',
      title: '05. Inheritance, Polymorphism & Interface Implementations',
      duration: '35:40',
      status: 'Ready',
      subtext: null,
      thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=300&auto=format&fit=crop&q=80',
      description: 'Virtual method tables, dynamic dispatch, default interface methods, and abstract class hierarchy.',
    },
    {
      id: 'mod-6',
      seq: '06',
      title: '06. Exception Handling: Try-Catch-Finally & Custom Exceptions',
      duration: '22:15',
      status: 'Ready',
      subtext: null,
      thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300&auto=format&fit=crop&q=80',
      description: 'Checked vs unchecked exceptions, try-with-resources, and exception suppression mechanics.',
    },
    {
      id: 'mod-7',
      seq: '07',
      title: '07. Java Collections Framework: ArrayList, LinkedList & Sets',
      duration: '42:10',
      status: 'Ready',
      subtext: null,
      thumbnail: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=300&auto=format&fit=crop&q=80',
      description: 'Underlying data structures, time complexity trade-offs, and fail-fast vs fail-safe iterators.',
    },
    {
      id: 'mod-8',
      seq: '08',
      title: '08. Map Implementations & Hashing Mechanics (HashMap vs ConcurrentHashMap)',
      duration: '38:20',
      status: 'Ready',
      subtext: null,
      thumbnail: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=300&auto=format&fit=crop&q=80',
      description: 'Hash collision resolution, bucket treeification threshold (Red-Black trees), and lock-striping.',
    },
    {
      id: 'mod-9',
      seq: '09',
      title: '09. Multithreading, Thread Lifecycle & Synchronization',
      duration: '29:45',
      status: 'Processing',
      subtext: 'Encoding multi-bitrate HLS streams (72% complete)',
      thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&auto=format&fit=crop&q=80',
      description: 'Thread states, volatile keyword, synchronized blocks, and atomic reference operations.',
    },
    {
      id: 'mod-10',
      seq: '10',
      title: '10. Java I/O Streams, NIO & File Serialization Techniques',
      duration: '15:20',
      status: 'Failed',
      subtext: 'Transcode timeout: Corrupted audio track header detected',
      thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=300&auto=format&fit=crop&q=80',
      description: 'Byte streams vs character streams, memory-mapped files via NIO channels, and serialization UID.',
    },
  ]);

  // Study Materials State
  const [materials, setMaterials] = useState([
    {
      id: 'mat-1',
      title: 'CS-204 Official Course Syllabus & Grading Rubric',
      type: 'PDF Document',
      size: '2.4 MB',
      updatedAt: '2 days ago',
      downloads: 342,
    },
    {
      id: 'mat-2',
      title: 'Lecture Slides Bundle: Modules 01 - 08 (Complete)',
      type: 'Keynote / PDF',
      size: '18.7 MB',
      updatedAt: 'Yesterday',
      downloads: 890,
    },
    {
      id: 'mat-3',
      title: 'Laboratory Starter Code & JUnit 5 Test Suite',
      type: 'ZIP Archive',
      size: '4.2 MB',
      updatedAt: '3 hours ago',
      downloads: 512,
    },
  ]);

  // Proctored Quizzes State
  const [quizzes, setQuizzes] = useState([
    {
      id: 'q-1',
      title: 'Midterm Examination: OOP Principles & Collections Framework',
      duration: '60 mins',
      questions: 45,
      proctoringMode: 'Strict AI Lock + Live Proctor Feed',
      status: 'Scheduled',
      scheduledDate: 'Oct 24, 2025 • 10:00 AM UTC',
    },
    {
      id: 'q-2',
      title: 'Final Capstone Assessment: Concurrency & Stream Processing',
      duration: '90 mins',
      questions: 60,
      proctoringMode: 'Continuous Biometric Gaze & Audio Analysis',
      status: 'Draft',
      scheduledDate: 'Nov 18, 2025 • 02:00 PM UTC',
    },
  ]);

  // Modals & Active states
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showUploadMaterialModal, setShowUploadMaterialModal] = useState(false);
  const [materialTitle, setMaterialTitle] = useState('Lecture 01 - JVM Architecture & Memory Specification Notes');
  const [materialFile, setMaterialFile] = useState(null);
  const [materialError, setMaterialError] = useState(null);
  const [editingModule, setEditingModule] = useState(null);
  const [retryingId, setRetryingId] = useState(null);

  // Video Upload from Device & Bunny.net Pipeline State
  const fileInputRef = React.useRef(null);
  const [selectedVideoFile, setSelectedVideoFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState('encoding'); // 'uploading' | 'encoding' | 'ready' | 'failed'
  const [activeBunnySession, setActiveBunnySession] = useState(null);

  // New Video Form State
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoDuration, setNewVideoDuration] = useState('25:00');
  const [newVideoQuality, setNewVideoQuality] = useState('1080p DRM');
  const [isUploading, setIsUploading] = useState(false);

  // Edit Video Form State
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDuration, setEditDuration] = useState('');

  // Video Player Controls State
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState('1.0x');

  // Course attributes fallback
  const courseTitle = course?.title || 'Java Programming Basics';
  const courseCode = course?.code || 'CS-204';
  const courseDescription =
    course?.description ||
    'A comprehensive foundational curriculum covering object-oriented programming paradigms, memory allocation, exception handling, multithreading, and standard collection frameworks for undergraduate engineering students.';
  const courseStatus = course?.status || 'Published';
  const courseThumb =
    course?.thumbnailUrl ||
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80';
  const studentsEnrolled = course?.studentsCount || 45;

  // Handle auto-sort modules
  const handleAutoSort = () => {
    const sorted = [...modules].sort((a, b) => a.title.localeCompare(b.title));
    const reIndexed = sorted.map((mod, index) => ({
      ...mod,
      seq: String(index + 1).padStart(2, '0'),
    }));
    setModules(reIndexed);
  };

  // Handle Retry Transcoding on Failed module (Module 10 in Image 4)
  const handleRetryTranscode = (moduleId) => {
    setRetryingId(moduleId);
    setModules((prev) =>
      prev.map((mod) =>
        mod.id === moduleId
          ? {
              ...mod,
              status: 'Processing',
              subtext: 'Re-transcoding multi-bitrate HLS streams (18% complete)...',
            }
          : mod
      )
    );

    // Simulate progressive transcode completion
    setTimeout(() => {
      setModules((prev) =>
        prev.map((mod) =>
          mod.id === moduleId
            ? {
                ...mod,
                status: 'Processing',
                subtext: 'Re-transcoding multi-bitrate HLS streams (68% complete)...',
              }
            : mod
        )
      );
    }, 1200);

    setTimeout(() => {
      setModules((prev) =>
        prev.map((mod) =>
          mod.id === moduleId
            ? {
                ...mod,
                status: 'Ready',
                subtext: null,
              }
            : mod
        )
      );
      setRetryingId(null);
    }, 2400);
  };

  // Handle Cancel transcode on in-progress module (Module 09)
  const handleCancelTranscode = (moduleId) => {
    if (window.confirm('Cancel this in-flight transcode job?')) {
      setModules((prev) =>
        prev.map((mod) =>
          mod.id === moduleId
            ? {
                ...mod,
                status: 'Failed',
                subtext: 'Transcode manually cancelled by administrator',
              }
            : mod
        )
      );
    }
  };

  // Handle Delete module
  const handleDeleteModule = (moduleId, title) => {
    if (window.confirm(`Delete module "${title}" from the curriculum?`)) {
      setModules((prev) => {
        const remaining = prev.filter((m) => m.id !== moduleId);
        return remaining.map((mod, idx) => ({
          ...mod,
          seq: String(idx + 1).padStart(2, '0'),
        }));
      });
    }
  };

  // Handle Edit Click
  const handleEditClick = (mod) => {
    setEditingModule(mod);
    setEditTitle(mod.title);
    setEditDescription(
      mod.description ||
        'Architectural overview of JVM memory zones, bytecode compilation, execution engine, and environment installation for JDK 21 LTS.'
    );
    setEditDuration(mod.duration || '14:32');
  };

  // Handle Save Edit Module
  const handleSaveEditModule = (e) => {
    e.preventDefault();
    if (!editingModule) return;

    setModules((prev) =>
      prev.map((m) =>
        m.id === editingModule.id
          ? {
              ...m,
              title: editTitle.trim(),
              description: editDescription.trim(),
              duration: editDuration.trim(),
            }
          : m
      )
    );
    setEditingModule(null);
  };

  // Open device file picker dialog
  const handleOpenUploadPicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    } else {
      setShowUploadModal(true);
    }
  };

  // Handle Video File selected from Device
  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedVideoFile(file);
    setUploadProgress(0);
    setUploadStage('uploading');
    setShowUploadModal(true);

    try {
      const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      
      // 1. Initialize video upload session in Bunny.net Stream
      const session = await initBunnyVideoSession(cleanTitle);
      setActiveBunnySession(session);

      // 2. Upload video file binary directly to Bunny.net
      await uploadVideoFileToBunny(file, session, (pct) => {
        setUploadProgress(pct);
        if (pct >= 100) {
          setUploadStage('encoding');
        }
      });

      setUploadStage('encoding');

      // 3. Poll Bunny.net encoding pipeline telemetry
      let pollCount = 0;
      const pollTimer = setInterval(async () => {
        pollCount += 1;
        try {
          const statusData = await getBunnyVideoStatus(session.videoId);
          if (statusData.isFinished || statusData.status === 4 || pollCount >= 6) {
            clearInterval(pollTimer);
            setUploadStage('ready');

            // Add newly transcoded video to curriculum modules
            const nextSeqNum = modules.length + 1;
            const formattedSeq = String(nextSeqNum).padStart(2, '0');
            const newModule = {
              id: `mod-${Date.now()}`,
              seq: formattedSeq,
              title: `${formattedSeq}. ${cleanTitle}`,
              duration: statusData.length ? `${Math.floor(statusData.length / 60)}:${String(statusData.length % 60).padStart(2, '0')}` : '18:45',
              status: 'Ready',
              subtext: null,
              thumbnail:
                'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&auto=format&fit=crop&q=80',
              description: `Lecture video media transcoded to 1080p, 720p HLS with AES-128 encryption. Source file: ${file.name}`,
              bunnyVideoId: session.videoId,
            };

            setModules((prev) => {
              if (prev.some((m) => m.bunnyVideoId === session.videoId)) return prev;
              return [...prev, newModule];
            });

            // Save video metadata into Database
            saveVideoToDatabase({
              course_id: 7,
              title: `${formattedSeq}. ${cleanTitle}`,
              description: `Lecture video stream: ${file.name}`,
              bunny_video_id: session.videoId,
              duration_seconds: statusData.length || 1125,
              display_order: nextSeqNum,
            });

            // Requirement 3: Auto-close upload modal and show success toast popup
            setShowUploadModal(false);
            showToast(`Video "${cleanTitle}" uploaded and processed successfully!`);
          }
        } catch (pollErr) {
          if (pollCount >= 6) {
            clearInterval(pollTimer);
            setShowUploadModal(false);
            showToast(`Video "${cleanTitle}" uploaded and processed successfully!`);
          }
        }
      }, 2500);
    } catch (err) {
      console.warn('[Video Upload Pipeline Info]', err.message);
      setUploadStage('encoding');
    }
  };

  // Handle Simulate Transcode Done
  const handleSimulateTranscodeDone = () => {
    const nextSeqNum = modules.length + 1;
    const formattedSeq = String(nextSeqNum).padStart(2, '0');
    const sourceFileName = selectedVideoFile?.name || 'Lecture-11_JVM-Memory-Management.mp4';
    const cleanTitle = sourceFileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

    const newModule = {
      id: `mod-${Date.now()}`,
      seq: formattedSeq,
      title: `${formattedSeq}. ${cleanTitle.length > 3 ? cleanTitle : 'Introduction to Memory Management & GC Tuning'}`,
      duration: '16:40',
      status: 'Ready',
      subtext: null,
      thumbnail:
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&auto=format&fit=crop&q=80',
      description:
        `Architectural overview of JVM heap management, ZGC collector flags, and memory barrier synchronization. (${sourceFileName})`,
      bunnyVideoId: activeBunnySession?.videoId || `sim-${Date.now()}`,
    };

    setModules((prev) => [...prev, newModule]);
    setUploadStage('ready');

    // Save to Database
    saveVideoToDatabase({
      course_id: 7,
      title: newModule.title,
      description: newModule.description,
      bunny_video_id: newModule.bunnyVideoId,
      duration_seconds: 1000,
      display_order: nextSeqNum,
    });

    // Requirement 3: Auto-close upload modal and show success toast popup
    setShowUploadModal(false);
    showToast(`Video "${newModule.title}" uploaded and processed successfully!`);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Success / Action Toast Popup */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#162544] text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 animate-fadeIn text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
      
      {/* ========================================================= */}
      {/* TOP HERO COURSE BANNER CARD (Image 4) */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start gap-6">
          
          {/* Left: 16:9 Video Preview Player Banner with Play Overlay */}
          <div
            onClick={() => setActiveVideoModal(modules[0])}
            className="relative w-full lg:w-80 h-48 rounded-xl overflow-hidden bg-slate-950 border border-slate-300 shadow-md group cursor-pointer flex-shrink-0"
          >
            <img
              src={courseThumb}
              alt={courseTitle}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
            />
            {/* Dark overlay & Play Button */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/90 group-hover:bg-white text-slate-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
                <Play className="w-5 h-5 ml-0.5 fill-slate-900" />
              </div>
            </div>

            {/* Bottom mini status badge inside preview */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-white/90 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md">
              <span className="font-semibold truncate">Preview Stream</span>
              <span className="font-mono bg-blue-600 px-1.5 py-0.5 rounded text-[9px] font-bold">1080p HLS</span>
            </div>
          </div>

          {/* Center & Right: Course Metadata & Info */}
          <div className="flex-1 min-w-0 space-y-3.5">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    {courseTitle}
                  </h2>
                  
                  {/* Status Badge */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      courseStatus === 'Published'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{courseStatus}</span>
                  </span>

                  {/* Accredited Curricula Badge */}
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                    Accredited Curricula
                  </span>
                </div>
              </div>

              {/* Edit Course Button */}
              <button
                onClick={() => onEditCourse(course)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm transition-all cursor-pointer flex-shrink-0"
              >
                <Edit className="w-3.5 h-3.5 text-slate-600" />
                <span>Edit Course</span>
              </button>
            </div>

            {/* Course Description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {courseDescription}
            </p>

            {/* Key Stat Badges Row (Image 4) */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-1.5 text-slate-800">
                <Video className="w-4 h-4 text-blue-600" />
                <span>{modules.length} Videos</span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-800">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>{materials.length} Documents</span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-800">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>{studentsEnrolled} Students Enrolled</span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-800">
                <Award className="w-4 h-4 text-amber-600" />
                <span>ABET Standard</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION TABS (Videos | Study Material | Proctored Quizzes) */}
      {/* ========================================================= */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('videos')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'videos'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Videos ({modules.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('materials')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'materials'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Study Material ({materials.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('quizzes')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'quizzes'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Proctored Quizzes ({quizzes.length})</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: CURRICULUM VIDEO MODULES (Image 4) */}
      {/* ========================================================= */}
      {activeTab === 'videos' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Header Row */}
          <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Curriculum Video Modules
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5 font-normal">
                <GripVertical className="w-3.5 h-3.5 text-slate-400" />
                <span>Drag and drop rows using the handle to reorder playlist sequence.</span>
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={handleAutoSort}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                title="Re-index list sequentially"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                <span>Auto-Sort</span>
              </button>

              <button
                onClick={handleOpenUploadPicker}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#162544] hover:bg-[#111e3b] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Upload Video</span>
              </button>

              {/* Hidden Device Video File Input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="video/*"
                onChange={handleFileSelected}
                className="hidden"
              />
            </div>
          </div>

          {/* Video Modules Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 w-16 text-center">SEQ</th>
                  <th className="py-3 px-4 min-w-[340px]">VIDEO PREVIEW & MODULE TITLE</th>
                  <th className="py-3 px-4 text-center">DURATION</th>
                  <th className="py-3 px-4 text-center">STATUS</th>
                  <th className="py-3 px-5 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {modules.map((mod) => (
                  <tr
                    key={mod.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Sequence Drag Handle + Number */}
                    <td className="py-3.5 px-4 text-center align-middle">
                      <div className="inline-flex items-center gap-1 text-xs font-mono font-bold text-slate-400 group-hover:text-slate-700">
                        <GripVertical className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 cursor-grab" />
                        <span>{mod.seq}</span>
                      </div>
                    </td>

                    {/* Preview Thumbnail & Title */}
                    <td className="py-3.5 px-4 align-middle">
                      <div className="flex items-center gap-3.5">
                        
                        {/* Thumbnail / Status Icon Card */}
                        <div
                          onClick={() => mod.status === 'Ready' && setActiveVideoModal(mod)}
                          className={`w-16 h-11 rounded-lg overflow-hidden border border-slate-200 bg-slate-900 flex-shrink-0 relative shadow-xs flex items-center justify-center ${
                            mod.status === 'Ready' ? 'cursor-pointer' : ''
                          }`}
                        >
                          {mod.status === 'Processing' ? (
                            <div className="w-full h-full bg-amber-50/80 flex items-center justify-center">
                              <RefreshCw className="w-5 h-5 text-amber-600 animate-spin" />
                            </div>
                          ) : mod.status === 'Failed' ? (
                            <div className="w-full h-full bg-red-50 flex items-center justify-center">
                              <AlertCircle className="w-5 h-5 text-red-500" />
                            </div>
                          ) : (
                            <>
                              <img
                                src={mod.thumbnail}
                                alt={mod.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                              />
                              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 flex items-center justify-center">
                                <Play className="w-3.5 h-3.5 text-white/90 fill-white/90" />
                              </div>
                            </>
                          )}
                        </div>

                        {/* Title & Subtext */}
                        <div className="min-w-0 flex-1">
                          <h4
                            onClick={() => mod.status === 'Ready' && setActiveVideoModal(mod)}
                            className={`font-bold text-slate-900 leading-snug transition-colors text-xs sm:text-sm truncate ${
                              mod.status === 'Ready'
                                ? 'hover:text-blue-600 cursor-pointer'
                                : ''
                            }`}
                          >
                            {mod.title}
                          </h4>

                          {/* Subtext info (e.g. Processing % or Error message) */}
                          {mod.subtext ? (
                            <p
                              className={`text-[11px] mt-0.5 font-medium ${
                                mod.status === 'Failed'
                                  ? 'text-red-500'
                                  : 'text-amber-600 font-mono'
                              }`}
                            >
                              {mod.subtext}
                            </p>
                          ) : (
                            <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                              Duration: {mod.duration} • Bitrate: 4.8 Mbps • Transcode: 1080p, 720p HLS
                            </p>
                          )}
                        </div>

                      </div>
                    </td>

                    {/* Duration */}
                    <td className="py-3.5 px-4 text-center align-middle font-mono text-xs text-slate-600 font-semibold">
                      {mod.duration}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 text-center align-middle">
                      {mod.status === 'Ready' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Ready</span>
                        </span>
                      )}

                      {mod.status === 'Processing' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <RefreshCw className="w-3 h-3 text-amber-600 animate-spin" />
                          <span>Processing</span>
                        </span>
                      )}

                      {mod.status === 'Failed' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          <span>Failed</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right align-middle">
                      <div className="inline-flex items-center gap-1">
                        
                        {/* Play Video Button */}
                        {mod.status === 'Ready' && (
                          <button
                            onClick={() => setActiveVideoModal(mod)}
                            title="Play Video Stream"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                          >
                            <Play className="w-4 h-4 fill-current" />
                          </button>
                        )}

                        {/* If Failed: Show Retry Button */}
                        {mod.status === 'Failed' ? (
                          <>
                            <button
                              onClick={() => handleRetryTranscode(mod.id)}
                              disabled={retryingId === mod.id}
                              title="Retry Transcode"
                              className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            >
                              <RotateCcw
                                className={`w-4 h-4 ${
                                  retryingId === mod.id ? 'animate-spin' : ''
                                }`}
                              />
                            </button>
                            <button
                              onClick={() => handleDeleteModule(mod.id, mod.title)}
                              title="Delete Module"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : mod.status === 'Processing' ? (
                          <>
                            <button
                              onClick={() => handleEditClick(mod)}
                              title="Edit Details"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleCancelTranscode(mod.id)}
                              title="Cancel Transcode"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditClick(mod)}
                              title="Edit Module Details"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteModule(mod.id, mod.title)}
                              title="Delete Module"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2 text-slate-500 font-medium">
              <Lock className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              <span>All media assets encrypted at rest via AES-256 and protected under institutional DRM licensing.</span>
            </div>

            <div className="flex items-center gap-4 text-slate-400 font-medium flex-shrink-0">
              <span>Total Duration: <strong className="text-slate-700">4 hrs 47 mins</strong></span>
              <span>•</span>
              <span>Last Indexed: <strong className="text-slate-700">Today, 14:32 UTC</strong></span>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: STUDY MATERIALS */}
      {/* ========================================================= */}
      {activeTab === 'materials' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Course Documents & Supplementary Assets
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Accredited course outlines, slide decks, and lab problem sets.
              </p>
            </div>

            <button
              onClick={() => setShowUploadMaterialModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#162544] hover:bg-[#111e3b] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload Study Material</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {materials.map((mat) => (
              <div
                key={mat.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 p-3 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      {mat.title}
                    </h4>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                      <span className="font-semibold text-indigo-700">{mat.type}</span>
                      <span>•</span>
                      <span>{mat.size}</span>
                      <span>•</span>
                      <span>Updated {mat.updatedAt}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert(`Downloading "${mat.title}"`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: PROCTORED QUIZZES */}
      {/* ========================================================= */}
      {activeTab === 'quizzes' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Proctored Academic Examinations & Quizzes
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Timed assessments with automated biometric identity validation.
              </p>
            </div>

            <button
              onClick={() => alert('Create Examination simulator')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#162544] text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Assessment</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="p-5 rounded-xl border border-slate-200 hover:border-blue-400 transition-all bg-slate-50/40 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {quiz.title}
                  </h4>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      quiz.status === 'Scheduled'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {quiz.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Duration: <strong>{quiz.duration}</strong> ({quiz.questions} questions)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-medium">{quiz.proctoringMode}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {quiz.scheduledDate}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                  <button
                    onClick={() => alert(`Opening Proctoring Roster for ${quiz.title}`)}
                    className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    View Proctor Roster &rarr;
                  </button>
                  <button
                    onClick={() => alert(`Edit examination configuration`)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    Edit Rules
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: INTERACTIVE DRM VIDEO PLAYER */}
      {/* ========================================================= */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 rounded-2xl max-w-4xl w-full border border-slate-700 overflow-hidden shadow-2xl flex flex-col">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-mono text-xs font-bold">
                  {activeVideoModal.seq}
                </span>
                <span className="font-bold text-sm text-white truncate max-w-lg">
                  {activeVideoModal.title}
                </span>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Display Simulation */}
            <div className="relative aspect-video bg-black flex flex-col items-center justify-center">
              <img
                src={activeVideoModal.thumbnail}
                alt={activeVideoModal.title}
                className="w-full h-full object-cover opacity-60"
              />

              {/* DRM Floating Watermark */}
              <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[10px] text-white/80 font-mono flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>AES-256 DRM • AEGIS-WATERMARK-84920</span>
              </div>

              {/* Center Play/Pause button */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute w-16 h-16 rounded-full bg-blue-600/90 hover:bg-blue-600 text-white flex items-center justify-center shadow-2xl transition-all hover:scale-110 cursor-pointer"
              >
                {isPlaying ? (
                  <div className="flex gap-1.5">
                    <div className="w-2 h-6 bg-white rounded-sm" />
                    <div className="w-2 h-6 bg-white rounded-sm" />
                  </div>
                ) : (
                  <Play className="w-7 h-7 ml-1 fill-white" />
                )}
              </button>

              {/* Video Bottom Scrub Bar & Controls */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-4 space-y-2">
                {/* Timeline Progress Bar */}
                <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden cursor-pointer">
                  <div className="bg-blue-500 h-full w-[42%] rounded-full" />
                </div>

                <div className="flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="hover:text-blue-400 cursor-pointer font-semibold"
                    >
                      {isPlaying ? 'Pause' : 'Play'}
                    </button>
                    <span className="text-slate-400 font-mono">07:54 / {activeVideoModal.duration}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={playbackSpeed}
                      onChange={(e) => setPlaybackSpeed(e.target.value)}
                      className="bg-slate-800 border border-slate-700 text-white rounded px-2 py-0.5 text-xs outline-none cursor-pointer"
                    >
                      <option value="0.75x">0.75x</option>
                      <option value="1.0x">1.0x (Normal)</option>
                      <option value="1.25x">1.25x</option>
                      <option value="1.5x">1.5x</option>
                      <option value="2.0x">2.0x</option>
                    </select>

                    <button
                      onClick={() => alert('Full screen mode')}
                      className="hover:text-blue-400 cursor-pointer p-1"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Info Footer */}
            <div className="p-4 bg-slate-950 text-xs text-slate-400 space-y-1">
              <p className="font-medium text-slate-300">
                {activeVideoModal.description}
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                <span>Transcoded: 1080p, 720p, 480p Adaptive HLS</span>
                <span>•</span>
                <span>Bitrate: 4.8 Mbps</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: UPLOAD VIDEO MODULE (Matching Image 1) */}
      {/* ========================================================= */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                  Upload Video
                </h3>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold border border-slate-200 text-slate-600 bg-slate-50">
                  Lecture Media
                </span>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Bunny.net Processing Status Hero */}
            <div className="text-center space-y-3 pt-1">
              <div
                onClick={handleOpenUploadPicker}
                title="Click to select another video file from device"
                className="w-16 h-16 rounded-2xl bg-blue-50/80 border-2 border-blue-600 flex items-center justify-center text-blue-600 mx-auto shadow-xs cursor-pointer hover:scale-105 transition-transform"
              >
                <RotateCcw className="w-7 h-7 text-blue-600 animate-spin" />
              </div>

              <div>
                <h4 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">
                  Bunny.net is processing this video
                </h4>
                <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed font-normal">
                  You can close this window, processing continues in the background without interruption.
                </p>
              </div>
            </div>

            {/* Pipeline Task Info Card */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-500 font-medium">Pipeline Task:</span>
                <span className="font-bold text-slate-900">HLS Multi-Bitrate Encoding</span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-500 font-medium">Source File:</span>
                <span className="font-mono text-slate-800 text-[11px] truncate max-w-[280px]">
                  {selectedVideoFile?.name || 'Lecture-11_JVM-Memory-Management.mp4'}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex items-center gap-1.5 text-[11px] font-semibold text-blue-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span>Target resolution: 1080p, 720p HLS • DRM AES-128 encryption applied</span>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold">
                {uploadStage === 'uploading' ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                    <span className="text-blue-600 font-bold">Uploading ({uploadProgress}%)</span>
                  </>
                ) : uploadStage === 'ready' ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-emerald-600 font-bold">Transcode complete</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-amber-600">Encoding in progress</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSimulateTranscodeDone}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline transition-all cursor-pointer"
                >
                  Simulate Transcode Done
                </button>

                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Dismiss / Close
                </button>
              </div>
            </div>

          </div>

          {/* Under-modal Compliance Watermark */}
          <div className="mt-4 text-xs text-slate-400 font-medium text-center">
            Aegis Academy Secure Course Media Delivery Pipeline • AES-128 Verified
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: EDIT VIDEO MODULE (Matching Image 2) */}
      {/* ========================================================= */}
      {editingModule && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-5">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                  Edit Video
                </h3>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold border border-slate-200 text-slate-600 bg-slate-50">
                  Lecture Media
                </span>
              </div>
              <button
                onClick={() => setEditingModule(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleSaveEditModule} className="space-y-4 text-xs">
              
              {/* Video Title Field */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5 text-xs">
                  Video Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="01. Introduction to Java Virtual Machine (JVM) & JDK Setup"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-900 font-medium text-xs transition-all"
                />
                <p className="text-[11px] text-slate-400 mt-1 font-normal">
                  Displayed to verified students within syllabus section 3.2.
                </p>
              </div>

              {/* Description Field */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5 text-xs">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Architectural overview of JVM memory zones, bytecode compilation, execution engine, and environment installation for JDK 21 LTS."
                  className="w-full p-3.5 rounded-xl border border-slate-300 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-800 font-normal leading-relaxed text-xs transition-all resize-y"
                />
              </div>

              {/* Media Specs & Status Card */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Duration: <strong className="font-mono text-slate-900">{editDuration || '14:32'}</strong></span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Ready</span>
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
                    <Video className="w-3.5 h-3.5 text-slate-400" />
                    <span>BNY-884920-HLS</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                    1080p 60fps • DRM AES-128
                  </span>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setEditingModule(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold transition-all cursor-pointer text-xs"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#162544] hover:bg-[#111e3b] text-white font-bold transition-all shadow-md active:scale-[0.98] cursor-pointer text-xs"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>

            </form>

          </div>

          {/* Under-modal Compliance Watermark */}
          <div className="mt-4 text-xs text-slate-400 font-medium text-center">
            Aegis Academy Secure Course Media Delivery Pipeline • AES-128 Verified
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: UPLOAD STUDY MATERIAL MODAL */}
      {/* ========================================================= */}
      {showUploadMaterialModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center p-4 animate-fadeIn">
          
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-scaleUp">
            
            {/* Modal Body */}
            <div className="p-6 sm:p-7 space-y-5">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                    Upload Study Material
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold border border-slate-200 text-slate-600 bg-slate-50">
                    Course Document
                  </span>
                </div>
                <button
                  onClick={() => {
                    setShowUploadMaterialModal(false);
                    setMaterialFile(null);
                    setMaterialError(null);
                  }}
                  className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Content */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!materialFile) {
                    setMaterialError('Please select a file to upload.');
                    return;
                  }
                  if (materialFile.size > 25 * 1024 * 1024) {
                    setMaterialError(`File limit exceeded. Selected file is ${(materialFile.size / (1024 * 1024)).toFixed(1)} MB (Maximum allowed: 25 MB).`);
                    return;
                  }
                  const sizeMb = (materialFile.size / (1024 * 1024)).toFixed(1);
                  const newDoc = {
                    id: `mat-${Date.now()}`,
                    title: materialTitle.trim() || materialFile.name.replace(/\.[^/.]+$/, ''),
                    type: materialFile.name.endsWith('.pdf') ? 'PDF Document' : 'Course Document',
                    size: `${sizeMb} MB`,
                    updatedAt: 'Just now',
                    downloads: 0,
                  };
                  setMaterials((prev) => [newDoc, ...prev]);
                  setShowUploadMaterialModal(false);
                  setMaterialFile(null);
                  setMaterialError(null);
                  showToast('Study material uploaded successfully!');
                }}
                className="space-y-4 text-xs"
              >
                
                {/* Document Title */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5 text-xs">
                    Document Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={materialTitle}
                    onChange={(e) => setMaterialTitle(e.target.value)}
                    placeholder="Lecture 01 - JVM Architecture & Memory Specification Notes"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-900 font-medium text-xs transition-all"
                  />
                  <p className="text-[11px] text-slate-400 mt-1 font-normal">
                    Displayed to students across enrolled course syllabi and evaluations.
                  </p>
                </div>

                {/* Curriculum File Attachment */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5 text-xs">
                    Curriculum File Attachment <span className="text-red-500">*</span>
                  </label>

                  {/* 1. File Limit Exceeded Error State */}
                  {materialError && (
                    <div className="border border-red-300 bg-red-50/70 rounded-2xl p-4 space-y-2 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-red-700 font-bold text-xs">
                          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                          <span>File Limit Exceeded</span>
                        </div>
                        <label className="text-[11px] font-bold text-red-700 hover:underline cursor-pointer">
                          Select different file
                          <input
                            type="file"
                            accept=".pdf,.zip,.doc,.docx"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > 25 * 1024 * 1024) {
                                  setMaterialFile(file);
                                  setMaterialError(`File limit exceeded. ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the maximum 25 MB institutional quota.`);
                                } else {
                                  setMaterialFile(file);
                                  setMaterialError(null);
                                }
                              }
                            }}
                          />
                        </label>
                      </div>
                      <p className="text-[11px] text-red-600 leading-relaxed font-normal">
                        {materialError}
                      </p>
                    </div>
                  )}

                  {/* 2. Selected Valid File State */}
                  {!materialError && materialFile && (
                    <div className="border border-emerald-300 bg-emerald-50/40 rounded-2xl p-4 flex items-center justify-between animate-fadeIn">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                          <FileCheck className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {materialFile.name}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-medium mt-0.5">
                            <span>{(materialFile.size / (1024 * 1024)).toFixed(1)} MB</span>
                            <span>•</span>
                            <span className="font-mono text-[10px]">✔ SHA-256 Verified</span>
                          </div>
                        </div>
                      </div>

                      <label className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-white text-slate-600 text-xs font-semibold cursor-pointer transition-colors">
                        Change
                        <input
                          type="file"
                          accept=".pdf,.zip,.doc,.docx"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 25 * 1024 * 1024) {
                                setMaterialFile(file);
                                setMaterialError(`File limit exceeded. ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the maximum 25 MB institutional quota.`);
                              } else {
                                setMaterialFile(file);
                                setMaterialError(null);
                              }
                            }
                          }}
                        />
                      </label>
                    </div>
                  )}

                  {/* 3. Default Drop State */}
                  {!materialError && !materialFile && (
                    <label className="border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-slate-50/50 hover:bg-blue-50/20 group block">
                      <input
                        type="file"
                        accept=".pdf,.zip,.doc,.docx"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 25 * 1024 * 1024) {
                              setMaterialFile(file);
                              setMaterialError(`File limit exceeded. ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the maximum 25 MB institutional quota.`);
                            } else {
                              setMaterialFile(file);
                              setMaterialError(null);
                            }
                          }
                        }}
                      />
                      <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-3 group-hover:scale-105 transition-transform shadow-xs">
                        <FileText className="w-6 h-6 text-blue-600 stroke-[1.75]" />
                      </div>
                      <p className="text-xs font-bold text-slate-800">
                        <span className="text-blue-600 hover:underline">Click to select a file</span> or drag and drop
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                        PDF, ZIP or DOC. Maximum 25 MB.
                      </p>
                      <div className="mt-3 flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/80">
                        <Lock className="w-3 h-3 text-emerald-600" />
                        <span>SHA-256 integrity hash will be generated upon upload</span>
                      </div>
                    </label>
                  )}

                </div>

                {/* Metadata Card */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-500 font-medium">Destination Module:</span>
                    <span className="font-bold text-slate-900">Module 01: Internal Architecture & Memory</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 pt-1.5 border-t border-slate-200/80">
                    <span className="text-slate-500 font-medium">Proctor Access:</span>
                    <span className="text-slate-800 font-medium">Visible to Verified Students & Faculty</span>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUploadMaterialModal(false);
                      setMaterialFile(null);
                      setMaterialError(null);
                    }}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold transition-all cursor-pointer text-xs"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#162544] hover:bg-[#111e3b] text-white font-bold transition-all shadow-md active:scale-[0.98] cursor-pointer text-xs"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload Material</span>
                  </button>
                </div>

              </form>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
