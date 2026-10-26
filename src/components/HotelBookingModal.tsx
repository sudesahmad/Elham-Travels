import React, { useState } from 'react';
import { HotelOffer, CurrencyCode, PassengerDetails } from '../types/travel';
import { formatPrice } from '../utils/formatters';
import { 
  X, 
  Building2, 
  Calendar, 
  User, 
  CreditCard, 
  Lock, 
  CheckCircle,
  MapPin
} from 'lucide-react';

interface HotelBookingModalProps {
  hotel: HotelOffer;
  room: HotelOffer['roomTypes'][0];
  currentCurrency: CurrencyCode;
  onClose: () => void;
  onProceedToPayment: (bookingData: {
    hotel: HotelOffer;
    room: HotelOffer['roomTypes'][0];
    nights: number;
    checkInDate: string;
    checkOutDate: string;
    guest: PassengerDetails;
    totalUSD: number;
  }) => void;
}

export const HotelBookingModal: React.FC<HotelBookingModalProps> = ({
  hotel,
  room,
  currentCurrency,
  onClose,
  onProceedToPayment,
}) => {
  const [checkInDate, setCheckInDate] = useState('2026-12-05');
  const [checkOutDate, setCheckOutDate] = useState('2026-12-10');
  const [nights, setNights] = useState(5);

  const [guest, setGuest] = useState<PassengerDetails>({
    title: 'Alhaji',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '1985-05-10',
    passportNumber: '',
    passportExpiry: '2030-01-01',
    nationality: 'Nigerian',
    mealPreference: 'Breakfast Included',
  });

  const [specialRequest, setSpecialRequest] = useState('High floor room requested');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const roomSubtotalUSD = room.priceUSD * nights;
  const taxesAndServiceUSD = Math.round(roomSubtotalUSD * 0.12);
  const totalUSD = roomSubtotalUSD + taxesAndServiceUSD;

  const handleDateChange = (inDate: string, outDate: string) => {
    setCheckInDate(inDate);
    setCheckOutDate(outDate);
    const d1 = new Date(inDate);
    const d2 = new Date(outDate);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    setNights(diffDays);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!guest.firstName.trim()) errors.firstName = 'First name is required';
    if (!guest.lastName.trim()) errors.lastName = 'Last name is required';
    if (!guest.email.trim() || !guest.email.includes('@')) errors.email = 'Valid email is required';
    if (!guest.phone.trim()) errors.phone = 'Phone number is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    onProceedToPayment({
      hotel,
      room,
      nights,
      checkInDate,
      checkOutDate,
      guest,
      totalUSD
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-400 flex items-center justify-center text-slate-950 font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">{hotel.name}</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>{hotel.city}, {hotel.country} · {room.name}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Stay Dates Config */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-500 font-medium mb-1">Check-in Date</label>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => handleDateChange(e.target.value, checkOutDate)}
                className="w-full bg-white border border-slate-300 rounded p-1.5 font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-medium mb-1">Check-out Date</label>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => handleDateChange(checkInDate, e.target.value)}
                className="w-full bg-white border border-slate-300 rounded p-1.5 font-bold text-slate-800"
              />
            </div>
            <div>
              <span className="block text-slate-500 font-medium mb-1">Duration</span>
              <span className="font-extrabold text-sm text-slate-900 block mt-1.5">
                {nights} Nights Stay
              </span>
            </div>
          </div>

          {/* Guest Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-3">
              <User className="w-4 h-4 text-amber-600" />
              <span>Lead Guest Details</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
                <select
                  value={guest.title}
                  onChange={(e) => setGuest({ ...guest, title: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                >
                  <option value="Mr">Mr.</option>
                  <option value="Mrs">Mrs.</option>
                  <option value="Dr">Dr.</option>
                  <option value="Alhaji">Alhaji</option>
                  <option value="Hajiya">Hajiya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>
                <input
                  type="text"
                  value={guest.firstName}
                  onChange={(e) => setGuest({ ...guest, firstName: e.target.value })}
                  placeholder="e.g. Babatunde"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                />
                {formErrors.firstName && <span className="text-[10px] text-red-500">{formErrors.firstName}</span>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Last / Surname *</label>
                <input
                  type="text"
                  value={guest.lastName}
                  onChange={(e) => setGuest({ ...guest, lastName: e.target.value })}
                  placeholder="e.g. Alabi"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                />
                {formErrors.lastName && <span className="text-[10px] text-red-500">{formErrors.lastName}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={guest.email}
                  onChange={(e) => setGuest({ ...guest, email: e.target.value })}
                  placeholder="leadguest@example.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                />
                {formErrors.email && <span className="text-[10px] text-red-500">{formErrors.email}</span>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  value={guest.phone}
                  onChange={(e) => setGuest({ ...guest, phone: e.target.value })}
                  placeholder="+234 803 123 4567"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                />
                {formErrors.phone && <span className="text-[10px] text-red-500">{formErrors.phone}</span>}
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Special Room Requests</label>
              <input
                type="text"
                value={specialRequest}
                onChange={(e) => setSpecialRequest(e.target.value)}
                placeholder="e.g. Kaaba view high floor, early check-in, non-smoking"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>
          </div>

          {/* Pricing Box */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4 text-xs space-y-1.5 text-slate-700">
            <div className="flex justify-between">
              <span>Room Rate ({nights} nights x {formatPrice(room.priceUSD, currentCurrency)}):</span>
              <span className="font-semibold tabular-nums">{formatPrice(roomSubtotalUSD, currentCurrency)}</span>
            </div>
            <div className="flex justify-between">
              <span>Local Municipal Taxes & Service Charges (12%):</span>
              <span className="font-semibold tabular-nums">{formatPrice(taxesAndServiceUSD, currentCurrency)}</span>
            </div>
            <div className="pt-2 border-t border-amber-200 flex justify-between text-sm font-bold text-slate-900">
              <span>Total Reservation Due:</span>
              <span className="text-base text-amber-900 tabular-nums">{formatPrice(totalUSD, currentCurrency)}</span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Instant voucher confirmed upon payment</span>
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Confirm & Pay</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
