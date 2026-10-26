import React from 'react';
import { 
  PhoneCall, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Download, 
  Smartphone, 
  ArrowUpRight 
} from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: any) => void;
  onOpenCorporate: () => void;
  onOpenVisa: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTab,
  onOpenCorporate,
  onOpenVisa,
}) => {
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800">
      {/* Mobile App Download Teaser Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-amber-950/80 border-b border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xl shrink-0 shadow-lg shadow-amber-500/20">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Download the Elham Travels Mobile App
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Native architecture for iOS and Android. Mobile boarding passes, offline e-tickets, and instant gate change notifications.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-white flex items-center gap-2 transition-colors">
              <Download className="w-4 h-4 text-amber-400" />
              <span>Apple App Store</span>
            </button>
            <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-white flex items-center gap-2 transition-colors">
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Google Play Store</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/aistudio/WhatsApp_Image_2026-10-10_at_5.36.13_PM_40258a60.jpeg"
                alt="Elham Travels Logo - Elham International Limited"
                className="w-12 h-12 rounded-xl object-contain bg-white p-0.5 shadow-md shadow-blue-900/30 border border-slate-700 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="text-xl font-extrabold tracking-tight text-white block uppercase">
                  ELHAM <span className="text-amber-400 font-serif">TRAVELS</span>
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block">
                  Elham International Limited
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Elham Travels is operated by Elham International Limited (RC 7412148), Nigeria's premier corporate and leisure travel management company. Delivering verified flight ticketing, 5-star Umrah pilgrimages, luxury holiday escapes, and embassy visa advisory.
            </p>

            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Kano Office:</strong> C18 Alhamsad Plaza, Zoo Road, Kano</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Lagos Office:</strong> 42 Adetokunbo Ademola St, Victoria Island, Lagos</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Abuja Office:</strong> Plot 742 Central Business District, Abuja, FCT</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/2348109632718"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp: +234 810 963 2718</span>
              </a>
            </div>
          </div>

          {/* Quick Travel Services */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              Travel Engines
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => onSelectTab('flights')} className="hover:text-amber-400 transition-colors">
                  International & Domestic Flights
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('hotels')} className="hover:text-amber-400 transition-colors">
                  Worldwide 5-Star Hotels
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('umrah')} className="hover:text-amber-400 transition-colors">
                  VIP Umrah & Hajj Packages
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('packages')} className="hover:text-amber-400 transition-colors">
                  Dubai & Zanzibar Holiday Tours
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('transfers')} className="hover:text-amber-400 transition-colors">
                  Airport Executive Chauffeurs
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('partners')} className="hover:text-amber-400 transition-colors font-medium text-amber-300">
                  Global Partners & Affiliates
                </button>
              </li>
            </ul>
          </div>

          {/* Business & Support */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              Corporate & Advisory
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={onOpenCorporate} className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  <span>Corporate Accounts & SLA</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button onClick={onOpenVisa} className="hover:text-amber-400 transition-colors">
                  Visa Document Pre-Screening
                </button>
              </li>
              <li>
                <a href="mailto:support@elhamtravels.ng" className="hover:text-amber-400 transition-colors">
                  24/7 Ticketing Desk Email
                </a>
              </li>
              <li>
                <span className="text-slate-500">IATA & NCAA Regulated</span>
              </li>
              <li>
                <span className="text-slate-500">NANTA Registered Member</span>
              </li>
            </ul>
          </div>

          {/* Payment & Security */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              Secure Payments
            </h4>
            <p className="text-slate-400 text-[11px]">
              All card and bank transfer transactions are protected by PCI-DSS Level 1 encryption and 2-factor authentication.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] text-slate-300 font-medium">
              <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded">Paystack</span>
              <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded">Flutterwave</span>
              <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded">Mastercard</span>
              <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded">Visa</span>
              <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded">Verve</span>
            </div>
          </div>
        </div>

        {/* Regulatory Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Elham International Limited (RC 7412148). All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Conditions of Carriage</span>
            <span>·</span>
            <span>NCAA Passenger Rights</span>
            <span>·</span>
            <span>Refund Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
