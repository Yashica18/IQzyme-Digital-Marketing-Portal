/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RouteInfo, SuccessStory, PositionItem, BlogPost, FAQItem, MarketingEvent } from './types';

export const ROUTES: RouteInfo[] = [
  {
    path: '/',
    label: 'Home',
    category: 'main',
    meta: {
      title: 'IQZYME | Global Medical Device & IVD Regulatory Consulting | CDSCO · FDA · EU MDR · ISO 13485',
      description: 'End-to-end regulatory affairs, quality systems and market access consulting for medical devices, IVDs, digital health and pharma products across CDSCO, FDA, EU MDR, IVDR and WHO-PQ.'
    }
  },
  {
    path: '/about-us',
    label: 'About Us',
    category: 'main',
    meta: {
      title: 'About IQZYME | Global Regulatory & Quality Consulting for MedTech',
      description: 'IQZYME is a global regulatory affairs, quality systems and market access consulting firm for medical devices, IVDs, digital health and pharma products.'
    }
  },
  {
    path: '/services',
    label: 'Services',
    category: 'main',
    meta: {
      title: 'End-to-End Regulatory & Compliance Services',
      description: 'Comprehensive services from concept to commercialization: CDSCO licensing, CE-MDR/IVDR, FDA premarket submissions, QMS ISO 13485 implementation, and turnkey facility projects.'
    }
  },
  {
    path: '/services/regulatory-affairs',
    label: 'Regulatory Affairs',
    category: 'services',
    meta: {
      title: 'Global Medical Device Regulatory Affairs Consulting | IQZYME',
      description: 'End-to-end regulatory affairs consulting for FDA 510(k), EU MDR, EU IVDR, ISO 13485, CDSCO and 30+ global markets — strategy, dossier prep and in-country representation.'
    }
  },
  {
    path: '/services/fda-registration',
    label: 'FDA Registration',
    category: 'services',
    meta: {
      title: 'FDA Medical Device Registration & 510(k) Consulting | IQZYME',
      description: 'Expert FDA regulatory consulting for 510(k), De Novo, PMA, establishment registration, UDI and QMSR compliance.'
    }
  },
  {
    path: '/services/eu-mdr',
    label: 'EU MDR',
    category: 'services',
    meta: {
      title: 'EU MDR 2017/745 Consulting | CE Marking for Medical Devices | IQZYME',
      description: 'EU MDR compliance consulting — technical documentation, GSPR gap analysis, notified body liaison, CER, PMS and PMCF.'
    }
  },
  {
    path: '/services/eu-ivdr',
    label: 'EU IVDR',
    category: 'services',
    meta: {
      title: 'EU IVDR 2017/746 Consulting | IVD CE Marking | IQZYME',
      description: 'Regulatory consulting for EU IVDR compliance — classification, technical documentation and notified body submission.'
    }
  },
  {
    path: '/services/iso-13485',
    label: 'ISO 13485',
    category: 'services',
    meta: {
      title: 'ISO 13485:2016 QMS Implementation & Certification | IQZYME',
      description: 'Expert ISO 13485:2016 consulting for medical device and IVD manufacturers — gap analysis, implementation, internal audits.'
    }
  },
  {
    path: '/services/samd-digital-health',
    label: 'SaMD / Digital Health',
    category: 'services',
    meta: {
      title: 'SaMD & Digital Health Regulatory Consulting | CDSCO · FDA · EU MDR · IEC 62304 | IQZYME',
      description: 'Regulatory consulting for Software as a Medical Device (SaMD), AI/ML-enabled devices, mobile medical apps and digital therapeutics — FDA, EU MDR, IEC 62304 and cybersecurity strategy.'
    }
  },
  {
    path: '/services/clinical-evaluation',
    label: 'Clinical Evaluation',
    category: 'services',
    meta: {
      title: 'Clinical Evaluation Report (CER) Consulting | EU MDR | IQZYME',
      description: 'Clinical evaluation and CER preparation for EU MDR compliance — PMCF plans, literature review, PSUR and SSCP.'
    }
  },
  {
    path: '/services/facility-consulting',
    label: 'Facility Consulting',
    category: 'services',
    meta: {
      title: 'Cleanroom & Medical Device Manufacturing Facility Consulting | IQZYME',
      description: 'End-to-end turnkey consulting for cleanroom design, construction, HVAC validation, CSV and GMP implementation for medical device, IVD and pharmaceutical facilities.'
    }
  },
  {
    path: '/services/cdsco-licensing',
    label: 'CDSCO Licensing (India)',
    category: 'services',
    meta: {
      title: 'CDSCO Medical Device & IVD Licensing Consultants in India | IQZYME',
      description: 'End-to-end CDSCO regulatory consulting for medical device and IVD manufacturers, importers and traders — manufacturing, import, test, loan and wholesale licences under the Medical Device Rules, 2017.'
    }
  },
  {
    path: '/services/bis-certification',
    label: 'BIS Certification',
    category: 'services',
    meta: {
      title: 'BIS Certification & Registration Consulting | IQZYME',
      description: 'BIS certification and compliance support for medical device components, electronics and applicable products sold in India.'
    }
  },
  {
    path: '/services/ipr-patents-trademarks',
    label: 'IPR, Patents & Trademarks',
    category: 'services',
    meta: {
      title: 'Patent, Trademark & IPR Consulting for MedTech Companies | IQZYME',
      description: 'End-to-end IP protection for medical device, IVD and healthcare innovators — patent filing and prosecution, trademark registration, copyright and technology transfer support.'
    }
  },
  {
    path: '/services/gem-portal',
    label: 'GeM Portal Registration',
    category: 'services',
    meta: {
      title: 'GeM Portal Registration Consultants | IQZYME',
      description: 'Seller onboarding, documentation and catalog listing support for Government e-Marketplace (GeM) registration.'
    }
  },
  {
    path: '/services/pollution-control',
    label: 'Pollution Control & EPR',
    category: 'services',
    meta: {
      title: 'EPR & Pollution Control Board Consulting | IQZYME',
      description: 'Extended Producer Responsibility (EPR) registration for plastics, e-waste and batteries, plus Consent to Establish and Operate support for manufacturing facilities.'
    }
  },
  {
    path: '/services/entrepreneurship-facilitation',
    label: 'Entrepreneurship Facilitation',
    category: 'services',
    meta: {
      title: 'Startup & Entrepreneurship Facilitation Services | IQZYME',
      description: 'Startup assistance, technology sourcing and transfer, company formation and Detailed Project Report (DPR) support for medtech and healthcare entrepreneurs.'
    }
  },
  {
    path: '/services/other-statutory-services',
    label: 'Other Statutory Services',
    category: 'services',
    meta: {
      title: 'Other Statutory & Compliance Services for Manufacturers | IQZYME',
      description: 'Factories & Boilers permits, Import Export Code (IEC), Legal Metrology, FSSAI, Udyam and K-SMART registration support for medical device and healthcare manufacturers.'
    }
  },
  {
    path: '/industries-served',
    label: 'Industries',
    category: 'main',
    meta: {
      title: 'Industries We Serve - Specialized Medtech Sectors',
      description: 'Tailored regulatory, facility design, and compliance solutions for Medical Devices, In Vitro Diagnostics (IVD), Cosmetics, Startups, and Biotech.'
    }
  },
  {
    path: '/resources',
    label: 'Resources',
    category: 'resources',
    meta: {
      title: 'Regulatory Resources & Technical Knowledge Hub',
      description: 'Explore the latest whitepapers, regulatory updates (like the WHO-PQ 2026 procedures), guidelines, and FAQ archives for healthcare innovators.'
    }
  },
  {
    path: '/careers',
    label: 'Careers',
    category: 'resources',
    meta: {
      title: 'Join Our Team of Regulatory Experts - IQzyme Careers',
      description: 'Build a meaningful career in medtech regulatory affairs, ISO 13485 QMS auditing, cleanroom facility validations, and medical scientific writing.'
    }
  },
  {
    path: '/contact-us',
    label: 'Contact',
    category: 'main',
    meta: {
      title: 'Contact IQZYME | Global Regulatory Consulting | Request a Consultation',
      description: 'Speak with IQZYME\'s regulatory experts. Request a consultation for FDA, EU MDR, ISO 13485, MDSAP, SaMD or CDSCO strategy.'
    }
  },
  {
    path: '/case-studies',
    label: 'Case Studies',
    category: 'resources',
    meta: {
      title: 'Regulatory Client Success Stories - IQzyme Medtech',
      description: 'Explore our track record in fast-tracking CDSCO SUGAM approvals, WHO-PQ certificates, and EU IVDR compliance for diagnostics and medical devices.'
    }
  },
  {
    path: '/testimonials',
    label: 'Testimonials',
    category: 'resources',
    meta: {
      title: 'Client Endorsements & Testimonials - IQzyme Medtech',
      description: 'Read genuine feedback from biotech founders, clinical lab owners, and medtech innovators regarding our personalized regulatory guidance.'
    }
  },
  {
    path: '/news',
    label: 'News',
    category: 'resources',
    meta: {
      title: 'IQzyme Medtech Press Releases & Compliance News',
      description: 'Stay up to date with national and international regulatory amendments, WHO-PQ changes, and company updates.'
    }
  },
  {
    path: '/events',
    label: 'Events',
    category: 'resources',
    meta: {
      title: 'Upcoming Regulatory Training Webinars & Conventions',
      description: 'Participate in specialized webinars on ISO 13485 audits, CDSCO SUGAM licensing, and WHO Prequalification changes.'
    }
  },
  {
    path: '/blog',
    label: 'Blog',
    category: 'resources',
    meta: {
      title: 'IQzyme Insights Blog - Medtech Regulatory Strategy',
      description: 'Read expert articles on CDSCO MDR 2017 compliance, FDA 510(k) clearances, and EU IVDR transition frameworks.'
    }
  },
  {
    path: '/faq',
    label: 'FAQ',
    category: 'resources',
    meta: {
      title: 'Medical Device Regulatory FAQs | FDA, EU MDR, ISO 13485 | IQZYME',
      description: 'Answers to key questions on medical device regulatory affairs, FDA 510(k), EU MDR compliance, ISO 13485 certification, CE Marking, SaMD regulation and global market access.'
    }
  },
  {
    path: '/cookies',
    label: 'Cookies Policy',
    category: 'other',
    meta: {
      title: 'IQzyme Medtech - Cookie Policy',
      description: 'Learn how we handle cookies and tracking elements for the IQzyme Medtech compliance portal.'
    }
  },
  {
    path: '/admin',
    label: 'Admin Dashboard',
    category: 'other',
    meta: {
      title: 'Admin Dashboard - IQzyme Medtech',
      description: 'Secure Admin Dashboard to view and manage consultation requests, contact enquiries, and newsletter subscribers.'
    }
  },
  {
    path: '/404-error',
    label: '404 Error',
    category: 'other',
    meta: {
      title: 'Page Not Found',
      description: 'Oh no! The requested page was not found. Try returning to the home page of IQzyme Medtech.'
    }
  },
  {
    path: '/regulatory-radar',
    label: 'Regulatory Radar',
    category: 'main',
    meta: {
      title: 'Live Regulatory Radar & Global Intelligence Watchdog | IQZYME',
      description: 'Continuously updated regulatory intelligence, FDA guidance, EU MDR transitions, CDSCO updates, and AI impact analysis for medtech innovators.'
    }
  },
  {
    path: '/interactive-pathways',
    label: 'Dynamic Pathways & Risk Heatmap',
    category: 'resources',
    meta: {
      title: 'Dynamic Submission Pathways & ISO 14971 Risk Heatmap | IQZYME',
      description: 'Regenerable regulatory infographics, comparative submission Gantt charts, ISO 14971 ALARP risk matrices, and SaMD Rule 11 decision trees.'
    }
  },
  {
    path: '/strategy-generator',
    label: 'Strategy Playbook Generator',
    category: 'resources',
    meta: {
      title: 'On-Demand Medical Device Regulatory Strategy Playbook | IQZYME',
      description: 'Configure your product profile to generate custom multi-jurisdiction classification, testing roadmaps, and audit gap analyses on demand.'
    }
  },
  {
    path: '/regulatory-triage',
    label: 'Statutory Triage Navigator',
    category: 'resources',
    meta: {
      title: 'Front-Door Medical Device Statutory Triage | IQZYME',
      description: 'Instant 3-question statutory triage engine to determine your device class, statutory fees, and approval timelines.'
    }
  },
  {
    path: '/client-portal',
    label: 'Client Portal',
    category: 'main',
    meta: {
      title: 'Secure Client Advisory Hub - IQzyme',
      description: 'Access your private technical files, file evaluation progress reports, and schedule real-time consultation meetings.'
    }
  },
  {
    path: '/client-success',
    label: 'Client Success',
    category: 'other',
    meta: {
      title: 'Regulatory Success Benchmarks - IQzyme Medtech',
      description: 'Discover how we reduce time-to-market by up to 40% and optimize Quality Management System implementations.'
    }
  },
  {
    path: '/clients',
    label: 'Clients',
    category: 'other',
    meta: {
      title: 'Our Trusted Partners & Client Organizations',
      description: 'Review our project associations with organizations like DBT-BIRAC, NIB, AMTZ, WHO, CCAMP, and Venture Center Pune.'
    }
  },
  {
    path: '/training',
    label: 'Training',
    category: 'other',
    meta: {
      title: 'Upskilling & Regulatory Competence Training',
      description: 'Empower your quality assurance and regulatory affairs teams with our BSI-trained consultants.'
    }
  },
  {
    path: '/seo-strategy',
    label: 'SEO Authority Strategy',
    category: 'resources',
    meta: {
      title: 'IQzyme Medtech - B2B SEO & E-E-A-T Strategy Framework',
      description: 'Discover our comprehensive search engine optimization and digital authority roadmap for MedTech & IVD sectors in India.'
    }
  },
  {
    path: '/book-consultation',
    label: 'Book Consultation',
    category: 'other',
    meta: {
      title: 'Schedule a Regulatory Consultation',
      description: 'Book an advisory slot with our lead scientific experts to roadmap your CDSCO SUGAM, FDA, or CE IVDR filings.'
    }
  }
];

export const TESTIMONIALS = [
  {
    id: 't2',
    quote: "With Mr. Sinto Poulose's BSI-trained guidance on CE Marking under EU IVDR, our technical files were approved on the first attempt. The team acts as a natural extension of our own organization.",
    author: "Klaus Lindeman",
    role: "VP Quality & Regulatory",
    company: "EuroHelix Diagnostics GmbH",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120"
  },
  {
    id: 't3',
    quote: "Designing a GMP-compliant cleanroom facility seemed like an endless paperwork loop. Mrs. Selma S and the turnkey projects team handled everything from HVAC validation to final CDSCO licensing perfectly.",
    author: "R. Mukundan",
    role: "Managing Director",
    company: "Apex Medtech Systems",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120"
  }
];

export const CASE_STUDIES: SuccessStory[] = [
  {
    id: 'cs1',
    title: 'Achieving CDSCO Manufacturing Licence for Class C Cardiac Catheters',
    client: 'SurgiCore Medtech',
    industry: 'Medical Devices',
    metrics: 'License Grant in 4.5 Months & Zero Non-Conformities',
    description: 'Guiding an advanced catheter manufacturing facility through complex CDSCO Central Licensing Authority audits and technical file compilation.',
    challenge: 'A failed layout inspection previously delayed commercialization. Retrofitting was extremely costly and required restructuring under cGMP standards.',
    solution: 'Audited and optimized the cleanroom layout, designed correct pressure differentials, compiled the complete technical dossier, and supported on-site audit coordination.',
    image: '/images/medical_device_regulatory.jpg'
  },
  {
    id: 'cs2',
    title: 'Securing WHO Prequalification (WHO-PQ) for Indigenous IVD Malaria Kits',
    client: 'GenoDiagnostic Labs',
    industry: 'In Vitro Diagnostics (IVD)',
    metrics: 'Successful WHO-PQ Listing & Abridged Assessment Fast-Track',
    description: 'Comprehensive dossier compilation and manufacturing quality audits for global procurement eligibility in low-resource settings.',
    challenge: 'Navigating the new WHO prequalification assessment procedure where performance evaluation has become a strict prerequisite and a separate step.',
    solution: 'Prepared the complete dossier, conducted mock audits simulating WHO conditions, coordinated with testing clinical establishments, and completed the modular assessment review.',
    image: '/images/molecular_diagnostics_lab.jpg'
  },
  {
    id: 'cs3',
    title: 'ISO 13485:2016 QMS Setup and CE-IVD Marking under EU Regulation 2017/746',
    client: 'HelixBio Systems',
    industry: 'Molecular Diagnostics',
    metrics: 'Full Certification within 8 Months & EU Market Launch',
    description: 'Transitioning a complex qPCR-based diagnostic device to meet strict European Union IVDR regulations.',
    challenge: 'Inefficient quality management paperwork, gaps in scientific validity, and inadequate clinical evidence files for Annex II/III Notified Body submission.',
    solution: 'Designed and deployed a tailored, digital-ready ISO 13485 QMS, drafted clinical performance reports (CPR), and established post-market surveillance (PMS) tracking.',
    image: '/images/sterile_cleanroom_facility.jpg'
  }
];

export const OPEN_POSITIONS: PositionItem[] = [
  {
    id: 'p1',
    title: 'Senior Consultant - CDSCO Licensing (MDR 2017)',
    department: 'Indian Regulatory Affairs',
    location: 'New Delhi Office (On-site / Hybrid)',
    type: 'Full-time',
    description: 'Lead client registrations, SUGAM submissions (Form MD-15, MD-42), and state/central licensing authority communications across India.',
    requirements: [
      '6+ years experience dealing directly with CDSCO licensing processes',
      'Extensive knowledge of Indian Medical Device Rules, 2017 across Class A-D',
      'Strong track record of successful regulatory approvals for implants or IVD systems'
    ]
  },
  {
    id: 'p2',
    title: 'QA / QC Auditor - ISO 13485 & WHO-PQ',
    department: 'Quality Systems & Certification',
    location: 'Cochin Headquarters (With Regional Travel)',
    type: 'Full-time',
    description: 'Design and implement QMS, conduct mock inspections simulating CDSCO, FDA and WHO-PQ criteria, and support cleanroom validations.',
    requirements: [
      'Certified Lead Auditor (ISO 13485:2016) trained by BSI or equivalent',
      '4+ years hands-on experience in sterile medical device or molecular diagnostic QA/QC',
      'Excellent analytical documentation skills and knowledge of ISO 14644 standard'
    ]
  },
  {
    id: 'p3',
    title: 'Medical Writer & Regulatory Analyst (EU MDR/IVDR)',
    department: 'Global Regulatory Services',
    location: 'Bengaluru Office (Hybrid)',
    type: 'Full-time',
    description: 'Formulate, review, and draft Clinical Evaluation Reports (CER), Performance Evaluation Reports (PER), and Technical Files for Notified Body submission.',
    requirements: [
      'Postgraduate / Ph.D. in Molecular Biology, Biochemistry, or Biomedical Engineering',
      'Deep domain understanding of EU MDR 2017/745 and IVDR 2017/746 regulatory guidelines',
      'Exceptional scientific communication and regulatory file preparation skills'
    ]
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'b1',
    title: 'Adapting to the New WHO Prequalification (WHO-PQ) Procedure',
    category: 'WHO-PQ',
    excerpt: 'Detailed analysis of the new modular procedure, effective January 1st, where performance evaluation has become a separate prerequisite.',
    content: 'Effective January 1st, the World Health Organization has transitioned to a highly modular, risk-based assessment framework for IVD prequalification. A key change is that performance evaluation (PE) is now established as a distinct prerequisite and separate step before the prequalification assessment can begin. This article breaks down the eligibility criteria for PE, option A versus option B pathways, updated assessment components, the expanded use of reliance / recognition pathways, and the consolidated single-installment prequalification fee structure.',
    date: 'July 02, 2026',
    readTime: '9 min read',
    author: 'Dr. P. S. Chandranand, Director',
    image: '/images/molecular_diagnostics_lab.jpg'
  },
  {
    id: 'b2',
    title: 'CDSCO Licensing Pathway under Indian MDR 2017: A Complete Blueprint',
    category: 'CDSCO Licensing',
    excerpt: 'Navigate the complete licensing process from risk-based classification through QMS readiness and final central/state authority approvals.',
    content: 'Since the notification of the Medical Device Rules 2017, the Indian regulatory landscape has evolved rapidly. To achieve commercial success, medical device and IVD manufacturers must follow a systematic 6-step pathway: (1) Risk-based device and IVD classification, (2) Technical file and dossier compilation, (3) ISO 13485 quality management system (QMS) gap assessment, (4) Direct application submission to CDSCO or Notified Body, (5) Audit support and facility inspection query management, and (6) Post-approval compliance (renewals and labeling). We analyze the exact requirements for Manufacturing, Import, Test, Loan, and Wholesale licences.',
    date: 'June 20, 2026',
    readTime: '12 min read',
    author: 'Mr. Sinto Poulose, Founder Director',
    image: '/images/medical_device_regulatory.jpg'
  },
  {
    id: 'b3',
    title: 'Designing Compliant Turnkey Facilities: Why Quality Begins in Layout',
    category: 'Turnkey Projects',
    excerpt: 'Retrofitting a cleanroom after a failed regulatory inspection is far costlier than designing for cGMP compliance from the outset.',
    content: 'Many regulatory delays do not stem from paperwork, but from fundamental facility design layout choices made during early construction stages. A compliant medtech facility requires deep alignment of cleanroom layouts, HVAC airlocks, utility piping, risk-based workflows, and environmental monitoring plans per ISO 14644 standards. Our team maps out the timeline of Specialized Design, Construction oversight, IQ/OQ/PQ protocols, and validation compliance.',
    date: 'May 10, 2026',
    readTime: '8 min read',
    author: 'Mrs. Selma S, Founder Director',
    image: '/images/sterile_cleanroom_facility.jpg'
  }
];

export const NEWS_ITEMS = [
  {
    id: 'n1',
    title: 'IQzyme Medtech PVT. LTD. Expands Pan-India Footprint to 6 Offices',
    date: 'July 01, 2026',
    category: 'Corporate Update',
    summary: 'With physical offices in Cochin, Mumbai, Bengaluru, Coimbatore, Surat, and New Delhi, IQzyme provides unified national reach combined with local licensing intimacy.',
    content: 'IQzyme Medtech Private Limited has completed its pan-India network expansion, solidifying its presence across key medtech hubs and political decision centers. This multi-city presence allows our consultants to coordinate directly with regional licensing authorities, state pollution control boards, and client manufacturing sites seamlessly under one standard of service.'
  },
  {
    id: 'n2',
    title: 'Dr. P. S. Chandranand Named Principal Consultant for WHO Prequalification Support',
    date: 'June 15, 2026',
    category: 'Leadership Announcement',
    summary: 'Dr. Chandranand, PhD, brings over 30 years of regulatory and WHO collaboration experience to help IVD manufacturers successfully enter low-resource markets.',
    content: 'Having previously served as Deputy Quality Manager at the National Institute of Biologicals (NIB), Dr. Chandranand brings a wealth of hands-on expertise in WHO-PQ consultations, diagnostic testing validations, and local technology transfers. He will lead IQzyme\'s specialized global prequalification division.'
  },
  {
    id: 'n3',
    title: 'IQzyme Partners with Top Notified Bodies for EU MDR/IVDR Transition Accelerator',
    date: 'May 20, 2026',
    category: 'Partnership',
    summary: 'A direct collaboration protocol designed to reduce technical file query loops and speed up clinical evidence review stages for European market entry.',
    content: 'Led by BSI-trained Lead Consultant Mr. Sinto Poulose, the new EU MDR/IVDR Transition Accelerator has successfully helped 15+ Indian molecular diagnostic firms achieve European CE conformity files.'
  }
];

export const EVENTS: MarketingEvent[] = [
  {
    id: 'e1',
    title: 'Mastering WHO Prequalification Modular Transition and PE Prerequisites',
    date: 'July 25, 2026',
    time: '11:00 - 12:30 IST',
    location: 'Interactive Digital Live-Stream',
    type: 'Webinar',
    description: 'Dr. P. S. Chandranand details the exact changes implemented on January 1st, covering the performance evaluation prerequisite, modular assessment options, and abridged reliance pathways.'
  },
  {
    id: 'e2',
    title: 'Hands-on bootcamp: Designing cGMP Facility Layouts & Cleanrooms',
    date: 'August 18, 2026',
    time: '10:00 - 15:00 IST',
    location: 'Cochin Headquarters Seminar Hall',
    type: 'Seminar',
    description: 'A physical technical workshop led by Mrs. Selma S covering HVAC requirements, cleanroom classifications per ISO 14644, equipment qualifications (IQ/OQ/PQ), and CDSCO pre-licensing readiness.'
  },
  {
    id: 'e3',
    title: 'Global Medtech Innovation and Regulatory Summit 2026',
    date: 'October 10-12, 2026',
    time: '09:00 - 18:00 IST',
    location: 'AMTZ MedTech Hub, Visakhapatnam (Booth A-15)',
    type: 'Exhibition',
    description: 'Our executive board will showcase our end-to-end consultancy capabilities spanning CDSCO SUGAM filing, EU-IVDR conformity, and startup funding roadmap collaborations.'
  }
];

export const FAQS: FAQItem[] = [
  {
    category: 'EU MDR & IVDR',
    question: 'What is the difference between EU MDR and EU IVDR?',
    answer: 'MDR 2017/745 governs medical devices, including implantables, sterile devices and software functioning as a device. IVDR 2017/746 governs diagnostic reagents, kits, instruments and software for in vitro sample testing. Both replaced older directives (MDD/IVDD) and impose stricter clinical evidence, notified body involvement and post-market obligations.'
  },
  {
    category: 'US FDA',
    question: 'What is a 510(k) and when is it required?',
    answer: 'A 510(k) shows a new device is substantially equivalent to a legally marketed predicate. Most Class II US devices need 510(k) clearance before sale. Where no predicate exists, a De Novo request may apply; high-risk Class III devices generally need PMA with clinical trial data.'
  },
  {
    category: 'Quality & QMS',
    question: 'What does ISO 13485:2016 certification mean and is it required?',
    answer: "ISO 13485:2016 sets QMS requirements for device design, production and servicing. It's mandatory in the EU, Canada, Australia and Japan, and is a prerequisite for CE Marking and MDSAP. In the US, FDA's QMSR (aligned with ISO 13485) governs QMS requirements."
  },
  {
    category: 'Global Access',
    question: 'What is MDSAP and which countries recognise it?',
    answer: "MDSAP lets a single audit satisfy multiple regulators — the US, Canada, Australia, Brazil, Japan and Taiwan. It's mandatory for selling in Canada and improves audit efficiency for manufacturers targeting several participating markets at once."
  },
  {
    category: 'EU MDR & IVDR',
    question: 'What are the clinical evidence requirements under EU MDR?',
    answer: 'MDR 2017/745 requires clinical evaluation under Annex XIV; Class IIb implantables and Class III devices typically need clinical investigation. All devices need ongoing PMCF, and Class IIb/III devices need annual PSURs, assessed continuously by the notified body.'
  },
  {
    category: 'SaMD & Digital Health',
    question: 'How is SaMD regulated under EU MDR?',
    answer: "Software is a medical device when intended for a medical purpose, classified under MDR Rule 11 based on the health condition's seriousness and the software's decision-making role. Most clinical decision support software is Class IIa or higher, requiring notified body review, plus IEC 62304 and IEC 62366-1 compliance."
  },
  {
    category: 'WHO-PQ',
    question: 'What is WHO Prequalification and which products require it?',
    answer: "WHO PQ assesses the quality, safety and efficacy of health products — including IVDs, medicines and vaccines — for UN procurement and markets where WHO PQ substitutes for local approval. It's especially relevant for IVD manufacturers supplying Sub-Saharan Africa, Southeast Asia and global health agencies like UNICEF and GAVI."
  },
  {
    category: 'US FDA',
    question: 'How long does FDA 510(k) clearance take?',
    answer: "FDA's goal under MDUFA is to review 90% of 510(k)s within 90 days of acceptance, though total time depends on submission completeness and additional-information requests. Well-prepared submissions move faster, and Pre-Sub (Q-Sub) meetings reduce the risk of major deficiencies."
  },
  {
    category: 'Global Access',
    question: 'Do I need a local representative in each country where I register my device?',
    answer: 'Many markets require a local in-country representative — EU MDR needs an Authorised Representative, FDA needs a US Agent, and Health Canada needs a Canadian Importer/Manufacturer. Australia, Japan, Saudi Arabia and most ASEAN markets have similar rules. IQZYME provides representation support and local partner connections.'
  },
  {
    category: 'Quality & QMS',
    question: 'What is the difference between a Technical File and a Design History File?',
    answer: 'A Technical File (EU MDR Technical Documentation) is the submission package demonstrating conformity to regulators and notified bodies. A Design History File is an internal QMS record of the design process, required under 21 CFR Part 820/QMSR and ISO 13485. The DHF is the evidence base the Technical File draws from.'
  }
];

export const CORE_VALUES = [
  {
    title: 'Trust',
    description: 'We earn confidence through quality service, integrity, and cohesive teamwork — building lasting client loyalty.'
  },
  {
    title: 'Excellence',
    description: 'We excel through innovation, creativity, and service differentiation that drives our growth and our clients\' success.'
  },
  {
    title: 'Respect',
    description: 'We honour clients, employees, partners, and society — treating every individual with consideration and dignity.'
  }
];

export const MILESTONES = [
  {
    year: '2017',
    title: 'Inception & Local Audits',
    description: 'Founded by Mr. Sinto Poulose and Mrs. Selma S as an elite local QA consulting boutique specializing in medical device quality systems.'
  },
  {
    year: '2021',
    title: 'Expanded Global Frameworks',
    description: 'Established the global regulatory division, helping Indian diagnostics manufacturers prepare for the transition to European EU MDR and IVDR.'
  },
  {
    year: '2024',
    title: 'WHO Prequalification & NIB Lead',
    description: 'Dr. P. S. Chandranand (ex-NIB) joined as Director, launching a specialized WHO-PQ consultancy stream and expanding our pan-India footprint.'
  },
  {
    year: '2026',
    title: 'Unified Pan-India Presence',
    description: 'Fully integrated 6 offices across India (Cochin HQ, New Delhi, Bengaluru, Mumbai, Coimbatore, Surat) managing over 360° of regulatory coverage.'
  }
];
