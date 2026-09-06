import React, { useState } from 'react';
import {
  TrendingDown,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  ChevronRight,
  Filter,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { SkillGapItem } from '../../types';
import { SkillRadarChart } from '../charts/SkillRadarChart';

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
              National Skill Gap Visualizer
            </h3>
            <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
              Syllabus vs Industry Benchmark
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time differential mapping of academic curriculum credits against live CDSCO & Herbal Pharma demand indices.
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

      {/* Main Grid: Radar Chart + Skill Gap List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left / Center: Interactive Recharts Spider Chart */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-3 bg-slate-50/70 rounded-xl border border-slate-200/80">
          <div className="w-full flex items-center justify-between px-2 text-[11px] font-semibold text-slate-600">
            <span>Competency Spider Map</span>
            <span className="text-emerald-700 font-bold">8 Evaluated Dimensions</span>
          </div>

          <SkillRadarChart data={filteredSkills} height={340} />

          <div className="w-full mt-2 pt-2 border-t border-slate-200 flex items-center justify-around text-[11px]">
            <span className="flex items-center font-semibold text-slate-700">
              <span className="w-3 h-3 rounded-sm bg-emerald-600 mr-1.5 inline-block"></span>
              Syllabus Score
            </span>
            <span className="flex items-center font-semibold text-slate-700">
              <span className="w-3 h-3 rounded-sm bg-amber-500 mr-1.5 inline-block"></span>
              Market Benchmark
            </span>
          </div>
        </div>

        {/* Right: Detailed Competency Shortfall Breakdown */}
        <div className="lg:col-span-6 space-y-3.5">
          {/* Key Insight Alert Box */}
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start space-x-3 text-xs">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-900">
                Primary Shortfall Alert: {highestGapSkill.skill}
              </p>
              <p className="text-amber-800 text-[11px] leading-relaxed mt-0.5">
                Current academic syllabus allocates 62% coverage compared to the 90% proficiency threshold demanded by Dabur and Himalaya R&D roles.
              </p>
            </div>
          </div>

          {/* Skill List with Progress Bars */}
          <div className="space-y-2.5 max-h-[290px] overflow-y-auto pr-1">
            {filteredSkills.map((item) => {
              const hasDeficit = item.gap > 0;
              return (
                <div
                  key={item.skill}
                  id={`skill-item-${item.skill.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-slate-50/50 transition-all text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-slate-900">{item.skill}</span>
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                        {item.category}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
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
                  </div>

                  {/* Dual Bar (Academic vs Market) */}
                  <div className="space-y-1 mt-1.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>Academic: {item.academicScore}%</span>
                      <span>Target: {item.industryBenchmark}%</span>
                    </div>
                    <div className="relative h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      {/* Industry Benchmark indicator */}
                      <div
                        className="absolute top-0 bottom-0 bg-amber-400/40 rounded-full"
                        style={{ width: `${item.industryBenchmark}%` }}
                      />
                      {/* Student Syllabus Score */}
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

          {/* Quick CTA to Dynamic Upskilling */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {alignedSkills.length} of {skills.length} domains meet industry benchmarks
            </span>
            {onExploreUpskilling && (
              <button
                onClick={onExploreUpskilling}
                className="inline-flex items-center text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
              >
                <span>View Remedial Micro-Courses</span>
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
