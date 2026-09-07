import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Filter,
  Sparkles,
} from 'lucide-react';
import { SkillGapItem } from '../../types';

interface SkillGapVisualizerProps {
  skills: SkillGapItem[];
  onExploreUpskilling?: () => void;
}

export const SkillGapVisualizer: React.FC<SkillGapVisualizerProps> = ({
  skills,
  onExploreUpskilling,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Clinical Protocol', 'Industrial R&D', 'Regulatory & QA', 'Phytochemistry', 'Digital Health'];

  const filteredSkills =
    selectedCategory === 'All'
      ? skills
      : skills.filter((s) => s.category === selectedCategory);

  // Compute key insights
  const highestGapSkill = [...skills].sort((a, b) => b.gap - a.gap)[0];
  const alignedSkills = skills.filter((s) => s.gap <= 5);

  return (
    <div
      id="skill-gap-visualizer-card"
      className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-5"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-black text-slate-900 font-serif">
              National Skill Competency Mapping
            </h3>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
              Industry Readiness Benchmarks
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Personalized competency evaluation mapped directly to live pharma hiring and clinical research criteria.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-[#1B4D3E] text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Key Insight Alert Box */}
      {highestGapSkill && (
        <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 flex items-start space-x-3 text-xs">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold text-amber-900">
              Priority Upskilling Opportunity: {highestGapSkill.skill}
            </p>
            <p className="text-amber-800 text-[11px] leading-relaxed mt-0.5">
              Current student proficiency is {highestGapSkill.academicScore}% vs the {highestGapSkill.industryBenchmark}% standard required by leading Ayurvedic pharma R&D roles.
            </p>
          </div>
          {onExploreUpskilling && (
            <button
              onClick={onExploreUpskilling}
              className="text-[11px] font-bold text-amber-900 hover:text-amber-950 underline shrink-0 cursor-pointer"
            >
              Bridge Skill →
            </button>
          )}
        </div>
      )}

      {/* Clean 2-Column Responsive Skill Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredSkills.map((item) => {
          const hasDeficit = item.gap > 0;
          return (
            <div
              key={item.skill}
              id={`skill-item-${item.skill.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              className="p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-slate-50/50 transition-all text-xs space-y-2 bg-slate-50/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 overflow-hidden pr-2">
                  <span className="font-bold text-slate-900 truncate">{item.skill}</span>
                  <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded shrink-0">
                    {item.category}
                  </span>
                </div>
                <span
                  className={`text-[11px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                    item.gap > 20
                      ? 'bg-rose-100 text-rose-800'
                      : item.gap > 0
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {hasDeficit ? `-${item.gap}% Gap` : 'Optimal Fit'}
                </span>
              </div>

              {/* Progress Bar (Student vs Industry Target) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                  <span>Student Proficiency: {item.academicScore}%</span>
                  <span>Target Benchmark: {item.industryBenchmark}%</span>
                </div>
                <div className="relative h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  {/* Industry Target marker background */}
                  <div
                    className="absolute top-0 bottom-0 bg-amber-300/40 rounded-full"
                    style={{ width: `${item.industryBenchmark}%` }}
                  />
                  {/* Current Proficiency */}
                  <div
                    className={`absolute top-0 bottom-0 rounded-full ${
                      hasDeficit ? 'bg-emerald-600' : 'bg-emerald-700'
                    }`}
                    style={{ width: `${item.academicScore}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Summary & Direct CTA */}
      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <span className="text-slate-500">
          <strong className="text-slate-800">{alignedSkills.length}</strong> of {skills.length} evaluated domains meet or exceed industry benchmarks
        </span>
        {onExploreUpskilling && (
          <button
            onClick={onExploreUpskilling}
            className="inline-flex items-center font-bold text-emerald-800 hover:text-emerald-950 transition-colors cursor-pointer"
          >
            <span>Explore Targeted Upskilling Micro-Courses</span>
            <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </button>
        )}
      </div>
    </div>
  );
};
