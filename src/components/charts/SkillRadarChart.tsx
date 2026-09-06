import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { SkillGapItem } from '../../types';

interface SkillRadarChartProps {
  data: SkillGapItem[];
  height?: number;
}

export const SkillRadarChart: React.FC<SkillRadarChartProps> = ({ data, height = 380 }) => {
  // Format data for radar
  const formattedData = data.map((item) => ({
    skill: item.skill.length > 20 ? item.skill.substring(0, 18) + '…' : item.skill,
    fullSkill: item.skill,
    'Syllabus Level': item.academicScore,
    'Industry Benchmark': item.industryBenchmark,
    gap: item.gap,
    category: item.category,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const current = payload[0]?.payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-slate-700 text-xs max-w-xs z-50">
          <p className="font-bold text-sm text-amber-400 mb-1">{current.fullSkill}</p>
          <p className="text-slate-300 text-[11px] mb-2">{current.category}</p>
          <div className="space-y-1 border-t border-slate-700 pt-1.5">
            <div className="flex justify-between items-center">
              <span className="text-emerald-400 font-medium">Syllabus Level:</span>
              <span className="font-bold">{current['Syllabus Level']}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-amber-400 font-medium">Industry Benchmark:</span>
              <span className="font-bold">{current['Industry Benchmark']}%</span>
            </div>
            <div className="flex justify-between items-center text-slate-200">
              <span>Skill Gap Index:</span>
              <span
                className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                  current.gap > 20
                    ? 'bg-rose-500/20 text-rose-300'
                    : current.gap > 0
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-emerald-500/20 text-emerald-300'
                }`}
              >
                {current.gap > 0 ? `-${current.gap}% Shortfall` : '+4% Surplus'}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="skill-radar-container" className="w-full flex flex-col items-center justify-center">
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={formattedData}>
            <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="skill"
              tick={{ fill: '#334155', fontSize: 11, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: '#64748b', fontSize: 10 }}
            />
            <Radar
              name="Current Syllabus Level"
              dataKey="Syllabus Level"
              stroke="#059669"
              fill="#059669"
              fillOpacity={0.38}
              strokeWidth={2}
            />
            <Radar
              name="Industry Market Benchmark"
              dataKey="Industry Benchmark"
              stroke="#D97706"
              fill="#D97706"
              fillOpacity={0.22}
              strokeWidth={2}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                paddingTop: '12px',
                fontSize: '12px',
                fontWeight: 600,
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
