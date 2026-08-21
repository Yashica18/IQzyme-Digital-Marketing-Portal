/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Mail, ArrowRight, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  
  const inputRef = useRef<HTMLInputElement>(null);

  const validateEmail = (val: string) => {
    if (!val) {
      return 'Email address is required.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      return 'Please enter a valid email address.';
    }
    return '';
  };

  const handleBlur = () => {
    const err = validateEmail(email);
    setError(err);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateEmail(email);
    
    if (err) {
      setError(err);
      setStatus('error');
      if (inputRef.current) {
        inputRef.current.focus();
      }
      return;
    }

    setError('');
    setStatus('submitting');

    try {
      await addDoc(collection(db, 'newsletterSubscribers'), {
        email: email.trim(),
        createdAt: serverTimestamp()
      });
      setStatus('success');
      setEmail('');
    } catch (err: any) {
      console.error("Firestore newsletter subscription failed:", err);
      setError(err.message || 'Failed to register subscription. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div id="newsletter-form-container" className="bg-[#2D3A55] text-white p-6 md:p-8 rounded-lg shadow-sm border border-brand-dusk/30 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-brand-pear/20 rounded text-brand-pear">
          <Mail size={20} />
        </div>
        <h4 className="font-display font-medium text-lg text-white">Stay Informed</h4>
      </div>
      <p className="text-xs text-brand-cloudy mb-5 leading-relaxed">
        Join our network. Receive curated bi-weekly updates on global CDSCO guidelines, EU-MDR transitions, and clinical digital marketing trends.
      </p>

      {status === 'success' ? (
        <div id="newsletter-success-state" className="flex items-start gap-3 p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-md text-emerald-300">
          <CheckCircle className="shrink-0 text-brand-pear mt-0.5" size={18} />
          <div>
            <p className="font-medium text-sm">Subscription Successful!</p>
            <p className="text-xs text-emerald-400 mt-1">Thank you. You have been added to the IQzyme insights database.</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="newsletter-email" className="block text-xs font-semibold text-brand-cloudy uppercase tracking-wide">
              Work Email Address
            </label>
            <div className="relative">
              <input
                id="newsletter-email"
                ref={inputRef}
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                onBlur={handleBlur}
                placeholder="you@company.com"
                className={`w-full h-11 pl-4 pr-12 text-sm bg-brand-blue/40 border ${
                  error ? 'border-brand-coral focus:ring-brand-coral' : 'border-brand-dusk/40 focus:ring-[#00C4B7]'
                } rounded text-white placeholder-brand-cloudy/50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-brand-blue transition-all`}
                disabled={status === 'submitting'}
              />
              <button
                id="newsletter-submit-btn"
                type="submit"
                disabled={status === 'submitting'}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-brand-pear hover:bg-[#86b53b] text-brand-blue rounded flex items-center justify-center transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {status === 'submitting' ? (
                  <Loader2 className="animate-spin text-brand-blue" size={16} />
                ) : (
                  <ArrowRight size={16} />
                )}
              </button>
            </div>
            {error && (
              <p id="newsletter-email-error" className="text-xs text-brand-coral flex items-center gap-1 mt-1">
                <AlertTriangle size={12} /> {error}
              </p>
            )}
          </div>
          <div className="text-[10px] text-brand-cloudy/70">
            We respect your privacy. No spam, unsubscribe anytime.
          </div>
        </form>
      )}
    </div>
  );
}
