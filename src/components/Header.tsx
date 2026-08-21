/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Menu, X, Sparkles, ChevronDown, UserCheck } from 'lucide-react';
import { ROUTES } from '../data';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export default function Header({ currentPath, onNavigate }: HeaderProps) {
  const { currentUser, userProfile } = useAuth();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState<boolean>(false);
  const [isIndustriesDropdownOpen, setIsIndustriesDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setIsMobileMenuOpen(false);
    setIsServicesDropdownOpen(false);
    setIsIndustriesDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Main Links (Main Navigation Bar)
  const mainNavLinks = [
    { path: '/', label: 'Home' },
    { path: '/about-us', label: 'About Us' },
    { path: '/services', label: 'Services' },
    { path: '/industries-served', label: 'Industries' },
    { path: '/resources', label: 'Resources' },
    { path: '/careers', label: 'Careers' },
    { 
      path: '/client-portal', 
      label: currentUser 
        ? `Portal (${userProfile?.displayName?.split(' ')[0] || 'Active'})` 
        : 'Client Portal' 
    },
    { path: '/contact-us', label: 'Contact' },
  ];

  // Services Links
  const servicesDropdownLinks = ROUTES.filter(r => r.category === 'services');
  // Industries Links
  const industriesDropdownLinks = ROUTES.filter(r => r.category === 'industries');

  return (
    <header
      id="main-app-header"
      className={`fixed top-0 left-0 right-0 z-40 h-[82px] md:h-[88px] transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-brand-cloudy/30'
          : 'bg-white/80 backdrop-blur-sm border-b border-brand-cloudy/15'
      }`}
    >
      <div className="max-w-[1240px] h-full mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* LOGO */}
        <button
          id="header-logo-button"
          onClick={() => handleLinkClick('/')}
          className="flex items-center cursor-pointer group text-left focus:outline-none py-1"
        >
          <div className="flex items-center">
            <img
              src="/images/iqzyme-logo.svg"
              alt="IQZYME Medtech Pvt. Ltd."
              className="h-[68px] md:h-[76px] w-auto max-h-[80px] object-contain transition-transform duration-200 group-hover:scale-[1.03]"
              referrerPolicy="no-referrer"
            />
          </div>
        </button>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {mainNavLinks.map((link) => {
            const isActive = currentPath === link.path;

            // Specialized Dropdowns
            if (link.label === 'Services') {
              return (
                <div
                  key={link.path}
                  className="relative"
                  onMouseEnter={() => setIsServicesDropdownOpen(true)}
                  onMouseLeave={() => setIsServicesDropdownOpen(false)}
                >
                  <button
                    id="desktop-nav-services-trigger"
                    onClick={() => handleLinkClick('/services')}
                    className={`h-11 px-3 py-2 text-[14px] font-medium rounded flex items-center gap-1 hover:text-brand-topaz transition-colors cursor-pointer ${
                      isActive || currentPath.includes('services') ? 'text-[#00C4B7] font-semibold' : 'text-brand-blue'
                    }`}
                  >
                    <span>Services</span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${isServicesDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isServicesDropdownOpen && (
                    <div 
                      id="desktop-nav-services-menu"
                      className="absolute left-0 mt-0 w-64 bg-white border border-brand-cloudy/30 shadow-xl rounded-md py-2 z-50 animate-fade-in"
                    >
                      <button
                        onClick={() => handleLinkClick('/services')}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-brand-dusk border-b border-brand-cloudy/20 uppercase tracking-wider"
                      >
                        All Services Overview
                      </button>
                      {servicesDropdownLinks.map(s => (
                        <button
                          key={s.path}
                          onClick={() => handleLinkClick(s.path)}
                          className={`w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-[#FAF9F5] transition-colors text-brand-blue flex items-center justify-between ${
                            currentPath === s.path ? 'bg-brand-topaz/5 text-brand-topaz border-l-2 border-brand-topaz' : ''
                          }`}
                        >
                          <span>{s.label}</span>
                          <span className="text-[10px] text-brand-cloudy group-hover:text-brand-topaz">→</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            if (link.label === 'Industries') {
              return (
                <div
                  key={link.path}
                  className="relative"
                  onMouseEnter={() => setIsIndustriesDropdownOpen(true)}
                  onMouseLeave={() => setIsIndustriesDropdownOpen(false)}
                >
                  <button
                    id="desktop-nav-industries-trigger"
                    onClick={() => handleLinkClick('/industries-served')}
                    className={`h-11 px-3 py-2 text-[14px] font-medium rounded flex items-center gap-1 hover:text-brand-topaz transition-colors cursor-pointer ${
                      isActive || currentPath.includes('industries') || currentPath === '/ivd' || currentPath === '/medical-devices' ? 'text-[#00C4B7] font-semibold' : 'text-brand-blue'
                    }`}
                  >
                    <span>Industries</span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${isIndustriesDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isIndustriesDropdownOpen && (
                    <div 
                      id="desktop-nav-industries-menu"
                      className="absolute left-0 mt-0 w-64 bg-white border border-brand-cloudy/30 shadow-xl rounded-md py-2 z-50 animate-fade-in"
                    >
                      <button
                        onClick={() => handleLinkClick('/industries-served')}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-brand-dusk border-b border-brand-cloudy/20 uppercase tracking-wider"
                      >
                        All Industries served
                      </button>
                      {industriesDropdownLinks.map(ind => (
                        <button
                          key={ind.path}
                          onClick={() => handleLinkClick(ind.path)}
                          className={`w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-[#FAF9F5] transition-colors text-brand-blue flex items-center justify-between ${
                            currentPath === ind.path ? 'bg-brand-topaz/5 text-brand-topaz border-l-2 border-brand-topaz' : ''
                          }`}
                        >
                          <span>{ind.label}</span>
                          <span className="text-[10px] text-brand-cloudy">→</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                id={`desktop-nav-link-${link.label.toLowerCase().replace(/\s+/g, '')}`}
                key={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`h-11 px-3 py-2 text-[14px] font-medium rounded hover:text-[#00C4B7] transition-colors relative cursor-pointer ${
                  isActive ? 'text-[#00C4B7] font-semibold' : 'text-brand-blue'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-1 left-3 right-3 h-0.5 bg-[#00C4B7] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* BOOK CONSULTATION CTA BUTTON */}
        <div className="hidden md:flex items-center gap-3">
          <button
            id="desktop-header-cta-btn"
            onClick={() => handleLinkClick('/book-consultation')}
            className="px-4 h-11 text-xs font-bold uppercase tracking-wider bg-[#99CE43] text-brand-blue rounded shadow-sm hover:bg-[#86b53b] hover:scale-102 hover:shadow-md active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles size={14} className="text-brand-blue" />
            <span>Book Consultation</span>
          </button>
        </div>

        {/* MOBILE HAMBURGER BUTTON */}
        <button
          id="mobile-nav-toggle-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-brand-blue hover:text-[#00C4B7] transition-colors focus:outline-none cursor-pointer"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE DRAWER OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          id="mobile-nav-drawer" 
          className="fixed inset-0 top-[82px] z-50 bg-white border-t border-brand-cloudy/20 md:hidden overflow-y-auto"
        >
          <div className="p-4 space-y-4">
            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-brand-dusk uppercase tracking-widest px-3 mb-2">Main Sections</p>
              {mainNavLinks.map((link) => {
                if (link.label === 'Services' || link.label === 'Industries') return null;
                const isActive = currentPath === link.path;
                return (
                  <button
                    key={link.path}
                    onClick={() => handleLinkClick(link.path)}
                    className={`w-full text-left h-11 px-3 text-base font-semibold rounded-md flex items-center justify-between ${
                      isActive ? 'bg-[#99CE43]/10 text-brand-blue border-l-4 border-[#99CE43]' : 'text-brand-blue hover:bg-[#FAF9F5]'
                    }`}
                  >
                    <span>{link.label}</span>
                    <span className="text-xs">→</span>
                  </button>
                );
              })}
            </div>

            {/* Services Accordion list */}
            <div className="space-y-1 pt-2 border-t border-brand-cloudy/20">
              <button
                onClick={() => handleLinkClick('/services')}
                className="w-full text-left text-[10px] font-semibold text-brand-dusk uppercase tracking-widest px-3 mb-2 flex justify-between items-center"
              >
                <span>Advisory Services</span>
                <span className="text-[10px] underline">View All</span>
              </button>
              <div className="grid grid-cols-1 gap-1 pl-2">
                {servicesDropdownLinks.map(s => (
                  <button
                    key={s.path}
                    onClick={() => handleLinkClick(s.path)}
                    className={`text-left h-9 px-3 text-xs font-medium rounded ${
                      currentPath === s.path ? 'text-brand-topaz font-bold bg-brand-topaz/5' : 'text-brand-dusk hover:text-brand-blue'
                    }`}
                  >
                    • {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Industries Accordion list */}
            <div className="space-y-1 pt-2 border-t border-brand-cloudy/20">
              <button
                onClick={() => handleLinkClick('/industries-served')}
                className="w-full text-left text-[10px] font-semibold text-brand-dusk uppercase tracking-widest px-3 mb-2 flex justify-between items-center"
              >
                <span>Sectors We Serve</span>
                <span className="text-[10px] underline">View All</span>
              </button>
              <div className="grid grid-cols-1 gap-1 pl-2">
                {industriesDropdownLinks.map(ind => (
                  <button
                    key={ind.path}
                    onClick={() => handleLinkClick(ind.path)}
                    className={`text-left h-9 px-3 text-xs font-medium rounded ${
                      currentPath === ind.path ? 'text-brand-topaz font-bold bg-brand-topaz/5' : 'text-brand-dusk hover:text-brand-blue'
                    }`}
                  >
                    • {ind.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Booking button */}
            <div className="pt-4">
              <button
                id="mobile-nav-cta-btn"
                onClick={() => handleLinkClick('/book-consultation')}
                className="w-full h-12 bg-brand-blue text-white font-bold uppercase tracking-wider rounded shadow flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Sparkles size={16} className="text-[#99CE43]" />
                <span>Book Free Audit Session</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
