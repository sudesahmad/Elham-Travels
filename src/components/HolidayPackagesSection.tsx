import React from 'react';
import { HolidayPackage, CurrencyCode } from '../types/travel';
import { formatPrice } from '../utils/formatters';
import { Compass, Check, Calendar, ArrowRight, Star } from 'lucide-react';

interface HolidayPackagesSectionProps {
  packages: HolidayPackage[];
  currentCurrency: CurrencyCode;
  onBookPackage: (pkg: HolidayPackage) => void;
}

export const HolidayPackagesSection: React.FC<HolidayPackagesSectionProps> = ({
  packages,
  currentCurrency,
  onBookPackage,
}) => {
  const leisurePackages = packages.filter((p) => p.category !== 'Umrah');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Curated Global Escapes</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Featured International Holiday Packages
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            From private desert safaris in Dubai to turquoise ocean villas in Zanzibar. Return flights from Lagos/Abuja, luxury stays, and private excursions included.
          </p>
        </div>
      </div>

      {/* Grid of Packages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {leisurePackages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="relative h-64 overflow-hidden">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-white px-2.5 py-1 rounded-md text-xs font-semibold">
                  {pkg.durationDays} Days · {pkg.destination}
                </div>
                <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 px-2.5 py-1 rounded-md text-xs font-bold shadow">
                  {pkg.category} Tour
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-xl font-bold text-slate-900 leading-snug">
                    {pkg.title}
                  </h3>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 block uppercase">All-Inclusive</span>
                    <span className="text-xl font-black text-slate-900 tabular-nums">
                      {formatPrice(pkg.priceUSD, currentCurrency)}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mb-4">{pkg.subtitle}</p>

                {/* Highlights */}
                <div className="space-y-1.5 mb-5 text-xs text-slate-700">
                  {pkg.highlights.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Departures: {pkg.departureDates.slice(0, 2).join(', ')}</span>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between mt-auto">
              <span className="text-[11px] text-slate-500">
                Includes flights, visa & tours
              </span>
              <button
                onClick={() => onBookPackage(pkg)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Reserve Package</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
