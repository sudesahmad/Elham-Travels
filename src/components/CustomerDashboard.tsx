import React, { useState } from 'react';
import { 
  BookingRecord, 
  CurrencyCode, 
  UserProfile, 
  LoyaltyReward, 
  RedeemedVoucher, 
  MilesTransaction 
} from '../types/travel';
import { CATALOG_LOYALTY_REWARDS } from '../data/mockTravelData';
import { formatPrice } from '../utils/formatters';
import { 
  User, 
  Ticket, 
  Calendar, 
  AlertCircle, 
  Printer, 
  X, 
  Award, 
  ArrowRight,
  Plane,
  Building2,
  Car,
  Compass,
  FileCheck2,
  QrCode,
  Sparkles,
  Gift,
  CheckCircle2,
  Copy,
  Check,
  ChevronRight,
  Clock,
  ShieldCheck,
  Zap,
  Coffee,
  Briefcase,
  History,
  TrendingUp,
  Tag
} from 'lucide-react';

interface CustomerDashboardProps {
  user: UserProfile;
  bookings: BookingRecord[];
  currentCurrency: CurrencyCode;
  onClose: () => void;
  onCancelBooking: (bookingId: string) => void;
  onUpdateUser?: (updatedUser: UserProfile) => void;
}

const TIER_CONFIG = {
  Silver: {
    name: 'Silver Club',
    minMiles: 0,
    maxMiles: 9999,
    nextTier: 'Gold' as const,
    nextTierMiles: 10000,
    badgeBg: 'bg-slate-200 text-slate-800 border-slate-300',
    cardGradient: 'from-slate-800 via-slate-700 to-zinc-900 border-slate-600',
    cardAccent: 'text-slate-300',
    multiplierText: '1.0x Standard Miles',
    keyPerks: [
      'Standard 1.0x miles accrual on all flights & hotels',
      'Dedicated member online dashboard',
      'Early access to seasonal flight deals & Umrah promos',
      'Complimentary booking change within 24 hours of ticketing'
    ]
  },
  Gold: {
    name: 'Gold Executive',
    minMiles: 10000,
    maxMiles: 29999,
    nextTier: 'Platinum' as const,
    nextTierMiles: 30000,
    badgeBg: 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border-amber-300 font-extrabold shadow-sm',
    cardGradient: 'from-amber-950 via-slate-900 to-yellow-950 border-amber-500/50',
    cardAccent: 'text-amber-300',
    multiplierText: '1.5x Accelerated Miles (+50% Bonus)',
    keyPerks: [
      '1.5x bonus miles on all international & domestic routes',
      'Priority check-in desks at Lagos (MMIA) & Abuja (ABV)',
      'Complimentary Zamzam 5L water box priority tagging & handling',
      'Priority waitlist clearance & 24/7 dedicated WhatsApp agent',
      '15% discount on VIP Airport Chauffeur transfers'
    ]
  },
  Platinum: {
    name: 'Platinum Elite',
    minMiles: 30000,
    maxMiles: 59999,
    nextTier: 'Diamond' as const,
    nextTierMiles: 60000,
    badgeBg: 'bg-gradient-to-r from-sky-400 to-indigo-400 text-slate-950 border-sky-300 font-extrabold shadow-sm',
    cardGradient: 'from-slate-950 via-slate-900 to-indigo-950 border-indigo-400/50',
    cardAccent: 'text-sky-300',
    multiplierText: '2.0x Double Miles (+100% Bonus)',
    keyPerks: [
      '2.0x double miles accrual on all flights, hotels, and packages',
      'Complimentary VIP Lounge Access (Oasis MMIA & SkyTeam Dubai DXB)',
      'Extra 23kg check-in baggage allowance on partner airlines',
      'Fast-track airport security and immigration escort',
      'Guaranteed 5-Star Haram View suite upgrade priority in Makkah'
    ]
  },
  Diamond: {
    name: 'Royal Diamond VIP',
    minMiles: 60000,
    maxMiles: Infinity,
    nextTier: null,
    nextTierMiles: 60000,
    badgeBg: 'bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300 text-slate-950 border-emerald-300 font-extrabold shadow-md',
    cardGradient: 'from-slate-950 via-teal-950 to-slate-900 border-teal-400/60',
    cardAccent: 'text-emerald-300',
    multiplierText: '3.0x Triple Miles (+200% Bonus)',
    keyPerks: [
      '3.0x triple miles & absolute priority booking clearance',
      'Complimentary private Mercedes/Prado airport chauffeur on every trip',
      'Complimentary annual companion ticket for domestic flights',
      'VIP Haramain Bullet Train 1st class luxury upgrade on pilgrimage',
      'Dedicated private travel manager on call 24/7/365'
    ]
  }
};

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  user,
  bookings,
  currentCurrency,
  onClose,
  onCancelBooking,
  onUpdateUser,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'bookings' | 'miles' | 'profile'>('bookings');
  const [loyaltySectionTab, setLoyaltySectionTab] = useState<'rewards' | 'vouchers' | 'history' | 'tiers'>('rewards');
  const [selectedRewardCategory, setSelectedRewardCategory] = useState<string>('all');
  const [onlyEligible, setOnlyEligible] = useState<boolean>(false);
  
  const [selectedTicket, setSelectedTicket] = useState<BookingRecord | null>(null);
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
  
  // Reward Redemption modal states
  const [rewardToRedeem, setRewardToRedeem] = useState<LoyaltyReward | null>(null);
  const [redeemedVoucherSuccess, setRedeemedVoucherSuccess] = useState<RedeemedVoucher | null>(null);
  const [copiedVoucherCode, setCopiedVoucherCode] = useState<string | null>(null);

  const userTier = user.loyaltyTier || 'Gold';
  const tierInfo = TIER_CONFIG[userTier] || TIER_CONFIG.Gold;
  const nextTierKey = tierInfo.nextTier;
  const nextTierTarget = tierInfo.nextTierMiles;

  // Calculate dynamic progress to next tier
  let progressPercentage = 100;
  let milesToNextTier = 0;
  if (nextTierKey) {
    const base = tierInfo.minMiles;
    const span = nextTierTarget - base;
    const currentOverBase = Math.max(0, user.loyaltyMiles - base);
    progressPercentage = Math.min(100, Math.max(0, Math.round((currentOverBase / span) * 100)));
    milesToNextTier = Math.max(0, nextTierTarget - user.loyaltyMiles);
  }

  // Filter rewards based on state
  const filteredRewards = CATALOG_LOYALTY_REWARDS.filter((reward) => {
    if (selectedRewardCategory !== 'all' && reward.category !== selectedRewardCategory) {
      return false;
    }
    if (onlyEligible && user.loyaltyMiles < reward.milesCost) {
      return false;
    }
    return true;
  });

  const handleRequestRefund = (bId: string) => {
    onCancelBooking(bId);
    setCancellingBookingId(null);
  };

  const handleConfirmRedeem = () => {
    if (!rewardToRedeem) return;
    if (user.loyaltyMiles < rewardToRedeem.milesCost) return;

    const voucherCode = `ELHAM-${rewardToRedeem.category.toUpperCase().slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 90);

    const newVoucher: RedeemedVoucher = {
      id: `vch-${Date.now()}`,
      rewardId: rewardToRedeem.id,
      rewardTitle: rewardToRedeem.title,
      voucherCode,
      redeemedDate: new Date().toISOString().split('T')[0],
      milesSpent: rewardToRedeem.milesCost,
      status: 'ACTIVE',
      expiryDate: expiry.toISOString().split('T')[0]
    };

    const newTx: MilesTransaction = {
      id: `tx-${Date.now()}`,
      description: `Reward Redeemed: ${rewardToRedeem.title}`,
      date: new Date().toISOString().split('T')[0],
      miles: -rewardToRedeem.milesCost,
      type: 'redeemed'
    };

    const updatedUser: UserProfile = {
      ...user,
      loyaltyMiles: user.loyaltyMiles - rewardToRedeem.milesCost,
      redeemedVouchers: [newVoucher, ...(user.redeemedVouchers || [])],
      milesHistory: [newTx, ...(user.milesHistory || [])]
    };

    if (onUpdateUser) {
      onUpdateUser(updatedUser);
    }

    setRewardToRedeem(null);
    setRedeemedVoucherSuccess(newVoucher);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedVoucherCode(text);
    setTimeout(() => {
      setCopiedVoucherCode(null);
    }, 2500);
  };

  const activeVouchersCount = (user.redeemedVouchers || []).filter(v => v.status === 'ACTIVE').length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full shadow-2xl border border-slate-200 overflow-hidden my-4 sm:my-8 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-slate-950 font-bold shadow-md">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold">{user.fullName}</h3>
                <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${tierInfo.badgeBg}`}>
                  {user.loyaltyTier} Member
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>Member ID: <strong className="font-mono text-slate-300">{user.frequentFlyerNo || 'ET-GLD-8821'}</strong></span>
                <span>•</span>
                <span className="text-amber-300 font-semibold">{user.loyaltyMiles.toLocaleString()} Royal Miles</span>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close dashboard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center gap-2 sm:gap-4 text-xs font-semibold shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('bookings')}
            className={`py-2 px-3.5 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'bookings'
                ? 'bg-white text-slate-900 shadow-sm font-bold border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Ticket className="w-3.5 h-3.5 text-amber-600" />
            <span>My Bookings & E-Tickets ({bookings.length})</span>
          </button>
          
          <button
            onClick={() => setActiveSubTab('miles')}
            className={`py-2 px-3.5 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeSubTab === 'miles'
                ? 'bg-white text-slate-900 shadow-sm font-bold border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>Loyalty Program & Royal Miles</span>
            <span className="px-2 py-0.5 text-[10px] rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-200">
              {user.loyaltyMiles.toLocaleString()} pts
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('profile')}
            className={`py-2 px-3.5 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'profile'
                ? 'bg-white text-slate-900 shadow-sm font-bold border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span>Passenger Profile & Docs</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          
          {/* TAB 1: BOOKINGS */}
          {activeSubTab === 'bookings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Active Itineraries & Booking History</h4>
                  <p className="text-xs text-slate-500">View confirmed tickets, passenger manifests, and cancellation requests.</p>
                </div>
                <button
                  onClick={() => setActiveSubTab('miles')}
                  className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>Earned {user.loyaltyMiles.toLocaleString()} Miles from Travel</span>
                </button>
              </div>

              {bookings.length === 0 ? (
                <div className="text-center py-12 bg-white border border-dashed border-slate-300 rounded-xl">
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
                      className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 shadow-sm space-y-4 transition-all"
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

          {/* TAB 2: EXTENDED VISUAL LOYALTY PROGRAM SECTION */}
          {activeSubTab === 'miles' && (
            <div className="space-y-6">
              
              {/* 1. HERO MEMBERSHIP BANNER & DIGITAL CARD */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                
                {/* Visual Digital Member Card (5 cols) */}
                <div className="lg:col-span-5 relative">
                  <div className={`h-full min-h-[220px] rounded-2xl bg-gradient-to-br ${tierInfo.cardGradient} p-5 text-white shadow-xl border flex flex-col justify-between relative overflow-hidden`}>
                    {/* Decorative Background Elements */}
                    <div className="absolute -right-8 -top-8 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute right-4 bottom-4 opacity-10">
                      <Award className="w-32 h-32" />
                    </div>

                    {/* Top Row: Brand & Chip */}
                    <div className="relative z-10 flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <img 
                          src="/assets/aistudio/WhatsApp_Image_2026-10-10_at_5.36.13_PM_40258a60.jpeg"
                          alt="Elham Travels"
                          className="w-8 h-8 rounded-md bg-white p-0.5 object-contain"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="font-serif font-black tracking-wider text-xs text-amber-300 uppercase">
                            ELHAM ROYAL CLUB
                          </div>
                          <span className="text-[9px] text-slate-400 block tracking-wide">
                            Elham International Limited
                          </span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${tierInfo.badgeBg}`}>
                        {user.loyaltyTier} VIP
                      </span>
                    </div>

                    {/* Card Chip & Contactless Symbol */}
                    <div className="relative z-10 my-3 flex items-center gap-3">
                      <div className="w-9 h-7 rounded bg-gradient-to-br from-amber-300 via-yellow-200 to-amber-500 border border-amber-200/80 shadow-inner flex items-center justify-center">
                        <div className="w-6 h-4 border border-amber-900/30 rounded-sm grid grid-cols-2 gap-0.5 opacity-60">
                          <div className="border-r border-amber-900/30"></div>
                          <div></div>
                        </div>
                      </div>
                      <span className="text-amber-200/60 text-xs font-mono">((( • )))</span>
                    </div>

                    {/* Cardholder & Frequent Flyer ID */}
                    <div className="relative z-10 pt-2 border-t border-white/10 flex items-end justify-between">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Cardholder</span>
                        <h4 className="text-sm font-bold tracking-wide truncate max-w-[190px]">{user.fullName}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Member Number</span>
                        <span className="font-mono text-xs font-bold text-amber-300">{user.frequentFlyerNo || 'ET-GLD-8821'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Summary & Tier Progress Engine (7 cols) */}
                <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Account Balance
                      </span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                          {user.loyaltyMiles.toLocaleString()}
                        </h3>
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Royal Miles Available
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Tier Privileges Multiplier</span>
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1 justify-end mt-0.5">
                        <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        {tierInfo.multiplierText}
                      </span>
                    </div>
                  </div>

                  {/* Progress to Next Tier */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <span>Current Tier: <strong className="text-amber-800">{user.loyaltyTier}</strong></span>
                        {nextTierKey && (
                          <>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-slate-500">Next: <strong className="text-slate-900">{nextTierKey}</strong></span>
                          </>
                        )}
                      </div>
                      <span className="text-slate-500 font-semibold text-[11px]">
                        {nextTierKey ? `${milesToNextTier.toLocaleString()} miles to ${nextTierKey}` : 'Top Tier Achieved!'}
                      </span>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="w-full bg-slate-100 rounded-full h-3 p-0.5 border border-slate-200 overflow-hidden relative">
                      <div 
                        className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 h-full rounded-full transition-all duration-700 shadow-sm"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{tierInfo.minMiles.toLocaleString()} miles</span>
                      <span className="font-bold text-amber-700">{progressPercentage}% progress</span>
                      <span>{nextTierTarget.toLocaleString()} miles</span>
                    </div>
                  </div>

                  {/* Quick Stat Pill Highlights */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">Active Vouchers</span>
                      <strong className="text-xs font-black text-slate-800">{activeVouchersCount} Available</strong>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">Redeemed Total</span>
                      <strong className="text-xs font-black text-slate-800">
                        {((user.redeemedVouchers || []).reduce((acc, v) => acc + v.milesSpent, 0)).toLocaleString()} pts
                      </strong>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">Earn Rate</span>
                      <strong className="text-xs font-black text-emerald-700">1 Mile / $1 USD</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. LOYALTY SUB-NAVIGATION */}
              <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm flex items-center gap-1 text-xs font-semibold">
                <button
                  onClick={() => setLoyaltySectionTab('rewards')}
                  className={`flex-1 py-2 px-3 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    loyaltySectionTab === 'rewards'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Gift className="w-3.5 h-3.5 text-amber-400" />
                  <span>Available Rewards ({filteredRewards.length})</span>
                </button>

                <button
                  onClick={() => setLoyaltySectionTab('vouchers')}
                  className={`flex-1 py-2 px-3 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    loyaltySectionTab === 'vouchers'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  <span>My Claimed Vouchers ({activeVouchersCount})</span>
                </button>

                <button
                  onClick={() => setLoyaltySectionTab('history')}
                  className={`flex-1 py-2 px-3 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    loyaltySectionTab === 'history'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <History className="w-3.5 h-3.5 text-amber-400" />
                  <span>Miles Activity Ledger</span>
                </button>

                <button
                  onClick={() => setLoyaltySectionTab('tiers')}
                  className={`flex-1 py-2 px-3 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    loyaltySectionTab === 'tiers'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tier Perks & Roadmap</span>
                </button>
              </div>

              {/* 3. SECTION CONTENT: AVAILABLE REWARDS MARKETPLACE */}
              {loyaltySectionTab === 'rewards' && (
                <div className="space-y-4">
                  {/* Category Pills & Eligibility Toggle */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
                    {/* Category Filter */}
                    <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
                      {[
                        { id: 'all', label: 'All Rewards' },
                        { id: 'flight', label: 'Flights & Discounts' },
                        { id: 'hotel', label: 'Hotels & Suites' },
                        { id: 'lounge', label: 'Airport Lounges' },
                        { id: 'transfer', label: 'Chauffeur' },
                        { id: 'umrah', label: 'Umrah & Spiritual' },
                        { id: 'luggage', label: 'Baggage' },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedRewardCategory(cat.id)}
                          className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer text-xs font-semibold ${
                            selectedRewardCategory === cat.id
                              ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>

                    {/* Eligible Only Filter */}
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer shrink-0">
                      <input 
                        type="checkbox"
                        checked={onlyEligible}
                        onChange={(e) => setOnlyEligible(e.target.checked)}
                        className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                      />
                      <span>Ready to Redeem only</span>
                    </label>
                  </div>

                  {/* Rewards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRewards.map((reward) => {
                      const canAfford = user.loyaltyMiles >= reward.milesCost;
                      const milesShort = reward.milesCost - user.loyaltyMiles;

                      return (
                        <div
                          key={reward.id}
                          className={`bg-white rounded-xl border p-4.5 flex flex-col justify-between shadow-sm transition-all hover:shadow-md ${
                            canAfford 
                              ? 'border-amber-200/80 hover:border-amber-300' 
                              : 'border-slate-200 opacity-90'
                          }`}
                        >
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                                {reward.category === 'flight' && <Plane className="w-5 h-5" />}
                                {reward.category === 'hotel' && <Building2 className="w-5 h-5" />}
                                {reward.category === 'lounge' && <Coffee className="w-5 h-5" />}
                                {reward.category === 'transfer' && <Car className="w-5 h-5" />}
                                {reward.category === 'umrah' && <Compass className="w-5 h-5" />}
                                {reward.category === 'luggage' && <Briefcase className="w-5 h-5" />}
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="font-mono text-base font-black text-slate-900">
                                  {reward.milesCost.toLocaleString()}
                                </span>
                                <span className="text-[10px] text-slate-400 font-semibold uppercase">Royal Miles</span>
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                {reward.badge && (
                                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                                    {reward.badge}
                                  </span>
                                )}
                                <span className="text-[10px] text-slate-500 font-medium">
                                  {reward.tierRequired} Tier+
                                </span>
                              </div>
                              <h5 className="font-bold text-slate-900 text-sm leading-snug">{reward.title}</h5>
                              <p className="text-xs text-slate-600 mt-1 line-clamp-2">{reward.description}</p>
                            </div>

                            <div className="bg-slate-50 p-2 rounded-lg text-[11px] font-semibold text-slate-700 border border-slate-200/80 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span className="truncate">{reward.highlightBenefit}</span>
                            </div>
                          </div>

                          <div className="pt-4 mt-3 border-t border-slate-100">
                            {canAfford ? (
                              <button
                                onClick={() => setRewardToRedeem(reward)}
                                className="w-full py-2 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                              >
                                <Gift className="w-3.5 h-3.5" />
                                <span>Redeem Reward</span>
                              </button>
                            ) : (
                              <div className="text-center py-1.5 px-3 bg-slate-100 rounded-lg text-xs font-semibold text-slate-500">
                                Requires {milesShort.toLocaleString()} more miles
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. SECTION CONTENT: MY CLAIMED VOUCHERS */}
              {loyaltySectionTab === 'vouchers' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Your Active & Redeemed Vouchers</h4>
                      <p className="text-xs text-slate-500">Present voucher codes at booking checkout, airport check-in, or VIP transfer pickup.</p>
                    </div>
                  </div>

                  {(!user.redeemedVouchers || user.redeemedVouchers.length === 0) ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300 space-y-3">
                      <Tag className="w-10 h-10 text-slate-300 mx-auto" />
                      <p className="text-xs text-slate-500">You haven't claimed any reward vouchers yet.</p>
                      <button
                        onClick={() => setLoyaltySectionTab('rewards')}
                        className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        Browse Available Rewards
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {user.redeemedVouchers.map((voucher) => (
                        <div
                          key={voucher.id}
                          className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3 relative overflow-hidden"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                                {voucher.status}
                              </span>
                              <h5 className="font-bold text-slate-900 text-sm mt-1">{voucher.rewardTitle}</h5>
                              <p className="text-[11px] text-slate-500">Claimed: {voucher.redeemedDate} · Expires: {voucher.expiryDate}</p>
                            </div>
                            <span className="text-xs font-semibold text-slate-400">-{voucher.milesSpent.toLocaleString()} pts</span>
                          </div>

                          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                            <div>
                              <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-bold">Voucher Code</span>
                              <span className="font-mono text-sm font-black text-amber-900">{voucher.voucherCode}</span>
                            </div>
                            <button
                              onClick={() => copyToClipboard(voucher.voucherCode)}
                              className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              {copiedVoucherCode === voucher.voucherCode ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-emerald-700">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 5. SECTION CONTENT: MILES ACTIVITY LEDGER */}
              {loyaltySectionTab === 'history' && (
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Miles Accrual & Redemption History</h4>
                      <p className="text-xs text-slate-500">All credited flights, hotel stays, bonuses, and redeemed rewards.</p>
                    </div>
                    <span className="text-xs font-bold text-slate-700">
                      Total Ledger: {(user.milesHistory || []).length} Entries
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {(user.milesHistory || []).map((tx) => (
                      <div key={tx.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            tx.type === 'earned' 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {tx.type === 'earned' ? <TrendingUp className="w-4 h-4" /> : <Tag className="w-4 h-4" />}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{tx.description}</span>
                            <span className="text-slate-400 text-[11px]">
                              {tx.date} {tx.bookingRef && `· Ref: ${tx.bookingRef}`}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className={`font-mono text-sm font-bold ${
                            tx.type === 'earned' ? 'text-emerald-600' : 'text-amber-800'
                          }`}>
                            {tx.miles > 0 ? `+${tx.miles.toLocaleString()}` : tx.miles.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-400 block uppercase">Miles</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. SECTION CONTENT: TIER PRIVILEGES & ROADMAP */}
              {loyaltySectionTab === 'tiers' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {(Object.keys(TIER_CONFIG) as Array<keyof typeof TIER_CONFIG>).map((tierKey) => {
                      const t = TIER_CONFIG[tierKey];
                      const isCurrent = user.loyaltyTier === tierKey;

                      return (
                        <div
                          key={tierKey}
                          className={`rounded-xl p-4 border flex flex-col justify-between shadow-sm relative transition-all ${
                            isCurrent
                              ? 'bg-amber-50/50 border-amber-400 shadow-amber-500/10 ring-2 ring-amber-400/30'
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          {isCurrent && (
                            <div className="absolute -top-2.5 right-3 bg-amber-500 text-slate-950 font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                              Your Tier
                            </div>
                          )}

                          <div className="space-y-3">
                            <div>
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                                {tierKey}
                              </span>
                              <h5 className="font-bold text-slate-900 text-sm mt-0.5">{t.name}</h5>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                {t.minMiles.toLocaleString()} {t.maxMiles === Infinity ? '+ miles' : `– ${t.maxMiles.toLocaleString()} miles`}
                              </p>
                            </div>

                            <div className="bg-slate-100 p-2 rounded-lg text-[10px] font-bold text-slate-800">
                              {t.multiplierText}
                            </div>

                            <ul className="space-y-1.5 text-[11px] text-slate-600">
                              {t.keyPerks.map((perk, idx) => (
                                <li key={idx} className="flex items-start gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                                  <span>{perk}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: PASSENGER PROFILE & DOCUMENTS */}
          {activeSubTab === 'profile' && (
            <div className="space-y-4 max-w-xl text-xs">
              <h4 className="text-sm font-bold text-slate-900">Personal Information & Travel Passports</h4>
              <div className="space-y-3 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Full Name:</span>
                  <strong className="text-slate-900">{user.fullName}</strong>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Email Address:</span>
                  <strong className="text-slate-900">{user.email}</strong>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Verified Phone:</span>
                  <strong className="text-slate-900">{user.phone}</strong>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Passport Number:</span>
                  <strong className="text-slate-900 font-mono">{user.passportNo || 'A10984251'}</strong>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Frequent Flyer Number:</span>
                  <strong className="text-amber-800 font-mono">{user.frequentFlyerNo || 'ET-GLD-8821'}</strong>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Nationality:</span>
                  <strong className="text-slate-900">Nigerian</strong>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-amber-900 space-y-1">
                <h5 className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Elham Data Protection Standard</span>
                </h5>
                <p className="text-[11px] text-amber-800/90 leading-relaxed">
                  Your passport and passenger documents are encrypted using 256-bit AES protocol in accordance with NCAA and IATA travel security standards.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* REDEEM REWARD CONFIRMATION MODAL */}
        {rewardToRedeem && (
          <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Gift className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Redeem Reward
                    </span>
                    <h4 className="font-bold text-slate-900 text-base mt-0.5">{rewardToRedeem.title}</h4>
                  </div>
                </div>
                <button 
                  onClick={() => setRewardToRedeem(null)}
                  className="p-1 text-slate-400 hover:text-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {rewardToRedeem.description}
              </p>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Miles Required:</span>
                  <strong className="font-mono font-bold text-amber-900">-{rewardToRedeem.milesCost.toLocaleString()} Miles</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Your Current Balance:</span>
                  <span className="font-mono text-slate-700">{user.loyaltyMiles.toLocaleString()} Miles</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 font-bold">
                  <span className="text-slate-900">Balance After Redemption:</span>
                  <span className="font-mono text-emerald-700">
                    {(user.loyaltyMiles - rewardToRedeem.milesCost).toLocaleString()} Miles
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 bg-amber-50/60 p-2.5 rounded-lg border border-amber-100">
                <strong>Terms:</strong> {rewardToRedeem.terms}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setRewardToRedeem(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmRedeem}
                  className="px-5 py-2.5 text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Confirm & Claim Voucher
                </button>
              </div>
            </div>
          </div>
        )}

        {/* REDEEMED VOUCHER CELEBRATION MODAL */}
        {redeemedVoucherSuccess && (
          <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-amber-200 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-lg font-black text-slate-900">Reward Claimed Successfully!</h4>
                <p className="text-xs text-slate-500 mt-1">
                  You have successfully redeemed <strong>{redeemedVoucherSuccess.rewardTitle}</strong>.
                </p>
              </div>

              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 space-y-2">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-800 block">
                  Your Digital Voucher Code
                </span>
                <div className="font-mono text-xl font-black text-slate-900 tracking-wider">
                  {redeemedVoucherSuccess.voucherCode}
                </div>
                <p className="text-[11px] text-slate-500">
                  Valid until {redeemedVoucherSuccess.expiryDate}
                </p>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => copyToClipboard(redeemedVoucherSuccess.voucherCode)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedVoucherCode === redeemedVoucherSuccess.voucherCode ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Voucher Code</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setRedeemedVoucherSuccess(null);
                    setLoyaltySectionTab('vouchers');
                  }}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 font-bold text-xs rounded-xl text-slate-800 cursor-pointer"
                >
                  View My Vouchers
                </button>
              </div>
            </div>
          </div>
        )}

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
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Keep Booking
                </button>
                <button
                  onClick={() => handleRequestRefund(cancellingBookingId)}
                  className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg cursor-pointer"
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
                <button onClick={() => setSelectedTicket(null)} className="p-1 text-slate-400 hover:text-slate-800 cursor-pointer">
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
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer"
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
