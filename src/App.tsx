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
  Briefcase, FileText, Check, HelpCircle, ArrowUpRight, Clock,
  DollarSign, BookOpen, UserCheck, Calendar, Info,
  Navigation, Mail, Phone, Map, ExternalLink, Settings
} from 'lucide-react';

import { ROUTES, CASE_STUDIES, TESTIMONIALS, OPEN_POSITIONS, BLOG_POSTS, NEWS_ITEMS, EVENTS, FAQS, CORE_VALUES, MILESTONES } from './data';
import { SERVICES_DATA } from './servicesData';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './lib/firebase';
import { BlogPost } from './types';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import SEOHandler from './components/SEOHandler';
import CookieBanner from './components/CookieBanner';
import NewsletterForm from './components/NewsletterForm';
import ContactForm from './components/ContactForm';
import ConsultationForm from './components/ConsultationForm';
import FirebaseAuthPanel from './components/FirebaseAuthPanel';
import AdminDashboard from './components/AdminDashboard';
import { HeroCarousel, WhyChooseIQzyme, GlobalReachMap, IndustriesWeServe, EngagementProcessSteps, GetStartedTodayCTA, PrimaryCTA, SecondaryCTA, UrgencyCTA } from './components/BlockComponents';

const CONTACT_OFFICES = [
  {
    city: 'Cochin, Kerala (Global HQ)',
    service: 'Global HQ & Regulatory Submissions',
    address: '3rd Floor, HUB, Sea Port-Airport Road, Vallathol Junction, Thrikkakara, Cochin, Kerala 682021, India',
    phone: '+91 974 472 2260',
    email: 'info@iqzyme.com',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=3rd+Floor,+HUB,+Sea+Port-Airport+Road,+Vallathol+Junction,+Thrikkakara,+Cochin,+Kerala+682021,+India',
    dirUrl: 'https://www.google.com/maps/dir/?api=1&destination=3rd+Floor,+HUB,+Sea+Port-Airport+Road,+Vallathol+Junction,+Thrikkakara,+Cochin,+Kerala+682021,+India',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.775895741759!2d76.3268846153323!3d10.03534579282717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080c57f20db1e9%3A0xc3c94f1c93a0279c!2sVallathol%20Junction%2C%20Thrikkakara%2C%20Kochi%2C%20Kerala%20682021!5e0!3m2!1sen!2sin!4v1625482348392!5m2!1sen!2sin'
  },
  {
    city: 'New Delhi',
    service: 'CDSCO Liaison Hub',
    address: 'Delhi Off: 51A, Pratap Nagar, Gali No. - 2, Mayur Vihar – 1, Delhi - 110091.',
    phone: '+91 974 472 2260',
    email: 'delhi@iqzyme.com',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Delhi+Off:+51A,+Pratap+Nagar,+Gali+No.+-+2,+Mayur+Vihar+–+1,+Delhi+-+110091',
    dirUrl: 'https://www.google.com/maps/dir/?api=1&destination=Delhi+Off:+51A,+Pratap+Nagar,+Gali+No.+-+2,+Mayur+Vihar+–+1,+Delhi+-+110091',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.7432832819877!2d77.29123011508119!3d28.60747498242941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfb7b64906f3d%3A0xc6ba3dfad5ba164d!2sMayur%20Vihar%20Phase%201%2C%20Delhi%2C%20110091!5e0!3m2!1sen!2sin!4v1625482400000!5m2!1sen!2sin'
  },
  {
    city: 'Bengaluru',
    service: 'Biotech & IVD Support',
    address: 'No.7, Sumangali Sevashrama Main Road, Ayyappa Layout, Hebbal, Bengaluru, India – 560032.',
    phone: '+91 884 867 4243',
    email: 'blr@iqzyme.com',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=No.7,+Sumangali+Sevashrama+Main+Road,+Ayyappa+Layout,+Hebbal,+Bengaluru,+India+–+560032',
    dirUrl: 'https://www.google.com/maps/dir/?api=1&destination=No.7,+Sumangali+Sevashrama+Main+Road,+Ayyappa+Layout,+Hebbal,+Bengaluru,+India+–+560032',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.2941913165246!2d77.5947321152071!3d13.016912990826437!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae17ca7cb0a31b%3A0xea694939bbd41bf6!2sSumangali%20Sevashrama%20Rd%2C%20Hebbal%20Kempapura%2C%20Bengaluru%2C%20Karnataka%20560024!5e0!3m2!1sen!2sin!4v1625482450000!5m2!1sen!2sin'
  },
  {
    city: 'Mumbai',
    service: 'West India Compliance',
    address: 'B-303, V K Tower, Evershine City, Vasai East, Maharashtra-401208',
    phone: '+91 88488 00386 / +91 884 867 4243',
    email: 'mumbai@iqzyme.com',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=B-303,+V+K+Tower,+Evershine+City,+Vasai+East,+Maharashtra-401208',
    dirUrl: 'https://www.google.com/maps/dir/?api=1&destination=B-303,+V+K+Tower,+Evershine+City,+Vasai+East,+Maharashtra-401208',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3763.5359483324675!2d72.84646731529147!3d19.389270986910603!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7a9cf1c210df9%3A0xc6ba3dfad5ba164d!2sEvershine%20City%2C%20Vasai%20East%2C%20Vasai-Virar%2C%20Maharashtra%20401208!5e0!3m2!1sen!2sin!4v1625482500000!5m2!1sen!2sin'
  },
  {
    city: 'Coimbatore',
    service: 'Medtech Engineering',
    address: 'SF No. 155, Onnipalayam Road, No. 5 Bilichi, Chinnamathampalayam, Coimbatore, India – 641019',
    phone: '+91 884 867 4243 / +91 974 472 2260',
    email: 'coimbatore@iqzyme.com',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=SF+No.+155,+Onnipalayam+Road,+No.+5+Bilichi,+Chinnamathampalayam,+Coimbatore,+India+–+641019',
    dirUrl: 'https://www.google.com/maps/dir/?api=1&destination=SF+No.+155,+Onnipalayam+Road,+No.+5+Bilichi,+Chinnamathampalayam,+Coimbatore,+India+–+641019',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3913.6231923267595!2d76.9437213153408!3d11.127961292151128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8f9bcda8c3ffd%3A0xc6cb1c7df76f1c10!2sOnnipalayam%20Rd%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1625482550000!5m2!1sen!2sin'
  },
  {
    city: 'Surat',
    service: 'SME Onboarding & Turnkey',
    address: 'SME Onboarding & Turnkey Facilities, Ring Road, Surat, Gujarat 395002, India',
    phone: '+91 974 472 2260',
    email: 'surat@iqzyme.com',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Ring+Road,+Surat,+Gujarat,+India',
    dirUrl: 'https://www.google.com/maps/dir/?api=1&destination=Ring+Road,+Surat,+Gujarat,+India',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.0988089454846!2d72.83151431532057!2d21.19213598717947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04ee196b02ca9%3A0x6b8655f41240166c!2sRing%20Rd%2C%20Surat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1625482600000!5m2!1sen!2sin'
  }
];

const SEO_KEYWORDS = [
  { term: "Medical device regulatory consulting India", type: "primary", volume: "High", competition: "High", intent: "Commercial", desc: "Targeted on home page and core service landing pages." },
  { term: "IVD regulatory services India", type: "primary", volume: "Medium-High", competition: "Medium", intent: "Transactional", desc: "Optimized for in-vitro diagnostic manufacturers searching for compliance." },
  { term: "CDSCO medical device registration consultant", type: "primary", volume: "High", competition: "High", intent: "Transactional", desc: "Main keyword for SUGAM portal filings, Form MD-15, MD-14, etc." },
  { term: "WHO prequalification IVD consultant India", type: "primary", volume: "Medium", competition: "Low-Medium", intent: "Transactional", desc: "Targets global diagnostic kit suppliers seeking local expertise." },
  { term: "Medical device QMS ISO 13485 India", type: "primary", volume: "High", competition: "Medium", intent: "Commercial", desc: "Core target for quality system implementation and audit preparedness." },
  { term: "Turnkey medical device projects India", type: "primary", volume: "Medium", competition: "Low-Medium", intent: "Transactional", desc: "Attracts manufacturers wanting end-to-end cleanroom and lab designs." },
  { term: "IQzyme Medtech regulatory services", type: "secondary", volume: "Branded", competition: "Low", intent: "Navigational", desc: "Our brand's main target keyword for authority searches." },
  { term: "Best regulatory consultant for medical devices India", type: "secondary", volume: "Medium", competition: "High", intent: "Commercial", desc: "Used in comparison reviews and authority blog pieces." },
  { term: "Freyr alternative medical device India", type: "secondary", volume: "Low-Medium", competition: "Medium", intent: "Commercial", desc: "Competitor alternative targeting for high-intent B2B leads." },
  { term: "LIMS provider medical devices India", type: "secondary", volume: "Medium", competition: "Medium", intent: "Commercial", desc: "Optimized for laboratory software integration and validation." },
  { term: "eQMS for IVD manufacturers India", type: "secondary", volume: "Medium", competition: "Medium", intent: "Transactional", desc: "Targets modern paperless quality system seekers." },
  { term: "CDSCO import license consultant", type: "secondary", volume: "High", competition: "Medium", intent: "Transactional", desc: "Used for medical device exporters entering India." },
  { term: "WHO PQ IVD dossier preparation services India", type: "longtail", volume: "Low-Medium", competition: "Low", intent: "Transactional", desc: "Hyper-specific lead generation for complex WHO prequalification files." },
  { term: "CDSCO Class C D medical device regulatory compliance consultant", type: "longtail", volume: "Medium", competition: "Medium", intent: "Commercial", desc: "Attracts manufacturers with high-risk orthopedic/cardiac devices." },
  { term: "Turnkey regulatory solutions for IVD startups India", type: "longtail", volume: "Low", competition: "Low", intent: "Transactional", desc: "Captures early-stage diagnostic incubator companies." },
  { term: "ISO 13485 implementation for medical devices consultants", type: "longtail", volume: "Medium", competition: "Low-Medium", intent: "Transactional", desc: "Meticulous documentation mapping for manufacturers." },
  { term: "LIMS validation and implementation medical device industry India", type: "longtail", volume: "Low-Medium", competition: "Low", intent: "Transactional", desc: "Drives high-value laboratory software validation contracts." },
  { term: "Post-market surveillance PMS medical devices India consultant", type: "longtail", volume: "Medium", competition: "Low", intent: "Commercial", desc: "Focuses on post-approval audits and safety compliance." },
  { term: "EU MDR CE marking support for Indian medical device exporters", type: "longtail", volume: "Medium-High", competition: "Medium", intent: "Transactional", desc: "Essential for Indian factories exporting to Europe." },
  { term: "Regulatory strategy for medical device clinical evaluation India", type: "longtail", volume: "Low-Medium", competition: "Low", intent: "Commercial", desc: "Brings clinical trial sponsors and CRO partnerships." }
];

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [selectedOfficeIndex, setSelectedOfficeIndex] = useState<number>(0);

  // Setup client-side routing state matching browser address bar
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      // Map root or fallbacks
      const matchedRoute = ROUTES.find(r => r.path === path);
      if (matchedRoute) {
        setCurrentPath(path);
      } else if (path === '' || path === '/') {
        setCurrentPath('/');
      } else {
        // Fallback to 404
        setCurrentPath('/404-error');
      }
    };

    // Listen to popstate (browser back/forward)
    window.addEventListener('popstate', handleLocationChange);
    // Initial load check
    handleLocationChange();

    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Blog CMS Synchronization
  const [dynamicBlogs, setDynamicBlogs] = useState<BlogPost[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState<boolean>(false);

  useEffect(() => {
    if (currentPath === '/blog') {
      const fetchBlogs = async () => {
        setLoadingBlogs(true);
        try {
          const blogsCol = collection(db, 'blogs');
          // Query published blogs only
          const q = query(blogsCol, where('published', '==', true));
          const querySnapshot = await getDocs(q);
          const list: BlogPost[] = [];
          querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            list.push({
              id: docSnap.id,
              title: data.title || '',
              category: data.category || 'CDSCO Licensing',
              excerpt: data.excerpt || '',
              content: data.content || '',
              date: data.date || (data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })),
              readTime: data.readTime || '5 min read',
              author: data.author || 'Dr. P. S. Chandranand',
              image: data.image || '/images/molecular_diagnostics_lab.jpg',
              published: true
            } as BlogPost);
          });
          setDynamicBlogs(list);
        } catch (error) {
          console.error("Error loading blog posts from Firestore:", error);
        } finally {
          setLoadingBlogs(false);
        }
      };
      fetchBlogs();
    }
  }, [currentPath]);

  const handleNavigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Find metadata for current route
  const currentRoute = ROUTES.find(r => r.path === currentPath) || ROUTES[14]; // default 404

  // FAQ Accordion State helper
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [faqSearch, setFaqSearch] = useState<string>('');
  const [faqCategoryFilter, setFaqCategoryFilter] = useState<string>('all');
  const [faqExpandedKey, setFaqExpandedKey] = useState<string | null>(null);

  // Interactive SEO Strategy State Variables
  const [seoKeywordFilter, setSeoKeywordFilter] = useState<'all' | 'primary' | 'secondary' | 'longtail'>('all');
  const [seoSearchQuery, setSeoSearchQuery] = useState<string>('');
  const [seoRoadmapQuarter, setSeoRoadmapQuarter] = useState<number>(1);
  const [seoEeatPillar, setSeoEeatPillar] = useState<'all' | 'experience' | 'expertise' | 'authority' | 'trust'>('all');
  const [seoLeadEmail, setSeoLeadEmail] = useState<string>('');
  const [seoLeadSubmitted, setSeoLeadSubmitted] = useState<boolean>(false);
  const [seoMetaTitleInput, setSeoMetaTitleInput] = useState<string>('Best Medical Device Regulatory Consulting in India | IQzyme Medtech – CDSCO, WHO PQ, IVD');
  const [seoMetaDescInput, setSeoMetaDescInput] = useState<string>('Expert regulatory services for medical devices & IVD in India. CDSCO registration, WHO Prequalification, QMS, LIMS, turnkey projects. Outperform global standards.');
  const [seoActiveFaqIndex, setSeoActiveFaqIndex] = useState<number | null>(null);

  return (
    <div id="portal-root-wrapper" className="min-h-screen bg-[#FAF9F5] flex flex-col font-sans antialiased">
      {/* SEO Handler triggers title and schema changes dynamically */}
      <SEOHandler route={currentRoute} />

      {/* Header element */}
      <Header currentPath={currentPath} onNavigate={handleNavigate} />

      {/* Main Content Body */}
      <main className="flex-grow pt-[82px] md:pt-[88px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="max-w-[1200px] mx-auto px-4 md:px-6 py-8 space-y-16"
          >

            {/* ========================================================
                ROUTE: HOME (/)
                ======================================================== */}
            {currentPath === '/' && (
              <>
                {/* Hero Section */}
                <section id="home-hero-section" className="relative bg-gradient-to-br from-[#2D3A55] to-[#1F293D] text-white rounded-2xl overflow-hidden p-8 md:p-16 shadow-xl border border-brand-dusk/30">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(153,206,67,0.08),transparent_45%)]" />
                  <div className="relative z-10 max-w-4xl space-y-6 text-left">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#99CE43] bg-[#99CE43]/10 px-3 py-1 rounded inline-flex items-center gap-1.5">
                      CDSCO · FDA · EU MDR · ISO 13485
                    </span>
                    <h2 className="font-display font-medium text-3xl md:text-5xl text-white leading-tight tracking-tight">
                      Global Medical Device & IVD Regulatory Consulting
                    </h2>
                    <p className="text-sm md:text-base text-brand-cloudy leading-relaxed max-w-3xl">
                      End-to-end regulatory affairs, quality systems and market access consulting for medical devices, IVDs, digital health and pharma products across CDSCO, FDA, EU MDR, IVDR and WHO-PQ.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-4">
                      <button 
                        onClick={() => handleNavigate('/contact-us')}
                        className="px-6 h-12 bg-[#00C4B7] hover:bg-[#00b0a4] text-white font-bold text-xs uppercase tracking-wider rounded shadow hover:scale-102 transition-all cursor-pointer text-center"
                      >
                        Request a Regulatory Strategy Consultation
                      </button>
                      <button 
                        onClick={() => handleNavigate('/services')}
                        className="px-6 h-12 border border-white hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider rounded transition-all cursor-pointer text-center"
                      >
                        Explore Our Global Services
                      </button>
                    </div>

                    {/* Trust Bar */}
                    <div className="pt-8 border-t border-white/10 mt-8">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-brand-pear mb-2">
                        Trusted Across Sectors
                      </p>
                      <p className="text-xs text-brand-cloudy font-medium">
                        Serving Medical Device <span className="text-white/40">•</span> IVD <span className="text-white/40">•</span> Digital Health <span className="text-white/40">•</span> SaMD <span className="text-white/40">•</span> Pharmaceutical <span className="text-white/40">•</span> Cosmetics companies
                      </p>
                    </div>
                  </div>
                </section>

                {/* What We Do Section */}
                <section id="home-what-we-do" className="bg-white border border-brand-cloudy/30 rounded-2xl p-8 md:p-12 shadow-sm space-y-6 text-left">
                  <div className="max-w-3xl space-y-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#00C4B7]">
                      What We Do
                    </span>
                    <h3 className="font-display font-medium text-2xl md:text-3xl text-brand-blue">
                      Engineering Compliance. Enabling Innovation.
                    </h3>
                    <p className="text-xs md:text-sm text-brand-dusk leading-relaxed font-normal">
                      We bring regulatory science, quality engineering and market intelligence together in one framework — covering the full product lifecycle from design control through submission, authorization and post-market surveillance. Whether you're chasing your first FDA 510(k), expanding into the EU under MDR 2017/745, or managing a multi-country portfolio, IQZYME brings the depth to get you there faster.
                    </p>
                  </div>
                </section>

                {/* Our Expertise Grid */}
                <section id="home-our-expertise" className="space-y-8 text-left">
                  <div className="max-w-2xl space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
                      Comprehensive Capabilities
                    </span>
                    <h3 className="font-display font-medium text-2xl text-brand-blue">
                      Our Areas of Expertise
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-6 bg-white border border-brand-cloudy/30 rounded-xl space-y-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 rounded bg-[#00C4B7]/10 flex items-center justify-center text-brand-blue">
                        <Shield size={20} className="text-[#00C4B7]" />
                      </div>
                      <h4 className="font-display font-bold text-sm text-brand-blue">Global Regulatory Affairs</h4>
                      <p className="text-xs text-brand-dusk leading-relaxed">Submissions, strategic market roadmapping, dossiers compilation and official agency liaison globally.</p>
                      <button onClick={() => handleNavigate('/services/regulatory-affairs')} className="text-xs font-bold text-[#00C4B7] hover:underline flex items-center gap-1 cursor-pointer">
                        <span>Details</span> →
                      </button>
                    </div>

                    <div className="p-6 bg-white border border-brand-cloudy/30 rounded-xl space-y-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 rounded bg-brand-pear/20 flex items-center justify-center text-brand-blue">
                        <Cpu size={20} className="text-brand-pear" />
                      </div>
                      <h4 className="font-display font-bold text-sm text-brand-blue">Quality Management Systems</h4>
                      <p className="text-xs text-brand-dusk leading-relaxed">Taylored design, ISO 13485:2016 structure implementation, audits, internal reviews and MDSAP compliance.</p>
                      <button onClick={() => handleNavigate('/services/iso-13485')} className="text-xs font-bold text-brand-pear hover:underline flex items-center gap-1 cursor-pointer">
                        <span>Details</span> →
                      </button>
                    </div>

                    <div className="p-6 bg-white border border-brand-cloudy/30 rounded-xl space-y-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 rounded bg-brand-orange/10 flex items-center justify-center text-brand-blue">
                        <Activity size={20} className="text-brand-orange" />
                      </div>
                      <h4 className="font-display font-bold text-sm text-brand-blue">Clinical Evaluation & Evidence</h4>
                      <p className="text-xs text-brand-dusk leading-relaxed">Literature searches, clinical evaluation reports (CER), PMCF documentation and safety dossiers.</p>
                      <button onClick={() => handleNavigate('/services/clinical-evaluation')} className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1 cursor-pointer">
                        <span>Details</span> →
                      </button>
                    </div>

                    <div className="p-6 bg-white border border-brand-cloudy/30 rounded-xl space-y-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 rounded bg-brand-purple/10 flex items-center justify-center text-brand-blue">
                        <FileText size={20} className="text-brand-purple" />
                      </div>
                      <h4 className="font-display font-bold text-sm text-brand-blue">Technical Documentation</h4>
                      <p className="text-xs text-brand-dusk leading-relaxed">Technical documentation files compilation per Annex II & III, GSPR mapping and risk management reports.</p>
                      <button onClick={() => handleNavigate('/services/regulatory-affairs')} className="text-xs font-bold text-brand-purple hover:underline flex items-center gap-1 cursor-pointer">
                        <span>Details</span> →
                      </button>
                    </div>

                    <div className="p-6 bg-white border border-brand-cloudy/30 rounded-xl space-y-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 rounded bg-[#99CE43]/20 flex items-center justify-center text-brand-blue">
                        <Compass size={20} className="text-brand-pear" />
                      </div>
                      <h4 className="font-display font-bold text-sm text-brand-blue">Digital Health & SaMD Regulatory</h4>
                      <p className="text-xs text-brand-dusk leading-relaxed">Software development lifecycle IEC 62304 compliance, cybersecurity architecture, cloud systems, and clinical software validation.</p>
                      <button onClick={() => handleNavigate('/services/samd-digital-health')} className="text-xs font-bold text-[#99CE43] hover:underline flex items-center gap-1 cursor-pointer">
                        <span>Details</span> →
                      </button>
                    </div>

                    <div className="p-6 bg-white border border-brand-cloudy/30 rounded-xl space-y-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center text-brand-blue">
                        <Globe size={20} className="text-blue-500" />
                      </div>
                      <h4 className="font-display font-bold text-sm text-brand-blue">Turnkey Facility Consulting</h4>
                      <p className="text-xs text-brand-dusk leading-relaxed">Turnkey layouts per cGMP/WHO directives, HVAC monitoring plans, equipment IQ/OQ/PQ and CSV validation.</p>
                      <button onClick={() => handleNavigate('/services/facility-consulting')} className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1 cursor-pointer">
                        <span>Details</span> →
                      </button>
                    </div>
                  </div>
                </section>

                {/* Jurisdictions We Serve */}
                <section id="home-jurisdictions" className="bg-[#FAF9F5] border border-brand-cloudy/20 rounded-2xl p-8 md:p-12 text-left space-y-8">
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-topaz">
                      Global Market Access, Delivered Locally
                    </span>
                    <h3 className="font-display font-medium text-2xl text-brand-blue">
                      Jurisdictions We Serve
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-brand-dusk">
                    <div className="space-y-2 bg-white p-5 border border-brand-cloudy/30 rounded-xl">
                      <h4 className="font-display font-bold text-sm text-brand-blue">America</h4>
                      <p className="leading-relaxed">US FDA (510k, De Novo, PMA, Establishment Registration, UDI, QMSR transition)</p>
                    </div>
                    <div className="space-y-2 bg-white p-5 border border-brand-cloudy/30 rounded-xl">
                      <h4 className="font-display font-bold text-sm text-[#00C4B7]">Europe</h4>
                      <p className="leading-relaxed">EU MDR (2017/745 CE mark), EU IVDR (2017/746), EAR representation, PRRC support</p>
                    </div>
                    <div className="space-y-2 bg-white p-5 border border-brand-cloudy/30 rounded-xl">
                      <h4 className="font-display font-bold text-sm text-brand-orange">Asia-Pacific</h4>
                      <p className="leading-relaxed">CDSCO India (SUGAM portal), TGA Australia, PMDA Japan, GCC countries, ASEAN markets</p>
                    </div>
                    <div className="space-y-2 bg-white p-5 border border-brand-cloudy/30 rounded-xl">
                      <h4 className="font-display font-bold text-sm text-brand-purple">International</h4>
                      <p className="leading-relaxed">WHO Prequalification (WHO-PQ modular support), MDSAP multi-jurisdiction coordination</p>
                    </div>
                  </div>
                </section>

                {/* Why IQZYME Section */}
                <section id="home-why-iqzyme" className="space-y-8 text-left">
                  <div className="max-w-2xl space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#00C4B7]">
                      Our Strengths
                    </span>
                    <h3 className="font-display font-medium text-2xl text-brand-blue">
                      Why IQZYME
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs text-brand-dusk">
                    <div className="space-y-2 bg-white p-6 border border-brand-cloudy/30 rounded-xl">
                      <h4 className="font-display font-bold text-sm text-brand-blue">Regulatory Science, Not Just Documentation</h4>
                      <p className="leading-relaxed">We bring scientific integrity, deep diagnostic validation experience, and biochemistry/molecular biology rigour to every file preparation.</p>
                    </div>
                    <div className="space-y-2 bg-white p-6 border border-brand-cloudy/30 rounded-xl">
                      <h4 className="font-display font-bold text-sm text-[#00C4B7]">Lifecycle Partnership</h4>
                      <p className="leading-relaxed">We support you across the entire technology cycle: from early facility designs and cleanroom validations to central agency submissions and post-market safety.</p>
                    </div>
                    <div className="space-y-2 bg-white p-6 border border-brand-cloudy/30 rounded-xl">
                      <h4 className="font-display font-bold text-sm text-brand-orange">Multi-Jurisdictional Efficiency</h4>
                      <p className="leading-relaxed">Reduce query response timelines and fast-track file submissions simultaneously across FDA, CE MDR/IVDR, and CDSCO SUGAM portals.</p>
                    </div>
                    <div className="space-y-2 bg-white p-6 border border-brand-cloudy/30 rounded-xl">
                      <h4 className="font-display font-bold text-sm text-brand-purple">Audit-Ready Quality Systems</h4>
                      <p className="leading-relaxed">Tailored, robust ISO 13485:2016 and MDSAP setups designed around your actual operational workflows, not generic paper templates.</p>
                    </div>
                    <div className="space-y-2 bg-white p-6 border border-brand-cloudy/30 rounded-xl">
                      <h4 className="font-display font-bold text-sm text-[#99CE43]">Specialised Expertise</h4>
                      <p className="leading-relaxed">Deep domain experience in molecular diagnostics, in-vitro reagents, AI/ML SaMD, active implants, sterile facilities, and cosmetics rules.</p>
                    </div>
                    <div className="space-y-2 bg-white p-6 border border-brand-cloudy/30 rounded-xl">
                      <h4 className="font-display font-bold text-sm text-brand-blue">Experienced Team</h4>
                      <p className="leading-relaxed">Direct support led by BSI-trained auditors, former state chemists, and scientific directors with over 30+ combined years of WHO PQ consultation.</p>
                    </div>
                  </div>
                </section>

                {/* Industries Served */}
                <section id="home-industries-served" className="space-y-8 text-left">
                  <div className="max-w-2xl space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
                      Sectors We Support
                    </span>
                    <h3 className="font-display font-medium text-2xl text-brand-blue">
                      Industries Served
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs text-brand-dusk">
                    <div className="bg-white border border-brand-cloudy/30 p-6 rounded-xl space-y-2 shadow-sm hover:border-brand-pear transition-colors">
                      <h4 className="font-display font-bold text-sm text-brand-blue">Medical Devices</h4>
                      <p className="leading-relaxed">Class A, B, C and D medical devices spanning active implants, orthopedics, cardiac, and general surgical instruments.</p>
                    </div>
                    <div className="bg-white border border-brand-cloudy/30 p-6 rounded-xl space-y-2 shadow-sm hover:border-[#00C4B7] transition-colors">
                      <h4 className="font-display font-bold text-sm text-[#00C4B7]">In Vitro Diagnostics (IVD)</h4>
                      <p className="leading-relaxed">Reagents, kits, instruments, and calibrators spanning molecular diagnostics, immunodiagnostics, and clinical chemistry.</p>
                    </div>
                    <div className="bg-white border border-brand-cloudy/30 p-6 rounded-xl space-y-2 shadow-sm hover:border-brand-orange transition-colors">
                      <h4 className="font-display font-bold text-sm text-brand-orange">Digital Health & SaMD</h4>
                      <p className="leading-relaxed">Mobile medical apps, AI/ML software, cloud diagnostics, and clinical decision support systems.</p>
                    </div>
                    <div className="bg-white border border-brand-cloudy/30 p-6 rounded-xl space-y-2 shadow-sm hover:border-brand-purple transition-colors">
                      <h4 className="font-display font-bold text-sm text-brand-purple">Pharmaceuticals & Combination</h4>
                      <p className="leading-relaxed">Drug delivery systems, pre-filled syringes, transdermal patches, and sterile pharmaceutical products.</p>
                    </div>
                    <div className="bg-white border border-brand-cloudy/30 p-6 rounded-xl space-y-2 shadow-sm hover:border-[#99CE43] transition-colors">
                      <h4 className="font-display font-bold text-sm text-[#99CE43]">Cosmetics & Personal Care</h4>
                      <p className="leading-relaxed">Regulatory compliance, state cosmetics licensing, ingredient reviews, and export documentation.</p>
                    </div>
                    <div className="bg-white border border-brand-cloudy/30 p-6 rounded-xl space-y-2 shadow-sm hover:border-blue-400 transition-colors">
                      <h4 className="font-display font-bold text-sm text-blue-500">Laboratory Services & POCT</h4>
                      <p className="leading-relaxed">Setting up clinical diagnostics labs, point-of-care testing centers, and obtaining NABL accreditation.</p>
                    </div>
                  </div>
                </section>

                {/* 6-Step Engagement Process */}
                <section id="home-block-engagement">
                  <EngagementProcessSteps />
                </section>

                {/* Global Reach Map (Indian map location pointers) */}
                <section id="home-block-global" className="space-y-6 text-left bg-white border border-brand-cloudy/30 p-8 rounded-2xl shadow-sm">
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#00C4B7]">Our Nationwide Footprint</span>
                    <h3 className="font-display font-medium text-2xl text-brand-blue">6 Offices Across the Indian Map</h3>
                    <p className="text-xs text-brand-dusk">Unified national reach combined with local licensing intimacy.</p>
                  </div>
                  <GlobalReachMap />
                </section>

                {/* Final CTA Band */}
                <section id="home-block-cta" className="bg-[#2D3A55] text-white p-8 md:p-12 rounded-2xl relative overflow-hidden border border-brand-dusk/20 text-center space-y-6">
                  <div className="max-w-2xl mx-auto space-y-3">
                    <h3 className="font-display font-semibold text-2xl text-white">Ready to Accelerate Your Global Market Access?</h3>
                    <p className="text-xs text-brand-cloudy leading-relaxed">
                      Whether entering your first market or managing a multi-country portfolio, IQZYME brings the regulatory intelligence to move your programme forward.
                    </p>
                  </div>
                  <button 
                    onClick={() => handleNavigate('/contact-us')} 
                    className="px-6 h-12 bg-[#99CE43] hover:bg-[#86b53b] text-brand-blue font-bold text-xs uppercase tracking-wider rounded shadow hover:scale-102 transition-all cursor-pointer"
                  >
                    Schedule a Consultation
                  </button>
                </section>

                {/* Stay Informed Newsletter */}
                <section id="home-block-newsletter" className="py-2">
                  <NewsletterForm />
                </section>
              </>
            )}


            {/* ========================================================
                ROUTE: ABOUT US (/about-us)
                ======================================================== */}
            {currentPath === '/about-us' && (
              <>
                {/* About Hero Overview */}
                <section id="about-overview" className="max-w-3xl mx-auto text-center space-y-4 animate-fade-in">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#00C4B7]">
                    About IQZYME
                  </span>
                  <h2 className="font-display font-medium text-3xl md:text-5xl text-brand-blue leading-tight">
                    Global Regulatory & Quality Consulting for MedTech
                  </h2>
                  <p className="text-sm md:text-base text-brand-dusk leading-relaxed font-normal">
                    IQZYME is a global regulatory affairs, quality systems and market access consulting firm for medical devices, IVDs, digital health and pharma products.
                  </p>
                </section>

                {/* Mission and Vision Grid */}
                <section id="about-mission-vision" className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                  <div className="bg-white border border-brand-cloudy/30 p-8 rounded-2xl shadow-sm space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="space-y-3 text-left">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-pear bg-brand-pear/10 px-2.5 py-1 rounded">
                        OUR MISSION
                      </span>
                      <h3 className="font-display font-medium text-xl md:text-2xl text-brand-blue">
                        Accelerating Safe Innovation
                      </h3>
                      <p className="text-xs md:text-sm text-brand-dusk leading-relaxed">
                        To help medical technology companies reach global markets faster, more confidently and with sustainable compliance — through science-driven regulatory, quality and market access solutions across the product lifecycle.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border border-brand-cloudy/30 p-8 rounded-2xl shadow-sm space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="space-y-3 text-left">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-2.5 py-1 rounded">
                        OUR VISION
                      </span>
                      <h3 className="font-display font-medium text-xl md:text-2xl text-brand-blue">
                        Trusted Global Leadership
                      </h3>
                      <p className="text-xs md:text-sm text-brand-dusk leading-relaxed">
                        To be the most trusted global regulatory intelligence partner for healthcare innovators, from startups to multinationals.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Our Approach — The IQZYME Framework */}
                <section id="about-approach" className="bg-[#FAF9F5] border border-brand-cloudy/20 rounded-2xl p-8 md:p-12 text-left space-y-6">
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#00C4B7]">
                      Our Approach
                    </span>
                    <h3 className="font-display font-medium text-2xl md:text-3xl text-brand-blue">
                      The IQZYME Framework
                    </h3>
                  </div>
                  <p className="text-xs md:text-sm text-brand-dusk leading-relaxed max-w-4xl">
                    Most firms provide documentation services; <strong>IQZYME provides regulatory strategy</strong>. We start by understanding your device, markets, timelines and risk tolerance, then design a pathway that accounts for classification, evidence requirements, QMS gaps and submission sequencing — before a single document is drafted.
                  </p>
                </section>

                {/* Leadership & Credentials */}
                <section id="about-leadership" className="space-y-8 text-left">
                  <div className="space-y-3 max-w-4xl">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-purple">
                      Our Leadership & Credentials
                    </span>
                    <h3 className="font-display font-medium text-2xl md:text-3xl text-brand-blue">
                      Meet Our Directors & Regulatory Experts
                    </h3>
                    <p className="text-xs md:text-sm text-brand-dusk leading-relaxed">
                      Our team includes ISO 13485:2016 Lead Auditors (IRCA-CQI certified), EU MDR/IVDR Lead Implementers and Consultants (BSI-trained), former WHO PQ programme coordinators, and engineers with deep device and diagnostics manufacturing experience.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border border-brand-cloudy/30 p-6 rounded-2xl text-center space-y-4 shadow-sm hover:shadow-md transition-shadow">
                      <img 
                        src="/images/sinto_poulose_headshot.jpg" 
                        alt="Sinto Poulose" 
                        className="w-24 h-24 rounded-full object-cover mx-auto shadow-md border-2 border-[#00C4B7]/20" 
                        referrerPolicy="no-referrer" 
                      />
                      <div>
                        <h4 className="font-display font-bold text-sm text-brand-blue">Mr. Sinto Poulose</h4>
                        <p className="text-xs text-[#00C4B7] font-bold">Founder Director</p>
                        <p className="text-[10px] text-brand-dusk mt-3 leading-relaxed">
                          Over 17 years expertise in manufacturing/testing of IVD and medical devices. Biochemistry background, approved chemist, and BSI-trained Lead Consultant for CE marking under EU IVDR 2017/746.
                        </p>
                      </div>
                    </div>

                    <div className="bg-white border border-brand-cloudy/30 p-6 rounded-2xl text-center space-y-4 shadow-sm hover:shadow-md transition-shadow">
                      <img 
                        src="/images/selma_s_headshot.jpg" 
                        alt="Selma S" 
                        className="w-24 h-24 rounded-full object-cover mx-auto shadow-md border-2 border-brand-pear/20" 
                        referrerPolicy="no-referrer" 
                      />
                      <div>
                        <h4 className="font-display font-bold text-sm text-brand-blue">Mrs. Selma S</h4>
                        <p className="text-xs text-brand-pear font-bold">Founder Director</p>
                        <p className="text-[10px] text-brand-dusk mt-3 leading-relaxed">
                          Over 19 years experience in medical device manufacturing & testing. PG in Molecular Biology & Biotechnology, approved chemist, and Lead Implementer for EU MDR 2017/745 compliance.
                        </p>
                      </div>
                    </div>

                    <div className="bg-white border border-brand-cloudy/30 p-6 rounded-2xl text-center space-y-4 shadow-sm hover:shadow-md transition-shadow">
                      <img 
                        src="/images/dr_chandranand_headshot.jpg" 
                        alt="Dr. P. S. Chandranand" 
                        className="w-24 h-24 rounded-full object-cover mx-auto shadow-md border-2 border-brand-orange/20" 
                        referrerPolicy="no-referrer" 
                      />
                      <div>
                        <h4 className="font-display font-bold text-sm text-brand-blue">Dr. P. S. Chandranand</h4>
                        <p className="text-xs text-brand-orange font-bold">Director</p>
                        <p className="text-[10px] text-brand-dusk mt-3 leading-relaxed">
                          PhD, former Deputy Quality Manager at NIB with decades of regulatory leadership & WHO collaborations. WHO PQ Consultant & IVD Specialist with 15+ years WHO prequalification experience.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Values Section */}
                <section id="about-values" className="space-y-8 text-left">
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#99CE43]">
                      Our Principles
                    </span>
                    <h3 className="font-display font-medium text-2xl text-brand-blue">
                      Core Values
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {[
                      { title: 'Scientific Integrity', text: 'Grounded in scientific truth, absolute accuracy, and rigorous clinical evidence.' },
                      { title: 'Client Partnership', text: "We act as your dedicated team, treating your product's market access as our own objective." },
                      { title: 'Technical Excellence', text: 'High-precision technical writing, robust dossier architecture, and clean engineering.' },
                      { title: 'Global Perspective', text: 'Direct regulatory intelligence spanning 30+ jurisdictions and multiple global agencies.' },
                      { title: 'Outcome-Driven Execution', text: 'Focused on reducing query cycles and delivering successful clearances confidently.' }
                    ].map((val, idx) => (
                      <div key={idx} className="p-5 bg-white border border-brand-cloudy/30 rounded-2xl space-y-2.5 shadow-sm hover:border-[#00C4B7] transition-all">
                        <span className="text-xs font-mono font-bold text-[#00C4B7]">
                          0{idx + 1}
                        </span>
                        <h4 className="font-display font-bold text-sm text-brand-blue">
                          {val.title}
                        </h4>
                        <p className="text-[11px] text-brand-dusk leading-relaxed">
                          {val.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Call To Action */}
                <section id="about-cta" className="animate-fade-in pt-4">
                  <PrimaryCTA onNavigate={handleNavigate} />
                </section>
              </>
            )}


            {/* ========================================================
                ROUTE: SERVICES (/services and sub-services)
                ======================================================== */}
            {currentPath.startsWith('/services') && (() => {
              // Extract the active service ID from the path suffix
              const pathSuffix = currentPath.replace('/services', '').replace(/^\//, '');
              const activeService = SERVICES_DATA.find(s => s.id === pathSuffix) || SERVICES_DATA[0];

              const handleServiceTabSelect = (serviceId: string) => {
                handleNavigate(`/services/${serviceId}`);
              };

              // Group services by category
              const categories = ['Global Market Access', 'Quality & Engineering', 'Indian Regulatory Support'];

              return (
                <div id="services-interactive-portal" className="space-y-10 animate-fade-in">
                  {/* Service Header banner */}
                  <section id="services-hero-banner" className="text-center space-y-4 max-w-3xl mx-auto">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#00C4B7]">
                      IQZYME ADVISORY STREAMS
                    </span>
                    <h2 className="font-display font-medium text-3xl md:text-4xl text-brand-blue">
                      Engineering Compliance. Enabling Innovation.
                    </h2>
                    <p className="text-sm text-brand-dusk leading-relaxed">
                      We bring regulatory science, quality engineering and market intelligence together in one framework — covering the full product lifecycle from design control through submission, authorization and post-market surveillance.
                    </p>
                  </section>

                  {/* Sidebar + Tab Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Sticky left nav column */}
                    <div className="lg:col-span-4 bg-white border border-brand-cloudy/30 rounded-xl p-4 lg:sticky lg:top-24 space-y-6 shadow-sm">
                      <div className="border-b border-[#FAF9F5] pb-3 mb-2">
                        <h4 className="font-display font-bold text-xs uppercase tracking-wider text-brand-blue">
                          Service Directory
                        </h4>
                        <p className="text-[10px] text-brand-cloudy mt-1">Select an advisory stream below</p>
                      </div>

                      <div className="space-y-5">
                        {categories.map((cat) => {
                          const catServices = SERVICES_DATA.filter(s => s.category === cat);
                          return (
                            <div key={cat} className="space-y-2">
                              <span className="text-[10px] uppercase font-bold text-brand-topaz tracking-wider block border-l-2 border-[#00C4B7] pl-2">
                                {cat}
                              </span>
                              <div className="flex flex-col gap-1">
                                {catServices.map((srv) => {
                                  const isActive = activeService.id === srv.id;
                                  return (
                                    <button
                                      key={srv.id}
                                      onClick={() => handleServiceTabSelect(srv.id)}
                                      className={`w-full text-left px-3 py-2.5 text-xs font-medium rounded transition-all duration-150 flex items-center justify-between cursor-pointer ${
                                        isActive
                                          ? 'bg-brand-blue text-white font-semibold shadow'
                                          : 'hover:bg-[#FAF9F5] text-brand-blue hover:text-brand-topaz'
                                      }`}
                                    >
                                      <span>{srv.label}</span>
                                      <span className={isActive ? 'text-[#99CE43]' : 'text-brand-cloudy'}>
                                        →
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Detailed Content column */}
                    <div className="lg:col-span-8 bg-white border border-brand-cloudy/30 rounded-xl p-6 md:p-8 shadow-sm min-h-[500px] flex flex-col justify-between space-y-8">
                      <div className="space-y-6">
                        {/* Title & category */}
                        <div className="space-y-2 border-b border-[#FAF9F5] pb-4">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#00C4B7] bg-[#00C4B7]/10 px-2.5 py-1 rounded">
                            {activeService.category}
                          </span>
                          <h3 className="font-display font-medium text-2xl md:text-3xl text-brand-blue">
                            {activeService.title}
                          </h3>
                        </div>

                        {/* Intro paragraph */}
                        <p className="text-xs text-brand-dusk leading-relaxed font-medium bg-[#FAF9F5]/40 p-4 rounded border-l-4 border-brand-pear">
                          {activeService.intro}
                        </p>

                        {/* Custom render for sections */}
                        <div className="space-y-6">
                          {activeService.sections.map((sec, sIdx) => (
                            <div key={sIdx} className="space-y-3">
                              <h4 className="font-display font-semibold text-sm text-brand-blue flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-brand-orange rounded-full" />
                                {sec.heading}
                              </h4>
                              
                              {sec.items && (
                                <ul className="text-xs text-brand-dusk space-y-3.5 pl-4">
                                  {sec.items.map((item, iIdx) => {
                                    // Parse item into bold title and text if it has a colon
                                    const hasColon = item.includes(':');
                                    if (hasColon) {
                                      const parts = item.split(':');
                                      const title = parts[0];
                                      const body = parts.slice(1).join(':');
                                      return (
                                        <li key={iIdx} className="flex items-start gap-2.5 leading-relaxed text-left">
                                          <CheckCircle size={14} className="text-brand-pear mt-0.5 shrink-0" />
                                          <span>
                                            <strong className="text-brand-blue">{title}:</strong>{body}
                                          </span>
                                        </li>
                                      );
                                    }
                                    return (
                                      <li key={iIdx} className="flex items-start gap-2.5 leading-relaxed text-left">
                                        <CheckCircle size={14} className="text-brand-pear mt-0.5 shrink-0" />
                                        <span>{item}</span>
                                      </li>
                                    );
                                  })}
                                </ul>
                              )}

                              {sec.text && (
                                <p className="text-xs text-brand-dusk leading-relaxed pl-4 text-left">
                                  {sec.text}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Call to action panel */}
                      <div className="bg-[#FAF9F5] border border-brand-cloudy/30 p-6 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-center sm:text-left space-y-1">
                          <h5 className="font-display font-bold text-xs text-brand-blue">
                            Ready to Accelerate Your Global Market Access?
                          </h5>
                          <p className="text-[10px] text-brand-cloudy">
                            Whether entering your first market or managing a multi-country portfolio, IQZYME brings the regulatory intelligence to move your programme forward.
                          </p>
                        </div>
                        <button
                          onClick={() => handleNavigate('/contact-us')}
                          className="px-5 h-10 bg-[#00C4B7] text-white font-semibold text-xs uppercase tracking-wider rounded shadow hover:bg-[#00b0a4] hover:scale-102 transition-all cursor-pointer whitespace-nowrap text-center"
                        >
                          {activeService.cta}
                        </button>
                      </div>

                    </div>
                  </div>

                  {/* Urgency Call To Action */}
                  <div className="max-w-4xl mx-auto pt-6 animate-fade-in">
                    <UrgencyCTA onNavigate={handleNavigate} />
                  </div>
                </div>
              );
            })()}


            {/* ========================================================
                ROUTE: INDUSTRIES SERVED (/industries-served)
                ======================================================== */}
            {currentPath === '/industries-served' && (
              <>
                {/* Block 2: Our Industry Focus */}
                <section id="industry-focus" className="max-w-3xl mx-auto text-center space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-topaz">Sectors We Empower</span>
                  <h2 className="font-display font-medium text-3xl md:text-4xl text-brand-blue">Targeted Regulatory & SEO Intelligence</h2>
                  <p className="text-sm text-brand-dusk leading-relaxed">
                    Lifesciences, diagnostics, clinical labs, and hospital environments require high-trust educational authority. We don't write generic copy—every block of text represents real scientific safety.
                  </p>
                </section>

                {/* Block 3: Why Choose Us for Your Industry */}
                <section id="industry-why-us" className="relative h-[260px] rounded-xl overflow-hidden flex items-center justify-center text-center p-6 text-white border border-brand-cloudy/30 shadow-lg">
                  <div className="absolute inset-0 bg-[#2D3A55]/90 z-10" />
                  <img src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=1200" alt="Scientific lab" className="absolute inset-0 w-full h-full object-cover opacity-20" referrerPolicy="no-referrer" />
                  <div className="relative z-20 max-w-xl space-y-4">
                    <h3 className="font-display font-semibold text-xl md:text-2xl text-white">Strict Compliance Guardrails</h3>
                    <p className="text-xs text-brand-cloudy leading-relaxed">
                      Our dual consulting model means our medical writers and regulatory analysts work hand-in-hand to ensure every social layout, blog, and website element is 100% compliant with advertising laws.
                    </p>
                  </div>
                </section>

                {/* Block 4: Case Studies */}
                <section id="industry-case-studies" className="space-y-6">
                  <div className="text-center max-w-xl mx-auto space-y-2">
                    <h3 className="font-display font-medium text-2xl text-brand-blue">Client Success Dossiers</h3>
                    <p className="text-xs text-brand-dusk">Real-world results achieved by medtech and IVD companies partnering with IQzyme.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {CASE_STUDIES.map(cs => (
                      <div key={cs.id} className="bg-white p-6 border border-brand-cloudy/30 rounded-lg space-y-3 shadow-sm hover:shadow-md transition-shadow">
                        <span className="text-[10px] uppercase font-bold text-brand-topaz">{cs.industry}</span>
                        <h4 className="font-display font-semibold text-sm text-brand-blue">{cs.title}</h4>
                        <p className="text-xs text-brand-dusk leading-relaxed line-clamp-4">{cs.description}</p>
                        <div className="pt-2 flex items-center justify-between border-t border-brand-cloudy/20 text-xs font-semibold text-brand-blue">
                          <span className="text-brand-pear">{cs.metrics}</span>
                          <button onClick={() => handleNavigate('/case-studies')} className="hover:underline cursor-pointer">Read File →</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}


            {/* ========================================================
                ROUTE: RESOURCES (/resources)
                ======================================================== */}
            {currentPath === '/resources' && (
              <>
                {/* Block 2: Latest Articles */}
                <section id="resources-articles" className="space-y-6">
                  <div className="text-center max-w-xl mx-auto space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-topaz">Knowledge Base</span>
                    <h2 className="font-display font-medium text-2xl md:text-3xl text-brand-blue">Latest Advisory Publications</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {BLOG_POSTS.map(post => (
                      <div key={post.id} className="bg-white border border-brand-cloudy/30 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                        <div>
                          <img src={post.image} alt={post.title} className="w-full h-40 object-cover" referrerPolicy="no-referrer" />
                          <div className="p-5 space-y-2">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-brand-pear bg-brand-pear/10 px-2 py-0.5 rounded">{post.category}</span>
                            <h4 className="font-display font-bold text-sm text-brand-blue line-clamp-2">{post.title}</h4>
                            <p className="text-xs text-brand-dusk line-clamp-3">{post.excerpt}</p>
                          </div>
                        </div>
                        <div className="p-5 pt-0 border-t border-[#FAF9F5] flex items-center justify-between text-xs text-brand-dusk">
                          <span>{post.date}</span>
                          <button onClick={() => handleNavigate('/blog')} className="font-bold text-brand-blue hover:underline cursor-pointer">Read Article →</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Block 3: Whitepapers and Reports */}
                <section id="resources-reports" className="space-y-4">
                  <h3 className="font-display font-medium text-xl text-brand-blue">Technical Whitepapers & Regulatory Reports</h3>
                  <div className="bg-white border border-brand-cloudy/30 rounded-lg overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#FAF9F5] border-b border-brand-cloudy/30 text-brand-blue font-semibold">
                          <th className="p-4">Report Identifier</th>
                          <th className="p-4">Target Regulatory Scope</th>
                          <th className="p-4">Release Date</th>
                          <th className="p-4 text-right">Access File</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-cloudy/20 text-brand-dusk">
                        <tr>
                          <td className="p-4 font-semibold text-brand-blue">WP-2026-IVDR</td>
                          <td className="p-4">EU-IVDR Performance Evaluation Reports & Notified Body Audit checklist</td>
                          <td className="p-4">June 2026</td>
                          <td className="p-4 text-right"><button onClick={() => handleNavigate('/book-consultation')} className="text-brand-topaz font-semibold hover:underline cursor-pointer">Download PDF</button></td>
                        </tr>
                        <tr>
                          <td className="p-4 font-semibold text-brand-blue">WP-2026-CDSCO</td>
                          <td className="p-4">CDSCO SUGAM Online Filing Guide for Class B & C Orthopedic Implants</td>
                          <td className="p-4">May 2026</td>
                          <td className="p-4 text-right"><button onClick={() => handleNavigate('/book-consultation')} className="text-brand-topaz font-semibold hover:underline cursor-pointer">Download PDF</button></td>
                        </tr>
                        <tr>
                          <td className="p-4 font-semibold text-brand-blue">IQ-SEO-STRATEGY</td>
                          <td className="p-4">Interactive B2B SEO Strategy & E-E-A-T Compliance Roadmap for Indian MedTech</td>
                          <td className="p-4">Active Strategy</td>
                          <td className="p-4 text-right"><button onClick={() => handleNavigate('/seo-strategy')} className="text-brand-orange font-bold hover:underline cursor-pointer">Launch Interactive Board →</button></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Block 4: Frequently Asked Questions */}
                <section id="resources-faqs" className="space-y-6">
                  <h3 className="font-display font-medium text-xl text-brand-blue text-center">Frequently Asked Questions</h3>
                  <div className="max-w-2xl mx-auto space-y-3">
                    {FAQS.slice(0, 4).map((faq, idx) => (
                      <div key={idx} className="border border-brand-cloudy/30 rounded bg-white overflow-hidden shadow-sm">
                        <button
                          onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                          className="w-full text-left p-4 flex items-center justify-between text-xs font-semibold text-brand-blue bg-[#FAF9F5]/40 hover:bg-[#FAF9F5] transition-colors cursor-pointer"
                        >
                          <span>{faq.question}</span>
                          <span>{expandedFaq === idx ? '−' : '+'}</span>
                        </button>
                        {expandedFaq === idx && (
                          <div className="p-4 border-t border-brand-cloudy/20 text-xs text-brand-dusk leading-relaxed">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {/* Block 5: Access All Resources */}
                <section id="resources-cta" className="text-center pt-4">
                  <div className="space-y-3">
                    <h4 className="font-display font-semibold text-sm text-brand-blue">Need help with a specific regulatory file?</h4>
                    <button onClick={() => handleNavigate('/faq')} className="px-6 h-11 bg-brand-blue text-white font-semibold text-xs uppercase tracking-wider rounded hover:bg-brand-blue/90 transition-all cursor-pointer">
                      View Comprehensive FAQ Archive
                    </button>
                  </div>
                </section>
              </>
            )}


            {/* ========================================================
                ROUTE: CAREERS (/careers)
                ======================================================== */}
            {currentPath === '/careers' && (
              <>
                {/* Block 2: Explore Careers with Us */}
                <section id="careers-overview" className="max-w-3xl mx-auto text-center space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-topaz">Careers at IQzyme</span>
                  <h2 className="font-display font-medium text-3xl md:text-4xl text-brand-blue">Grow Your Life-Science Career</h2>
                  <p className="text-sm text-brand-dusk leading-relaxed">
                    Join an elite cross-functional team where regulatory specialists, scientific writers, and digital strategists collaborate to validate and launch life-saving medical designs.
                  </p>
                </section>

                {/* Block 3: Open Positions */}
                <section id="careers-positions" className="space-y-6">
                  <h3 className="font-display font-medium text-xl text-brand-blue">Current Open Vacancies</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {OPEN_POSITIONS.map(pos => (
                      <div key={pos.id} className="bg-white p-6 border border-brand-cloudy/30 rounded-lg space-y-4 shadow-sm flex flex-col justify-between">
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold uppercase text-brand-pear bg-brand-pear/10 px-2 py-0.5 rounded">{pos.department}</span>
                          <h4 className="font-display font-bold text-sm text-brand-blue">{pos.title}</h4>
                          <p className="text-xs text-brand-topaz font-medium">{pos.location} — {pos.type}</p>
                          <p className="text-xs text-brand-dusk leading-relaxed mt-2">{pos.description}</p>
                          <div className="pt-2 space-y-1">
                            <p className="text-[10px] font-bold text-brand-blue uppercase tracking-wider">Candidate Requirements:</p>
                            {pos.requirements.map((req, rIdx) => (
                              <p key={rIdx} className="text-xs text-brand-dusk flex items-start gap-1.5">• {req}</p>
                            ))}
                          </div>
                        </div>
                        <button onClick={() => handleNavigate('/contact-us')} className="w-full mt-4 h-10 bg-brand-blue text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-brand-blue/90 cursor-pointer">
                          Apply For Role
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Block 4: Application Process */}
                <section id="careers-process" className="bg-white border border-brand-cloudy/30 p-8 rounded-xl shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                      <span className="text-xs font-bold uppercase text-brand-orange font-mono">Our Process</span>
                      <h3 className="font-display font-medium text-2xl text-brand-blue">Transparent & Respectful Recruitment</h3>
                      <p className="text-xs text-brand-dusk leading-relaxed">
                        We value technical credentials and cultural alignment. Our process includes a dossier screening, an informal technical conversation, and a short, simulated client problem-solving session.
                      </p>
                      <button onClick={() => handleNavigate('/about-us')} className="text-xs text-brand-orange hover:underline font-semibold">Learn about our values →</button>
                    </div>
                    <div className="p-6 bg-[#FAF9F5] border border-brand-cloudy/30 rounded-lg text-center space-y-3">
                      <h4 className="font-display font-bold text-sm text-brand-blue">Send Us Your Credentials</h4>
                      <p className="text-xs text-brand-dusk">We are always scouting for high-quality medical device auditors, writers, and technical market specialists.</p>
                      <button onClick={() => handleNavigate('/contact-us')} className="px-5 h-10 bg-[#00C4B7] text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-[#00b0a4] cursor-pointer">Submit CV Portal</button>
                    </div>
                  </div>
                </section>

                {/* Block 5: Why Our Employees Love Us */}
                <section id="careers-quote">
                  <div className="bg-brand-blue/5 border border-brand-cloudy/20 p-8 rounded-xl text-center space-y-4 max-w-3xl mx-auto">
                    <span className="text-3xl">“</span>
                    <p className="font-serif italic text-sm text-brand-blue leading-relaxed max-w-2xl mx-auto">
                      "At IQzyme, I can use my specialized biomedical engineering background to write real, high-precision technical files while working alongside world-class UX designers. The Scandinavian work-life balance is real, and the growth paths are outstanding."
                    </p>
                    <h4 className="font-display font-bold text-xs text-brand-blue">Mikael Lind, Senior Consultant</h4>
                  </div>
                </section>
              </>
            )}


            {/* ========================================================
                ROUTE: CONTACT US (/contact-us)
                ======================================================== */}
            {currentPath === '/contact-us' && (
              <>
                {/* Block 2: Get in Touch */}
                <section id="contact-overview" className="max-w-3xl mx-auto text-center space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-topaz">Connect Globally</span>
                  <h2 className="font-display font-medium text-3xl md:text-4xl text-brand-blue">Secure B2B Inquiry Channel</h2>
                  <p className="text-sm text-brand-dusk leading-relaxed">
                    Submit your medical classification criteria or marketing expansion goals securely. Our senior compliance analyst and healthcare lead strategist will evaluate your specifications within 24 business hours.
                  </p>
                </section>

                {/* Block 3: Our Location */}
                <section id="contact-location" className="space-y-8">
                  <div className="text-center space-y-2">
                    <span className="text-xs font-bold uppercase text-brand-pear">Office Coordinates</span>
                    <h3 className="font-display font-medium text-2xl text-brand-blue">Our 6 Locations Across India</h3>
                    <p className="text-xs text-brand-dusk max-w-lg mx-auto">
                      Click any office address to open Google Maps or select it to view its interactive map directly below.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {CONTACT_OFFICES.map((office, idx) => {
                      const isSelected = selectedOfficeIndex === idx;
                      return (
                        <div 
                          key={idx}
                          onClick={() => setSelectedOfficeIndex(idx)}
                          className={`bg-white border p-5 rounded-xl shadow-sm transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 ${
                            isSelected 
                              ? 'border-[#00C4B7] ring-2 ring-[#00C4B7]/20 shadow-md bg-slate-50/20' 
                              : 'border-brand-cloudy/30 hover:border-brand-topaz/50 hover:shadow-md'
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1 text-left">
                                <h4 className="font-display font-bold text-sm text-brand-blue">{office.city}</h4>
                              </div>
                              {isSelected && (
                                <span className="text-[10px] bg-[#00C4B7]/10 text-[#00C4B7] px-2 py-0.5 rounded font-bold uppercase font-mono tracking-wider">
                                  Selected
                                </span>
                              )}
                            </div>
                            <span className="inline-block text-[10px] text-brand-topaz font-bold font-mono uppercase bg-brand-topaz/5 px-2 py-0.5 rounded">
                              IQZYME MEDTECH PVT. LTD.
                            </span>
                          </div>

                          <div className="space-y-3">
                            {/* Clickable Address Link */}
                            <a 
                              href={office.mapUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              className="group flex items-start gap-2 text-xs text-brand-dusk hover:text-[#00C4B7] hover:underline transition-colors leading-relaxed text-left"
                              title="Click to view on Google Maps"
                            >
                              <MapPin size={16} className="text-[#00C4B7] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                              <span className="font-medium">{office.address}</span>
                            </a>

                            <div className="text-[11px] text-brand-cloudy space-y-1 pt-2 border-t border-[#FAF9F5]">
                              <div className="flex items-center gap-1.5">
                                <Phone size={11} className="text-brand-cloudy" />
                                <span>{office.phone}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Mail size={11} className="text-brand-cloudy" />
                                <span>{office.email}</span>
                              </div>
                            </div>
                          </div>

                          {/* Get Directions Button */}
                          <div className="pt-2">
                            <a 
                              href={office.dirUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="w-full h-8 flex items-center justify-center gap-1.5 bg-brand-blue/5 hover:bg-brand-blue hover:text-white text-brand-blue rounded text-xs font-semibold uppercase tracking-wider transition-all duration-200 border border-brand-blue/10"
                            >
                              <Navigation size={12} className="rotate-45" />
                              <span>Get Directions</span>
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Interactive Embedded Google Map Below Details */}
                  <div className="bg-white border border-brand-cloudy/30 rounded-xl p-4 md:p-6 shadow-sm space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#FAF9F5] pb-4">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-brand-topaz font-bold flex items-center gap-1">
                          <Map size={12} className="text-[#00C4B7]" /> Live Interactive Location Map
                        </span>
                        <h4 className="font-display font-bold text-base text-brand-blue">
                          📍 {CONTACT_OFFICES[selectedOfficeIndex].city} Hub
                        </h4>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* Open in Native App Link */}
                        <a 
                          href={CONTACT_OFFICES[selectedOfficeIndex].mapUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-4 h-9 bg-brand-blue hover:bg-[#00C4B7] text-white text-xs font-semibold uppercase tracking-wider rounded shadow flex items-center gap-1.5 transition-all duration-200"
                        >
                          <ExternalLink size={12} />
                          <span className="hidden sm:inline">Open in Google Maps App</span>
                          <span className="sm:hidden">Open Map</span>
                        </a>
                      </div>
                    </div>

                    {/* Responsive Google Map Iframe */}
                    <div className="relative w-full h-96 bg-brand-blue/5 border border-brand-cloudy/20 rounded-lg overflow-hidden shadow-inner">
                      <iframe 
                        src={CONTACT_OFFICES[selectedOfficeIndex].embedUrl}
                        className="absolute inset-0 w-full h-full border-0"
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        title={`Google Map for IQzyme - ${CONTACT_OFFICES[selectedOfficeIndex].city}`}
                      />
                    </div>
                    
                    <p className="text-[10px] text-center text-brand-cloudy">
                      🚗 On mobile devices, clicking the button or address will automatically launch your native Google Maps App if installed.
                    </p>
                  </div>
                </section>

                {/* Block 4: Send Us a Message */}
                <section id="contact-message-form">
                  <div className="max-w-2xl mx-auto space-y-4">
                    <h3 className="font-display font-medium text-xl text-brand-blue text-center">Transmit Inbound Dossier File</h3>
                    <ContactForm />
                  </div>
                </section>

                {/* Block 5: Connect With Us */}
                <section id="contact-divider" className="pt-4">
                  <hr className="border-t border-brand-cloudy/30" />
                </section>
              </>
            )}


            {/* ========================================================
                ROUTE: BOOK CONSULTATION (/book-consultation)
                ======================================================== */}
            {currentPath === '/book-consultation' && (
              <section id="book-consultation-page" className="py-6 space-y-8">
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#00C4B7]">Confidential Audit Scheduler</span>
                  <h2 className="font-display font-medium text-3xl text-brand-blue">Schedule Sandbox Business Audit</h2>
                  <p className="text-sm text-brand-dusk">
                    Select your advisory stream and pick an available calendar slot. Our lead regulatory consultants will conduct a confidential pre-review of your device specs.
                  </p>
                </div>
                <ConsultationForm />
              </section>
            )}


            {/* ========================================================
                ROUTE: CLIENT PORTAL (/client-portal)
                ======================================================== */}
            {currentPath === '/client-portal' && (
              <section id="client-portal-page" className="py-6 space-y-8">
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#00C4B7]">Secure Client Portal</span>
                  <h2 className="font-display font-medium text-3xl text-brand-blue">Partner Collaboration Hub</h2>
                  <p className="text-sm text-brand-dusk">
                    Sign in to track your files, review active consultation bookings, and transmit secure regulatory dossier files.
                  </p>
                </div>
                <FirebaseAuthPanel />
              </section>
            )}


            {/* ========================================================
                ROUTE: ADMIN DASHBOARD (/admin)
                ======================================================== */}
            {currentPath === '/admin' && (
              <section id="admin-dashboard-page" className="py-6 space-y-8">
                <AdminDashboard />
              </section>
            )}


            {/* ========================================================
                ROUTE: CASE STUDIES (/case-studies)
                ======================================================== */}
            {currentPath === '/case-studies' && (
              <>
                <section id="case-studies-header" className="max-w-3xl mx-auto text-center space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-topaz">Client Success Dossiers</span>
                  <h2 className="font-display font-medium text-3xl md:text-4xl text-brand-blue">Proven Regulatory Approval Tracks</h2>
                  <p className="text-sm text-brand-dusk leading-relaxed">
                    Explore detailed analyses of orthopedic implant registrations, molecular diagnostic CE certifications, and search visibility overhauls conducted by IQzyme.
                  </p>
                </section>

                {/* Block 2: Featured Success Story */}
                <section id="case-featured" className="bg-white border border-brand-cloudy/30 p-8 rounded-xl shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <img src={CASE_STUDIES[0].image} alt={CASE_STUDIES[0].title} className="rounded-lg object-cover w-full h-72" referrerPolicy="no-referrer" />
                    <div className="space-y-4">
                      <span className="text-xs font-bold uppercase text-[#00C4B7]">{CASE_STUDIES[0].industry}</span>
                      <h3 className="font-display font-medium text-2xl text-brand-blue">{CASE_STUDIES[0].title}</h3>
                      <p className="text-xs text-brand-dusk leading-relaxed">{CASE_STUDIES[0].description}</p>
                      
                      <div className="p-4 bg-[#FAF9F5] border border-brand-cloudy/20 rounded-lg text-xs space-y-2 text-brand-dusk">
                        <p><strong>The Challenge:</strong> {CASE_STUDIES[0].challenge}</p>
                        <p><strong>Our Solution:</strong> {CASE_STUDIES[0].solution}</p>
                      </div>

                      <div className="flex items-center justify-between text-xs font-semibold text-brand-blue pt-2">
                        <span className="text-[#00C4B7] uppercase tracking-wide">Client: {CASE_STUDIES[0].client}</span>
                        <span className="text-brand-pear">{CASE_STUDIES[0].metrics}</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Block 3: Additional Case Studies */}
                <section id="case-additional" className="space-y-6">
                  <h3 className="font-display font-medium text-xl text-brand-blue">Additional Success Dossiers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {CASE_STUDIES.slice(1).map(cs => (
                      <div key={cs.id} className="bg-white p-6 border border-brand-cloudy/30 rounded-lg space-y-3 shadow-sm">
                        <span className="text-[10px] font-bold uppercase text-brand-orange">{cs.industry}</span>
                        <h4 className="font-display font-bold text-sm text-brand-blue">{cs.title}</h4>
                        <p className="text-xs text-brand-dusk leading-relaxed">{cs.description}</p>
                        <div className="p-3 bg-[#FAF9F5] rounded text-xs text-brand-dusk">
                          <p><strong>Metrics:</strong> <span className="font-semibold text-brand-blue">{cs.metrics}</span></p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}


            {/* ========================================================
                ROUTE: TESTIMONIALS (/testimonials)
                ======================================================== */}
            {currentPath === '/testimonials' && (
              <>
                <section id="testimonials-header" className="max-w-3xl mx-auto text-center space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-topaz">Client Experience</span>
                  <h2 className="font-display font-medium text-3xl md:text-4xl text-brand-blue">Read Testimonials from Satisfied Clients</h2>
                  <p className="text-sm text-brand-dusk leading-relaxed">
                    Our clients include global diagnostics giants, innovative medtech startups, and leading national healthcare research networks. Discover why they choose the Scandinavian precision of IQzyme.
                  </p>
                </section>

                {/* Testimonial Blocks */}
                <section id="testimonials-quotes" className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {TESTIMONIALS.map((t) => (
                      <div key={t.id} className="bg-white p-6 border border-brand-cloudy/30 rounded-lg shadow-sm space-y-4 relative flex flex-col justify-between">
                        <span className="absolute right-4 top-4 text-4xl font-serif text-brand-cloudy/10">“</span>
                        <div className="space-y-3 relative z-10">
                          <div className="flex gap-1 text-brand-orange">
                            {[...Array(t.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                          </div>
                          <p className="font-serif italic text-xs text-brand-blue leading-relaxed">"{t.quote}"</p>
                        </div>
                        <div className="flex items-center gap-3 pt-4 border-t border-[#FAF9F5]">
                          <img src={t.avatar} alt={t.author} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                          <div>
                            <h4 className="font-display font-bold text-xs text-brand-blue">{t.author}</h4>
                            <p className="text-[10px] text-brand-dusk">{t.role}, <span className="font-medium text-brand-topaz">{t.company}</span></p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section id="testimonials-cta" className="text-center pt-4">
                  <div className="space-y-3">
                    <h4 className="font-display font-semibold text-sm text-brand-blue">Wishes to secure absolute regulatory safety?</h4>
                    <button onClick={() => handleNavigate('/book-consultation')} className="px-6 h-11 bg-[#99CE43] text-brand-blue font-bold text-xs uppercase tracking-wider rounded shadow hover:bg-[#86b53b] hover:scale-102 transition-all cursor-pointer">
                      Request Consultation Audit
                    </button>
                  </div>
                </section>
              </>
            )}


            {/* ========================================================
                ROUTE: NEWS (/news)
                ======================================================== */}
            {currentPath === '/news' && (
              <>
                <section id="news-header" className="max-w-3xl mx-auto text-center space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-topaz">Company Updates</span>
                  <h2 className="font-display font-medium text-3xl md:text-4xl text-brand-blue">IQzyme Press & Insights</h2>
                  <p className="text-sm text-brand-dusk leading-relaxed">
                    Stay informed with our latest administrative milestones, technology updates, and regional compliance developments.
                  </p>
                </section>

                {/* Block 2: Recent News */}
                <section id="news-recent" className="space-y-6">
                  {NEWS_ITEMS.map((news) => (
                    <div key={news.id} className="bg-white border border-brand-cloudy/30 p-6 rounded-lg shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
                      <div className="shrink-0 md:w-36 space-y-1">
                        <span className="text-[10px] font-bold uppercase text-brand-topaz bg-brand-topaz/10 px-2 py-0.5 rounded">{news.category}</span>
                        <p className="text-xs text-brand-dusk font-mono">{news.date}</p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-display font-bold text-base text-brand-blue">{news.title}</h3>
                        <p className="text-xs text-brand-dusk leading-relaxed">{news.summary}</p>
                        <p className="text-[11px] text-brand-cloudy leading-relaxed mt-2">{news.content}</p>
                      </div>
                    </div>
                  ))}
                </section>
              </>
            )}


            {/* ========================================================
                ROUTE: EVENTS (/events)
                ======================================================== */}
            {currentPath === '/events' && (
              <>
                <section id="events-header" className="max-w-3xl mx-auto text-center space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#00C4B7]">Corporate Schedule</span>
                  <h2 className="font-display font-medium text-3xl md:text-4xl text-[#2D3A55]">Upcoming Marketing & Regulatory Events</h2>
                  <p className="text-sm text-brand-dusk leading-relaxed">
                    Register and join our highly focused medical writing workshops, EU IVDR gap bootcamp webinars, and visit our live booth at the next global medical tech expo.
                  </p>
                </section>

                {/* Block 2: Featured Events */}
                <section id="events-featured" className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {EVENTS.map(ev => (
                    <div key={ev.id} className="bg-white border border-brand-cloudy/30 p-6 rounded-lg shadow-sm space-y-4 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                          <span className="text-brand-orange">{ev.type}</span>
                          <span className="text-brand-dusk font-mono">{ev.date}</span>
                        </div>
                        <h4 className="font-display font-bold text-sm text-brand-blue">{ev.title}</h4>
                        <p className="text-xs text-brand-dusk leading-relaxed">{ev.description}</p>
                      </div>
                      <div className="pt-4 border-t border-brand-cloudy/20 flex justify-between items-center">
                        <span className="text-xs font-mono text-brand-topaz">{ev.time}</span>
                        <button onClick={() => handleNavigate('/book-consultation')} className="text-xs font-bold text-brand-blue hover:underline cursor-pointer">Register Ticket →</button>
                      </div>
                    </div>
                  ))}
                </section>

                {/* Block 3: Event Schedule */}
                <section id="events-schedule" className="space-y-4">
                  <h3 className="font-display font-medium text-lg text-brand-blue">Detailed Webinar & Bootcamps Grid</h3>
                  <div className="bg-white border border-brand-cloudy/30 rounded-lg overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#FAF9F5] border-b border-brand-cloudy/30 text-brand-blue font-semibold">
                          <th className="p-4">Target Session Stream</th>
                          <th className="p-4">Geographic Coordinates / Type</th>
                          <th className="p-4">Date & Time</th>
                          <th className="p-4 text-right">Seat Availability</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-cloudy/20 text-brand-dusk">
                        <tr>
                          <td className="p-4 font-semibold text-brand-blue">Mastering EU IVDR Dossier Compilation</td>
                          <td className="p-4">Digital Live Broadcast</td>
                          <td className="p-4">July 18, 2026 @ 14:00 CET</td>
                          <td className="p-4 text-right text-brand-orange font-bold">14 Seats Left</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-semibold text-brand-blue">CDSCO Class C Orthopedic Import Standards</td>
                          <td className="p-4">Digital Live Broadcast</td>
                          <td className="p-4">August 05, 2026 @ 11:00 CET</td>
                          <td className="p-4 text-right text-brand-pear font-bold">Seats Open</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            )}


            {/* ========================================================
                ROUTE: BLOG (/blog)
                ======================================================== */}
            {currentPath === '/blog' && (
              <>
                <section id="blog-header" className="max-w-3xl mx-auto text-center space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-topaz">Advisory Insights</span>
                  <h2 className="font-display font-medium text-3xl md:text-4xl text-brand-blue">IQzyme Blog - Insights</h2>
                  <p className="text-sm text-brand-dusk leading-relaxed">
                    Highly detailed step-by-step walk-throughs of regulatory requirements compiled by active medical device auditors and B2B life science content strategists.
                  </p>
                </section>

                {/* Block 2: Recent Blog Posts */}
                {loadingBlogs && dynamicBlogs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 w-full space-y-3 col-span-1 md:col-span-3">
                    <div className="w-8 h-8 border-2 border-[#00C4B7] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs text-brand-dusk font-medium">Loading Advisory insights secure catalog...</p>
                  </div>
                ) : (
                  <section id="blog-posts" className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[...dynamicBlogs, ...BLOG_POSTS].map(post => (
                      <div key={post.id} className="bg-white border border-brand-cloudy/30 rounded-lg overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div>
                          <img src={post.image} alt={post.title} className="w-full h-44 object-cover" referrerPolicy="no-referrer" />
                          <div className="p-5 space-y-2">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-brand-topaz bg-brand-topaz/10 px-2 py-0.5 rounded">{post.category}</span>
                            <h4 className="font-display font-bold text-sm text-brand-blue leading-tight">{post.title}</h4>
                            <p className="text-[11px] text-brand-dusk font-mono">By {post.author} — {post.readTime}</p>
                            <p className="text-xs text-brand-dusk leading-relaxed pt-2 whitespace-pre-wrap line-clamp-4">{post.excerpt || post.content}</p>
                          </div>
                        </div>
                        <div className="p-5 pt-0 border-t border-[#FAF9F5] flex justify-between items-center text-xs text-brand-cloudy">
                          <span>Published: {post.date}</span>
                          <button onClick={() => handleNavigate('/contact-us')} className="font-bold text-[#00C4B7] hover:underline cursor-pointer">Enquire More →</button>
                        </div>
                      </div>
                    ))}
                  </section>
                )}
              </>
            )}


            {/* ========================================================
                ROUTE: FAQ (/faq)
                ======================================================== */}
            {currentPath === '/faq' && (
              <>
                <section id="faq-header" className="max-w-3xl mx-auto text-center space-y-4 animate-fade-in">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#00C4B7]">
                    Regulatory Intelligence Hub
                  </span>
                  <h2 className="font-display font-medium text-3xl md:text-5xl text-brand-blue tracking-tight">
                    Medical Device Regulatory FAQs
                  </h2>
                  <p className="text-sm md:text-base text-brand-dusk leading-relaxed max-w-2xl mx-auto">
                    Answers to key questions on medical device regulatory affairs, FDA 510(k), EU MDR compliance, ISO 13485 certification, CE Marking, SaMD regulation and global market access.
                  </p>
                </section>

                {/* FAQ Interactive Controls */}
                <section id="faq-controls" className="max-w-4xl mx-auto space-y-6">
                  {/* Search Bar */}
                  <div className="relative max-w-xl mx-auto">
                    <input
                      type="text"
                      placeholder="Search FAQs (e.g., EU MDR, 510k, ISO 13485)..."
                      value={faqSearch}
                      onChange={(e) => setFaqSearch(e.target.value)}
                      className="w-full h-12 pl-11 pr-10 bg-white border border-brand-cloudy/40 rounded-2xl text-xs text-brand-blue placeholder-brand-dusk/50 focus:outline-none focus:border-[#00C4B7] focus:ring-1 focus:ring-[#00C4B7] shadow-sm transition-all"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dusk/60">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                    </div>
                    {faqSearch && (
                      <button
                        onClick={() => setFaqSearch('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-dusk/50 hover:text-brand-blue text-xs font-bold cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex flex-wrap justify-center gap-2">
                    {['all', 'EU MDR & IVDR', 'US FDA', 'Quality & QMS', 'Global Access', 'SaMD & Digital Health', 'WHO-PQ'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setFaqCategoryFilter(cat);
                          setFaqExpandedKey(null);
                        }}
                        className={`px-4 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                          faqCategoryFilter === cat
                            ? 'bg-brand-blue text-white border-brand-blue shadow-sm'
                            : 'bg-white text-brand-blue border-brand-cloudy/30 hover:border-[#00C4B7]'
                        }`}
                      >
                        {cat === 'all' ? 'All Questions' : cat}
                      </button>
                    ))}
                  </div>
                </section>

                {/* FAQ Answers List */}
                <section id="faq-questions-list" className="max-w-3xl mx-auto space-y-4">
                  {(() => {
                    const filteredFaqs = FAQS.filter(faq => {
                      const matchesSearch = faq.question.toLowerCase().includes(faqSearch.toLowerCase()) || 
                                            faq.answer.toLowerCase().includes(faqSearch.toLowerCase()) ||
                                            faq.category.toLowerCase().includes(faqSearch.toLowerCase());
                      const matchesCategory = faqCategoryFilter === 'all' || faq.category === faqCategoryFilter;
                      return matchesSearch && matchesCategory;
                    });

                    if (filteredFaqs.length === 0) {
                      return (
                        <div className="text-center py-12 bg-white border border-brand-cloudy/20 rounded-2xl p-8 space-y-4 shadow-sm max-w-xl mx-auto">
                          <p className="text-sm font-medium text-brand-blue">
                            No FAQs found matching your query: "{faqSearch}"
                          </p>
                          <p className="text-xs text-brand-dusk leading-relaxed">
                            Try adjusting your filters, searching for alternate terms, or contact our consultants directly for custom guidance.
                          </p>
                          <button
                            onClick={() => {
                              setFaqSearch('');
                              setFaqCategoryFilter('all');
                            }}
                            className="px-4 py-2 bg-[#99CE43] hover:bg-[#86b53b] text-brand-blue font-bold text-xs uppercase tracking-wider rounded shadow transition-all cursor-pointer"
                          >
                            Reset All Filters
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between text-xs text-brand-dusk border-b border-brand-cloudy/20 pb-3 px-1">
                          <span>Showing <strong>{filteredFaqs.length}</strong> regulatory answers</span>
                          {faqCategoryFilter !== 'all' && (
                            <span>Category: <strong>{faqCategoryFilter}</strong></span>
                          )}
                        </div>
                        {filteredFaqs.map((faq, idx) => {
                          const isExpanded = faqExpandedKey === faq.question;
                          return (
                            <div key={idx} className="border border-brand-cloudy/30 rounded-2xl bg-white overflow-hidden shadow-sm hover:border-brand-cloudy/50 transition-all">
                              <button
                                onClick={() => setFaqExpandedKey(isExpanded ? null : faq.question)}
                                className="w-full text-left p-5 flex items-start justify-between gap-4 text-xs md:text-sm font-bold text-brand-blue bg-[#FAF9F5]/20 hover:bg-[#FAF9F5]/60 transition-colors cursor-pointer"
                              >
                                <div className="space-y-1.5 flex-1 pr-2">
                                  <span className="text-[10px] font-mono font-bold text-[#00C4B7] bg-[#00C4B7]/10 px-2 py-0.5 rounded uppercase tracking-wider">
                                    {faq.category}
                                  </span>
                                  <span className="block mt-1 leading-snug">{faq.question}</span>
                                </div>
                                <span className="text-base text-brand-blue/60 select-none pt-2">
                                  {isExpanded ? '−' : '+'}
                                </span>
                              </button>
                              {isExpanded && (
                                <div className="p-5 border-t border-brand-cloudy/20 text-xs md:text-sm text-brand-dusk leading-relaxed bg-[#FAF9F5]/10 animate-fade-in font-normal">
                                  {faq.answer}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </section>

                {/* Secondary Call to Action */}
                <div className="max-w-3xl mx-auto pt-8 animate-fade-in">
                  <SecondaryCTA onNavigate={handleNavigate} />
                </div>
              </>
            )}


            {/* ========================================================
                ROUTE: SEO STRATEGY (/seo-strategy)
                ======================================================== */}
            {currentPath === '/seo-strategy' && (
              <>
                {/* Section 1: Hero */}
                <section id="seo-hero" className="max-w-4xl mx-auto text-center space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-topaz font-mono bg-brand-topaz/10 px-3 py-1 rounded-full">
                    Organic Performance Blueprint
                  </span>
                  <h2 className="font-display font-medium text-3xl md:text-5xl text-brand-blue tracking-tight leading-tight">
                    MedTech B2B SEO &amp; Organic Authority Strategy
                  </h2>
                  <p className="text-sm md:text-base text-brand-dusk leading-relaxed max-w-2xl mx-auto">
                    A comprehensive, interactive roadmap outlining our Core Keyword architecture, E-E-A-T reinforcement framework, and technical SEO schema for <strong>IQZYME MEDTECH PVT. LTD.</strong>
                  </p>
                </section>

                {/* Section 2: Core Keyword Strategy */}
                <section id="seo-keywords-section" className="bg-white border border-brand-cloudy/30 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-cloudy/20 pb-6">
                    <div>
                      <h3 className="font-display font-semibold text-lg md:text-xl text-brand-blue flex items-center gap-2">
                        <TrendingUp size={20} className="text-[#00C4B7]" />
                        <span>1. Core Keyword Strategy</span>
                      </h3>
                      <p className="text-xs text-brand-dusk mt-1">
                        Targeting high-intent, location-specific, and competitive terms for CDSCO, WHO PQ, and ISO 13485 in India.
                      </p>
                    </div>
                    
                    {/* Keyword Categorizer Filters */}
                    <div className="flex flex-wrap gap-1.5">
                      {(['all', 'primary', 'secondary', 'longtail'] as const).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSeoKeywordFilter(cat)}
                          className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                            seoKeywordFilter === cat
                              ? 'bg-brand-blue text-white'
                              : 'bg-[#FAF9F5] text-brand-blue hover:bg-brand-cloudy/10 border border-brand-cloudy/20'
                          }`}
                        >
                          {cat === 'all' ? 'All Keywords' : `${cat} keywords`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Search Bar for Keyword Strategy */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search interactive keywords database (e.g., 'CDSCO', 'WHO', 'LIMS')..."
                      value={seoSearchQuery}
                      onChange={(e) => setSeoSearchQuery(e.target.value)}
                      className="w-full h-11 pl-4 pr-10 text-xs bg-[#FAF9F5] border border-brand-cloudy/30 rounded focus:outline-none focus:border-[#00C4B7] text-brand-blue font-medium"
                    />
                    <span className="absolute right-3.5 top-3.5 text-xs text-brand-cloudy font-mono font-bold">
                      {
                        SEO_KEYWORDS.filter(k => 
                          (seoKeywordFilter === 'all' || k.type === seoKeywordFilter) &&
                          k.term.toLowerCase().includes(seoSearchQuery.toLowerCase())
                        ).length
                      } Found
                    </span>
                  </div>

                  {/* Keywords Grid list */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {SEO_KEYWORDS.filter(k => 
                      (seoKeywordFilter === 'all' || k.type === seoKeywordFilter) &&
                      k.term.toLowerCase().includes(seoSearchQuery.toLowerCase())
                    ).map((k, idx) => (
                      <div 
                        key={idx} 
                        className="bg-[#FAF9F5]/40 border border-brand-cloudy/20 hover:border-brand-topaz/40 rounded-xl p-5 space-y-3 transition-colors flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                              k.type === 'primary' 
                                ? 'bg-[#99CE43]/10 text-[#86b53b] border border-[#99CE43]/20' 
                                : k.type === 'secondary'
                                ? 'bg-[#00C4B7]/10 text-[#00b0a4] border border-[#00C4B7]/20'
                                : 'bg-brand-topaz/10 text-brand-topaz border border-brand-topaz/20'
                            }`}>
                              {k.type}
                            </span>
                            <span className="text-[10px] font-semibold text-brand-dusk font-mono">
                              Vol: {k.volume}
                            </span>
                          </div>
                          <h4 className="font-display font-bold text-xs text-brand-blue leading-tight selection:bg-brand-topaz/20">
                            "{k.term}"
                          </h4>
                          <p className="text-[11px] text-brand-dusk leading-relaxed">
                            {k.desc}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-brand-cloudy/10 flex items-center justify-between text-[10px] font-mono text-brand-cloudy">
                          <span>Intent: <strong>{k.intent}</strong></span>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(k.term);
                              alert(`Copied keyword: "${k.term}"`);
                            }}
                            className="text-brand-orange hover:underline font-bold cursor-pointer"
                          >
                            Copy Tag
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Section 3: E-E-A-T Pillars */}
                <section id="seo-eeat-section" className="bg-white border border-brand-cloudy/30 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
                  <div className="border-b border-brand-cloudy/20 pb-6">
                    <h3 className="font-display font-semibold text-lg md:text-xl text-brand-blue flex items-center gap-2">
                      <Shield size={20} className="text-brand-pear" />
                      <span>2. E-E-A-T Authority Framework</span>
                    </h3>
                    <p className="text-xs text-brand-dusk mt-1">
                      Experience, Expertise, Authoritativeness, and Trustworthiness elements highlighting IQzyme's elite credentials.
                    </p>
                  </div>

                  {/* Interactive Pillar Selector Tabs */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {(['all', 'experience', 'expertise', 'authority', 'trust'] as const).map((pillar) => (
                      <button
                        key={pillar}
                        onClick={() => setSeoEeatPillar(pillar)}
                        className={`py-2 px-3 rounded text-xs font-semibold capitalize transition-all cursor-pointer text-center border ${
                          seoEeatPillar === pillar
                            ? 'bg-[#00C4B7] text-white border-[#00C4B7] shadow-sm'
                            : 'bg-white text-brand-blue border-brand-cloudy/30 hover:bg-[#FAF9F5]'
                        }`}
                      >
                        {pillar === 'all' ? 'All Pillars' : pillar}
                      </button>
                    ))}
                  </div>

                  {/* EEAT Details list */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(seoEeatPillar === 'all' || seoEeatPillar === 'experience') && (
                      <div className="p-5 border border-brand-cloudy/20 rounded-xl space-y-3 bg-[#FAF9F5]/20">
                        <div className="flex items-center gap-2 text-[#99CE43]">
                          <Award size={18} />
                          <h4 className="font-display font-bold text-sm text-brand-blue uppercase tracking-wider">Experience (Proven Record)</h4>
                        </div>
                        <ul className="text-xs text-brand-dusk space-y-2.5 list-disc pl-4 leading-relaxed">
                          <li><strong>11+ Years of Active Audits:</strong> Led by Principal Consultant <strong>Selma S</strong> (B.Tech Biomedical), navigating over 150 complex medical device submissions.</li>
                          <li><strong>Turnkey Lab Deployments:</strong> Proven industrial infrastructure project design experience spearheaded by <strong>Mr. Jino Poulose</strong>.</li>
                          <li><strong>In-house Scientific Audits:</strong> Hands-on laboratory training, regulatory gap assessment, and mockup regulatory audit programs.</li>
                        </ul>
                      </div>
                    )}

                    {(seoEeatPillar === 'all' || seoEeatPillar === 'expertise') && (
                      <div className="p-5 border border-brand-cloudy/20 rounded-xl space-y-3 bg-[#FAF9F5]/20">
                        <div className="flex items-center gap-2 text-brand-topaz">
                          <Cpu size={18} />
                          <h4 className="font-display font-bold text-sm text-brand-blue uppercase tracking-wider">Expertise (Technical Prowess)</h4>
                        </div>
                        <ul className="text-xs text-brand-dusk space-y-2.5 list-disc pl-4 leading-relaxed">
                          <li><strong>Clinical Supervision:</strong> Highly authoritative medical review panel led by <strong>Dr. P. S. Chandranand</strong> (Consulting Pediatric Cardiologist, 25+ Years Experience).</li>
                          <li><strong>ISO 13485:2016 Lead Auditors:</strong> Team staffed with BSI-trained lead auditors ensuring rigorous quality systems.</li>
                          <li><strong>SUGAM Portal Mastery:</strong> Real execution expertise for online submissions of Form MD-15, MD-42, and manufacturing licensing.</li>
                        </ul>
                      </div>
                    )}

                    {(seoEeatPillar === 'all' || seoEeatPillar === 'authority') && (
                      <div className="p-5 border border-brand-cloudy/20 rounded-xl space-y-3 bg-[#FAF9F5]/20">
                        <div className="flex items-center gap-2 text-[#00C4B7]">
                          <CheckCircle size={18} />
                          <h4 className="font-display font-bold text-sm text-brand-blue uppercase tracking-wider">Authoritativeness (Sector Eminence)</h4>
                        </div>
                        <ul className="text-xs text-brand-dusk space-y-2.5 list-disc pl-4 leading-relaxed">
                          <li><strong>Prestigious Ecosystem Partners:</strong> Affiliations with incubator programs at <strong>DBT-BIRAC</strong>, <strong>AMTZ Vizag</strong>, <strong>CCAMP Bangalore</strong>, and <strong>Venture Center Pune</strong>.</li>
                          <li><strong>NIB-Compliant Operations:</strong> Aligning local diagnostics kits with National Institute of Biologicals standards.</li>
                          <li><strong>100% Success Rate:</strong> Zero regulatory dossier rejections across orthopedics, dental implants, and IVD submissions.</li>
                        </ul>
                      </div>
                    )}

                    {(seoEeatPillar === 'all' || seoEeatPillar === 'trust') && (
                      <div className="p-5 border border-brand-cloudy/20 rounded-xl space-y-3 bg-[#FAF9F5]/20">
                        <div className="flex items-center gap-2 text-brand-orange">
                          <UserCheck size={18} />
                          <h4 className="font-display font-bold text-sm text-brand-blue uppercase tracking-wider">Trustworthiness (B2B Assurance)</h4>
                        </div>
                        <ul className="text-xs text-brand-dusk space-y-2.5 list-disc pl-4 leading-relaxed">
                          <li><strong>Registered Corporate Entity:</strong> Operating as <strong>IQZYME MEDTECH PVT. LTD.</strong> with complete transparent governance.</li>
                          <li><strong>Regulatory Transparency:</strong> Complete alignment with the CDSCO Medical Devices Rules (MDR) 2017 amendments.</li>
                          <li><strong>Secure Data Integrity:</strong> Encrypted client portal protecting sensitive technical files, raw testing data, and formulation sheets.</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </section>

                {/* Section 4: On-Page SEO Sandbox & SERP Preview */}
                <section id="seo-onpage-section" className="bg-white border border-brand-cloudy/30 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
                  <div className="border-b border-brand-cloudy/20 pb-6">
                    <h3 className="font-display font-semibold text-lg md:text-xl text-brand-blue flex items-center gap-2">
                      <Layers size={20} className="text-brand-orange" />
                      <span>3. On-Page SEO Best Practices &amp; Live Sandbox</span>
                    </h3>
                    <p className="text-xs text-brand-dusk mt-1">
                      Configure dynamic metadata title and description and preview how search engines will render our B2B listings.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Sandbox Controls */}
                    <div className="space-y-4">
                      <h4 className="font-display font-bold text-xs uppercase tracking-wider text-brand-blue">Interactive Metadata Configurator</h4>
                      
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-brand-blue uppercase tracking-wider block">SEO Title Tag (Recommended: 50-60 characters)</label>
                          <input
                            type="text"
                            value={seoMetaTitleInput}
                            onChange={(e) => setSeoMetaTitleInput(e.target.value)}
                            className="w-full p-3 text-xs bg-[#FAF9F5] border border-brand-cloudy/30 rounded focus:outline-none focus:border-brand-orange font-medium text-brand-blue"
                          />
                          <p className="text-[10px] text-brand-cloudy font-mono text-right">{seoMetaTitleInput.length} chars</p>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-brand-blue uppercase tracking-wider block">Meta Description Tag (Recommended: 150-160 characters)</label>
                          <textarea
                            rows={3}
                            value={seoMetaDescInput}
                            onChange={(e) => setSeoMetaDescInput(e.target.value)}
                            className="w-full p-3 text-xs bg-[#FAF9F5] border border-brand-cloudy/30 rounded focus:outline-none focus:border-brand-orange font-medium text-brand-blue leading-relaxed"
                          />
                          <p className="text-[10px] text-brand-cloudy font-mono text-right">{seoMetaDescInput.length} chars</p>
                        </div>
                      </div>

                      {/* Best Practice Compliance Checklist */}
                      <div className="bg-[#FAF9F5] border border-brand-cloudy/20 rounded-lg p-4 space-y-2">
                        <h5 className="text-[10px] font-bold text-brand-blue uppercase tracking-wider">Semantic On-Page Checklist</h5>
                        <div className="space-y-2 text-xs text-brand-dusk">
                          <div className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked className="accent-[#00C4B7]" />
                            <span>Strict H1 element hierarchy: Exactly 1 H1 containing primary high-intent keywords per page.</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked className="accent-[#00C4B7]" />
                            <span>Image alt tags containing "IQZYME MEDTECH" and targeted device class descriptions.</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked className="accent-[#00C4B7]" />
                            <span>Self-referencing canonical tag on all dynamic and query parameter URL endpoints.</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Google SERP Live Preview */}
                    <div className="space-y-4">
                      <h4 className="font-display font-bold text-xs uppercase tracking-wider text-brand-blue">Live Search Engine Result Preview</h4>
                      
                      <div className="bg-white border border-[#e1e3e6] rounded-xl p-6 shadow-md space-y-2 font-sans text-[#1a0dab]">
                        <div className="text-[11px] text-[#202124] flex items-center gap-1 font-sans">
                          <span>https://www.iqzyme.com</span>
                          <span className="text-[#5f6368] font-semibold">› services</span>
                        </div>
                        <h3 className="font-medium text-lg leading-tight hover:underline cursor-pointer text-[#1a0dab] selection:bg-brand-topaz/20">
                          {seoMetaTitleInput || "Please enter an SEO title..."}
                        </h3>
                        <p className="text-[13px] text-[#4d5156] leading-relaxed font-sans selection:bg-brand-topaz/20">
                          <span className="text-[#70757a] font-mono font-medium">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} — </span>
                          {seoMetaDescInput || "Please enter an optimized meta description..."}
                        </p>
                        <div className="pt-2 flex gap-4 text-xs text-[#1a0dab] font-sans font-medium">
                          <span className="hover:underline cursor-pointer">CDSCO SUGAM Portal</span>
                          <span className="hover:underline cursor-pointer">ISO 13485 QMS Setup</span>
                          <span className="hover:underline cursor-pointer">WHO Prequalification</span>
                        </div>
                      </div>

                      <div className="p-4 bg-brand-orange/5 border border-brand-orange/20 rounded-lg text-xs text-brand-dusk leading-relaxed">
                        <strong>E-E-A-T Optimization Advice:</strong> Google values clinical accuracy. Our titles and content feature direct expert branding ("IQzyme Medtech") and exact regulatory standards (e.g., ISO 13485) to signal high authority immediately.
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 5: Content Marketing Clusters */}
                <section id="seo-content-section" className="bg-white border border-brand-cloudy/30 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
                  <div className="border-b border-brand-cloudy/20 pb-6">
                    <h3 className="font-display font-semibold text-lg md:text-xl text-brand-blue flex items-center gap-2">
                      <BookOpen size={20} className="text-[#00C4B7]" />
                      <span>4. Content Marketing &amp; Authority Cluster Hub</span>
                    </h3>
                    <p className="text-xs text-brand-dusk mt-1">
                      Targeting high-volume, instructional search queries with deep authority pillar guides.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Cluster 1 */}
                    <div className="bg-[#FAF9F5] rounded-xl p-5 border border-brand-cloudy/30 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <span className="text-[9px] font-bold font-mono uppercase bg-brand-topaz/10 text-brand-topaz px-2 py-0.5 rounded">Pillar 1: CDSCO Rules</span>
                        <h4 className="font-display font-bold text-sm text-brand-blue">Ultimate CDSCO SUGAM Regulatory Path</h4>
                        <p className="text-xs text-brand-dusk leading-relaxed">
                          Comprehensive index guiding orthopedic implant, cardiac stent, and diagnostic instrument manufacturers step-by-step through Class A to D licensing.
                        </p>
                      </div>
                      <button onClick={() => handleNavigate('/regulatory-services')} className="text-xs font-bold text-brand-orange hover:underline text-left">View Guided Pillar →</button>
                    </div>

                    {/* Cluster 2 */}
                    <div className="bg-[#FAF9F5] rounded-xl p-5 border border-brand-cloudy/30 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <span className="text-[9px] font-bold font-mono uppercase bg-[#00C4B7]/10 text-[#00C4B7] px-2 py-0.5 rounded">Pillar 2: Quality Systems</span>
                        <h4 className="font-display font-bold text-sm text-brand-blue">ISO 13485 eQMS Documentation</h4>
                        <p className="text-xs text-brand-dusk leading-relaxed">
                          A collection of downloadable checklists, quality manual structures, and LIMS validation guidelines specifically calibrated to Indian CDSCO audits.
                        </p>
                      </div>
                      <button onClick={() => handleNavigate('/quality-services')} className="text-xs font-bold text-brand-orange hover:underline text-left">View Guided Pillar →</button>
                    </div>

                    {/* Cluster 3 */}
                    <div className="bg-[#FAF9F5] rounded-xl p-5 border border-brand-cloudy/30 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <span className="text-[9px] font-bold font-mono uppercase bg-[#99CE43]/10 text-[#86b53b] px-2 py-0.5 rounded">Pillar 3: WHO PQ</span>
                        <h4 className="font-display font-bold text-sm text-brand-blue">WHO IVD Prequalification Dossier Compilation</h4>
                        <p className="text-xs text-brand-dusk leading-relaxed">
                          Meticulous advice on navigating WHO Prequalification criteria, sample dossier checklists, and active clinical validation setup.
                        </p>
                      </div>
                      <button onClick={() => handleNavigate('/book-consultation')} className="text-xs font-bold text-brand-orange hover:underline text-left">Request Technical File →</button>
                    </div>
                  </div>

                  {/* Interactive Lead-Magnet Container */}
                  <div className="bg-brand-blue/5 border border-brand-cloudy/20 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-1.5 max-w-xl">
                      <h4 className="font-display font-bold text-xs text-brand-blue uppercase tracking-wider">Premium Resource Download (E-E-A-T Signal)</h4>
                      <h3 className="font-display font-medium text-sm text-brand-blue">Download: Step-by-Step Guide to WHO Prequalification for IVD Manufacturers</h3>
                      <p className="text-xs text-brand-dusk">Establish authority by capturing B2B leads. Over 1,200 Indian medtech regulatory affairs managers have downloaded this guide.</p>
                    </div>

                    {seoLeadSubmitted ? (
                      <div className="p-4 bg-[#99CE43]/15 border border-[#99CE43]/30 rounded text-center md:text-right shrink-0">
                        <p className="text-xs font-semibold text-brand-blue">✓ Download File Initiated</p>
                        <p className="text-[10px] text-brand-dusk">Check your corporate inbox for the PDF file link.</p>
                      </div>
                    ) : (
                      <div className="flex w-full md:w-auto gap-2 shrink-0">
                        <input
                          type="email"
                          required
                          value={seoLeadEmail}
                          onChange={(e) => setSeoLeadEmail(e.target.value)}
                          placeholder="your.email@company.com"
                          className="h-10 px-3 text-xs bg-white border border-brand-cloudy/30 rounded focus:outline-none text-brand-blue font-medium min-w-[200px]"
                        />
                        <button 
                          onClick={() => {
                            if (seoLeadEmail) setSeoLeadSubmitted(true);
                          }}
                          className="h-10 px-4 bg-[#00C4B7] hover:bg-[#00b0a4] text-white rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          Download PDF
                        </button>
                      </div>
                    )}
                  </div>
                </section>

                {/* Section 6: Tech Tools & Local SEO */}
                <section id="seo-tools-section" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Grid 1: Tech Stack */}
                  <div className="bg-white border border-brand-cloudy/30 rounded-2xl p-6 space-y-4 shadow-sm">
                    <h3 className="font-display font-semibold text-base text-brand-blue flex items-center gap-2">
                      <Settings size={18} className="text-[#00C4B7]" />
                      <span>5. Advanced Technical SEO Tooling</span>
                    </h3>
                    <p className="text-xs text-brand-dusk leading-relaxed">
                      To ensure continuous top positioning, we actively audit and fine-tune our web properties with standard analytical instrumentation:
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-[#FAF9F5] border border-brand-cloudy/20 rounded-lg">
                        <p className="font-bold text-brand-blue text-[11px] uppercase tracking-wider">Ahrefs &amp; SEMrush</p>
                        <p className="text-[10px] text-brand-dusk mt-0.5">Competitor keyword gap analysis and daily backlink audits.</p>
                      </div>
                      <div className="p-3 bg-[#FAF9F5] border border-brand-cloudy/20 rounded-lg">
                        <p className="font-bold text-brand-blue text-[11px] uppercase tracking-wider">GA4 &amp; GSC</p>
                        <p className="text-[10px] text-brand-dusk mt-0.5">Google Search Console monitoring for prompt site indexing.</p>
                      </div>
                      <div className="p-3 bg-[#FAF9F5] border border-brand-cloudy/20 rounded-lg">
                        <p className="font-bold text-brand-blue text-[11px] uppercase tracking-wider">Hotjar / Clarity</p>
                        <p className="text-[10px] text-brand-dusk mt-0.5">UX heatmaps analyzing B2B visitor reading behaviors.</p>
                      </div>
                      <div className="p-3 bg-[#FAF9F5] border border-brand-cloudy/20 rounded-lg">
                        <p className="font-bold text-brand-blue text-[11px] uppercase tracking-wider">JSON-LD Schema</p>
                        <p className="text-[10px] text-brand-dusk mt-0.5">Injecting Structured Rich Snippet Schema for B2B searches.</p>
                      </div>
                    </div>
                  </div>

                  {/* Grid 2: Local SEO Targets */}
                  <div className="bg-white border border-brand-cloudy/30 rounded-2xl p-6 space-y-4 shadow-sm">
                    <h3 className="font-display font-semibold text-base text-brand-blue flex items-center gap-2">
                      <MapPin size={18} className="text-brand-orange" />
                      <span>6. Local SEO Target Geographies</span>
                    </h3>
                    <p className="text-xs text-brand-dusk leading-relaxed">
                      We optimize Google Business profiles and local search parameters corresponding to our 6 key Indian offices:
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
                      <div className="p-2.5 bg-brand-blue/5 border border-brand-cloudy/20 rounded">
                        <span className="text-brand-blue font-display">Cochin HQ</span>
                      </div>
                      <div className="p-2.5 bg-brand-blue/5 border border-brand-cloudy/20 rounded">
                        <span className="text-brand-blue font-display">Bengaluru</span>
                      </div>
                      <div className="p-2.5 bg-brand-blue/5 border border-brand-cloudy/20 rounded">
                        <span className="text-brand-blue font-display">Mumbai</span>
                      </div>
                      <div className="p-2.5 bg-brand-blue/5 border border-brand-cloudy/20 rounded">
                        <span className="text-brand-blue font-display">Delhi NCR</span>
                      </div>
                      <div className="p-2.5 bg-brand-blue/5 border border-brand-cloudy/20 rounded">
                        <span className="text-brand-blue font-display">Coimbatore</span>
                      </div>
                      <div className="p-2.5 bg-brand-blue/5 border border-brand-cloudy/20 rounded">
                        <span className="text-brand-blue font-display">Surat</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-brand-cloudy leading-relaxed mt-2 italic text-center">
                      *Geo-targeted service pages optimize for searches like "Best medical device consultant in Coimbatore / Surat".
                    </p>
                  </div>
                </section>

                {/* Section 7: Interactive Roadmap Timeline */}
                <section id="seo-roadmap-section" className="bg-white border border-brand-cloudy/30 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
                  <div className="border-b border-brand-cloudy/20 pb-6">
                    <h3 className="font-display font-semibold text-lg md:text-xl text-brand-blue flex items-center gap-2">
                      <Clock size={20} className="text-[#00C4B7]" />
                      <span>7. Interactive Implementation Roadmap</span>
                    </h3>
                    <p className="text-xs text-brand-dusk mt-1">
                      Explore the timeline of our SEO execution strategy to transition from audit to sustained rankings.
                    </p>
                  </div>

                  {/* Roadmap Timeline Buttons */}
                  <div className="flex flex-col sm:flex-row justify-between items-stretch gap-2">
                    {[
                      { q: 1, label: "Q1: Technical & Audit", color: "text-[#00C4B7]" },
                      { q: 2, label: "Q2: Keyword Mapping", color: "text-brand-topaz" },
                      { q: 3, label: "Q3: Content Engine", color: "text-brand-orange" },
                      { q: 4, label: "Q4: Authority Scaling", color: "text-[#99CE43]" },
                    ].map((step) => (
                      <button
                        key={step.q}
                        onClick={() => setSeoRoadmapQuarter(step.q)}
                        className={`flex-1 p-3 rounded-lg border text-center transition-all cursor-pointer ${
                          seoRoadmapQuarter === step.q
                            ? 'bg-brand-blue text-white border-brand-blue shadow-md scale-102 font-bold'
                            : 'bg-[#FAF9F5] text-brand-blue border-brand-cloudy/30 hover:bg-brand-cloudy/10 text-xs'
                        }`}
                      >
                        <p className={`text-[10px] font-mono uppercase tracking-widest font-semibold ${seoRoadmapQuarter === step.q ? 'text-[#99CE43]' : step.color}`}>{step.label.split(":")[0]}</p>
                        <p className="text-xs mt-0.5 font-display">{step.label.split(":")[1]}</p>
                      </button>
                    ))}
                  </div>

                  {/* Active Roadmap Step Details */}
                  <div className="p-6 bg-[#FAF9F5] rounded-xl border border-brand-cloudy/30 animate-fade-in space-y-4">
                    {seoRoadmapQuarter === 1 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[#00C4B7]">
                          <Award size={18} />
                          <h4 className="font-display font-bold text-sm text-brand-blue">Quarter 1: Technical SEO Overhaul &amp; SEO Audit</h4>
                        </div>
                        <p className="text-xs text-brand-dusk leading-relaxed">
                          We execute complete technical audits using GSC, eliminating crawl errors, resolving redirect loops, and generating structured JSON-LD organization schema. We optimize Core Web Vitals to guarantee page loads under 1.5 seconds.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
                          <div className="p-3 bg-white border border-brand-cloudy/20 rounded">
                            <p className="font-bold text-brand-blue">Structured Data</p>
                            <p className="text-[10px] text-brand-dusk">Inject Organization &amp; local branch schemas.</p>
                          </div>
                          <div className="p-3 bg-white border border-brand-cloudy/20 rounded">
                            <p className="font-bold text-brand-blue">Mobile Optimization</p>
                            <p className="text-[10px] text-brand-dusk">100% fluid layouts with no clipping.</p>
                          </div>
                          <div className="p-3 bg-white border border-brand-cloudy/20 rounded">
                            <p className="font-bold text-brand-blue">Page Speed Tunings</p>
                            <p className="text-[10px] text-brand-dusk">Lossless compression on all diagrams.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {seoRoadmapQuarter === 2 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-brand-topaz">
                          <Compass size={18} />
                          <h4 className="font-display font-bold text-sm text-brand-blue">Quarter 2: High-Intent Keyword Mapping</h4>
                        </div>
                        <p className="text-xs text-brand-dusk leading-relaxed">
                          We map core high-volume terms like "Medical device regulatory consulting India" to core landing pages, and long-tail terms to our Advisory Blogs. We refine on-page metadata alignment to capture rich snippet answers.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
                          <div className="p-3 bg-white border border-brand-cloudy/20 rounded">
                            <p className="font-bold text-brand-blue">Metadata Alignments</p>
                            <p className="text-[10px] text-brand-dusk">Embed brand &amp; ISO tags into headers.</p>
                          </div>
                          <div className="p-3 bg-white border border-brand-cloudy/20 rounded">
                            <p className="font-bold text-brand-blue">Search Intent Match</p>
                            <p className="text-[10px] text-brand-dusk">Satisfy informational and commercial cues.</p>
                          </div>
                          <div className="p-3 bg-white border border-brand-cloudy/20 rounded">
                            <p className="font-bold text-brand-blue">Landing Optimization</p>
                            <p className="text-[10px] text-brand-dusk">Improve B2B contact conversion rates.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {seoRoadmapQuarter === 3 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-brand-orange">
                          <FileText size={18} />
                          <h4 className="font-display font-bold text-sm text-brand-blue">Quarter 3: E-E-A-T Content Engine Launch</h4>
                        </div>
                        <p className="text-xs text-brand-dusk leading-relaxed">
                          Produce structured advisory guides written by BSI-trained consultants, focusing on complex regulatory topics (WHO IVD PQ, CDSCO Orthopedic guidelines). Update content regularly matching real CDSCO Gazette updates.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
                          <div className="p-3 bg-white border border-brand-cloudy/20 rounded">
                            <p className="font-bold text-brand-blue">Expert Bylines</p>
                            <p className="text-[10px] text-brand-dusk">Highlight director profiles for Selma S. &amp; Sinto Poulose.</p>
                          </div>
                          <div className="p-3 bg-white border border-brand-cloudy/20 rounded">
                            <p className="font-bold text-brand-blue">Whitepaper Hub</p>
                            <p className="text-[10px] text-brand-dusk">Add deep dossiers with PDF lead gates.</p>
                          </div>
                          <div className="p-3 bg-white border border-brand-cloudy/20 rounded">
                            <p className="font-bold text-brand-blue">Regular Updates</p>
                            <p className="text-[10px] text-brand-dusk">Keep articles fresh for latest CDSCO rules.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {seoRoadmapQuarter === 4 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[#99CE43]">
                          <Users size={18} />
                          <h4 className="font-display font-bold text-sm text-brand-blue">Quarter 4: Authority Outreach &amp; Backlink Campaign</h4>
                        </div>
                        <p className="text-xs text-brand-dusk leading-relaxed">
                          Partner with leading life science publications and premium academic research journals. Build healthy, high-authority backlink profiles to cement our "E-E-A-T" trustworthiness signals with Google's Core systems.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
                          <div className="p-3 bg-white border border-brand-cloudy/20 rounded">
                            <p className="font-bold text-brand-blue">B2B Guest Posting</p>
                            <p className="text-[10px] text-brand-dusk">Collaborate with healthcare portals.</p>
                          </div>
                          <div className="p-3 bg-white border border-brand-cloudy/20 rounded">
                            <p className="font-bold text-brand-blue">PR Distributions</p>
                            <p className="text-[10px] text-brand-dusk">Share audit success milestones in media.</p>
                          </div>
                          <div className="p-3 bg-white border border-brand-cloudy/20 rounded">
                            <p className="font-bold text-brand-blue">Ecosystem Alliances</p>
                            <p className="text-[10px] text-brand-dusk">Secure brand citations on government sites.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              </>
            )}


            {/* ========================================================
                ROUTE: REGULATORY SERVICES (/regulatory-services)
                ======================================================== */}
            {currentPath === '/regulatory-services' && (
              <>
                <section className="max-w-3xl mx-auto text-center space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-topaz">Primary Compliance vertical</span>
                  <h2 className="font-display font-medium text-3xl md:text-4xl text-brand-blue">Regulatory Licensing & Filings</h2>
                  <p className="text-sm text-brand-dusk leading-relaxed">
                    We navigate deep administrative processes with global medical agencies on behalf of foreign and local manufacturers.
                  </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Block 1: CDSCO Licensing */}
                  <div className="p-6 bg-white border border-brand-cloudy/30 rounded-lg space-y-4 shadow-sm">
                    <span className="text-xs font-bold uppercase text-brand-pear">India Market Entry</span>
                    <h3 className="font-display font-semibold text-xl text-brand-blue">CDSCO Licensing & Registration</h3>
                    <p className="text-xs text-brand-dusk leading-relaxed">
                      Complete support for SUGAM portal registration, Class A to D orthopedic implants, clinical trial exemptions, and localized Authorized Agent representation. We handle the entire licensing process smoothly.
                    </p>
                  </div>

                  {/* Block 2: CE Marking */}
                  <div className="p-6 bg-white border border-brand-cloudy/30 rounded-lg space-y-4 shadow-sm">
                    <span className="text-xs font-bold uppercase text-[#00C4B7]">European Union Access</span>
                    <h3 className="font-display font-semibold text-xl text-brand-blue">CE Marking (MDR & IVDR)</h3>
                    <p className="text-xs text-brand-dusk leading-relaxed">
                      Securing European CE mark certification under the rigorous MDR (2017/745) and IVDR (2017/746) standards. From technical dossier preparation to clinical evaluation reports (CER).
                    </p>
                  </div>

                  {/* Block 3: US FDA Registration */}
                  <div className="p-6 bg-white border border-brand-cloudy/30 rounded-lg space-y-4 shadow-sm">
                    <span className="text-xs font-bold uppercase text-brand-orange">North American Market</span>
                    <h3 className="font-display font-semibold text-xl text-brand-blue">US FDA 510(k) Registration</h3>
                    <p className="text-xs text-brand-dusk leading-relaxed">
                      Clear pathways to FDA Class I and Class II market clearance. We assist with predicate device determination, gap analyses, and drafting comprehensive pre-market notifications.
                    </p>
                  </div>

                  {/* Block 4: WHO-PQ Consulting */}
                  <div className="p-6 bg-white border border-brand-cloudy/30 rounded-lg space-y-4 shadow-sm">
                    <span className="text-xs font-bold uppercase text-brand-purple">Global Procurement Tracks</span>
                    <h3 className="font-display font-semibold text-xl text-brand-blue">WHO-PQ Consulting</h3>
                    <p className="text-xs text-brand-dusk leading-relaxed">
                      Prequalification advisory to allow diagnostics and pharmaceutical enterprises to bid on massive, high-volume WHO global tenders and international health agency contracts.
                    </p>
                  </div>
                </div>
              </>
            )}


            {/* ========================================================
                ROUTE: QUALITY SERVICES (/quality-services)
                ======================================================== */}
            {currentPath === '/quality-services' && (
              <>
                <section className="max-w-3xl mx-auto text-center space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-topaz">Quality Assurance</span>
                  <h2 className="font-display font-medium text-3xl md:text-4xl text-brand-blue">Audit-Ready Quality Assurance Services</h2>
                  <p className="text-sm text-brand-dusk leading-relaxed">
                    Paperless Quality Management Systems tailored perfectly to active engineering and lab development pipelines.
                  </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Block 1: ISO 13485 */}
                  <div className="p-6 bg-white border border-brand-cloudy/30 rounded-lg space-y-3 shadow-sm">
                    <span className="text-xs font-bold uppercase text-brand-pear">ISO 13485</span>
                    <h3 className="font-display font-bold text-sm text-brand-blue">ISO 13485 QMS Structure</h3>
                    <p className="text-xs text-brand-dusk leading-relaxed">
                      Complete implementation maps, SOP design, and document control systems. We prepare your infrastructure for external registrar certification audits without operational disruptions.
                    </p>
                  </div>

                  {/* Block 2: Audits */}
                  <div className="p-6 bg-white border border-brand-cloudy/30 rounded-lg space-y-3 shadow-sm">
                    <span className="text-xs font-bold uppercase text-[#00C4B7]">Audits</span>
                    <h3 className="font-display font-bold text-sm text-brand-blue">Mock Registrar & Gap Audits</h3>
                    <p className="text-xs text-brand-dusk leading-relaxed">
                      Our certified internal auditors perform comprehensive mock audit gap assessments to discover, log, and resolve compliance non-conformances before actual regulatory visits occur.
                    </p>
                  </div>

                  {/* Block 3: Post Market Surveillance */}
                  <div className="p-6 bg-white border border-brand-cloudy/30 rounded-lg space-y-3 shadow-sm">
                    <span className="text-xs font-bold uppercase text-brand-orange">Surveillance</span>
                    <h3 className="font-display font-bold text-sm text-brand-blue">Post Market Surveillance (PMS)</h3>
                    <p className="text-xs text-brand-dusk leading-relaxed">
                      Continuous, lifecycle clinical feedback managers, Periodic Safety Update Report (PSUR) automated formats, and vigilance files compiled under tight MDR standards.
                    </p>
                  </div>
                </div>
              </>
            )}


            {/* ========================================================
                ROUTE: INFRASTRUCTURE SERVICES (/infrastructure-services)
                ======================================================== */}
            {currentPath === '/infrastructure-services' && (
              <>
                <section className="max-w-3xl mx-auto text-center space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#00C4B7]">Turnkey Projects</span>
                  <h2 className="font-display font-medium text-3xl md:text-4xl text-brand-blue">Turnkey Facilities & Tech Transfers</h2>
                  <p className="text-sm text-brand-dusk leading-relaxed">
                    Establishing state-of-the-art cleanroom manufacturing and laboratory environments in strict accordance with ISO and GMP standards.
                  </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Block 1: Turnkey Projects */}
                  <div className="p-6 bg-white border border-brand-cloudy/30 rounded-lg space-y-3 shadow-sm">
                    <span className="text-xs font-bold uppercase text-brand-pear">Design & Build</span>
                    <h3 className="font-display font-bold text-sm text-brand-blue">Turnkey Projects</h3>
                    <p className="text-xs text-brand-dusk leading-relaxed">
                      Cleanroom design engineering, HVAC configurations, equipment lists, and validation testing according to WHO-GMP standards.
                    </p>
                  </div>

                  {/* Block 2: Tech Transfer */}
                  <div className="p-6 bg-white border border-brand-cloudy/30 rounded-lg space-y-3 shadow-sm">
                    <span className="text-xs font-bold uppercase text-[#00C4B7]">Tech Transfer</span>
                    <h3 className="font-display font-bold text-sm text-brand-blue">Technology Transfer</h3>
                    <p className="text-xs text-brand-dusk leading-relaxed">
                      Seamless process validations, product file migration protocols, and raw material sourcing alignment across global manufacturing hubs.
                    </p>
                  </div>

                  {/* Block 3: Entrepreneurship Support */}
                  <div className="p-6 bg-white border border-brand-cloudy/30 rounded-lg space-y-3 shadow-sm">
                    <span className="text-xs font-bold uppercase text-brand-orange">SME Support</span>
                    <h3 className="font-display font-bold text-sm text-brand-blue">Entrepreneurship Support</h3>
                    <p className="text-xs text-brand-dusk leading-relaxed">
                      Providing medical entrepreneurs with joint-venture strategies, facility leasing guides, and targeted pilot-scale setup reviews.
                    </p>
                  </div>
                </div>
              </>
            )}


            {/* ========================================================
                ROUTE: COOKIES (/cookies)
                ======================================================== */}
            {currentPath === '/cookies' && (
              <section id="cookie-policy-page" className="max-w-3xl mx-auto space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase text-brand-topaz">Statutory Policy</span>
                  <h2 className="font-display font-medium text-3xl text-brand-blue">IQzyme Cookie Policy</h2>
                  <p className="text-xs text-brand-dusk">Last updated: July 02, 2026</p>
                </div>
                
                <div className="bg-white border border-brand-cloudy/30 p-6 md:p-8 rounded-lg shadow-sm space-y-4 text-xs text-brand-dusk leading-relaxed">
                  <p>
                    IQzyme Digital Marketing Portal uses standard, secure cookies and local browser storage engines to remember visitor settings, personalize content streams, and analyze aggregate server traffic.
                  </p>
                  <p><strong>1. Essential Cookies:</strong> Required to enable navigation, routing, and access to secure advisory portals. De-activating these via browser settings may restrict portal functionality.</p>
                  <p><strong>2. Analytics Cookies:</strong> Used purely to understand which regulatory whitepapers or SEO articles are read most frequently, allowing us to publish more precise content. We load analytics scripts only if the user explicitly clicks 'Accept All' on our cookie notification banner.</p>
                </div>
              </section>
            )}


            {/* ========================================================
                ROUTE: 404 ERROR (/404-error)
                ======================================================== */}
            {currentPath === '/404-error' && (
              <section id="not-found-page" className="max-w-3xl mx-auto text-center space-y-6 py-12">
                <span className="text-8xl font-display font-bold text-brand-pear">404</span>
                <div className="space-y-2">
                  <h2 className="font-display font-medium text-2xl text-brand-blue">Dossier File Not Found</h2>
                  <p className="text-xs text-brand-dusk max-w-sm mx-auto leading-relaxed">
                    The specific advisory route, whitepaper report, or page you are looking for has been relocated or is currently undergoing administrative updates.
                  </p>
                </div>
                <button
                  onClick={() => handleNavigate('/')}
                  className="px-6 h-11 bg-[#2D3A55] text-white font-semibold text-xs uppercase tracking-wider rounded hover:bg-[#2D3A55]/90 transition-all cursor-pointer"
                >
                  Return to Home Portal
                </button>
              </section>
            )}


            {/* ========================================================
                ROUTE: OTHER FALLBACKS OR LESS SPECIFIC ROUTES
                ======================================================== */}
            {['/client-success', '/clients', '/training', '/product-services', '/compliance-services', '/medical-devices', '/ivd', '/research-institutions', '/startups', '/exhibitions-national-international'].includes(currentPath) && (
              <section className="max-w-3xl mx-auto space-y-8">
                <div className="text-center space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-topaz">Specialized Advisory Segment</span>
                  <h2 className="font-display font-medium text-3xl text-brand-blue">{currentRoute.label} Services</h2>
                  <p className="text-sm text-brand-dusk leading-relaxed">
                    {currentRoute.meta.description}
                  </p>
                </div>

                {/* Aesthetic Scandinavian Bento Grid detailing the service */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-white border border-brand-cloudy/30 rounded-lg space-y-4 shadow-sm">
                    <h3 className="font-display font-semibold text-lg text-brand-blue">Technical Audit & File Preparation</h3>
                    <p className="text-xs text-brand-dusk leading-relaxed">
                      We perform detailed pre-screening reviews of all device designs, raw material specifications, clinical evidence plans, and B2B keyword indexing metrics before launching client frameworks.
                    </p>
                    <button onClick={() => handleNavigate('/book-consultation')} className="text-xs text-[#00C4B7] hover:underline font-bold flex items-center gap-1 cursor-pointer">
                      <span>Schedule Sandbox Audit</span> →
                    </button>
                  </div>

                  <div className="p-6 bg-[#FAF9F5] border border-brand-cloudy/30 rounded-lg space-y-4 relative overflow-hidden">
                    <h3 className="font-display font-semibold text-lg text-brand-blue">Strategic Lifesciences Authority</h3>
                    <p className="text-xs text-brand-dusk leading-relaxed">
                      Every element of the IQzyme portal works together. Once compliance filings are secure, our digital team deploys target SEO pathways to position your company as a leading regional authority.
                    </p>
                    <button onClick={() => handleNavigate('/contact-us')} className="text-xs text-brand-pear hover:underline font-bold flex items-center gap-1 cursor-pointer">
                      <span>Inquire Securely</span> →
                    </button>
                  </div>
                </div>

                {/* Consultation trigger */}
                <div className="bg-[#2D3A55] text-white p-8 rounded-xl text-center space-y-4">
                  <h3 className="font-display font-semibold text-xl text-white">Need immediate regulatory or marketing assistance?</h3>
                  <button onClick={() => handleNavigate('/book-consultation')} className="px-6 h-11 bg-brand-pear text-brand-blue font-bold text-xs uppercase tracking-wider rounded shadow hover:bg-[#86b53b] transition-all cursor-pointer">
                    Book Advisory Session
                  </button>
                </div>
              </section>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer element */}
      <Footer onNavigate={handleNavigate} />

      {/* Cookie Consent Banner */}
      <CookieBanner onNavigate={handleNavigate} />
    </div>
  );
}
