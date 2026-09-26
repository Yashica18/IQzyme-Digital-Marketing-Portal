import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Sparkles, 
  RefreshCw, 
  Sliders, 
  ShieldCheck, 
  BarChart3, 
  ArrowUpRight,
  Send,
  Download
} from 'lucide-react';
import { ClientLivingDashboardData } from '../types';
import GlobalComplianceChart from './GlobalComplianceChart';

interface LivingClientDashboardProps {
  userEmail?: string;
  companyName?: string;
}

export default function LivingClientDashboard({ userEmail, companyName }: LivingClientDashboardProps) {
  const [data, setData] = useState<ClientLivingDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [acceleratedMode, setAcceleratedMode] = useState<boolean>(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/client-portal/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientEmail: userEmail || 'innovator@medtech-preview.com',
          companyName: companyName || 'CardioVascular Biosystems Ltd',
          deviceType: 'Cardiovascular Diagnostic Monitor (Class C / Class II)',
        }),
      });
      const result = await res.json();
      if (result.success && result.data) {
        setData(result.data);
      }
    } catch (e) {
      console.error('Error fetching dynamic dashboard:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [userEmail, companyName]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-brand-cloudy/30 p-12 text-center space-y-3">
        <RefreshCw size={28} className="animate-spin text-brand-blue mx-auto" />
        <p className="text-xs text-brand-dusk font-medium">
          Loading live client regulatory telemetry, dossier scores, and milestone timelines...
        </p>
      </div>
    );
  }

  if (!data) return null;

  const effectiveReadinessScore = acceleratedMode ? Math.min(100, data.overallReadinessScore + 12) : data.overallReadinessScore;
  const effectiveApprovalDate = acceleratedMode ? 'September 2026 (Accelerated by 60 Days)' : data.predictedApprovalDate;

  return (
    <div id="living-client-dashboard" className="space-y-6">
      {/* Top Banner with Real-Time Project Telemetry */}
      <div className="bg-gradient-to-r from-brand-blue via-[#26354D] to-[#1F293D] p-6 rounded-2xl text-white shadow-md border border-brand-cloudy/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#00C4B7]">
              Living Client Dossier Telemetry
            </span>
          </div>
          <h3 className="font-display font-medium text-2xl text-white">
            {data.projectName}
          </h3>
          <p className="text-xs text-brand-cloudy">
            Device Scope: <strong className="text-white">{data.deviceType}</strong> • Target Registrations: {data.targetMarkets.join(', ')}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={() => setAcceleratedMode(!acceleratedMode)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              acceleratedMode
                ? 'bg-[#00C4B7] text-white shadow-xs'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Sliders size={14} />
            <span>{acceleratedMode ? 'Reliance Path Active' : 'Simulate Reliance Fast-Track'}</span>
          </button>

          <button
            onClick={fetchDashboard}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition cursor-pointer"
            title="Refresh Live Data"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Top 3 Metric Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Readiness Score */}
        <div className="bg-white p-5 rounded-2xl border border-brand-cloudy/30 shadow-xs flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-brand-dusk/70 tracking-wider">
              Technical Dossier Readiness
            </span>
            <div className="font-display font-bold text-3xl text-brand-blue">
              {effectiveReadinessScore}%
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
              {acceleratedMode ? '+12% with MDSAP Reliance' : 'Audit Ready for Phase 4'}
            </span>
          </div>

          <div className="relative w-16 h-16 shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-brand-cloudy/30"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#00C4B7] transition-all duration-700"
                strokeDasharray={`${effectiveReadinessScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-brand-blue">
              {effectiveReadinessScore}%
            </span>
          </div>
        </div>

        {/* Predicted Approval Date */}
        <div className="bg-white p-5 rounded-2xl border border-brand-cloudy/30 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-brand-dusk/70 tracking-wider">
            Predicted Market Authorization
          </span>
          <div className="font-display font-bold text-2xl text-brand-blue flex items-center gap-2">
            <Calendar size={22} className="text-[#00C4B7]" />
            {effectiveApprovalDate}
          </div>
          <p className="text-[11px] text-brand-dusk">
            Based on current CDSCO & FDA CDRH median review cycles
          </p>
        </div>

        {/* Quality System Standing */}
        <div className="bg-white p-5 rounded-2xl border border-brand-cloudy/30 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-brand-dusk/70 tracking-wider">
            Quality Management Conformance
          </span>
          <div className="font-display font-bold text-2xl text-brand-blue flex items-center gap-2">
            <ShieldCheck size={22} className="text-emerald-600" />
            ISO 13485:2016
          </div>
          <p className="text-[11px] text-emerald-800 font-medium">
            Stage 1 Audit successfully concluded with 0 major non-conformances
          </p>
        </div>
      </div>

      {/* Global Regulatory Compliance Rate Recharts Dashboard Section */}
      <div className="bg-white p-6 rounded-2xl border border-brand-cloudy/30 shadow-xs">
        <GlobalComplianceChart metrics={data.globalComplianceRates} />
      </div>

      {/* Main Layout: Milestones & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Milestones Progression */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-brand-cloudy/30 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-medium text-lg text-brand-blue">
              Regulatory Submission Lifecycle & Audit Gateways
            </h4>
            <span className="text-[11px] text-brand-dusk">
              Live Stage Tracking
            </span>
          </div>

          <div className="space-y-4">
            {data.milestones.map((milestone, idx) => (
              <div key={idx} className="p-4 bg-[#FAF9F5] border border-brand-cloudy/30 rounded-xl space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center ${
                      milestone.status === 'Completed'
                        ? 'bg-emerald-600 text-white'
                        : milestone.status === 'In Progress'
                        ? 'bg-blue-600 text-white'
                        : 'bg-brand-cloudy text-brand-dusk'
                    }`}>
                      {milestone.status === 'Completed' ? '✓' : idx + 1}
                    </span>
                    <span className="font-display font-bold text-xs sm:text-sm text-brand-blue">
                      {milestone.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      milestone.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : milestone.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-brand-sand text-brand-dusk'
                    }`}>
                      {milestone.status}
                    </span>
                    <span className="text-[11px] text-brand-dusk hidden sm:inline">
                      {milestone.targetDate}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-brand-cloudy/30 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      milestone.status === 'Completed'
                        ? 'bg-emerald-500'
                        : milestone.status === 'In Progress'
                        ? 'bg-blue-600'
                        : 'bg-brand-cloudy'
                    }`}
                    style={{ width: `${milestone.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Dossier Sections Readiness Table */}
          <div className="pt-4 border-t border-brand-cloudy/20 space-y-3">
            <h5 className="font-display font-medium text-sm text-brand-blue">
              STED & GSPR Dossier Component Breakdown
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.dossierSectionsReadiness.map((sec, sIdx) => (
                <div
                  key={sIdx}
                  onClick={() => setSelectedSection(sec.section)}
                  className="p-3 bg-[#FAF9F5] border border-brand-cloudy/30 hover:border-brand-blue rounded-xl space-y-1.5 transition cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-brand-blue">
                    <span>{sec.section}</span>
                    <span className="font-mono text-[11px] text-[#00C4B7]">{sec.score}%</span>
                  </div>
                  <div className="w-full bg-brand-cloudy/30 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-[#00C4B7] h-full rounded-full" style={{ width: `${sec.score}%` }} />
                  </div>
                  <p className="text-[10px] text-brand-dusk truncate">
                    Pending: {sec.pendingGaps.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Regulatory Alerts Feed */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white p-6 rounded-2xl border border-brand-cloudy/30 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                <AlertTriangle size={14} />
                Live Regulatory Watchdog
              </span>
              <span className="text-[10px] text-brand-dusk font-mono">Matched to Class C</span>
            </div>

            <div className="space-y-3">
              {data.activeAlerts.map((alert, aIdx) => (
                <div key={aIdx} className="p-3.5 bg-rose-50/60 border border-rose-200 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                      {alert.urgency}
                    </span>
                  </div>
                  <h6 className="font-display font-bold text-xs text-rose-950">
                    {alert.title}
                  </h6>
                  <p className="text-[11px] text-rose-900 leading-normal">
                    {alert.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Direct IQzyme Dedicated Auditor Card */}
          <div className="bg-gradient-to-br from-brand-sand/50 to-white p-5 rounded-2xl border border-brand-cloudy/30 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#00C4B7]">
              Assigned Lead Regulatory Lead
            </span>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-blue text-white font-bold flex items-center justify-center text-sm">
                IQ
              </div>
              <div>
                <span className="font-bold text-xs text-brand-blue block">Dr. S. Mukherjee, RAC</span>
                <span className="text-[11px] text-brand-dusk">Former BSI Technical Specialist</span>
              </div>
            </div>
            <p className="text-[11px] text-brand-dusk">
              Weekly progress standup scheduled for Thursdays at 10:30 AM IST.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
