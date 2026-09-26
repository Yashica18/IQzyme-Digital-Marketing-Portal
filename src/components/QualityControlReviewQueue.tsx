/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, XCircle, Clock, 
  Search, Filter, RefreshCw, Award, FileText, ChevronDown, ChevronUp,
  Sparkles, Check, AlertCircle, Eye, CornerDownRight, ArrowUpRight
} from 'lucide-react';
import { HumanReviewItem, ClaudeSelfCritique } from '../types';

export default function QualityControlReviewQueue() {
  const [queue, setQueue] = useState<HumanReviewItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('ALL');

  // Active review drawer / modal state
  const [activeReviewItem, setActiveReviewItem] = useState<HumanReviewItem | null>(null);
  const [reviewerName, setReviewerName] = useState<string>('Dr. P. S. Chandranand');
  const [reviewerCredential, setReviewerCredential] = useState<string>('RAC-GLOBAL-2024-8921');
  const [reviewerRole, setReviewerRole] = useState<string>('Lead RA Specialist & Auditor');
  const [auditNotes, setAuditNotes] = useState<string>('');
  const [amendContentMode, setAmendContentMode] = useState<boolean>(false);
  const [amendedContentText, setAmendedContentText] = useState<string>('');
  const [isSubmittingAction, setIsSubmittingAction] = useState<boolean>(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string>('');

  // Sandbox On-Demand Claude Critique Tool
  const [sandboxOpen, setSandboxOpen] = useState<boolean>(false);
  const [sandboxText, setSandboxText] = useState<string>('');
  const [sandboxDevice, setSandboxDevice] = useState<string>('Class C Active Diagnostic Ultrasound Transducer');
  const [sandboxClass, setSandboxClass] = useState<string>('Class C (CDSCO) / Class II (FDA)');
  const [sandboxJurisdiction, setSandboxJurisdiction] = useState<string>('India (CDSCO)');
  const [sandboxRunning, setSandboxRunning] = useState<boolean>(false);
  const [sandboxResult, setSandboxResult] = useState<ClaudeSelfCritique | null>(null);
  const [sandboxError, setSandboxError] = useState<string>('');

  // Fetch Review Queue from Backend API
  const fetchQueue = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/human-review-queue');
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      setQueue(data.queue || []);
    } catch (err: any) {
      console.error('Failed to load review queue:', err);
      setError(err.message || 'Failed to connect to Review Queue service');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  // Handle Action (Approve / Amend / Reject)
  const handleReviewAction = async (action: 'APPROVE' | 'REJECT') => {
    if (!activeReviewItem) return;
    if (!reviewerName.trim()) {
      alert('Reviewer Name is mandatory for high-stakes regulatory sign-off.');
      return;
    }
    if (!reviewerCredential.trim()) {
      alert('RAC Credential ID is required for auditable human-in-the-loop compliance.');
      return;
    }

    setIsSubmittingAction(true);
    setActionSuccessMsg('');

    try {
      const res = await fetch(`/api/human-review-queue/${activeReviewItem.id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          reviewerName,
          racCredentialId: reviewerCredential,
          roleTitle: reviewerRole,
          auditNotes: auditNotes || 'Audited against applicable statutory rules and ISO standards.',
          amendedContent: amendContentMode && amendedContentText.trim() ? amendedContentText : undefined,
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `HTTP error ${res.status}`);
      }

      const resData = await res.json();
      setActionSuccessMsg(
        action === 'APPROVE'
          ? (amendContentMode ? 'Dossier approved with amendments & fed into dynamic learning directives!' : 'Dossier verified and signed with RAC regulatory clearance.')
          : 'Dossier flagged with statutory defect and returned for revision.'
      );

      // Refresh Queue
      await fetchQueue();

      setTimeout(() => {
        setActiveReviewItem(null);
        setActionSuccessMsg('');
        setAuditNotes('');
        setAmendContentMode(false);
      }, 1500);

    } catch (err: any) {
      console.error('Failed to submit review action:', err);
      alert(err.message || 'Failed to submit review action');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  // Run On-Demand Claude Critique in Sandbox
  const handleRunOnDemandCritique = async () => {
    if (!sandboxText.trim()) {
      setSandboxError('Please provide regulatory draft text to critique.');
      return;
    }
    setSandboxRunning(true);
    setSandboxError('');
    setSandboxResult(null);

    try {
      const res = await fetch('/api/quality-control/run-critique', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: sandboxText,
          deviceClass: sandboxClass,
          jurisdiction: sandboxJurisdiction,
          module: 'Custom Draft Dossier Audit',
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `HTTP error ${res.status}`);
      }

      const data = await res.json();
      setSandboxResult(data.critique);
    } catch (err: any) {
      console.error('Sandbox critique failed:', err);
      setSandboxError(err.message || 'Critique audit failed');
    } finally {
      setSandboxRunning(false);
    }
  };

  // Filter Queue Items
  const filteredQueue = queue.filter(item => {
    const matchesSearch = 
      (item.deviceTitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.deviceClass || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.module || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.assignedReviewer || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = 
      statusFilter === 'ALL' ||
      (statusFilter === 'PENDING' && item.status === 'PENDING_RA_REVIEW') ||
      (statusFilter === 'APPROVED' && (item.status === 'APPROVED_WITH_AMENDMENTS' || item.status === 'VERIFIED_AND_SIGNED')) ||
      (statusFilter === 'REJECTED' && item.status === 'REJECTED_STATUTORY_DEFECT');

    const matchesUrgency = 
      urgencyFilter === 'ALL' || item.urgency === urgencyFilter;

    return matchesSearch && matchesStatus && matchesUrgency;
  });

  const pendingCount = queue.filter(q => q.status === 'PENDING_RA_REVIEW').length;
  const criticalCount = queue.filter(q => q.urgency === 'CRITICAL' && q.status === 'PENDING_RA_REVIEW').length;
  const verifiedCount = queue.filter(q => q.status === 'APPROVED_WITH_AMENDMENTS' || q.status === 'VERIFIED_AND_SIGNED').length;

  return (
    <div id="qc-review-queue-root" className="space-y-6">
      
      {/* Top Banner: Quality Control Architecture Overview */}
      <div className="bg-gradient-to-r from-[#2D3A55] to-[#1E273A] text-white p-6 rounded-xl shadow-sm border border-brand-cloudy/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-[#00C4B7]/20 text-[#00C4B7] rounded-md">
                <ShieldCheck size={18} />
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#00C4B7] font-bold">
                Quality Control Engine · Claude Self-Critique &amp; Human-in-the-Loop
              </span>
            </div>
            <h2 className="font-display font-medium text-2xl text-white">
              Regulatory Review Queue &amp; Sign-off Hub
            </h2>
            <p className="text-xs text-brand-cloudy max-w-2xl leading-relaxed">
              High-stakes medical device submissions (Class C/D, SaMD AI, and active implantables) are automatically intercepted by Claude 3.5 Sonnet for multi-metric adversarial statutory critique, citation verification, and enqueued here for RAC Regulatory Specialist clearance.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setSandboxOpen(true)}
              className="px-4 h-10 bg-[#00C4B7] hover:bg-[#00b0a4] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles size={14} />
              <span>Live Claude Audit Sandbox</span>
            </button>
            <button
              onClick={fetchQueue}
              disabled={loading}
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer"
              title="Refresh Review Queue"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Real-time KPI Metric Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
          <div className="bg-white/5 rounded-lg p-3 border border-white/5">
            <p className="text-[10px] font-mono text-brand-cloudy uppercase">Pending RA Sign-offs</p>
            <p className="text-2xl font-display font-bold text-amber-400 mt-0.5">{pendingCount}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/5">
            <p className="text-[10px] font-mono text-brand-cloudy uppercase">Critical Urgency</p>
            <p className="text-2xl font-display font-bold text-rose-400 mt-0.5">{criticalCount}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/5">
            <p className="text-[10px] font-mono text-brand-cloudy uppercase">RAC Verified &amp; Cleared</p>
            <p className="text-2xl font-display font-bold text-emerald-400 mt-0.5">{verifiedCount}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/5">
            <p className="text-[10px] font-mono text-brand-cloudy uppercase">Claude Critique Engine</p>
            <p className="text-xs font-semibold text-[#00C4B7] mt-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#00C4B7] animate-pulse" />
              <span>Claude 3.5 Sonnet Active</span>
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-brand-cloudy/30 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-dusk" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search device, class, reviewer..."
            className="w-full h-10 pl-9 pr-3 bg-[#FAF9F5] border border-brand-cloudy/40 rounded-lg text-xs text-brand-blue focus:outline-none focus:ring-2 focus:ring-[#00C4B7]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-[#FAF9F5] p-1 rounded-lg border border-brand-cloudy/30 text-xs">
            <span className="text-[10px] font-bold text-brand-dusk uppercase px-2">Status:</span>
            {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded font-semibold text-[11px] transition-colors cursor-pointer ${
                  statusFilter === st ? 'bg-[#2D3A55] text-white' : 'text-brand-dusk hover:text-brand-blue'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Urgency Filter */}
          <div className="flex items-center gap-1 bg-[#FAF9F5] p-1 rounded-lg border border-brand-cloudy/30 text-xs">
            <span className="text-[10px] font-bold text-brand-dusk uppercase px-2">Urgency:</span>
            {(['ALL', 'CRITICAL', 'HIGH', 'STANDARD'] as const).map(urg => (
              <button
                key={urg}
                onClick={() => setUrgencyFilter(urg)}
                className={`px-2.5 py-1 rounded font-semibold text-[11px] transition-colors cursor-pointer ${
                  urgencyFilter === urg ? 'bg-[#00C4B7] text-white' : 'text-brand-dusk hover:text-brand-blue'
                }`}
              >
                {urg}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Review Queue Item Cards */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-xl border border-brand-cloudy/30">
          <RefreshCw size={24} className="animate-spin text-[#00C4B7] mx-auto mb-2" />
          <p className="text-xs text-brand-dusk">Retrieving human review queue &amp; Claude self-critiques...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-3">
          <AlertCircle size={18} className="shrink-0" />
          <div>
            <p className="font-bold">Failed to load Review Queue</p>
            <p>{error}</p>
          </div>
        </div>
      ) : filteredQueue.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-brand-cloudy/30 space-y-2">
          <CheckCircle2 size={32} className="text-emerald-500 mx-auto" />
          <h3 className="font-display font-medium text-base text-brand-blue">Review Queue Clear</h3>
          <p className="text-xs text-brand-dusk max-w-md mx-auto">
            No regulatory dossiers currently require human clearance under the selected filters. All high-stakes submissions have either been approved or auto-cleared.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQueue.map((item) => {
            const critique = item.critique;
            const isPending = item.status === 'PENDING_RA_REVIEW';
            const isApproved = item.status === 'APPROVED_WITH_AMENDMENTS' || item.status === 'VERIFIED_AND_SIGNED';
            const isRejected = item.status === 'REJECTED_STATUTORY_DEFECT';

            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl border transition-all duration-200 shadow-sm overflow-hidden ${
                  item.urgency === 'CRITICAL' && isPending
                    ? 'border-rose-300 ring-1 ring-rose-200'
                    : isApproved
                    ? 'border-emerald-200'
                    : 'border-brand-cloudy/30'
                }`}
              >
                {/* Item Top Header */}
                <div className="p-5 border-b border-brand-cloudy/20 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#FAF9F5]/60">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Urgency Pill */}
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                        item.urgency === 'CRITICAL' 
                          ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                          : item.urgency === 'HIGH'
                          ? 'bg-amber-100 text-amber-700 border border-amber-200'
                          : 'bg-blue-100 text-blue-700 border border-blue-200'
                      }`}>
                        {item.urgency} Urgency
                      </span>

                      {/* Status Pill */}
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded flex items-center gap-1 ${
                        isPending 
                          ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                          : isApproved
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {isPending ? <Clock size={11} /> : isApproved ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                        <span>{item.status.replace(/_/g, ' ')}</span>
                      </span>

                      {/* Module Pill */}
                      <span className="px-2 py-0.5 text-[10px] font-medium bg-brand-blue/5 text-brand-blue rounded border border-brand-cloudy/25">
                        {item.module}
                      </span>
                    </div>

                    <h3 className="font-display font-semibold text-lg text-brand-blue flex items-center gap-2">
                      <span>{item.deviceTitle}</span>
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-brand-dusk">
                      <span><strong>Classification:</strong> {item.deviceClass}</span>
                      <span>•</span>
                      <span><strong>Jurisdictions:</strong> {item.jurisdictions.join(', ')}</span>
                      <span>•</span>
                      <span><strong>Assigned RA Auditor:</strong> {item.assignedReviewer}</span>
                    </div>
                  </div>

                  {/* Claude Critique Score Header Pill */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-[10px] font-mono text-brand-dusk uppercase">Claude Quality Score</p>
                      <div className="flex items-center gap-1.5 justify-end">
                        <span className={`text-2xl font-display font-bold ${
                          critique.compositeScore >= 85 ? 'text-emerald-600' : critique.compositeScore >= 75 ? 'text-amber-600' : 'text-rose-600'
                        }`}>
                          {critique.compositeScore}
                        </span>
                        <span className="text-xs text-brand-dusk font-bold">/ 100</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setActiveReviewItem(item);
                        setAmendedContentText(typeof item.generatedContent === 'string' ? item.generatedContent : JSON.stringify(item.generatedContent, null, 2));
                        setAuditNotes(item.humanSignoff?.auditNotes || '');
                      }}
                      className={`px-4 h-10 font-bold text-xs uppercase tracking-wider rounded-lg shadow transition-all flex items-center gap-1.5 cursor-pointer ${
                        isPending 
                          ? 'bg-[#2D3A55] hover:bg-[#1E273A] text-white' 
                          : 'bg-[#FAF9F5] hover:bg-white text-brand-blue border border-brand-cloudy/40'
                      }`}
                    >
                      <Award size={14} className={isApproved ? 'text-emerald-500' : 'text-[#99CE43]'} />
                      <span>{isPending ? 'Audit & Sign-off' : 'View Audit Log'}</span>
                    </button>
                  </div>
                </div>

                {/* Claude Self-Critique Detailed Diagnostic Section */}
                <div className="p-5 space-y-4">
                  {/* Rubric Breakdown Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-[#FAF9F5] p-3 rounded-lg border border-brand-cloudy/25">
                    <div>
                      <p className="text-[10px] text-brand-dusk uppercase font-mono">Statutory Accuracy</p>
                      <p className="text-sm font-bold text-brand-blue">{critique.rubricScores.statutoryAccuracy} <span className="text-[10px] text-brand-cloudy font-normal">/ 25</span></p>
                    </div>
                    <div>
                      <p className="text-[10px] text-brand-dusk uppercase font-mono">Classification Soundness</p>
                      <p className="text-sm font-bold text-brand-blue">{critique.rubricScores.classificationSoundness} <span className="text-[10px] text-brand-cloudy font-normal">/ 25</span></p>
                    </div>
                    <div>
                      <p className="text-[10px] text-brand-dusk uppercase font-mono">Testing Completeness</p>
                      <p className="text-sm font-bold text-brand-blue">{critique.rubricScores.testingCompleteness} <span className="text-[10px] text-brand-cloudy font-normal">/ 20</span></p>
                    </div>
                    <div>
                      <p className="text-[10px] text-brand-dusk uppercase font-mono">Hallucination Check</p>
                      <p className="text-sm font-bold text-brand-blue">{critique.rubricScores.hallucinationCheck} <span className="text-[10px] text-brand-cloudy font-normal">/ 15</span></p>
                    </div>
                    <div>
                      <p className="text-[10px] text-brand-dusk uppercase font-mono">Defensibility</p>
                      <p className="text-sm font-bold text-brand-blue">{critique.rubricScores.defensibility} <span className="text-[10px] text-brand-cloudy font-normal">/ 15</span></p>
                    </div>
                  </div>

                  {/* Verified Citations & Critical Findings */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Citations Verified */}
                    <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-lg space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        <span>Verified Citations ({critique.citationsVerified.length})</span>
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {critique.citationsVerified.map((c, i) => (
                          <span key={i} className="text-[11px] bg-white px-2 py-0.5 rounded border border-emerald-200 text-emerald-900 font-medium">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Critical Weaknesses Detected */}
                    <div className="p-3 bg-rose-50/70 border border-rose-200/80 rounded-lg space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1">
                        <AlertTriangle size={12} />
                        <span>Detected Deficiencies ({critique.criticalWeaknesses.length})</span>
                      </p>
                      <ul className="text-[11px] text-rose-900 space-y-1 list-disc list-inside">
                        {critique.criticalWeaknesses.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Corrective Amendments Recommended */}
                    <div className="p-3 bg-sky-50/70 border border-sky-200/80 rounded-lg space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-sky-800 flex items-center gap-1">
                        <Sparkles size={12} />
                        <span>Claude Amendments ({critique.correctiveAmendments.length})</span>
                      </p>
                      <ul className="text-[11px] text-sky-900 space-y-1 list-disc list-inside">
                        {critique.correctiveAmendments.map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Disposition Reason */}
                  <div className="text-xs text-brand-dusk bg-white p-3 rounded-lg border border-brand-cloudy/25 flex items-start gap-2">
                    <span className="font-bold text-brand-blue shrink-0">Disposition Notice:</span>
                    <span>{critique.dispositionReason}</span>
                  </div>

                  {/* Human Sign-off Seal (if already signed) */}
                  {item.humanSignoff && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-600 text-white rounded-full">
                          <Award size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-emerald-900">
                            RAC Certified Sign-off by {item.humanSignoff.reviewerName}
                          </p>
                          <p className="text-[11px] text-emerald-700">
                            Credential: <span className="font-mono font-bold">{item.humanSignoff.racCredentialId}</span> • Signed on {new Date(item.humanSignoff.signedAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-emerald-800 mt-1 italic">
                            "{item.humanSignoff.auditNotes}"
                          </p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider rounded shrink-0">
                        Regulatory Clearance Granted
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Audit & Sign-off Action Modal */}
      {activeReviewItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl border border-brand-cloudy/30 overflow-hidden my-8 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 bg-[#2D3A55] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#00C4B7]/20 text-[#00C4B7] rounded-lg">
                  <Award size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#00C4B7]">
                    High-Stakes Regulatory Action
                  </span>
                  <h3 className="font-display font-medium text-lg text-white">
                    Audit &amp; Sign-off: {activeReviewItem.deviceTitle}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setActiveReviewItem(null)}
                className="p-1.5 text-brand-cloudy hover:text-white rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5 text-left">
              {actionSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span className="font-semibold">{actionSuccessMsg}</span>
                </div>
              )}

              {/* Summary Badges */}
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 bg-brand-blue/5 border border-brand-cloudy/30 rounded font-semibold text-brand-blue">
                  Class: {activeReviewItem.deviceClass}
                </span>
                <span className="px-2.5 py-1 bg-brand-blue/5 border border-brand-cloudy/30 rounded font-semibold text-brand-blue">
                  Module: {activeReviewItem.module}
                </span>
                <span className="px-2.5 py-1 bg-[#00C4B7]/10 border border-[#00C4B7]/30 rounded font-semibold text-[#00C4B7]">
                  Claude Score: {activeReviewItem.critique.compositeScore}/100
                </span>
              </div>

              {/* Claude's Findings Summary */}
              <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-lg space-y-2">
                <p className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle size={14} />
                  <span>Claude Audit Disposition: {activeReviewItem.critique.disposition.replace(/_/g, ' ')}</span>
                </p>
                <p className="text-xs text-amber-800 leading-relaxed">
                  {activeReviewItem.critique.dispositionReason}
                </p>
              </div>

              {/* Auditor Sign-off Form */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-blue border-b border-brand-cloudy/20 pb-1">
                  1. RAC Regulatory Affairs Specialist Verification
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-brand-dusk">Auditor Name</label>
                    <input
                      type="text"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="w-full h-9 px-3 bg-[#FAF9F5] border border-brand-cloudy/40 rounded text-xs text-brand-blue"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-brand-dusk">RAC Credential ID</label>
                    <input
                      type="text"
                      value={reviewerCredential}
                      onChange={(e) => setReviewerCredential(e.target.value)}
                      placeholder="e.g. RAC-GLOBAL-2024-8921"
                      className="w-full h-9 px-3 bg-[#FAF9F5] border border-brand-cloudy/40 rounded text-xs text-brand-blue font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-brand-dusk">Role Title</label>
                    <input
                      type="text"
                      value={reviewerRole}
                      onChange={(e) => setReviewerRole(e.target.value)}
                      className="w-full h-9 px-3 bg-[#FAF9F5] border border-brand-cloudy/40 rounded text-xs text-brand-blue"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-brand-dusk">Audit &amp; Statutory Notes</label>
                  <textarea
                    value={auditNotes}
                    onChange={(e) => setAuditNotes(e.target.value)}
                    rows={2}
                    placeholder="Document clinical evidence review, standards cross-checks, or specific clauses validated..."
                    className="w-full p-3 bg-[#FAF9F5] border border-brand-cloudy/40 rounded text-xs text-brand-blue"
                  />
                </div>
              </div>

              {/* Amend Content Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-blue">
                    2. Content Review &amp; Optional Amendments
                  </h4>
                  <button
                    type="button"
                    onClick={() => setAmendContentMode(prev => !prev)}
                    className="text-xs font-bold text-[#00C4B7] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>{amendContentMode ? 'Hide Editor' : 'Amend Content Before Sign-off'}</span>
                    <CornerDownRight size={12} />
                  </button>
                </div>

                {amendContentMode ? (
                  <div className="space-y-2">
                    <p className="text-[11px] text-brand-dusk italic">
                      Amending this content will update the final client dossier and automatically contribute to our dynamic feedback loop, teaching future generations these specific corrections!
                    </p>
                    <textarea
                      value={amendedContentText}
                      onChange={(e) => setAmendedContentText(e.target.value)}
                      rows={8}
                      className="w-full p-3 font-mono text-xs bg-[#FAF9F5] border border-brand-cloudy/40 rounded-lg text-brand-blue focus:ring-2 focus:ring-[#00C4B7]"
                    />
                  </div>
                ) : (
                  <div className="p-3 bg-[#FAF9F5] rounded-lg border border-brand-cloudy/25 max-h-48 overflow-y-auto text-xs text-brand-blue font-mono whitespace-pre-wrap">
                    {typeof activeReviewItem.generatedContent === 'string'
                      ? activeReviewItem.generatedContent
                      : JSON.stringify(activeReviewItem.generatedContent, null, 2)}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-[#FAF9F5] border-t border-brand-cloudy/20 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setActiveReviewItem(null)}
                className="px-4 h-10 border border-brand-cloudy/40 text-brand-dusk font-bold text-xs uppercase tracking-wider rounded hover:bg-white cursor-pointer w-full sm:w-auto"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  disabled={isSubmittingAction}
                  onClick={() => handleReviewAction('REJECT')}
                  className="flex-1 sm:flex-none px-4 h-10 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-bold text-xs uppercase tracking-wider rounded transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <XCircle size={14} />
                  <span>Flag Defect &amp; Reject</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmittingAction}
                  onClick={() => handleReviewAction('APPROVE')}
                  className="flex-1 sm:flex-none px-6 h-10 bg-[#00C4B7] hover:bg-[#00b0a4] text-white font-bold text-xs uppercase tracking-wider rounded shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Award size={15} />
                  <span>{amendContentMode ? 'Sign & Save Amendments' : 'Clear & Sign Dossier'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* On-Demand Claude Critique Testing Sandbox Modal */}
      {sandboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-brand-cloudy/30 overflow-hidden my-8 max-h-[90vh] flex flex-col">
            
            <div className="p-5 bg-[#2D3A55] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#99CE43]/20 text-[#99CE43] rounded-lg">
                  <Sparkles size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#99CE43]">
                    Adversarial Regulatory Auditor
                  </span>
                  <h3 className="font-display font-medium text-lg text-white">
                    Live Claude 3.5 Sonnet Self-Critique Sandbox
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSandboxOpen(false)}
                className="p-1.5 text-brand-cloudy hover:text-white rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-left">
              <p className="text-xs text-brand-dusk leading-relaxed">
                Paste any regulatory dossier excerpt, clinical trial protocol, or risk classification below. Claude 3.5 Sonnet will perform an immediate adversarial critique against official statutory rules.
              </p>

              {sandboxError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded flex items-center gap-2">
                  <AlertCircle size={14} />
                  <span>{sandboxError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-brand-dusk">Target Device &amp; Description</label>
                  <input
                    type="text"
                    value={sandboxDevice}
                    onChange={(e) => setSandboxDevice(e.target.value)}
                    className="w-full h-9 px-3 bg-[#FAF9F5] border border-brand-cloudy/40 rounded text-xs text-brand-blue"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-brand-dusk">Risk Class</label>
                  <input
                    type="text"
                    value={sandboxClass}
                    onChange={(e) => setSandboxClass(e.target.value)}
                    className="w-full h-9 px-3 bg-[#FAF9F5] border border-brand-cloudy/40 rounded text-xs text-brand-blue"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-brand-dusk">Regulatory Text Draft</label>
                <textarea
                  value={sandboxText}
                  onChange={(e) => setSandboxText(e.target.value)}
                  rows={5}
                  placeholder="Paste regulatory submission plan, timeline, testing standards, or predicate comparison here..."
                  className="w-full p-3 bg-[#FAF9F5] border border-brand-cloudy/40 rounded text-xs text-brand-blue font-mono"
                />
              </div>

              <button
                type="button"
                disabled={sandboxRunning}
                onClick={handleRunOnDemandCritique}
                className="w-full h-11 bg-[#2D3A55] hover:bg-[#1E273A] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {sandboxRunning ? (
                  <>
                    <RefreshCw size={14} className="animate-spin text-[#00C4B7]" />
                    <span>Claude Auditing Statutory Citations &amp; Risk Rubric...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} className="text-[#99CE43]" />
                    <span>Run Claude Adversarial Audit Now</span>
                  </>
                )}
              </button>

              {/* Sandbox Audit Results */}
              {sandboxResult && (
                <div className="p-4 bg-[#FAF9F5] border border-brand-cloudy/30 rounded-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-brand-cloudy/20 pb-2">
                    <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">
                      Audit Disposition: {sandboxResult.disposition}
                    </span>
                    <span className="text-lg font-display font-bold text-emerald-600">
                      {sandboxResult.compositeScore} / 100
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                    <div className="bg-white p-2 rounded border border-brand-cloudy/20">
                      <p className="text-[9px] text-brand-dusk uppercase">Statutory</p>
                      <p className="font-bold">{sandboxResult.rubricScores.statutoryAccuracy}/25</p>
                    </div>
                    <div className="bg-white p-2 rounded border border-brand-cloudy/20">
                      <p className="text-[9px] text-brand-dusk uppercase">Classification</p>
                      <p className="font-bold">{sandboxResult.rubricScores.classificationSoundness}/25</p>
                    </div>
                    <div className="bg-white p-2 rounded border border-brand-cloudy/20">
                      <p className="text-[9px] text-brand-dusk uppercase">Testing</p>
                      <p className="font-bold">{sandboxResult.rubricScores.testingCompleteness}/20</p>
                    </div>
                    <div className="bg-white p-2 rounded border border-brand-cloudy/20">
                      <p className="text-[9px] text-brand-dusk uppercase">Hallucination</p>
                      <p className="font-bold">{sandboxResult.rubricScores.hallucinationCheck}/15</p>
                    </div>
                    <div className="bg-white p-2 rounded border border-brand-cloudy/20">
                      <p className="text-[9px] text-brand-dusk uppercase">Defensibility</p>
                      <p className="font-bold">{sandboxResult.rubricScores.defensibility}/15</p>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-emerald-800">Verified Citations:</p>
                    <p className="text-brand-blue">{sandboxResult.citationsVerified.join(', ')}</p>
                  </div>

                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-rose-800">Critical Weaknesses Detected:</p>
                    <ul className="list-disc list-inside text-rose-900">
                      {sandboxResult.criticalWeaknesses.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-sky-800">Suggested Amendments:</p>
                    <ul className="list-disc list-inside text-sky-900">
                      {sandboxResult.correctiveAmendments.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
