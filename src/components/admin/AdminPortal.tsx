import React, { useState } from 'react';
import {
  Building2,
  TrendingUp,
  Award,
  Users,
  Briefcase,
  FileSpreadsheet,
  CheckCircle,
  Download,
  Filter,
  ShieldCheck,
  Globe,
  PieChart as PieIcon,
  BarChart3,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ADMIN_ANALYTICS } from '../../data/mockData';

export const AdminPortal: React.FC = () => {
  const [downloading, setDownloading] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const handleExportData = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setExportNotice('AyushSetu National Skill Mapping & Placement Report (FY 2025-26) exported successfully.');
      setTimeout(() => setExportNotice(null), 4000);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {exportNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-semibold text-emerald-900 flex items-center justify-between shadow-xs">
          <span>{exportNotice}</span>
          <button onClick={() => setExportNotice(null)} className="text-emerald-700 hover:text-emerald-900">✕</button>
        </div>
      )}
      {/* Top Banner / Metrics */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-purple-100 border border-purple-300 flex items-center justify-center text-purple-800">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black text-slate-900 font-serif">
                  Central Ayush Admin & Policy Dashboard
                </h2>
                <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                  Ministry of Ayush, New Delhi
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Apex real-time telemetry: Pan-India student credential verification, industry absorption rates, and curriculum alignment indices.
              </p>
            </div>
          </div>

          <button
            id="admin-export-report-btn"
            onClick={handleExportData}
            disabled={downloading}
            className="flex items-center space-x-2 px-4 py-2.5 bg-[#1B4D3E] hover:bg-[#153e32] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-900/10 shrink-0 self-start md:self-auto"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Compiling National Report...' : 'Export National Skill Report'}</span>
          </button>
        </div>

        {/* 4 Apex KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
            <span className="text-[11px] font-semibold text-emerald-800 block">
              Active National MoUs
            </span>
            <span className="text-2xl font-black text-emerald-950 font-serif mt-1 block">
              {ADMIN_ANALYTICS.activeMoUs}
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">
              100% Legally Binding & Funded
            </span>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
            <span className="text-[11px] font-semibold text-blue-800 block">
              Pan-India Placement Rate
            </span>
            <span className="text-2xl font-black text-blue-950 font-serif mt-1 block">
              {ADMIN_ANALYTICS.panIndiaPlacementRate}%
            </span>
            <span className="text-[10px] text-blue-700 font-semibold mt-0.5 block">
              +18.2% YoY Absorption
            </span>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200">
            <span className="text-[11px] font-semibold text-amber-800 block">
              Verified Student Profiles
            </span>
            <span className="text-2xl font-black text-amber-950 font-serif mt-1 block">
              {ADMIN_ANALYTICS.verifiedStudents.toLocaleString()}
            </span>
            <span className="text-[10px] text-amber-700 font-semibold mt-0.5 block">
              Across 320+ AYUSH Colleges
            </span>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
            <span className="text-[11px] font-semibold text-purple-800 block">
              Participating AYUSH Industries
            </span>
            <span className="text-2xl font-black text-purple-950 font-serif mt-1 block">
              {ADMIN_ANALYTICS.participatingIndustries}
            </span>
            <span className="text-[10px] text-purple-700 font-semibold mt-0.5 block">
              Pharma, CROs & Hospitals
            </span>
          </div>
        </div>
      </div>

      {/* Two-column Visualizations: Top Demanded Skills & Sector Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Top Demanded Skills */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900 font-serif">
                Top Demanded Skills Across Herbal Pharma & Wellness
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Calculated from 1,260+ active job openings and industry recruitment requisitions.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Live CDSCO Demand
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {ADMIN_ANALYTICS.topDemandedSkills.map((skill) => (
              <div key={skill.name} className="space-y-1 text-xs">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>{skill.name}</span>
                  <span className="text-emerald-800">{skill.percentage}% Employers Require</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full"
                    style={{ width: `${skill.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Sector Distribution Pie / Donut */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 font-serif">
              Sector Placement Distribution
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Breakdown of student internship absorption by Ayush industry vertical.
            </p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ADMIN_ANALYTICS.sectorDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {ADMIN_ANALYTICS.sectorDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }: any) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-2 rounded-lg text-xs">
                          <p className="font-bold">{item.sector}</p>
                          <p className="text-amber-400">{item.count}% of Total Placements</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100">
            {ADMIN_ANALYTICS.sectorDistribution.map((item) => (
              <div key={item.sector} className="flex items-center space-x-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-sm shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-600 truncate">{item.sector}</span>
                <span className="font-bold text-slate-800">{item.count}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* State-Wise Adoption and Placement Performance Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-black text-slate-900 font-serif">
              State-Wise AyushSetu Adoption & Placement Success Index
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Accredited colleges, active scholar enrollments, and placement conversion rates across leading Ayurvedic states.
            </p>
          </div>
          <span className="text-xs text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
            Kerala & Delhi NCR Lead at &gt;90% Placement
          </span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ADMIN_ANALYTICS.stateAdoptionData} margin={{ top: 10, right: 30, left: 0, bottom: 15 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="state" tick={{ fill: '#334155', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} domain={[0, 100]} />
              <Tooltip
                content={({ active, payload }: any) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl text-xs">
                        <p className="font-bold text-amber-400 mb-1">{item.state}</p>
                        <p className="text-slate-200">Colleges Onboarded: {item.colleges}</p>
                        <p className="text-slate-200">Registered Students: {item.students}</p>
                        <p className="font-bold text-emerald-300">
                          Placement Conversion: {item.placement}%
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
              <Bar
                name="Placement Conversion Rate (%)"
                dataKey="placement"
                fill="#1B4D3E"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
