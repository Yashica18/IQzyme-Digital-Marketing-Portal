/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';

interface CookieBannerProps {
  onNavigate: (path: string) => void;
}

export default function CookieBanner({ onNavigate }: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const consent = localStorage.getItem('iqzyme_cookie_consent');
    const consentExpiry = localStorage.getItem('iqzyme_cookie_expiry');
    const now = new Date().getTime();

    // Re-prompt if no consent exists or if consent has expired (365 days)
    if (!consent || !consentExpiry || now > parseInt(consentExpiry)) {
      setIsVisible(true);
    } else {
      if (consent === 'all') {
        initFakeAnalytics();
      }
    }
  }, []);

  const handleConsent = (type: 'all' | 'essential') => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 365); // 365 days validity
    
    localStorage.setItem('iqzyme_cookie_consent', type);
    localStorage.setItem('iqzyme_cookie_expiry', expiryDate.getTime().toString());
    
    setIsVisible(false);

    if (type === 'all') {
      initFakeAnalytics();
    }
  };

  const initFakeAnalytics = () => {
    console.log('[Analytics] initialized with full cookie consent.');
  };

  if (!isVisible) return null;

  return (
    <div 
      id="cookie-consent-banner" 
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#2D3A55] text-white p-4 md:p-6 shadow-[0_-8px_30px_rgb(0,0,0,0.12)] border-t border-brand-dusk/20 transition-all duration-300"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-brand-cloudy md:text-left text-center leading-relaxed max-w-3xl">
          We use cookies to enhance your experience and analyze traffic. By clicking 
          <span className="text-[#00C4B7] font-medium"> 'Accept All'</span>, you consent to our use of cookies. 
          You can read more in our{' '}
          <button 
            id="cookie-banner-policy-link"
            onClick={() => onNavigate('/cookies')}
            className="underline text-white hover:text-brand-pear transition-colors font-medium focus:outline-none"
          >
            Cookie Policy
          </button>.
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          <button
            id="cookie-reject-btn"
            onClick={() => handleConsent('essential')}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-brand-cloudy border border-brand-cloudy/30 rounded-md hover:bg-white/10 hover:text-white transition-all active:scale-95 cursor-pointer"
          >
            Reject Non-Essential
          </button>
          <button
            id="cookie-accept-btn"
            onClick={() => handleConsent('all')}
            className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-[#99CE43] text-brand-blue rounded-md shadow-md hover:bg-[#86b53b] hover:scale-102 transition-all active:scale-95 cursor-pointer"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
