import React from 'react';
import { HolidayPackage, CurrencyCode } from '../types/travel';
import { formatPrice } from '../utils/formatters';
import { 
  MoonStar, 
  CheckCircle2, 
  Train, 
  Hotel, 
  Droplet, 
  Calendar, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';

interface UmrahHajjSectionProps {
  packages: HolidayPackage[];
  currentCurrency: CurrencyCode;
  onBookPackage: (pkg: HolidayPackage) => void;
}

export const UmrahHajjSection: React.FC<UmrahHajjSectionProps> = ({
  packages,
  currentCurrency,
  onBookPackage,
}) => {
  const umrahPackages = packages.filter((p) => p.category === 'Umrah');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold mb-2">
          <MoonStar className="w-3.5 h-3.5 text-amber-600" />
          <span>Spiritual Journeys with Distinction</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          VIP Umrah & Hajj Pilgrimage Packages
        </h2>
        <p className="text-sm text-slate-600 mt-2">
          Experience sacred worship in unmatched comfort. 5-Star Haram-view suites, first-class Haramain high-speed bullet train transfers, and expert scholarly guidance from Nigeria to the Holy Land.
        </p>
      </div>

      {/* Feature Pillar Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
            <Hotel className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block">Haram Plaza Access</span>
            <span className="text-[11px] text-slate-500">Fairmont Clock Tower & Oberoi</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
            <Train className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block">Haramain Bullet Train</span>
            <span className="text-[11px] text-slate-500">1h 50m VIP First Class ride</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-800 shrink-0">
            <Droplet className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block">5L Zamzam Guaranteed</span>
            <span className="text-[11px] text-slate-500">Official return airport allowance</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-800 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block">Saudi eVisa Fast-Track</span>
            <span className="text-[11px] text-slate-500">Issued within 24-48 hours</span>
          </div>
        </div>
      </div>

      {/* Package Showcase */}
      <div className="space-y-8">
        {umrahPackages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0"
          >
            {/* Visual Column */}
            <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full">
              <img
                src={pkg.image}
                alt={pkg.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent lg:hidden" />
              <div className="absolute top-4 left-4 bg-amber-400 text-slate-950 px-3 py-1 rounded-md text-xs font-bold shadow">
                {pkg.durationDays} Days / {pkg.durationNights} Nights
              </div>
            </div>

            {/* In-depth Details Column */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                    {pkg.destination} · {pkg.country}
                  </span>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">All-Inclusive Package</span>
                    <span className="text-2xl font-black text-slate-900 tabular-nums">
                      {formatPrice(pkg.priceUSD, currentCurrency)}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {pkg.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 mb-5">
                  {pkg.subtitle}
                </p>

                {/* Highlights */}
                <div className="space-y-2 mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Sacred Journey Highlights
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                    {pkg.highlights.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Departure Dates */}
                <div className="flex flex-wrap items-center gap-2 mb-6 text-xs text-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-800">Available Departures:</span>
                  {pkg.departureDates.map((date, idx) => (
                    <span key={idx} className="bg-slate-100 px-2 py-0.5 rounded text-slate-800 font-medium">
                      {date}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Strip */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="text-xs text-slate-500">
                  Includes return flights, 5★ hotels, Umrah visa, transfers & guided Ziyarah.
                </span>
                <button
                  onClick={() => onBookPackage(pkg)}
                  className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <span>Book Umrah Package</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
