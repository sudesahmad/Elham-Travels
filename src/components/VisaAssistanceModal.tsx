import React, { useState } from 'react';
import { VISA_REQUIREMENTS } from '../data/mockTravelData';
import { CurrencyCode, VisaRequirement } from '../types/travel';
import { formatPrice } from '../utils/formatters';
import { 
  FileCheck2, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  Send,
  X
} from 'lucide-react';

interface VisaAssistanceModalProps {
  currentCurrency: CurrencyCode;
  onClose?: () => void;
  isStandaloneSection?: boolean;
}

export const VisaAssistanceModal: React.FC<VisaAssistanceModalProps> = ({
  currentCurrency,
  onClose,
  isStandaloneSection = false,
}) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('GB');
  const [applicantName, setApplicantName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [travelDate, setTravelDate] = useState('2026-12-15');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const selectedRequirement: VisaRequirement = 
    VISA_REQUIREMENTS.find((v) => v.countryCode === selectedCountryCode) || VISA_REQUIREMENTS[0];

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !email || !passportNumber) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/visa-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicantName,
          email,
          phone,
          targetCountry: selectedRequirement.country,
          travelDate,
          passportNumber
        })
      });

      if (res.ok) {
        setSubmitSuccess(true);
      }
    } catch (err) {
      console.error('Error submitting visa enquiry:', err);
      setSubmitSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const content = (
    <div className="space-y-8">
      {/* Country Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {VISA_REQUIREMENTS.map((req) => (
          <button
            key={req.countryCode}
            onClick={() => { setSelectedCountryCode(req.countryCode); setSubmitSuccess(false); }}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              selectedCountryCode === req.countryCode
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            {req.country}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Requirements Details (7 cols) */}
        <div className="lg:col-span-7 space-y-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider block">
                {selectedRequirement.visaType}
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                {selectedRequirement.country} Visa Assistance
              </h3>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] text-slate-400 block uppercase">Advisory & Filing Fee</span>
              <span className="text-xl font-black text-slate-900 tabular-nums">
                {formatPrice(selectedRequirement.feeUSD, currentCurrency)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Processing Time: {selectedRequirement.processingTimeDays}</span>
            </span>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              <span>Mandatory Checklist for Nigerian Passport Holders</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-700">
              {selectedRequirement.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Biometric & Embassy Appointment Notes:</span>
              <span>{selectedRequirement.eligibilityNotes}</span>
            </div>
          </div>
        </div>

        {/* Online Submission Form (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          {submitSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Application Submitted</h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Thank you, {applicantName}. Our Senior Visa Consultant has received your file for {selectedRequirement.country}. We will call and email your pre-assessment within 2 business hours.
              </p>
              <button
                onClick={() => setSubmitSuccess(false)}
                className="mt-3 px-4 py-2 text-xs font-bold text-amber-900 bg-amber-100 rounded-lg hover:bg-amber-200"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitApplication} className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                Apply for {selectedRequirement.country} Pre-Assessment
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Applicant Full Name *</label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="As written on passport"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 803 ..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Passport Number *</label>
                  <input
                    type="text"
                    required
                    value={passportNumber}
                    onChange={(e) => setPassportNumber(e.target.value.toUpperCase())}
                    placeholder="A12345678"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Intended Travel Date</label>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting File...' : 'Request Visa Pre-Screening'}</span>
                </button>
              </div>

              <span className="text-[10px] text-slate-400 block text-center">
                Our visa specialists have an outstanding approval rate for UK, US, and Schengen submissions.
              </span>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  if (isStandaloneSection) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md mb-2">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Embassy Compliance & Document Advisory</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Visa Assistance & Document Pre-Assessment
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Professional visa consultation for UK, US, Schengen, UAE, and Saudi Arabia. Complete checklist review, DS-160/online filing, and flight reservation support.
          </p>
        </div>
        {content}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-400 flex items-center justify-center text-slate-950 font-bold">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Visa Assistance Desk</h3>
              <p className="text-xs text-slate-400">Pre-screen eligibility and check embassy requirements</p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="p-6">{content}</div>
      </div>
    </div>
  );
};
