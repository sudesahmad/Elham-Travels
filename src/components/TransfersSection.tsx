import React, { useState } from 'react';
import { TransferOption, CurrencyCode } from '../types/travel';
import { TRANSFERS_DATA } from '../data/mockTravelData';
import { formatPrice } from '../utils/formatters';
import { 
  Car, 
  Users, 
  Luggage, 
  Clock, 
  ShieldCheck, 
  Check, 
  MapPin, 
  Calendar,
  ArrowRight
} from 'lucide-react';

interface TransfersSectionProps {
  currentCurrency: CurrencyCode;
  onBookTransfer: (transfer: TransferOption, details: {
    pickup: string;
    dropoff: string;
    date: string;
    time: string;
  }) => void;
}

export const TransfersSection: React.FC<TransfersSectionProps> = ({
  currentCurrency,
  onBookTransfer,
}) => {
  const [pickup, setPickup] = useState('Murtala Muhammed International Airport (LOS)');
  const [dropoff, setDropoff] = useState('Victoria Island, Lagos');
  const [date, setDate] = useState('2026-11-20');
  const [time, setTime] = useState('14:30');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('tr-01');

  const selectedVehicle = TRANSFERS_DATA.find((t) => t.id === selectedVehicleId) || TRANSFERS_DATA[0];

  const handleBook = () => {
    onBookTransfer(selectedVehicle, { pickup, dropoff, date, time });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md mb-2">
          <Car className="w-3.5 h-3.5" />
          <span>Executive Ground Mobility</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Airport Chauffeur & Private Vehicle Transfers
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-2">
          Punctual, discreet airport pickups in Lagos, Abuja, Dubai, and Jeddah. Professional suited chauffeurs, flight tracking, and complimentary 60-minute wait time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Booking Parameters Form (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Transfer Itinerary Details
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Pickup Location</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-amber-600 absolute left-3 top-2.5" />
              <input
                type="text"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                placeholder="Airport, terminal or hotel"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Destination / Drop-off</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                placeholder="Hotel address, estate, or city centre"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pickup Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Flight Arrival Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-900"
              />
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <span className="font-bold text-slate-900 block">Service Guarantees:</span>
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <Check className="w-3.5 h-3.5" />
              <span>Flight delays monitored in real-time</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <Check className="w-3.5 h-3.5" />
              <span>Nameboard meet & greet in arrivals hall</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <Check className="w-3.5 h-3.5" />
              <span>Fixed rate, no surge pricing or hidden toll charges</span>
            </div>
          </div>
        </div>

        {/* Vehicle Classes Grid (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Select Your Vehicle Category
          </h3>

          <div className="space-y-3">
            {TRANSFERS_DATA.map((vehicle) => {
              const isSelected = selectedVehicleId === vehicle.id;

              return (
                <div
                  key={vehicle.id}
                  onClick={() => setSelectedVehicleId(vehicle.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white ${
                    isSelected
                      ? 'border-amber-500 ring-2 ring-amber-400/20 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-slate-900">
                          {vehicle.category}
                        </span>
                        <span className="text-xs text-slate-500">({vehicle.vehicleModel})</span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-600 mt-2">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>Max {vehicle.maxPassengers} Pax</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Luggage className="w-3.5 h-3.5 text-slate-400" />
                          <span>Max {vehicle.maxLuggage} Suitcases</span>
                        </span>
                        <span className="flex items-center gap-1 text-emerald-700">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Free cancel up to {vehicle.freeCancellationHours}h</span>
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        {vehicle.features.map((feat, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded font-medium">
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-left sm:text-right shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <span className="text-[10px] text-slate-400 block uppercase">All-Inclusive Rate</span>
                      <span className="text-2xl font-black text-slate-900 tabular-nums">
                        {formatPrice(vehicle.priceUSD, currentCurrency)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVehicleId(vehicle.id);
                          handleBook();
                        }}
                        className={`mt-2 px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                          isSelected
                            ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm'
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        <span>Book Transfer</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
