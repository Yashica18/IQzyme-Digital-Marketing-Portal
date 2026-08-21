/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ServiceDetail {
  id: string;
  label: string;
  title: string;
  intro: string;
  path: string;
  category: string;
  sections: {
    heading: string;
    items?: string[];
    text?: string;
  }[];
  cta: string;
}

export const SERVICES_DATA: ServiceDetail[] = [
  {
    id: 'regulatory-affairs',
    label: 'Global Regulatory Affairs',
    title: 'Global Regulatory Affairs Consulting for Medical Devices & IVDs',
    path: '/services/regulatory-affairs',
    category: 'Global Market Access',
    intro: 'Regulatory affairs is a commercial function, not a checkbox — it determines how fast, and in how many markets, your technology reaches patients. We deliver end-to-end regulatory strategy, dossier preparation, submission management, agency liaison and post-approval maintenance across every major market. Each jurisdiction runs its own matrix of requirements — a 510(k) strategy rarely transfers cleanly to EU MDR, and a CER accepted under IVDR may need extra work for Health Canada. IQZYME plans for these interdependencies upfront, enabling parallel or sequenced submissions that share documentation and compress time to market.',
    sections: [
      {
        heading: 'FDA Regulatory Consulting (US Market)',
        items: [
          '510(k)',
          'De Novo',
          'PMA',
          'EUA',
          'Q-Sub meetings',
          'Establishment Registration & Device Listing',
          '21 CFR Part 820/QMSR',
          'Audit readiness',
          'US Agent services',
          'UDI/GUDID submission'
        ]
      },
      {
        heading: 'EU MDR & IVDR Consulting (European Market)',
        items: [
          'Technical documentation (MDR/IVDR)',
          'GSPR gap analysis',
          'Notified Body liaison',
          'CE Marking strategy',
          'EUDAMED registration',
          'PRRC support',
          'Significant change assessment'
        ]
      },
      {
        heading: 'ISO 13485 & QMS Consulting',
        items: [
          'Implementation & gap analysis',
          'SOPs/work instructions/forms',
          'Internal audits & management review',
          'MDSAP readiness',
          '21 CFR Part 820/QMSR alignment',
          'Supplier management',
          'CAPA implementation'
        ]
      },
      {
        heading: 'Clinical Evaluation & Post-Market Evidence',
        items: [
          'CERs (MDR Annex XIV)',
          'Systematic literature review',
          'PMCF plan & report',
          'PMS plan & report',
          'PSUR',
          'SSCP',
          'Benefit-risk analysis'
        ]
      },
      {
        heading: 'Technical Documentation',
        items: [
          'Technical Files & Design Dossiers',
          'DHF',
          'DMF & PMF',
          'Risk Management Files (ISO 14971)',
          'Biocompatibility (ISO 10993)',
          'Labelling/IFU review',
          'Usability engineering (IEC 62366-1)'
        ]
      },
      {
        heading: 'Multi-Market Registration',
        items: [
          'MHRA UKCA',
          'Health Canada MDL',
          'TGA ARTG',
          'PMDA Japan',
          'SFDA',
          'MOH UAE',
          'GCC',
          'ASEAN',
          'ANVISA',
          'COFEPRIS',
          'CDSCO India',
          'WHO PQ'
        ]
      },
      {
        heading: 'Applicable Regulations & Standards',
        text: 'EU MDR 2017/745 · EU IVDR 2017/746 · 21 CFR Part 820/QMSR · ISO 13485:2016 · ISO 14971:2019 · ISO 10993 series · IEC 62304 · IEC 62366-1 · IEC 60601-1 · MDCG & FDA guidance · IMDRF guidance'
      },
      {
        heading: 'Our Methodology',
        items: [
          'Feasibility Assessment: classification, intended use, applicable standards, pathway recommendation',
          'Strategy Development: submission sequencing, documentation planning, evidence gaps, agency/NB selection',
          'Documentation Preparation: quality-assured dossier build',
          'Submission Management: agency liaison, query response, review cycles',
          'Post-Authorisation Support: PMS, PMCF, PSUR, renewals, vigilance'
        ]
      },
      {
        heading: 'Deliverables',
        text: 'Regulatory strategy document · Pathway report · Technical documentation package · CER · PMS/PMCF plans · Query responses · Registration certificates'
      }
    ],
    cta: 'Get a Regulatory Strategy Assessment for Your Device'
  },
  {
    id: 'fda-registration',
    label: 'FDA Registration & 510(k)',
    title: 'FDA Registration & 510(k) Services',
    path: '/services/fda-registration',
    category: 'Global Market Access',
    intro: 'We guide medical technology companies through the complex US FDA regulatory pathways. From device classification to post-market compliance, our hands-on expertise ensures a smooth, predictable clearance process.',
    sections: [
      {
        heading: 'Services Portfolio',
        items: [
          '510(k) Submissions: Full-service preparation, pre-submission (Pre-Sub) meetings, and interactive query support.',
          'De Novo & PMA: Custom clinical strategy and scientific writing for higher-risk and novel medical technologies.',
          'Establishment Registration: Annual FDA registrations, US Agent representation for foreign manufacturers, and UDI (GUDID) implementation.',
          'QMSR Compliance: Transitioning quality systems from QSR 21 CFR 820 to the new ISO 13485-aligned Quality Management System Regulation (QMSR).'
        ]
      }
    ],
    cta: 'Schedule a Consultation'
  },
  {
    id: 'eu-mdr',
    label: 'EU MDR 2017/745',
    title: 'EU MDR 2017/745 Compliance',
    path: '/services/eu-mdr',
    category: 'Global Market Access',
    intro: 'Transitioning to or launching under the European Medical Device Regulation (EU MDR 2017/745) requires rigorous technical documentation and clinical evidence. We provide comprehensive gap analysis and drafting services to secure your CE Mark.',
    sections: [
      {
        heading: 'Scope of Expertise',
        items: [
          'Technical Documentation: Authoring and updating Technical Documentation files in full compliance with Annex II and III.',
          'GSPR Assessment: Detailed gap analysis and justification against General Safety and Performance Requirements (Annex I).',
          'Notified Body Management: Preparing submissions, addressing deficiency letters, and coordinating with Notified Bodies (e.g., TÜV, BSI, SGS).',
          'EUDAMED & PRRC: Managing EUDAMED actor registration, UDI assignments, and providing Person Responsible for Regulatory Compliance (PRRC) support.'
        ]
      }
    ],
    cta: 'Schedule a Consultation'
  },
  {
    id: 'eu-ivdr',
    label: 'EU IVDR 2017/746',
    title: 'EU IVDR 2017/746 Compliance',
    path: '/services/eu-ivdr',
    category: 'Global Market Access',
    intro: 'The In Vitro Diagnostic Regulation (EU IVDR 2017/746) has fundamentally changed how IVD products are classified and certified in Europe. IQZYME provides specialized scientific writing and technical support to navigate this challenging transition.',
    sections: [
      {
        heading: 'Key Deliverables',
        items: [
          'Classification & Gap Analysis: Determining correct device class (Class A, B, C, D) and establishing compliance roadmaps.',
          'Performance Evaluation: Authoring Scientific Validity, Analytical Performance, and Clinical Performance Reports (PEP, PER, APR, CPR).',
          'Technical Files: Building robust IVD technical documentation, including risk management (ISO 14971) and manufacturing controls.'
        ]
      }
    ],
    cta: 'Schedule a Consultation'
  },
  {
    id: 'iso-13485',
    label: 'ISO 13485:2016 QMS',
    title: 'ISO 13485:2016 Quality Management Systems',
    path: '/services/iso-13485',
    category: 'Quality & Engineering',
    intro: 'A robust, compliant Quality Management System (QMS) is the foundation of any successful medical technology company. We design and implement tailored, practical, and audit-ready QMS frameworks that support your growth.',
    sections: [
      {
        heading: 'Full-Lifecycle Support',
        items: [
          'Gap Analysis & Design: Assessing existing processes and designing a custom QMS framework aligned with ISO 13485:2016, FDA QMSR, and CDSCO rules.',
          'Implementation & Training: Drafting Standard Operating Procedures (SOPs), templates, and conducting team-wide training.',
          'Internal Audits & Pre-Audits: Performing independent internal audits, gap closures, and mock audits ahead of certification body inspections.',
          'MDSAP & ISO 9001: Harmonizing QMS requirements for the Medical Device Single Audit Program (US, Canada, Brazil, Japan, Australia).'
        ]
      }
    ],
    cta: 'Schedule a Consultation'
  },
  {
    id: 'samd-digital-health',
    label: 'SaMD & Digital Health',
    title: 'Regulatory Consulting for SaMD, AI/ML Devices & Digital Health',
    path: '/services/samd-digital-health',
    category: 'Quality & Engineering',
    intro: 'SaMD is among the fastest-evolving, most complex categories in healthcare technology, with FDA, the EU and MHRA actively updating guidance for AI/ML devices and digital therapeutics. Our team brings active expertise in FDA\'s Digital Health guidance, EU MDR Rule 11 classification, IEC 62304, IEC 62366-1 and emerging cybersecurity requirements.',
    sections: [
      {
        heading: 'SaMD Classification & Regulatory Strategy',
        text: 'We determine whether your software meets the medical device definition under FDA, EU MDR or other frameworks, then map the fastest path to authorisation, including Pre-Sub meetings and early notified body engagement.'
      },
      {
        heading: 'IEC 62304 Software Lifecycle Compliance',
        text: 'We guide teams through safety classification, development planning, testing and configuration management, with documentation that satisfies FDA, EU MDR and IVDR.'
      },
      {
        heading: 'IEC 62366-1 Usability Engineering',
        text: 'We build usability files and formative/summative evaluation plans meeting FDA Human Factors and EU MDR GSPR requirements.'
      },
      {
        heading: 'Cybersecurity Regulatory Compliance',
        text: 'We integrate cybersecurity into your QMS, support SBOM preparation and advise on vulnerability management under FDA, EU MDR GSPR Section 17 and IEC 81001-5-1.'
      },
      {
        heading: 'Mobile Medical Application (MMA) Guidance',
        text: 'We assess apps against FDA enforcement discretion and EU MDR classification rules, and build submission-ready documentation where the device definition applies.'
      },
      {
        heading: 'Applicable Regulations & Standards',
        text: 'IEC 62304 · IEC 62366-1 · FDA Digital Health guidance · IMDRF SaMD N10/N12/N41 · EU MDR Rule 11 · EU AI Act · IEC 81001-5-1 · FDA Cybersecurity Guidance 2023 · ISO 14971'
      }
    ],
    cta: 'Request a SaMD Classification Assessment'
  },
  {
    id: 'clinical-evaluation',
    label: 'Clinical Evaluation (CER)',
    title: 'Clinical Evaluation & CER Services',
    path: '/services/clinical-evaluation',
    category: 'Quality & Engineering',
    intro: 'Securing global approvals — especially under EU MDR — demands robust clinical evidence. We provide specialized clinical writing services to synthesize complex data into compliant clinical evaluation files.',
    sections: [
      {
        heading: 'Key Clinical Outputs',
        items: [
          'Clinical Evaluation Reports (CER): Developing clinical evaluation plans and reports in strict compliance with MDCG guidelines and MEDDEV 2.7/1 rev 4.',
          'Systematic Literature Review: Performing high-yield literature searches, screening, and clinical data appraisal using Embase, PubMed, and Cochrane.',
          'PMS, PMCF & PSUR: Drafting Post-Market Surveillance (PMS) plans, Post-Market Clinical Follow-up (PMCF) plans/reports, and Periodic Safety Update Reports (PSUR).',
          'SSCP & CEP: Authoring Summary of Safety and Clinical Performance (SSCP) and Clinical Evaluation Plans (CEP).'
        ]
      }
    ],
    cta: 'Schedule a Consultation'
  },
  {
    id: 'facility-consulting',
    label: 'Cleanroom & GMP Facility',
    title: 'Turnkey Medical Device & Pharmaceutical Manufacturing Facility Consulting',
    path: '/services/facility-consulting',
    category: 'Quality & Engineering',
    intro: 'Building a device or pharma manufacturing facility is as much a regulatory exercise as an engineering one — layout, cleanroom classification, HVAC and utility systems must satisfy GMP from day one. IQZYME brings regulatory, engineering and validation expertise together, supporting clients from site selection through construction, qualification, validation and inspection readiness.',
    sections: [
      {
        heading: 'Cleanroom Design & Construction',
        items: [
          'GMP-compliant layout',
          'ISO 14644 classification',
          'Contamination control',
          'Material/personnel flow',
          'Construction supervision'
        ]
      },
      {
        heading: 'HVAC Design & Validation',
        items: [
          'System design review',
          'IQ/OQ/PQ',
          'Air change rate, pressure, temperature/humidity mapping',
          'Environmental monitoring design'
        ]
      },
      {
        heading: 'Equipment Qualification & Process Validation',
        items: [
          'IQ/OQ/PQ',
          'Process validation',
          'Sterilization validation (EO, gamma, steam)',
          'Packaging validation (ISO 11607)',
          'Shelf-life studies'
        ]
      },
      {
        heading: 'Computer System Validation (CSV)',
        items: [
          '21 CFR Part 11 compliant CSV: for MES, LIMS, ERP and QMS software',
          'GAMP 5-aligned lifecycle',
          'URS/FS/validation plans'
        ]
      },
      {
        heading: 'GMP Implementation & Gap Assessment',
        items: [
          'Gap analysis: (ISO 13485, 21 CFR Part 820/QMSR, MDR Annex I, Schedule M)',
          'SOP development',
          'Training programmes',
          'Inspection readiness'
        ]
      },
      {
        heading: 'Refrigeration & Cold Chain Consulting',
        items: [
          'Cold chain design/qualification: for pharma, IVD and food',
          'Temperature mapping',
          'GDP compliance'
        ]
      },
      {
        heading: 'Industries Served',
        text: 'Medical Device Manufacturing · IVD Manufacturing · Pharmaceutical Manufacturing · Biological Products · Sterile Manufacturing · Food & Nutraceuticals'
      }
    ],
    cta: 'Speak with Our Facility Consulting Team'
  },
  {
    id: 'cdsco-licensing',
    label: 'CDSCO Regulatory Services (India)',
    title: 'CDSCO Regulatory Consulting for Medical Devices & IVDs in India',
    path: '/services/cdsco-licensing',
    category: 'Indian Regulatory Support',
    intro: "India's Central Drugs Standard Control Organisation (CDSCO) governs licensing for medical devices and IVDs under the Medical Device Rules, 2017. IQZYME guides manufacturers, importers and traders through classification, documentation and licence acquisition, from first submission to renewal.",
    sections: [
      {
        heading: 'CDSCO Licensing Services',
        items: [
          'Manufacturing Licence: Class A/B/C/D applications, plant master file preparation, QMS documentation',
          'Import Licence: registration and licensing for foreign manufacturers and Indian importers',
          'Test Licence: for testing, clinical evaluation, training and demonstration batches',
          'Loan Licence: support for contract/loan manufacturing arrangements',
          'Wholesale & Retail Licence: licensing for sale and distribution',
          'Medical Device Rules 2017 Advisory: classification, labelling and compliance guidance'
        ]
      }
    ],
    cta: 'Need a CDSCO licence for your device? Talk to our licensing team →'
  },
  {
    id: 'bis-certification',
    label: 'BIS Certification',
    title: 'BIS Certification & Registration Consulting',
    path: '/services/bis-certification',
    category: 'Indian Regulatory Support',
    intro: 'Certain devices, components and electronic products require Bureau of Indian Standards (BIS) certification before sale in India. IQZYME manages the process end-to-end — applicable standard identification, test coordination, documentation and licence maintenance.',
    sections: [
      {
        heading: 'Our Services',
        items: [
          'Applicability assessment: Confirming standard applicability and registration pathways.',
          'Test coordination: Liaising with BIS-recognised labs for standard compliance checks.',
          'Application and documentation support: Compiling dossiers, test logs, and managing submissions.',
          'Certificate renewal: Ongoing compliance maintenance and audit preparedness.'
        ]
      }
    ],
    cta: 'Confirm whether your product needs BIS certification →'
  },
  {
    id: 'ipr-patents-trademarks',
    label: 'Patents, Trademarks & IPR Services',
    title: 'Intellectual Property Rights (IPR) Consulting for Healthcare Innovation',
    path: '/services/ipr-patents-trademarks',
    category: 'Indian Regulatory Support',
    intro: 'Innovation in medical technology is only as protected as its IP strategy. IQZYME supports device and diagnostics companies through patent, trademark, copyright and technology transfer processes — safeguarding the innovation behind every regulatory submission.',
    sections: [
      {
        heading: 'Intellectual Property Services',
        items: [
          'Patents: patentability search, drafting, filing and prosecution (India and international routes); design patents for device form factors',
          'Trademarks: search, registration, renewal and portfolio management for brand protection',
          'Copyrights: registration for technical documentation, software and design assets',
          'Technology Transfer (ToT): licensing agreements, transfer documentation and due diligence support'
        ]
      }
    ],
    cta: 'Protect your innovation before you protect your market access →'
  },
  {
    id: 'gem-portal',
    label: 'GeM Portal Registration',
    title: 'Government e-Marketplace (GeM) Portal Registration',
    path: '/services/gem-portal',
    category: 'Indian Regulatory Support',
    intro: "The Government e-Marketplace (GeM) is India's procurement platform for public sector buyers. IQZYME supports medical device, IVD and healthcare product companies through seller registration, documentation and catalog listing — a direct route to government tenders.",
    sections: [
      {
        heading: 'Our Services',
        items: [
          'Seller account registration: Secure setup and identity onboarding.',
          'Document & compliance verification: Ensuring statutory uploads meet public procurement standards.',
          'Product catalog listing: Uploading clean, optimized listings matching tender codes.',
          'Bid & tender support: Assistance with direct orders, L1 bidding, and tender submissions.'
        ]
      }
    ],
    cta: 'Get your products listed for government procurement →'
  },
  {
    id: 'pollution-control',
    label: 'Pollution Control Board Services',
    title: 'EPR & Pollution Control Board Consulting',
    path: '/services/pollution-control',
    category: 'Indian Regulatory Support',
    intro: "Manufacturing and packaging operations in the medical device, IVD and healthcare space carry environmental compliance obligations under India's Pollution Control Board framework. IQZYME manages registration and consent processes from setup through operation.",
    sections: [
      {
        heading: 'Our Services',
        items: [
          'EPR Registration: Extended Producer Responsibility (EPR) registration for plastics, e-waste and batteries.',
          'Consent to Establish (CTE): Initial NOC and setup clearances for manufacturing sites.',
          'Consent to Operate (CTO): Regulatory licensing to commence factory operations.',
          'Compliance & renewal support: Environmental monitoring, reports filing and renewal management.'
        ]
      }
    ],
    cta: 'Ensure your facility meets environmental compliance requirements →'
  },
  {
    id: 'entrepreneurship-facilitation',
    label: 'Entrepreneurship Facilitation Center',
    title: 'Startup & Entrepreneurship Facilitation Services',
    path: '/services/entrepreneurship-facilitation',
    category: 'Indian Regulatory Support',
    intro: 'Early-stage medtech and healthcare ventures need more than regulatory guidance — they need a partner who understands company formation, technology access and funding-ready documentation. IQZYME supports founders from concept to compliant, fundable business.',
    sections: [
      {
        heading: 'Startup & Entrepreneurship Services',
        items: [
          'Startup Assistance: advisory for early-stage medtech ventures',
          'Technology Sourcing & Transfer: identifying and licensing relevant technology',
          'Company Formation: incorporation and statutory setup support',
          'Design Patents: protection for device design and form factor',
          'CDSCO Licensing Guidance: early-stage regulatory pathway planning',
          'Detailed Project Reports (DPR): funding and lender-ready project documentation'
        ]
      }
    ],
    cta: "Building a medtech startup? Let's plan your first 12 months →"
  },
  {
    id: 'other-statutory-services',
    label: 'Other Statutory Services',
    title: 'Other Statutory & Compliance Services for Manufacturers',
    path: '/services/other-statutory-services',
    category: 'Indian Regulatory Support',
    intro: 'Beyond core regulatory and quality requirements, manufacturing operations need a range of statutory registrations. IQZYME handles these alongside your core regulatory programme so nothing falls through the gaps.',
    sections: [
      {
        heading: 'Our Services',
        items: [
          'Factories & Boilers Permits: Local health, safety and operational clearances.',
          'Import Export Code (IEC) Registration: Facilitating cross-border raw materials and finished goods trade.',
          'Legal Metrology (LMPC) Certificate: Weight, package measurements, and labelling regulatory approvals.',
          'FSSAI Registration: For nutraceuticals, food supplements, and dietary items.',
          'Udyam Registration: MSME certification unlocking interest subsidies and priority public tenders.',
          'K-SMART Registration: Comprehensive local self-government licensing and permits.'
        ]
      }
    ],
    cta: 'Consolidate your statutory compliance under one team →'
  }
];
