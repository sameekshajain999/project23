import React, { useState, useEffect } from 'react';
import { Search, Briefcase, GraduationCap, Award, BookOpen, X, ArrowRight } from 'lucide-react';
import { INITIAL_JOB_POSTINGS, SKILL_GAP_DATA, KANBAN_APPLICANTS, MOU_COLLABORATIONS } from '../../data/mockData';
import { UserRole } from '../../types';

interface CommandSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: UserRole) => void;
  onSelectJob?: (jobId: string) => void;
}

export const CommandSearchModal: React.FC<CommandSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectRole,
  onSelectJob,
}) => {
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener for Cmd+K / Ctrl+K & Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Parent handles opening if triggered globally
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  const filteredJobs = INITIAL_JOB_POSTINGS.filter(
    (j) =>
      !normalizedQuery ||
      j.title.toLowerCase().includes(normalizedQuery) ||
      j.organization.toLowerCase().includes(normalizedQuery) ||
      j.requiredSkills.some((s) => s.toLowerCase().includes(normalizedQuery))
  ).slice(0, 3);

  const filteredSkills = SKILL_GAP_DATA.filter(
    (s) =>
      !normalizedQuery ||
      s.skill.toLowerCase().includes(normalizedQuery) ||
      s.category.toLowerCase().includes(normalizedQuery)
  ).slice(0, 3);

  const filteredCandidates = KANBAN_APPLICANTS.filter(
    (c) =>
      !normalizedQuery ||
      c.name.toLowerCase().includes(normalizedQuery) ||
      c.institute.toLowerCase().includes(normalizedQuery) ||
      c.appliedRole.toLowerCase().includes(normalizedQuery)
  ).slice(0, 3);

  const filteredMous = MOU_COLLABORATIONS.filter(
    (m) =>
      !normalizedQuery ||
      m.industryPartner.toLowerCase().includes(normalizedQuery) ||
      m.focusArea.toLowerCase().includes(normalizedQuery)
  ).slice(0, 2);

  return (
    <div
      id="command-search-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-16 px-4"
      onClick={onClose}
    >
      <div
        id="command-search-dialog"
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 bg-slate-50">
          <Search className="w-5 h-5 text-emerald-700 mr-3 shrink-0" />
          <input
            id="command-search-input"
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search internships, clinical skills, candidate badges, or MoUs..."
            className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded mr-2"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4 text-xs">
          {/* Opportunities Section */}
          {filteredJobs.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                <span className="flex items-center">
                  <Briefcase className="w-3.5 h-3.5 mr-1 text-emerald-700" />
                  Internships & Positions
                </span>
                <span>{filteredJobs.length} Results</span>
              </div>
              <div className="space-y-1.5">
                {filteredJobs.map((job) => (
                  <button
                    key={job.id}
                    onClick={() => {
                      onSelectRole('student');
                      if (onSelectJob) onSelectJob(job.id);
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-lg border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50 flex items-center justify-between transition-colors group"
                  >
                    <div>
                      <p className="font-bold text-slate-900 group-hover:text-emerald-900">
                        {job.title}
                      </p>
                      <p className="text-slate-500 text-[11px]">
                        {job.organization} • {job.location}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">
                        {job.matchScore}% Match
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Clinical Skills Section */}
          {filteredSkills.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                <span className="flex items-center">
                  <Award className="w-3.5 h-3.5 mr-1 text-amber-700" />
                  Ayush Clinical & Industry Competencies
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredSkills.map((skill) => (
                  <button
                    key={skill.skill}
                    onClick={() => {
                      onSelectRole('student');
                      onClose();
                    }}
                    className="text-left p-2.5 rounded-lg border border-slate-100 hover:border-amber-200 hover:bg-amber-50/40 transition-colors"
                  >
                    <p className="font-bold text-slate-800 text-xs">{skill.skill}</p>
                    <div className="flex items-center justify-between mt-1 text-[11px]">
                      <span className="text-slate-500">{skill.category}</span>
                      <span className="text-amber-800 font-semibold">
                        Req: {skill.industryBenchmark}%
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Verified Candidates Section */}
          {filteredCandidates.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                <span className="flex items-center">
                  <GraduationCap className="w-3.5 h-3.5 mr-1 text-blue-700" />
                  Verified Student Talents
                </span>
              </div>
              <div className="space-y-1.5">
                {filteredCandidates.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectRole('industry');
                      onClose();
                    }}
                    className="w-full text-left p-2 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center space-x-2.5">
                      <img
                        src={c.avatar}
                        alt={c.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-bold text-slate-800 text-xs">{c.name}</p>
                        <p className="text-[11px] text-slate-500">{c.institute}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
                      CGPA {c.cgpa}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active MoUs Section */}
          {filteredMous.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                <span className="flex items-center">
                  <BookOpen className="w-3.5 h-3.5 mr-1 text-purple-700" />
                  Industry-Institute MoUs
                </span>
              </div>
              <div className="space-y-1.5">
                {filteredMous.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onSelectRole('faculty');
                      onClose();
                    }}
                    className="w-full text-left p-2 rounded-lg border border-slate-100 hover:border-purple-200 hover:bg-purple-50/40 transition-colors"
                  >
                    <p className="font-bold text-slate-800 text-xs">{m.title}</p>
                    <p className="text-[11px] text-slate-500">
                      {m.industryPartner} ↔ {m.academicPartner} ({m.budgetAllocated})
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-100/70 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center space-x-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[10px]">
                ESC
              </kbd>{' '}
              to close
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[10px]">
                ↵
              </kbd>{' '}
              to select
            </span>
          </div>
          <span className="text-emerald-700 font-semibold">
            AyushSetu National Data Hub
          </span>
        </div>
      </div>
    </div>
  );
};
