/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Shield, Compass, TrendingUp, Cpu, 
  Layers, Users, CheckCircle, ArrowRight, Star, 
  MapPin, Award, Activity, Heart, Globe, Play,
  Building2, Phone, ExternalLink, Navigation, ShieldCheck, Check, ZoomIn, X
} from 'lucide-react';
import { TESTIMONIALS, CASE_STUDIES } from '../data';
import { INDIA_OUTLINE_PATH } from './IndiaMapPath';

// ==========================================
// 1. HERO CAROUSEL BLOCK (Discover our solutions)
// ==========================================
export function HeroCarousel({ onNavigate }: { onNavigate: (path: string) => void }) {
  const slides = [
    {
      title: "Securing CDSCO and EU-MDR Approvals Rapidly",
      subtitle: "Regulatory Services",
      description: "Ensure flawless compliance audits, regulatory license filings, and ISO 13485 QMS audits designed under Scandinavian minimal standards.",
      cta: "Schedule Advisory",
      path: "/regulatory-services",
      color: "from-brand-blue/90 to-brand-blue/70",
      image: "/images/medical_device_regulatory.jpg",
      accent: "text-[#00C4B7]"
    },
    {
      title: "High-Authority Inbound Marketing for Lifesciences",
      subtitle: "Digital Marketing Portal",
      description: "Convert high-value hospital procurement officers and pharmaceutical executives with SEO-optimized, scientifically compliant content campaigns.",
      cta: "Explore Campaigns",
      path: "/services",
      color: "from-slate-900/90 to-brand-blue/80",
      image: "/images/abstract_medtech_hero.jpg",
      accent: "text-[#99CE43]"
    },
    {
      title: "Turnkey Quality Systems (ISO 13485 & GMP)",
      subtitle: "Quality Assurance",
      description: "Establish absolute audit safety. From gap assessments to active post-market surveillance plans, we automate your technical file integrity.",
      cta: "Configure QMS",
      path: "/quality-services",
      color: "from-slate-900/80 to-[#2D3A55]/90",
      image: "/images/sterile_cleanroom_facility.jpg",
      accent: "text-brand-orange"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div id="hero-carousel" className="relative w-full h-[580px] bg-brand-blue rounded-xl overflow-hidden shadow-lg border border-brand-cloudy/20">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background image with overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-blue via-brand-blue/70 to-transparent z-10" />
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-35"
          />

          {/* Slide Content */}
          <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-12 max-w-2xl text-white space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#99CE43] animate-pulse" />
              <span className={`text-xs uppercase font-bold tracking-widest ${slides[currentSlide].accent}`}>
                {slides[currentSlide].subtitle}
              </span>
            </div>
            
            <h2 className="font-display font-medium text-3xl md:text-5xl leading-tight tracking-tight">
              {slides[currentSlide].title}
            </h2>

            <p className="text-sm md:text-base text-brand-cloudy leading-relaxed font-light">
              {slides[currentSlide].description}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id={`hero-slide-cta-${currentSlide}`}
                onClick={() => {
                  onNavigate(slides[currentSlide].path);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 h-12 bg-[#99CE43] text-brand-blue font-bold text-xs uppercase tracking-wider rounded hover:bg-[#86b53b] hover:scale-102 transition-all cursor-pointer shadow-md"
              >
                {slides[currentSlide].cta}
              </button>
              <button
                id={`hero-slide-secondary-${currentSlide}`}
                onClick={() => {
                  onNavigate('/contact-us');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 h-12 text-white font-bold text-xs uppercase tracking-wider border border-white/30 rounded hover:bg-white/10 hover:border-white transition-all cursor-pointer"
              >
                Secure Consultation
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Control Dots */}
      <div className="absolute bottom-6 right-6 z-30 flex gap-2.5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`w-3.5 h-3.5 rounded-full transition-all border ${
              currentSlide === index 
                ? 'bg-[#00C4B7] border-[#00C4B7] w-8' 
                : 'bg-white/20 border-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 2. WHY CHOOSE IQZYME (2-col-text)
// ==========================================
export function WhyChooseIQzyme() {
  const points = [
    {
      title: "Government & Scientific Credentials",
      desc: "Our directors bring decades of regulatory leadership from the National Institute of Biologicals (NIB) and WHO collaboration panels, offering unmatched regulatory depth."
    },
    {
      title: "Active Audit & Validation Experience",
      desc: "Unlike standard consultants, we have hands-on experience as certified lead auditors trained by the British Standards Institution (BSI) for ISO 13485:2016, EU MDR 2017/745, and EU IVDR 2017/746."
    },
    {
      title: "Turnkey Facility & Cleanroom Execution",
      desc: "We provide complete, end-to-end solutions from cleanroom architectural layout design, HVAC commissioning, and machinery validation (IQ/OQ/PQ) up to commercial licensure."
    }
  ];

  return (
    <div id="why-choose-iqzyme" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6">
      <div className="lg:col-span-5 space-y-4">
        <div className="text-[#00C4B7] font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5">
          <Shield size={14} />
          <span>Core Operational Mandates</span>
        </div>
        <h3 className="font-display font-medium text-3xl text-brand-blue tracking-tight leading-tight">
          Where compliance safety meets flawless medtech execution
        </h3>
        <p className="text-sm text-brand-dusk leading-relaxed">
          The medical technology and healthcare diagnostic industries are governed by highly specialized regulations. IQzyme was established to provide a seamless bridge between complex quality audits, turnkey facility designs, and successful global clearances.
        </p>
        <div className="pt-2">
          <div className="p-4 bg-brand-topaz/5 rounded border border-brand-topaz/10 text-xs text-brand-blue flex items-center gap-3">
            <Award className="text-[#00C4B7] shrink-0" size={24} />
            <span>Trusted partner associated with BIRAC-supported incubators, AMTZ hubs, and premier molecular diagnostic developers.</span>
          </div>
        </div>
      </div>

      <div className="lg:col-span-7 space-y-6">
        {points.map((p, idx) => (
          <div key={idx} className="p-6 bg-white border border-brand-cloudy/30 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h4 className="font-display font-semibold text-sm text-brand-blue flex items-center gap-2">
              <span className="w-1.5 h-3 bg-[#99CE43] rounded-full" />
              {p.title}
            </h4>
            <p className="text-xs text-brand-dusk mt-2 leading-relaxed">
              {p.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 3. GLOBAL REACH (map-wide)
// ==========================================
export function GlobalReachMap({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const [selectedLocationId, setSelectedLocationId] = useState<string>('delhi');
  const [hoveredLocationId, setHoveredLocationId] = useState<string | null>(null);

  const locations = [
    {
      id: 'delhi',
      name: 'New Delhi',
      x: 203,
      y: 255,
      labelAnchor: 'start' as const,
      labelX: 224,
      labelY: 255,
      lineX: 216,
      lineY: 255,
    },
    {
      id: 'surat',
      name: 'Surat',
      x: 118,
      y: 430,
      labelAnchor: 'end' as const,
      labelX: 98,
      labelY: 430,
      lineX: 104,
      lineY: 430,
    },
    {
      id: 'mumbai',
      name: 'Mumbai',
      x: 112,
      y: 479,
      labelAnchor: 'end' as const,
      labelX: 92,
      labelY: 479,
      lineX: 98,
      lineY: 479,
    },
    {
      id: 'bengaluru',
      name: 'Bengaluru',
      x: 211,
      y: 623,
      labelAnchor: 'start' as const,
      labelX: 232,
      labelY: 623,
      lineX: 224,
      lineY: 623,
    },
    {
      id: 'coimbatore',
      name: 'Coimbatore',
      x: 198,
      y: 669,
      labelAnchor: 'start' as const,
      labelX: 220,
      labelY: 669,
      lineX: 212,
      lineY: 669,
    },
    {
      id: 'cochin',
      name: 'Cochin (Kerala)',
      x: 192,
      y: 695,
      labelAnchor: 'end' as const,
      labelX: 172,
      labelY: 695,
      lineX: 178,
      lineY: 695,
    },
  ];

  const activeId = hoveredLocationId || selectedLocationId;

  return (
    <div id="global-reach-map-container" className="space-y-6">
      {/* India Map Outline Frame */}
      <div className="w-full flex justify-center py-6 px-4 md:px-8 bg-slate-50/70 border border-brand-cloudy/30 rounded-2xl overflow-hidden shadow-xs">
        <div className="w-full max-w-[540px] relative">
          <svg
            viewBox="0 0 670 780"
            className="w-full h-auto max-h-[600px] select-none filter drop-shadow-xs"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outline of the Map of India */}
            <path
              d={INDIA_OUTLINE_PATH}
              fill="#FFFFFF"
              stroke="#2D3A55"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Clean inner subtle fill */}
            <path
              d={INDIA_OUTLINE_PATH}
              fill="#2D3A55"
              fillOpacity="0.025"
              stroke="none"
            />

            {/* The 6 Specified Locations */}
            {locations.map((loc) => {
              const isActive = activeId === loc.id;
              return (
                <g
                  key={loc.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedLocationId(loc.id)}
                  onMouseEnter={() => setHoveredLocationId(loc.id)}
                  onMouseLeave={() => setHoveredLocationId(null)}
                >
                  {/* Subtle connector leader line */}
                  <line
                    x1={loc.x}
                    y1={loc.y}
                    x2={loc.lineX}
                    y2={loc.lineY}
                    stroke={isActive ? '#00C4B7' : '#94A3B8'}
                    strokeWidth={isActive ? '2' : '1.2'}
                    strokeDasharray={isActive ? 'none' : '3 2'}
                  />

                  {/* Pulsing halo */}
                  <circle
                    cx={loc.x}
                    cy={loc.y}
                    r={isActive ? 12 : 7}
                    fill={isActive ? '#00C4B7' : '#2D3A55'}
                    fillOpacity={isActive ? 0.35 : 0.15}
                  />

                  {/* Core pin dot */}
                  <circle
                    cx={loc.x}
                    cy={loc.y}
                    r={isActive ? 5.5 : 4}
                    fill={isActive ? '#00C4B7' : '#2D3A55'}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />

                  {/* Location Name Label (with no description) */}
                  <text
                    x={loc.labelX}
                    y={loc.labelY + 4}
                    textAnchor={loc.labelAnchor}
                    className={`font-sans tracking-wide select-none transition-colors ${
                      isActive
                        ? 'fill-brand-blue font-bold text-[16px]'
                        : 'fill-brand-blue/85 font-medium text-[14px]'
                    }`}
                  >
                    {loc.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Along with the 6 specified locations just write the name of the location with no description */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {locations.map((loc) => {
          const isSelected = activeId === loc.id;
          return (
            <button
              key={loc.id}
              onClick={() => setSelectedLocationId(loc.id)}
              onMouseEnter={() => setHoveredLocationId(loc.id)}
              onMouseLeave={() => setHoveredLocationId(null)}
              className={`flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl border text-sm transition-all cursor-pointer ${
                isSelected
                  ? 'bg-brand-blue text-white border-brand-blue shadow-xs font-semibold'
                  : 'bg-white text-brand-blue border-brand-cloudy/30 hover:border-[#00C4B7] hover:bg-slate-50 font-normal'
              }`}
            >
              <MapPin size={15} className={isSelected ? 'text-[#00C4B7]' : 'text-brand-dusk'} />
              <span>{loc.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// 4. INDUSTRIES WE SERVE (4-col-logos)
// ==========================================
export function IndustriesWeServe({ onNavigate }: { onNavigate: (path: string) => void }) {
  const industries = [
    { title: "Medical Devices", path: "/medical-devices", icon: Shield, desc: "Class A to D orthopedic, cardiac, and dental system compliance filings." },
    { title: "In Vitro Diagnostics", path: "/ivd", icon: Cpu, desc: "Transition strategies to secure EU-IVDR certifications and performance files." },
    { title: "Research Institutions", path: "/research-institutions", icon: Compass, desc: "Grant applications, medical copy, and joint-venture positioning." },
    { title: "Startups & SMEs", path: "/startups", icon: Sparkles, desc: "Seed campaign designs, ISO-QMS setups, and agile regulatory roadmapping." },
    { title: "Exhibition Support", path: "/exhibitions-national-international", icon: Globe, desc: "National and international booths, digital exposure tools." }
  ];

  return (
    <div id="industries-serve-block" className="space-y-8">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-purple">Dedicated life-science focuses</span>
        <h3 className="font-display font-medium text-2xl text-brand-blue">Targeted Digital Solutions Across Sectors</h3>
        <p className="text-xs text-brand-dusk">
          Generic agencies fail to understand clinical workflows. We specialize in sectors governed by active audit committees and statutory regulatory boards.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {industries.map((ind, idx) => {
          const Icon = ind.icon;
          return (
            <div 
              key={idx}
              className="p-6 bg-white border border-brand-cloudy/30 rounded-lg shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded bg-[#FAF9F5] border border-brand-cloudy/30 flex items-center justify-center text-brand-blue group-hover:bg-[#99CE43]/20 group-hover:text-brand-blue transition-colors">
                  <Icon size={18} />
                </div>
                <h4 className="font-display font-semibold text-sm text-brand-blue">{ind.title}</h4>
                <p className="text-xs text-brand-dusk leading-relaxed">{ind.desc}</p>
              </div>
              
              <button
                id={`industry-goto-btn-${idx}`}
                onClick={() => {
                  onNavigate(ind.path);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="mt-4 text-[10px] uppercase font-bold text-brand-topaz hover:text-brand-blue flex items-center gap-1 cursor-pointer"
              >
                <span>Advisory Details</span>
                <span>→</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// 5. OUR 6-STEP ENGAGEMENT PROCESS (3-col-steps-text)
// ==========================================
export function EngagementProcessSteps() {
  const steps = [
    { num: "01", title: "Discovery Audit", desc: "Detailed evaluation of your current device specs or existing search marketing keyword indexing." },
    { num: "02", title: "Gap Analysis", desc: "Formulation of compliance filing maps, SUGAM portals, and Notified Body reviews." },
    { num: "03", title: "Strategy Matrix", desc: "Joint creation of ISO 13485 QMS frameworks and high-authority digital inbound tunnels." },
    { num: "04", title: "Dossier Compiling", desc: "Our certified medical writers draft exact Class-specific technical files and performance certificates." },
    { num: "05", title: "Platform Launch", desc: "Deploying fully validated websites, digital sandboxes, and targeted outreach funnels." },
    { num: "06", title: "Continuous Vigilance", desc: "Handling active post-market surveillance (PMS) reviews and real-time lead optimization." }
  ];

  return (
    <div id="engagement-process-block" className="space-y-8 py-6">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-pear">Transparent Methodology</span>
        <h3 className="font-display font-medium text-2xl text-brand-blue">Our 6-Step Engagement Process</h3>
        <p className="text-xs text-brand-dusk">
          We combine legal compliance safety benchmarks directly with agile digital design parameters for predictable, validated business growth.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((st, idx) => (
          <div key={idx} className="p-6 bg-[#FAF9F5] border border-brand-cloudy/30 rounded-lg relative overflow-hidden group">
            {/* Massive backdrop number */}
            <span className="absolute -right-2 -bottom-4 text-7xl font-display font-bold text-brand-cloudy/10 group-hover:text-brand-pear/20 transition-colors">
              {st.num}
            </span>
            <div className="space-y-2">
              <span className="inline-block text-xs font-mono font-bold text-brand-topaz bg-brand-topaz/5 px-2 py-0.5 rounded border border-brand-topaz/10">
                Step {st.num}
              </span>
              <h4 className="font-display font-semibold text-sm text-brand-blue">{st.title}</h4>
              <p className="text-xs text-brand-dusk leading-relaxed max-w-[240px]">
                {st.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 7. GET STARTED TODAY (Block 10)
// ==========================================
export function GetStartedTodayCTA({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <div id="get-started-cta-block" className="bg-[#2D3A55] text-white p-8 md:p-12 rounded-xl shadow-sm relative overflow-hidden border border-brand-dusk/20">
      
      {/* Decorative colored visual backgrounds */}
      <div className="absolute right-0 top-0 w-64 h-64 bg-brand-pear/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-0 bottom-0 w-64 h-64 bg-[#00C4B7]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto text-center space-y-6 relative z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-brand-pear uppercase tracking-wide">
          <Sparkles size={12} />
          <span>Validated Compliance & Growth</span>
        </span>
        
        <h3 className="font-display font-medium text-3xl md:text-4xl text-white tracking-tight leading-tight">
          Ready to launch your medical device globally?
        </h3>

        <p className="text-sm text-brand-cloudy leading-relaxed font-light">
          Set up a confidential 30-minute regulatory sandbox review with our lead Danish consultant. We evaluate your existing dossier structure, suggest gap optimizations, and outline B2B keyword indexing scopes.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            id="cta-block-primary-btn"
            onClick={() => {
              onNavigate('/book-consultation');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 h-12 bg-[#99CE43] text-brand-blue font-bold text-xs uppercase tracking-wider rounded shadow hover:bg-[#86b53b] hover:scale-102 transition-all cursor-pointer"
          >
            Schedule Free Audit Slot
          </button>
          
          <button
            id="cta-block-secondary-btn"
            onClick={() => {
              onNavigate('/services');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 h-12 text-white font-bold text-xs uppercase tracking-wider border border-white/20 rounded hover:bg-white/10 transition-all cursor-pointer"
          >
            Review Services Framework
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 8. PRIMARY REUSABLE CTA
// ==========================================
export function PrimaryCTA({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <div id="primary-cta-block" className="bg-[#1E293B] text-white p-8 md:p-12 rounded-2xl shadow-lg relative overflow-hidden border border-slate-700/50">
      <div className="absolute right-0 top-0 w-80 h-80 bg-[#00C4B7]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-0 bottom-0 w-80 h-80 bg-[#99CE43]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#00C4B7]/10 border border-[#00C4B7]/20 rounded-full text-xs font-bold text-[#00C4B7] uppercase tracking-wider">
          <Users size={12} strokeWidth={2.5} />
          <span>Global Access Partner</span>
        </span>
        
        <h3 className="font-display font-medium text-2xl md:text-4xl text-white tracking-tight leading-tight">
          Speak with a Global Regulatory Expert Today
        </h3>

        <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
          Our consultants assess your device, target markets and regulatory pathway — starting with a structured consultation focused on your programme objectives.
        </p>

        <div className="pt-2">
          <button
            id="primary-cta-action-btn"
            onClick={() => {
              onNavigate('/book-consultation');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-8 h-12 bg-[#00C4B7] hover:bg-[#00b0a4] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:scale-102 transition-all cursor-pointer"
          >
            Request a Consultation
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 9. SECONDARY REUSABLE CTA
// ==========================================
export function SecondaryCTA({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <div id="secondary-cta-block" className="bg-[#FAF9F5] border border-brand-cloudy/30 p-8 md:p-10 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden text-center md:text-left">
      <div className="absolute right-0 bottom-0 w-48 h-48 bg-[#99CE43]/5 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="space-y-3 max-w-xl">
          <span className="inline-block text-[10px] font-mono font-bold text-brand-orange bg-brand-orange/10 px-2.5 py-1 rounded uppercase tracking-wider">
            Pathway Discovery
          </span>
          <h3 className="font-display font-semibold text-xl md:text-2xl text-brand-blue">
            Not Sure Where to Start?
          </h3>
          <p className="text-xs md:text-sm text-brand-dusk leading-relaxed font-normal">
            Share your device details and target markets, and we'll identify the right pathway, timeline and documentation strategy.
          </p>
        </div>
        
        <div className="shrink-0 pt-2 md:pt-0">
          <button
            id="secondary-cta-action-btn"
            onClick={() => {
              onNavigate('/contact-us');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full md:w-auto px-6 h-12 bg-[#99CE43] hover:bg-[#86b53b] text-brand-blue font-bold text-xs uppercase tracking-wider rounded-xl shadow hover:scale-102 transition-all cursor-pointer"
          >
            Send Us Your Query
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 10. URGENCY REUSABLE CTA
// ==========================================
export function UrgencyCTA({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <div id="urgency-cta-block" className="bg-[#FDF2F2] border border-red-200/60 p-8 md:p-10 rounded-2xl shadow-sm relative overflow-hidden">
      <div className="absolute right-0 top-0 w-48 h-48 bg-red-100/30 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="space-y-3 max-w-xl text-left">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
            Immediate Expert Response
          </span>
          <h3 className="font-display font-bold text-lg md:text-xl text-red-950">
            Under Regulatory Pressure? We Can Help.
          </h3>
          <p className="text-xs md:text-sm text-red-900/80 leading-relaxed font-normal">
            FDA Warning Letter, notified body audit, or a significant change requiring resubmission — IQZYME provides rapid-response regulatory support.
          </p>
        </div>
        
        <div className="shrink-0 pt-2 md:pt-0">
          <button
            id="urgency-cta-action-btn"
            onClick={() => {
              onNavigate('/contact-us');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full md:w-auto px-6 h-12 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow hover:scale-102 transition-all cursor-pointer"
          >
            Get Urgent Regulatory Support
          </button>
        </div>
      </div>
    </div>
  );
}
