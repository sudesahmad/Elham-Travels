import React from 'react';
import { CurrencyCode, TravelTab } from '../types/travel';
import { CURRENCY_RATES } from '../data/mockTravelData';
import { Globe, User, ShieldCheck, PhoneCall, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentCurrency: CurrencyCode;
  onCurrencyChange: (c: CurrencyCode) => void;
  activeTab: TravelTab;
  onSelectTab: (tab: TravelTab) => void;
  onOpenAssistant: () => void;
  onOpenCustomerPortal: () => void;
  onOpenAdminPortal: () => void;
  isAdminView: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentCurrency,
  onCurrencyChange,
  activeTab,
  onSelectTab,
  onOpenAssistant,
  onOpenCustomerPortal,
  onOpenAdminPortal,
  isAdminView,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      {/* Top Utility Bar for Corporate & Trust Signaling */}
      <div className="hidden lg:flex items-center justify-between px-8 py-1.5 text-xs text-slate-400 border-b border-slate-800/60 bg-slate-950/40">
        <div className="flex items-center gap-6">
          <span className="text-slate-300 font-medium">Elham International Limited</span>
          <span className="text-slate-500">·</span>
          <span>RC: 7412148</span>
          <span className="text-slate-500">·</span>
          <span>IATA Accredited & NCAA Licensed</span>
          <span className="text-slate-500">·</span>
          <span>Kano · Lagos · Abuja · Global</span>
        </div>
        <div className="flex items-center gap-5">
          <a 
            href="https://wa.me/2348109632718" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1.5 font-medium"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>24/7 VIP Travel Desk: +234 810 963 2718</span>
          </a>
          <span className="text-slate-600">|</span>
          <button
            onClick={onOpenAdminPortal}
            className={`transition-colors flex items-center gap-1 text-xs font-medium ${isAdminView ? 'text-amber-400' : 'text-slate-400 hover:text-white'}`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isAdminView ? 'Return to Portal' : 'Staff Portal'}</span>
          </button>
        </div>
      </div>

      {/* Main 3-Zone Top Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => onSelectTab('flights')} 
            className="text-left group flex items-center gap-3 cursor-pointer"
          >
            <img 
              src="/assets/aistudio/WhatsApp_Image_2026-10-10_at_5.36.13_PM_40258a60.jpeg"
              alt="Elham Travels Logo - Elham International Limited"
              className="w-12 h-12 rounded-xl object-contain bg-white p-0.5 shadow-md shadow-blue-900/30 border border-slate-700 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white block uppercase">
                ELHAM <span className="text-amber-400 font-serif font-bold">TRAVELS</span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-wider font-medium block uppercase">
                Elham International Limited
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Single-Line Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onSelectTab('flights')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white pb-1 border-b-2 ${
              activeTab === 'flights' ? 'text-amber-400 border-amber-400 font-semibold' : 'border-transparent text-slate-300'
            }`}
          >
            Flights
          </button>
          <button
            onClick={() => onSelectTab('hotels')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white pb-1 border-b-2 ${
              activeTab === 'hotels' ? 'text-amber-400 border-amber-400 font-semibold' : 'border-transparent text-slate-300'
            }`}
          >
            Hotels
          </button>
          <button
            onClick={() => onSelectTab('umrah')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white pb-1 border-b-2 ${
              activeTab === 'umrah' ? 'text-amber-400 border-amber-400 font-semibold' : 'border-transparent text-slate-300'
            }`}
          >
            Umrah & Hajj
          </button>
          <button
            onClick={() => onSelectTab('packages')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white pb-1 border-b-2 ${
              activeTab === 'packages' ? 'text-amber-400 border-amber-400 font-semibold' : 'border-transparent text-slate-300'
            }`}
          >
            Holiday Packages
          </button>
          <button
            onClick={() => onSelectTab('visa')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white pb-1 border-b-2 ${
              activeTab === 'visa' ? 'text-amber-400 border-amber-400 font-semibold' : 'border-transparent text-slate-300'
            }`}
          >
            Visa Assistance
          </button>
          <button
            onClick={() => onSelectTab('transfers')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white pb-1 border-b-2 ${
              activeTab === 'transfers' ? 'text-amber-400 border-amber-400 font-semibold' : 'border-transparent text-slate-300'
            }`}
          >
            Transfers
          </button>
          <button
            onClick={() => onSelectTab('partners')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white pb-1 border-b-2 ${
              activeTab === 'partners' ? 'text-amber-400 border-amber-400 font-semibold' : 'border-transparent text-slate-300'
            }`}
          >
            Partners
          </button>
          <button
            onClick={onOpenAssistant}
            className="transition-colors whitespace-nowrap shrink-0 text-amber-300 hover:text-amber-200 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Concierge</span>
          </button>
        </nav>

        {/* Zone 3: Currency Switcher & Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Currency Switcher */}
          <div className="flex items-center bg-slate-800/80 rounded-lg px-2 py-1 border border-slate-700 text-xs">
            <Globe className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
            <select
              value={currentCurrency}
              onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
              aria-label="Select Currency"
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-1"
            >
              {Object.keys(CURRENCY_RATES).map((code) => (
                <option key={code} value={code} className="bg-slate-900 text-white">
                  {code} ({CURRENCY_RATES[code].symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Account Button */}
          <button
            onClick={onOpenCustomerPortal}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-amber-400 rounded-lg hover:bg-amber-300 transition-colors shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
          >
            <User className="w-3.5 h-3.5" />
            <span>My Bookings & Miles</span>
          </button>
        </div>
      </div>
    </header>
  );
};
