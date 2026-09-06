import React, { useState, useRef } from 'react';
import {
  Award,
  Download,
  Upload,
  Share2,
  CheckCircle2,
  Building,
  Calendar,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  FileCheck,
} from 'lucide-react';
import { StudentProfile } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { useAuth } from '../../context/AuthContext';

interface StudentHeroProps {
  student: StudentProfile;
}

export const StudentHero: React.FC<StudentHeroProps> = ({ student }) => {
  const { requireAuth, uploadResume, user } = useAuth();
  const [selectedBadge, setSelectedBadge] = useState<any | null>(null);
  const [passportDownloaded, setPassportDownloaded] = useState(false);
  const [resumeUploadedName, setResumeUploadedName] = useState<string | null>(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadPassport = () => {
    setPassportDownloaded(true);
    setTimeout(() => setPassportDownloaded(false), 3000);
  };

  const handleResumeButtonClick = () => {
    if (!requireAuth('Please sign in as a Student to upload and verify your resume with the Ministry repository', 'student')) {
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingResume(true);
    try {
      await uploadResume(file.name);
      setResumeUploadedName(file.name);
      setTimeout(() => setResumeUploadedName(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingResume(false);
    }
  };

  return (
    <div
      id="student-hero-banner"
      className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden"
    >
      {/* Top Banner accent */}
      <div className="h-20 sm:h-24 bg-gradient-to-r from-[#1B4D3E] via-[#059669] to-[#047857] relative px-5 py-3 flex items-start justify-between text-white">
        <div className="flex items-center space-x-2 text-xs font-semibold bg-black/20 backdrop-blur-xs px-3 py-1 rounded-full border border-white/20">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
          <span>National Ayush Skill Registry • ID: {student.enrollmentNo}</span>
        </div>
        <div className="hidden sm:flex items-center space-x-2">
          <span className="text-xs bg-white/10 px-2.5 py-0.5 rounded-md text-emerald-100 border border-white/10">
            AIIA Sarita Vihar Campus
          </span>
        </div>
      </div>

      {/* Main Profile Row */}
      <div className="px-5 pb-5 pt-0 relative">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-4 -mt-10 sm:-mt-12 mb-3">
          {/* Avatar and Details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3.5">
            <div className="relative">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-3 border-white object-cover shadow-md"
              />
              <span
                className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-white"
                title="Verified Student Identity"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="space-y-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
                  {student.name}
                </h2>
                <StatusBadge type="verified" label="Verified by AIIA" size="sm" />
                <span className="text-xs bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded border border-slate-200">
                  CGPA {student.cgpa}
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-emerald-900">
                {student.program}
              </p>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 font-medium">
                <span className="flex items-center">
                  <Building className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {student.institute}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {student.yearOfStudy}
                </span>
              </div>
            </div>
          </div>

          {/* Right Metrics: Career Match Index & Actions */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full lg:w-auto">
            {/* Career Match Gauge Card */}
            <div
              id="career-match-score-card"
              className="flex items-center p-2.5 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 shadow-xs"
            >
              <div className="relative flex items-center justify-center mr-2.5">
                <div className="w-11 h-11 rounded-full border-3 border-emerald-200 border-t-emerald-700 flex items-center justify-center font-black text-base text-emerald-950 font-serif">
                  {student.careerMatchScore}%
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-bold text-emerald-900">Career Match Index</span>
                  <TrendingUp className="w-3 h-3 text-emerald-700" />
                </div>
                <p className="text-[10px] text-emerald-700 font-medium">
                  Top 5% across Herbal R&D & Clinical CROs
                </p>
              </div>
            </div>

            {/* Hidden File Input for Resume */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileSelected}
              className="hidden"
            />

            {/* Resume Upload Action (Auth-Gated) */}
            <button
              id="upload-student-resume-btn"
              onClick={handleResumeButtonClick}
              disabled={uploadingResume}
              className={`flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer border ${
                resumeUploadedName
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-2xs'
              }`}
              title="Upload verified resume & clinical credentials"
            >
              {uploadingResume ? (
                <span>Syncing Resume...</span>
              ) : resumeUploadedName ? (
                <>
                  <FileCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Resume Synced!</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  <span>Upload Resume</span>
                </>
              )}
            </button>

            {/* Passport Download Action */}
            <button
              id="download-skill-passport-btn"
              onClick={handleDownloadPassport}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-3.5 py-2.5 bg-[#1B4D3E] hover:bg-[#153e32] text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-900/10 transition-all active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>
                {passportDownloaded ? 'Passport Verified & Downloaded!' : 'Ayush Digital Passport'}
              </span>
            </button>
          </div>
        </div>

        {/* Verified Badges Row */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center">
              <Award className="w-4 h-4 mr-1.5 text-amber-600" />
              Verified Digital Competency Badges (Tamper-Proof)
            </span>
            <span className="text-[11px] text-slate-400">
              Click badge to view cryptographic validation
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            {student.badges.map((badge) => (
              <button
                key={badge.id}
                id={`badge-card-${badge.id}`}
                onClick={() => setSelectedBadge(badge)}
                className="text-left p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50/50 hover:border-emerald-300 transition-all flex items-start space-x-2.5 group"
              >
                <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs text-emerald-700 group-hover:text-emerald-800 shrink-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-emerald-900">
                    {badge.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 truncate">{badge.issuer}</p>
                  <span className="text-[9px] font-mono text-emerald-700 font-semibold mt-0.5 block">
                    {badge.verificationCode}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cryptographic Badge Modal */}
      {selectedBadge && (
        <div
          id="badge-verification-modal-backdrop"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedBadge(null)}
        >
          <div
            id="badge-verification-modal"
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900 font-serif">
                  AIIA Digital Credential Verifier
                </h3>
              </div>
              <button
                onClick={() => setSelectedBadge(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-center py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-2 text-emerald-700">
                <Award className="w-8 h-8" />
              </div>
              <h4 className="text-base font-black text-slate-900">{selectedBadge.title}</h4>
              <p className="text-xs text-slate-500 mt-0.5">Issued by {selectedBadge.issuer}</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Student:</span>
                <span className="font-bold text-slate-800">{student.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Issued On:</span>
                <span className="font-semibold text-slate-700">{selectedBadge.issuedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Certificate Hash:</span>
                <span className="font-mono text-emerald-700 font-bold">
                  {selectedBadge.verificationCode}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">National Registry Status:</span>
                <span className="text-emerald-700 font-bold flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Active & Verified
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors"
            >
              Close Verifier
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
