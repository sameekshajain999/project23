import React, { useState } from 'react';
import {
  X,
  Briefcase,
  Building,
  MapPin,
  Clock,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Send,
  FileCheck,
} from 'lucide-react';
import { JobPosting, StudentProfile } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface OpportunityDetailModalProps {
  opportunity: JobPosting | null;
  student: StudentProfile;
  onClose: () => void;
  onApplySuccess?: (jobId: string) => void;
}

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  opportunity,
  student,
  onClose,
  onApplySuccess,
}) => {
  const { requireAuth, submitApplication } = useAuth();
  const [hasApplied, setHasApplied] = useState(opportunity?.applied || false);
  const [submitting, setSubmitting] = useState(false);

  if (!opportunity) return null;

  const handleApply = async () => {
    // Gate Application: Require authenticated student
    if (!requireAuth('Please sign in or register to submit your verified internship application', 'student')) {
      return;
    }

    setSubmitting(true);
    try {
      await submitApplication(
        opportunity.id,
        opportunity.title,
        opportunity.organization,
        opportunity.matchScore,
        opportunity.stipend,
        opportunity.location,
        opportunity.workMode
      );
      setHasApplied(true);
      if (onApplySuccess) onApplySuccess(opportunity.id);
    } catch (err) {
      console.error('Failed to submit application:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      id="opportunity-detail-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="opportunity-detail-modal"
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-[#1B4D3E] to-[#059669] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-200 mb-1">
            <Building className="w-4 h-4" />
            <span>{opportunity.organization}</span>
            <span>•</span>
            <span className="text-amber-300">{opportunity.orgType}</span>
          </div>

          <h3 className="text-xl font-black font-serif leading-snug">
            {opportunity.title}
          </h3>

          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-3 text-xs text-emerald-100">
            <span className="flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1" />
              {opportunity.location} ({opportunity.workMode})
            </span>
            <span className="flex items-center font-bold text-amber-300">
              <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
              {opportunity.stipend}
            </span>
            <span className="flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1" />
              {opportunity.duration}
            </span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 text-xs max-h-[65vh] overflow-y-auto">
          {/* Match Score & Skill Comparison Bar */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-base font-serif shadow-xs">
                {opportunity.matchScore}%
              </div>
              <div>
                <p className="font-bold text-emerald-950 text-sm">
                  High Fit for {student.name}
                </p>
                <p className="text-emerald-800 text-[11px]">
                  Based on your verified AIIA syllabus and clinical residency logbook.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-emerald-900 bg-white px-3 py-1.5 rounded-lg border border-emerald-200 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>AIIA Verified Candidate</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1.5 text-slate-500">
              Opportunity Description
            </h4>
            <p className="text-slate-700 leading-relaxed text-xs">
              {opportunity.description}
            </p>
          </div>

          {/* Core Responsibilities */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 text-slate-500">
              Key Responsibilities
            </h4>
            <ul className="space-y-1.5">
              {opportunity.responsibilities.map((resp, i) => (
                <li key={i} className="flex items-start space-x-2 text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Required Competencies & Student Match */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 text-slate-500">
              Required Ayush Competencies & Student Status
            </h4>
            <div className="space-y-1.5">
              {opportunity.requiredSkills.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200"
                >
                  <span className="font-semibold text-slate-800">{skill}</span>
                  <span className="inline-flex items-center text-[11px] text-emerald-700 font-bold bg-emerald-100/70 px-2 py-0.5 rounded">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    Verified in Logbook
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Eligibility */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-1">Eligibility Criteria</h4>
            <p className="text-slate-600 leading-relaxed">{opportunity.eligibility}</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-100/80 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[11px] text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Applications close: {opportunity.deadline}</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-3.5 py-2 border border-slate-300 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors"
            >
              Cancel
            </button>

            <button
              id="submit-skill-passport-application-btn"
              onClick={handleApply}
              disabled={hasApplied || submitting}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shadow-md ${
                hasApplied
                  ? 'bg-emerald-700 text-white cursor-default'
                  : submitting
                  ? 'bg-emerald-800 text-white opacity-80'
                  : 'bg-[#1B4D3E] hover:bg-[#143d31] text-white'
              }`}
            >
              {hasApplied ? (
                <>
                  <FileCheck className="w-4 h-4 text-emerald-200" />
                  <span>Applied with AyushSetu Passport</span>
                </>
              ) : submitting ? (
                <span>Transmitting Credentials...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>1-Click Apply with Digital Passport</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
