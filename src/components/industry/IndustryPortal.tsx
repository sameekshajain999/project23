import React, { useState } from 'react';
import {
  Users,
  Briefcase,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  Building,
  GraduationCap,
  Award,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { KanbanCandidate, JobPosting } from '../../types';
import { PostOpportunityModal } from './PostOpportunityModal';
import { useAuth } from '../../context/AuthContext';

interface IndustryPortalProps {
  candidates: KanbanCandidate[];
  onUpdateCandidateStage: (candidateId: string, newStage: KanbanCandidate['stage']) => void;
  onPostNewOpportunity: (newJob: JobPosting) => void;
}

export const IndustryPortal: React.FC<IndustryPortalProps> = ({
  candidates,
  onUpdateCandidateStage,
  onPostNewOpportunity,
}) => {
  const { requireAuth } = useAuth();
  const [activeTab, setActiveTab] = useState<'pipeline' | 'search'>('pipeline');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<KanbanCandidate | null>(null);

  const handleOpenPostModal = () => {
    if (!requireAuth('Please sign in as an Industry Recruiter to post new internships and research positions', 'industry')) {
      return;
    }
    setIsPostModalOpen(true);
  };

  const handleSelectCandidate = (candidate: KanbanCandidate) => {
    if (!requireAuth('Please sign in as an Industry Recruiter to review candidate clinical dossiers and schedule interviews', 'industry')) {
      return;
    }
    setSelectedCandidate(candidate);
  };

  // Candidate Search Engine Filters
  const [searchCompetency, setSearchCompetency] = useState('All');
  const [searchTier, setSearchTier] = useState('All');
  const [minCgpa, setMinCgpa] = useState<number>(7.5);
  const [minMatch, setMinMatch] = useState<number>(80);

  const stages: Array<KanbanCandidate['stage']> = [
    'Applied',
    'Shortlisted',
    'Technical Interview',
    'Offer Dispatched',
  ];

  const stageColors = {
    Applied: 'border-slate-300 bg-slate-50/70 text-slate-800',
    Shortlisted: 'border-blue-300 bg-blue-50/50 text-blue-900',
    'Technical Interview': 'border-amber-300 bg-amber-50/50 text-amber-900',
    'Offer Dispatched': 'border-emerald-300 bg-emerald-50/50 text-emerald-900',
  };

  // Filtered list for the search engine
  const searchedCandidates = candidates.filter((c) => {
    const matchesComp =
      searchCompetency === 'All' ||
      c.clinicalCertifications.some((cert) => cert.includes(searchCompetency));

    const isNationalInstitute =
      c.institute.includes('All India Institute') ||
      c.institute.includes('National Institute') ||
      c.institute.includes('ITRA') ||
      c.institute.includes('BHU');

    const matchesTier =
      searchTier === 'All' ||
      (searchTier === 'National' && isNationalInstitute) ||
      (searchTier === 'State' && !isNationalInstitute);

    const matchesCgpa = c.cgpa >= minCgpa;
    const matchesScore = c.matchScore >= minMatch;

    return matchesComp && matchesTier && matchesCgpa && matchesScore;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner / Metrics */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black text-slate-900 font-serif">
                  Industry Recruiter & R&D Talent Portal
                </h2>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  Dabur & Himalaya Consortium
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Targeted talent acquisition verified by AIIA clinical standards and pharmacopoeial credentials.
              </p>
            </div>
          </div>

          <button
            id="industry-post-opportunity-btn"
            onClick={handleOpenPostModal}
            className="flex items-center space-x-2 px-4 py-2.5 bg-[#1B4D3E] hover:bg-[#153e32] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-900/10 shrink-0 self-start md:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Internship / Fellowship</span>
          </button>
        </div>

        {/* 4 Metric KPI Blocks */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 block">
              Active AYUSH Openings
            </span>
            <span className="text-xl font-black text-slate-900 font-serif mt-1 block">8 Roles</span>
            <span className="text-[10px] text-emerald-700 font-semibold flex items-center mt-0.5">
              100% AIIA Accredited
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 block">
              Total Verified Applicants
            </span>
            <span className="text-xl font-black text-slate-900 font-serif mt-1 block">
              {candidates.length} Scholars
            </span>
            <span className="text-[10px] text-blue-700 font-semibold flex items-center mt-0.5">
              Across 5 National Institutes
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 block">
              Avg Candidate Match Fit
            </span>
            <span className="text-xl font-black text-emerald-800 font-serif mt-1 block">89.4%</span>
            <span className="text-[10px] text-emerald-700 font-semibold flex items-center mt-0.5">
              +14% vs Keyword matching
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 block">
              Interview to Offer Rate
            </span>
            <span className="text-xl font-black text-amber-800 font-serif mt-1 block">68%</span>
            <span className="text-[10px] text-amber-700 font-semibold flex items-center mt-0.5">
              Streamlined via Skill Passport
            </span>
          </div>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          id="tab-talent-pipeline-btn"
          onClick={() => setActiveTab('pipeline')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'pipeline'
              ? 'bg-[#1B4D3E] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Talent Pipeline (Kanban Tracker)</span>
        </button>

        <button
          id="tab-candidate-search-btn"
          onClick={() => setActiveTab('search')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'search'
              ? 'bg-[#1B4D3E] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Candidate Search Engine (Competency-Based)</span>
        </button>
      </div>

      {/* TAB 1: KANBAN PIPELINE */}
      {activeTab === 'pipeline' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stages.map((stage) => {
            const stageCandidates = candidates.filter((c) => c.stage === stage);
            return (
              <div
                key={stage}
                id={`kanban-column-${stage.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-full"
              >
                {/* Column Header */}
                <div
                  className={`p-3.5 border-b rounded-t-2xl flex items-center justify-between ${stageColors[stage]}`}
                >
                  <span className="font-bold text-xs">{stage}</span>
                  <span className="w-5 h-5 rounded-full bg-white/90 text-slate-800 text-[11px] font-mono font-bold flex items-center justify-center shadow-2xs">
                    {stageCandidates.length}
                  </span>
                </div>

                {/* Candidate Cards in this Stage */}
                <div className="p-3 space-y-3 flex-1 min-h-[350px] bg-slate-50/40">
                  {stageCandidates.length === 0 ? (
                    <div className="h-32 flex items-center justify-center text-[11px] text-slate-400 border border-dashed border-slate-200 rounded-xl">
                      No candidates in {stage}
                    </div>
                  ) : (
                    stageCandidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        id={`applicant-card-${candidate.id}`}
                        onClick={() => handleSelectCandidate(candidate)}
                        className="p-3 bg-white rounded-xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer space-y-2 text-xs"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <img
                              src={candidate.avatar}
                              alt={candidate.name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <p className="font-bold text-slate-900 leading-tight">
                                {candidate.name}
                              </p>
                              <p className="text-[10px] text-slate-500 truncate max-w-[120px]">
                                {candidate.institute}
                              </p>
                            </div>
                          </div>
                          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            {candidate.matchScore}%
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-600 font-medium bg-slate-50 p-1.5 rounded">
                          Applied: {candidate.appliedRole}
                        </div>

                        {/* Badges preview */}
                        <div className="flex flex-wrap gap-1">
                          {candidate.clinicalCertifications.slice(0, 2).map((cert) => (
                            <span
                              key={cert}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-100 font-medium truncate max-w-[130px]"
                            >
                              {cert}
                            </span>
                          ))}
                        </div>

                        {/* Stage Mover Selector */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                          <span className="text-slate-400">Move stage:</span>
                          <select
                            value={candidate.stage}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              onUpdateCandidateStage(
                                candidate.id,
                                e.target.value as KanbanCandidate['stage']
                              )
                            }
                            className="bg-slate-100 text-slate-700 rounded px-1.5 py-0.5 border border-slate-200 text-[10px] font-medium focus:outline-hidden"
                          >
                            {stages.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: CANDIDATE SEARCH ENGINE */}
      {activeTab === 'search' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div>
            <h3 className="text-base font-black text-slate-900 font-serif">
              Competency-Driven Candidate Search Engine
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Filter candidates strictly by verified clinical procedures, college tier, and validated skill index rather than resume keywords.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Verified Ayush Competency
              </label>
              <select
                value={searchCompetency}
                onChange={(e) => setSearchCompetency(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg bg-white"
              >
                <option value="All">All Competencies</option>
                <option value="GCP">Good Clinical Practice (GCP-AYUSH)</option>
                <option value="Schedule T">Schedule T (ASU GMP & QA)</option>
                <option value="HPTLC">Phytochemical HPTLC Extraction</option>
                <option value="NABH">NABH Ayush Hospital Protocol</option>
                <option value="PvPI">Pharmacovigilance PvPI</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Institute Tier</label>
              <select
                value={searchTier}
                onChange={(e) => setSearchTier(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg bg-white"
              >
                <option value="All">All Institutes</option>
                <option value="National">National Institutes (AIIA, NIA, ITRA, BHU)</option>
                <option value="State">State Government Ayurvedic Colleges</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Min CGPA</span>
                <span className="text-emerald-800">{minCgpa}</span>
              </div>
              <input
                type="range"
                min={7.0}
                max={9.5}
                step={0.1}
                value={minCgpa}
                onChange={(e) => setMinCgpa(Number(e.target.value))}
                className="w-full accent-emerald-700"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Min Skill Fit %</span>
                <span className="text-emerald-800">{minMatch}%</span>
              </div>
              <input
                type="range"
                min={70}
                max={95}
                step={1}
                value={minMatch}
                onChange={(e) => setMinMatch(Number(e.target.value))}
                className="w-full accent-emerald-700"
              />
            </div>
          </div>

          {/* Search Results List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>Matching Verified Talents: {searchedCandidates.length}</span>
              <span className="text-emerald-800">AIIA Electronic Verification Active</span>
            </div>

            {searchedCandidates.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-emerald-400 bg-white transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start space-x-3.5">
                  <img
                    src={c.avatar}
                    alt={c.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-sm text-slate-900">{c.name}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {c.matchScore}% Skill Fit
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">
                      {c.degree} • {c.institute}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {c.clinicalCertifications.map((cert) => (
                        <span
                          key={cert}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
                  <div className="text-right hidden sm:block">
                    <span className="text-[11px] text-slate-400 block">Current Stage</span>
                    <span className="text-xs font-bold text-slate-800">{c.stage}</span>
                  </div>
                  <button
                    onClick={() => handleSelectCandidate(c)}
                    className="px-3.5 py-2 bg-[#1B4D3E] hover:bg-[#153e32] text-white rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    Review Passport
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Candidate Profile Drawer / Modal */}
      {selectedCandidate && (
        <div
          id="candidate-detail-modal-backdrop"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedCandidate(null)}
        >
          <div
            id="candidate-detail-modal"
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-sm text-slate-900 font-serif">
                  AIIA Verified Candidate Dossier
                </h3>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center space-x-3.5">
              <img
                src={selectedCandidate.avatar}
                alt={selectedCandidate.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-600 shadow-sm"
              />
              <div>
                <h4 className="text-base font-black text-slate-900 font-serif">
                  {selectedCandidate.name}
                </h4>
                <p className="text-xs text-slate-600 font-medium">{selectedCandidate.degree}</p>
                <p className="text-[11px] text-slate-400">{selectedCandidate.institute}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">CGPA:</span>
                <span className="font-bold text-slate-800">{selectedCandidate.cgpa} / 10.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Target Role:</span>
                <span className="font-bold text-emerald-900">{selectedCandidate.appliedRole}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Skill Match Score:</span>
                <span className="font-bold text-emerald-700">{selectedCandidate.matchScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Recruitment Pipeline Stage:</span>
                <span className="font-bold text-amber-800">{selectedCandidate.stage}</span>
              </div>
            </div>

            <div>
              <h5 className="font-bold text-slate-700 mb-1.5">Preceptor Evaluator Notes:</h5>
              <p className="text-slate-600 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-200/80 leading-relaxed italic">
                "{selectedCandidate.notes}"
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end space-x-2">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-3 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onUpdateCandidateStage(selectedCandidate.id, 'Offer Dispatched');
                  setSelectedCandidate(null);
                }}
                className="px-4 py-2 bg-[#1B4D3E] hover:bg-[#153e32] text-white rounded-xl font-bold flex items-center space-x-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch Official Offer</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Opportunity Wizard */}
      <PostOpportunityModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onPostSuccess={onPostNewOpportunity}
      />
    </div>
  );
};
