import React, { useState } from 'react';
import { 
  GitMerge, 
  ShieldAlert, 
  Activity, 
  Calendar, 
  Coins, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  RefreshCw, 
  Layers, 
  Cpu, 
  FileText, 
  HelpCircle,
  TrendingDown,
  ArrowRight
} from 'lucide-react';
import { DynamicPathwayResult, RiskMatrixHazard } from '../types';

export default function DynamicInfographics() {
  const [activeTab, setActiveTab] = useState<'pathway' | 'risk-matrix' | 'samd-rule11'>('pathway');

  // ==========================================
  // PATHWAY GANTT ENGINE STATE
  // ==========================================
  const [deviceName, setDeviceName] = useState('AI-Enabled Cardiac Monitor & Diagnostic Holter');
  const [deviceCategory, setDeviceCategory] = useState('Cardiovascular Diagnostic');
  const [riskClass, setRiskClass] = useState('Class C / Class IIb');
  const [hasSoftware, setHasSoftware] = useState(true);
  const [isSterile, setIsSterile] = useState(false);
  const [generatingPathway, setGeneratingPathway] = useState(false);
  const [pathwayData, setPathwayData] = useState<DynamicPathwayResult | null>({
    deviceName: 'AI-Enabled Cardiac Monitor & Diagnostic Holter',
    deviceCategory: 'Cardiovascular Diagnostic',
    riskClass: 'Class C / Class IIb',
    totalEstimatedTimelineMonths: '10 – 14 Months',
    predicateStrategySummary: 'Substantial equivalence established with predicate cardiac rhythm monitors (Product Code: DSI / MWJ). Clinical performance demonstrated through multicenter registry data without full prospective clinical trial.',
    primaryStandardStack: [
      'ISO 13485:2016 (Quality Management Systems)',
      'ISO 14971:2019 (Risk Management for Medical Devices)',
      'IEC 62304:2015 (Software Lifecycle Processes - Class B/C)',
      'IEC 60601-1-2 4th Ed (Electromagnetic Compatibility)',
      'AAMI TIR57 / FDA Section 524B (Cybersecurity Risk)',
    ],
    keyRegulatoryPitfalls: [
      'FDA Refuse-To-Accept (RTA) if machine-readable SBOM (CycloneDX) is omitted from Section 12.',
      'CDSCO MDR 2017 Form MD-14 queries on NABL laboratory verification for wireless telemetry.',
      'EU MDR Annex I Rule 11 automatic up-classification to Class IIb due to real-time arrhythmia alerting.',
    ],
    comparativeMilestones: [
      {
        stage: 'Design Controls & QMS Traceability',
        jurisdiction: 'Global (ISO 13485)',
        durationMonths: 3,
        statutoryFeeEstimated: '₹0 (Internal / Advisory)',
        keyDeliverables: ['DHF Traceability Matrix', 'Software Verification Protocols (IEC 62304)', 'Risk Management File (ISO 14971)'],
        criticalRisks: ['Incomplete verification of machine learning anomaly detection boundary conditions'],
        notifiedBodyOrAgency: 'BSI / TÜV SÜD Audit Team',
      },
      {
        stage: 'Hardware Safety & EMC Bench Validation',
        jurisdiction: 'Multi-Jurisdiction',
        durationMonths: 3,
        statutoryFeeEstimated: '₹4,50,000 – ₹7,00,000',
        keyDeliverables: ['IEC 60601-1 Electrical Test Report', 'IEC 60601-1-2 EMC Report', 'ISO 10993-5/10 Biocompatibility'],
        criticalRisks: ['EMC failure on high-frequency radiated emissions near RF transmitter'],
        notifiedBodyOrAgency: 'NABL / GLP Accredited Test Lab',
      },
      {
        stage: 'CDSCO Form MD-14 Regulatory Submission',
        jurisdiction: 'India (CDSCO)',
        durationMonths: 5,
        statutoryFeeEstimated: '₹1,50,000 ($1,800)',
        keyDeliverables: ['Plant Master File (PMF)', 'Device Master File (DMF)', 'Clinical Performance Report (CPR)'],
        criticalRisks: ['Subject Expert Committee (SEC) questioning Indian population diagnostic sensitivity'],
        notifiedBodyOrAgency: 'Central Drugs Standard Control Organisation (CDSCO)',
      },
      {
        stage: 'US FDA 510(k) eSTAR Premarket Notification',
        jurisdiction: 'United States (FDA)',
        durationMonths: 5,
        statutoryFeeEstimated: '$21,744 (Standard) / $5,436 (Small Biz)',
        keyDeliverables: ['Substantial Equivalence Table', 'Cybersecurity Section 524B Dossier', 'eSTAR Technical File'],
        criticalRisks: ['FDA Request for Additional Information (AI) regarding algorithm drift mitigation'],
        notifiedBodyOrAgency: 'FDA CDRH Office of Health Technology (OHT2)',
      },
      {
        stage: 'EU MDR 2017/745 Notified Body Technical File Audit',
        jurisdiction: 'European Union',
        durationMonths: 11,
        statutoryFeeEstimated: '€22,000 – €32,000',
        keyDeliverables: ['GSPR Annex I Evidence File', 'Clinical Evaluation Report (CER Rev.4)', 'Post-Market Clinical Follow-up Plan'],
        criticalRisks: ['Notified body scheduling backlog pushing review cycle past planned product launch'],
        notifiedBodyOrAgency: 'EU Designated Notified Bodies (BSI, TÜV SÜD)',
      },
    ],
  });

  const handleRegeneratePathway = async () => {
    setGeneratingPathway(true);
    try {
      const res = await fetch('/api/generate-dynamic-pathway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceName,
          deviceCategory,
          riskClass,
          targetJurisdictions: ['India (CDSCO)', 'US FDA', 'EU MDR'],
          isSterile,
          hasSoftware,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setPathwayData(data.data);
      }
    } catch (err) {
      console.error('Failed to regenerate pathway:', err);
    } finally {
      setGeneratingPathway(false);
    }
  };

  // ==========================================
  // ISO 14971 RISK MATRIX STATE
  // ==========================================
  const [hazards, setHazards] = useState<RiskMatrixHazard[]>([
    {
      id: 'h1',
      domain: 'Software & Cyber',
      hazard: 'Memory Buffer Overflow during High Sample Rate Ingestion',
      foreseeableSequence: 'High telemetry load crashes cardiac algorithm worker thread, interrupting ECG waveform display.',
      preSeverity: 4,
      preProbability: 4,
      mitigationMeasure: 'Static buffer boundary enforcement, watchdog timer thread reboot within 250ms per IEC 62304 Class C.',
      postSeverity: 2,
      postProbability: 1,
    },
    {
      id: 'h2',
      domain: 'Electrical',
      hazard: 'Patient Electrode Leakage Current during Defibrillator Shock',
      foreseeableSequence: 'External cardiac shock arcs across unisolated lead traces, causing secondary myocardial burns.',
      preSeverity: 5,
      preProbability: 2,
      mitigationMeasure: 'Defibrillation-proof Type CF galvanic isolation barrier rated to 5kV per IEC 60601-1 Clause 8.5.5.',
      postSeverity: 2,
      postProbability: 1,
    },
    {
      id: 'h3',
      domain: 'Biocompatibility',
      hazard: 'Polymer Adhesive Cytotoxicity & Dermal Sensitization',
      foreseeableSequence: 'Patient wears continuous patch monitor for 14 days, developing severe allergic dermatitis.',
      preSeverity: 3,
      preProbability: 3,
      mitigationMeasure: 'Medical-grade hypoallergenic silicone hydrogel conforming to ISO 10993-5 and ISO 10993-10.',
      postSeverity: 1,
      postProbability: 1,
    },
    {
      id: 'h4',
      domain: 'Usability',
      hazard: 'Clinical User Inadvertently Disables Critical Arrhythmia Alarm',
      foreseeableSequence: 'Ambiguous toggle UI allows operator to mute ventricular tachycardia warning without confirmation.',
      preSeverity: 5,
      preProbability: 3,
      mitigationMeasure: 'Two-stage modal confirmation with mandatory visual alarm latching compliant with IEC 60601-1-8.',
      postSeverity: 2,
      postProbability: 1,
    },
    {
      id: 'h5',
      domain: 'Sterility',
      hazard: 'Transit Vibration Inducing Micro-Puncture in Pouch Seal',
      foreseeableSequence: 'Packaging seal failure exposes sterile electrode lead to environmental bacteria during shipment.',
      preSeverity: 4,
      preProbability: 2,
      mitigationMeasure: 'Sterile barrier validation per ISO 11607-1 with ASTM D4169 vibration stress and dye leak inspection.',
      postSeverity: 1,
      postProbability: 1,
    },
  ]);

  const [selectedHazard, setSelectedHazard] = useState<RiskMatrixHazard>(hazards[0]);
  const [generatingRisk, setGeneratingRisk] = useState(false);

  const handleRegenerateRisk = async () => {
    setGeneratingRisk(true);
    try {
      const res = await fetch('/api/generate-risk-matrix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceName,
          deviceCategory,
          indications: 'Patient monitoring and clinical diagnostic decisions',
          keyFeatures: `${hasSoftware ? 'Cloud connected firmware' : 'Hardware unit'}, ${isSterile ? 'Sterile single-use' : 'Reusable non-sterile'}`,
        }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.hazards)) {
        setHazards(data.hazards);
        setSelectedHazard(data.hazards[0]);
      }
    } catch (err) {
      console.error('Failed to regenerate risk matrix:', err);
    } finally {
      setGeneratingRisk(false);
    }
  };

  // ==========================================
  // SaMD RULE 11 DECISION TREE STATE
  // ==========================================
  const [samdQuestionStep, setSamdQuestionStep] = useState<number>(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleSelectAnswer = (key: string, val: string) => {
    setAnswers(prev => ({ ...prev, [key]: val }));
    setSamdQuestionStep(prev => prev + 1);
  };

  const resetDecisionTree = () => {
    setAnswers({});
    setSamdQuestionStep(1);
  };

  const getComputedSaMDClass = () => {
    if (answers.impact === 'death_or_irreversible') {
      return {
        classLabel: 'Class III (Highest Risk SaMD)',
        rule: 'EU MDR Annex VIII Rule 11(a) (First Indent)',
        guidance: 'MDCG 2019-11: Software intended to provide information used to take decisions with diagnosis or therapy that may cause death or irreversible deterioration of health. Requires direct Notified Body audit of clinical evaluation and IEC 62304 Class C.',
        color: 'border-rose-500 bg-rose-50 text-rose-900',
      };
    }
    if (answers.impact === 'serious_deterioration') {
      return {
        classLabel: 'Class IIb (Moderate-High Risk SaMD)',
        rule: 'EU MDR Annex VIII Rule 11(a) (Second Indent)',
        guidance: 'MDCG 2019-11: Software guiding diagnosis or therapy that may cause serious deterioration or surgical intervention. Requires full Quality Management audit and technical dossier certification.',
        color: 'border-amber-500 bg-amber-50 text-amber-900',
      };
    }
    if (answers.function === 'diagnosis_therapy') {
      return {
        classLabel: 'Class IIa (Standard Diagnostic SaMD)',
        rule: 'EU MDR Annex VIII Rule 11(a)',
        guidance: 'All other diagnostic or therapeutic software defaults to Class IIa under MDR Rule 11. Cannot be self-certified under EU MDR.',
        color: 'border-blue-500 bg-blue-50 text-blue-900',
      };
    }
    if (answers.function === 'physiological_monitoring') {
      return {
        classLabel: 'Class IIa / IIb (Vital Parameters)',
        rule: 'EU MDR Annex VIII Rule 11(b)',
        guidance: 'Software intended to monitor physiological processes: Class IIa, or Class IIb if nature of variations could result in immediate danger to the patient.',
        color: 'border-purple-500 bg-purple-50 text-purple-900',
      };
    }
    return {
      classLabel: 'Class I (Non-diagnostic / Administrative)',
      rule: 'EU MDR Annex VIII Rule 11(c)',
      guidance: 'All other software falls under Class I (e.g. basic appointment logging, general fitness tracking without medical claims).',
      color: 'border-emerald-500 bg-emerald-50 text-emerald-900',
    };
  };

  return (
    <div id="dynamic-infographics-module" className="space-y-6">
      {/* Sub-navigation tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-brand-cloudy/30 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('pathway')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'pathway'
                ? 'bg-brand-blue text-white shadow-xs'
                : 'text-brand-dusk hover:bg-brand-sand/60'
            }`}
          >
            <GitMerge size={14} />
            <span>Dynamic Submission Gantt</span>
          </button>

          <button
            onClick={() => setActiveTab('risk-matrix')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'risk-matrix'
                ? 'bg-brand-blue text-white shadow-xs'
                : 'text-brand-dusk hover:bg-brand-sand/60'
            }`}
          >
            <ShieldAlert size={14} />
            <span>ISO 14971 Risk Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('samd-rule11')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'samd-rule11'
                ? 'bg-brand-blue text-white shadow-xs'
                : 'text-brand-dusk hover:bg-brand-sand/60'
            }`}
          >
            <Cpu size={14} />
            <span>SaMD Rule 11 Decision Tree</span>
          </button>
        </div>

        <span className="text-[11px] text-brand-dusk font-medium hidden md:inline">
          Live Generative Visuals Engine
        </span>
      </div>

      {/* =========================================================================
          TAB 1: DYNAMIC SUBMISSION PATHWAY & TIMELINE GANTT
          ========================================================================= */}
      {activeTab === 'pathway' && (
        <div className="space-y-6">
          {/* Interactive Parameters Bar */}
          <div className="bg-white p-5 rounded-2xl border border-brand-cloudy/30 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-2 border-b border-brand-cloudy/20 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#00C4B7] flex items-center gap-1.5">
                <Sparkles size={14} />
                Interactive Timeline & Approval Parameter Controls
              </span>
              <button
                onClick={handleRegeneratePathway}
                disabled={generatingPathway}
                className="px-4 py-1.5 bg-[#00C4B7] hover:bg-[#00b0a4] text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition shadow-xs cursor-pointer"
              >
                <RefreshCw size={13} className={generatingPathway ? 'animate-spin' : ''} />
                <span>{generatingPathway ? 'Recalculating...' : 'Regenerate Pathway'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-brand-blue mb-1">
                  Device Trade Name
                </label>
                <input
                  type="text"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  className="w-full text-xs bg-[#FAF9F5] border border-brand-cloudy/30 rounded-lg p-2 font-medium text-brand-dusk focus:outline-hidden focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-brand-blue mb-1">
                  Regulatory Risk Class
                </label>
                <select
                  value={riskClass}
                  onChange={(e) => setRiskClass(e.target.value)}
                  className="w-full text-xs bg-[#FAF9F5] border border-brand-cloudy/30 rounded-lg p-2 font-medium text-brand-dusk focus:outline-hidden focus:border-brand-blue"
                >
                  <option value="Class A / Class I (Low Risk)">Class A / Class I (Low)</option>
                  <option value="Class B / Class IIa (Moderate Risk)">Class B / Class IIa (Moderate)</option>
                  <option value="Class C / Class IIb (Moderate-High)">Class C / Class IIb (Moderate-High)</option>
                  <option value="Class D / Class III (High Risk)">Class D / Class III (High Risk)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-brand-blue mb-1">
                  Software / AI Engine
                </label>
                <div className="flex items-center gap-2 pt-1.5">
                  <label className="inline-flex items-center gap-1.5 text-xs text-brand-dusk cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasSoftware}
                      onChange={(e) => setHasSoftware(e.target.checked)}
                      className="rounded text-brand-blue"
                    />
                    <span>Embedded Firmware / AI</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-brand-blue mb-1">
                  Sterilization Requirement
                </label>
                <div className="flex items-center gap-2 pt-1.5">
                  <label className="inline-flex items-center gap-1.5 text-xs text-brand-dusk cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSterile}
                      onChange={(e) => setIsSterile(e.target.checked)}
                      className="rounded text-brand-blue"
                    />
                    <span>Sterile Barrier Packaging</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Pathway Visualization Output */}
          {pathwayData && (
            <div className="space-y-6">
              {/* Executive Summary Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-brand-cloudy/30 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-brand-dusk/70 tracking-wider">
                    Total Estimated Approval Horizon
                  </span>
                  <div className="font-display font-bold text-2xl text-brand-blue flex items-center gap-2">
                    <Calendar size={20} className="text-[#00C4B7]" />
                    {pathwayData.totalEstimatedTimelineMonths}
                  </div>
                  <p className="text-[11px] text-brand-dusk">
                    Parallelized CDSCO + FDA eSTAR strategy
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-brand-cloudy/30 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-brand-dusk/70 tracking-wider">
                    Predicate Equivalence Strategy
                  </span>
                  <p className="text-xs text-brand-dusk line-clamp-2">
                    {pathwayData.predicateStrategySummary}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-brand-cloudy/30 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-brand-dusk/70 tracking-wider">
                    Primary Harmonized Standard Stack
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {pathwayData.primaryStandardStack.slice(0, 3).map((std, i) => (
                      <span key={i} className="text-[10px] font-mono bg-brand-sand px-1.5 py-0.5 rounded text-brand-blue">
                        {std.split(' ')[0]} {std.split(' ')[1]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic Gantt Roadmaps */}
              <div className="bg-white p-6 rounded-2xl border border-brand-cloudy/30 shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-medium text-lg text-brand-blue">
                    Comparative Regulatory Submission Milestones
                  </h4>
                  <span className="text-[11px] text-brand-dusk">
                    Scale: Sequential & Concurrent Phase Tracking
                  </span>
                </div>

                <div className="space-y-4">
                  {pathwayData.comparativeMilestones.map((m, idx) => {
                    const widthPercent = Math.min(100, Math.max(20, (m.durationMonths / 14) * 100));
                    return (
                      <div key={idx} className="p-4 bg-[#FAF9F5] border border-brand-cloudy/30 rounded-xl space-y-2.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-brand-blue text-white text-xs font-bold flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <span className="font-display font-bold text-sm text-brand-blue">
                              {m.stage}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-brand-sand text-brand-blue border border-brand-cloudy/30">
                              {m.jurisdiction}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs">
                            <span className="text-brand-dusk font-medium flex items-center gap-1">
                              <Calendar size={13} className="text-brand-blue" />
                              {m.durationMonths} Months
                            </span>
                            <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                              <Coins size={13} />
                              {m.statutoryFeeEstimated}
                            </span>
                          </div>
                        </div>

                        {/* Interactive Gantt Bar */}
                        <div className="w-full bg-brand-cloudy/30 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-brand-blue to-[#00C4B7] h-full rounded-full transition-all duration-500"
                            style={{ width: `${widthPercent}%` }}
                          />
                        </div>

                        {/* Deliverables and Agency */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-[11px] text-brand-dusk">
                          <div>
                            <strong className="text-brand-blue block mb-1">Key Deliverables:</strong>
                            <ul className="list-disc pl-4 space-y-0.5">
                              {m.keyDeliverables.map((d, dIdx) => (
                                <li key={dIdx}>{d}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <strong className="text-rose-700 block mb-1">Audit Risk & Agency Body:</strong>
                            <p className="text-rose-900 bg-rose-50 p-2 rounded border border-rose-200/60 mb-1">
                              {m.criticalRisks[0]}
                            </p>
                            <span className="font-medium text-brand-dusk/80">
                              Auditing Authority: {m.notifiedBodyOrAgency}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Critical Pitfalls Accordion */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <AlertCircle size={14} />
                  Top Submission Rejection Pitfalls Identified for this Class
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  {pathwayData.keyRegulatoryPitfalls.map((pitfall, pIdx) => (
                    <div key={pIdx} className="bg-white p-3 rounded-lg border border-amber-200/80 text-xs text-amber-950 leading-relaxed">
                      {pitfall}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: ISO 14971 RISK MANAGEMENT HEATMAP
          ========================================================================= */}
      {activeTab === 'risk-matrix' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-brand-cloudy/30 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#00C4B7]">
                ISO 14971:2019 + A11:2021
              </span>
              <h4 className="font-display font-medium text-xl text-brand-blue">
                Medical Device Risk Evaluation & ALARP Matrix
              </h4>
              <p className="text-xs text-brand-dusk max-w-2xl">
                Demonstrates how design, protective engineering, and usability interlocks shift pre-mitigation unacceptable risks into acceptable ALARP (As Low As Reasonably Practicable) safety zones.
              </p>
            </div>

            <button
              onClick={handleRegenerateRisk}
              disabled={generatingRisk}
              className="px-4 py-2 bg-brand-blue hover:bg-brand-dusk text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition cursor-pointer"
            >
              <RefreshCw size={13} className={generatingRisk ? 'animate-spin' : ''} />
              <span>{generatingRisk ? 'Computing Hazards...' : 'Regenerate Risk File'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 5x5 Matrix Visualizer */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-brand-cloudy/30 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-brand-blue tracking-wider">
                  5 × 5 Severity vs Probability Heatmap
                </span>
                <span className="text-[11px] text-brand-dusk">
                  Click pins to inspect risk reduction
                </span>
              </div>

              {/* Grid Canvas */}
              <div className="relative border border-brand-cloudy/40 rounded-xl overflow-hidden p-2 bg-[#FAF9F5]">
                <div className="grid grid-rows-5 gap-1.5">
                  {[5, 4, 3, 2, 1].map((sev) => (
                    <div key={sev} className="grid grid-cols-5 gap-1.5 h-14">
                      {[1, 2, 3, 4, 5].map((prob) => {
                        const riskScore = sev * prob;
                        const isRed = riskScore >= 15;
                        const isAmber = riskScore >= 8 && riskScore < 15;
                        const isGreen = riskScore < 8;

                        const prePins = hazards.filter(h => h.preSeverity === sev && h.preProbability === prob);
                        const postPins = hazards.filter(h => h.postSeverity === sev && h.postProbability === prob);

                        return (
                          <div
                            key={prob}
                            className={`rounded-lg p-1 relative flex flex-col justify-between text-[10px] font-mono transition-all ${
                              isRed
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : isAmber
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            <span className="opacity-60 text-[9px]">S{sev}·P{prob}</span>

                            {/* Pins Overlay */}
                            <div className="flex flex-wrap gap-1">
                              {prePins.map(h => (
                                <button
                                  key={`pre-${h.id}`}
                                  onClick={() => setSelectedHazard(h)}
                                  title={`Pre-Mitigation: ${h.hazard}`}
                                  className="w-4 h-4 rounded-full bg-rose-600 text-white font-bold text-[8px] flex items-center justify-center shadow-xs hover:scale-125 transition cursor-pointer"
                                >
                                  ▲
                                </button>
                              ))}
                              {postPins.map(h => (
                                <button
                                  key={`post-${h.id}`}
                                  onClick={() => setSelectedHazard(h)}
                                  title={`Post-Mitigation: ${h.hazard}`}
                                  className="w-4 h-4 rounded-full bg-emerald-600 text-white font-bold text-[8px] flex items-center justify-center shadow-xs hover:scale-125 transition cursor-pointer"
                                >
                                  ●
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Axis labels */}
                <div className="flex items-center justify-between text-[10px] font-bold text-brand-dusk pt-2 border-t border-brand-cloudy/30 mt-2 px-1">
                  <span>P1: Rare</span>
                  <span>P2: Unlikely</span>
                  <span>P3: Possible</span>
                  <span>P4: Probable</span>
                  <span>P5: Frequent</span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-between text-xs text-brand-dusk pt-1">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-600 inline-block" />
                    Pre-Mitigation (Initial)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
                    Post-Mitigation (Residual)
                  </span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700">
                  Target: Residual Risk Acceptable
                </span>
              </div>
            </div>

            {/* Selected Hazard Inspector */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-brand-cloudy/30 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-brand-cloudy/20 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#00C4B7]">
                  Hazard Detail Inspector
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-sand text-brand-blue">
                  Domain: {selectedHazard.domain}
                </span>
              </div>

              <h5 className="font-display font-medium text-base text-brand-blue">
                {selectedHazard.hazard}
              </h5>

              <div className="space-y-3 text-xs text-brand-dusk">
                <div>
                  <strong className="text-brand-blue block mb-0.5">Foreseeable Sequence of Events:</strong>
                  <p className="bg-[#FAF9F5] p-3 rounded-lg border border-brand-cloudy/20 text-[11px] leading-relaxed">
                    {selectedHazard.foreseeableSequence}
                  </p>
                </div>

                {/* Score Shift Card */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-brand-sand/50 rounded-xl border border-brand-cloudy/30">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-rose-700">Pre-Control Index</span>
                    <div className="text-sm font-bold text-rose-800">
                      Sev: {selectedHazard.preSeverity} × Prob: {selectedHazard.preProbability} = {selectedHazard.preSeverity * selectedHazard.preProbability}
                    </div>
                    <span className="text-[9px] text-rose-600 font-semibold">Unacceptable Risk</span>
                  </div>

                  <div className="space-y-0.5 border-l border-brand-cloudy/30 pl-3">
                    <span className="text-[10px] uppercase font-bold text-emerald-700">Post-Control Index</span>
                    <div className="text-sm font-bold text-emerald-800">
                      Sev: {selectedHazard.postSeverity} × Prob: {selectedHazard.postProbability} = {selectedHazard.postSeverity * selectedHazard.postProbability}
                    </div>
                    <span className="text-[9px] text-emerald-600 font-semibold flex items-center gap-1">
                      <TrendingDown size={11} />
                      Broadly Acceptable
                    </span>
                  </div>
                </div>

                <div>
                  <strong className="text-emerald-800 block mb-0.5">
                    Mandated Engineering & Risk Control Measure:
                  </strong>
                  <p className="bg-emerald-50/70 p-3 rounded-lg border border-emerald-200 text-[11px] text-emerald-950 leading-relaxed">
                    {selectedHazard.mitigationMeasure}
                  </p>
                </div>
              </div>

              {/* Hazard List Quick Selector */}
              <div className="pt-3 border-t border-brand-cloudy/20 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-brand-dusk/70 tracking-wider">
                  All Identified Hazards ({hazards.length})
                </span>
                <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                  {hazards.map((h) => (
                    <button
                      key={h.id}
                      onClick={() => setSelectedHazard(h)}
                      className={`w-full text-left p-2 rounded-lg text-[11px] truncate transition cursor-pointer ${
                        selectedHazard.id === h.id
                          ? 'bg-brand-blue text-white font-semibold'
                          : 'hover:bg-brand-sand text-brand-dusk'
                      }`}
                    >
                      {h.hazard}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: SaMD RULE 11 INTERACTIVE DECISION TREE
          ========================================================================= */}
      {activeTab === 'samd-rule11' && (
        <div className="bg-white p-6 rounded-2xl border border-brand-cloudy/30 shadow-xs space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00C4B7]">
              EU MDR 2017/745 Annex VIII & MDCG 2019-11
            </span>
            <h4 className="font-display font-medium text-xl text-brand-blue">
              Software as a Medical Device (SaMD) Classification Engine
            </h4>
            <p className="text-xs text-brand-dusk max-w-3xl">
              Answer 3 clinical intended-use questions to determine your device's exact statutory classification under EU MDR Rule 11 and FDA Digital Health policy.
            </p>
          </div>

          <div className="p-6 bg-[#FAF9F5] border border-brand-cloudy/30 rounded-xl space-y-6">
            {/* Step 1 */}
            {samdQuestionStep === 1 && (
              <div className="space-y-4 animate-in fade-in">
                <span className="text-xs font-bold uppercase text-brand-blue">
                  Question 1 of 3: Primary Medical Function
                </span>
                <h5 className="font-display font-bold text-base text-brand-blue">
                  What is the primary intended action of your software?
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => handleSelectAnswer('function', 'diagnosis_therapy')}
                    className="p-4 bg-white border border-brand-cloudy/40 hover:border-brand-blue rounded-xl text-left space-y-2 transition hover:shadow-xs cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-blue flex items-center justify-center font-bold text-xs">
                      A
                    </div>
                    <span className="font-bold text-xs text-brand-blue block">Provide Diagnostic or Therapeutic Decisions</span>
                    <p className="text-[11px] text-brand-dusk">
                      Directly guides physician treatment, calculates drug dosages, or diagnoses disease from imaging/signals.
                    </p>
                  </button>

                  <button
                    onClick={() => handleSelectAnswer('function', 'physiological_monitoring')}
                    className="p-4 bg-white border border-brand-cloudy/40 hover:border-brand-blue rounded-xl text-left space-y-2 transition hover:shadow-xs cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs">
                      B
                    </div>
                    <span className="font-bold text-xs text-brand-blue block">Monitor Vital Physiological Parameters</span>
                    <p className="text-[11px] text-brand-dusk">
                      Monitors real-time ECG, SpO2, blood pressure, or intracranial pressure where changes could pose immediate hazard.
                    </p>
                  </button>

                  <button
                    onClick={() => handleSelectAnswer('function', 'administrative')}
                    className="p-4 bg-white border border-brand-cloudy/40 hover:border-brand-blue rounded-xl text-left space-y-2 transition hover:shadow-xs cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      C
                    </div>
                    <span className="font-bold text-xs text-brand-blue block">Administrative / General Wellness Only</span>
                    <p className="text-[11px] text-brand-dusk">
                      Patient scheduling, calorie counting, or general fitness logs without disease-specific claims.
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {samdQuestionStep === 2 && (
              <div className="space-y-4 animate-in fade-in">
                <span className="text-xs font-bold uppercase text-brand-blue">
                  Question 2 of 3: Clinical Consequence of Incorrect Output
                </span>
                <h5 className="font-display font-bold text-base text-brand-blue">
                  If the software produces a false negative, erroneous alert, or algorithmic error, what is the worst foreseeable clinical outcome?
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => handleSelectAnswer('impact', 'death_or_irreversible')}
                    className="p-4 bg-white border border-brand-cloudy/40 hover:border-rose-500 rounded-xl text-left space-y-2 transition hover:shadow-xs cursor-pointer"
                  >
                    <span className="font-bold text-xs text-rose-700 block">Death or Irreversible Deterioration</span>
                    <p className="text-[11px] text-brand-dusk">
                      Critical ICU monitoring, acute stroke detection, oncology staging errors, or automated insulin pumps.
                    </p>
                  </button>

                  <button
                    onClick={() => handleSelectAnswer('impact', 'serious_deterioration')}
                    className="p-4 bg-white border border-brand-cloudy/40 hover:border-amber-500 rounded-xl text-left space-y-2 transition hover:shadow-xs cursor-pointer"
                  >
                    <span className="font-bold text-xs text-amber-800 block">Serious Deterioration or Surgical Delay</span>
                    <p className="text-[11px] text-brand-dusk">
                      Inappropriate biopsy, delayed fracture surgery, or avoidable hospital admission.
                    </p>
                  </button>

                  <button
                    onClick={() => handleSelectAnswer('impact', 'minor')}
                    className="p-4 bg-white border border-brand-cloudy/40 hover:border-blue-500 rounded-xl text-left space-y-2 transition hover:shadow-xs cursor-pointer"
                  >
                    <span className="font-bold text-xs text-brand-blue block">Minor Clinical Impact / Non-Critical</span>
                    <p className="text-[11px] text-brand-dusk">
                      Superficial symptoms or physician has abundant time and independent tests to verify findings.
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 (Result) */}
            {samdQuestionStep >= 3 && (
              <div className="space-y-6 animate-in fade-in">
                {(() => {
                  const res = getComputedSaMDClass();
                  return (
                    <div className={`p-6 rounded-2xl border-2 ${res.color} space-y-4`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider">
                          Determined Statutory Classification
                        </span>
                        <button
                          onClick={resetDecisionTree}
                          className="text-xs font-semibold underline hover:opacity-80 cursor-pointer"
                        >
                          Restart Diagnostic Tree
                        </button>
                      </div>

                      <h4 className="font-display font-bold text-2xl">
                        {res.classLabel}
                      </h4>

                      <p className="text-xs font-mono font-medium">
                        Governing Rule: {res.rule}
                      </p>

                      <p className="text-xs leading-relaxed">
                        {res.guidance}
                      </p>

                      <div className="pt-2 border-t border-black/10 flex flex-wrap items-center justify-between gap-3">
                        <span className="text-xs font-semibold">
                          IQzyme provides complete IEC 62304 software technical file compilation and FDA Pre-Sub preparation.
                        </span>
                        <a
                          href="#contact-form"
                          className="px-4 py-2 bg-brand-blue text-white rounded-lg text-xs font-bold hover:bg-brand-dusk transition"
                        >
                          Schedule SaMD Regulatory Review
                        </a>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
