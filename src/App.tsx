import React, { useState, useEffect } from 'react';
import { 
  CurrencyCode, 
  TravelTab, 
  FlightOffer, 
  HotelOffer, 
  HolidayPackage, 
  TransferOption, 
  BookingRecord, 
  UserProfile, 
  PassengerDetails 
} from './types/travel';
import { 
  INITIAL_FLIGHTS, 
  INITIAL_HOTELS, 
  INITIAL_PACKAGES, 
  INITIAL_USER, 
  INITIAL_BOOKINGS 
} from './data/mockTravelData';
import { Header } from './components/Header';
import { HeroSearchEngine } from './components/HeroSearchEngine';
import { FlightResults } from './components/FlightResults';
import { FlightBookingModal } from './components/FlightBookingModal';
import { HotelResults } from './components/HotelResults';
import { HotelBookingModal } from './components/HotelBookingModal';
import { UmrahHajjSection } from './components/UmrahHajjSection';
import { HolidayPackagesSection } from './components/HolidayPackagesSection';
import { TransfersSection } from './components/TransfersSection';
import { VisaAssistanceModal } from './components/VisaAssistanceModal';
import { CorporateTravelModal } from './components/CorporateTravelModal';
import { PaymentModal } from './components/PaymentModal';
import { CustomerDashboard } from './components/CustomerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AITravelAssistant } from './components/AITravelAssistant';
import { PartnersSection } from './components/PartnersSection';
import { Footer } from './components/Footer';
import { Sparkles, MessageSquare, PhoneCall, ShieldCheck, Plane, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyCode>('NGN');
  const [activeTab, setActiveTab] = useState<TravelTab>('flights');

  // Core Data State
  const [flights, setFlights] = useState<FlightOffer[]>(INITIAL_FLIGHTS);
  const [hotels, setHotels] = useState<HotelOffer[]>(INITIAL_HOTELS);
  const [packages, setPackages] = useState<HolidayPackage[]>(INITIAL_PACKAGES);
  const [bookings, setBookings] = useState<BookingRecord[]>(INITIAL_BOOKINGS);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);

  // Search Context
  const [flightSearchSummary, setFlightSearchSummary] = useState<any>(null);
  const [hotelDestinationQuery, setHotelDestinationQuery] = useState<string>('');

  // Modals
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isCustomerPortalOpen, setIsCustomerPortalOpen] = useState(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [isCorporateModalOpen, setIsCorporateModalOpen] = useState(false);
  const [isVisaModalOpen, setIsVisaModalOpen] = useState(false);

  // Booking Flow State
  const [selectedFlight, setSelectedFlight] = useState<FlightOffer | null>(null);
  const [selectedHotelData, setSelectedHotelData] = useState<{
    hotel: HotelOffer;
    room: HotelOffer['roomTypes'][0];
  } | null>(null);

  const [paymentSession, setPaymentSession] = useState<{
    itemType: 'flight' | 'hotel' | 'transfer' | 'package';
    itemTitle: string;
    itemDetails: string;
    totalUSD: number;
    passenger: PassengerDetails;
    travelDate: string;
    returnDate?: string;
  } | null>(null);

  // Load Bookings & Packages from Backend API on mount
  useEffect(() => {
    fetch('/api/bookings')
      .then((res) => res.json())
      .then((data) => {
        if (data.bookings && data.bookings.length > 0) {
          setBookings(data.bookings);
        }
      })
      .catch((err) => console.log('Using local bookings store:', err));

    fetch('/api/packages')
      .then((res) => res.json())
      .then((data) => {
        if (data.packages && data.packages.length > 0) {
          setPackages(data.packages);
        }
      })
      .catch((err) => console.log('Using local packages store:', err));
  }, []);

  // Handlers for search triggers
  const handleFlightSearch = (params: any) => {
    setFlightSearchSummary(params);
    // Filter matching or display all relevant flights
    const filtered = INITIAL_FLIGHTS.filter(
      (f) =>
        (f.outbound.origin.code === params.origin && f.outbound.destination.code === params.destination) ||
        f.outbound.origin.code === params.origin ||
        f.outbound.destination.code === params.destination
    );
    setFlights(filtered.length > 0 ? filtered : INITIAL_FLIGHTS);
  };

  const handleHotelSearch = (dest: string, _checkIn: string, _checkOut: string, _guests: number) => {
    setHotelDestinationQuery(dest);
    const destLower = dest.toLowerCase();
    const filtered = INITIAL_HOTELS.filter(
      (h) => h.city.toLowerCase().includes(destLower) || h.name.toLowerCase().includes(destLower) || destLower.includes(h.city.toLowerCase())
    );
    setHotels(filtered.length > 0 ? filtered : INITIAL_HOTELS);
  };

  // Checkout Handlers
  const handleProceedFlightPayment = (data: {
    flight: FlightOffer;
    passenger: PassengerDetails;
    fareBreakdown: { totalUSD: number };
  }) => {
    setSelectedFlight(null);
    setPaymentSession({
      itemType: 'flight',
      itemTitle: `${data.flight.airline} (${data.flight.outbound.flightNumber}): ${data.flight.outbound.origin.code} ➔ ${data.flight.outbound.destination.code}`,
      itemDetails: `${data.flight.outbound.origin.city} to ${data.flight.outbound.destination.city} · ${data.flight.outbound.cabinClass.toUpperCase()}`,
      totalUSD: data.fareBreakdown.totalUSD,
      passenger: data.passenger,
      travelDate: data.flight.outbound.departureTime,
    });
  };

  const handleProceedHotelPayment = (data: {
    hotel: HotelOffer;
    room: HotelOffer['roomTypes'][0];
    nights: number;
    checkInDate: string;
    checkOutDate: string;
    guest: PassengerDetails;
    totalUSD: number;
  }) => {
    setSelectedHotelData(null);
    setPaymentSession({
      itemType: 'hotel',
      itemTitle: `${data.hotel.name} - ${data.room.name}`,
      itemDetails: `${data.nights} Nights in ${data.hotel.city} (${data.checkInDate} to ${data.checkOutDate})`,
      totalUSD: data.totalUSD,
      passenger: data.guest,
      travelDate: data.checkInDate,
      returnDate: data.checkOutDate,
    });
  };

  const handleBookPackage = (pkg: HolidayPackage) => {
    setPaymentSession({
      itemType: 'package',
      itemTitle: pkg.title,
      itemDetails: `${pkg.durationDays} Days All-Inclusive in ${pkg.destination} (${pkg.country})`,
      totalUSD: pkg.priceUSD,
      passenger: {
        title: 'Alhaji',
        firstName: user.fullName.split(' ')[0] || 'Traveler',
        lastName: user.fullName.split(' ')[1] || 'Guest',
        email: user.email,
        phone: user.phone,
        dob: '1985-06-15',
        passportNumber: user.passportNo || 'A10984251',
        passportExpiry: '2030-01-01',
        nationality: 'Nigerian',
      },
      travelDate: pkg.departureDates[0] || '2026-12-01',
    });
  };

  const handleBookTransfer = (
    transfer: TransferOption,
    details: { pickup: string; dropoff: string; date: string; time: string }
  ) => {
    setPaymentSession({
      itemType: 'transfer',
      itemTitle: `Chauffeur: ${transfer.category} (${transfer.vehicleModel})`,
      itemDetails: `From: ${details.pickup} to ${details.dropoff} at ${details.time}`,
      totalUSD: transfer.priceUSD,
      passenger: {
        title: 'Mr',
        firstName: user.fullName.split(' ')[0] || 'Traveler',
        lastName: user.fullName.split(' ')[1] || 'Guest',
        email: user.email,
        phone: user.phone,
        dob: '1988-02-14',
        passportNumber: user.passportNo || 'A10984251',
        passportExpiry: '2030-01-01',
        nationality: 'Nigerian',
      },
      travelDate: `${details.date} ${details.time}`,
    });
  };

  const handleBookingConfirmed = (newBooking: BookingRecord) => {
    setBookings((prev) => [newBooking, ...prev]);
    // Award 500 loyalty miles
    setUser((prev) => ({
      ...prev,
      loyaltyMiles: prev.loyaltyMiles + 500,
    }));
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, { method: 'POST' });
      const data = await res.json();
      if (data.success && data.booking) {
        setBookings((prev) => prev.map((b) => (b.id === bookingId ? data.booking : b)));
      }
    } catch (err) {
      console.error('Cancellation error:', err);
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: 'REFUND_REQUESTED', notes: 'Refund requested by user' } : b
        )
      );
    }
  };

  const handleApproveRefund = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/refund`, { method: 'POST' });
      const data = await res.json();
      if (data.success && data.booking) {
        setBookings((prev) => prev.map((b) => (b.id === bookingId ? data.booking : b)));
      }
    } catch (err) {
      console.error('Refund approval error:', err);
    }
  };

  const handleAddNewPackage = async (pkg: HolidayPackage) => {
    try {
      const res = await fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pkg),
      });
      const data = await res.json();
      if (data.package) {
        setPackages((prev) => [data.package, ...prev]);
      }
    } catch (err) {
      setPackages((prev) => [pkg, ...prev]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 1. Header */}
      <Header
        currentCurrency={currentCurrency}
        onCurrencyChange={setCurrentCurrency}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenCustomerPortal={() => setIsCustomerPortalOpen(true)}
        onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
        isAdminView={isAdminPortalOpen}
      />

      {/* 2. Hero Booking Engine */}
      <HeroSearchEngine
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onFlightSearch={handleFlightSearch}
        onHotelSearch={handleHotelSearch}
        currentCurrency={currentCurrency}
      />

      {/* 3. Main Dynamic Content According to Active Tab */}
      <main className="flex-1">
        {activeTab === 'flights' && (
          <FlightResults
            flights={flights}
            currentCurrency={currentCurrency}
            onSelectFlight={(flight) => setSelectedFlight(flight)}
            searchSummary={flightSearchSummary}
          />
        )}

        {activeTab === 'hotels' && (
          <HotelResults
            hotels={hotels}
            currentCurrency={currentCurrency}
            onSelectHotelRoom={(hotel, room) => setSelectedHotelData({ hotel, room })}
            destinationQuery={hotelDestinationQuery}
          />
        )}

        {activeTab === 'umrah' && (
          <UmrahHajjSection
            packages={packages}
            currentCurrency={currentCurrency}
            onBookPackage={handleBookPackage}
          />
        )}

        {activeTab === 'packages' && (
          <HolidayPackagesSection
            packages={packages}
            currentCurrency={currentCurrency}
            onBookPackage={handleBookPackage}
          />
        )}

        {activeTab === 'transfers' && (
          <TransfersSection
            currentCurrency={currentCurrency}
            onBookTransfer={handleBookTransfer}
          />
        )}

        {activeTab === 'visa' && (
          <VisaAssistanceModal
            currentCurrency={currentCurrency}
            isStandaloneSection={true}
          />
        )}

        {activeTab === 'partners' && (
          <div className="py-4">
            <PartnersSection />
          </div>
        )}
      </main>

      {/* Global Authorized Partners Section for Trust & Transparency */}
      {activeTab !== 'partners' && (
        <PartnersSection />
      )}

      {/* Floating AI Concierge Action Launcher */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsAssistantOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-amber-300 hover:text-amber-200 border border-amber-500/40 rounded-full shadow-2xl hover:shadow-amber-500/20 transition-all cursor-pointer hover:scale-105"
        >
          <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-left pr-1 hidden sm:block">
            <span className="text-[11px] font-bold block text-white uppercase tracking-wider">Elham AI Concierge</span>
            <span className="text-[9px] text-amber-300 block">Plan Itinerary & Umrah 24/7</span>
          </div>
        </button>
      </div>

      {/* 4. Footer */}
      <Footer
        onSelectTab={setActiveTab}
        onOpenCorporate={() => setIsCorporateModalOpen(true)}
        onOpenVisa={() => setIsVisaModalOpen(true)}
      />

      {/* MODALS */}
      {/* Flight Booking Modal */}
      {selectedFlight && (
        <FlightBookingModal
          flight={selectedFlight}
          currentCurrency={currentCurrency}
          onClose={() => setSelectedFlight(null)}
          onProceedToPayment={handleProceedFlightPayment}
        />
      )}

      {/* Hotel Booking Modal */}
      {selectedHotelData && (
        <HotelBookingModal
          hotel={selectedHotelData.hotel}
          room={selectedHotelData.room}
          currentCurrency={currentCurrency}
          onClose={() => setSelectedHotelData(null)}
          onProceedToPayment={handleProceedHotelPayment}
        />
      )}

      {/* Payment Checkout Modal */}
      {paymentSession && (
        <PaymentModal
          itemType={paymentSession.itemType}
          itemTitle={paymentSession.itemTitle}
          itemDetails={paymentSession.itemDetails}
          totalUSD={paymentSession.totalUSD}
          currentCurrency={currentCurrency}
          passenger={paymentSession.passenger}
          travelDate={paymentSession.travelDate}
          returnDate={paymentSession.returnDate}
          onClose={() => setPaymentSession(null)}
          onBookingConfirmed={handleBookingConfirmed}
        />
      )}

      {/* Customer Dashboard Modal */}
      {isCustomerPortalOpen && (
        <CustomerDashboard
          user={user}
          bookings={bookings}
          currentCurrency={currentCurrency}
          onClose={() => setIsCustomerPortalOpen(false)}
          onCancelBooking={handleCancelBooking}
          onUpdateUser={setUser}
        />
      )}

      {/* Administration Staff Portal */}
      {isAdminPortalOpen && (
        <AdminDashboard
          bookings={bookings}
          packages={packages}
          currentCurrency={currentCurrency}
          onClose={() => setIsAdminPortalOpen(false)}
          onApproveRefund={handleApproveRefund}
          onAddNewPackage={handleAddNewPackage}
        />
      )}

      {/* AI Travel Assistant Modal */}
      {isAssistantOpen && (
        <AITravelAssistant
          onClose={() => setIsAssistantOpen(false)}
          onNavigateTab={setActiveTab}
        />
      )}

      {/* Corporate Modal */}
      {isCorporateModalOpen && (
        <CorporateTravelModal onClose={() => setIsCorporateModalOpen(false)} />
      )}

      {/* Standalone Visa Modal (from footer) */}
      {isVisaModalOpen && (
        <VisaAssistanceModal
          currentCurrency={currentCurrency}
          onClose={() => setIsVisaModalOpen(false)}
          isStandaloneSection={false}
        />
      )}
    </div>
  );
}
