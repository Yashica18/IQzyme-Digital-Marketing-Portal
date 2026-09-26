import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Search, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  Sparkles, 
  RefreshCw, 
  ArrowRight, 
  Filter, 
  FileCheck,
  X,
  Printer,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  BookOpen,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { RegulatoryRadarItem } from '../types';

interface RegulatoryRadarProps {
  onSelectForConsultation?: (topic: string) => void;
  compact?: boolean;
}

const DEFAULT_RADAR_ITEMS: RegulatoryRadarItem[] = [
  {
    id: "radar-eu-mdr-rule-11-samd",
    title: "EU MDR Rule 11 & EU AI Act Harmonization for Clinical Decision Software",
    authority: "EU MDR / AI Act",
    effectiveDate: "Immediate Enforcement / AI Act Phased Deadlines (2025–2026)",
    impactLevel: "Critical",
    category: "SaMD & AI",
    summary: "Comprehensive statutory alignment between EU MDR 2017/745 Annex VIII Rule 11 and EU AI Act (Regulation (EU) 2024/1689). Under Rule 11, diagnostic and therapeutic Clinical Decision Support (CDS) algorithms are systematically classified into Class IIa (standard CDS), Class IIb (monitoring vital parameters or decisions causing serious harm/surgical intervention), or Class III (decisions causing death or irreversible health deterioration), effectively eliminating legacy MDD Class I self-certification. Concurrently, medical software deploying AI/ML models constitutes a High-Risk AI System under AI Act Article 6(1) and Annex I, requiring dual-track compliance: unified risk management (ISO 14971 + ISO/IEC 23894), training dataset governance and bias mitigation (Article 10), technical documentation (Annex IV), automated audit logging (Article 12), clinician transparency & explainability (Article 13), human oversight/HITL controls (Article 14), and joint Notified Body conformity assessment (Article 43).",
    affectedClasses: [
      "MDR Class IIa (Standard Diagnostic/Therapeutic CDS)",
      "MDR Class IIb (Critical Care / Serious Deterioration)",
      "MDR Class III (Life-Threatening Clinical Decisions)",
      "EU AI Act High-Risk AI System (Article 6 & Annex I/III)"
    ],
    mandatedAction: "Execute MDCG 2019-11 Rev.1 classification triage against intended clinical use; update IEC 62304 Class B/C software development lifecycle and IEC 82304-1 health software dossiers; implement AI Act Article 10 data quality governance protocols auditing training/validation datasets for demographic bias; deploy Human-in-the-Loop (HITL) interface overrides and confidence score telemetry; and assemble harmonized Annex IV / GSPR technical documentation for Notified Body assessment.",
    referenceDoc: "Regulation (EU) 2017/745 Annex VIII Rule 11 · MDCG 2019-11 Rev.1 · Regulation (EU) 2024/1689 (EU AI Act Arts. 6, 9-15, 43)",
  },
  {
    id: "radar-who-prequalification-pqt",
    title: "WHO Prequalification of Medical Devices & IVDs (PQT-IVD): Dossier Review, Lab Evaluation & GMP Audits",
    authority: "WHO PQ",
    effectiveDate: "Active WHO Operational Window 2026",
    impactLevel: "Critical",
    category: "WHO Prequalification",
    summary: "The World Health Organization (WHO) Prequalification Unit (PQT) enforces strict qualification standards for priority diagnostics, male circumcision devices, and immunization cold-chain equipment required for procurement by UN agencies (UNICEF, PAHO, UNFPA), Global Fund, and national public health programs. Assessment mandates a 4-component protocol: (1) Comprehensive Product Dossier conforming to IMDRF/PQDx format; (2) Independent laboratory performance evaluation at WHO Collaborating Centres verifying diagnostic sensitivity, specificity, and thermal stability; (3) On-site manufacturing audit to WHO Good Manufacturing Practices (TRS No. 996, Annex 2) and ISO 13485:2016; and (4) Post-qualification monitoring with mandatory lot-verification testing.",
    affectedClasses: [
      "Rapid Diagnostic Tests (HIV, Malaria, HCV, HBV, Syphilis, HPV, TB)",
      "Point-of-Care & Nucleic Acid Amplification Analyzers",
      "Male Circumcision Devices & Reproductive Health Products",
      "PQS Immunization Cold Chain & Auto-Disable Injections"
    ],
    mandatedAction: "Submit formal Expression of Interest (EoI) via the WHO PQT portal; prepare IMDRF Table of Contents (ToC) technical dossier; validate manufacturing consistency across three consecutive commercial scale lots; align QMS procedures with WHO TRS 996 GMP guidelines; and arrange laboratory sample shipments to WHO-designated evaluation facilities.",
    referenceDoc: "WHO PQT Guidance for Manufacturers · WHO TRS No. 996 (Annex 2) · IMDRF/PQDx/2026",
  },
  {
    id: "radar-eu-mdr-745-transition",
    title: "Regulation (EU) 2017/745 (EU MDR): Article 120 Extended Deadlines (Reg 2023/607) & GSPR Technical File Scrutiny",
    authority: "EU MDR (2017/745)",
    effectiveDate: "2026–2028 Staggered Deadlines (Regulation (EU) 2023/607)",
    impactLevel: "Critical",
    category: "EU MDR (2017/745)",
    summary: "Enforcement of Regulation (EU) 2023/607 extending MDR transition timelines for legacy MDD/AIMDD devices. To retain EU market access, manufacturers must satisfy cumulative statutory conditions: formal Notified Body application submitted, signed bilateral assessment agreement in place, compliant ISO 13485:2016 QMS, no significant design changes, and continuous Post-Market Surveillance (PMS) per MDR Articles 83-92. Stringent notified body scrutiny is applied to General Safety and Performance Requirements (GSPR Annex I), Clinical Evaluation Reports (CER) aligned with MDCG 2020-6, Post-Market Clinical Follow-up (PMCF), and Article 15 Person Responsible for Regulatory Compliance (PRRC).",
    affectedClasses: [
      "Class III & Class IIb Implantable Devices (Transition to 31 Dec 2027)",
      "Class IIb Non-Implantable & Class IIa Devices (Transition to 31 Dec 2028)",
      "Class I Reclassified (Class Im/Ir/Is requiring Notified Body)"
    ],
    mandatedAction: "Secure formal written agreement with an EU MDR Notified Body; audit technical files against GSPR 1-23; upgrade CER to state-of-the-art appraisal standards; establish EUDAMED Actor Registration (SRN) and UDI allocation; and maintain active Periodic Safety Update Reports (PSUR).",
    referenceDoc: "Regulation (EU) 2017/745 · Regulation (EU) 2023/607 · MDCG 2020-6 · MDCG 2022-14",
  },
  {
    id: "radar-eu-ivdr-746-transition",
    title: "Regulation (EU) 2017/746 (EU IVDR): Transition Timelines (Reg 2024/1860) & Class A-D Performance Evaluation Architecture",
    authority: "EU IVDR (2017/746)",
    effectiveDate: "2027–2029 Extended Transition (Regulation (EU) 2024/1860)",
    impactLevel: "Critical",
    category: "EU IVDR (2017/746)",
    summary: "Regulation (EU) 2024/1860 formally extends statutory deadlines to prevent IVD supply disruptions across the EU. More than 85% of IVDs transitioning from legacy IVDD 98/79/EC self-certification now require third-party Notified Body conformity assessment under 7 risk-based classification rules (Classes A through D). Manufacturers must generate comprehensive Performance Evaluation Reports (PER) fulfilling the 3 statutory pillars of MDCG 2022-2: (1) Scientific Validity, (2) Analytical Performance (limit of detection, analytical specificity, cross-reactivity, interference), and (3) Clinical Performance (diagnostic sensitivity, diagnostic specificity, positive/negative predictive values). For Class D devices, EU Reference Laboratory (EURL) batch verification and independent laboratory testing are mandatory.",
    affectedClasses: [
      "Class D High-Risk IVDs - Blood screening, HIV, Hepatitis (Deadline: 31 Dec 2027)",
      "Class C Moderate-High IVDs - Oncology biomarkers, Companion Diagnostics, Infectious Diseases (Deadline: 31 Dec 2028)",
      "Class B & Class A Sterile IVDs - General clinical chemistry, sterile consumables (Deadline: 31 Dec 2029)"
    ],
    mandatedAction: "Classify assays under IVDR Annex VIII Rules 1-7; execute Performance Evaluation Plans (PEP) and Clinical Performance Studies; establish Post-Market Performance Follow-up (PMPF) registers; integrate EURL testing protocols for Class D assays; and lodge formal Notified Body application before deadline milestones.",
    referenceDoc: "Regulation (EU) 2017/746 · Regulation (EU) 2024/1860 · MDCG 2022-2 (PER) · IVD Expert Panel Guidance",
  },
  {
    id: "radar-samd-ai-fda-pccp",
    title: "US FDA Predetermined Change Control Plans (PCCP) & IMDRF Lifecycle Controls for AI/ML SaMD",
    authority: "US FDA",
    effectiveDate: "Enforced Guidance 2025–2026",
    impactLevel: "High",
    category: "SaMD & AI",
    summary: "FDA guidance on Predetermined Change Control Plans (PCCP) under FD&C Act Section 515C allows medical device software incorporating machine learning algorithms to implement predetermined modifications (retraining, hyperparameter optimization, new input parameters) without requiring supplemental 510(k) or PMA submissions. A complete PCCP must detail: (1) Description of Modifications, (2) Modification Protocol (data management, model retraining, verification and validation protocols), and (3) Impact Assessment evaluating cumulative clinical risk.",
    affectedClasses: [
      "Class II 510(k) SaMD with AI/ML",
      "De Novo Machine Learning Algorithms",
      "Class III PMA Digital Pathology & Imaging Software"
    ],
    mandatedAction: "Draft PCCP Section 515C modification protocols; conduct non-clinical algorithmic testing on unseen demographic test sets; and file alongside premarket submissions.",
    referenceDoc: "FDA-2022-D-2628 · FD&C Act Section 515C · IMDRF SaMD N41",
  },
  {
    id: "radar-cdsco-class-cd-2026",
    title: "CDSCO Form MD-14 & MD-15 Class C/D Performance Evaluation Protocol Update",
    authority: "CDSCO",
    effectiveDate: "Q3 2026",
    impactLevel: "Critical",
    category: "IVD & Reagents",
    summary: "Central Drugs Standard Control Organisation (India) has enforced mandatory digital verification of clinical performance evaluations and batch manufacturing validation for Class C and Class D in-vitro diagnostics and active implantable devices prior to grant of import/manufacturing licenses.",
    affectedClasses: ["Class C (Moderate-High)", "Class D (High Risk)"],
    mandatedAction: "Audit existing clinical performance reports (CPR) against revised CDSCO Guidance Document Table 3; verify NABL accredited laboratory validation certificates.",
    referenceDoc: "CDSCO/MDR/2026/Notif-882",
  },
  {
    id: "radar-fda-sec-524b-sbom",
    title: "US FDA 510(k) & De Novo Cybersecurity Mandate: Section 524B FD&C Act Enforcement",
    authority: "US FDA",
    effectiveDate: "Immediate Enforcement",
    impactLevel: "High",
    category: "SaMD & AI",
    summary: "All electronic and software-containing medical devices must provide machine-readable Software Bill of Materials (SBOM), continuous postmarket vulnerability disclosures, and coordinated vulnerability disclosure (CVD) documentation in premarket submissions or face Refuse-to-Accept (RTA).",
    affectedClasses: ["Class II 510(k)", "De Novo", "PMA"],
    mandatedAction: "Generate CycloneDX/SPDX SBOM files and complete FDA Cybersecurity Appendix 1 submission checklist before filing.",
    referenceDoc: "FDA-2023-D-1319 / Section 524B",
  },
  {
    id: "radar-iso-13485-qmsr-transition",
    title: "FDA Quality Management System Regulation (QMSR) Harmonization with ISO 13485:2016",
    authority: "ISO/IMDRF",
    effectiveDate: "February 2026",
    impactLevel: "High",
    category: "QMS & Audits",
    summary: "FDA 21 CFR Part 820 is formally harmonized with ISO 13485:2016 under QMSR. Traditional QSIT inspection methods transition to ISO 13485 process-based surveillance audits with specific US statutory addenda for records and reporting.",
    affectedClasses: ["All Commercial Medical Device Manufacturers"],
    mandatedAction: "Harmonize internal audit procedures with ISO 13485:2016 Clause 8 and verify Management Review intervals against QMSR requirements.",
    referenceDoc: "FDA Final Rule 89 FR 7496",
  },
  {
    id: "radar-mhra-ukca-reliance",
    title: "UK MHRA International Recognition Procedure (IRP) for CE Marked Devices",
    authority: "MHRA",
    effectiveDate: "Active Operational Window",
    impactLevel: "Moderate",
    category: "Medical Devices",
    summary: "UK MHRA facilitates accelerated registration for devices holding valid EU CE certificates under MDR 2017/745 or FDA 510(k)/PMA, bypassing domestic duplicate audits until UKCA statutory transition dates.",
    affectedClasses: ["Class I, IIa, IIb, III"],
    mandatedAction: "Appoint a UK Responsible Person (UKRP) and register product GMDN codes through MHRA More portal using reliance documentation.",
    referenceDoc: "MHRA Guidance on Recognition of CE Certificates",
  },
];

export default function RegulatoryRadar({ onSelectForConsultation, compact = false }: RegulatoryRadarProps) {
  const [items, setItems] = useState<RegulatoryRadarItem[]>(DEFAULT_RADAR_ITEMS);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Expanded detail accordion for Rule 11 & EU AI Act
  const [expandedRule11, setExpandedRule11] = useState<boolean>(true);
  const [rule11Tab, setRule11Tab] = useState<'classification' | 'ai-act' | 'obligations'>('classification');

  // Impact Analysis Modal State
  const [activeItem, setActiveItem] = useState<RegulatoryRadarItem | null>(null);
  const [deviceCategory, setDeviceCategory] = useState<string>('Software as a Medical Device (SaMD) & AI/ML');
  const [deviceClass, setDeviceClass] = useState<string>('Class B / Class IIa (Moderate Risk)');
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [impactAnalysis, setImpactAnalysis] = useState<string | null>(null);
  const [engineUsed, setEngineUsed] = useState<string>('');

  const fetchRadar = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/regulatory-radar');
      const data = await res.json();
      if (data.success && Array.isArray(data.items) && data.items.length > 0) {
        setItems(data.items);
      }
    } catch (e) {
      console.warn("Error loading regulatory radar, retained base intelligence items:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRadar();
  }, []);

  const handleAnalyzeImpact = async (item: RegulatoryRadarItem) => {
    setActiveItem(item);
    setAnalyzing(true);
    setImpactAnalysis(null);

    // Contextually set device category based on item
    if (item.category === 'SaMD & AI' || item.title.includes('Rule 11')) {
      setDeviceCategory('Software as a Medical Device (SaMD) & AI/ML');
      setDeviceClass('Class B / Class IIa (Moderate Risk)');
    } else if (item.category === 'WHO Prequalification' || item.category === 'IVD & Reagents' || item.title.includes('IVDR')) {
      setDeviceCategory('In Vitro Diagnostic (IVD) & Reagents');
      setDeviceClass('Class C / Class IIb (Moderate-High)');
    }

    try {
      const res = await fetch('/api/analyze-radar-impact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bulletinTitle: item.title,
          authority: item.authority,
          deviceCategory,
          deviceClass,
          markets: "European Union (EU MDR/IVDR & AI Act), WHO International Procurement, US FDA, India (CDSCO)",
        }),
      });
      const data = await res.json();
      if (data.success && data.analysis) {
        setImpactAnalysis(data.analysis);
        setEngineUsed(data.engine || 'IQzyme Regulatory Intelligence Core');
      }
    } catch (err) {
      console.error("Impact audit failed:", err);
    } finally {
      setAnalyzing(false);
    }
  };

  const filterTabs = [
    { id: 'ALL', label: 'All Regimes' },
    { id: 'WHO PQ', label: 'WHO Prequalification' },
    { id: 'EU MDR', label: 'EU MDR (2017/745)' },
    { id: 'EU IVDR', label: 'EU IVDR (2017/746)' },
    { id: 'SaMD & AI', label: 'SaMD & AI' },
    { id: 'CDSCO', label: 'CDSCO (India)' },
    { id: 'US FDA', label: 'US FDA' },
    { id: 'ISO/IMDRF', label: 'ISO / IMDRF' },
    { id: 'MHRA', label: 'UK MHRA' },
  ];

  const filteredItems = items.filter(item => {
    let matchesFilter = true;
    if (selectedFilter !== 'ALL') {
      const auth = (item.authority || '').toLowerCase();
      const cat = (item.category || '').toLowerCase();
      const title = (item.title || '').toLowerCase();
      const ref = (item.referenceDoc || '').toLowerCase();

      if (selectedFilter === 'WHO PQ') {
        matchesFilter = auth.includes('who') || cat.includes('who') || title.includes('who') || ref.includes('who');
      } else if (selectedFilter === 'EU MDR') {
        matchesFilter = (auth.includes('mdr') && !auth.includes('ivdr')) || cat.includes('mdr') || title.includes('mdr') || title.includes('745') || ref.includes('745');
      } else if (selectedFilter === 'EU IVDR') {
        matchesFilter = auth.includes('ivdr') || cat.includes('ivdr') || title.includes('ivdr') || title.includes('746') || ref.includes('746');
      } else if (selectedFilter === 'SaMD & AI') {
        matchesFilter = cat.includes('samd') || cat.includes('ai') || auth.includes('samd') || auth.includes('ai') || title.includes('samd') || title.includes('ai') || title.includes('software') || title.includes('rule 11');
      } else if (selectedFilter === 'CDSCO') {
        matchesFilter = auth.includes('cdsco') || cat.includes('cdsco');
      } else if (selectedFilter === 'US FDA') {
        matchesFilter = auth.includes('fda');
      } else if (selectedFilter === 'ISO/IMDRF') {
        matchesFilter = auth.includes('iso') || auth.includes('imdrf') || cat.includes('qms');
      } else if (selectedFilter === 'MHRA') {
        matchesFilter = auth.includes('mhra');
      }
    }

    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.mandatedAction.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.referenceDoc.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div id="regulatory-radar-component" className="space-y-6">
      {/* Print-Only Letterhead for Physical Document Sharing */}
      <div className="print-only hidden pb-4 mb-6 border-b-2 border-brand-blue">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-xl text-brand-blue tracking-tight">IQZYME MEDTECH</span>
              <span className="text-xs bg-brand-blue text-white px-2 py-0.5 rounded font-mono uppercase tracking-wider">Regulatory Radar</span>
            </div>
            <p className="text-xs text-brand-dusk font-medium mt-1">
              Global Medical Device, IVD, WHO Prequalification & SaMD/AI Intelligence Briefing
            </p>
            <p className="text-[10px] text-brand-dusk/80 font-mono">
              Statutory Surveillance: WHO PQ, EU MDR 2017/745, EU IVDR 2017/746, EU AI Act, CDSCO, US FDA & ISO
            </p>
          </div>
          <div className="text-right text-xs text-brand-dusk">
            <p className="font-bold text-brand-blue">Confidential Statutory Dossier</p>
            <p className="text-[10px]">Issued: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p className="text-[10px] font-mono text-brand-dusk/70">Doc Ref: IQZ-GLOBAL-REG-RADAR-2026</p>
          </div>
        </div>
      </div>

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-brand-blue via-[#17253b] to-[#122030] p-6 rounded-2xl text-white shadow-md border border-brand-cloudy/20">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#00C4B7]/20 text-[#00C4B7] text-[11px] font-bold uppercase tracking-wider">
            <Radio size={14} className="animate-pulse text-[#00C4B7]" />
            Active Regulatory Surveillance Radar
          </div>
          <h3 className="font-display font-medium text-2xl text-white">
            Global Regulatory Radar & Statutory Intelligence
          </h3>
          <p className="text-xs text-brand-cloudy max-w-3xl leading-relaxed">
            Real-time statutory tracking across <strong>WHO Prequalification (PQT)</strong>, <strong>EU MDR 2017/745</strong>, <strong>EU IVDR 2017/746</strong>, <strong>SaMD & EU AI Act (Rule 11)</strong>, CDSCO, and US FDA. Run on-demand AI impact assessments against your specific device family.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            onClick={fetchRadar}
            disabled={loading}
            className="no-print px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            title="Refresh Live Feeds"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-[#00C4B7]" : ""} />
            <span>{loading ? "Checking..." : "Sync Radar"}</span>
          </button>
          <button
            id="print-radar-dossier-btn"
            onClick={() => window.print()}
            className="no-print px-3 py-2 bg-[#00C4B7] hover:bg-[#00b0a4] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            title="Print or Export Regulatory Radar Dossier"
          >
            <Printer size={14} />
            <span>Print Dossier</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="no-print flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-brand-cloudy/30 shadow-xs">
        {/* Regime Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-thin">
          <Filter size={14} className="text-brand-dusk ml-1 shrink-0" />
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedFilter === tab.id
                  ? 'bg-brand-blue text-white shadow-xs'
                  : 'text-brand-dusk hover:bg-brand-sand/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-dusk/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Rule 11, WHO PQ, 745, IVDR, SaMD..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF9F5] border border-brand-cloudy/30 rounded-lg focus:outline-hidden focus:border-brand-blue"
          />
        </div>
      </div>

      {/* Radar Cards Grid */}
      {loading ? (
        <div className="py-12 text-center space-y-3 bg-white border border-brand-cloudy/20 rounded-2xl">
          <RefreshCw size={24} className="animate-spin text-brand-blue mx-auto" />
          <p className="text-xs text-brand-dusk font-medium">Scanning international gazettes & statutory registers...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-10 text-center bg-white border border-brand-cloudy/20 rounded-2xl text-xs text-brand-dusk">
          No regulatory updates matching the selected regime or keywords.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredItems.map(item => {
            const isCritical = item.impactLevel === 'Critical';
            const isHigh = item.impactLevel === 'High';
            const isRule11Item = item.id === 'radar-eu-mdr-rule-11-samd';
            
            return (
              <div
                key={item.id}
                className={`bg-white border rounded-xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 ${
                  isRule11Item ? 'border-[#00C4B7]/60 md:col-span-2 ring-1 ring-[#00C4B7]/20 bg-linear-to-b from-[#FAFDFD] to-white' : 'border-brand-cloudy/30 hover:border-brand-blue/50'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Metadata Badges */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-sand text-brand-blue border border-brand-cloudy/30">
                        {item.authority}
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#00C4B7]/10 text-[#008f85] border border-[#00C4B7]/20">
                        {item.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isCritical 
                          ? 'bg-rose-100 text-rose-700' 
                          : isHigh 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isCritical ? <ShieldAlert size={12} /> : <AlertTriangle size={12} />}
                        {item.impactLevel} Impact
                      </span>
                      <span className="text-[10px] text-brand-dusk/70 flex items-center gap-1">
                        <Clock size={11} />
                        {item.effectiveDate}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <h4 className="font-display font-medium text-lg text-brand-blue leading-snug mt-1">
                      {item.title}
                    </h4>
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-brand-dusk leading-relaxed">
                    {item.summary}
                  </p>

                  {/* SPECIAL AUTHORITATIVE BREAKDOWN FOR EU MDR RULE 11 & EU AI ACT */}
                  {isRule11Item && (
                    <div className="pt-2 pb-1 space-y-3">
                      <div className="flex items-center justify-between border-b border-brand-cloudy/30 pb-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-brand-blue">
                          <Cpu size={14} className="text-[#00C4B7]" />
                          <span>Statutory Framework Deep-Dive: Rule 11 & EU AI Act Harmonization</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setExpandedRule11(!expandedRule11)}
                          className="no-print text-[11px] font-semibold text-[#008f85] hover:text-brand-blue flex items-center gap-1 cursor-pointer"
                        >
                          <span>{expandedRule11 ? 'Collapse Technical Matrix' : 'Expand Technical Matrix'}</span>
                          {expandedRule11 ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        </button>
                      </div>

                      {expandedRule11 && (
                        <div className="space-y-3 bg-[#FAF9F5] p-3.5 rounded-xl border border-brand-cloudy/30">
                          {/* Inner Tabs */}
                          <div className="no-print flex items-center gap-2 border-b border-brand-cloudy/30 pb-2">
                            <button
                              type="button"
                              onClick={() => setRule11Tab('classification')}
                              className={`text-[11px] font-bold px-2.5 py-1 rounded transition cursor-pointer ${
                                rule11Tab === 'classification'
                                  ? 'bg-brand-blue text-white'
                                  : 'text-brand-dusk hover:bg-white'
                              }`}
                            >
                              Rule 11 Classification Matrix
                            </button>
                            <button
                              type="button"
                              onClick={() => setRule11Tab('ai-act')}
                              className={`text-[11px] font-bold px-2.5 py-1 rounded transition cursor-pointer ${
                                rule11Tab === 'ai-act'
                                  ? 'bg-brand-blue text-white'
                                  : 'text-brand-dusk hover:bg-white'
                              }`}
                            >
                              EU AI Act Harmonization (High-Risk)
                            </button>
                            <button
                              type="button"
                              onClick={() => setRule11Tab('obligations')}
                              className={`text-[11px] font-bold px-2.5 py-1 rounded transition cursor-pointer ${
                                rule11Tab === 'obligations'
                                  ? 'bg-brand-blue text-white'
                                  : 'text-brand-dusk hover:bg-white'
                              }`}
                            >
                              Mandatory Verification Standards
                            </button>
                          </div>

                          {/* Tab 1: Rule 11 Classification */}
                          {(rule11Tab === 'classification' || false) && (
                            <div className="space-y-2 text-xs">
                              <p className="text-[11px] text-brand-dusk font-medium">
                                Under <strong>Annex VIII Chapter III Rule 11 of EU MDR 2017/745</strong> and <strong>MDCG 2019-11 Rev.1</strong>, software intended to provide information used to take decisions with diagnosis or therapeutic purposes is classified:
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-rose-800 text-[11px]">Class III</span>
                                    <span className="text-[9px] font-mono uppercase bg-rose-200/60 text-rose-800 px-1 rounded">Rule 11(a) 1st Indent</span>
                                  </div>
                                  <p className="text-[10px] text-rose-900 leading-tight">
                                    Decisions that may cause <strong>death or irreversible deterioration</strong> of a person's state of health (e.g. stroke triage, lethal arrhythmia alerts, acute oncology interventions).
                                  </p>
                                </div>

                                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-amber-800 text-[11px]">Class IIb</span>
                                    <span className="text-[9px] font-mono uppercase bg-amber-200/60 text-amber-800 px-1 rounded">Rule 11(a) 2nd & 11(b)</span>
                                  </div>
                                  <p className="text-[10px] text-amber-900 leading-tight">
                                    Decisions causing <strong>serious deterioration or surgical intervention</strong>, or software monitoring <strong>vital physiological parameters</strong> where variations cause immediate danger.
                                  </p>
                                </div>

                                <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-brand-blue text-[11px]">Class IIa</span>
                                    <span className="text-[9px] font-mono uppercase bg-blue-200/60 text-brand-blue px-1 rounded">Rule 11(a) Standard</span>
                                  </div>
                                  <p className="text-[10px] text-brand-dusk leading-tight">
                                    <strong>All other diagnostic or therapeutic decision software</strong>. Virtually all clinical decision support software defaults to Class IIa or higher; legacy MDD Class I is eliminated.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Tab 2: EU AI Act Harmonization */}
                          {rule11Tab === 'ai-act' && (
                            <div className="space-y-2 text-xs text-brand-dusk">
                              <p className="text-[11px] text-brand-blue font-semibold">
                                Medical Device AI as a High-Risk AI System (Regulation (EU) 2024/1689 Article 6(1) & Annex I):
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] leading-relaxed">
                                <div className="p-2 bg-white rounded border border-brand-cloudy/30 space-y-0.5">
                                  <strong className="text-brand-blue block">Art. 9 AI Lifecycle Risk Management:</strong>
                                  Continuous iterative assessment merging ISO 14971 with ISO/IEC 23894 for algorithmic drift, bias, edge cases, and hallucinations.
                                </div>
                                <div className="p-2 bg-white rounded border border-brand-cloudy/30 space-y-0.5">
                                  <strong className="text-brand-blue block">Art. 10 Data Quality & Bias Governance:</strong>
                                  Mandatory statistical audit of training, validation, and test datasets for demographic representation (age, gender, ethnicity, comorbidities).
                                </div>
                                <div className="p-2 bg-white rounded border border-brand-cloudy/30 space-y-0.5">
                                  <strong className="text-brand-blue block">Art. 12 Continuous Automated Logging:</strong>
                                  Immutable recording of runtime inference requests, confidence intervals, algorithm versions, and clinician overrides for post-market surveillance.
                                </div>
                                <div className="p-2 bg-white rounded border border-brand-cloudy/30 space-y-0.5">
                                  <strong className="text-brand-blue block">Art. 13 & 14 Clinician Explainability & HITL:</strong>
                                  Interface architecture delivering interpretable rationale, known error bounds, and Human-in-the-Loop overrides preventing automation bias.
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Tab 3: Verification Standards */}
                          {rule11Tab === 'obligations' && (
                            <div className="space-y-1.5 text-xs text-brand-dusk">
                              <p className="text-[11px] font-semibold text-brand-blue">
                                Required Technical Verification & Quality Dossier Stack:
                              </p>
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {[
                                  'IEC 62304:2015 (Class B/C Lifecycle)',
                                  'IEC 82304-1 (Health Software Systems)',
                                  'ISO/IEC 42001 (AI Management System)',
                                  'ISO/IEC 23894 (AI Risk Management)',
                                  'IEC 62366-1 (Usability & Clinician HITL)',
                                  'IEC 81001-5-1 (Health Software Cybersecurity)',
                                  'MDCG 2020-6 (Clinical Evidence for Software)',
                                  'MDCG 2019-16 (Cybersecurity in Medical Devices)'
                                ].map((std, idx) => (
                                  <span key={idx} className="text-[10px] bg-white border border-brand-cloudy/30 px-2 py-0.5 rounded font-mono text-brand-blue">
                                    {std}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Affected Device Classes Chips */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] uppercase font-bold text-brand-dusk/70 tracking-wider">
                      Affected Classifications & Scopes:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {item.affectedClasses.map((cls, idx) => (
                        <span key={idx} className="text-[10px] bg-brand-sand/70 text-brand-dusk px-2 py-0.5 rounded border border-brand-cloudy/20">
                          {cls}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Mandated Action Box */}
                  <div className="p-3 bg-[#FAF9F5] border-l-2 border-brand-blue rounded-r-lg space-y-1">
                    <span className="text-[10px] font-bold uppercase text-brand-blue tracking-wider flex items-center gap-1">
                      <FileCheck size={12} className="text-[#00C4B7]" />
                      Statutory Action Mandate
                    </span>
                    <p className="text-[11px] text-brand-dusk leading-normal">
                      {item.mandatedAction}
                    </p>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-2 border-t border-brand-cloudy/20 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] text-brand-dusk/80 font-mono print:text-[11px] print:font-semibold print:text-brand-blue">
                    Citation Ref: {item.referenceDoc}
                  </span>

                  <button
                    onClick={() => handleAnalyzeImpact(item)}
                    className="no-print px-3 py-1.5 bg-[#00C4B7] hover:bg-[#00b0a4] text-white font-bold text-xs rounded shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Sparkles size={13} />
                    <span>Analyze Impact on My Device</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Print-Only Document Footer for Physical Sharing */}
      <div className="print-only hidden pt-6 mt-6 border-t border-brand-cloudy/40 text-center text-[9pt] text-brand-dusk space-y-1">
        <p className="font-semibold text-brand-blue">
          IQzyme Medtech Pvt. Ltd. — Global Regulatory Intelligence, WHO Prequalification & Statutory Surveillance
        </p>
        <p>Cochin HQ • New Delhi • Bangalore • Stockholm, Sweden • www.iqzymemedtech.com</p>
        <p className="text-[8pt] text-brand-dusk/70">
          This dossier was generated for authorized physical document sharing, WHO tender preparation, and statutory compliance gap planning.
        </p>
      </div>

      {/* Impact Analysis Drawer / Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-brand-cloudy/40 my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-brand-blue text-white p-6 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#00C4B7] flex items-center gap-1.5">
                  <Sparkles size={14} />
                  On-Demand Regulatory Impact Engine
                </span>
                <h3 className="font-display font-medium text-xl text-white leading-tight">
                  {activeItem.title}
                </h3>
                <p className="text-xs text-brand-cloudy">
                  Authority: <strong className="text-white">{activeItem.authority}</strong> • Reference: <span className="font-mono text-white/90">{activeItem.referenceDoc}</span>
                </p>
              </div>

              <button
                onClick={() => setActiveItem(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Controls */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              <div className="bg-brand-sand/60 p-4 rounded-xl border border-brand-cloudy/30 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-blue mb-1">
                    Your Device Category
                  </label>
                  <select
                    value={deviceCategory}
                    onChange={(e) => setDeviceCategory(e.target.value)}
                    className="w-full text-xs bg-white border border-brand-cloudy/40 rounded-lg p-2 font-medium text-brand-dusk focus:outline-hidden focus:border-brand-blue"
                  >
                    <option value="Software as a Medical Device (SaMD) & AI/ML">Software as a Medical Device (SaMD) & AI/ML</option>
                    <option value="In Vitro Diagnostic (IVD) & Reagents">In Vitro Diagnostic (IVD) & Reagents</option>
                    <option value="WHO Prequalification Priority Diagnostics">WHO Prequalification Priority Diagnostics</option>
                    <option value="Cardiovascular & Endovascular">Cardiovascular & Endovascular</option>
                    <option value="Orthopedic Implants & Instrumentation">Orthopedic Implants & Instrumentation</option>
                    <option value="Ophthalmic & ENT Devices">Ophthalmic & ENT Devices</option>
                    <option value="General Hospital & Surgical Equipment">General Hospital & Surgical Equipment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-blue mb-1">
                    Target Risk Classification
                  </label>
                  <select
                    value={deviceClass}
                    onChange={(e) => setDeviceClass(e.target.value)}
                    className="w-full text-xs bg-white border border-brand-cloudy/40 rounded-lg p-2 font-medium text-brand-dusk focus:outline-hidden focus:border-brand-blue"
                  >
                    <option value="Class A / Class I (Low Risk - e.g. Manual Wheelchair, Non-clinical software)">Class A / Class I (Low Risk)</option>
                    <option value="Class B / Class IIa (Moderate Risk - MDR Rule 11 Standard CDS, IVDR Class B)">Class B / Class IIa (Moderate Risk)</option>
                    <option value="Class C / Class IIb (Moderate-High - MDR Rule 11 Vital Telemetry, IVDR Class C)">Class C / Class IIb (Moderate-High)</option>
                    <option value="Class D / Class III (High Risk - MDR Rule 11 Irreversible Damage, IVDR Class D, Heart Valve)">Class D / Class III (High Risk)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleAnalyzeImpact(activeItem)}
                  disabled={analyzing}
                  className="px-4 py-2 bg-brand-blue hover:bg-brand-dusk text-white font-bold text-xs rounded-lg flex items-center gap-2 transition cursor-pointer"
                >
                  <RefreshCw size={13} className={analyzing ? "animate-spin" : ""} />
                  <span>{analyzing ? "Synthesizing Regulatory Impact..." : "Regenerate Analysis"}</span>
                </button>
              </div>

              {/* Analysis Result Display */}
              {analyzing ? (
                <div className="py-12 text-center space-y-3">
                  <RefreshCw size={28} className="animate-spin text-[#00C4B7] mx-auto" />
                  <p className="text-xs text-brand-dusk font-medium">
                    Regulatory Intelligence Engine is cross-referencing statutory clauses, MDR Rule 11 indents, EU AI Act articles, and laboratory standards...
                  </p>
                </div>
              ) : impactAnalysis ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[11px] text-brand-dusk border-b border-brand-cloudy/30 pb-2">
                    <span className="font-semibold text-brand-blue">
                      Target Audit Profile: {deviceCategory} • {deviceClass}
                    </span>
                    <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Engine: {engineUsed}
                    </span>
                  </div>

                  <div className="prose prose-sm max-w-none text-xs text-brand-dusk leading-relaxed space-y-4 bg-[#FAF9F5] p-5 rounded-xl border border-brand-cloudy/30">
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: impactAnalysis
                          .replace(/^### (.*$)/gim, '<h4 class="font-display font-bold text-sm text-brand-blue mt-4 mb-1">$1</h4>')
                          .replace(/^\* (.*$)/gim, '<li class="ml-4 list-disc text-brand-dusk">$1</li>')
                          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-brand-blue font-semibold">$1</strong>')
                      }} 
                    />
                  </div>
                </div>
              ) : null}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-brand-sand/50 border-t border-brand-cloudy/30 flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] text-brand-dusk">
                Require direct BSI/TÜV/CDSCO certified representation or WHO PQ dossier compilation?
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 border border-brand-cloudy/40 text-brand-dusk hover:bg-white text-xs font-semibold rounded flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer size={13} />
                  <span>Print Brief</span>
                </button>
                <button
                  onClick={() => {
                    setActiveItem(null);
                    if (onSelectForConsultation) {
                      onSelectForConsultation(`Compliance Audit: ${activeItem.title} (${deviceCategory})`);
                    }
                  }}
                  className="px-4 py-1.5 bg-[#00C4B7] hover:bg-[#00b0a4] text-white text-xs font-bold rounded flex items-center gap-1.5 transition cursor-pointer"
                >
                  <span>Book Audit Strategy Session</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
