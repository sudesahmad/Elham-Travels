import React, { useState } from 'react';
import { FlightOffer, CurrencyCode, PassengerDetails } from '../types/travel';
import { formatPrice } from '../utils/formatters';
import { 
  X, 
  Plane, 
  ShieldCheck, 
  User, 
  Lock, 
  CreditCard,
  Luggage,
  Calendar
} from 'lucide-react';

interface FlightBookingModalProps {
  flight: FlightOffer;
  currentCurrency: CurrencyCode;
  onClose: () => void;
  onProceedToPayment: (bookingData: {
    flight: FlightOffer;
    passenger: PassengerDetails;
    fareBreakdown: {
      baseFareUSD: number;
      taxesAndFeesUSD: number;
      serviceFeeUSD: number;
      totalUSD: number;
    };
  }) => void;
}

export const FlightBookingModal: React.FC<FlightBookingModalProps> = ({
  flight,
  currentCurrency,
  onClose,
  onProceedToPayment,
}) => {
  const [passenger, setPassenger] = useState<PassengerDetails>({
    title: 'Mr',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '1990-01-01',
    passportNumber: '',
    passportExpiry: '2030-01-01',
    nationality: 'Nigerian',
    mealPreference: 'Standard Meal',
    wheelchairNeeded: false,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Transparent Fee Calculations
  const baseFareUSD = Math.round(flight.priceUSD * 0.78);
  const taxesAndFeesUSD = Math.round(flight.priceUSD * 0.18);
  const serviceFeeUSD = flight.priceUSD - (baseFareUSD + taxesAndFeesUSD);
  const totalUSD = flight.priceUSD;

  const validateAndProceed = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!passenger.firstName.trim()) errors.firstName = 'First name is required';
    if (!passenger.lastName.trim()) errors.lastName = 'Last name is required';
    if (!passenger.email.trim() || !passenger.email.includes('@')) errors.email = 'Valid email is required';
    if (!passenger.phone.trim()) errors.phone = 'Phone number is required';
    if (!passenger.passportNumber.trim()) errors.passportNumber = 'Passport or National ID is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    onProceedToPayment({
      flight,
      passenger,
      fareBreakdown: {
        baseFareUSD,
        taxesAndFeesUSD,
        serviceFeeUSD,
        totalUSD
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-400 flex items-center justify-center text-slate-950 font-bold">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Passenger Details & Flight Checkout</h3>
              <p className="text-xs text-slate-400">
                {flight.airline} · {flight.outbound.origin.code} ➔ {flight.outbound.destination.code} ({flight.outbound.flightNumber})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={validateAndProceed} className="p-6 space-y-6">
          {/* Flight Summary Strip */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">Outbound Flight</span>
              <span className="font-bold text-slate-900 text-sm">
                {flight.outbound.origin.city} ({flight.outbound.departureTime}) → {flight.outbound.destination.city} ({flight.outbound.arrivalTime})
              </span>
              <span className="text-slate-500 block mt-0.5">{flight.outbound.aircraft} · {flight.outbound.cabinClass}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block">Baggage Included</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1 justify-end">
                <Luggage className="w-3.5 h-3.5 text-amber-600" />
                {flight.outbound.baggageAllowance}
              </span>
            </div>
          </div>

          {/* Passenger Information */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mb-3">
              <User className="w-4 h-4 text-amber-600" />
              <span>Primary Traveler Information (Must Match Government ID/Passport)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
                <select
                  value={passenger.title}
                  onChange={(e) => setPassenger({ ...passenger, title: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="Mr">Mr.</option>
                  <option value="Mrs">Mrs.</option>
                  <option value="Ms">Ms.</option>
                  <option value="Dr">Dr.</option>
                  <option value="Alhaji">Alhaji</option>
                  <option value="Hajiya">Hajiya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>
                <input
                  type="text"
                  value={passenger.firstName}
                  onChange={(e) => setPassenger({ ...passenger, firstName: e.target.value })}
                  placeholder="e.g. Babatunde"
                  className={`w-full bg-slate-50 border rounded-lg p-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 ${
                    formErrors.firstName ? 'border-red-500 ring-red-400' : 'border-slate-300 focus:ring-amber-500'
                  }`}
                />
                {formErrors.firstName && <span className="text-[10px] text-red-500">{formErrors.firstName}</span>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Last / Surname *</label>
                <input
                  type="text"
                  value={passenger.lastName}
                  onChange={(e) => setPassenger({ ...passenger, lastName: e.target.value })}
                  placeholder="e.g. Alabi"
                  className={`w-full bg-slate-50 border rounded-lg p-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 ${
                    formErrors.lastName ? 'border-red-500 ring-red-400' : 'border-slate-300 focus:ring-amber-500'
                  }`}
                />
                {formErrors.lastName && <span className="text-[10px] text-red-500">{formErrors.lastName}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email (for E-Ticket delivery) *</label>
                <input
                  type="email"
                  value={passenger.email}
                  onChange={(e) => setPassenger({ ...passenger, email: e.target.value })}
                  placeholder="traveler@example.com"
                  className={`w-full bg-slate-50 border rounded-lg p-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 ${
                    formErrors.email ? 'border-red-500 ring-red-400' : 'border-slate-300 focus:ring-amber-500'
                  }`}
                />
                {formErrors.email && <span className="text-[10px] text-red-500">{formErrors.email}</span>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (with country code) *</label>
                <input
                  type="tel"
                  value={passenger.phone}
                  onChange={(e) => setPassenger({ ...passenger, phone: e.target.value })}
                  placeholder="+234 803 123 4567"
                  className={`w-full bg-slate-50 border rounded-lg p-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 ${
                    formErrors.phone ? 'border-red-500 ring-red-400' : 'border-slate-300 focus:ring-amber-500'
                  }`}
                />
                {formErrors.phone && <span className="text-[10px] text-red-500">{formErrors.phone}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Passport / NIN *</label>
                <input
                  type="text"
                  value={passenger.passportNumber}
                  onChange={(e) => setPassenger({ ...passenger, passportNumber: e.target.value.toUpperCase() })}
                  placeholder="A12345678"
                  className={`w-full bg-slate-50 border rounded-lg p-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 ${
                    formErrors.passportNumber ? 'border-red-500 ring-red-400' : 'border-slate-300 focus:ring-amber-500'
                  }`}
                />
                {formErrors.passportNumber && <span className="text-[10px] text-red-500">{formErrors.passportNumber}</span>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nationality</label>
                <input
                  type="text"
                  value={passenger.nationality}
                  onChange={(e) => setPassenger({ ...passenger, nationality: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={passenger.dob}
                  onChange={(e) => setPassenger({ ...passenger, dob: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Special Request */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">In-Flight Meal Preference</label>
                <select
                  value={passenger.mealPreference}
                  onChange={(e) => setPassenger({ ...passenger, mealPreference: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="Standard Meal">Standard Airline Catering</option>
                  <option value="Halal / Moslem Meal (MOML)">Halal / Moslem Meal (MOML)</option>
                  <option value="Vegetarian Meal (VGML)">Vegetarian Meal (VGML)</option>
                  <option value="Diabetic Meal (DBML)">Diabetic Meal (DBML)</option>
                  <option value="Child Meal (CHML)">Child Meal (CHML)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="wheelchair"
                  checked={passenger.wheelchairNeeded}
                  onChange={(e) => setPassenger({ ...passenger, wheelchairNeeded: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 accent-amber-500"
                />
                <label htmlFor="wheelchair" className="text-xs text-slate-700 cursor-pointer">
                  Request Airport Wheelchair & Special Assistance
                </label>
              </div>
            </div>
          </div>

          {/* Transparent Price Breakdown */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4 text-xs">
            <h5 className="font-bold text-slate-900 mb-2 flex items-center justify-between">
              <span>Transparent Fare Breakdown (NCAA / IATA Compliant)</span>
              <span className="text-[11px] text-amber-800 font-normal">All figures itemized</span>
            </h5>
            <div className="space-y-1.5 text-slate-600">
              <div className="flex justify-between">
                <span>Base Airline Fare:</span>
                <span className="font-medium tabular-nums">{formatPrice(baseFareUSD, currentCurrency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Aviation Fuel Surcharges & Passenger Security Fees:</span>
                <span className="font-medium tabular-nums">{formatPrice(taxesAndFeesUSD, currentCurrency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Elham Travels Standard Issuance & Concierge Fee:</span>
                <span className="font-medium tabular-nums">{formatPrice(serviceFeeUSD, currentCurrency)}</span>
              </div>
              <div className="pt-2 border-t border-amber-200 flex justify-between text-sm font-bold text-slate-900">
                <span>Total Amount Due:</span>
                <span className="text-base text-amber-900 tabular-nums">{formatPrice(totalUSD, currentCurrency)}</span>
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-bit SSL encrypted booking session</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Continue to Secure Payment</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
