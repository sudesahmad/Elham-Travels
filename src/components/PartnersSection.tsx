import React, { useState } from 'react';
import { PARTNERS_DATA, PartnerItem } from '../data/mockTravelData';
import { 
  Building2, 
  Plane, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink,
  Award,
  Sparkles
} from 'lucide-react';

export const PartnersSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'airline' | 'hospitality' | 'payment' | 'accreditation'>('all');

  const filteredPartners = activeCategory === 'all'
    ? PARTNERS_DATA
    : PARTNERS_DATA.filter((p) => p.category === activeCategory);

  return (
    <section className="bg-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8 border-t border-b border-slate-800">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Authorized Global Network</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Global Partners & Authorized Affiliates
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            Elham International Limited collaborates directly with world-leading airlines, luxury hospitality groups, certified payment processors, and aviation regulatory authorities.
          </p>
        </div>

        {/* Category Segment Controls */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8 text-xs font-semibold scrollbar-none">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            All Partners ({PARTNERS_DATA.length})
          </button>
          <button
            onClick={() => setActiveCategory('airline')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeCategory === 'airline'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            <span>Airlines</span>
          </button>
          <button
            onClick={() => setActiveCategory('hospitality')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeCategory === 'hospitality'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Global Hotel Chains</span>
          </button>
          <button
            onClick={() => setActiveCategory('payment')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeCategory === 'payment'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Payment Gateways</span>
          </button>
          <button
            onClick={() => setActiveCategory('accreditation')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              activeCategory === 'accreditation'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Aviation & Technology</span>
          </button>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredPartners.map((partner) => (
            <div
              key={partner.id}
              className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 hover:border-amber-400/60 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-base font-extrabold text-white tracking-wide">
                    {partner.logoText}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded">
                    {partner.badge}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-200 mb-1">
                  {partner.name}
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {partner.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-emerald-400">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Direct Integration / Verified Partner</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Partner Trust Ticker / Guarantee */}
        <div className="mt-10 p-4 bg-slate-950/50 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-around gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>IATA Billing & Settlement Plan (BSP)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>NCAA Regulated Passenger Protections</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>Direct Haram Plaza Suite Allocations</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-amber-400" />
            <span>PCI-DSS Level 1 Encrypted Processing</span>
          </div>
        </div>
      </div>
    </section>
  );
};
