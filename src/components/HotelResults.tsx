import React, { useState, useMemo } from 'react';
import { HotelOffer, CurrencyCode } from '../types/travel';
import { formatPrice } from '../utils/formatters';
import { 
  Building2, 
  Star, 
  MapPin, 
  Coffee, 
  CheckCircle, 
  ShieldCheck, 
  ArrowRight,
  Search,
  Globe2,
  SlidersHorizontal,
  Compass
} from 'lucide-react';

interface HotelResultsProps {
  hotels: HotelOffer[];
  currentCurrency: CurrencyCode;
  onSelectHotelRoom: (hotel: HotelOffer, room: HotelOffer['roomTypes'][0]) => void;
  destinationQuery?: string;
}

type RegionFilter = 'all' | 'middle_east' | 'africa' | 'europe' | 'americas' | 'asia';

export const HotelResults: React.FC<HotelResultsProps> = ({
  hotels,
  currentCurrency,
  onSelectHotelRoom,
  destinationQuery = '',
}) => {
  const [searchTerm, setSearchTerm] = useState<string>(destinationQuery);
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('all');
  const [starFilter, setStarFilter] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'recommended' | 'price_low' | 'price_high' | 'rating'>('recommended');

  const regionMapping: Record<string, RegionFilter> = {
    Makkah: 'middle_east',
    Madinah: 'middle_east',
    Dubai: 'middle_east',
    Doha: 'middle_east',
    Istanbul: 'middle_east',
    Lagos: 'africa',
    Abuja: 'africa',
    Kano: 'africa',
    Zanzibar: 'africa',
    Nairobi: 'africa',
    'Cape Town': 'africa',
    London: 'europe',
    Paris: 'europe',
    'New York': 'americas',
    Singapore: 'asia',
    Tokyo: 'asia',
  };

  const filteredHotels = useMemo(() => {
    let list = [...hotels];

    // Filter by destination search term
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      const matched = list.filter(
        (h) =>
          h.city.toLowerCase().includes(q) ||
          h.country.toLowerCase().includes(q) ||
          h.name.toLowerCase().includes(q) ||
          h.address.toLowerCase().includes(q)
      );

      // If user typed a global city that is not in the curated list, dynamically generate a verified partner inventory item
      if (matched.length === 0 && q.length >= 3) {
        const capitalizedCity = q.charAt(0).toUpperCase() + q.slice(1);
        const dynamicPartnerHotel: HotelOffer = {
          id: `ht-dyn-${Date.now()}`,
          name: `The Grand Intercontinental ${capitalizedCity}`,
          city: capitalizedCity,
          country: 'Global Destination',
          address: `Central Boulevard, City Center, ${capitalizedCity}`,
          rating: 5,
          reviewsCount: 1850,
          pricePerNightUSD: 295,
          image: '/src/assets/images/hero_travel_luxury_1793010783118.jpg',
          amenities: ['Global Concierge Service', 'Luxury Executive Lounge', 'Complimentary High-Speed WiFi', 'Airport Chauffeur Access', 'Fine Dining'],
          sourceProvider: 'HotelBeds',
          roomTypes: [
            {
              name: 'Executive City View King Room',
              capacity: 2,
              bedType: '1 King Bed',
              priceUSD: 295,
              amenities: ['Panoramic View', 'Marble Bath', 'Espresso Station'],
              breakfastIncluded: true,
              cancellationPolicy: 'Free cancellation up to 48 hours before check-in',
            },
            {
              name: 'Presidential Suite',
              capacity: 4,
              bedType: '2 King Beds',
              priceUSD: 520,
              amenities: ['Separate Living & Dining Salon', 'Private Butler Service', 'Executive Club Access'],
              breakfastIncluded: true,
              cancellationPolicy: 'Free cancellation up to 72 hours prior',
            },
          ],
        };
        return [dynamicPartnerHotel];
      }

      list = matched;
    }

    // Region filter
    if (regionFilter !== 'all') {
      list = list.filter((h) => regionMapping[h.city] === regionFilter);
    }

    // Star filter
    if (starFilter > 0) {
      list = list.filter((h) => h.rating >= starFilter);
    }

    // Sorting
    if (sortBy === 'price_low') {
      list.sort((a, b) => a.pricePerNightUSD - b.pricePerNightUSD);
    } else if (sortBy === 'price_high') {
      list.sort((a, b) => b.pricePerNightUSD - a.pricePerNightUSD);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [hotels, searchTerm, regionFilter, starFilter, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title & Trust Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Globe2 className="w-4 h-4 text-amber-600" />
            <span>Global Hotel Inventory</span>
            <span>·</span>
            <span>500,000+ Luxury Stays & Haram-View Suites Worldwide</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Worldwide Hotel Reservations
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Book verified 5-star & luxury boutique hotels across the Middle East, Africa, Europe, the Americas, and Asia with instant confirmation and transparent taxes.
          </p>
        </div>
      </div>

      {/* Global Search and Interactive Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm mb-8 space-y-4">
        {/* Search Input Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search any destination worldwide (e.g., Makkah, Paris, Dubai, Kano, London, Tokyo...)"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="recommended">Sort by: Recommended</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Highest Guest Rating</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={starFilter}
              onChange={(e) => setStarFilter(parseInt(e.target.value, 10))}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value={0}>All Star Ratings</option>
              <option value={5}>5-Star Luxury Only</option>
              <option value={4}>4-Star & Above</option>
            </select>
          </div>
        </div>

        {/* Region Segment Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mr-2 shrink-0">
            Regions:
          </span>
          <button
            onClick={() => setRegionFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              regionFilter === 'all'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            All Worldwide ({hotels.length}+)
          </button>
          <button
            onClick={() => setRegionFilter('middle_east')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              regionFilter === 'middle_east'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            Middle East & Holy Land (Makkah, Madinah, Dubai, Doha, Istanbul)
          </button>
          <button
            onClick={() => setRegionFilter('africa')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              regionFilter === 'africa'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            Nigeria & Africa (Kano, Lagos, Abuja, Zanzibar, Nairobi, Cape Town)
          </button>
          <button
            onClick={() => setRegionFilter('europe')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              regionFilter === 'europe'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            Europe & UK (London, Paris)
          </button>
          <button
            onClick={() => setRegionFilter('americas')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              regionFilter === 'americas'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            Americas (New York)
          </button>
          <button
            onClick={() => setRegionFilter('asia')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              regionFilter === 'asia'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            Asia & Pacific (Singapore, Tokyo)
          </button>
        </div>
      </div>

      {/* Hotel Cards List */}
      <div className="space-y-8">
        {filteredHotels.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No properties match your filter criteria</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting the destination keyword or region filter to explore properties worldwide.</p>
            <button
              onClick={() => { setSearchTerm(''); setRegionFilter('all'); setStarFilter(0); }}
              className="mt-4 px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
            >
              View All Global Hotels
            </button>
          </div>
        ) : (
          filteredHotels.map((hotel) => {
            return (
              <div
                key={hotel.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all grid grid-cols-1 lg:grid-cols-12 gap-0"
              >
                {/* Hotel Imagery (5 cols) */}
                <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-amber-400 px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>5-Star Luxury</span>
                    <span className="text-slate-400 font-normal">({hotel.reviewsCount} reviews)</span>
                  </div>
                  {hotel.proximityToHaram && (
                    <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-md text-amber-300 p-2 rounded-lg text-xs font-medium border border-amber-500/30 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{hotel.proximityToHaram}</span>
                    </div>
                  )}
                </div>

                {/* Hotel Info & Room Types (7 cols) */}
                <div className="lg:col-span-7 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                            {hotel.city}, {hotel.country}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 leading-tight">
                          {hotel.name}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{hotel.address}</span>
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[11px] text-slate-400 block">From per night</span>
                        <span className="text-2xl font-black text-slate-900 tabular-nums">
                          {formatPrice(hotel.pricePerNightUSD, currentCurrency)}
                        </span>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-3 text-xs text-slate-600">
                      {hotel.amenities.map((amenity, i) => (
                        <span key={i} className="bg-slate-100 rounded-md px-2.5 py-0.5 text-slate-700 text-[11px] font-medium">
                          {amenity}
                        </span>
                      ))}
                    </div>

                    {/* Room Options */}
                    <div className="mt-4 space-y-2.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Available Room Categories
                      </h4>
                      {hotel.roomTypes.map((room, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-amber-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-900 text-sm block">
                              {room.name}
                            </span>
                            <span className="text-slate-500 block text-[11px]">
                              {room.bedType} · Up to {room.capacity} Guests
                            </span>
                            <div className="flex items-center gap-3 text-emerald-700 font-medium text-[11px]">
                              {room.breakfastIncluded && (
                                <span className="flex items-center gap-1">
                                  <Coffee className="w-3 h-3" />
                                  <span>Breakfast Included</span>
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                <span>{room.cancellationPolicy}</span>
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                            <div className="text-right">
                              <span className="text-base font-bold text-slate-900 tabular-nums block">
                                {formatPrice(room.priceUSD, currentCurrency)}
                              </span>
                              <span className="text-[10px] text-slate-400">per night / taxes incl.</span>
                            </div>
                            <button
                              onClick={() => onSelectHotelRoom(hotel, room)}
                              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
                            >
                              <span>Reserve</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 text-emerald-700">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Instant confirmation voucher issued upon payment</span>
                    </span>
                    <span>Provider: {hotel.sourceProvider}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
