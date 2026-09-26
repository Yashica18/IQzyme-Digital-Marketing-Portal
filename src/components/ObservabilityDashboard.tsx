/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Activity, DollarSign, Cpu, Clock, CheckCircle, AlertTriangle, 
  Search, RefreshCw, BarChart2, Zap, ArrowUpRight, ShieldAlert,
  Sliders, MessageSquare, PlusCircle, CheckCircle2, ChevronDown, ChevronUp, Layers
} from 'lucide-react';
import { ObservabilityStats, GenerationLog, SystemDirective } from '../types';

export default function ObservabilityDashboard() {
  const [stats, setStats] = useState<ObservabilityStats | null>(null);
  const [logs, setLogs] = useState<GenerationLog[]>([]);
  const [directives, setDirectives] = useState<SystemDirective[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Log filter
  const [logSearchQuery, setLogSearchQuery] = useState<string>('');
  const [logModuleFilter, setLogModuleFilter] = useState<string>('ALL');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  // New Directive / Feedback state
  const [showDirectiveModal, setShowDirectiveModal] = useState<boolean>(false);
  const [directiveAuthority, setDirectiveAuthority] = useState<'CDSCO' | 'US FDA' | 'EU MDR' | 'ISO 13485' | 'General'>('CDSCO');
  const [directiveTitle, setDirectiveTitle] = useState<string>('');
  const [directiveRule, setDirectiveRule] = useState<string>('');
  const [directiveRationale, setDirectiveRationale] = useState<string>('');
  const [isSubmittingDirective, setIsSubmittingDirective] = useState<boolean>(false);
  const [directiveSuccess, setDirectiveSuccess] = useState<string>('');

  const fetchObservabilityData = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, logsRes, directivesRes] = await Promise.all([
        fetch('/api/observability/stats'),
        fetch('/api/observability/logs?limit=50'),
        fetch('/api/feedback/directives'),
      ]);

      if (!statsRes.ok || !logsRes.ok || !directivesRes.ok) {
        throw new Error('Failed to fetch observability telemetry services');
      }

      const [statsData, logsData, directivesData] = await Promise.all([
        statsRes.json(),
        logsRes.json(),
        directivesRes.json(),
      ]);

      setStats(statsData.stats);
      setLogs(logsData.logs || []);
      setDirectives(directivesData.directives || []);
    } catch (err: any) {
      console.error('Error fetching observability telemetry:', err);
      setError(err.message || 'Telemetry connection error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObservabilityData();
  }, []);

  const handleCreateDirective = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directiveTitle.trim() || !directiveRule.trim()) {
      alert('Title and Rule Guidance are required.');
      return;
    }

    setIsSubmittingDirective(true);
    setDirectiveSuccess('');

    try {
      const res = await fetch('/api/feedback/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module: 'Manual RAC Directive Injection',
          rating: 5,
          isHelpful: true,
          tags: [directiveAuthority, 'Expert Feedback', 'System Policy'],
          expertCorrection: `${directiveTitle}: ${directiveRule} (Authority: ${directiveAuthority}. Rationale: ${directiveRationale})`,
          reviewerRole: 'Lead Regulatory Affairs Auditor',
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `HTTP error ${res.status}`);
      }

      setDirectiveSuccess('New regulatory rule successfully registered into active LLM prompt directives!');
      await fetchObservabilityData();

      setTimeout(() => {
        setShowDirectiveModal(false);
        setDirectiveSuccess('');
        setDirectiveTitle('');
        setDirectiveRule('');
        setDirectiveRationale('');
      }, 1400);

    } catch (err: any) {
      console.error('Failed to submit directive:', err);
      alert(err.message || 'Failed to submit directive');
    } finally {
      setIsSubmittingDirective(false);
    }
  };

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      (log.module || '').toLowerCase().includes(logSearchQuery.toLowerCase()) ||
      (log.engine || '').toLowerCase().includes(logSearchQuery.toLowerCase()) ||
      (log.jurisdiction || '').toLowerCase().includes(logSearchQuery.toLowerCase()) ||
      (log.promptSummary || '').toLowerCase().includes(logSearchQuery.toLowerCase());

    const matchesModule = logModuleFilter === 'ALL' || log.module === logModuleFilter;

    return matchesSearch && matchesModule;
  });

  return (
    <div id="observability-dashboard-root" className="space-y-6">
      
      {/* Top Banner: Observability & Cost Tracking */}
      <div className="bg-gradient-to-r from-[#1E273A] to-[#2D3A55] text-white p-6 rounded-xl shadow-sm border border-brand-cloudy/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-[#99CE43]/20 text-[#99CE43] rounded-md">
                <Activity size={18} />
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#99CE43] font-bold">
                Observability Suite · Telemetry, Cost Accounting &amp; Continuous Learning
              </span>
            </div>
            <h2 className="font-display font-medium text-2xl text-white">
              AI Generation Observability &amp; Feedback Loops
            </h2>
            <p className="text-xs text-brand-cloudy max-w-2xl leading-relaxed">
              Every regulatory generation is tracked for real token usage, latency (p95), multi-model USD cost, and Claude adversarial critique scores. Approved human amendments continuously feed back into system directives to improve compliance accuracy over time.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowDirectiveModal(true)}
              className="px-4 h-10 bg-[#99CE43] hover:bg-[#86b53b] text-brand-blue font-bold text-xs uppercase tracking-wider rounded-lg shadow transition-all flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle size={14} />
              <span>Inject Regulatory Directive</span>
            </button>
            <button
              onClick={fetchObservabilityData}
              disabled={loading}
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer"
              title="Refresh Telemetry"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Real-time Financial & Telemetry Metrics Cards */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-white/10">
            <div className="bg-white/5 rounded-lg p-3 border border-white/5">
              <p className="text-[10px] font-mono text-brand-cloudy uppercase flex items-center gap-1">
                <Layers size={11} className="text-[#00C4B7]" />
                <span>Generations</span>
              </p>
              <p className="text-xl font-display font-bold text-white mt-1">
                {stats.totalGenerations}
              </p>
              <p className="text-[9px] text-brand-cloudy mt-0.5">Tracked In Buffer</p>
            </div>

            <div className="bg-white/5 rounded-lg p-3 border border-white/5">
              <p className="text-[10px] font-mono text-brand-cloudy uppercase flex items-center gap-1">
                <DollarSign size={11} className="text-emerald-400" />
                <span>Total Cost</span>
              </p>
              <p className="text-xl font-display font-bold text-emerald-400 mt-1">
                ${stats.totalCostUsd.toFixed(4)}
              </p>
              <p className="text-[9px] text-brand-cloudy mt-0.5">
                Avg ${(stats.totalCostUsd / (stats.totalGenerations || 1)).toFixed(4)} / gen
              </p>
            </div>

            <div className="bg-white/5 rounded-lg p-3 border border-white/5">
              <p className="text-[10px] font-mono text-brand-cloudy uppercase flex items-center gap-1">
                <Cpu size={11} className="text-[#99CE43]" />
                <span>Total Tokens</span>
              </p>
              <p className="text-xl font-display font-bold text-white mt-1">
                {stats.totalTokens.toLocaleString()}
              </p>
              <p className="text-[9px] text-brand-cloudy mt-0.5">Input &amp; Output</p>
            </div>

            <div className="bg-white/5 rounded-lg p-3 border border-white/5">
              <p className="text-[10px] font-mono text-brand-cloudy uppercase flex items-center gap-1">
                <Clock size={11} className="text-amber-400" />
                <span>Avg Latency</span>
              </p>
              <p className="text-xl font-display font-bold text-amber-300 mt-1">
                {(stats.avgLatencyMs / 1000).toFixed(2)}s
              </p>
              <p className="text-[9px] text-brand-cloudy mt-0.5">p95: {(stats.p95LatencyMs / 1000).toFixed(2)}s</p>
            </div>

            <div className="bg-white/5 rounded-lg p-3 border border-white/5">
              <p className="text-[10px] font-mono text-brand-cloudy uppercase flex items-center gap-1">
                <CheckCircle size={11} className="text-[#00C4B7]" />
                <span>Claude Score</span>
              </p>
              <p className="text-xl font-display font-bold text-[#00C4B7] mt-1">
                {stats.avgCritiqueScore} <span className="text-xs text-white/50">/100</span>
              </p>
              <p className="text-[9px] text-brand-cloudy mt-0.5">Composite Quality</p>
            </div>

            <div className="bg-white/5 rounded-lg p-3 border border-white/5">
              <p className="text-[10px] font-mono text-brand-cloudy uppercase flex items-center gap-1">
                <ShieldAlert size={11} className="text-sky-400" />
                <span>Auto-Approved</span>
              </p>
              <p className="text-xl font-display font-bold text-sky-400 mt-1">
                {stats.autoApprovalRate}%
              </p>
              <p className="text-[9px] text-brand-cloudy mt-0.5">{stats.humanReviewQueueCount} in Review Queue</p>
            </div>
          </div>
        )}
      </div>

      {/* Financial Cost Breakdown: Model Engine & Regulatory Module */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Engine Cost Allocation */}
          <div className="bg-white p-5 rounded-xl border border-brand-cloudy/30 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-brand-cloudy/20 pb-2">
              <h3 className="font-display font-semibold text-sm text-brand-blue flex items-center gap-2">
                <BarChart2 size={16} className="text-[#00C4B7]" />
                <span>Cost Allocation by Model Engine</span>
              </h3>
              <span className="text-[10px] font-mono text-brand-dusk uppercase">Live Pricing Matrix</span>
            </div>

            <div className="space-y-3">
              {stats.engineCostBreakdown.map((eng, idx) => {
                const pct = stats.totalCostUsd > 0 ? (eng.costUsd / stats.totalCostUsd) * 100 : 0;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-brand-blue">{eng.engine}</span>
                      <span className="font-mono text-brand-dusk font-bold">
                        ${eng.costUsd.toFixed(4)} ({eng.count} calls)
                      </span>
                    </div>
                    <div className="w-full bg-[#FAF9F5] rounded-full h-2 overflow-hidden border border-brand-cloudy/20">
                      <div 
                        className={`h-full rounded-full ${
                          eng.engine.includes('Claude') ? 'bg-[#2D3A55]' : eng.engine.includes('Gemini') ? 'bg-[#00C4B7]' : 'bg-[#99CE43]'
                        }`}
                        style={{ width: `${Math.max(pct, 4)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Module Cost Allocation */}
          <div className="bg-white p-5 rounded-xl border border-brand-cloudy/30 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-brand-cloudy/20 pb-2">
              <h3 className="font-display font-semibold text-sm text-brand-blue flex items-center gap-2">
                <Zap size={16} className="text-[#99CE43]" />
                <span>Cost Breakdown by Regulatory Module</span>
              </h3>
              <span className="text-[10px] font-mono text-brand-dusk uppercase">Workload Footprint</span>
            </div>

            <div className="space-y-3">
              {stats.moduleCostBreakdown.map((mod, idx) => {
                const pct = stats.totalCostUsd > 0 ? (mod.costUsd / stats.totalCostUsd) * 100 : 0;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-brand-blue truncate max-w-[200px]">{mod.module}</span>
                      <span className="font-mono text-brand-dusk font-bold">
                        ${mod.costUsd.toFixed(4)} ({mod.count} runs)
                      </span>
                    </div>
                    <div className="w-full bg-[#FAF9F5] rounded-full h-2 overflow-hidden border border-brand-cloudy/20">
                      <div 
                        className="h-full rounded-full bg-[#00C4B7]"
                        style={{ width: `${Math.max(pct, 4)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Closed Feedback Loop & Dynamic System Directives */}
      <div className="bg-white p-5 rounded-xl border border-brand-cloudy/30 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-cloudy/20 pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sliders size={16} className="text-brand-blue" />
              <h3 className="font-display font-semibold text-base text-brand-blue">
                Active System Directives &amp; Continuous Learning Rules
              </h3>
            </div>
            <p className="text-xs text-brand-dusk">
              Feedback from human auditor approvals and expert amendments dynamically injects into all future Claude &amp; Gemini generation prompts to prevent repeat errors.
            </p>
          </div>
          <button
            onClick={() => setShowDirectiveModal(true)}
            className="px-3 h-9 bg-brand-blue/5 hover:bg-brand-blue/10 border border-brand-cloudy/30 text-brand-blue font-bold text-xs uppercase tracking-wider rounded flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <PlusCircle size={13} className="text-[#00C4B7]" />
            <span>Add Custom Rule</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {directives.map((dir) => (
            <div
              key={dir.id}
              className="p-4 bg-[#FAF9F5] border border-brand-cloudy/25 rounded-lg space-y-2 hover:border-[#00C4B7]/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-[#2D3A55] text-white">
                  {dir.authority}
                </span>
                <span className="text-[10px] font-mono text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 size={11} />
                  <span>{dir.confidenceScore}% Confidence</span>
                </span>
              </div>
              
              <h4 className="text-xs font-bold text-brand-blue">
                {dir.title}
              </h4>
              <p className="text-[11px] text-brand-dusk leading-relaxed">
                "{dir.ruleGuidance}"
              </p>
              <p className="text-[9px] text-brand-cloudy border-t border-brand-cloudy/20 pt-1.5 font-mono">
                Source: {dir.derivedFromCorrection}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Generation Telemetry Log Stream Table */}
      <div className="bg-white p-5 rounded-xl border border-brand-cloudy/30 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-brand-cloudy/20 pb-3">
          <div className="space-y-0.5">
            <h3 className="font-display font-semibold text-base text-brand-blue flex items-center gap-2">
              <Activity size={16} className="text-[#00C4B7]" />
              <span>Real-Time Generation Telemetry Logs</span>
            </h3>
            <p className="text-xs text-brand-dusk">
              Inspect latency, token count, cost, and adversarial Claude audit results for every regulatory prompt.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-brand-dusk" />
              <input
                type="text"
                value={logSearchQuery}
                onChange={(e) => setLogSearchQuery(e.target.value)}
                placeholder="Search telemetry..."
                className="h-9 pl-8 pr-3 bg-[#FAF9F5] border border-brand-cloudy/30 rounded text-xs text-brand-blue focus:outline-none focus:ring-1 focus:ring-[#00C4B7]"
              />
            </div>
          </div>
        </div>

        {/* Telemetry Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-brand-cloudy/25 text-[10px] font-mono uppercase text-brand-dusk">
                <th className="p-3">Timestamp</th>
                <th className="p-3">Module</th>
                <th className="p-3">Engine</th>
                <th className="p-3">Tokens (In/Out)</th>
                <th className="p-3">Latency</th>
                <th className="p-3">Cost ($)</th>
                <th className="p-3">Claude Score</th>
                <th className="p-3">Disposition</th>
                <th className="p-3">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-cloudy/15">
              {filteredLogs.map((log) => {
                const isExpanded = expandedLogId === log.id;
                return (
                  <React.Fragment key={log.id}>
                    <tr className="hover:bg-[#FAF9F5]/80 transition-colors">
                      <td className="p-3 text-brand-dusk font-mono text-[11px] whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="p-3 font-semibold text-brand-blue whitespace-nowrap">
                        {log.module}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-brand-blue/5 border border-brand-cloudy/20 text-brand-blue">
                          {log.engine}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-brand-dusk whitespace-nowrap">
                        {log.inputTokens.toLocaleString()} / {log.outputTokens.toLocaleString()}
                      </td>
                      <td className="p-3 font-mono text-brand-dusk whitespace-nowrap">
                        {(log.latencyMs / 1000).toFixed(2)}s
                      </td>
                      <td className="p-3 font-mono font-bold text-emerald-700 whitespace-nowrap">
                        ${log.estimatedCostUsd.toFixed(4)}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.critiqueScore >= 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {log.critiqueScore}/100
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          log.disposition === 'AUTO_APPROVED' 
                            ? 'bg-sky-50 text-sky-700 border border-sky-200' 
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {log.disposition.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <button
                          onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                          className="p-1 hover:bg-brand-blue/10 rounded cursor-pointer text-brand-dusk"
                          title="Toggle details"
                        >
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Row */}
                    {isExpanded && (
                      <tr className="bg-[#FAF9F5]/90 border-b border-brand-cloudy/25">
                        <td colSpan={9} className="p-4 space-y-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="space-y-1">
                              <p className="font-bold text-brand-blue">Prompt Intent Summary:</p>
                              <p className="text-brand-dusk font-mono bg-white p-2.5 rounded border border-brand-cloudy/20 leading-relaxed">
                                {log.promptSummary}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="font-bold text-brand-blue">Jurisdiction &amp; Telemetry Metadata:</p>
                              <div className="bg-white p-2.5 rounded border border-brand-cloudy/20 space-y-1 text-[11px] text-brand-dusk">
                                <p><strong>Jurisdiction:</strong> {log.jurisdiction}</p>
                                <p><strong>Total Tokens Processed:</strong> {log.totalTokens.toLocaleString()}</p>
                                <p><strong>Human Feedback Flag:</strong> {log.hasHumanFeedback ? 'Reinforced by Auditor' : 'Automated Baseline'}</p>
                                <p><strong>Telemetry Record ID:</strong> <span className="font-mono">{log.id}</span></p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Directive Injection Modal */}
      {showDirectiveModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-brand-cloudy/30 overflow-hidden text-left">
            <div className="p-5 bg-[#2D3A55] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders size={18} className="text-[#99CE43]" />
                <h3 className="font-display font-medium text-base text-white">
                  Register Learned Regulatory Directive
                </h3>
              </div>
              <button
                onClick={() => setShowDirectiveModal(false)}
                className="text-brand-cloudy hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDirective} className="p-6 space-y-4">
              {directiveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2">
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>{directiveSuccess}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-brand-dusk">Target Authority</label>
                <select
                  value={directiveAuthority}
                  onChange={(e) => setDirectiveAuthority(e.target.value as any)}
                  className="w-full h-9 px-3 bg-[#FAF9F5] border border-brand-cloudy/40 rounded text-xs text-brand-blue"
                >
                  <option value="CDSCO">CDSCO (India MDR 2017)</option>
                  <option value="US FDA">US FDA (21 CFR 820 / 510(k))</option>
                  <option value="EU MDR">EU MDR 2017/745</option>
                  <option value="ISO 13485">ISO 13485 / ISO 14971</option>
                  <option value="General">Global General Guidance</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-brand-dusk">Directive Title</label>
                <input
                  type="text"
                  value={directiveTitle}
                  onChange={(e) => setDirectiveTitle(e.target.value)}
                  placeholder="e.g. CDSCO Software Validation Requirement"
                  className="w-full h-9 px-3 bg-[#FAF9F5] border border-brand-cloudy/40 rounded text-xs text-brand-blue"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-brand-dusk">Rule Guidance (Injected into System Prompt)</label>
                <textarea
                  value={directiveRule}
                  onChange={(e) => setDirectiveRule(e.target.value)}
                  rows={3}
                  placeholder="e.g. For Class C/D AI SaMD, always mandate IEC 62304 Level C architecture and CDSCO Table 3 testing..."
                  className="w-full p-3 bg-[#FAF9F5] border border-brand-cloudy/40 rounded text-xs text-brand-blue"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-brand-dusk">Statutory Rationale / Audit Origin</label>
                <input
                  type="text"
                  value={directiveRationale}
                  onChange={(e) => setDirectiveRationale(e.target.value)}
                  placeholder="e.g. CDSCO Gazetted Order 2024 on SaMD validation protocols"
                  className="w-full h-9 px-3 bg-[#FAF9F5] border border-brand-cloudy/40 rounded text-xs text-brand-blue"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDirectiveModal(false)}
                  className="px-4 h-9 border border-brand-cloudy/30 rounded text-xs font-bold uppercase text-brand-dusk hover:bg-[#FAF9F5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingDirective}
                  className="px-5 h-9 bg-[#2D3A55] hover:bg-[#1E273A] text-white rounded text-xs font-bold uppercase tracking-wider cursor-pointer shadow transition-all"
                >
                  {isSubmittingDirective ? 'Registering...' : 'Register Directive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
