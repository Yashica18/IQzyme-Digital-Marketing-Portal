import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  FileCheck, 
  Printer, 
  ArrowRight, 
  Building, 
  Activity, 
  Globe, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { RegulatoryStrategyResult } from '../types';

interface StrategyGeneratorProps {
  onApplyToBooking?: (strategySummary: string) => void;
}

export default function StrategyGenerator({ onApplyToBooking }: StrategyGeneratorProps) {
  const [companyName, setCompanyName] = useState('NextGen MedTech Systems');
  const [productType, setProductType] = useState('Point-of-Care Molecular Diagnostic & Automated Cartridge System');
  const [currentStage, setCurrentStage] = useState('Bench Verification & Pilot Testing');
  const [targetMarkets, setTargetMarkets] = useState('India (CDSCO), US (FDA 510k), EU (MDR/IVDR)');
  const [budgetUrgency, setBudgetUrgency] = useState('Expedited 6-9 Month Commercialization');
  
  const [generating, setGenerating] = useState(false);
  const [strategyResult, setStrategyResult] = useState<RegulatoryStrategyResult | null>({
    title: 'Regulatory Acceleration Blueprint for Point-of-Care Molecular Diagnostic System',
    executiveSummary: 'Entering CDSCO, US FDA, and EU MDR concurrently requires a synchronized technical dossier architecture. Rather than treating each jurisdiction in isolation, IQzyme recommends generating a Unified STED (Summary Technical Documentation) core compliant with IMDRF standards. By establishing ISO 13485:2016 quality management controls upfront, testing protocols can be executed once to satisfy both FDA QMSR and EU MDR General Safety and Performance Requirements (GSPR Annex I).',
    classificationMatrix: {
      cdsco: 'Class C (In Vitro Diagnostic - Form MD-14 for Import / Form MD-7 for Manufacturing)',
      fda: 'Class II Premarket Notification 510(k) (Product Code: QJR / JJX)',
      euMdr: 'Class C under EU IVDR 2017/746 Annex VIII Rule 3',
    },
    recommendedSubmissionSequence: [
      {
        step: 1,
        action: 'ISO 13485:2016 QMS & STED Dossier Architecture',
        jurisdiction: 'Global Core',
        timeline: 'Months 1–3',
        reasoning: 'Prevents duplicate laboratory runs by specifying cross-harmonized test endpoints upfront.',
      },
      {
        step: 2,
        action: 'CDSCO Form MD-14 / MD-7 Filing & NABL Evaluation',
        jurisdiction: 'India (CDSCO)',
        timeline: 'Months 4–7',
        reasoning: 'Fastest pathway to market revenue; establishes real-world clinical performance data.',
      },
      {
        step: 3,
        action: 'US FDA 510(k) eSTAR Submission & Pre-Sub Q-Submission',
        jurisdiction: 'United States (FDA)',
        timeline: 'Months 6–10',
        reasoning: 'Capitalizes on CDSCO diagnostic sensitivity bench data to demonstrate substantial equivalence.',
      },
      {
        step: 4,
        action: 'EU IVDR Notified Body Technical File Review',
        jurisdiction: 'European Union',
        timeline: 'Months 9–15',
        reasoning: 'Finalizes CE mark with established clinical post-market performance data from early commercial lots.',
      },
    ],
    criticalTestingRoadmap: [
      {
        standard: 'ISO 14971:2019 + A11:2021',
        description: 'Comprehensive risk management file across hardware, reagents, and operator error.',
        estimatedTurnaround: '4–6 Weeks',
      },
      {
        standard: 'IEC 61010-1 & IEC 61010-2-101',
        description: 'Electrical and mechanical safety for In Vitro Diagnostic laboratory equipment.',
        estimatedTurnaround: '8–10 Weeks',
      },
      {
        standard: 'IEC 62304:2015 & FDA Section 524B',
        description: 'Software lifecycle Class B architecture, cybersecurity SBOM, and vulnerability disclosures.',
        estimatedTurnaround: '6–8 Weeks',
      },
      {
        standard: 'CLSI EP05-A3 & EP17-A2',
        description: 'Evaluation of precision, limit of blank (LoB), limit of detection (LoD), and analytical specificity.',
        estimatedTurnaround: '8–12 Weeks',
      },
    ],
    gapChecklist: [
      {
        item: 'Device Master File (DMF) & Plant Master File (PMF) per CDSCO Table 3',
        status: 'Required',
        notes: 'Must contain complete raw bench validation data, batch manufacturing records, and stability protocols.',
      },
      {
        item: 'Software Bill of Materials (SBOM) & Section 524B Cybersecurity File',
        status: 'Required',
        notes: 'Machine-readable CycloneDX inventory of all third-party libraries and runtime components.',
      },
      {
        item: 'General Safety and Performance Requirements (GSPR) Checklist',
        status: 'Required',
        notes: 'Annex I cross-reference table indicating exact evidence files for each statutory clause.',
      },
      {
        item: 'Clinical Performance Study Protocol (ISO 20916:2019)',
        status: 'Recommended',
        notes: 'Pre-submission alignment with ethics committees to establish diagnostic accuracy metrics.',
      },
    ],
  });

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/generate-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          productType,
          currentStage,
          targetMarkets,
          budgetUrgency,
        }),
      });
      const data = await res.json();
      if (data.success && data.strategy) {
        setStrategyResult(data.strategy);
      }
    } catch (e) {
      console.error('Error generating strategy:', e);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div id="strategy-generator-module" className="bg-white rounded-2xl border border-brand-cloudy/30 p-6 md:p-8 shadow-xs space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-cloudy/20 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00C4B7]/15 text-[#00C4B7] text-xs font-bold uppercase tracking-wider">
            <Sparkles size={13} />
            On-Demand Strategy Engine
          </div>
          <h3 className="font-display font-medium text-2xl md:text-3xl text-brand-blue">
            Bespoke Medical Device Regulatory Strategy Playbook
          </h3>
          <p className="text-xs md:text-sm text-brand-dusk max-w-3xl">
            Configure your device parameters below to generate an immediate, audit-grade market access roadmap, classification matrix, and critical laboratory testing schedule powered by IQzyme intelligence.
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="px-6 py-3 bg-[#00C4B7] hover:bg-[#00b0a4] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow hover:scale-102 transition flex items-center justify-center gap-2 cursor-pointer self-start md:self-auto shrink-0"
        >
          <RefreshCw size={15} className={generating ? 'animate-spin' : ''} />
          <span>{generating ? 'Synthesizing Dossier...' : 'Generate Custom Playbook'}</span>
        </button>
      </div>

      {/* Input Configuration Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-[#FAF9F5] p-5 rounded-xl border border-brand-cloudy/30">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-blue mb-1 flex items-center gap-1">
            <Building size={13} />
            Company / Innovator Name
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full text-xs bg-white border border-brand-cloudy/40 rounded-lg p-2.5 font-medium text-brand-dusk focus:outline-hidden focus:border-brand-blue"
            placeholder="e.g. Acme Medtech Inc."
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-blue mb-1 flex items-center gap-1">
            <Activity size={13} />
            Product Description & Technology
          </label>
          <input
            type="text"
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            className="w-full text-xs bg-white border border-brand-cloudy/40 rounded-lg p-2.5 font-medium text-brand-dusk focus:outline-hidden focus:border-brand-blue"
            placeholder="e.g. AI Holter Monitor, Orthopedic Screw, IVD ELISA"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-blue mb-1 flex items-center gap-1">
            <Compass size={13} />
            Current Development Stage
          </label>
          <select
            value={currentStage}
            onChange={(e) => setCurrentStage(e.target.value)}
            className="w-full text-xs bg-white border border-brand-cloudy/40 rounded-lg p-2.5 font-medium text-brand-dusk focus:outline-hidden focus:border-brand-blue"
          >
            <option value="Concept & Design Feasibility">Concept & Design Feasibility</option>
            <option value="Bench Verification & Pilot Testing">Bench Verification & Pilot Testing</option>
            <option value="Clinical Evaluation / Clinical Trial">Clinical Evaluation / Clinical Trial</option>
            <option value="Technical Dossier Assembled / Ready to File">Technical Dossier Assembled / Ready to File</option>
            <option value="Addressing Statutory Audit Deficiencies">Addressing Statutory Audit Deficiencies</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-blue mb-1 flex items-center gap-1">
            <Globe size={13} />
            Target Commercial Geographies
          </label>
          <input
            type="text"
            value={targetMarkets}
            onChange={(e) => setTargetMarkets(e.target.value)}
            className="w-full text-xs bg-white border border-brand-cloudy/40 rounded-lg p-2.5 font-medium text-brand-dusk focus:outline-hidden focus:border-brand-blue"
            placeholder="e.g. CDSCO (India), US FDA, EU MDR, UK MHRA"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-blue mb-1">
            Commercial Urgency & Strategic Focus
          </label>
          <input
            type="text"
            value={budgetUrgency}
            onChange={(e) => setBudgetUrgency(e.target.value)}
            className="w-full text-xs bg-white border border-brand-cloudy/40 rounded-lg p-2.5 font-medium text-brand-dusk focus:outline-hidden focus:border-brand-blue"
            placeholder="e.g. Fast-track FDA 510(k) before Q4 investor milestone"
          />
        </div>
      </div>

      {/* Generated Strategy Output */}
      {strategyResult && (
        <div className="space-y-6 pt-2">
          {/* Title and Executive Summary */}
          <div className="bg-gradient-to-br from-[#FAF9F5] to-brand-sand/40 p-6 rounded-2xl border border-brand-cloudy/30 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-blue">
                Tailored Strategic Memorandum
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 border border-brand-cloudy/40 text-brand-dusk hover:bg-white text-xs font-semibold rounded flex items-center gap-1 cursor-pointer"
                >
                  <Printer size={12} />
                  <span>Print Brief</span>
                </button>
              </div>
            </div>

            <h4 className="font-display font-medium text-xl text-brand-blue">
              {strategyResult.title}
            </h4>

            <p className="text-xs md:text-sm text-brand-dusk leading-relaxed">
              {strategyResult.executiveSummary}
            </p>
          </div>

          {/* Classification Matrix */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-blue block">
              Multi-Jurisdiction Classification Matrix
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white border border-brand-cloudy/30 rounded-xl space-y-1.5 shadow-xs">
                <span className="text-[11px] font-bold uppercase text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  India (CDSCO MDR 2017)
                </span>
                <p className="text-xs font-semibold text-brand-blue mt-1">
                  {strategyResult.classificationMatrix.cdsco}
                </p>
              </div>

              <div className="p-4 bg-white border border-brand-cloudy/30 rounded-xl space-y-1.5 shadow-xs">
                <span className="text-[11px] font-bold uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  United States (FDA CDRH)
                </span>
                <p className="text-xs font-semibold text-brand-blue mt-1">
                  {strategyResult.classificationMatrix.fda}
                </p>
              </div>

              <div className="p-4 bg-white border border-brand-cloudy/30 rounded-xl space-y-1.5 shadow-xs">
                <span className="text-[11px] font-bold uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  European Union (MDR / IVDR)
                </span>
                <p className="text-xs font-semibold text-brand-blue mt-1">
                  {strategyResult.classificationMatrix.euMdr}
                </p>
              </div>
            </div>
          </div>

          {/* Submission Sequence */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-blue block">
              Recommended Sequential Market Access Steps
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {strategyResult.recommendedSubmissionSequence.map((step) => (
                <div key={step.step} className="p-4 bg-[#FAF9F5] border border-brand-cloudy/30 rounded-xl space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="w-6 h-6 rounded-full bg-brand-blue text-white text-xs font-bold flex items-center justify-center">
                        {step.step}
                      </span>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-brand-sand text-brand-blue">
                        {step.timeline}
                      </span>
                    </div>
                    <span className="font-display font-bold text-xs text-brand-blue block leading-snug">
                      {step.action}
                    </span>
                    <span className="text-[10px] text-brand-topaz font-semibold">
                      {step.jurisdiction}
                    </span>
                  </div>
                  <p className="text-[11px] text-brand-dusk leading-normal pt-1 border-t border-brand-cloudy/20">
                    {step.reasoning}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Laboratory Testing Roadmap & Gap Checklist Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Testing Roadmap */}
            <div className="bg-white border border-brand-cloudy/30 rounded-xl p-5 space-y-3 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-blue block">
                Critical Standard & Testing Protocols
              </span>
              <div className="space-y-2.5">
                {strategyResult.criticalTestingRoadmap.map((t, idx) => (
                  <div key={idx} className="p-3 bg-[#FAF9F5] border border-brand-cloudy/20 rounded-lg flex items-start justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <span className="font-mono font-bold text-brand-blue block">
                        {t.standard}
                      </span>
                      <p className="text-[11px] text-brand-dusk">
                        {t.description}
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold text-brand-dusk bg-brand-sand px-2 py-0.5 rounded whitespace-nowrap">
                      {t.estimatedTurnaround}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gap Checklist */}
            <div className="bg-white border border-brand-cloudy/30 rounded-xl p-5 space-y-3 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-blue block">
                Mandatory Dossier Deliverables Checklist
              </span>
              <div className="space-y-2.5">
                {strategyResult.gapChecklist.map((c, idx) => (
                  <div key={idx} className="p-3 bg-[#FAF9F5] border border-brand-cloudy/20 rounded-lg space-y-1 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-brand-blue flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-[#00C4B7] shrink-0" />
                        {c.item}
                      </span>
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                        c.status === 'Required' 
                          ? 'bg-rose-100 text-rose-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {c.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-brand-dusk pl-5">
                      {c.notes}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Direct CTA */}
          <div className="bg-brand-blue text-white p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-0.5 text-center sm:text-left">
              <span className="text-xs font-bold text-[#00C4B7] uppercase tracking-wider">
                Ready to execute this exact blueprint?
              </span>
              <p className="text-xs text-brand-cloudy">
                Our former Lead Auditors and regulatory scientists execute this roadmap with zero filing rework.
              </p>
            </div>

            <button
              onClick={() => {
                if (onApplyToBooking) {
                  onApplyToBooking(`Execution of Strategy Blueprint: ${strategyResult.title} (${companyName})`);
                }
              }}
              className="px-5 py-2.5 bg-[#00C4B7] hover:bg-[#00b0a4] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition shadow-xs flex items-center gap-2 cursor-pointer shrink-0"
            >
              <span>Book Strategy Execution Session</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
