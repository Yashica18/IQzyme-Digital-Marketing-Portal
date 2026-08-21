/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Shield, Compass, TrendingUp, Cpu, 
  Layers, Users, CheckCircle, ArrowRight, Star, 
  MapPin, Award, Activity, Heart, Globe, Play
} from 'lucide-react';
import { TESTIMONIALS, CASE_STUDIES } from '../data';

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
export function GlobalReachMap() {
  const [activeOffice, setActiveOffice] = useState<number | null>(null);

  const offices = [
    { 
      city: 'Cochin, Kerala', 
      type: 'Global HQ & Submissions', 
      mapX: 172, 
      mapY: 365,
      details: 'Our primary operational headquarters, managing international dossiers, clinical trial compliance, and major WHO prequalification submissions.' 
    },
    { 
      city: 'New Delhi', 
      type: 'CDSCO Liaison Hub', 
      mapX: 175, 
      mapY: 110,
      details: 'Direct, daily on-site liaison with CDSCO HQ, Ministry of Health, and technical review committees for rapid licensing approvals.' 
    },
    { 
      city: 'Bengaluru', 
      type: 'Biotech & IVD Support', 
      mapX: 170, 
      mapY: 315,
      details: 'Deep operational support for molecular diagnostics, biotech startups, and specialized performance evaluations inside India’s main tech hub.' 
    },
    { 
      city: 'Mumbai', 
      type: 'West India Compliance', 
      mapX: 125, 
      mapY: 240,
      details: 'Managing CDSCO West zone audits, medical importer registration files, and active post-market surveillance coordination.' 
    },
    { 
      city: 'Coimbatore', 
      type: 'Medtech Engineering', 
      mapX: 182, 
      mapY: 350,
      details: 'Dedicated validation of active medical devices, software-as-a-medical-device (SaMD) quality files, and electrical safety standards.' 
    },
    { 
      city: 'Surat', 
      type: 'SME Onboarding & Turnkey', 
      mapX: 120, 
      mapY: 210,
      details: 'Cleanroom manufacturing facility design engineering, HVAC commissioning support, and turnkey WHO-GMP licensing for state-wide SMEs.' 
    }
  ];

  return (
    <div id="global-reach-map-container" className="bg-white border border-brand-cloudy/30 rounded-xl p-6 md:p-8 shadow-sm space-y-6">
      <div className="max-w-2xl mx-auto text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#00C4B7]">National Infrastructure, Global Excellence</span>
        <h3 className="font-display font-medium text-2xl text-brand-blue">6 Integrated Offices Across India</h3>
        <p className="text-xs text-brand-dusk">
          We maintain physical consulting offices and direct liaison channels with central drug control authorities, state bodies, and international testing facilities to support your product’s lifecycle.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-brand-blue/5 border border-brand-cloudy/20 rounded-lg p-4 md:p-6 overflow-hidden">
        {/* Left Side: Indian Map Vector Container */}
        <div className="lg:col-span-7 flex justify-center relative">
          <div className="w-full max-w-[400px] h-[420px] relative">
            <svg viewBox="0 0 450 450" className="w-full h-full text-brand-blue" xmlns="http://www.w3.org/2000/svg">
              {/* Latitude/Longitude grid lines for tactical tech design */}
              <line x1="50" y1="100" x2="400" y2="100" stroke="currentColor" strokeOpacity="0.05" strokeDasharray="3 3" />
              <line x1="50" y1="200" x2="400" y2="200" stroke="currentColor" strokeOpacity="0.05" strokeDasharray="3 3" />
              <line x1="50" y1="300" x2="400" y2="300" stroke="currentColor" strokeOpacity="0.05" strokeDasharray="3 3" />
              <line x1="100" y1="50" x2="100" y2="400" stroke="currentColor" strokeOpacity="0.05" strokeDasharray="3 3" />
              <line x1="200" y1="50" x2="200" y2="400" stroke="currentColor" strokeOpacity="0.05" strokeDasharray="3 3" />
              <line x1="300" y1="50" x2="300" y2="400" stroke="currentColor" strokeOpacity="0.05" strokeDasharray="3 3" />

              {/* Indian Sea labels */}
              <text x="60" y="320" className="font-mono text-[9px] font-medium tracking-widest text-brand-dusk/30" fill="currentColor">ARABIAN SEA</text>
              <text x="290" y="320" className="font-mono text-[9px] font-medium tracking-widest text-brand-dusk/30" fill="currentColor">BAY OF BENGAL</text>
              <text x="175" y="425" className="font-mono text-[9px] font-medium tracking-widest text-brand-dusk/30" fill="currentColor">INDIAN OCEAN</text>

              {/* Compass Rose accent */}
              <g transform="translate(370, 50)" className="text-brand-dusk/25" stroke="currentColor" strokeWidth="1" fill="none">
                <circle cx="0" cy="0" r="16" strokeDasharray="2 2" />
                <line x1="0" y1="-20" x2="0" y2="20" />
                <line x1="-20" y1="0" x2="20" y2="0" />
                <polygon points="0,-12 3,0 0,3" fill="currentColor" opacity="0.4" />
                <polygon points="0,12 -3,0 0,-3" fill="currentColor" opacity="0.4" />
                <text x="5" y="-12" className="font-mono text-[8px] font-bold" stroke="none" fill="currentColor">N</text>
              </g>

              {/* India Silhouette Map Path */}
              <path 
                d="M 180,20 L 195,10 L 210,15 L 215,30 L 225,40 L 220,55 L 230,70 L 235,80 L 245,90 L 260,95 L 275,95 L 290,105 L 300,105 L 310,110 L 325,105 L 340,95 L 365,90 L 380,105 L 390,125 L 395,140 L 385,155 L 370,160 L 360,175 L 370,190 L 360,205 L 350,195 L 335,190 L 330,165 L 320,160 L 310,170 L 310,155 L 300,175 L 295,195 L 285,225 L 270,255 L 250,295 L 230,330 L 215,360 L 195,385 L 185,355 L 178,325 L 170,285 L 160,245 L 155,215 L 145,205 L 125,200 L 115,210 L 110,225 L 125,230 L 140,225 L 115,235 L 90,230 L 75,220 L 65,205 L 70,185 L 85,180 L 105,180 L 110,160 L 125,155 L 135,125 L 145,95 L 150,75 L 160,55 L 170,35 Z"
                className="fill-brand-blue/5 stroke-brand-blue/20 dark:stroke-brand-blue/30"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />

              {/* Map Pins / Interactive Dots */}
              {offices.map((office, idx) => {
                const isActive = activeOffice === idx;
                return (
                  <g 
                    key={idx}
                    className="cursor-pointer group"
                    onMouseEnter={() => setActiveOffice(idx)}
                    onMouseLeave={() => setActiveOffice(null)}
                  >
                    {/* Ring highlight animation when active */}
                    <circle 
                      cx={office.mapX} 
                      cy={office.mapY} 
                      r={isActive ? 14 : 7} 
                      className={`fill-brand-topaz/20 transition-all duration-300 ${isActive ? 'scale-110' : 'opacity-0 group-hover:opacity-100'}`}
                    />
                    
                    {/* Outer Pulsing Glow */}
                    <circle 
                      cx={office.mapX} 
                      cy={office.mapY} 
                      r={isActive ? 8 : 4} 
                      className="fill-[#00C4B7]/40 transition-all duration-300"
                    />

                    {/* Core Solid Pin */}
                    <circle 
                      cx={office.mapX} 
                      cy={office.mapY} 
                      r="3.5" 
                      className={`transition-all duration-300 ${isActive ? 'fill-brand-pear' : 'fill-[#00C4B7]'}`}
                      stroke="#FFFFFF"
                      strokeWidth="1"
                    />
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right Side: Detailed Info Display Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-brand-cloudy/30 rounded-xl p-5 shadow-sm min-h-[220px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              {activeOffice !== null ? (
                <motion.div
                  key={`office-${activeOffice}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="text-[#00C4B7]" size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-topaz">Active Location</span>
                  </div>
                  <h4 className="font-display font-bold text-lg text-brand-blue">
                    {offices[activeOffice].city}
                  </h4>
                  <p className="text-xs font-semibold text-brand-pear">
                    {offices[activeOffice].type}
                  </p>
                  <p className="text-xs text-brand-dusk leading-relaxed">
                    {offices[activeOffice].details}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="default-footprint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3 my-auto text-center md:text-left py-4"
                >
                  <div className="flex justify-center md:justify-start items-center gap-2">
                    <MapPin className="text-brand-orange" size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-dusk font-bold">National Network</span>
                  </div>
                  <h4 className="font-display font-medium text-base text-brand-blue">
                    Hover a location to view operations
                  </h4>
                  <p className="text-xs text-brand-dusk leading-relaxed">
                    Our pan-India footprint ensures we have local boots on the ground near key manufacturing zones, testing laboratories, and national drug administration registries.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-4 border-t border-brand-cloudy/10 flex justify-between items-center text-[10px] text-brand-dusk font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00C4B7] animate-pulse" />
                <span>Regulatory Hubs: 6</span>
              </div>
              <div>
                <span>Audit Success: 100%</span>
              </div>
            </div>
          </div>
        </div>
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
