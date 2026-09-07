import React, { useState } from 'react';
import {
  Briefcase,
  MapPin,
  Clock,
  Search,
  Filter,
  Bookmark,
  BookmarkCheck,
  CheckCircle,
  Building,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  IndianRupee,
} from 'lucide-react';
import { JobPosting } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { useAuth } from '../../context/AuthContext';

interface OpportunityBoardProps {
  opportunities: JobPosting[];
  onSelectOpportunity: (opportunity: JobPosting) => void;
}

export const OpportunityBoard: React.FC<OpportunityBoardProps> = ({
  opportunities,
  onSelectOpportunity,
}) => {
  const { requireAuth } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  type RoleTypeFilter = 'All' | 'Internship' | 'Fellowship' | 'Full-time';
  const [selectedRoleType, setSelectedRoleType] = useState<RoleTypeFilter>('All');
  const [selectedOrgType, setSelectedOrgType] = useState('All');
  const [selectedWorkMode, setSelectedWorkMode] = useState('All');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(
    opportunities.filter((o) => o.isBookmarked).map((o) => o.id)
  );

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const rolePillFilters: { id: RoleTypeFilter; label: string; count: number }[] = [
    { id: 'All', label: 'All', count: opportunities.length },
    {
      id: 'Internship',
      label: 'Internships',
      count: opportunities.filter((o) => o.type === 'Internship').length,
    },
    {
      id: 'Fellowship',
      label: 'Fellowships',
      count: opportunities.filter((o) => o.type === 'Fellowship').length,
    },
    {
      id: 'Full-time',
      label: 'Full-Time Placements',
      count: opportunities.filter((o) => o.type === 'Full-time').length,
    },
  ];

  const orgTypes = [
    'All',
    'Herbal Pharmaceutical',
    'Clinical CRO',
    'NABH Ayurvedic Hospital',
    'Ayur-Tech Startup',
    'National Research Institute',
  ];

  const workModes = ['All', 'On-site', 'Hybrid', 'Remote'];

  const filteredList = opportunities.filter((item) => {
    const matchesQuery =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.requiredSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRoleType = selectedRoleType === 'All' || item.type === selectedRoleType;
    const matchesOrg = selectedOrgType === 'All' || item.orgType === selectedOrgType;
    const matchesMode = selectedWorkMode === 'All' || item.workMode === selectedWorkMode;

    return matchesQuery && matchesRoleType && matchesOrg && matchesMode;
  });

  return (
    <div
      id="opportunity-board-section"
      className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-5"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-black text-slate-900 font-serif">
              National Opportunity Marketplace
            </h3>
            <span className="text-[10px] font-bold bg-[#1B4D3E]/10 text-[#1B4D3E] border border-[#1B4D3E]/20 px-2 py-0.5 rounded-full">
              Verified AYUSH Sector Openings
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Industry capstones, R&D fellowships, and clinical residencies curated for accredited BAMS and MD scholars.
          </p>
        </div>

        {/* Quick count indicator */}
        <div className="text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          Showing <span className="font-bold text-emerald-800">{filteredList.length}</span> verified postings
        </div>
      </div>

      {/* Quick Role Type Pill Filters directly above search bar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-600 mr-1 flex items-center">
          <Filter className="w-3.5 h-3.5 mr-1 text-[#1B4D3E]" />
          Role Type:
        </span>
        <div className="inline-flex flex-wrap gap-2">
          {rolePillFilters.map((pill) => {
            const isActive = selectedRoleType === pill.id;
            return (
              <button
                key={pill.id}
                id={`filter-pill-${pill.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => setSelectedRoleType(pill.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#1B4D3E] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80'
                }`}
              >
                <span>{pill.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-semibold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {pill.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search */}
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="opportunity-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by role, company, or clinical skill (e.g. Schedule T, HPTLC, GCP)..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
          />
        </div>

        {/* Org Type Select */}
        <div className="md:col-span-3">
          <select
            id="filter-org-type-select"
            value={selectedOrgType}
            onChange={(e) => setSelectedOrgType(e.target.value)}
            className="w-full py-2 px-3 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
          >
            {orgTypes.map((type) => (
              <option key={type} value={type}>
                {type === 'All' ? 'All Organization Types' : type}
              </option>
            ))}
          </select>
        </div>

        {/* Work Mode Select */}
        <div className="md:col-span-3">
          <select
            id="filter-work-mode-select"
            value={selectedWorkMode}
            onChange={(e) => setSelectedWorkMode(e.target.value)}
            className="w-full py-2 px-3 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
          >
            {workModes.map((mode) => (
              <option key={mode} value={mode}>
                {mode === 'All' ? 'All Work Modes' : mode}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Opportunity Cards List */}
      <div className="space-y-3">
        {filteredList.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No opportunities match the criteria</p>
            <p className="text-xs text-slate-500 mt-1">Try resetting filters or searching for another clinical keyword.</p>
          </div>
        ) : (
          filteredList.map((opp) => {
            const isBookmarked = bookmarkedIds.includes(opp.id);
            const isTopMatch = opp.matchScore >= 90;

            return (
              <div
                key={opp.id}
                id={`opportunity-card-${opp.id}`}
                onClick={() => onSelectOpportunity(opp)}
                className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md relative ${
                  isTopMatch
                    ? 'border-emerald-200 bg-gradient-to-r from-emerald-50/30 via-white to-white hover:border-emerald-400'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  {/* Left Role Info */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900 font-serif hover:text-emerald-800 transition-colors">
                        {opp.title}
                      </h4>
                      {/* Match Percentage Pill Badge */}
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold inline-flex items-center space-x-1 ${
                          opp.matchScore >= 90
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : opp.matchScore >= 80
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <Sparkles className="w-3 h-3 mr-0.5" />
                        <span>{opp.matchScore}% Skill Fit</span>
                      </span>

                      {opp.verifiedGovtPartner && (
                        <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-semibold flex items-center">
                          <ShieldCheck className="w-3 h-3 mr-0.5" />
                          AIIA MoU Partner
                        </span>
                      )}
                    </div>

                    {/* Organization and meta */}
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600 font-medium">
                      <span className="flex items-center text-slate-900 font-semibold">
                        <Building className="w-3.5 h-3.5 mr-1 text-slate-500" />
                        {opp.organization}
                      </span>
                      <span className="flex items-center text-slate-500">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {opp.location} ({opp.workMode})
                      </span>
                      <span className="flex items-center text-emerald-900 font-bold">
                        <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
                        {opp.stipend}
                      </span>
                      <span className="flex items-center text-slate-500">
                        <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        Deadline: {opp.deadline}
                      </span>
                    </div>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mr-1">
                        Syllabus Tags:
                      </span>
                      {opp.requiredSkills.map((skill) => (
                        <span
                          key={skill}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center space-x-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <button
                      id={`bookmark-btn-${opp.id}`}
                      onClick={(e) => toggleBookmark(opp.id, e)}
                      className={`p-2 rounded-lg border transition-colors ${
                        isBookmarked
                          ? 'border-amber-300 bg-amber-50 text-amber-600'
                          : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                      }`}
                      title={isBookmarked ? 'Bookmarked' : 'Save opportunity'}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      id={`apply-view-btn-${opp.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!requireAuth('Please sign in or register to apply for this opportunity', 'student')) {
                          return;
                        }
                        onSelectOpportunity(opp);
                      }}
                      className="px-3.5 py-2 bg-[#1B4D3E] hover:bg-[#153e32] text-white rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center space-x-1.5 cursor-pointer"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
