import React, { useState } from 'react';
import { UserRole, LogbookEntry, JobPosting, KanbanCandidate } from './types';
import {
  CURRENT_STUDENT,
  SKILL_GAP_DATA,
  UPSKILLING_RECOMMENDATIONS,
  INITIAL_JOB_POSTINGS,
  INITIAL_LOGBOOK_ENTRIES,
  KANBAN_APPLICANTS,
  MOU_COLLABORATIONS,
  CURRICULUM_DIVERGENCE_DATA,
} from './data/mockData';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { CommandSearchModal } from './components/common/CommandSearchModal';
import { StudentDashboard } from './components/student/StudentDashboard';
import { IndustryPortal } from './components/industry/IndustryPortal';
import { FacultyPortal } from './components/faculty/FacultyPortal';
import { AdminPortal } from './components/admin/AdminPortal';
import { ShieldCheck, HeartHandshake, Phone, Mail, Globe, Award, Sparkles } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/auth/AuthModal';
import { AiChatbot } from './components/chat/AiChatbot';

function AyushSetuContent() {
  const { userProfile, applications } = useAuth();
  // Active Role state: default to 'student'
  const [currentRole, setCurrentRole] = useState<UserRole>('student');

  // Application Data States (Interactive with Persistent Local Resilience)
  const [student, setStudent] = useState(CURRENT_STUDENT);
  const [skills, setSkills] = useState(SKILL_GAP_DATA);
  const [courses, setCourses] = useState(UPSKILLING_RECOMMENDATIONS);
  const [opportunities, setOpportunities] = useState<JobPosting[]>(() => {
    try {
      const cached = localStorage.getItem('ayushsetu_opportunities');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_JOB_POSTINGS;
  });

  const [logbookEntries, setLogbookEntries] = useState<LogbookEntry[]>(() => {
    try {
      const cached = localStorage.getItem('ayushsetu_logbook_entries');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_LOGBOOK_ENTRIES;
  });

  const [candidates, setCandidates] = useState<KanbanCandidate[]>(KANBAN_APPLICANTS);
  const [mouCollaborations] = useState(MOU_COLLABORATIONS);
  const [divergenceData] = useState(CURRICULUM_DIVERGENCE_DATA);

  // Synchronize role with userProfile if newly logged in
  React.useEffect(() => {
    if (userProfile?.role) {
      setCurrentRole(userProfile.role);
    }
  }, [userProfile?.role]);

  // Synchronize applied status on opportunities from real-time applications
  React.useEffect(() => {
    if (applications && applications.length > 0) {
      const appliedJobIds = new Set(applications.map((a) => a.jobId));
      setOpportunities((prev) => {
        let changed = false;
        const updated = prev.map((job) => {
          if (appliedJobIds.has(job.id) && !job.applied) {
            changed = true;
            return { ...job, applied: true };
          }
          return job;
        });
        if (changed) {
          try {
            localStorage.setItem('ayushsetu_opportunities', JSON.stringify(updated));
          } catch (e) {}
          return updated;
        }
        return prev;
      });
    }
  }, [applications]);

  // Search Modal state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('all');

  // Handlers with persistent local storage caching
  const handleAddLogbookEntry = (newEntry: LogbookEntry) => {
    setLogbookEntries((prev) => {
      const updated = [newEntry, ...prev];
      try {
        localStorage.setItem('ayushsetu_logbook_entries', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleApplyOpportunity = (jobId: string) => {
    setOpportunities((prev) => {
      const updated = prev.map((job) => (job.id === jobId ? { ...job, applied: true } : job));
      try {
        localStorage.setItem('ayushsetu_opportunities', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleUpdateCandidateStage = (
    candidateId: string,
    newStage: KanbanCandidate['stage']
  ) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, stage: newStage } : c))
    );
  };

  const handlePostNewOpportunity = (newJob: JobPosting) => {
    setOpportunities((prev) => {
      const updated = [newJob, ...prev];
      try {
        localStorage.setItem('ayushsetu_opportunities', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleUpdateLogbookStatus = (
    entryId: string,
    status: 'Approved' | 'Needs Revision',
    feedback?: string
  ) => {
    setLogbookEntries((prev) =>
      prev.map((entry) =>
        entry.id === entryId
          ? {
              ...entry,
              facultyStatus: status,
              facultyFeedback: feedback || entry.facultyFeedback,
            }
          : entry
      )
    );
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-slate-900 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* High-Density Evergreen Sidebar */}
      <Sidebar
        currentRole={currentRole}
        onRoleChange={(role) => setCurrentRole(role)}
        activeSection={activeSection}
        onSectionSelect={(sec) => setActiveSection(sec)}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Official Government Navigation Header */}
        <Header
          currentRole={currentRole}
          onRoleChange={(role) => setCurrentRole(role)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
          studentName={student.name}
          studentSubtitle={`${student.program.split('(')[0]} • AIIA`}
          studentAvatar={student.avatar}
        />

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          {currentRole === 'student' && (
            <StudentDashboard
              student={student}
              skills={skills}
              courses={courses}
              opportunities={opportunities}
              logbookEntries={logbookEntries}
              onAddLogbookEntry={handleAddLogbookEntry}
              onApplyOpportunity={handleApplyOpportunity}
              selectedSection={activeSection}
              onSelectSection={(sec) => setActiveSection(sec)}
            />
          )}

          {currentRole === 'industry' && (
            <IndustryPortal
              candidates={candidates}
              onUpdateCandidateStage={handleUpdateCandidateStage}
              onPostNewOpportunity={handlePostNewOpportunity}
            />
          )}

          {currentRole === 'faculty' && (
            <FacultyPortal
              logbookEntries={logbookEntries}
              divergenceData={divergenceData}
              mouCollaborations={mouCollaborations}
              onUpdateLogbookStatus={handleUpdateLogbookStatus}
            />
          )}

          {currentRole === 'admin' && <AdminPortal />}
        </main>

      {/* Command Search Modal (Cmd+K) */}
      <CommandSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectRole={(role) => setCurrentRole(role)}
      />

      {/* Official Footer */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1: Ministry Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-white">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1B4D3E] to-[#059669] flex items-center justify-center font-serif font-black text-sm">
                  AS
                </div>
                <span className="font-serif font-bold text-base">AyushSetu</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                National Academia-Industry Collaboration Platform for Skill Mapping, Internships, and Placement.
                An initiative under the Ministry of Ayush and All India Institute of Ayurveda (AIIA).
              </p>
              <div className="flex items-center space-x-2 text-[11px] text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Government of India Digital Service</span>
              </div>
            </div>

            {/* Column 2: Quick Portals */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-white uppercase tracking-wider text-xs">
                Platform Ecosystem
              </h4>
              <ul className="space-y-1.5 text-slate-400">
                <li>
                  <button
                    onClick={() => setCurrentRole('student')}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    BAMS & MD Student Skill Passport
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentRole('industry')}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Industry Recruiter Portal (Dabur, Himalaya)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentRole('faculty')}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    AIIA Faculty & Curriculum Alignment
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentRole('admin')}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Ayush Central Policy & Placements
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Regulatory & Standards */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-white uppercase tracking-wider text-xs">
                Compliance & SOPs
              </h4>
              <ul className="space-y-1.5 text-slate-400">
                <li>Schedule T (ASU GMP & QA Guidelines)</li>
                <li>Good Clinical Practice (GCP-AYUSH Protocols)</li>
                <li>Ayurvedic Pharmacopoeia of India (API)</li>
                <li>Pharmacovigilance Program for ASU Drugs (PvPI)</li>
                <li>NABH Ayush Hospital Quality Standards</li>
              </ul>
            </div>

            {/* Column 4: Helpdesk */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-white uppercase tracking-wider text-xs">
                National Helpdesk
              </h4>
              <p className="text-slate-400 text-xs">
                All India Institute of Ayurveda, Gautampuri, Sarita Vihar, Mathura Road, New Delhi - 110076
              </p>
              <div className="space-y-1 text-slate-300">
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>1800-11-2987 (Toll-Free)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  <span>support.ayushsetu@aiia.gov.in</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
            <p>
              © 2026 Ministry of Ayush, Government of India & All India Institute of Ayurveda. All Rights Reserved.
            </p>
            <div className="flex items-center space-x-4">
              <span>WCAG 2.1 AA Compliant</span>
              <span>•</span>
              <span>Digital India Certified</span>
              <span>•</span>
              <span>AIIA SARITA VIHAR</span>
            </div>
          </div>
        </div>
      </footer>
      </div>

      {/* Global Firebase Auth Modal */}
      <AuthModal />

      {/* Floating AI Chatbot Widget (Gemini-powered Ayush Career Advisor) */}
      <AiChatbot />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AyushSetuContent />
    </AuthProvider>
  );
}
