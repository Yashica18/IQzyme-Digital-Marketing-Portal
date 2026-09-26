/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Sparkles, ChevronDown, Activity, Compass, FileText, ShieldCheck, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
  const lastToggleTimeRef = useRef<number>(0);

  const handleToggleMobileMenu = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const now = Date.now();
    if (now - lastToggleTimeRef.current < 250) return;
    lastToggleTimeRef.current = now;
    setIsMobileMenuOpen(prev => !prev);
  };

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

  // Lock body scroll when mobile navigation menu is active & listen to Escape key
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

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
    { path: '/regulatory-radar', label: 'Regulatory Radar', isLive: true },
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
    <>
      <header
        id="main-app-header"
        className={`fixed top-0 left-0 right-0 z-50 h-[76px] sm:h-[82px] md:h-[88px] transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-brand-cloudy/30'
            : 'bg-white/90 backdrop-blur-sm border-b border-brand-cloudy/15'
        }`}
      >
        <div className="max-w-[1240px] h-full mx-auto px-4 md:px-6 flex items-center justify-between gap-3">
          {/* LOGO */}
          <button
            id="header-logo-button"
            onClick={() => handleLinkClick('/')}
            className="flex items-center cursor-pointer group text-left focus:outline-none py-1 min-w-0"
          >
            <div className="flex items-center min-w-0">
              <img
                src="/images/IQzyme-logo.jpg"
                alt="IQZYME Medtech Pvt. Ltd."
                className="h-[52px] sm:h-[66px] md:h-[76px] w-auto max-w-[210px] sm:max-w-none max-h-[80px] object-contain transition-transform duration-200 group-hover:scale-[1.02]"
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
                  className={`h-11 px-3 py-2 text-[14px] font-medium rounded hover:text-[#00C4B7] transition-colors relative cursor-pointer flex items-center gap-1.5 ${
                    isActive ? 'text-[#00C4B7] font-semibold' : 'text-brand-blue'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.isLive && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C4B7] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00C4B7]"></span>
                    </span>
                  )}
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
            type="button"
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
            onClick={handleToggleMobileMenu}
            onTouchEnd={handleToggleMobileMenu}
            style={{ touchAction: 'manipulation' }}
            className="md:hidden shrink-0 min-w-[48px] min-h-[48px] -mr-1 p-2.5 rounded-xl text-brand-blue hover:text-[#00C4B7] active:bg-brand-blue/10 transition-all focus:outline-none cursor-pointer flex items-center justify-center relative z-50 select-none"
          >
            {isMobileMenuOpen ? (
              <X size={28} className="text-brand-blue" strokeWidth={2.5} />
            ) : (
              <Menu size={28} className="text-brand-blue" strokeWidth={2.5} />
            )}
          </button>
        </div>
      </header>

      {/* MOBILE DRAWER OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div id="mobile-nav-root" className="fixed inset-0 z-[100] md:hidden">
            {/* Backdrop */}
            <motion.div
              id="mobile-nav-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
              aria-hidden="true"
            />

            {/* Slide-in Drawer Container */}
            <motion.div 
              id="mobile-nav-drawer" 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed inset-y-0 right-0 w-full max-w-[340px] sm:max-w-sm bg-white shadow-2xl flex flex-col z-[101] overflow-hidden border-l border-brand-cloudy/30"
            >
              {/* Drawer Top Branding & Close Header */}
              <div className="h-[76px] sm:h-[84px] px-4 sm:px-6 flex items-center justify-between border-b border-brand-cloudy/25 shrink-0 bg-white">
                <div className="flex items-center min-w-0">
                  <img
                    src="/images/IQzyme-logo.jpg"
                    alt="IQZYME Medtech Pvt. Ltd."
                    className="h-[46px] sm:h-[54px] w-auto max-h-[56px] object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <button
                  id="mobile-drawer-close-btn"
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="min-w-[44px] min-h-[44px] p-2.5 rounded-xl text-brand-blue hover:text-brand-coral hover:bg-brand-coral/10 transition-colors cursor-pointer flex items-center justify-center focus:outline-none"
                  aria-label="Close navigation menu"
                >
                  <X size={24} strokeWidth={2.5} />
                </button>
              </div>

              {/* Scrollable Content Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
                {/* Quick Living Intelligence Tools Banner */}
                <div className="bg-brand-blue/5 border border-brand-cloudy/30 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-blue flex items-center gap-1.5">
                      <Activity size={14} className="text-[#00C4B7]" />
                      <span>Living Regulatory Suite</span>
                    </span>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C4B7] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00C4B7]"></span>
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => handleLinkClick('/regulatory-radar')}
                      className={`p-2 rounded-lg text-xs font-semibold text-left transition-colors flex items-center gap-1.5 ${
                        currentPath === '/regulatory-radar' ? 'bg-[#00C4B7] text-white' : 'bg-white text-brand-blue hover:bg-[#FAF9F5] border border-brand-cloudy/20'
                      }`}
                    >
                      <Activity size={12} />
                      <span className="truncate">Live Radar</span>
                    </button>
                    <button
                      onClick={() => handleLinkClick('/regulatory-triage')}
                      className={`p-2 rounded-lg text-xs font-semibold text-left transition-colors flex items-center gap-1.5 ${
                        currentPath === '/regulatory-triage' ? 'bg-[#00C4B7] text-white' : 'bg-white text-brand-blue hover:bg-[#FAF9F5] border border-brand-cloudy/20'
                      }`}
                    >
                      <Compass size={12} />
                      <span className="truncate">Statutory Triage</span>
                    </button>
                    <button
                      onClick={() => handleLinkClick('/interactive-pathways')}
                      className={`p-2 rounded-lg text-xs font-semibold text-left transition-colors flex items-center gap-1.5 ${
                        currentPath === '/interactive-pathways' ? 'bg-[#00C4B7] text-white' : 'bg-white text-brand-blue hover:bg-[#FAF9F5] border border-brand-cloudy/20'
                      }`}
                    >
                      <ShieldCheck size={12} />
                      <span className="truncate">Dynamic Pathways</span>
                    </button>
                    <button
                      onClick={() => handleLinkClick('/strategy-generator')}
                      className={`p-2 rounded-lg text-xs font-semibold text-left transition-colors flex items-center gap-1.5 ${
                        currentPath === '/strategy-generator' ? 'bg-[#00C4B7] text-white' : 'bg-white text-brand-blue hover:bg-[#FAF9F5] border border-brand-cloudy/20'
                      }`}
                    >
                      <FileText size={12} />
                      <span className="truncate">Playbook Gen</span>
                    </button>
                  </div>
                </div>

                {/* Main Navigation Links */}
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-brand-dusk uppercase tracking-widest px-3 mb-1">Navigation</p>
                  {mainNavLinks.map((link) => {
                    if (link.label === 'Services' || link.label === 'Industries') return null;
                    const isActive = currentPath === link.path;
                    return (
                      <button
                        key={link.path}
                        onClick={() => handleLinkClick(link.path)}
                        className={`w-full text-left min-h-[44px] px-3.5 text-sm font-semibold rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                          isActive ? 'bg-[#99CE43]/15 text-brand-blue border-l-4 border-[#99CE43]' : 'text-brand-blue hover:bg-brand-blue/5'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {link.label}
                          {link.isLive && (
                            <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase bg-[#00C4B7] text-white rounded">Live</span>
                          )}
                        </span>
                        <span className="text-xs text-brand-dusk">→</span>
                      </button>
                    );
                  })}
                </div>

                {/* Services Accordion list */}
                <div className="space-y-1 pt-3 border-t border-brand-cloudy/20">
                  <div className="flex justify-between items-center px-3 mb-1">
                    <span className="text-[10px] font-bold text-brand-dusk uppercase tracking-widest">
                      Advisory Services
                    </span>
                    <button
                      onClick={() => handleLinkClick('/services')}
                      className="text-[11px] font-semibold text-[#00C4B7] hover:underline cursor-pointer"
                    >
                      View All
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {servicesDropdownLinks.map(s => (
                      <button
                        key={s.path}
                        onClick={() => handleLinkClick(s.path)}
                        className={`text-left min-h-[40px] px-3.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                          currentPath === s.path ? 'text-brand-topaz font-bold bg-brand-topaz/10' : 'text-brand-dusk hover:text-brand-blue hover:bg-[#FAF9F5]'
                        }`}
                      >
                        <span>• {s.label}</span>
                        <span className="text-[10px] text-brand-cloudy">→</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Industries Accordion list */}
                <div className="space-y-1 pt-3 border-t border-brand-cloudy/20">
                  <div className="flex justify-between items-center px-3 mb-1">
                    <span className="text-[10px] font-bold text-brand-dusk uppercase tracking-widest">
                      Sectors We Serve
                    </span>
                    <button
                      onClick={() => handleLinkClick('/industries-served')}
                      className="text-[11px] font-semibold text-[#00C4B7] hover:underline cursor-pointer"
                    >
                      View All
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {industriesDropdownLinks.map(ind => (
                      <button
                        key={ind.path}
                        onClick={() => handleLinkClick(ind.path)}
                        className={`text-left min-h-[40px] px-3.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                          currentPath === ind.path ? 'text-brand-topaz font-bold bg-brand-topaz/10' : 'text-brand-dusk hover:text-brand-blue hover:bg-[#FAF9F5]'
                        }`}
                      >
                        <span>• {ind.label}</span>
                        <span className="text-[10px] text-brand-cloudy">→</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Booking CTA button */}
                <div className="pt-2">
                  <button
                    id="mobile-nav-cta-btn"
                    onClick={() => handleLinkClick('/book-consultation')}
                    className="w-full h-12 bg-brand-blue text-white font-bold uppercase tracking-wider rounded-xl shadow-md hover:bg-brand-blue/90 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles size={16} className="text-[#99CE43]" />
                    <span>Book Free Audit Session</span>
                  </button>
                </div>

                {/* Direct Regulatory Hotline / Contact footer */}
                <div className="pt-3 pb-6 text-center space-y-1 border-t border-brand-cloudy/20">
                  <p className="text-[11px] text-brand-dusk font-medium flex items-center justify-center gap-1.5">
                    <Phone size={12} className="text-[#00C4B7]" />
                    <span>Direct Hotline:</span>
                    <a href="tel:+919811204845" className="font-bold text-brand-blue hover:underline">+91 98112 04845</a>
                  </p>
                  <p className="text-[10px] text-brand-cloudy flex items-center justify-center gap-1.5">
                    <Mail size={12} />
                    <a href="mailto:info@iqzyme.com" className="hover:underline">info@iqzyme.com</a>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
