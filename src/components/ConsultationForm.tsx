/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Sparkles, Check, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

const SERVICES = [
  { id: 'reg', title: 'Regulatory Compliance Advisory', desc: 'CDSCO, CE-MDR/IVDR filings, FDA registrations' },
  { id: 'mkt', title: 'Digital Marketing Audit', desc: 'Life-sciences organic SEO strategy, B2B lead generation' },
  { id: 'qms', title: 'ISO 13485 QMS Structure', desc: 'Quality management design, gap analysis, mock audits' },
  { id: 'turn', title: 'Turnkey & Tech Transfer Support', desc: 'Infrastructure strategy, lab design, entrepreneurship' }
];

const TIME_SLOTS = [
  '09:00 - 10:00 IST',
  '11:00 - 12:00 IST',
  '14:00 - 15:00 IST',
  '16:00 - 17:00 IST'
];

interface ConsultationFormProps {
  initialNotes?: string;
  initialService?: string;
}

export default function ConsultationForm({ initialNotes = '', initialService = '' }: ConsultationFormProps) {
  const { currentUser, userProfile } = useAuth();
  const [step, setStep] = useState<number>(initialService ? 2 : 1);
  const [selectedService, setSelectedService] = useState<string>(initialService || '');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  
  // Client info state
  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [urgency, setUrgency] = useState<string>('Standard (Within 2-3 weeks)');
  const [notes, setNotes] = useState<string>(initialNotes || '');

  // Update notes or service if initial props change
  useEffect(() => {
    if (initialNotes) {
      setNotes(initialNotes);
    }
    if (initialService) {
      setSelectedService(initialService);
      setStep(2);
    }
  }, [initialNotes, initialService]);

  const [formError, setFormError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Auto-fill user profile info when logged in
  useEffect(() => {
    if (userProfile) {
      setClientName(userProfile.displayName || '');
      setClientEmail(userProfile.email || '');
      setCompanyName(userProfile.companyName || '');
      setPhone(userProfile.phone || '');
    }
  }, [userProfile]);

  const handleNextStep = () => {
    setFormError('');
    if (step === 1 && !selectedService) {
      setFormError('Please pick an advisory stream to proceed.');
      return;
    }
    if (step === 2) {
      if (!selectedDate) {
        setFormError('Please select a target consultation date.');
        return;
      }
      if (!selectedSlot) {
        setFormError('Please choose an available time slot.');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setFormError('');
    setStep(prev => prev - 1);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!clientName.trim()) {
      setFormError('Full Name is required.');
      return;
    }
    if (!clientEmail.trim() || !clientEmail.includes('@')) {
      setFormError('A valid corporate email is required.');
      return;
    }
    if (!phone.trim()) {
      setFormError('Liaison contact telephone number is required.');
      return;
    }
    if (!companyName.trim()) {
      setFormError('Organization Name is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Post to Express backend API
      const response = await fetch('/api/book-consultation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: currentUser?.uid || 'anonymous',
          clientName: clientName.trim(),
          clientEmail: clientEmail.trim(),
          phone: phone.trim(),
          companyName: companyName.trim(),
          serviceStream: selectedService,
          consultationDate: selectedDate,
          timeSlot: selectedSlot,
          urgency,
          notes: notes.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit booking request.');
      }

      setIsSubmitting(false);
      setStep(4); // Success state
    } catch (err: any) {
      console.error("Booking API submit failed:", err);
      setFormError(err.message || 'Failed to schedule consultation via backend. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div id="consultation-form-wrapper" className="bg-white rounded-lg border border-brand-cloudy/30 shadow-md max-w-2xl mx-auto overflow-hidden">
      {/* Header bar indicating progress */}
      <div className="bg-[#2D3A55] text-white p-6 relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase font-semibold tracking-wider text-brand-pear">Interactive Engagement Portal</span>
          <span className="text-xs text-brand-cloudy font-mono">Step {Math.min(step, 3)} of 3</span>
        </div>
        <h3 className="font-display font-medium text-xl text-white">Book Premium Business Audit</h3>
        
        {/* Progress pills */}
        <div className="flex gap-2 mt-4">
          <div className={`h-1 flex-1 rounded-full transition-all ${step >= 1 ? 'bg-brand-pear' : 'bg-brand-dusk/40'}`} />
          <div className={`h-1 flex-1 rounded-full transition-all ${step >= 2 ? 'bg-brand-pear' : 'bg-brand-dusk/40'}`} />
          <div className={`h-1 flex-1 rounded-full transition-all ${step >= 3 ? 'bg-brand-pear' : 'bg-brand-dusk/40'}`} />
        </div>
      </div>

      <div className="p-6 md:p-8">
        {formError && (
          <div className="mb-4 p-3 bg-brand-coral/10 border border-brand-coral/20 rounded text-xs text-brand-coral font-medium flex items-center gap-2">
            <span>⚠</span> {formError}
          </div>
        )}

        {/* STEP 1: Select Service Stream */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-brand-dusk font-medium">1. Select your target compliance or digital strategy sector:</p>
            <div className="grid grid-cols-1 gap-3">
              {SERVICES.map((s) => (
                <button
                  id={`service-select-${s.id}`}
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setSelectedService(s.title);
                    setFormError('');
                  }}
                  className={`p-4 rounded-lg border text-left transition-all flex justify-between items-center cursor-pointer ${
                    selectedService === s.title 
                      ? 'border-[#00C4B7] bg-brand-topaz/5 shadow-sm' 
                      : 'border-brand-cloudy/50 hover:border-brand-dusk bg-[#FAF9F5]'
                  }`}
                >
                  <div>
                    <h4 className="font-display font-semibold text-sm text-brand-blue">{s.title}</h4>
                    <p className="text-xs text-brand-dusk mt-1">{s.desc}</p>
                  </div>
                  {selectedService === s.title && (
                    <div className="w-5 h-5 bg-[#00C4B7] rounded-full flex items-center justify-center text-white shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <button
                id="consultation-next-step-1"
                type="button"
                onClick={handleNextStep}
                className="h-11 px-6 bg-brand-blue text-white rounded font-semibold text-xs uppercase tracking-wider hover:bg-brand-blue/90 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <span>Select Date & Time</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Choose Date & Time */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-sm text-brand-dusk font-medium">2. Choose Preferred Calendar Slot:</p>
              <span className="text-xs text-brand-topaz font-semibold">{selectedService}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fake Calendar Input */}
              <div className="space-y-2">
                <label htmlFor="preferred-date" className="block text-xs font-semibold text-brand-blue uppercase tracking-wide">
                  Preferred Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3.5 text-brand-dusk" size={16} />
                  <input
                    id="preferred-date"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setFormError('');
                    }}
                    className="w-full h-11 pl-11 pr-4 bg-[#FAF9F5] border border-brand-cloudy/60 focus:ring-2 focus:ring-brand-topaz rounded text-sm focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-brand-cloudy">Consultations must be scheduled at least 24 hours in advance.</p>
              </div>

              {/* Time Slots */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-brand-blue uppercase tracking-wide">
                  Available Slots
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      id={`slot-select-${slot.replace(/\s+/g, '')}`}
                      key={slot}
                      type="button"
                      onClick={() => {
                        setSelectedSlot(slot);
                        setFormError('');
                      }}
                      className={`h-11 px-4 rounded text-left text-xs font-mono font-medium border flex items-center justify-between cursor-pointer transition-all ${
                        selectedSlot === slot 
                          ? 'bg-brand-blue text-white border-brand-blue' 
                          : 'bg-[#FAF9F5] text-brand-blue border-brand-cloudy/60 hover:border-brand-blue'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Clock size={12} />
                        {slot}
                      </span>
                      {selectedSlot === slot && <Check size={12} strokeWidth={3} className="text-brand-pear" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-brand-cloudy/20">
              <button
                id="consultation-prev-step-2"
                type="button"
                onClick={handlePrevStep}
                className="h-11 px-4 text-brand-blue font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:text-brand-blue/80 cursor-pointer"
              >
                <ChevronLeft size={14} />
                <span>Back</span>
              </button>

              <button
                id="consultation-next-step-2"
                type="button"
                onClick={handleNextStep}
                className="h-11 px-6 bg-brand-blue text-white rounded font-semibold text-xs uppercase tracking-wider hover:bg-brand-blue/90 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <span>Add Details</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Client Details */}
        {step === 3 && (
          <form onSubmit={handleSubmitBooking} className="space-y-4">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm text-brand-dusk font-medium">3. Finalize Contact Parameters:</p>
              <div className="text-right">
                <span className="block text-[10px] text-brand-topaz font-semibold">{selectedService}</span>
                <span className="block text-[10px] text-brand-dusk font-mono">{selectedDate} @ {selectedSlot}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="client-name" className="block text-xs font-semibold text-brand-blue uppercase tracking-wide">Your Name</label>
                <input
                  id="client-name"
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Anya Sorensen"
                  className="w-full h-11 px-3 bg-[#FAF9F5] border border-brand-cloudy/60 focus:ring-2 focus:ring-brand-topaz rounded text-sm focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="client-email" className="block text-xs font-semibold text-brand-blue uppercase tracking-wide">Corporate Email</label>
                <input
                  id="client-email"
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="s.menon@biotech-labs.in"
                  className="w-full h-11 px-3 bg-[#FAF9F5] border border-brand-cloudy/60 focus:ring-2 focus:ring-brand-topaz rounded text-sm focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label htmlFor="company-name" className="block text-xs font-semibold text-brand-blue uppercase tracking-wide">Company / Lab Name</label>
                <input
                  id="company-name"
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Biotech Laboratories Pvt Ltd"
                  className="w-full h-11 px-3 bg-[#FAF9F5] border border-brand-cloudy/60 focus:ring-2 focus:ring-brand-topaz rounded text-sm focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="client-phone" className="block text-xs font-semibold text-brand-blue uppercase tracking-wide">Phone Number</label>
                <input
                  id="client-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full h-11 px-3 bg-[#FAF9F5] border border-brand-cloudy/60 focus:ring-2 focus:ring-brand-topaz rounded text-sm focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="consult-urgency" className="block text-xs font-semibold text-brand-blue uppercase tracking-wide">Regulatory Urgency</label>
                <select
                  id="consult-urgency"
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="w-full h-11 px-3 bg-[#FAF9F5] border border-brand-cloudy/60 focus:ring-2 focus:ring-brand-topaz rounded text-sm focus:outline-none"
                >
                  <option>Immediate Audit Required (Within 7 days)</option>
                  <option>Standard (Within 2-3 weeks)</option>
                  <option>General Strategic Inquiry / Future Release</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="consult-notes" className="block text-xs font-semibold text-brand-blue uppercase tracking-wide">Additional Project Scope</label>
              <textarea
                id="consult-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Briefly state target device classification, existing technical file status, or target country market expansion plan."
                className="w-full p-3 bg-[#FAF9F5] border border-brand-cloudy/60 focus:ring-2 focus:ring-brand-topaz rounded text-sm focus:outline-none"
              />
            </div>

            <div className="flex justify-between pt-4 border-t border-brand-cloudy/20">
              <button
                id="consultation-prev-step-3"
                type="button"
                onClick={handlePrevStep}
                disabled={isSubmitting}
                className="h-11 px-4 text-brand-blue font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:text-brand-blue/80 cursor-pointer"
              >
                <ChevronLeft size={14} />
                <span>Back</span>
              </button>

              <button
                id="consultation-submit-booking-btn"
                type="submit"
                disabled={isSubmitting}
                className="h-11 px-6 bg-[#99CE43] text-brand-blue font-bold text-xs uppercase tracking-wider rounded shadow-sm hover:bg-[#86b53b] hover:scale-102 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin text-brand-blue" size={14} />
                    <span>Booking...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Booking</span>
                    <Sparkles size={14} />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: Success confirmation screen */}
        {step === 4 && (
          <div id="booking-success-screen" className="text-center py-8 space-y-4">
            <div className="mx-auto w-16 h-16 bg-brand-pear/20 rounded-full flex items-center justify-center text-brand-blue">
              <Check className="text-brand-blue" size={32} strokeWidth={3} />
            </div>
            
            <div className="space-y-1">
              <h4 className="font-display font-semibold text-xl text-brand-blue">Consultation Booking Confirmed!</h4>
              <p className="text-xs text-brand-topaz font-medium">Stream: {selectedService}</p>
            </div>

            <p className="text-sm text-brand-dusk max-w-md mx-auto leading-relaxed">
              Fantastic news! Your premium advisory session has been logged in our calendar. A calendar invite, together with our NDAs and initial technical checklist, has been dispatched to{' '}
              <strong className="text-brand-blue">{clientEmail}</strong>.
            </p>

            <div className="p-4 bg-[#FAF9F5] border border-brand-cloudy/40 rounded-lg max-w-sm mx-auto text-left text-xs space-y-1.5">
              <div className="flex justify-between text-brand-dusk">
                <span>Date:</span>
                <span className="font-semibold text-brand-blue">{selectedDate}</span>
              </div>
              <div className="flex justify-between text-brand-dusk">
                <span>Time Slot:</span>
                <span className="font-semibold text-brand-blue">{selectedSlot}</span>
              </div>
              <div className="flex justify-between text-brand-dusk">
                <span>Host Consultant:</span>
                <span className="font-semibold text-brand-blue">Mr. Sinto Poulose, Founder Director</span>
              </div>
            </div>

            <button
              id="booking-success-reset-btn"
              type="button"
              onClick={() => {
                setStep(1);
                setSelectedService('');
                setSelectedDate('');
                setSelectedSlot('');
                setClientName('');
                setClientEmail('');
                setCompanyName('');
                setNotes('');
              }}
              className="mt-4 px-6 h-11 bg-brand-blue text-white font-semibold text-xs uppercase tracking-wider rounded hover:bg-brand-blue/90 cursor-pointer transition-all active:scale-95"
            >
              Book Another Advisory Stream
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
