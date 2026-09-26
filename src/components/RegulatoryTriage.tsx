import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  ShieldCheck, 
  Clock, 
  Coins, 
  FileText,
  Activity
} from 'lucide-react';

interface RegulatoryTriageProps {
  onApplyToBooking?: (summary: string) => void;
}

export default function RegulatoryTriage({ onApplyToBooking }: RegulatoryTriageProps) {
  const [step, setStep] = useState<number>(1);
  const [productCategory, setProductCategory] = useState<string>('');
  const [invasiveness, setInvasiveness] = useState<string>('');
  const [clinicalRole, setClinicalRole] = useState<string>('');
  const [targetMarket, setTargetMarket] = useState<string>('all');

  const handleSelectProduct = (cat: string) => {
    setProductCategory(cat);
    setStep(2);
  };

  const handleSelectInvasiveness = (inv: string) => {
    setInvasiveness(inv);
    setStep(3);
  };

  const handleSelectClinicalRole = (role: string) => {
    setClinicalRole(role);
    setStep(4);
  };

  const resetTriage = () => {
    setStep(1);
    setProductCategory('');
    setInvasiveness('');
    setClinicalRole('');
  };

  const calculateDetermination = () => {
    const isHigh = invasiveness === 'implantable' || clinicalRole === 'life_support';
    const isModHigh = invasiveness === 'invasive_surgical' || clinicalRole === 'diagnostic_treatment';
    const isMod = invasiveness === 'surface_contact' || productCategory === 'samd';

    if (isHigh) {
      return {
        cdscoClass: 'Class D (High Risk)',
        fdaRoute: 'Premarket Approval (PMA) or 510(k) with Clinical Data',
        euMdrClass: 'Class III (Annex VIII Rule 7/8)',
        estimatedTimeline: '12 – 18 Months',
        estimatedGovFees: '₹1,50,000 (CDSCO) / $21,744+ (FDA) / €28,000 (EU)',
        summary: 'High-risk medical technology requiring extensive biocompatibility (ISO 10993), clinical trials, and dedicated Notified Body audit.',
      };
    }

    if (isModHigh) {
      return {
        cdscoClass: 'Class C (Moderate-High Risk)',
        fdaRoute: 'Premarket Notification 510(k) (eSTAR)',
        euMdrClass: 'Class IIb (Annex VIII Rule 10/11)',
        estimatedTimeline: '8 – 12 Months',
        estimatedGovFees: '₹1,50,000 (CDSCO) / $21,744 (FDA) / €18,000 (EU)',
        summary: 'Moderate-to-high risk classification requiring full Technical Dossier (STED), ISO 13485 QMS audit, and clinical performance verification.',
      };
    }

    if (isMod) {
      return {
        cdscoClass: 'Class B (Low-Moderate Risk)',
        fdaRoute: '510(k) Premarket Notification or 510(k) Exempt',
        euMdrClass: 'Class IIa (Annex VIII Rule 11/1)',
        estimatedTimeline: '4 – 7 Months',
        estimatedGovFees: '₹50,000 (CDSCO) / $5,436–$21,744 (FDA) / €12,000 (EU)',
        summary: 'Standard medical device registration pathway requiring ISO 14971 risk management, electrical safety (IEC 60601), and design controls.',
      };
    }

    return {
      cdscoClass: 'Class A (Low Risk / Non-Sterile)',
      fdaRoute: 'Class I 510(k) Exempt (Establishment Registration & Listing)',
      euMdrClass: 'Class I (Annex VIII Rule 1 - Self Certification)',
      estimatedTimeline: '1 – 3 Months',
      estimatedGovFees: '₹10,000 (CDSCO) / $9,280 (FDA Annual Reg) / €3,000 (EU)',
      summary: 'Lowest statutory scrutiny tier with expedited registration, self-declaration of conformity, and baseline GMP compliance.',
    };
  };

  const determination = calculateDetermination();

  return (
    <div id="regulatory-triage-tool" className="bg-white rounded-2xl border border-brand-cloudy/30 p-6 md:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-cloudy/20 pb-4">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#00C4B7] flex items-center gap-1.5">
            <Sparkles size={14} />
            Front-Door Regulatory Navigator
          </span>
          <h3 className="font-display font-medium text-xl md:text-2xl text-brand-blue">
            Instant Medical Device Statutory Classification Triage
          </h3>
          <p className="text-xs text-brand-dusk">
            Step through our 3-question statutory triage logic to estimate your device classification, timeline, and agency fee benchmarks.
          </p>
        </div>

        {step > 1 && (
          <button
            onClick={resetTriage}
            className="text-xs text-brand-dusk hover:text-brand-blue font-semibold flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <RotateCcw size={12} />
            <span>Restart</span>
          </button>
        )}
      </div>

      {/* Wizard Steps */}
      <div className="p-6 bg-[#FAF9F5] border border-brand-cloudy/30 rounded-xl">
        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <span className="text-xs font-bold uppercase text-brand-blue">
              Step 1 of 3: Core Technology Archetype
            </span>
            <h4 className="font-display font-medium text-lg text-brand-blue">
              What format does your medical technology take?
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { id: 'hardware_device', title: 'Hardware Medical Device', desc: 'Surgical, diagnostic, or therapeutic physical apparatus' },
                { id: 'ivd_reagent', title: 'In Vitro Diagnostic (IVD)', desc: 'Reagents, test kits, instruments, or specimen receptacles' },
                { id: 'samd', title: 'Software as a Medical Device (SaMD)', desc: 'Standalone mobile app, cloud AI algorithm, or telemetry software' },
                { id: 'implantable', title: 'Implantable Biomaterial', desc: 'Permanent or bioabsorbable orthopedic, dental, or cardiovascular implant' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectProduct(item.id)}
                  className="p-4 bg-white border border-brand-cloudy/40 hover:border-brand-blue rounded-xl text-left space-y-1.5 transition hover:shadow-xs cursor-pointer"
                >
                  <span className="font-bold text-xs text-brand-blue block">
                    {item.title}
                  </span>
                  <p className="text-[11px] text-brand-dusk">
                    {item.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <span className="text-xs font-bold uppercase text-brand-blue">
              Step 2 of 3: Patient Contact & Invasiveness
            </span>
            <h4 className="font-display font-medium text-lg text-brand-blue">
              How does the device interface with the human body?
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { id: 'non_invasive', title: 'Non-Invasive', desc: 'Does not penetrate body orifices or skin (e.g. wheelchair, external sensor)' },
                { id: 'surface_contact', title: 'Surface / Mucosal Contact', desc: 'Touches intact skin or enters natural body orifices temporarily' },
                { id: 'invasive_surgical', title: 'Transiently Surgically Invasive', desc: 'Penetrates body during clinical intervention (e.g. catheter, trocar)' },
                { id: 'implantable', title: 'Long-Term Implant', desc: 'Intended to remain in body for >30 days (e.g. stent, joint replacement)' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectInvasiveness(item.id)}
                  className="p-4 bg-white border border-brand-cloudy/40 hover:border-brand-blue rounded-xl text-left space-y-1.5 transition hover:shadow-xs cursor-pointer"
                >
                  <span className="font-bold text-xs text-brand-blue block">
                    {item.title}
                  </span>
                  <p className="text-[11px] text-brand-dusk">
                    {item.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <span className="text-xs font-bold uppercase text-brand-blue">
              Step 3 of 3: Clinical Criticality
            </span>
            <h4 className="font-display font-medium text-lg text-brand-blue">
              What is the clinical consequence if the device fails or misdiagnoses?
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'wellness', title: 'Low Criticality / Supportive', desc: 'Supportive aids, patient mobility, or general diagnostic logging' },
                { id: 'diagnostic_treatment', title: 'Active Diagnosis or Treatment', desc: 'Directs therapy, detects acute pathology, or administers medications' },
                { id: 'life_support', title: 'Life-Sustaining or Critical ICU', desc: 'Maintains cardiac/respiratory function or critical emergency resuscitation' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectClinicalRole(item.id)}
                  className="p-4 bg-white border border-brand-cloudy/40 hover:border-brand-blue rounded-xl text-left space-y-1.5 transition hover:shadow-xs cursor-pointer"
                >
                  <span className="font-bold text-xs text-brand-blue block">
                    {item.title}
                  </span>
                  <p className="text-[11px] text-brand-dusk">
                    {item.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4 (Results) */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-[#00C4B7] tracking-wider">
                Preliminary Statutory Triage Outcome
              </span>
              <span className="text-xs text-brand-dusk">
                Based on CDSCO MDR 2017 & EU MDR Annex VIII
              </span>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-brand-cloudy/30 space-y-1 shadow-xs">
                <span className="text-[10px] font-bold uppercase text-brand-dusk/70 tracking-wider">
                  India (CDSCO MDR 2017)
                </span>
                <p className="font-display font-bold text-base text-brand-blue">
                  {determination.cdscoClass}
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-brand-cloudy/30 space-y-1 shadow-xs">
                <span className="text-[10px] font-bold uppercase text-brand-dusk/70 tracking-wider">
                  US FDA Route
                </span>
                <p className="font-display font-bold text-base text-brand-blue">
                  {determination.fdaRoute}
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-brand-cloudy/30 space-y-1 shadow-xs">
                <span className="text-[10px] font-bold uppercase text-brand-dusk/70 tracking-wider">
                  EU MDR 2017/745 Class
                </span>
                <p className="font-display font-bold text-base text-brand-blue">
                  {determination.euMdrClass}
                </p>
              </div>
            </div>

            {/* Timelines and Fees */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-brand-cloudy/30 flex items-center gap-3">
                <Clock className="text-[#00C4B7] shrink-0" size={24} />
                <div>
                  <span className="text-[10px] font-bold uppercase text-brand-dusk/70 tracking-wider block">
                    Estimated Time to Authorization
                  </span>
                  <span className="font-display font-bold text-sm text-brand-blue">
                    {determination.estimatedTimeline}
                  </span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-brand-cloudy/30 flex items-center gap-3">
                <Coins className="text-emerald-600 shrink-0" size={24} />
                <div>
                  <span className="text-[10px] font-bold uppercase text-brand-dusk/70 tracking-wider block">
                    Statutory Authority Fees (Approx)
                  </span>
                  <span className="font-display font-bold text-sm text-brand-blue">
                    {determination.estimatedGovFees}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-brand-dusk bg-white p-4 rounded-xl border border-brand-cloudy/30 leading-relaxed">
              {determination.summary}
            </p>

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={resetTriage}
                className="text-xs text-brand-dusk hover:underline cursor-pointer"
              >
                Start Over
              </button>

              <button
                onClick={() => {
                  if (onApplyToBooking) {
                    onApplyToBooking(`Preliminary Triage: ${determination.cdscoClass} | ${determination.fdaRoute} | ${determination.euMdrClass}`);
                  }
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#00C4B7] hover:bg-[#00b0a4] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Book Strategic Consultation with This Profile</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
