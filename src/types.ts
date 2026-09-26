/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PageMetadata {
  title: string;
  description: string;
}

export interface RouteInfo {
  path: string;
  label: string;
  meta: PageMetadata;
  category?: 'main' | 'services' | 'industries' | 'resources' | 'other';
}

export interface SuccessStory {
  id: string;
  title: string;
  client: string;
  industry: string;
  metrics: string;
  description: string;
  challenge: string;
  solution: string;
  image: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  iconName: string;
  bullets?: string[];
  link?: string;
}

export interface PositionItem {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  author: string;
  image: string;
  published?: boolean;
  createdAt?: any;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export interface MarketingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'Webinar' | 'Exhibition' | 'Conference' | 'Seminar';
  description: string;
}

export interface RegulatoryRadarItem {
  id: string;
  title: string;
  authority: 
    | 'WHO Prequalification' 
    | 'WHO PQ' 
    | 'EU MDR (2017/745)' 
    | 'EU IVDR (2017/746)' 
    | 'EU MDR/IVDR' 
    | 'EU MDR / AI Act'
    | 'SaMD & AI' 
    | 'CDSCO' 
    | 'US FDA' 
    | 'MHRA' 
    | 'ISO/IMDRF' 
    | string;
  effectiveDate: string;
  impactLevel: 'Critical' | 'High' | 'Moderate';
  category: 
    | 'SaMD & AI' 
    | 'WHO Prequalification' 
    | 'EU MDR (2017/745)' 
    | 'EU IVDR (2017/746)' 
    | 'IVD & Reagents' 
    | 'Medical Devices' 
    | 'QMS & Audits' 
    | 'Post-Market' 
    | string;
  summary: string;
  affectedClasses: string[];
  mandatedAction: string;
  referenceDoc: string;
}

export interface PathwayMilestone {
  stage: string;
  jurisdiction: string;
  durationMonths: number;
  statutoryFeeEstimated: string;
  keyDeliverables: string[];
  criticalRisks: string[];
  notifiedBodyOrAgency: string;
}

export interface DynamicPathwayResult {
  deviceName: string;
  deviceCategory: string;
  riskClass: string;
  totalEstimatedTimelineMonths: string;
  comparativeMilestones: PathwayMilestone[];
  primaryStandardStack: string[];
  predicateStrategySummary: string;
  keyRegulatoryPitfalls: string[];
}

export interface RiskMatrixHazard {
  id: string;
  domain: 'Software & Cyber' | 'Biocompatibility' | 'Sterility' | 'Electrical' | 'Usability';
  hazard: string;
  foreseeableSequence: string;
  preSeverity: 1 | 2 | 3 | 4 | 5;
  preProbability: 1 | 2 | 3 | 4 | 5;
  mitigationMeasure: string;
  postSeverity: 1 | 2 | 3 | 4 | 5;
  postProbability: 1 | 2 | 3 | 4 | 5;
}

export interface RegulatoryStrategyResult {
  title: string;
  executiveSummary: string;
  classificationMatrix: {
    cdsco: string;
    fda: string;
    euMdr: string;
  };
  recommendedSubmissionSequence: {
    step: number;
    action: string;
    jurisdiction: string;
    timeline: string;
    reasoning: string;
  }[];
  criticalTestingRoadmap: {
    standard: string;
    description: string;
    estimatedTurnaround: string;
  }[];
  gapChecklist: {
    item: string;
    status: 'Required' | 'Recommended' | 'Conditional';
    notes: string;
  }[];
}

export interface RegionalComplianceMetric {
  region: string;
  regionShort: string;
  authority: string;
  successRate: number; // e.g. 98.6 (%)
  firstCycleClearance: number; // e.g. 91.2 (%)
  industryBenchmark: number; // e.g. 72.4 (%)
  totalSubmissions: number; // e.g. 420
  medianDays: number; // e.g. 68
  activeAudits: number;
  highlight: string;
}

export interface ClientLivingDashboardData {
  projectName: string;
  deviceType: string;
  targetMarkets: string[];
  overallReadinessScore: number;
  predictedApprovalDate: string;
  milestones: {
    name: string;
    progress: number;
    status: 'Completed' | 'In Progress' | 'Upcoming';
    targetDate: string;
  }[];
  activeAlerts: {
    title: string;
    urgency: 'Immediate Action' | 'Advisory' | 'Informational';
    body: string;
  }[];
  dossierSectionsReadiness: {
    section: string;
    score: number;
    pendingGaps: string[];
  }[];
  globalComplianceRates?: RegionalComplianceMetric[];
}

// ==========================================
// QUALITY CONTROL & OBSERVABILITY ARCHITECTURE
// ==========================================

export interface ClaudeSelfCritique {
  compositeScore: number; // 0 - 100
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL_DEFECT';
  rubricScores: {
    statutoryAccuracy: number;       // /25 (CDSCO MDR 2017, FDA 21 CFR 820/QMSR, EU MDR 2017/745)
    classificationSoundness: number; // /25 (MDR Rule 11, CDSCO Class A-D, FDA Predicate logic)
    testingCompleteness: number;     // /20 (ISO 10993, IEC 62304, IEC 60601, SBOM)
    hallucinationCheck: number;      // /20 (Grounding verification, no phantom predicates)
    defensibility: number;           // /10 (Defensible rationale, statutory disclaimers)
  };
  citationsVerified: string[];
  criticalWeaknesses: string[];
  correctiveAmendments: string[];
  disposition: 'AUTO_APPROVED' | 'FLAGGED_FOR_HUMAN_REVIEW';
  dispositionReason: string;
  engineUsed: string;
  evaluatedAt: string;
}

export type ReviewStatus = 
  | 'PENDING_RA_REVIEW' 
  | 'IN_REVIEW' 
  | 'APPROVED_WITH_AMENDMENTS' 
  | 'VERIFIED_AND_SIGNED' 
  | 'REJECTED_STATUTORY_DEFECT';

export interface HumanReviewItem {
  id: string;
  generationId: string;
  module: 'Strategy Playbook' | 'Radar Impact Analysis' | 'Dynamic Submission Pathway' | 'ISO 14971 Risk Matrix' | 'Statutory Triage' | 'Custom Advisory';
  deviceTitle: string;
  deviceClass: string;
  jurisdictions: string[];
  originalPrompt: string;
  generatedContent: any;
  critique: ClaudeSelfCritique;
  status: ReviewStatus;
  urgency: 'CRITICAL' | 'HIGH' | 'STANDARD';
  assignedReviewer: string;
  humanSignoff?: {
    reviewerName: string;
    racCredentialId: string;
    roleTitle: string;
    signedAt: string;
    auditNotes: string;
    amendedContent?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface GenerationLog {
  id: string;
  timestamp: string;
  module: string;
  engine: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  latencyMs: number;
  estimatedCostUsd: number;
  jurisdiction: string;
  critiqueScore: number;
  disposition: 'AUTO_APPROVED' | 'FLAGGED_FOR_HUMAN_REVIEW' | 'REVIEWED_AND_SIGNED';
  promptSummary: string;
  hasHumanFeedback: boolean;
}

export interface ObservabilityStats {
  totalGenerations: number;
  totalCostUsd: number;
  totalTokens: number;
  avgLatencyMs: number;
  p95LatencyMs: number;
  avgCritiqueScore: number;
  autoApprovalRate: number;
  humanReviewQueueCount: number;
  moduleCostBreakdown: { module: string; costUsd: number; count: number }[];
  engineCostBreakdown: { engine: string; costUsd: number; count: number }[];
  feedbackSatisfactionRate: number;
}

export interface RegulatoryFeedback {
  id: string;
  generationId: string;
  module: string;
  rating: number; // 1-5
  isHelpful: boolean;
  tags: string[];
  expertCorrection?: string;
  reviewerRole: string;
  submittedAt: string;
  promotedToDirective: boolean;
}

export interface SystemDirective {
  id: string;
  title: string;
  authority: 'CDSCO' | 'US FDA' | 'EU MDR' | 'ISO 13485' | 'General';
  ruleGuidance: string;
  derivedFromCorrection: string;
  active: boolean;
  confidenceScore: number;
  updatedAt: string;
}


