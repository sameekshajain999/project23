import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building,
  UserCheck,
  Award,
  ChevronDown,
  X,
  Send,
} from 'lucide-react';
import { LogbookEntry } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';

interface DailyLogbookProps {
  entries: LogbookEntry[];
  onAddEntry: (entry: LogbookEntry) => void;
}

export const DailyLogbook: React.FC<DailyLogbookProps> = ({
  entries,
  onAddEntry,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<LogbookEntry | null>(null);

  // Form State for new entry
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    department: 'Kayachikitsa & Panchakarma Specialty Unit',
    mentorName: 'Prof. (Dr.) Ramakrishna Vashishta, AIIA',
    industryOrHospital: 'AIIA Tertiary Care Hospital, Sarita Vihar',
    procedureOrTask: '',
    hoursSpent: 6,
    clinicalCasesObserved: 4,
    sopFollowed: 'AIIA-SOP-PK-06 (Bio-cleansing Protocol)',
    description: '',
  });

  const departments = [
    'Kayachikitsa & Panchakarma Specialty Unit',
    'Dravyaguna Phytochemistry Central Lab',
    'Rasashastra & Schedule T Pilot Facility',
    'Pharmacovigilance (PvPI) Peripheral Center',
    'Clinical Trial Unit (GCP-AYUSH)',
    'Herbal Herbarium & Raw Material QA',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.procedureOrTask || !formData.description) return;

    const newEntry: LogbookEntry = {
      id: `LOG-2026-${Math.floor(100 + Math.random() * 900)}`,
      studentId: 'STU-AIIA-2024-89',
      studentName: 'Dr. Ananya Sharma',
      date: formData.date,
      department: formData.department,
      mentorName: formData.mentorName,
      industryOrHospital: formData.industryOrHospital,
      procedureOrTask: formData.procedureOrTask,
      hoursSpent: Number(formData.hoursSpent),
      clinicalCasesObserved: Number(formData.clinicalCasesObserved),
      sopFollowed: formData.sopFollowed,
      description: formData.description,
      facultyStatus: 'Pending',
      industryStatus: 'Pending',
    };

    onAddEntry(newEntry);
    setShowAddModal(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      department: 'Kayachikitsa & Panchakarma Specialty Unit',
      mentorName: 'Prof. (Dr.) Ramakrishna Vashishta, AIIA',
      industryOrHospital: 'AIIA Tertiary Care Hospital, Sarita Vihar',
      procedureOrTask: '',
      hoursSpent: 6,
      clinicalCasesObserved: 4,
      sopFollowed: 'AIIA-SOP-PK-06 (Bio-cleansing Protocol)',
      description: '',
    });
  };

  return (
    <div
      id="daily-logbook-section"
      className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-5"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-black text-slate-900 font-serif">
              Daily Clinical & Industrial Internship Logbook
            </h3>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
              Dual Sign-off Enabled
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographically timestamped daily training log countersigned by AIIA Academic Faculty and Industry Preceptors.
          </p>
        </div>

        <button
          id="open-add-logbook-entry-btn"
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-1.5 px-3.5 py-2 bg-[#1B4D3E] hover:bg-[#153e32] text-white rounded-xl text-xs font-bold transition-all shadow-2xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log Training Entry</span>
        </button>
      </div>

      {/* Logbook Entries Table / Cards */}
      <div className="space-y-3">
        {entries.map((entry) => (
          <div
            key={entry.id}
            id={`logbook-card-${entry.id}`}
            className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-slate-50/40 transition-all space-y-2.5 text-xs"
          >
            {/* Top row: Date, Department, Dual Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-slate-900 font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded">
                  {entry.id}
                </span>
                <span className="text-slate-500 flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {entry.date}
                </span>
                <span className="text-slate-700 font-semibold">• {entry.department}</span>
              </div>

              {/* Dual Sign-off Status Pills */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <span className="text-[10px] text-slate-400">Faculty:</span>
                  <StatusBadge
                    type={
                      entry.facultyStatus === 'Approved'
                        ? 'verified'
                        : entry.facultyStatus === 'Pending'
                        ? 'pending'
                        : 'warning'
                    }
                    label={entry.facultyStatus}
                    size="sm"
                  />
                </div>

                <div className="flex items-center space-x-1">
                  <span className="text-[10px] text-slate-400">Industry:</span>
                  <StatusBadge
                    type={
                      entry.industryStatus === 'Approved'
                        ? 'verified'
                        : entry.industryStatus === 'Pending'
                        ? 'pending'
                        : 'warning'
                    }
                    label={entry.industryStatus}
                    size="sm"
                  />
                </div>
              </div>
            </div>

            {/* Task Name & SOP */}
            <div>
              <h4 className="font-bold text-slate-900 text-sm">{entry.procedureOrTask}</h4>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 mt-0.5">
                <span>Facility: {entry.industryOrHospital}</span>
                <span>Mentor: {entry.mentorName}</span>
                <span className="font-mono text-emerald-800 font-semibold">
                  SOP: {entry.sopFollowed}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-slate-700 text-xs leading-relaxed bg-white p-2.5 rounded-lg border border-slate-100">
              {entry.description}
            </p>

            {/* Hours and Feedback Row */}
            <div className="flex flex-wrap items-center justify-between pt-1 text-[11px] text-slate-500 border-t border-slate-100">
              <div className="flex items-center space-x-3">
                <span className="flex items-center text-slate-700 font-medium">
                  <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {entry.hoursSpent} Training Hours
                </span>
                {entry.clinicalCasesObserved && (
                  <span className="flex items-center text-slate-700 font-medium">
                    <UserCheck className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {entry.clinicalCasesObserved} Cases Observed
                  </span>
                )}
              </div>

              {(entry.facultyFeedback || entry.industryFeedback) && (
                <div className="text-emerald-800 font-medium text-[11px] italic">
                  Feedback: "{entry.facultyFeedback || entry.industryFeedback}"
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Entry Modal */}
      {showAddModal && (
        <div
          id="add-logbook-modal-backdrop"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowAddModal(false)}
        >
          <div
            id="add-logbook-modal"
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#1B4D3E] text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-emerald-300" />
                <h3 className="font-bold text-base font-serif">
                  New Clinical / Industrial Log Entry
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hours Spent</label>
                  <input
                    type="number"
                    min={1}
                    max={16}
                    required
                    value={formData.hoursSpent}
                    onChange={(e) => setFormData({ ...formData, hoursSpent: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Clinical Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Procedure / Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Virechana Karma Assessment, HPLC Chromatography..."
                  value={formData.procedureOrTask}
                  onChange={(e) => setFormData({ ...formData, procedureOrTask: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Standard Operating Procedure (SOP)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AIIA-SOP-PK-04"
                    value={formData.sopFollowed}
                    onChange={(e) => setFormData({ ...formData, sopFollowed: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cases Observed</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.clinicalCasesObserved}
                    onChange={(e) =>
                      setFormData({ ...formData, clinicalCasesObserved: Number(e.target.value) })
                    }
                    className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Detailed Observations & Clinical Learnings
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail the method, observations, patient reactions, or laboratory findings..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 border border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1B4D3E] hover:bg-[#153e32] text-white rounded-xl font-bold flex items-center space-x-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit for Sign-off</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
