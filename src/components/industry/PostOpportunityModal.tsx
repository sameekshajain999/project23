import React, { useState } from 'react';
import { X, Briefcase, Plus, Check, ArrowRight, ArrowLeft, Building2, IndianRupee, ShieldCheck } from 'lucide-react';
import { JobPosting } from '../../types';

interface PostOpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostSuccess: (newJob: JobPosting) => void;
}

export const PostOpportunityModal: React.FC<PostOpportunityModalProps> = ({
  isOpen,
  onClose,
  onPostSuccess,
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    organization: 'Dabur Research & Development Centre (DRDC)',
    orgType: 'Herbal Pharmaceutical' as any,
    location: 'Ghaziabad, NCR / Hybrid',
    workMode: 'Hybrid' as any,
    type: 'Internship' as any,
    duration: '6 Months',
    stipend: '₹35,000 / month',
    openings: 3,
    deadline: '15 May 2026',
    requiredSkills: ['Schedule T (ASU GMP & QA)', 'Formulation R&D & Stability'],
    description: '',
    eligibility: 'BAMS / MD (Ayu) or B.Pharm (Ayurveda) with lab posting experience.',
    responsibilities: [
      'Conduct classical batch stabilization studies.',
      'Maintain Batch Manufacturing Records per Schedule T.',
    ],
  });

  const [customSkillInput, setCustomSkillInput] = useState('');

  if (!isOpen) return null;

  const availableSkills = [
    'Schedule T (ASU GMP & QA)',
    'Clinical Trial Protocols (GCP)',
    'Formulation R&D & Stability',
    'Pharmacovigilance (ADR Reporting)',
    'Phytochemical HPLC/HPTLC',
    'Panchakarma Protocol SOPs',
    'Herbal Drug Standardization',
    'Ayush EMR & Digital Telehealth',
  ];

  const toggleSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills.includes(skill)
        ? prev.requiredSkills.filter((s) => s !== skill)
        : [...prev.requiredSkills, skill],
    }));
  };

  const handleAddCustomSkill = () => {
    if (!customSkillInput.trim()) return;
    if (!formData.requiredSkills.includes(customSkillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, customSkillInput.trim()],
      }));
    }
    setCustomSkillInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newJob: JobPosting = {
      id: `JOB-${Date.now().toString().slice(-4)}`,
      title: formData.title || 'Ayurvedic R&D Associate Fellow',
      organization: formData.organization,
      orgType: formData.orgType,
      location: formData.location,
      workMode: formData.workMode,
      type: formData.type,
      duration: formData.duration,
      stipend: formData.stipend,
      matchScore: 92,
      openings: Number(formData.openings),
      deadline: formData.deadline,
      verifiedGovtPartner: true,
      requiredSkills: formData.requiredSkills,
      description:
        formData.description ||
        'Comprehensive industry research fellowship focused on standardized extract formulation and classical stability monitoring.',
      responsibilities: formData.responsibilities,
      eligibility: formData.eligibility,
    };

    onPostSuccess(newJob);
    onClose();
  };

  return (
    <div
      id="post-opportunity-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="post-opportunity-modal"
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#1B4D3E] text-white p-5 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-base font-serif">
                Post Industry Opportunity / Capstone
              </h3>
            </div>
            <p className="text-xs text-emerald-200 mt-0.5">
              Step {step} of 3 • Direct syndication to AIIA, NIA & ITRA student networks
            </p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Steps indicator */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <div
            className={`flex-1 py-2.5 text-center border-b-2 ${
              step === 1 ? 'border-emerald-700 text-emerald-950 font-bold bg-white' : 'border-transparent text-slate-500'
            }`}
          >
            1. Role & Scope
          </div>
          <div
            className={`flex-1 py-2.5 text-center border-b-2 ${
              step === 2 ? 'border-emerald-700 text-emerald-950 font-bold bg-white' : 'border-transparent text-slate-500'
            }`}
          >
            2. Required Ayush Skills
          </div>
          <div
            className={`flex-1 py-2.5 text-center border-b-2 ${
              step === 3 ? 'border-emerald-700 text-emerald-950 font-bold bg-white' : 'border-transparent text-slate-500'
            }`}
          >
            3. Stipend & Review
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {step === 1 && (
            <div className="space-y-3.5 animate-in fade-in">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Opportunity Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. R&D Formulation Intern, Clinical Trial Coordinator..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Organization Name</label>
                  <input
                    type="text"
                    required
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sector Type</label>
                  <select
                    value={formData.orgType}
                    onChange={(e) => setFormData({ ...formData, orgType: e.target.value as any })}
                    className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50"
                  >
                    <option value="Herbal Pharmaceutical">Herbal Pharmaceutical</option>
                    <option value="Clinical CRO">Clinical CRO</option>
                    <option value="NABH Ayurvedic Hospital">NABH Ayurvedic Hospital</option>
                    <option value="Ayur-Tech Startup">Ayur-Tech Startup</option>
                    <option value="National Research Institute">National Research Institute</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Work Mode</label>
                  <select
                    value={formData.workMode}
                    onChange={(e) => setFormData({ ...formData, workMode: e.target.value as any })}
                    className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50"
                  >
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Role Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Fellowship">Fellowship</option>
                    <option value="Full-time">Full-time</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Number of Openings</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.openings}
                    onChange={(e) => setFormData({ ...formData, openings: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Brief Description</label>
                <textarea
                  rows={2}
                  placeholder="Outline the clinical/lab environment, preceptor guidance, and project goals..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tag Required Ayush Competencies (Calculates Student Match Fit)
                </label>
                <p className="text-[11px] text-slate-500 mb-2">
                  Select key skills students must have verified in their AIIA digital logbook:
                </p>

                <div className="flex flex-wrap gap-2">
                  {availableSkills.map((skill) => {
                    const isSelected = formData.requiredSkills.includes(skill);
                    return (
                      <button
                        type="button"
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all flex items-center space-x-1.5 ${
                          isSelected
                            ? 'bg-emerald-700 text-white border-emerald-800'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                        <span>{skill}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom skill tag input */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="text"
                  placeholder="Add custom laboratory or clinical procedure..."
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  className="flex-1 p-2 border border-slate-200 rounded-lg bg-slate-50"
                />
                <button
                  type="button"
                  onClick={handleAddCustomSkill}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-bold text-xs"
                >
                  Add Tag
                </button>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Eligibility Specs</label>
                <input
                  type="text"
                  value={formData.eligibility}
                  onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Monthly Stipend / Fellowship Grant
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.stipend}
                    onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location Address</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Application Deadline</label>
                  <input
                    type="text"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50"
                  />
                </div>
              </div>

              {/* Review summary box */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                <p className="font-bold text-emerald-950 flex items-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 mr-1.5" />
                  National MoU Compliance Verified
                </p>
                <p className="text-[11px] text-emerald-800">
                  This posting will instantly alert 1,200+ eligible final-year BAMS scholars matching {formData.requiredSkills.length} tagged competencies.
                </p>
              </div>
            </div>
          )}

          {/* Footer Navigation */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-3.5 py-2 border border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-100 flex items-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-4 py-2 bg-[#1B4D3E] hover:bg-[#153e32] text-white rounded-xl font-bold flex items-center space-x-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-5 py-2 bg-[#1B4D3E] hover:bg-[#153e32] text-white rounded-xl font-bold flex items-center space-x-1.5 shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>Publish to National Portal</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
