import { 
  CurrencyRate, 
  FlightOffer, 
  HotelOffer, 
  HolidayPackage, 
  TransferOption, 
  VisaRequirement,
  UserProfile,
  BookingRecord
} from '../types/travel';

export const CURRENCY_RATES: Record<string, CurrencyRate> = {
  NGN: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', rateToUSD: 1485 },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rateToUSD: 1 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rateToUSD: 0.79 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rateToUSD: 0.92 },
  SAR: { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', rateToUSD: 3.75 },
};

export const POPULAR_AIRPORTS = [
  { code: 'LOS', city: 'Lagos', name: 'Murtala Muhammed International Airport', country: 'Nigeria' },
  { code: 'ABV', city: 'Abuja', name: 'Nnamdi Azikiwe International Airport', country: 'Nigeria' },
  { code: 'PHC', city: 'Port Harcourt', name: 'Port Harcourt International', country: 'Nigeria' },
  { code: 'KAN', city: 'Kano', name: 'Mallam Aminu Kano International', country: 'Nigeria' },
  { code: 'DXB', city: 'Dubai', name: 'Dubai International Airport', country: 'United Arab Emirates' },
  { code: 'LHR', city: 'London', name: 'London Heathrow Airport', country: 'United Kingdom' },
  { code: 'JED', city: 'Jeddah', name: 'King Abdulaziz International Airport (Hajj/Umrah Terminal)', country: 'Saudi Arabia' },
  { code: 'MED', city: 'Madinah', name: 'Prince Mohammad Bin Abdulaziz Airport', country: 'Saudi Arabia' },
  { code: 'JFK', city: 'New York', name: 'John F. Kennedy International', country: 'United States' },
  { code: 'IST', city: 'Istanbul', name: 'Istanbul Airport', country: 'Turkey' },
  { code: 'DOH', city: 'Doha', name: 'Hamad International Airport', country: 'Qatar' },
  { code: 'ZNZ', city: 'Zanzibar', name: 'Abeid Amani Karume International', country: 'Tanzania' },
];

export const INITIAL_FLIGHTS: FlightOffer[] = [
  {
    id: 'fl-101',
    airline: 'Air Peace',
    airlineCode: 'P4',
    airlineLogo: '🦅',
    tripType: 'round-trip',
    priceUSD: 145,
    refundable: true,
    seatsLeft: 7,
    sourceProvider: 'Direct Airline NDC',
    fareConditions: ['Free 20kg checked baggage', 'Seat selection included', 'Date change allowed with ₦15,000 fee'],
    outbound: {
      airline: 'Air Peace',
      airlineCode: 'P4',
      airlineLogo: '🦅',
      flightNumber: 'P4 7120',
      aircraft: 'Boeing 737-800',
      origin: { code: 'LOS', city: 'Lagos', airport: 'Murtala Muhammed Terminal 2 (MMA2)' },
      destination: { code: 'ABV', city: 'Abuja', airport: 'Nnamdi Azikiwe Domestic' },
      departureTime: '07:15',
      arrivalTime: '08:30',
      durationMinutes: 75,
      stops: 0,
      baggageAllowance: '1 x 20kg check-in + 7kg cabin',
      cabinClass: 'economy',
    },
    inbound: {
      airline: 'Air Peace',
      airlineCode: 'P4',
      airlineLogo: '🦅',
      flightNumber: 'P4 7125',
      aircraft: 'Boeing 737-800',
      origin: { code: 'ABV', city: 'Abuja', airport: 'Nnamdi Azikiwe Domestic' },
      destination: { code: 'LOS', city: 'Lagos', airport: 'Murtala Muhammed Terminal 2 (MMA2)' },
      departureTime: '17:30',
      arrivalTime: '18:45',
      durationMinutes: 75,
      stops: 0,
      baggageAllowance: '1 x 20kg check-in + 7kg cabin',
      cabinClass: 'economy',
    }
  },
  {
    id: 'fl-102',
    airline: 'Ibom Air',
    airlineCode: 'QI',
    airlineLogo: '✈️',
    tripType: 'round-trip',
    priceUSD: 160,
    refundable: true,
    seatsLeft: 4,
    sourceProvider: 'Direct Airline NDC',
    fareConditions: ['Guaranteed on-time departure', 'Complimentary inflight snack', '1 free date change'],
    outbound: {
      airline: 'Ibom Air',
      airlineCode: 'QI',
      airlineLogo: '✈️',
      flightNumber: 'QI 0502',
      aircraft: 'Airbus A220-300',
      origin: { code: 'LOS', city: 'Lagos', airport: 'Murtala Muhammed Terminal 2' },
      destination: { code: 'ABV', city: 'Abuja', airport: 'Nnamdi Azikiwe Domestic' },
      departureTime: '09:00',
      arrivalTime: '10:10',
      durationMinutes: 70,
      stops: 0,
      baggageAllowance: '1 x 23kg check-in + 7kg cabin',
      cabinClass: 'economy',
    },
    inbound: {
      airline: 'Ibom Air',
      airlineCode: 'QI',
      airlineLogo: '✈️',
      flightNumber: 'QI 0507',
      aircraft: 'Airbus A220-300',
      origin: { code: 'ABV', city: 'Abuja', airport: 'Nnamdi Azikiwe Domestic' },
      destination: { code: 'LOS', city: 'Lagos', airport: 'Murtala Muhammed Terminal 2' },
      departureTime: '18:15',
      arrivalTime: '19:25',
      durationMinutes: 70,
      stops: 0,
      baggageAllowance: '1 x 23kg check-in + 7kg cabin',
      cabinClass: 'economy',
    }
  },
  {
    id: 'fl-103',
    airline: 'Qatar Airways',
    airlineCode: 'QR',
    airlineLogo: '🇶🇦',
    tripType: 'round-trip',
    priceUSD: 940,
    refundable: true,
    seatsLeft: 9,
    sourceProvider: 'Amadeus',
    fareConditions: ['World’s Best Airline 2024/2025', '2 x 23kg checked bags', 'Complimentary transit lounge in Doha'],
    outbound: {
      airline: 'Qatar Airways',
      airlineCode: 'QR',
      airlineLogo: '🇶🇦',
      flightNumber: 'QR 1408',
      aircraft: 'Boeing 787-9 Dreamliner',
      origin: { code: 'LOS', city: 'Lagos', airport: 'Murtala Muhammed Intl (MMIA)' },
      destination: { code: 'DXB', city: 'Dubai', airport: 'Dubai Intl (DXB)' },
      departureTime: '13:40',
      arrivalTime: '02:50',
      durationMinutes: 610,
      stops: 1,
      stopoverAirports: ['DOH (1h 45m stop)'],
      baggageAllowance: '2 x 23kg check-in + 8kg cabin',
      cabinClass: 'economy',
    },
    inbound: {
      airline: 'Qatar Airways',
      airlineCode: 'QR',
      airlineLogo: '🇶🇦',
      flightNumber: 'QR 1409',
      aircraft: 'Boeing 787-9 Dreamliner',
      origin: { code: 'DXB', city: 'Dubai', airport: 'Dubai Intl (DXB)' },
      destination: { code: 'LOS', city: 'Lagos', airport: 'Murtala Muhammed Intl (MMIA)' },
      departureTime: '06:15',
      arrivalTime: '15:20',
      durationMinutes: 665,
      stops: 1,
      stopoverAirports: ['DOH (2h 10m stop)'],
      baggageAllowance: '2 x 23kg check-in + 8kg cabin',
      cabinClass: 'economy',
    }
  },
  {
    id: 'fl-104',
    airline: 'Emirates',
    airlineCode: 'EK',
    airlineLogo: '🇦🇪',
    tripType: 'round-trip',
    priceUSD: 1120,
    refundable: true,
    seatsLeft: 5,
    sourceProvider: 'Amadeus',
    fareConditions: ['Direct Non-stop Flight', '2 x 23kg allowance', 'World-class ICE inflight entertainment', 'Chauffeur eligible for Business'],
    outbound: {
      airline: 'Emirates',
      airlineCode: 'EK',
      airlineLogo: '🇦🇪',
      flightNumber: 'EK 784',
      aircraft: 'Boeing 777-300ER',
      origin: { code: 'LOS', city: 'Lagos', airport: 'Murtala Muhammed Intl (MMIA)' },
      destination: { code: 'DXB', city: 'Dubai', airport: 'Dubai Intl Terminal 3' },
      departureTime: '17:50',
      arrivalTime: '05:10',
      durationMinutes: 440,
      stops: 0,
      baggageAllowance: '2 x 23kg check-in + 7kg carry-on',
      cabinClass: 'economy',
    },
    inbound: {
      airline: 'Emirates',
      airlineCode: 'EK',
      airlineLogo: '🇦🇪',
      flightNumber: 'EK 783',
      aircraft: 'Boeing 777-300ER',
      origin: { code: 'DXB', city: 'Dubai', airport: 'Dubai Intl Terminal 3' },
      destination: { code: 'LOS', city: 'Lagos', airport: 'Murtala Muhammed Intl (MMIA)' },
      departureTime: '10:30',
      arrivalTime: '15:40',
      durationMinutes: 490,
      stops: 0,
      baggageAllowance: '2 x 23kg check-in + 7kg carry-on',
      cabinClass: 'economy',
    }
  },
  {
    id: 'fl-105',
    airline: 'Saudi Arabian Airlines (Saudia)',
    airlineCode: 'SV',
    airlineLogo: '🇸🇦',
    tripType: 'round-trip',
    priceUSD: 1050,
    refundable: true,
    seatsLeft: 8,
    sourceProvider: 'Direct Airline NDC',
    fareConditions: ['Official Carrier for Umrah & Hajj', 'Free 5-Litre Zamzam water box allowance on return', 'Halal certified meals'],
    outbound: {
      airline: 'Saudia',
      airlineCode: 'SV',
      airlineLogo: '🇸🇦',
      flightNumber: 'SV 434',
      aircraft: 'Airbus A330-300',
      origin: { code: 'KAN', city: 'Kano', airport: 'Mallam Aminu Kano Intl' },
      destination: { code: 'JED', city: 'Jeddah', airport: 'King Abdulaziz Intl (Hajj Terminal)' },
      departureTime: '11:00',
      arrivalTime: '18:40',
      durationMinutes: 340,
      stops: 0,
      baggageAllowance: '2 x 23kg check-in + 1 x 5L Zamzam water',
      cabinClass: 'economy',
    },
    inbound: {
      airline: 'Saudia',
      airlineCode: 'SV',
      airlineLogo: '🇸🇦',
      flightNumber: 'SV 435',
      aircraft: 'Airbus A330-300',
      origin: { code: 'JED', city: 'Jeddah', airport: 'King Abdulaziz Intl' },
      destination: { code: 'KAN', city: 'Kano', airport: 'Mallam Aminu Kano Intl' },
      departureTime: '04:15',
      arrivalTime: '08:45',
      durationMinutes: 390,
      stops: 0,
      baggageAllowance: '2 x 23kg check-in + 1 x 5L Zamzam water',
      cabinClass: 'economy',
    }
  },
  {
    id: 'fl-106',
    airline: 'British Airways',
    airlineCode: 'BA',
    airlineLogo: '🇬🇧',
    tripType: 'round-trip',
    priceUSD: 1380,
    refundable: true,
    seatsLeft: 3,
    sourceProvider: 'Amadeus',
    fareConditions: ['Direct Non-stop to London Heathrow', 'Full English catering', 'Avios mileage earnings'],
    outbound: {
      airline: 'British Airways',
      airlineCode: 'BA',
      airlineLogo: '🇬🇧',
      flightNumber: 'BA 074',
      aircraft: 'Boeing 777-200',
      origin: { code: 'LOS', city: 'Lagos', airport: 'Murtala Muhammed Intl (MMIA)' },
      destination: { code: 'LHR', city: 'London', airport: 'Heathrow Terminal 5' },
      departureTime: '22:55',
      arrivalTime: '05:35',
      durationMinutes: 400,
      stops: 0,
      baggageAllowance: '2 x 23kg check-in + 1 personal bag',
      cabinClass: 'economy',
    },
    inbound: {
      airline: 'British Airways',
      airlineCode: 'BA',
      airlineLogo: '🇬🇧',
      flightNumber: 'BA 075',
      aircraft: 'Boeing 777-200',
      origin: { code: 'LHR', city: 'London', airport: 'Heathrow Terminal 5' },
      destination: { code: 'LOS', city: 'Lagos', airport: 'Murtala Muhammed Intl (MMIA)' },
      departureTime: '11:45',
      arrivalTime: '18:35',
      durationMinutes: 410,
      stops: 0,
      baggageAllowance: '2 x 23kg check-in + 1 personal bag',
      cabinClass: 'economy',
    }
  }
];

export const INITIAL_HOTELS: HotelOffer[] = [
  {
    id: 'ht-201',
    name: 'Makkah Clock Royal Tower, A Fairmont Hotel',
    city: 'Makkah',
    country: 'Saudi Arabia',
    address: 'King Abdul Aziz Endowment, Abraj Al Bait Complex',
    rating: 5,
    reviewsCount: 3840,
    pricePerNightUSD: 290,
    image: '/src/assets/images/dest_mecca_madinah_1793010787032.jpg',
    proximityToHaram: 'Direct elevator access to Masjid Al-Haram plaza',
    amenities: ['Direct Haram View', 'Complimentary Arabic Breakfast', 'High-Speed WiFi', 'Prayer Hall with Kaaba audio feed', 'Concierge Service'],
    sourceProvider: 'Direct Contract',
    roomTypes: [
      {
        name: 'Deluxe Kaaba View Room',
        capacity: 2,
        bedType: '2 Twin or 1 King Bed',
        priceUSD: 340,
        amenities: ['Panoramic Kaaba View', 'Marble Bath', 'Espresso Machine'],
        breakfastIncluded: true,
        cancellationPolicy: 'Free cancellation up to 72 hours before check-in'
      },
      {
        name: 'Fairmont City View Suite',
        capacity: 4,
        bedType: '2 Queen Beds',
        priceUSD: 290,
        amenities: ['City View', 'Separate Living Area', 'Executive Lounge Access'],
        breakfastIncluded: true,
        cancellationPolicy: 'Non-refundable discount rate'
      }
    ]
  },
  {
    id: 'ht-202',
    name: 'The Oberoi, Madinah',
    city: 'Madinah',
    country: 'Saudi Arabia',
    address: 'Northern Central Area, near Al-Masjid an-Nabawi',
    rating: 5,
    reviewsCount: 2190,
    pricePerNightUSD: 245,
    image: '/src/assets/images/dest_mecca_madinah_1793010787032.jpg',
    proximityToHaram: 'Facing the Prophet’s Mosque women’s and men’s gates',
    amenities: ['Prophet’s Mosque View', 'Butler Service', 'On-site Fine Dining', 'Free Parking', 'Luxury Spa'],
    sourceProvider: 'Direct Contract',
    roomTypes: [
      {
        name: 'Executive Haram View Room',
        capacity: 2,
        bedType: '1 King Bed',
        priceUSD: 280,
        amenities: ['Direct Green Dome View', 'Bespoke Oberoi Linens', '24h Room Service'],
        breakfastIncluded: true,
        cancellationPolicy: 'Free cancellation up to 48 hours before check-in'
      }
    ]
  },
  {
    id: 'ht-203',
    name: 'Atlantis The Royal, Palm Jumeirah',
    city: 'Dubai',
    country: 'United Arab Emirates',
    address: 'Crescent Road, Palm Jumeirah, Dubai',
    rating: 5,
    reviewsCount: 1640,
    pricePerNightUSD: 520,
    image: '/src/assets/images/dest_dubai_skyline_1793010783631.jpg',
    amenities: ['Private Beach', 'Cloud 22 Sky Pool', '17 World-class Restaurants', 'Complimentary Aquaventure Access', 'VIP Chauffeur Pickup'],
    sourceProvider: 'HotelBeds',
    roomTypes: [
      {
        name: 'Seascape King Room',
        capacity: 2,
        bedType: '1 King Bed with Arabian Gulf view',
        priceUSD: 520,
        amenities: ['Deep soaking tub', 'Private balcony', 'Hermès bath amenities'],
        breakfastIncluded: true,
        cancellationPolicy: 'Free cancellation up to 5 days before check-in'
      }
    ]
  },
  {
    id: 'ht-204',
    name: 'The Residence Zanzibar Luxury Resort',
    city: 'Zanzibar',
    country: 'Tanzania',
    address: 'Kizimkazi Dimbani, Southwest Coast',
    rating: 5,
    reviewsCount: 910,
    pricePerNightUSD: 360,
    image: '/src/assets/images/dest_zanzibar_beach_1793010783801.jpg',
    amenities: ['Private Plunge Pool Villas', 'Coral Reef Scuba Diving', 'Sunset Dhow Cruises', 'All-Inclusive Dine Around', 'Spa Sanctuary'],
    sourceProvider: 'HotelBeds',
    roomTypes: [
      {
        name: 'Luxury Ocean Front Pool Villa',
        capacity: 3,
        bedType: '1 King Bed + Daybed',
        priceUSD: 360,
        amenities: ['Private infinity pool', 'Outdoor garden shower', 'Bicycles for exploring'],
        breakfastIncluded: true,
        cancellationPolicy: 'Free cancellation up to 7 days before check-in'
      }
    ]
  },
  {
    id: 'ht-205',
    name: 'The Transcorp Hilton Abuja',
    city: 'Abuja',
    country: 'Nigeria',
    address: '1 Aguiyi Ironsi Street, Maitama, Abuja',
    rating: 5,
    reviewsCount: 3100,
    pricePerNightUSD: 230,
    image: '/src/assets/images/hero_travel_luxury_1793010783118.jpg',
    amenities: ['High-level Security Compound', 'Olympic Swimming Pool', 'Executive Lounge', 'Tennis Courts', 'Piano Bar'],
    sourceProvider: 'Direct Contract',
    roomTypes: [
      {
        name: 'Executive Diplomatic Room',
        capacity: 2,
        bedType: '1 King Bed',
        priceUSD: 230,
        amenities: ['Executive Lounge access with evening cocktails', 'Ergonomic work desk', 'High speed fiber WiFi'],
        breakfastIncluded: true,
        cancellationPolicy: 'Free cancellation until 24 hours prior to arrival'
      }
    ]
  },
  {
    id: 'ht-206',
    name: 'Eko Hotels & Suites Victoria Island',
    city: 'Lagos',
    country: 'Nigeria',
    address: 'Plot 1415 Adetokunbo Ademola Street, Victoria Island, Lagos',
    rating: 5,
    reviewsCount: 4200,
    pricePerNightUSD: 195,
    image: '/src/assets/images/hero_travel_luxury_1793010783118.jpg',
    amenities: ['Kuramo Waters View', '8 Gourmet Restaurants', 'Eko Convention Centre', 'Gym & Wellness Center', '24h Armed Security Patrol'],
    sourceProvider: 'Direct Contract',
    roomTypes: [
      {
        name: 'Eko Signature Ocean Suite',
        capacity: 2,
        bedType: '1 King Bed',
        priceUSD: 260,
        amenities: ['Signature VIP wing check-in', 'Atlantic Ocean view', 'Complimentary high tea'],
        breakfastIncluded: true,
        cancellationPolicy: 'Free cancellation up to 24 hours prior'
      }
    ]
  },
  {
    id: 'ht-207',
    name: 'Bristol Palace Hotel',
    city: 'Kano',
    country: 'Nigeria',
    address: '54/56 Guda Abdullahi Road, Farm Centre, Kano',
    rating: 5,
    reviewsCount: 1450,
    pricePerNightUSD: 175,
    image: '/src/assets/images/hero_travel_luxury_1793010783118.jpg',
    amenities: ['Luxury Suites', 'Fine Dining Restaurant', 'High-Security Diplomatic Perimeter', 'Outdoor Pool', 'VIP Airport Transfer'],
    sourceProvider: 'Direct Contract',
    roomTypes: [
      {
        name: 'Royal Executive Suite',
        capacity: 2,
        bedType: '1 King Bed',
        priceUSD: 175,
        amenities: ['Private Living Room', 'Marble Bathroom', 'Complimentary Buffet Breakfast'],
        breakfastIncluded: true,
        cancellationPolicy: 'Free cancellation up to 24 hours prior'
      }
    ]
  },
  {
    id: 'ht-208',
    name: 'The Ritz London',
    city: 'London',
    country: 'United Kingdom',
    address: '150 Piccadilly, St. James\'s, London W1J 9BR',
    rating: 5,
    reviewsCount: 5200,
    pricePerNightUSD: 780,
    image: '/src/assets/images/hero_travel_luxury_1793010783118.jpg',
    amenities: ['Michelin-Starred Dining', 'World-Famous Afternoon Tea', 'Rolls-Royce Phantom Chauffeur', 'Green Park Views', '24h Butler'],
    sourceProvider: 'HotelBeds',
    roomTypes: [
      {
        name: 'Superior Queen Room',
        capacity: 2,
        bedType: '1 Queen Bed',
        priceUSD: 780,
        amenities: ['Louis XVI style decor', 'Marble fireplace', 'Luxury Asprey toiletries'],
        breakfastIncluded: true,
        cancellationPolicy: 'Free cancellation up to 48 hours prior'
      }
    ]
  },
  {
    id: 'ht-209',
    name: 'Four Seasons Hotel George V',
    city: 'Paris',
    country: 'France',
    address: '31 Avenue George V, 8th Arrondissement, Paris',
    rating: 5,
    reviewsCount: 4600,
    pricePerNightUSD: 950,
    image: '/src/assets/images/hero_travel_luxury_1793010783118.jpg',
    amenities: ['5 Michelin Stars across 3 Restaurants', 'Eiffel Tower View Penthouses', 'Jeff Leatham Floral Art', 'Luxury Spa Sanctuary', 'Courtyard Garden'],
    sourceProvider: 'HotelBeds',
    roomTypes: [
      {
        name: 'Deluxe City View Room',
        capacity: 2,
        bedType: '1 King Bed',
        priceUSD: 950,
        amenities: ['Private Parisian terrace', 'Hermès bath products', 'Interactive digital concierge'],
        breakfastIncluded: true,
        cancellationPolicy: 'Free cancellation up to 72 hours prior'
      }
    ]
  },
  {
    id: 'ht-210',
    name: 'The Plaza Hotel, Fifth Avenue',
    city: 'New York',
    country: 'United States',
    address: '768 5th Ave, Manhattan, New York, NY 10019',
    rating: 5,
    reviewsCount: 6800,
    pricePerNightUSD: 820,
    image: '/src/assets/images/hero_travel_luxury_1793010783118.jpg',
    amenities: ['Central Park Views', 'The Palm Court Champagne Lounge', 'Guerlain Spa', 'White Glove Butler Service', 'Manhattan Concierge'],
    sourceProvider: 'Expedia Partner',
    roomTypes: [
      {
        name: 'Plaza King Room',
        capacity: 2,
        bedType: '1 King Bed',
        priceUSD: 820,
        amenities: ['24-karat gold-plated bath fixtures', 'High ceilings', 'Central Park view'],
        breakfastIncluded: true,
        cancellationPolicy: 'Free cancellation up to 48 hours prior'
      }
    ]
  },
  {
    id: 'ht-211',
    name: 'The St. Regis Doha',
    city: 'Doha',
    country: 'Qatar',
    address: 'Doha West Bay, Diplomatic Area, Doha',
    rating: 5,
    reviewsCount: 3100,
    pricePerNightUSD: 380,
    image: '/src/assets/images/dest_dubai_skyline_1793010783631.jpg',
    amenities: ['Olympic-size Pool', 'Private Beach Cabanas', 'Remède Spa', 'Gordon Ramsay Mediterranean', 'St. Regis Butler Service'],
    sourceProvider: 'HotelBeds',
    roomTypes: [
      {
        name: 'Grand Deluxe Arabian Gulf View',
        capacity: 3,
        bedType: '1 King or 2 Double Beds',
        priceUSD: 380,
        amenities: ['Arabian Gulf view', 'Marble bathroom', '24h butler service'],
        breakfastIncluded: true,
        cancellationPolicy: 'Free cancellation up to 24 hours prior'
      }
    ]
  },
  {
    id: 'ht-212',
    name: 'Çırağan Palace Kempinski',
    city: 'Istanbul',
    country: 'Turkey',
    address: 'Çırağan Caddesi 32, Beşiktaş, Istanbul',
    rating: 5,
    reviewsCount: 4100,
    pricePerNightUSD: 490,
    image: '/src/assets/images/hero_travel_luxury_1793010783118.jpg',
    amenities: ['Ottoman Imperial Palace Hotel', 'Infinity Pool on Bosphorus', 'Helipad Access', 'Tuğra Fine Ottoman Dining', 'Private Boat Moorings'],
    sourceProvider: 'Direct Contract',
    roomTypes: [
      {
        name: 'Bosphorus View Deluxe Room',
        capacity: 2,
        bedType: '1 King Bed',
        priceUSD: 490,
        amenities: ['Private balcony over the Bosphorus', 'Ottoman marble bath', 'VIP arrival welcome'],
        breakfastIncluded: true,
        cancellationPolicy: 'Free cancellation up to 48 hours prior'
      }
    ]
  },
  {
    id: 'ht-213',
    name: 'Marina Bay Sands',
    city: 'Singapore',
    country: 'Singapore',
    address: '10 Bayfront Avenue, Singapore 018956',
    rating: 5,
    reviewsCount: 8900,
    pricePerNightUSD: 540,
    image: '/src/assets/images/dest_dubai_skyline_1793010783631.jpg',
    amenities: ['World\'s Largest Rooftop Infinity Pool', 'Sands SkyPark Observation Deck', 'Celebrity Chef Dining', 'ArtScience Museum Access', 'Luxury Shopping Galleria'],
    sourceProvider: 'HotelBeds',
    roomTypes: [
      {
        name: 'Sands Premier Room',
        capacity: 3,
        bedType: '1 King Bed',
        priceUSD: 540,
        amenities: ['Harbour view', 'Deep soaking bathtub', 'Rooftop infinity pool pass included'],
        breakfastIncluded: true,
        cancellationPolicy: 'Free cancellation up to 72 hours prior'
      }
    ]
  },
  {
    id: 'ht-214',
    name: 'The Silo Hotel',
    city: 'Cape Town',
    country: 'South Africa',
    address: 'Silo Square, V&A Waterfront, Cape Town',
    rating: 5,
    reviewsCount: 1200,
    pricePerNightUSD: 670,
    image: '/src/assets/images/hero_travel_luxury_1793010783118.jpg',
    amenities: ['Iconic Pillowed Glass Windows', 'Table Mountain Panoramic View', 'Rooftop Champagne Bar & Glass Pool', 'Above Zeitz MOCAA Art Museum', 'V&A Waterfront Walking Access'],
    sourceProvider: 'HotelBeds',
    roomTypes: [
      {
        name: 'Superior Harbour View Suite',
        capacity: 2,
        bedType: '1 King Bed',
        priceUSD: 670,
        amenities: ['Table Mountain & Harbour view', 'Freestanding Victorian bathtub', 'Artisan breakfast'],
        breakfastIncluded: true,
        cancellationPolicy: 'Free cancellation up to 7 days prior'
      }
    ]
  },
  {
    id: 'ht-215',
    name: 'Villa Rosa Kempinski',
    city: 'Nairobi',
    country: 'Kenya',
    address: 'Chiromo Road, Westlands, Nairobi',
    rating: 5,
    reviewsCount: 2900,
    pricePerNightUSD: 240,
    image: '/src/assets/images/hero_travel_luxury_1793010783118.jpg',
    amenities: ['Diplomatic Enclave Security', 'Kempinski The Spa', 'Heated Outdoor Pool', '8 Dining Venues', 'Nairobi National Park Safari Desk'],
    sourceProvider: 'Direct Contract',
    roomTypes: [
      {
        name: 'Executive Nairobi View Room',
        capacity: 2,
        bedType: '1 King Bed',
        priceUSD: 240,
        amenities: ['City skyline view', 'Executive Lounge access', 'Daily gourmet breakfast'],
        breakfastIncluded: true,
        cancellationPolicy: 'Free cancellation up to 24 hours prior'
      }
    ]
  },
  {
    id: 'ht-216',
    name: 'The Peninsula Tokyo',
    city: 'Tokyo',
    country: 'Japan',
    address: '1-8-1 Yurakucho, Chiyoda-ku, Tokyo',
    rating: 5,
    reviewsCount: 3700,
    pricePerNightUSD: 750,
    image: '/src/assets/images/hero_travel_luxury_1793010783118.jpg',
    amenities: ['Imperial Palace Garden Views', 'Ginza Shopping District 3m Walk', 'Custom Rolls-Royce Fleet', 'Traditional Japanese Bathing & Spa', 'Michelin-Caliber Teppanyaki'],
    sourceProvider: 'HotelBeds',
    roomTypes: [
      {
        name: 'Deluxe Imperial Garden View',
        capacity: 2,
        bedType: '1 King or 2 Twin Beds',
        priceUSD: 750,
        amenities: ['Imperial Gardens view', 'Dressing room & nail dryer', 'Spa-style bathroom with TV'],
        breakfastIncluded: true,
        cancellationPolicy: 'Free cancellation up to 48 hours prior'
      }
    ]
  }
];

export interface PartnerItem {
  id: string;
  name: string;
  category: 'airline' | 'hospitality' | 'payment' | 'accreditation';
  logoText: string;
  badge: string;
  description: string;
}

export const PARTNERS_DATA: PartnerItem[] = [
  // Airlines
  { id: 'p-1', name: 'Emirates', category: 'airline', logoText: '🇦🇪 Emirates', badge: 'Premier Global Airline', description: 'Non-stop flights connecting Lagos & Abuja to Dubai and 140+ worldwide destinations.' },
  { id: 'p-2', name: 'Qatar Airways', category: 'airline', logoText: '🇶🇦 Qatar Airways', badge: 'Skytrax World Best 2024/2025', description: 'Award-winning flights connecting Nigeria via Hamad International Airport Doha.' },
  { id: 'p-3', name: 'Air Peace', category: 'airline', logoText: '🦅 Air Peace', badge: 'Flag Carrier Partner', description: 'Extensive Nigerian domestic network and regional/international routes.' },
  { id: 'p-4', name: 'Saudi Arabian Airlines (Saudia)', category: 'airline', logoText: '🇸🇦 Saudia', badge: 'Official Umrah & Hajj Carrier', description: 'Direct pilgrim flights to Jeddah and Madinah with return Zamzam water allowances.' },
  { id: 'p-5', name: 'British Airways', category: 'airline', logoText: '🇬🇧 British Airways', badge: 'Direct UK Service', description: 'Daily non-stop departures from Lagos and Abuja to London Heathrow Terminal 5.' },
  { id: 'p-6', name: 'Ibom Air', category: 'airline', logoText: '✈️ Ibom Air', badge: 'Punctuality Leader', description: 'Top-tier on-time domestic flights across Lagos, Abuja, Uyo, Enugu, and Calabar.' },
  { id: 'p-7', name: 'Turkish Airlines', category: 'airline', logoText: '🇹🇷 Turkish Airlines', badge: 'Most Countries Served', description: 'Seamless connections from Lagos and Abuja to Europe, Asia, and the Americas.' },
  { id: 'p-8', name: 'Ethiopian Airlines', category: 'airline', logoText: '🇪🇹 Ethiopian Airlines', badge: 'Pan-African Hub', description: 'Direct connections across Africa, Middle East, Europe, and Asia.' },
  
  // Hospitality
  { id: 'p-9', name: 'Marriott Bonvoy', category: 'hospitality', logoText: '🏨 Marriott Bonvoy', badge: '30+ Luxury Brands', description: 'Global preferred partner rates across The Ritz-Carlton, St. Regis, JW Marriott, and W Hotels.' },
  { id: 'p-10', name: 'Fairmont Hotels & Resorts', category: 'hospitality', logoText: '🕋 Fairmont & Accor', badge: 'Makkah Clock Royal Tower', description: 'Official Haram-plaza suite partner in Makkah Abraj Al-Bait Complex.' },
  { id: 'p-11', name: 'The Oberoi Group', category: 'hospitality', logoText: '🕌 The Oberoi Madinah', badge: 'Prophet’s Mosque Front', description: 'Unrivalled 5-star hospitality facing Al-Masjid an-Nabawi in Madinah.' },
  { id: 'p-12', name: 'Hilton Worldwide', category: 'hospitality', logoText: '💎 Hilton Worldwide', badge: 'Transcorp Hilton & Global', description: 'Executive suites, Waldorf Astoria, Conrad, and Hilton Honors perks.' },
  { id: 'p-13', name: 'HotelBeds & Expedia Partner Solutions', category: 'hospitality', logoText: '🌐 HotelBeds & EPS', badge: '500k+ Global Properties', description: 'Direct API inventory for instant hotel reservations anywhere in the world.' },
  { id: 'p-14', name: 'Jumeirah & Kerzner International', category: 'hospitality', logoText: '🌴 Atlantis & Jumeirah', badge: 'Dubai Iconic Resorts', description: 'Exclusive packages for Atlantis The Royal and Burj Al Arab.' },

  // Payments & Regulatory
  { id: 'p-15', name: 'Paystack (by Stripe)', category: 'payment', logoText: '💳 Paystack', badge: 'PCI-DSS Level 1', description: 'Instant, secure Nigerian card and virtual bank transfer processing.' },
  { id: 'p-16', name: 'Flutterwave Enterprise', category: 'payment', logoText: '🌍 Flutterwave', badge: 'Multi-Currency Gateway', description: 'Global payments handling USD, GBP, EUR, and international payment methods.' },
  { id: 'p-17', name: 'IATA Accredited Agent', category: 'accreditation', logoText: '✈️ IATA Global Code', badge: 'Global Air Transport Standard', description: 'Authorized international ticket issuance under IATA BSP governance.' },
  { id: 'p-18', name: 'Nigerian Civil Aviation Authority (NCAA)', category: 'accreditation', logoText: '🇳🇬 NCAA Licensed', badge: 'Regulatory Compliance', description: 'Fully compliant with Nigerian passenger rights and aviation statutes.' },
  { id: 'p-19', name: 'Amadeus & Sabre GDS', category: 'accreditation', logoText: '🖥️ Amadeus & Sabre GDS', badge: 'Global Travel Distribution', description: 'Real-time global seat availability, PNR confirmation, and airline reservation sync.' },
  { id: 'p-20', name: 'Haramain High-Speed Railway', category: 'accreditation', logoText: '🚄 Haramain Railway', badge: 'Official Saudi Rail Partner', description: 'VIP Bullet train booking between Makkah, Jeddah Airport, and Madinah.' },
];


export const INITIAL_PACKAGES: HolidayPackage[] = [
  {
    id: 'pkg-301',
    title: 'VIP Ramadan & Shawwal Umrah Journey',
    subtitle: '14-Day Spiritual Experience in 5-Star Haram Front Luxury',
    destination: 'Makkah & Madinah',
    country: 'Saudi Arabia',
    durationDays: 14,
    durationNights: 13,
    priceUSD: 3150,
    category: 'Umrah',
    image: '/src/assets/images/dest_mecca_madinah_1793010787032.jpg',
    featured: true,
    highlights: [
      'Fairmont Makkah Clock Tower (Kaaba Front) - 7 Nights',
      'The Oberoi Madinah (Prophet’s Mosque Front) - 6 Nights',
      'High-speed Haramain Bullet Train First Class transfer between Makkah & Madinah',
      'Dedicated Islamic Scholar and multilingual Nigerian pilgrim coordinator',
      'Full Ziyarah guided historical tours in Makkah (Jabal Al-Nour, Mina, Arafat) and Madinah (Quba, Mount Uhud)',
      'Guaranteed 5-Litre Zamzam water upon departure'
    ],
    inclusions: [
      'Return flights (Air Peace or Saudia)',
      'Saudi Tourist/Umrah Visa processing',
      '5-Star luxury accommodation with daily Suhoor/Breakfast',
      'All VIP transfers in private GMC Yukon or air-conditioned luxury bus',
      'Comprehensive travel insurance and medical coverage'
    ],
    exclusions: [
      'Personal expenses & shopping',
      'Voluntary tipping'
    ],
    departureDates: ['2026-11-15', '2026-12-05', '2027-01-20', '2027-02-15']
  },
  {
    id: 'pkg-302',
    title: 'Dubai Luxury Skyline & Desert Safari Escape',
    subtitle: '7-Day Glamour, Yacht Cruise, and Desert Adventure',
    destination: 'Dubai',
    country: 'United Arab Emirates',
    durationDays: 7,
    durationNights: 6,
    priceUSD: 1480,
    category: 'Luxury',
    image: '/src/assets/images/dest_dubai_skyline_1793010783631.jpg',
    featured: true,
    highlights: [
      'JW Marriott Marquis or Atlantis Palm Jumeirah accommodation',
      'Private Marina Sunset Yacht cruise with live barbecue dinner',
      'VIP 4x4 Dune Bashing, Quad Biking & Bedouin camp entertainment',
      'Burj Khalifa 124th/125th floor observation deck access',
      'Day trip to Abu Dhabi: Sheikh Zayed Grand Mosque & Louvre Museum'
    ],
    inclusions: [
      'Return flights from Lagos or Abuja',
      'UAE 30-Day Tourist Visa with insurance',
      'Airport Meet & Greet with private Mercedes transfer',
      'Daily 5-star international buffet breakfast',
      'All excursion admissions and English-speaking tour guides'
    ],
    exclusions: ['Tourism Dirham tax (payable directly at hotel)', 'Lunch and personal shopping'],
    departureDates: ['2026-11-10', '2026-12-01', '2026-12-22 (Christmas Special)', '2027-01-14']
  },
  {
    id: 'pkg-303',
    title: 'Zanzibar Spice Island & Turquoise Beach Paradise',
    subtitle: '6-Day Tropical Relaxation & Dolphin Marine Tour',
    destination: 'Zanzibar Island',
    country: 'Tanzania',
    durationDays: 6,
    durationNights: 5,
    priceUSD: 1290,
    category: 'Honeymoon',
    image: '/src/assets/images/dest_zanzibar_beach_1793010783801.jpg',
    featured: true,
    highlights: [
      'Oceanfront Private Villa with private pool in Kizimkazi',
      'Traditional wooden Dhow sailing safari to Safari Blue sandbank',
      'Stone Town UNESCO World Heritage historic walking tour & spice plantation visit',
      'Snorkeling with wild dolphins in Mnemba Atoll sanctuary',
      'Romantic candlelit seafood dinner on the beach under the stars'
    ],
    inclusions: [
      'Return flights via Ethiopian Airlines or Kenya Airways',
      'Tanzania visa on arrival assistance',
      'All-inclusive meals and tropical beverages at the resort',
      'Private chauffeured airport and tour transfers'
    ],
    exclusions: ['Yellow fever card (mandatory requirement)', 'Personal dive equipment rental'],
    departureDates: ['2026-11-18', '2026-12-10', '2026-12-24', '2027-02-10']
  }
];

export const TRANSFERS_DATA: TransferOption[] = [
  {
    id: 'tr-01',
    category: 'Executive Sedan',
    vehicleModel: 'Mercedes-Benz E-Class or Toyota Camry XLE',
    maxPassengers: 3,
    maxLuggage: 2,
    priceUSD: 65,
    meetAndGreet: true,
    freeCancellationHours: 24,
    features: ['Professional Chauffeur in suit', 'Flight tracking & 60m free wait time', 'Bottled water and phone chargers', 'Air-conditioned comfort'],
    image: '/src/assets/images/hero_travel_luxury_1793010783118.jpg'
  },
  {
    id: 'tr-02',
    category: 'Luxury SUV',
    vehicleModel: 'Toyota Land Cruiser Prado or GMC Yukon XL',
    maxPassengers: 5,
    maxLuggage: 5,
    priceUSD: 120,
    meetAndGreet: true,
    freeCancellationHours: 24,
    features: ['Armored/Security option upon request', 'Spacious cabin for families & pilgrims', 'Complimentary WiFi on board', 'Luggage porter assistance'],
    image: '/src/assets/images/hero_travel_luxury_1793010783118.jpg'
  },
  {
    id: 'tr-03',
    category: 'VIP Van',
    vehicleModel: 'Mercedes-Benz Sprinter Executive (12 Seats)',
    maxPassengers: 12,
    maxLuggage: 12,
    priceUSD: 210,
    meetAndGreet: true,
    freeCancellationHours: 48,
    features: ['Perfect for Umrah groups & corporate delegations', 'Reclining leather captain seats', 'Overhead TV screens and microphone', 'Dedicated baggage trailer'],
    image: '/src/assets/images/hero_travel_luxury_1793010783118.jpg'
  }
];

export const VISA_REQUIREMENTS: VisaRequirement[] = [
  {
    country: 'United Kingdom',
    countryCode: 'GB',
    visaType: 'Standard Visitor Visa (6 Months / 2 Years)',
    processingTimeDays: '15 - 20 Working Days',
    feeUSD: 165,
    requirements: [
      'Valid International Passport with at least 6 months validity',
      '6 Months stamped Bank Statement showing sufficient proof of funds',
      'Letter of Employment or Business CAC registration documents (for business owners)',
      'Flight and Hotel itinerary reservation (provided by Elham Travels)',
      'Tuberculosis (TB) test certificate from IOM (if staying over 6 months)'
    ],
    eligibilityNotes: 'Biometrics appointment in Victoria Island Lagos, Ikeja Lagos, or Abuja Visa Application Centre (VFS Global / TLScontact).'
  },
  {
    country: 'United Arab Emirates (Dubai)',
    countryCode: 'AE',
    visaType: '30-Day or 60-Day Tourist eVisa',
    processingTimeDays: '3 - 5 Working Days',
    feeUSD: 185,
    requirements: [
      'Clear color passport data page scan',
      'Passport photograph with white background',
      'Confirmed return flight ticket on an eligible airline',
      'Confirmed hotel reservation in UAE',
      'National Identification Number (NIN) verification'
    ],
    eligibilityNotes: 'Instant electronic visa delivered via PDF. Children under 18 travel free with parents during select holiday campaigns.'
  },
  {
    country: 'Saudi Arabia',
    countryCode: 'SA',
    visaType: 'Umrah eVisa / 1-Year Multiple Entry Tourist Visa',
    processingTimeDays: '24 - 48 Hours',
    feeUSD: 175,
    requirements: [
      'Original Passport valid for minimum 6 months',
      'Vaccination certificate (Meningitis ACWY & COVID)',
      'Confirmed Umrah package or hotel booking in Makkah/Madinah',
      'Round-trip flight booking to Jeddah (JED) or Madinah (MED)'
    ],
    eligibilityNotes: 'Allows entry through all international Saudi airports and land borders. Female pilgrims no longer require a Mahram under revised regulations.'
  },
  {
    country: 'United States',
    countryCode: 'US',
    visaType: 'B1/B2 Tourist & Business Visa (2-Year Multiple)',
    processingTimeDays: 'Appointment wait times vary; expedited slots available',
    feeUSD: 185,
    requirements: [
      'DS-160 Confirmation barcode page',
      'Valid international passport with at least 2 blank pages',
      'Proof of ties to home country (property, family, employment)',
      'Detailed travel itinerary and financial statements'
    ],
    eligibilityNotes: 'Our visa advisory team guides you through flawless DS-160 form preparation and interview simulation.'
  },
  {
    country: 'Schengen (Europe - France, Germany, Italy, Spain)',
    countryCode: 'EU',
    visaType: 'Uniform Short-Stay Visa (Type C, up to 90 Days)',
    processingTimeDays: '15 - 25 Calendar Days',
    feeUSD: 130,
    requirements: [
      'Passport valid for at least 3 months after departure from Schengen zone',
      'Schengen-compliant travel medical insurance with €30,000 minimum coverage',
      'Proof of accommodation and flight reservation',
      'Personal cover letter explaining trip purpose and itinerary',
      'Last 3 to 6 months bank statement'
    ],
    eligibilityNotes: 'Must apply to the consulate of the country where you will spend the maximum number of days.'
  }
];

export const INITIAL_USER: UserProfile = {
  id: 'usr-elham-001',
  fullName: 'Alhaji Babatunde Alabi',
  email: 'babatunde.alabi@example.com',
  phone: '+234 803 456 7890',
  role: 'customer',
  loyaltyMiles: 24850,
  loyaltyTier: 'Gold',
  frequentFlyerNo: 'ET-GLD-8821',
  passportNo: 'A10984251',
  savedDestinations: ['Dubai, UAE', 'Makkah, Saudi Arabia', 'London, UK']
};

export const INITIAL_BOOKINGS: BookingRecord[] = [
  {
    id: 'bk-901',
    referenceNumber: 'ET-894210',
    userId: 'usr-elham-001',
    type: 'flight',
    title: 'Lagos (LOS) to Dubai (DXB) Round-Trip',
    detailsSummary: 'Emirates EK 784 · 2 Passengers · Economy Class',
    bookingDate: '2026-10-18',
    travelDate: '2026-11-20',
    returnDate: '2026-11-28',
    currency: 'USD',
    totalAmountUSD: 2240,
    paidAmountConverted: 3326400,
    serviceFeeUSD: 40,
    paymentMethod: 'paystack_card',
    paymentReference: 'PSTK_TRX_928174829',
    status: 'TICKETED',
    supplierConfirmationId: 'EK-PNR-7HG82M',
    eTicketNumber: '176-8920194821',
    passenger: {
      title: 'Alhaji',
      firstName: 'Babatunde',
      lastName: 'Alabi',
      email: 'babatunde.alabi@example.com',
      phone: '+234 803 456 7890',
      dob: '1982-04-15',
      passportNumber: 'A10984251',
      passportExpiry: '2030-08-20',
      nationality: 'Nigerian',
      mealPreference: 'Moslem / Halal Meal (MOML)'
    }
  },
  {
    id: 'bk-902',
    referenceNumber: 'ET-672109',
    userId: 'usr-elham-001',
    type: 'hotel',
    title: 'Makkah Clock Royal Tower, A Fairmont Hotel',
    detailsSummary: 'Deluxe Kaaba View Room · 4 Nights · Breakfast Included',
    bookingDate: '2026-10-22',
    travelDate: '2026-12-05',
    returnDate: '2026-12-09',
    currency: 'USD',
    totalAmountUSD: 1360,
    paidAmountConverted: 2019600,
    serviceFeeUSD: 25,
    paymentMethod: 'flutterwave_transfer',
    paymentReference: 'FLW_TRX_558291032',
    status: 'CONFIRMED',
    supplierConfirmationId: 'FMT-MKH-449102',
    notes: 'High floor Kaaba front facing requested',
    passenger: {
      title: 'Alhaji',
      firstName: 'Babatunde',
      lastName: 'Alabi',
      email: 'babatunde.alabi@example.com',
      phone: '+234 803 456 7890',
      dob: '1982-04-15',
      passportNumber: 'A10984251',
      passportExpiry: '2030-08-20',
      nationality: 'Nigerian'
    }
  }
];
