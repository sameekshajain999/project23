import React, { useState } from 'react';
import { StudentProfile, SkillGapItem, UpskillingRecommendation, JobPosting, LogbookEntry } from '../../types';
import { StudentHero } from './StudentHero';
import { SkillGapVisualizer } from './SkillGapVisualizer';
import { DynamicRoadmap } from './DynamicRoadmap';
import { OpportunityBoard } from './OpportunityBoard';
import { DailyLogbook } from './DailyLogbook';
import { OpportunityDetailModal } from './OpportunityDetailModal';
import { BookAppointmentModal } from './BookAppointmentModal';
import {
  Sparkles,
  Compass,
  Award,
  Briefcase,
  FileText,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Users,
  ChevronRight,
  ExternalLink,
  Calendar,
  CalendarCheck,
} from 'lucide-react';

interface StudentDashboardProps {
  student: StudentProfile;
  skills: SkillGapItem[];
  courses: UpskillingRecommendation[];
  opportunities: JobPosting[];
  logbookEntries: LogbookEntry[];
  onAddLogbookEntry: (entry: LogbookEntry) => void;
  onApplyOpportunity: (jobId: string) => void;
  selectedSection?: string;
  onSelectSection?: (section: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  skills,
  courses,
  opportunities,
  logbookEntries,
  onAddLogbookEntry,
  onApplyOpportunity,
  selectedSection = 'all',
  onSelectSection,
}) => {
  const [selectedOpportunity, setSelectedOpportunity] = useState<JobPosting | null>(null);
  const [isBookAppointmentOpen, setIsBookAppointmentOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'skills' | 'opportunities' | 'logbook'>(
    (selectedSection as any) || 'all'
  );
  const [engagementRegistered, setEngagementRegistered] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTabClick = (tab: 'all' | 'skills' | 'opportunities' | 'logbook') => {
    setActiveTab(tab);
    onSelectSection?.(tab);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* High Density Metric Cards (Exact Reference Pattern) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Career Match */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">
              Career Match
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              +2.4%
            </span>
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-bold text-[#1B4D3E] font-serif">
              {student.careerMatchScore || 88}%
            </div>
            <div className="text-[10px] text-slate-400 font-medium mt-0.5">
              Pharma & Clinical Research
            </div>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${student.careerMatchScore || 88}%` }}
            ></div>
          </div>
        </div>

        {/* Metric 2: Digital Badges */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">
              Digital Badges
            </span>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
              Tamper-proof
            </span>
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-800 font-serif">
              {student.badges.length || 12}
            </span>
            <span className="text-xs text-slate-500">Verified</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex -space-x-1.5 overflow-hidden">
              <div
                className="inline-block h-4 w-4 rounded-full ring-2 ring-white bg-emerald-600"
                title="AIIA Certified"
              ></div>
              <div
                className="inline-block h-4 w-4 rounded-full ring-2 ring-white bg-amber-500"
                title="AYUSH Protocol"
              ></div>
              <div
                className="inline-block h-4 w-4 rounded-full ring-2 ring-white bg-blue-500"
                title="Clinical GCP"
              ></div>
              <div
                className="inline-block h-4 w-4 rounded-full ring-2 ring-white bg-purple-500"
                title="Panchakarma Protocol"
              ></div>
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold">
              4 Cryptographic
            </span>
          </div>
        </div>

        {/* Metric 3: Verified Skills */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">
              Verified Skills
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              AIIA Aligned
            </span>
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-800 font-serif">
              34
            </span>
            <span className="text-xs text-slate-500">/ 40 Benchmark</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full w-[85%] rounded-full"></div>
          </div>
        </div>

        {/* Metric 4: Log Hours */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">
              Log Hours
            </span>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              Kayachikitsa
            </span>
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-800 font-serif">
              240h
            </span>
            <span className="text-xs text-slate-500">Completed</span>
          </div>
          <div className="text-[10px] text-slate-500 flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="truncate">Logbook verified by faculty</span>
          </div>
        </div>
      </div>

      {/* Student Hero & Verified Credentials */}
      <StudentHero student={student} />

      {/* High Density Promotional Announcement Banner + Faculty Mentorship Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Banner: Industry Engagement Week (Exact Reference) */}
        <div className="lg:col-span-8 bg-[#1B4D3E] rounded-xl p-5 sm:p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs relative overflow-hidden">
          <div className="max-w-md z-10">
            <div className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-emerald-300 bg-emerald-900/60 px-2.5 py-0.5 rounded-full border border-emerald-700/50 mb-2">
              <Calendar className="w-3 h-3" />
              National Academia-Industry Meet
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-1.5 leading-snug">
              Industry Engagement Week
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm mb-4 leading-relaxed">
              Connect with top Ayurvedic pharmaceutical CEOs and research heads from Dabur, Himalaya, and Patanjali. Networking sessions starting in 2 days.
            </p>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setEngagementRegistered(true)}
                className="bg-[#D97706] hover:bg-[#b46204] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md shadow-amber-900/20 transition-all cursor-pointer"
              >
                {engagementRegistered ? 'Registered Successfully ✓' : 'Register Now'}
              </button>
              <button
                onClick={() => scrollToSection('opportunity-board-section')}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all"
              >
                Explore Capstones
              </button>
            </div>
          </div>

          <div className="hidden sm:flex w-40 h-28 bg-emerald-800/40 rounded-xl items-center justify-center border border-emerald-700/50 shrink-0 p-3 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-black text-amber-300 font-serif">48+</div>
              <div className="text-[10px] uppercase tracking-wider text-emerald-200 font-semibold">
                Pharma Partners Active
              </div>
            </div>
          </div>
        </div>

        {/* Widget: Faculty Mentorship (Exact Reference) */}
        <div className="lg:col-span-4 bg-white rounded-xl shadow-xs border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 leading-tight">
                  Faculty Mentorship
                </div>
                <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
                  2 Active Consultations
                </div>
              </div>
            </div>
            <button
              onClick={() => scrollToSection('daily-logbook-section')}
              className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
              title="View Consultation Logs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">Assigned Guide:</span>
              <span className="font-semibold text-slate-800">Prof. R. Vashishta</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">Clinical Department:</span>
              <span className="font-medium text-slate-700">Kayachikitsa (AIIA)</span>
            </div>
            <button
              id="book-appointment-btn"
              onClick={() => setIsBookAppointmentOpen(true)}
              className="mt-2.5 w-full py-2 px-3 bg-[#1B4D3E] hover:bg-[#153e32] text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Navigation Anchor Bar */}
      <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200 shadow-2xs text-xs font-semibold overflow-x-auto">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => handleTabClick('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#1B4D3E] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Complete Profile View</span>
          </button>
          <button
            onClick={() => {
              handleTabClick('skills');
              scrollToSection('skill-gap-visualizer-card');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'skills'
                ? 'bg-[#1B4D3E] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Skill Mapping & Upskilling</span>
          </button>
          <button
            onClick={() => {
              handleTabClick('opportunities');
              scrollToSection('opportunity-board-section');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'opportunities'
                ? 'bg-[#1B4D3E] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Opportunity Board ({opportunities.length})</span>
          </button>
          <button
            onClick={() => {
              handleTabClick('logbook');
              scrollToSection('daily-logbook-section');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'logbook'
                ? 'bg-[#1B4D3E] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Daily Logbook ({logbookEntries.length})</span>
          </button>
        </div>

        <div className="hidden md:flex items-center text-slate-400 text-[11px] pr-2">
          <span>Synced with AIIA Sarita Vihar Academic System</span>
        </div>
      </div>

      {/* Main Sections based on view */}
      {(activeTab === 'all' || activeTab === 'skills') && (
        <div className="space-y-6">
          <SkillGapVisualizer
            skills={skills}
            onExploreUpskilling={() => scrollToSection('dynamic-upskilling-roadmap')}
          />
          <DynamicRoadmap courses={courses} />
        </div>
      )}

      {(activeTab === 'all' || activeTab === 'opportunities') && (
        <OpportunityBoard
          opportunities={opportunities}
          onSelectOpportunity={(opp) => setSelectedOpportunity(opp)}
        />
      )}

      {(activeTab === 'all' || activeTab === 'logbook') && (
        <DailyLogbook
          entries={logbookEntries}
          onAddEntry={onAddLogbookEntry}
        />
      )}

      {/* Opportunity Detail & Quick Apply Modal */}
      {selectedOpportunity && (
        <OpportunityDetailModal
          opportunity={selectedOpportunity}
          student={student}
          onClose={() => setSelectedOpportunity(null)}
          onApplySuccess={(jobId) => {
            onApplyOpportunity(jobId);
          }}
        />
      )}

      {/* Book Appointment Modal */}
      <BookAppointmentModal
        isOpen={isBookAppointmentOpen}
        onClose={() => setIsBookAppointmentOpen(false)}
      />
    </div>
  );
};
