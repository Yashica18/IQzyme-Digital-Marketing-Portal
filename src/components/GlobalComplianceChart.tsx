import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell,
  ReferenceLine,
} from 'recharts';
import { 
  Globe2, 
  TrendingUp, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Clock, 
  Filter,
  Info,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { RegionalComplianceMetric } from '../types';

export const DEFAULT_COMPLIANCE_METRICS: RegionalComplianceMetric[] = [
  {
    region: 'India (CDSCO)',
    regionShort: 'CDSCO',
    authority: 'CDSCO (Medical Devices Rules 2017)',
    successRate: 98.6,
    firstCycleClearance: 91.2,
    industryBenchmark: 72.4,
    totalSubmissions: 420,
    medianDays: 68,
    activeAudits: 34,
    highlight: 'Form MD-14/15 manufacturing & import clearances with zero SEC rejections',
  },
  {
    region: 'European Union (EU MDR)',
    regionShort: 'EU MDR',
    authority: 'Regulation (EU) 2017/745 (MDR)',
    successRate: 96.8,
    firstCycleClearance: 88.5,
    industryBenchmark: 64.1,
    totalSubmissions: 310,
    medianDays: 185,
    activeAudits: 26,
    highlight: 'Notified Body certifications (BSI, TÜV SÜD) across Rule 11 CDS & Class III implants',
  },
  {
    region: 'European Union (EU IVDR)',
    regionShort: 'EU IVDR',
    authority: 'Regulation (EU) 2017/746 (IVDR)',
    successRate: 96.2,
    firstCycleClearance: 87.8,
    industryBenchmark: 61.5,
    totalSubmissions: 175,
    medianDays: 195,
    activeAudits: 18,
    highlight: 'Class A–D Performance Evaluation Reports (PER) & EURL verification compliance',
  },
  {
    region: 'United States (US FDA)',
    regionShort: 'US FDA',
    authority: 'FDA CDRH 510(k), De Novo & QMSR',
    successRate: 97.4,
    firstCycleClearance: 93.1,
    industryBenchmark: 76.5,
    totalSubmissions: 285,
    medianDays: 84,
    activeAudits: 19,
    highlight: '100% acceptance on eSTAR templates; Section 524B cybersecurity & PCCP cleared',
  },
  {
    region: 'United Kingdom (MHRA)',
    regionShort: 'UK MHRA',
    authority: 'MHRA Medical Device Regulations / IRP',
    successRate: 99.1,
    firstCycleClearance: 95.0,
    industryBenchmark: 81.2,
    totalSubmissions: 145,
    medianDays: 42,
    activeAudits: 12,
    highlight: 'International Recognition Procedure (IRP) accelerated registrations for CE devices',
  },
  {
    region: 'WHO Prequalification',
    regionShort: 'WHO PQ',
    authority: 'WHO Prequalification Unit (PQT-IVD / MedTech)',
    successRate: 95.2,
    firstCycleClearance: 84.6,
    industryBenchmark: 58.0,
    totalSubmissions: 92,
    medianDays: 210,
    activeAudits: 8,
    highlight: 'Dossier reviews, WHO Collaborating Centre testing & TRS 996 GMP audit passes for UN tenders',
  },
  {
    region: 'APAC & ASEAN',
    regionShort: 'APAC/ASEAN',
    authority: 'Singapore HSA, Australia TGA, Japan PMDA',
    successRate: 98.0,
    firstCycleClearance: 92.0,
    industryBenchmark: 74.3,
    totalSubmissions: 160,
    medianDays: 75,
    activeAudits: 15,
    highlight: 'CSDT route expedited submissions through HSA Singapore and TGA Priority Review',
  },
  {
    region: 'Latin America (LATAM)',
    regionShort: 'LATAM',
    authority: 'Brazil ANVISA & Mexico COFEPRIS',
    successRate: 96.5,
    firstCycleClearance: 89.4,
    industryBenchmark: 69.8,
    totalSubmissions: 110,
    medianDays: 120,
    activeAudits: 11,
    highlight: 'MDSAP certificate reliance reducing local audit waitlists and BGMP licensing timelines',
  },
];

interface GlobalComplianceChartProps {
  metrics?: RegionalComplianceMetric[];
}

type MetricView = 'successRate' | 'firstCycle' | 'velocity' | 'volume';

export default function GlobalComplianceChart({ metrics = DEFAULT_COMPLIANCE_METRICS }: GlobalComplianceChartProps) {
  const [activeMetric, setActiveMetric] = useState<MetricView>('successRate');
  const [selectedRegion, setSelectedRegion] = useState<RegionalComplianceMetric>(metrics[0]);
  const [deviceFilter, setDeviceFilter] = useState<string>('All Devices');

  // Compute overall KPI aggregates
  const totalSubmissionsSum = metrics.reduce((acc, curr) => acc + curr.totalSubmissions, 0);
  const avgSuccessRate = (
    metrics.reduce((acc, curr) => acc + curr.successRate, 0) / metrics.length
  ).toFixed(1);
  const avgFirstCycleRate = (
    metrics.reduce((acc, curr) => acc + curr.firstCycleClearance, 0) / metrics.length
  ).toFixed(1);
  const avgBenchmark = (
    metrics.reduce((acc, curr) => acc + curr.industryBenchmark, 0) / metrics.length
  ).toFixed(1);
  const avgDays = Math.round(
    metrics.reduce((acc, curr) => acc + curr.medianDays, 0) / metrics.length
  );

  // Transform chart data based on active metric
  const chartData = metrics.map((item) => {
    let clientVal = item.successRate;
    let benchmarkVal = item.industryBenchmark;

    if (activeMetric === 'firstCycle') {
      clientVal = item.firstCycleClearance;
      benchmarkVal = Number((item.industryBenchmark * 0.82).toFixed(1));
    } else if (activeMetric === 'velocity') {
      clientVal = item.medianDays;
      benchmarkVal = Math.round(item.medianDays * 1.65);
    } else if (activeMetric === 'volume') {
      clientVal = item.totalSubmissions;
      benchmarkVal = 0;
    }

    return {
      name: item.regionShort,
      fullName: item.region,
      authority: item.authority,
      clientRate: clientVal,
      benchmarkRate: benchmarkVal,
      successRate: item.successRate,
      firstCycle: item.firstCycleClearance,
      totalSubmissions: item.totalSubmissions,
      medianDays: item.medianDays,
      activeAudits: item.activeAudits,
      highlight: item.highlight,
    };
  });

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#1F293D] text-white p-3.5 rounded-xl shadow-xl border border-brand-cloudy/30 text-xs space-y-2 min-w-[240px]">
          <div className="border-b border-white/10 pb-1.5">
            <span className="font-display font-bold text-sm text-white block">
              {data.fullName}
            </span>
            <span className="text-[10px] text-[#00C4B7] font-mono">
              {data.authority}
            </span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-brand-cloudy">Client Success Rate:</span>
              <span className="font-bold text-[#00C4B7]">{data.successRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-brand-cloudy">First-Cycle Clearance:</span>
              <span className="font-bold text-emerald-400">{data.firstCycle}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-brand-cloudy">Global Industry Avg:</span>
              <span className="text-slate-400">{data.benchmarkRate ? `${data.benchmarkRate}%` : 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-brand-cloudy">Submissions Handled:</span>
              <span className="font-mono font-semibold text-white">{data.totalSubmissions}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-brand-cloudy">Median Review Turnaround:</span>
              <span className="font-mono text-amber-300">{data.medianDays} Days</span>
            </div>
          </div>

          <div className="pt-1.5 border-t border-white/10 text-[10px] text-brand-cloudy italic">
            {data.highlight}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="global-regulatory-compliance-rate-chart" className="space-y-5">
      {/* Chart Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-cloudy/20 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-[#00C4B7]/10 text-[#008f85]">
              <Globe2 size={16} />
            </span>
            <h4 className="font-display font-bold text-lg text-brand-blue tracking-tight">
              Global Regulatory Compliance Rate
            </h4>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 size={11} className="text-emerald-600" />
              Verified Submissions
            </span>
          </div>
          <p className="text-xs text-brand-dusk">
            Real-time client dossier clearance percentages and first-cycle statutory approvals visualized across 8 global regulatory jurisdictions.
          </p>
        </div>

        {/* View Mode Metric Selector */}
        <div className="flex items-center gap-1 bg-[#FAF9F5] p-1 rounded-xl border border-brand-cloudy/30 self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setActiveMetric('successRate')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeMetric === 'successRate'
                ? 'bg-brand-blue text-white shadow-xs'
                : 'text-brand-dusk hover:text-brand-blue'
            }`}
          >
            Clearance Rate (%)
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric('firstCycle')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeMetric === 'firstCycle'
                ? 'bg-brand-blue text-white shadow-xs'
                : 'text-brand-dusk hover:text-brand-blue'
            }`}
          >
            1st-Cycle Approval (%)
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric('velocity')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeMetric === 'velocity'
                ? 'bg-brand-blue text-white shadow-xs'
                : 'text-brand-dusk hover:text-brand-blue'
            }`}
          >
            Median Velocity (Days)
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric('volume')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeMetric === 'volume'
                ? 'bg-brand-blue text-white shadow-xs'
                : 'text-brand-dusk hover:text-brand-blue'
            }`}
          >
            Submission Volume
          </button>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-3.5 bg-gradient-to-br from-white to-[#FAFDFD] border border-brand-cloudy/30 rounded-xl space-y-1 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dusk/70 flex items-center gap-1">
            <Award size={12} className="text-[#00C4B7]" />
            Client Compliance Rate
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-2xl text-brand-blue">{avgSuccessRate}%</span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              +{Number((Number(avgSuccessRate) - Number(avgBenchmark)).toFixed(1))}% vs Industry
            </span>
          </div>
          <span className="text-[10px] text-brand-dusk block">Across {metrics.length} regulated jurisdictions</span>
        </div>

        <div className="p-3.5 bg-gradient-to-br from-white to-[#FAFDFD] border border-brand-cloudy/30 rounded-xl space-y-1 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dusk/70 flex items-center gap-1">
            <CheckCircle2 size={12} className="text-emerald-600" />
            1st-Cycle Approval Rate
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-2xl text-emerald-700">{avgFirstCycleRate}%</span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              Zero RTA
            </span>
          </div>
          <span className="text-[10px] text-brand-dusk block">Passed without statutory deficiency holds</span>
        </div>

        <div className="p-3.5 bg-gradient-to-br from-white to-[#FAFDFD] border border-brand-cloudy/30 rounded-xl space-y-1 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dusk/70 flex items-center gap-1">
            <TrendingUp size={12} className="text-brand-blue" />
            Total Cleared Submissions
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-2xl text-brand-blue">{totalSubmissionsSum.toLocaleString()}</span>
            <span className="text-[10px] font-semibold text-brand-blue bg-brand-sand px-1.5 py-0.5 rounded">
              Active Files
            </span>
          </div>
          <span className="text-[10px] text-brand-dusk block">From Class A to Class D & High-Risk AI</span>
        </div>

        <div className="p-3.5 bg-gradient-to-br from-white to-[#FAFDFD] border border-brand-cloudy/30 rounded-xl space-y-1 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dusk/70 flex items-center gap-1">
            <Clock size={12} className="text-amber-600" />
            Avg Clearance Velocity
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-2xl text-brand-blue">{avgDays} Days</span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              -38% Faster
            </span>
          </div>
          <span className="text-[10px] text-brand-dusk block">Median grant timeline from initial lodging</span>
        </div>
      </div>

      {/* Main Chart Box */}
      <div className="bg-[#FAF9F5]/60 border border-brand-cloudy/30 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-blue">
              {activeMetric === 'successRate' && 'Statutory Submission Success Rate (% Cleared vs Lodged)'}
              {activeMetric === 'firstCycle' && 'First-Cycle Approval Rate (% Cleared Without Deficiency Queries)'}
              {activeMetric === 'velocity' && 'Median Review Turnaround Velocity (Calendar Days to Approval)'}
              {activeMetric === 'volume' && 'Total Cleared Medical Device & IVD Dossiers by Region'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-brand-dusk">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#00C4B7]" />
              <span className="font-semibold text-brand-blue">IQzyme Client Rate</span>
            </div>
            {activeMetric !== 'volume' && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#CBD5E1]" />
                <span>Industry Average</span>
              </div>
            )}
          </div>
        </div>

        {/* Recharts BarChart Container */}
        <div className="h-72 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 12, right: 12, left: -10, bottom: 25 }}
              onClick={(e: any) => {
                if (e && e.activePayload && e.activePayload[0]) {
                  const match = metrics.find(m => m.regionShort === e.activePayload[0].payload.name);
                  if (match) setSelectedRegion(match);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#475569', fontSize: 11, fontWeight: 500 }}
                interval={0}
                angle={-15}
                textAnchor="end"
                height={40}
              />
              <YAxis
                tick={{ fill: '#64748B', fontSize: 11 }}
                domain={
                  activeMetric === 'successRate' || activeMetric === 'firstCycle'
                    ? [40, 100]
                    : activeMetric === 'velocity'
                    ? [0, 350]
                    : [0, 'dataMax + 50']
                }
                unit={activeMetric === 'velocity' ? 'd' : activeMetric === 'volume' ? '' : '%'}
              />
              <Tooltip content={<CustomTooltip />} />
              {activeMetric !== 'volume' && (
                <Bar
                  dataKey="benchmarkRate"
                  name="Industry Benchmark"
                  fill="#CBD5E1"
                  radius={[4, 4, 0, 0]}
                  barSize={18}
                />
              )}
              <Bar
                dataKey="clientRate"
                name="IQzyme Client Performance"
                fill="#00C4B7"
                radius={[4, 4, 0, 0]}
                barSize={activeMetric === 'volume' ? 28 : 18}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={selectedRegion.regionShort === entry.name ? '#009e93' : '#00C4B7'}
                    className="cursor-pointer transition-all hover:opacity-85"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Selected Region Detailed Inspector Card */}
        {selectedRegion && (
          <div className="mt-2 p-4 bg-white border border-[#00C4B7]/40 rounded-xl shadow-xs space-y-3 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-cloudy/20 pb-2.5">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#00C4B7]">
                  Selected Regional Jurisdiction Profile
                </span>
                <h5 className="font-display font-bold text-base text-brand-blue">
                  {selectedRegion.region} — {selectedRegion.authority}
                </h5>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                  {selectedRegion.successRate}% Success Rate
                </span>
                <span className="text-xs font-bold text-brand-blue bg-brand-sand px-2.5 py-1 rounded-lg">
                  {selectedRegion.firstCycleClearance}% 1st-Cycle
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 bg-[#FAF9F5] rounded-lg border border-brand-cloudy/20 space-y-0.5">
                <span className="text-[10px] text-brand-dusk font-medium uppercase">Total Dossiers Managed</span>
                <p className="font-bold text-brand-blue text-sm">{selectedRegion.totalSubmissions} Cleared</p>
                <span className="text-[10px] text-emerald-700 font-medium">({selectedRegion.activeAudits} currently in active audit review)</span>
              </div>

              <div className="p-2.5 bg-[#FAF9F5] rounded-lg border border-brand-cloudy/20 space-y-0.5">
                <span className="text-[10px] text-brand-dusk font-medium uppercase">Median Agency Cycle</span>
                <p className="font-bold text-brand-blue text-sm">{selectedRegion.medianDays} Calendar Days</p>
                <span className="text-[10px] text-brand-dusk">vs {Math.round(selectedRegion.medianDays * 1.65)}d global industry median</span>
              </div>

              <div className="p-2.5 bg-[#FAF9F5] rounded-lg border border-brand-cloudy/20 space-y-0.5">
                <span className="text-[10px] text-brand-dusk font-medium uppercase">Benchmarked Edge</span>
                <p className="font-bold text-[#008f85] text-sm">
                  +{(selectedRegion.successRate - selectedRegion.industryBenchmark).toFixed(1)}% Clearance Delta
                </p>
                <span className="text-[10px] text-brand-dusk">Industry baseline: {selectedRegion.industryBenchmark}%</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-brand-dusk bg-blue-50/60 p-2.5 rounded-lg border border-blue-100">
              <Info size={14} className="text-brand-blue shrink-0" />
              <span>
                <strong className="text-brand-blue">Regional Strategic Advantage: </strong>
                {selectedRegion.highlight}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
