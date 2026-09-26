/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ROUTES } from '../data';
import { Mail, Phone, MapPin, Linkedin, Twitter, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const handleLinkClick = (path: string) => {
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const corporateLinks = [
    { path: '/', label: 'Home Portal' },
    { path: '/about-us', label: 'Company Profile' },
    { path: '/careers', label: 'Careers & Recruitment' },
    { path: '/contact-us', label: 'Secure Contacts' },
    { path: '/admin', label: 'Administrative Console' },
  ];

  const primaryServices = [
    { path: '/regulatory-services', label: 'CDSCO Licensing & FDA' },
    { path: '/quality-services', label: 'ISO 13485 QMS' },
    { path: '/infrastructure-services', label: 'Turnkey Infrastructure' },
    { path: '/compliance-services', label: 'IPR & Statutory Audits' },
  ];

  const secondaryResources = [
    { path: '/resources', label: 'Knowledge Hub' },
    { path: '/seo-strategy', label: 'SEO & E-E-A-T Strategy' },
    { path: '/blog', label: 'Advisory Blogs' },
    { path: '/news', label: 'Press Releases' },
    { path: '/events', label: 'Global Webinars' },
    { path: '/faq', label: 'General FAQ' },
  ];

  return (
    <footer id="main-app-footer" className="bg-[#2D3A55] text-white pt-16 pb-8 border-t border-brand-dusk/30">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Col 1: Brand details */}
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={() => handleLinkClick('/')}
              className="flex items-center text-left focus:outline-none group py-1"
            >
              <div className="bg-white px-3.5 py-2 rounded-lg shadow-sm inline-flex items-center transition-transform duration-200 group-hover:scale-[1.02]">
                <img
                  src="/images/IQzyme-logo.jpg"
                  alt="IQZYME Medtech Pvt. Ltd."
                  className="h-16 md:h-18 w-auto max-h-20 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            </button>
            <p className="text-xs text-brand-cloudy max-w-sm leading-relaxed">
              Premier regulatory consulting firm specializing in medical devices, IVDs, cosmetics, and turnkey facility design. We offer comprehensive, high-precision services from concept to commercialization.
            </p>
            <div className="space-y-2 pt-2 text-xs text-brand-cloudy">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-brand-pear shrink-0 mt-0.5" />
                <span>3rd Floor, HUB, Sea Port-Airport Road, Vallathol Junction, Thrikkakara, Cochin, Kerala 682021, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-[#00C4B7]" />
                <span>info@iqzyme.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-brand-orange" />
                <span>+91 974 472 2260</span>
              </div>
            </div>
          </div>

          {/* Col 2: Company */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-brand-pear">
              Corporate
            </h4>
            <div className="flex flex-col gap-2.5 text-xs">
              {corporateLinks.map(link => (
                <button
                  key={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className="text-left text-brand-cloudy hover:text-white transition-colors cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Col 3: Services */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-[#00C4B7]">
              Advisory Streams
            </h4>
            <div className="flex flex-col gap-2.5 text-xs">
              {primaryServices.map(link => (
                <button
                  key={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className="text-left text-brand-cloudy hover:text-[#00C4B7] transition-colors cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Col 4: Resources */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-brand-orange">
              Resources & Insights
            </h4>
            <div className="flex flex-col gap-2.5 text-xs">
              {secondaryResources.map(link => (
                <button
                  key={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className="text-left text-brand-cloudy hover:text-brand-orange transition-colors cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-brand-dusk/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[10px] text-brand-cloudy/80 text-center md:text-left space-y-1 max-w-3xl">
            <p>© {new Date().getFullYear()} IQzyme Digital Marketing Portal. All rights reserved globally.</p>
            <p className="text-brand-cloudy/60 leading-normal">
              Disclaimer: CDSCO, FDA, and CE certification metrics are derived from active client files and third-party notified body review schedules. Consultation does not establish regulatory approval guarantee unless explicitly bound under QA services agreements.
            </p>
          </div>

          {/* Socials & Compliance Links */}
          <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
            <div className="flex gap-4">
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer"
                className="p-1.5 bg-brand-blue/60 hover:bg-white/10 text-brand-cloudy hover:text-white rounded transition-colors"
                aria-label="LinkedIn Profile"
              >
                <Linkedin size={16} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer"
                className="p-1.5 bg-brand-blue/60 hover:bg-white/10 text-brand-cloudy hover:text-white rounded transition-colors"
                aria-label="Twitter Profile"
              >
                <Twitter size={16} />
              </a>
            </div>
            
            <div className="flex gap-3 text-[10px] text-brand-cloudy/60">
              <button onClick={() => handleLinkClick('/cookies')} className="hover:underline hover:text-white">Cookie Policy</button>
              <span>•</span>
              <button onClick={() => handleLinkClick('/faq')} className="hover:underline hover:text-white">Help FAQ</button>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
