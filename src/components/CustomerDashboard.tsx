import React, { useState } from 'react';
import { BookingRecord, CurrencyCode, UserProfile } from '../types/travel';
import { formatPrice } from '../utils/formatters';
import { 
  User, 
  Ticket, 
  Calendar, 
  ShieldCheck, 
  AlertCircle, 
  Clock, 
  Printer, 
  X, 
  Award, 
  ArrowRight,
  Plane,
  Building2,
  Car,
  Compass,
  FileCheck2,
  RefreshCw,
  QrCode
} from 'lucide-react';

interface CustomerDashboardProps {
  user: UserProfile;
  bookings: BookingRecord[];
  currentCurrency: CurrencyCode;
  onClose: () => void;
  onCancelBooking: (bookingId: string) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  user,
  bookings,
  currentCurrency,
  onClose,
  onCancelBooking,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'bookings' | 'profile' | 'miles'>('bookings');
  const [selectedTicket, setSelectedTicket] = useState<BookingRecord | null>(null);
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);

  const handleRequestRefund = (bId: string) => {
    onCancelBooking(bId);
    setCancellingBookingId(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-slate-950 font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">{user.fullName}</h3>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded">
                  {user.loyaltyTier} Member
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Member ID: {user.frequentFlyerNo} · {user.loyaltyMiles.toLocaleString()} Royal Miles
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-2 flex items-center gap-4 text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveSubTab('bookings')}
            className={`py-2 px-3 rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'bookings'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Bookings & E-Tickets ({bookings.length})
          </button>
          <button
            onClick={() => setActiveSubTab('miles')}
            className={`py-2 px-3 rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'miles'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Royal Miles & Loyalty Tier
          </button>
          <button
            onClick={() => setActiveSubTab('profile')}
            className={`py-2 px-3 rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'profile'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Passenger Profile & Documents
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: BOOKINGS */}
          {activeSubTab === 'bookings' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900">
                Active Itineraries & Booking History
              </h4>

              {bookings.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-300 rounded-xl">
                  <Ticket className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">No bookings found yet. Explore our flight or hotel search to book your next journey.</p>
                </div>
              ) : (
                bookings.map((booking) => {
                  const isRefundRequested = booking.status === 'REFUND_REQUESTED';
                  const isRefunded = booking.status === 'REFUNDED';

                  return (
                    <div
                      key={booking.id}
                      className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 shadow-sm space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800">
                            {booking.type === 'flight' && <Plane className="w-4 h-4 text-amber-600" />}
                            {booking.type === 'hotel' && <Building2 className="w-4 h-4 text-blue-600" />}
                            {booking.type === 'transfer' && <Car className="w-4 h-4 text-emerald-600" />}
                            {booking.type === 'package' && <Compass className="w-4 h-4 text-purple-600" />}
                          </div>
                          <div>
                            <span className="font-mono text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              {booking.referenceNumber}
                            </span>
                            <h5 className="font-bold text-slate-900 text-sm mt-0.5">{booking.title}</h5>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                              booking.status === 'TICKETED' || booking.status === 'CONFIRMED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : isRefundRequested
                                ? 'bg-amber-100 text-amber-800'
                                : isRefunded
                                ? 'bg-slate-100 text-slate-700'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {booking.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Travel Dates</span>
                          <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {booking.travelDate} {booking.returnDate && `→ ${booking.returnDate}`}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Lead Passenger</span>
                          <span className="font-semibold text-slate-800 block mt-0.5">
                            {booking.passenger.title} {booking.passenger.firstName} {booking.passenger.lastName}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Paid Amount</span>
                          <span className="font-black text-slate-900 tabular-nums text-sm block mt-0.5">
                            {formatPrice(booking.totalAmountUSD, currentCurrency)}
                          </span>
                        </div>
                      </div>

                      {booking.notes && (
                        <div className="bg-slate-50 p-2.5 rounded-lg text-xs text-slate-600 border border-slate-200">
                          <strong>Service Status:</strong> {booking.notes}
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                        <span className="text-slate-400 text-[11px]">
                          PNR / Supplier Code: <strong className="font-mono text-slate-700">{booking.supplierConfirmationId}</strong>
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedTicket(booking)}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Ticket className="w-3.5 h-3.5" />
                            <span>View Digital E-Ticket</span>
                          </button>

                          {!isRefundRequested && !isRefunded && (
                            <button
                              onClick={() => setCancellingBookingId(booking.id)}
                              className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 font-semibold rounded-lg transition-colors cursor-pointer"
                            >
                              Request Cancellation / Refund
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: LOYALTY MILES */}
          {activeSubTab === 'miles' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-amber-400 font-bold text-xs uppercase tracking-wider block">
                      Elham Royal Miles Club
                    </span>
                    <h3 className="text-2xl font-black mt-1">
                      {user.loyaltyMiles.toLocaleString()} Miles Available
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">Tier Status: {user.loyaltyTier} VIP Member</p>
                  </div>
                  <Award className="w-12 h-12 text-amber-400 stroke-1" />
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Your Referral Code</span>
                    <span className="font-mono font-bold text-amber-300 text-sm">ELHAM-VIP-8821</span>
                  </div>
                  <button className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg transition-colors">
                    Redeem Miles for Upgrade
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">Priority Check-In</span>
                  <span className="text-slate-500">Fast-track check-in at MMA2 and MMIA Lagos airport desks.</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">Lounge Access</span>
                  <span className="text-slate-500">Complimentary VIP lounge access for international flights.</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">Extra 10kg Baggage</span>
                  <span className="text-slate-500">Free additional baggage allowance on partner airlines.</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROFILE */}
          {activeSubTab === 'profile' && (
            <div className="space-y-4 max-w-xl text-xs">
              <h4 className="text-sm font-bold text-slate-900">Personal Information & Travel Passports</h4>
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Full Name:</span>
                  <strong className="text-slate-900">{user.fullName}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Email Address:</span>
                  <strong className="text-slate-900">{user.email}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Verified Phone:</span>
                  <strong className="text-slate-900">{user.phone}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Passport Number:</span>
                  <strong className="text-slate-900 font-mono">{user.passportNo || 'A10984251'}</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Nationality:</span>
                  <strong className="text-slate-900">Nigerian</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CANCELLATION & REFUND CONFIRMATION MODAL */}
        {cancellingBookingId && (
          <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl">
              <div className="flex items-center gap-2 text-amber-700 font-bold">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <span>Confirm Refund Request</span>
              </div>
              <p className="text-xs text-slate-600">
                Per airline and hotel fare conditions, this booking is eligible for an <strong>85% refund</strong> of the total fare. A 15% cancellation & administrative charge applies.
              </p>
              <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-1 text-slate-700 border border-slate-200">
                <div className="flex justify-between">
                  <span>Refund Method:</span>
                  <strong>Original payment source (Card / Bank Transfer)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Processing Time:</span>
                  <strong>2 - 3 Business Days</strong>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setCancellingBookingId(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                >
                  Keep Booking
                </button>
                <button
                  onClick={() => handleRequestRefund(cancellingBookingId)}
                  className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  Confirm & Submit Refund Request
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DIGITAL TICKET POPUP */}
        {selectedTicket && (
          <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-300 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2.5">
                  <img 
                    src="/assets/aistudio/WhatsApp_Image_2026-10-10_at_5.36.13_PM_40258a60.jpeg"
                    alt="Elham Travels Logo"
                    className="w-10 h-10 rounded-lg object-contain bg-white p-0.5 border border-slate-300 shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase">ELHAM TRAVELS</h4>
                    <span className="text-[10px] text-slate-500">Operated by Elham International Limited · RC 7412148</span>
                  </div>
                </div>
                <button onClick={() => setSelectedTicket(null)} className="p-1 text-slate-400 hover:text-slate-800">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-800">
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Booking Reference</span>
                    <strong className="font-mono text-sm text-amber-900">{selectedTicket.referenceNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Supplier PNR</span>
                    <strong className="font-mono text-sm text-slate-900">{selectedTicket.supplierConfirmationId}</strong>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] block">Itinerary</span>
                  <span className="font-bold text-sm block">{selectedTicket.title}</span>
                  <span className="text-slate-500 text-[11px] block">{selectedTicket.detailsSummary}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Passenger Name</span>
                    <span className="font-semibold">{selectedTicket.passenger.title} {selectedTicket.passenger.firstName} {selectedTicket.passenger.lastName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Passport / NIN</span>
                    <span className="font-mono font-semibold">{selectedTicket.passenger.passportNumber}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Status: <strong>{selectedTicket.status}</strong></span>
                    <span className="text-[10px] text-slate-400 block">E-Ticket: {selectedTicket.eTicketNumber}</span>
                  </div>
                  <QrCode className="w-12 h-12 text-slate-900" />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Ticket</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
