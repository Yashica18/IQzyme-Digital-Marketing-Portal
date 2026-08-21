/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Loader2, CheckCircle, AlertTriangle, Send } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

interface FormFields {
  name: string;
  email: string;
  projectNo: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactForm() {
  const { currentUser, userProfile } = useAuth();
  const [fields, setFields] = useState<FormFields>({
    name: '',
    email: '',
    projectNo: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  // Auto-fill form fields if user is authenticated
  useEffect(() => {
    if (userProfile) {
      setFields(prev => ({
        ...prev,
        name: userProfile.displayName || '',
        email: userProfile.email || '',
      }));
    }
  }, [userProfile]);

  const validateField = (name: keyof FormFields, value: string): string => {
    switch (name) {
      case 'name':
        return value.trim() ? '' : 'Name is required to register an inquiry.';
      case 'email':
        if (!value.trim()) return 'Email address is required.';
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(value) ? '' : 'Please enter a valid email address.';
      case 'message':
        return value.trim().length >= 10 ? '' : 'Message must contain at least 10 characters.';
      default:
        return '';
    }
  };

  const handleBlur = (name: keyof FormFields) => {
    const errorMsg = validateField(name, fields[name]);
    setErrors(prev => ({
      ...prev,
      [name]: errorMsg || undefined
    }));
  };

  const handleChange = (name: keyof FormFields, value: string) => {
    setFields(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const nameErr = validateField('name', fields.name);
    const emailErr = validateField('email', fields.email);
    const messageErr = validateField('message', fields.message);

    const newErrors: FormErrors = {};
    if (nameErr) newErrors.name = nameErr;
    if (emailErr) newErrors.email = emailErr;
    if (messageErr) newErrors.message = messageErr;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Focus on the first element with error
      if (newErrors.name && nameRef.current) {
        nameRef.current.focus();
      } else if (newErrors.email && emailRef.current) {
        emailRef.current.focus();
      } else if (newErrors.message && messageRef.current) {
        messageRef.current.focus();
      }
      return;
    }

    setStatus('submitting');

    try {
      // Save contact message to Firestore contactMessages collection
      await addDoc(collection(db, 'contactMessages'), {
        userId: currentUser?.uid || 'anonymous',
        name: fields.name.trim(),
        email: fields.email.trim(),
        projectNo: fields.projectNo.trim(),
        message: fields.message.trim(),
        createdAt: serverTimestamp()
      });

      setStatus('success');
      setFields({
        name: userProfile?.displayName || '',
        email: userProfile?.email || '',
        projectNo: '',
        message: ''
      });
      setErrors({});
    } catch (err: any) {
      console.error("Firestore contact submit failed:", err);
      setErrorMessage(err.message || 'Failed to submit message to the database. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div id="contact-form-container" className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-brand-cloudy/30">
      {status === 'success' ? (
        <div id="contact-success-state" className="py-12 text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-brand-pear/20 rounded-full flex items-center justify-center text-brand-blue">
            <CheckCircle size={36} className="text-brand-blue" />
          </div>
          <h3 className="font-display font-medium text-2xl text-brand-blue">Message Dispatched</h3>
          <p className="text-sm text-brand-dusk max-w-md mx-auto leading-relaxed">
            Your inquiry has been successfully received. Our senior compliance officer and healthcare digital strategist will evaluate your specifications and get in touch within 24 business hours.
          </p>
          <button
            id="contact-reset-btn"
            onClick={() => setStatus('idle')}
            className="mt-4 px-6 h-11 text-xs font-semibold uppercase tracking-wider bg-brand-blue text-white rounded hover:bg-brand-blue/90 transition-all cursor-pointer"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {errorMessage && (
            <div className="p-3 bg-brand-coral/10 border border-brand-coral/20 rounded text-xs text-brand-coral font-medium flex items-center gap-2">
              <span>⚠</span> {errorMessage}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="contact-name" className="block text-xs font-semibold text-brand-blue uppercase tracking-wide">
                Full Name <span className="text-brand-coral">*</span>
              </label>
              <input
                id="contact-name"
                ref={nameRef}
                type="text"
                value={fields.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                placeholder="Dr. Sarah Jenkins"
                className={`w-full h-11 px-4 text-base bg-white border ${
                  errors.name ? 'border-brand-coral focus:ring-brand-coral' : 'border-brand-cloudy/60 focus:ring-brand-topaz'
                } rounded focus:outline-none focus:ring-2 transition-all`}
                disabled={status === 'submitting'}
              />
              {errors.name && (
                <p id="contact-name-error" className="text-xs text-brand-coral flex items-center gap-1 mt-1">
                  <AlertTriangle size={12} /> {errors.name}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label htmlFor="contact-email" className="block text-xs font-semibold text-brand-blue uppercase tracking-wide">
                Work Email <span className="text-brand-coral">*</span>
              </label>
              <input
                id="contact-email"
                ref={emailRef}
                type="email"
                value={fields.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="s.jenkins@medtech-innovators.com"
                className={`w-full h-11 px-4 text-base bg-white border ${
                  errors.email ? 'border-brand-coral focus:ring-brand-coral' : 'border-brand-cloudy/60 focus:ring-brand-topaz'
                } rounded focus:outline-none focus:ring-2 transition-all`}
                disabled={status === 'submitting'}
              />
              {errors.email && (
                <p id="contact-email-error" className="text-xs text-brand-coral flex items-center gap-1 mt-1">
                  <AlertTriangle size={12} /> {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Optional Order / Project # */}
          <div className="space-y-1.5">
            <label htmlFor="contact-project" className="block text-xs font-semibold text-brand-blue uppercase tracking-wide">
              Project ID or Licensing File # <span className="text-brand-dusk font-normal">(Optional)</span>
            </label>
            <input
              id="contact-project"
              type="text"
              value={fields.projectNo}
              onChange={(e) => handleChange('projectNo', e.target.value)}
              placeholder="CDSCO-2026-X72 (If applicable)"
              className="w-full h-11 px-4 text-base bg-white border border-brand-cloudy/60 focus:ring-brand-topaz rounded focus:outline-none focus:ring-2 transition-all"
              disabled={status === 'submitting'}
            />
          </div>

          {/* Detailed Message */}
          <div className="space-y-1.5">
            <label htmlFor="contact-message" className="block text-xs font-semibold text-brand-blue uppercase tracking-wide">
              Detailed Scope of Enquiry <span className="text-brand-coral">*</span>
            </label>
            <textarea
              id="contact-message"
              ref={messageRef}
              rows={5}
              value={fields.message}
              onChange={(e) => handleChange('message', e.target.value)}
              onBlur={() => handleBlur('message')}
              placeholder="Please describe your device classification, required target markets, or strategic marketing goals."
              className={`w-full p-4 text-base bg-white border ${
                errors.message ? 'border-brand-coral focus:ring-brand-coral' : 'border-brand-cloudy/60 focus:ring-brand-topaz'
              } rounded focus:outline-none focus:ring-2 transition-all`}
              disabled={status === 'submitting'}
            />
            {errors.message && (
              <p id="contact-message-error" className="text-xs text-brand-coral flex items-center gap-1 mt-1">
                <AlertTriangle size={12} /> {errors.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            id="contact-submit-btn"
            type="submit"
            disabled={status === 'submitting'}
            className="w-full h-12 bg-brand-pear text-brand-blue font-bold uppercase tracking-wider rounded shadow-sm hover:bg-[#86b53b] hover:scale-102 hover:shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {status === 'submitting' ? (
              <>
                <Loader2 className="animate-spin text-brand-blue" size={20} />
                <span>Transmitting Data...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>Submit Inquiry Portfolio</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
