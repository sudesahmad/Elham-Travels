import React, { useState } from 'react';
import { 
  FlightTripType, 
  CabinClass, 
  TravelTab, 
  CurrencyCode 
} from '../types/travel';
import { POPULAR_AIRPORTS } from '../data/mockTravelData';
import { 
  Plane, 
  Building2, 
  Car, 
  Compass, 
  FileCheck2, 
  MoonStar, 
  Search, 
  ArrowRightLeft, 
  Users, 
  Calendar,
  Sparkles,
  MapPin,
  CheckCircle2
} from 'lucide-react';

interface HeroSearchEngineProps {
  activeTab: TravelTab;
  onSelectTab: (tab: TravelTab) => void;
  onFlightSearch: (searchParams: {
    origin: string;
    destination: string;
    tripType: FlightTripType;
    departureDate: string;
    returnDate: string;
    passengers: number;
    cabinClass: CabinClass;
  }) => void;
  onHotelSearch: (destination: string, checkIn: string, checkOut: string, guests: number) => void;
  currentCurrency: CurrencyCode;
}

export const HeroSearchEngine: React.FC<HeroSearchEngineProps> = ({
  activeTab,
  onSelectTab,
  onFlightSearch,
  onHotelSearch,
}) => {
  // Flight state
  const [tripType, setTripType] = useState<FlightTripType>('round-trip');
  const [origin, setOrigin] = useState('LOS');
  const [destination, setDestination] = useState('DXB');
  const [departureDate, setDepartureDate] = useState('2026-11-20');
  const [returnDate, setReturnDate] = useState('2026-11-28');
  const [cabinClass, setCabinClass] = useState<CabinClass>('economy');
  const [passengers, setPassengers] = useState(1);

  // Hotel state
  const [hotelDestination, setHotelDestination] = useState('Makkah, Saudi Arabia');
  const [checkIn, setCheckIn] = useState('2026-12-05');
  const [checkOut, setCheckOut] = useState('2026-12-12');
  const [hotelGuests, setHotelGuests] = useState(2);

  const handleSwapAirports = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleRunFlightSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSelectTab('flights');
    onFlightSearch({
      origin,
      destination,
      tripType,
      departureDate,
      returnDate,
      passengers,
      cabinClass
    });
  };

  const handleRunHotelSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSelectTab('hotels');
    onHotelSearch(hotelDestination, checkIn, checkOut, hotelGuests);
  };

  return (
    <section className="relative min-h-[580px] flex items-center justify-center overflow-hidden bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Image with Measured Contrast Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_travel_luxury_1793010783118.jpg"
          alt="Elham Travels First Class Lounge and Luxury Flight Terminal"
          className="w-full h-full object-cover object-center scale-105"
          referrerPolicy="no-referrer"
        />
        {/* Anti-slop measured dark scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-900/60" />
      </div>

      <div className="relative z-10 max-w-6xl w-full mx-auto">
        {/* Hero Copy */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>RC 7412148 · Nigeria & International Global Travel Desk</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3" style={{ textWrap: 'balance' }}>
            Your Journey, Our Priority.
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-normal">
            Book domestic & international flights, 5-star Haram-view Umrah suites, luxury holiday tours, airport chauffeur transfers, and seamless visa processing.
          </p>
        </div>

        {/* Booking Engine Container */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-4 sm:p-6">
          {/* Engine Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-5 border-b border-slate-800 scrollbar-none">
            <button
              onClick={() => onSelectTab('flights')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'flights'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Plane className="w-4 h-4" />
              <span>Flights</span>
            </button>
            <button
              onClick={() => onSelectTab('hotels')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'hotels'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Hotels</span>
            </button>
            <button
              onClick={() => onSelectTab('umrah')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'umrah'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <MoonStar className="w-4 h-4" />
              <span>Umrah & Hajj</span>
            </button>
            <button
              onClick={() => onSelectTab('packages')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'packages'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Holiday Packages</span>
            </button>
            <button
              onClick={() => onSelectTab('visa')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'visa'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Visa Assistance</span>
            </button>
            <button
              onClick={() => onSelectTab('transfers')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'transfers'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Airport Transfers</span>
            </button>
          </div>

          {/* Tab 1: Flights Search Form */}
          {activeTab === 'flights' && (
            <form onSubmit={handleRunFlightSearch} className="space-y-4">
              {/* Trip Type & Cabin Class Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="tripType"
                      checked={tripType === 'round-trip'}
                      onChange={() => setTripType('round-trip')}
                      className="accent-amber-400"
                    />
                    <span>Round-trip</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="tripType"
                      checked={tripType === 'one-way'}
                      onChange={() => setTripType('one-way')}
                      className="accent-amber-400"
                    />
                    <span>One-way</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="tripType"
                      checked={tripType === 'multi-city'}
                      onChange={() => setTripType('multi-city')}
                      className="accent-amber-400"
                    />
                    <span>Multi-city</span>
                  </label>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <select
                      value={passengers}
                      onChange={(e) => setPassengers(parseInt(e.target.value, 10))}
                      className="bg-slate-800 text-white rounded px-2 py-1 text-xs border border-slate-700"
                      aria-label="Number of passengers"
                    >
                      <option value={1}>1 Passenger</option>
                      <option value={2}>2 Passengers</option>
                      <option value={3}>3 Passengers</option>
                      <option value={4}>4 Passengers</option>
                      <option value={6}>6+ Group</option>
                    </select>
                  </div>

                  <select
                    value={cabinClass}
                    onChange={(e) => setCabinClass(e.target.value as CabinClass)}
                    className="bg-slate-800 text-white rounded px-2 py-1 text-xs border border-slate-700"
                    aria-label="Cabin Class"
                  >
                    <option value="economy">Economy Class</option>
                    <option value="premium_economy">Premium Economy</option>
                    <option value="business">Business Class</option>
                    <option value="first">First Class</option>
                  </select>
                </div>
              </div>

              {/* Main Flight Inputs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
                {/* Origin */}
                <div className="lg:col-span-3 bg-slate-800/90 rounded-xl p-3 border border-slate-700 focus-within:border-amber-400 transition-colors">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <span>Departure City or Airport</span>
                  </div>
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full bg-transparent text-white font-semibold text-sm focus:outline-none mt-1 cursor-pointer"
                  >
                    {POPULAR_AIRPORTS.map((apt) => (
                      <option key={`orig-${apt.code}`} value={apt.code} className="bg-slate-900 text-white">
                        {apt.city} ({apt.code}) - {apt.country}
                      </option>
                    ))}
                  </select>
                  <span className="text-[10px] text-slate-400 truncate block">
                    {POPULAR_AIRPORTS.find((a) => a.code === origin)?.name}
                  </span>
                </div>

                {/* Swap Airport Button */}
                <div className="hidden lg:flex lg:col-span-1 justify-center -mx-2">
                  <button
                    type="button"
                    onClick={handleSwapAirports}
                    className="w-9 h-9 rounded-full bg-slate-700 hover:bg-amber-400 hover:text-slate-950 transition-all flex items-center justify-center text-slate-300 shadow"
                    title="Swap route"
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                  </button>
                </div>

                {/* Destination */}
                <div className="lg:col-span-3 bg-slate-800/90 rounded-xl p-3 border border-slate-700 focus-within:border-amber-400 transition-colors">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <span>Arrival Destination</span>
                  </div>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-transparent text-white font-semibold text-sm focus:outline-none mt-1 cursor-pointer"
                  >
                    {POPULAR_AIRPORTS.map((apt) => (
                      <option key={`dest-${apt.code}`} value={apt.code} className="bg-slate-900 text-white">
                        {apt.city} ({apt.code}) - {apt.country}
                      </option>
                    ))}
                  </select>
                  <span className="text-[10px] text-slate-400 truncate block">
                    {POPULAR_AIRPORTS.find((a) => a.code === destination)?.name}
                  </span>
                </div>

                {/* Dates */}
                <div className="lg:col-span-3 bg-slate-800/90 rounded-xl p-3 border border-slate-700 focus-within:border-amber-400 transition-colors">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-400" />
                    <span>Travel Dates</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div>
                      <span className="text-[9px] text-slate-400 block">Depart</span>
                      <input
                        type="date"
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                        className="w-full bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
                      />
                    </div>
                    {tripType === 'round-trip' ? (
                      <div>
                        <span className="text-[9px] text-slate-400 block">Return</span>
                        <input
                          type="date"
                          value={returnDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                          className="w-full bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center text-slate-500 text-[11px] italic">
                        One-way trip
                      </div>
                    )}
                  </div>
                </div>

                {/* Search Button */}
                <div className="lg:col-span-2">
                  <button
                    type="submit"
                    className="w-full h-14 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all text-sm uppercase tracking-wider"
                  >
                    <Search className="w-4 h-4 stroke-[2.5]" />
                    <span>Search</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Tab 2: Hotels Search Form */}
          {activeTab === 'hotels' && (
            <form onSubmit={handleRunHotelSearch} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
                <div className="lg:col-span-5 bg-slate-800/90 rounded-xl p-3 border border-slate-700 focus-within:border-amber-400 transition-colors">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-amber-400" />
                    <span>Destination or Property</span>
                  </div>
                  <input
                    type="text"
                    value={hotelDestination}
                    onChange={(e) => setHotelDestination(e.target.value)}
                    placeholder="City, landmark (e.g., Makkah, Dubai, Lagos, London)"
                    className="w-full bg-transparent text-white font-semibold text-sm focus:outline-none mt-1"
                  />
                  <span className="text-[10px] text-slate-400">Over 500,000 verified luxury hotels worldwide</span>
                </div>

                <div className="lg:col-span-4 bg-slate-800/90 rounded-xl p-3 border border-slate-700 focus-within:border-amber-400 transition-colors">
                  <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-400" />
                    <span>Check-In & Check-Out</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div>
                      <span className="text-[9px] text-slate-400 block">Check-in</span>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block">Check-out</span>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-3 flex items-center gap-3">
                  <div className="w-full bg-slate-800/90 rounded-xl p-3 border border-slate-700">
                    <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                      <Users className="w-3 h-3 text-amber-400" />
                      <span>Guests</span>
                    </div>
                    <select
                      value={hotelGuests}
                      onChange={(e) => setHotelGuests(parseInt(e.target.value, 10))}
                      className="w-full bg-transparent text-white font-semibold text-sm focus:outline-none mt-1 cursor-pointer"
                    >
                      <option value={1} className="bg-slate-900">1 Guest · 1 Room</option>
                      <option value={2} className="bg-slate-900">2 Guests · 1 Room</option>
                      <option value={3} className="bg-slate-900">3 Guests · 1 Room</option>
                      <option value={4} className="bg-slate-900">4 Guests · 2 Rooms</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="h-14 px-6 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all text-sm uppercase tracking-wider shrink-0"
                  >
                    <Search className="w-4 h-4 stroke-[2.5]" />
                    <span>Search</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Quick Shortcuts for Other Tabs */}
          {activeTab !== 'flights' && activeTab !== 'hotels' && (
            <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/50 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-slate-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Viewing {activeTab === 'umrah' ? 'Spiritual Umrah & Hajj Itineraries' : activeTab === 'packages' ? 'Curated International Holiday Packages' : activeTab === 'visa' ? 'Embassy Visa Document Checklist' : 'Chauffeur & Airport Transfers'}
                </span>
              </div>
              <button
                onClick={() => onSelectTab('flights')}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4"
              >
                Switch back to Flight Search
              </button>
            </div>
          )}
        </div>

        {/* Popular Quick Routes Strip */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
          <span className="font-semibold text-slate-300">Popular Routes:</span>
          <button 
            onClick={() => { setOrigin('LOS'); setDestination('ABV'); onSelectTab('flights'); }} 
            className="hover:text-amber-300 transition-colors bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800"
          >
            Lagos ⇄ Abuja (₦145k)
          </button>
          <span className="text-slate-600">·</span>
          <button 
            onClick={() => { setOrigin('LOS'); setDestination('DXB'); onSelectTab('flights'); }} 
            className="hover:text-amber-300 transition-colors bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800"
          >
            Lagos ⇄ Dubai ($940)
          </button>
          <span className="text-slate-600">·</span>
          <button 
            onClick={() => { setOrigin('KAN'); setDestination('JED'); onSelectTab('flights'); }} 
            className="hover:text-amber-300 transition-colors bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800"
          >
            Kano ⇄ Jeddah ($1,050)
          </button>
          <span className="text-slate-600">·</span>
          <button 
            onClick={() => { setOrigin('LOS'); setDestination('LHR'); onSelectTab('flights'); }} 
            className="hover:text-amber-300 transition-colors bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800"
          >
            Lagos ⇄ London Heathrow ($1,380)
          </button>
        </div>
      </div>
    </section>
  );
};
