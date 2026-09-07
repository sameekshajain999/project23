import React from 'react';
import {
  X,
  Briefcase,
  Building,
  Calendar,
  IndianRupee,
  MapPin,
  ExternalLink,
  Clock,
  Sparkles,
  CheckCircle2,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { ApplicationRecord } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';

interface MyApplicationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  applications: ApplicationRecord[];
  onExploreOpportunities?: () => void;
}

export const MyApplicationsDrawer: React.FC<MyApplicationsDrawerProps> = ({
  isOpen,
  onClose,
  applications,
  onExploreOpportunities,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="my-applications-drawer-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="my-applications-drawer"
        className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="bg-[#1B4D3E] text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-300 mb-1">
            <Briefcase className="w-4 h-4 text-amber-400" />
            <span>AyushSetu Scholar Career Portal</span>
          </div>

          <div className="flex items-center space-x-3">
            <h3 className="text-xl font-black font-serif tracking-tight">
              My Submitted Applications
            </h3>
            <span className="text-xs font-bold bg-emerald-700/80 text-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
              {applications.length} {applications.length === 1 ? 'Role' : 'Roles'}
            </span>
          </div>

          <p className="text-xs text-emerald-100 mt-1.5 leading-relaxed">
            Track real-time candidate progression across verified herbal pharmaceutical R&D, clinical trial CROs, and AIIA academic fellowships.
          </p>
        </div>

        {/* Status Tracker Subheader */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center space-x-4">
            <span className="font-semibold text-slate-800">
              Active Applications: <span className="text-emerald-800 font-bold">{applications.length}</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-700 font-medium flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              Synced via Ministry Registry
            </span>
          </div>
        </div>

        {/* Applications List */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {applications.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 my-8">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#1B4D3E] flex items-center justify-center mx-auto mb-3">
                <Briefcase className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-800 font-serif">
                No Applications Submitted Yet
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4 leading-relaxed">
                Explore verified opportunities from Dabur, Himalaya, Patanjali, and AIIA to jumpstart your Ayush clinical or industrial career.
              </p>
              {onExploreOpportunities && (
                <button
                  onClick={() => {
                    onClose();
                    onExploreOpportunities();
                  }}
                  className="px-4 py-2 bg-[#1B4D3E] hover:bg-[#153e32] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Browse Opportunity Marketplace
                </button>
              )}
            </div>
          ) : (
            applications.map((app) => (
              <div
                key={app.id}
                id={`application-card-${app.id}`}
                className="bg-white border border-slate-200 rounded-xl p-4.5 shadow-2xs hover:shadow-xs hover:border-emerald-300 transition-all space-y-3"
              >
                {/* Top Row: Organization and Status Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-800">
                      <Building className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{app.organization}</span>
                    </div>
                    <h4 className="text-sm font-black text-slate-900 mt-0.5 leading-snug">
                      {app.jobTitle}
                    </h4>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                        app.status === 'Shortlisted'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : app.status === 'Under Review'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : app.status === 'Interview Scheduled'
                          ? 'bg-purple-50 text-purple-800 border-purple-200'
                          : app.status === 'Offered'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : app.status === 'Rejected'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current animate-pulse"></span>
                      {app.status}
                    </span>
                  </div>
                </div>

                {/* Key Metadata: Date Applied, Stipend, Location, Match Score */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <div>
                      <span className="text-[10px] text-slate-400 block leading-tight">Applied Date</span>
                      <span className="font-semibold text-slate-800">{app.appliedDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <IndianRupee className="w-3.5 h-3.5 text-amber-600" />
                    <div>
                      <span className="text-[10px] text-slate-400 block leading-tight">Stipend / Package</span>
                      <span className="font-semibold text-slate-800 truncate block max-w-[130px]" title={app.stipend || 'Standard Sector Norms'}>
                        {app.stipend || 'Sector Norms'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 col-span-2 sm:col-span-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <div>
                      <span className="text-[10px] text-slate-400 block leading-tight">Skill Match</span>
                      <span className="font-bold text-emerald-800">{app.matchScore}% Match</span>
                    </div>
                  </div>
                </div>

                {/* Additional Notes or Location Tag if present */}
                {(app.notes || app.location) && (
                  <div className="p-2.5 bg-slate-50 rounded-lg text-xs text-slate-600 flex items-start space-x-2 border border-slate-100">
                    <Clock className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <div className="space-y-0.5">
                      {app.location && (
                        <p className="text-[11px] text-slate-500 font-medium">
                          {app.location} {app.workMode ? `• ${app.workMode}` : ''}
                        </p>
                      )}
                      {app.notes && (
                        <p className="text-xs text-slate-700 font-medium">{app.notes}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">
            AyushSetu ID: AIIA/BAMS/2021/042
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
