import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Building,
  TrendingUp,
  Clock,
  Check,
  X,
  MessageSquare,
  Sparkles,
  Award,
  ExternalLink,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { LogbookEntry, MoUCollaboration, CurriculumDivergence } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { useAuth } from '../../context/AuthContext';

interface FacultyPortalProps {
  logbookEntries: LogbookEntry[];
  divergenceData: CurriculumDivergence[];
  mouCollaborations: MoUCollaboration[];
  onUpdateLogbookStatus: (
    entryId: string,
    status: 'Approved' | 'Needs Revision',
    feedback?: string
  ) => void;
}

export const FacultyPortal: React.FC<FacultyPortalProps> = ({
  logbookEntries,
  divergenceData,
  mouCollaborations,
  onUpdateLogbookStatus,
}) => {
  const { requireAuth } = useAuth();
  const [activeTab, setActiveTab] = useState<'alignment' | 'queue' | 'mous'>('alignment');
  const [feedbackPromptEntryId, setFeedbackPromptEntryId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  // Prepare chart data
  const chartData = divergenceData.map((d) => ({
    name: d.subject.length > 18 ? d.subject.substring(0, 16) + '…' : d.subject,
    fullName: d.subject,
    'Syllabus Coverage': d.academicHours / 2.5, // normalize to 100 scale for comparison
    'Industry Demand Index': d.industryDemandWeight,
    divergenceLevel: d.divergenceLevel,
    suggestedAdditions: d.suggestedAdditions,
  }));

  const pendingLogbooks = logbookEntries.filter((e) => e.facultyStatus !== 'Approved');

  const handleApprove = (id: string) => {
    if (!requireAuth('Please sign in as an Academic Faculty / TPO to verify and countersign student logbooks', 'faculty')) {
      return;
    }
    onUpdateLogbookStatus(id, 'Approved', 'Countersigned by AIIA Department Chair.');
  };

  const handleRequestRevision = (id: string) => {
    if (!requireAuth('Please sign in as an Academic Faculty / TPO to submit revision notes', 'faculty')) {
      return;
    }
    if (!feedbackText.trim()) return;
    onUpdateLogbookStatus(id, 'Needs Revision', feedbackText);
    setFeedbackPromptEntryId(null);
    setFeedbackText('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner / Metrics */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-800">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black text-slate-900 font-serif">
                  Academic Coordinator & Faculty Portal
                </h2>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  All India Institute of Ayurveda
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Curriculum modernization engine, internship credit approval queue, and active industrial MoU governance.
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            Coordinator: <span className="font-bold text-slate-900">Prof. (Dr.) Ramakrishna Vashishta</span>
          </div>
        </div>

        {/* 4 KPI Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 block">
              Pending Logbook Verifications
            </span>
            <span className="text-xl font-black text-amber-800 font-serif mt-1 block">
              {pendingLogbooks.length} Entries
            </span>
            <span className="text-[10px] text-amber-700 font-semibold flex items-center mt-0.5">
              Requires faculty sign-off
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 block">
              Active Industry MoUs
            </span>
            <span className="text-xl font-black text-slate-900 font-serif mt-1 block">
              {mouCollaborations.length} Active
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold flex items-center mt-0.5">
              ₹13.2 Cr Total Budget
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 block">
              Curriculum Divergence Index
            </span>
            <span className="text-xl font-black text-rose-800 font-serif mt-1 block">28.4%</span>
            <span className="text-[10px] text-rose-700 font-semibold flex items-center mt-0.5">
              Schedule T & GCP shortfall
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 block">
              Verified Academic Credits
            </span>
            <span className="text-xl font-black text-emerald-800 font-serif mt-1 block">1,840 Credits</span>
            <span className="text-[10px] text-emerald-700 font-semibold flex items-center mt-0.5">
              Synced with DigiLocker
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          id="tab-curriculum-alignment-btn"
          onClick={() => setActiveTab('alignment')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'alignment'
              ? 'bg-[#1B4D3E] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Curriculum-Industry Alignment Heatmap</span>
        </button>

        <button
          id="tab-verification-queue-btn"
          onClick={() => setActiveTab('queue')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'queue'
              ? 'bg-[#1B4D3E] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>Student Verification Queue ({pendingLogbooks.length})</span>
        </button>

        <button
          id="tab-mou-tracker-btn"
          onClick={() => setActiveTab('mous')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === 'mous'
              ? 'bg-[#1B4D3E] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>MoU & Joint Capstone Panel</span>
        </button>
      </div>

      {/* TAB 1: CURRICULUM-INDUSTRY ALIGNMENT */}
      {activeTab === 'alignment' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-black text-slate-900 font-serif">
                  Subject Divergence vs Modern Industry Benchmarks
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Comparison between current NCISM/AIIA syllabus coverage hours and market hiring requirements.
                </p>
              </div>

              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 self-start sm:self-auto">
                High Divergence in 3 Core Subjects
              </span>
            </div>

            {/* Recharts Bar Chart */}
            <div className="w-full h-80 pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#334155', fontSize: 11 }}
                    angle={-10}
                    textAnchor="end"
                  />
                  <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip
                    content={({ active, payload }: any) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl text-xs max-w-xs">
                            <p className="font-bold text-amber-400 mb-1">{item.fullName}</p>
                            <div className="space-y-1">
                              <p className="text-emerald-300">
                                Syllabus Coverage: {Math.round(item['Syllabus Coverage'])}%
                              </p>
                              <p className="text-amber-300">
                                Industry Demand: {item['Industry Demand Index']}%
                              </p>
                              <p className="font-bold text-slate-200">
                                Status: {item.divergenceLevel}
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                  <Bar
                    name="Current Syllabus Weight"
                    dataKey="Syllabus Coverage"
                    fill="#059669"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    name="Market Demand Index"
                    dataKey="Industry Demand Index"
                    fill="#D97706"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Actionable Curriculum Reform Recommendations */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <h3 className="text-base font-black text-slate-900 font-serif">
              AIIA Academic Council Remedial Directives
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {divergenceData.map((d) => (
                <div
                  key={d.subject}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">{d.subject}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        d.divergenceLevel === 'High Divergence'
                          ? 'bg-rose-100 text-rose-800'
                          : d.divergenceLevel === 'Moderate Divergence'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {d.divergenceLevel}
                    </span>
                  </div>

                  <p className="text-slate-500 text-[11px]">
                    Academic allocation: {d.academicHours} Hours | Industry Demand Weight:{' '}
                    {d.industryDemandWeight}/100
                  </p>

                  <div className="pt-2 border-t border-slate-200 space-y-1">
                    <span className="font-bold text-slate-700 text-[11px] block">
                      Recommended Practical Additions:
                    </span>
                    <ul className="space-y-1 text-[11px] text-slate-600">
                      {d.suggestedAdditions.map((item, idx) => (
                        <li key={idx} className="flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENT VERIFICATION QUEUE */}
      {activeTab === 'queue' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900 font-serif">
                Internship Training Verification Queue
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Review daily procedure summaries submitted by BAMS & MD clinical interns.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
              Total {logbookEntries.length} Submitted Logs
            </span>
          </div>

          <div className="space-y-3">
            {logbookEntries.map((entry) => (
              <div
                key={entry.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 bg-slate-50/40 space-y-3 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm font-mono">
                      {entry.id}
                    </span>
                    <span className="text-slate-600 font-semibold">• {entry.studentName}</span>
                    <span className="text-slate-400">({entry.date})</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <StatusBadge
                      type={
                        entry.facultyStatus === 'Approved'
                          ? 'verified'
                          : entry.facultyStatus === 'Pending'
                          ? 'pending'
                          : 'warning'
                      }
                      label={`Faculty: ${entry.facultyStatus}`}
                      size="sm"
                    />
                    <StatusBadge
                      type={entry.industryStatus === 'Approved' ? 'verified' : 'pending'}
                      label={`Industry: ${entry.industryStatus}`}
                      size="sm"
                    />
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-slate-900 text-xs">
                      {entry.procedureOrTask}
                    </h5>
                    <span className="font-mono text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                      {entry.sopFollowed}
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">{entry.description}</p>
                  <div className="flex items-center space-x-4 text-[11px] text-slate-500 pt-1">
                    <span>Facility: {entry.industryOrHospital}</span>
                    <span>Hours: {entry.hoursSpent} hrs</span>
                    {entry.clinicalCasesObserved && (
                      <span>Cases: {entry.clinicalCasesObserved}</span>
                    )}
                  </div>
                </div>

                {/* Faculty Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="text-[11px] text-slate-500">
                    {entry.facultyFeedback ? (
                      <span className="text-emerald-800 font-medium italic">
                        Feedback logged: "{entry.facultyFeedback}"
                      </span>
                    ) : (
                      <span>No faculty feedback entered yet</span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {entry.facultyStatus !== 'Approved' ? (
                      <>
                        <button
                          onClick={() => setFeedbackPromptEntryId(entry.id)}
                          className="px-3 py-1.5 border border-amber-300 text-amber-800 hover:bg-amber-50 rounded-lg font-bold text-xs flex items-center space-x-1"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Request Revision</span>
                        </button>
                        <button
                          onClick={() => handleApprove(entry.id)}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs flex items-center space-x-1 shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Sign & Approve Credits</span>
                        </button>
                      </>
                    ) : (
                      <span className="text-emerald-700 font-bold flex items-center text-xs">
                        <CheckCircle2 className="w-4 h-4 mr-1" /> Approved & Synced with Registrar
                      </span>
                    )}
                  </div>
                </div>

                {/* Revision Prompt Box if active */}
                {feedbackPromptEntryId === entry.id && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-2 animate-in fade-in">
                    <label className="block font-bold text-amber-900 text-xs">
                      Enter Revision Instructions for {entry.studentName}:
                    </label>
                    <textarea
                      rows={2}
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="e.g. Please attach the HPTLC chromatogram scan and clarify Withanolide Rf calculation..."
                      className="w-full p-2 text-xs border border-amber-300 rounded-lg bg-white"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setFeedbackPromptEntryId(null)}
                        className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 rounded text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleRequestRevision(entry.id)}
                        className="px-3 py-1 bg-amber-800 text-white font-bold rounded text-xs"
                      >
                        Send Revision Request
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MOU & INDUSTRY COLLABORATION PANEL */}
      {activeTab === 'mous' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900 font-serif">
                Active College-Industry Joint Capstone MoUs
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Centralized registry of legally binding collaboration frameworks under the Ministry of Ayush.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              100% Active Compliance
            </span>
          </div>

          <div className="space-y-4">
            {mouCollaborations.map((mou) => (
              <div
                key={mou.id}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-300 transition-all space-y-3 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded">
                      {mou.id}
                    </span>
                    <span className="font-bold text-sm text-slate-900">
                      {mou.industryPartner} ↔ {mou.academicPartner}
                    </span>
                  </div>
                  <StatusBadge
                    type={
                      mou.status === 'Active'
                        ? 'verified'
                        : mou.status === 'Milestone 2 Completed'
                        ? 'info'
                        : 'pending'
                    }
                    label={mou.status}
                    size="sm"
                  />
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{mou.title}</h4>
                  <p className="text-slate-600 text-xs mt-1">
                    <span className="font-semibold text-slate-700">Focus Area:</span> {mou.focusArea}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3 rounded-xl border border-slate-200 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Grant Allocation</span>
                    <span className="font-black text-emerald-900 text-xs font-serif">
                      {mou.budgetAllocated}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Student Fellows</span>
                    <span className="font-bold text-slate-800 text-xs">
                      {mou.studentFellowsCount} Active Scholars
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Signed Date</span>
                    <span className="font-semibold text-slate-700">{mou.signedDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Validity</span>
                    <span className="font-semibold text-slate-700">{mou.validTill}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Joint Preceptors: {mou.leadInvestigator}</span>
                  <span className="text-emerald-700 font-semibold flex items-center">
                    <Award className="w-3.5 h-3.5 mr-1" /> Verified by Ministry of Ayush
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
