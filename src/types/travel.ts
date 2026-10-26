export type CurrencyCode = 'NGN' | 'USD' | 'GBP' | 'EUR' | 'SAR';

export interface CurrencyRate {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateToUSD: number; // 1 USD = X Currency
}

export type TravelTab = 
  | 'flights' 
  | 'hotels' 
  | 'transfers' 
  | 'cars' 
  | 'packages' 
  | 'visa' 
  | 'umrah' 
  | 'corporate' 
  | 'assistant'
  | 'partners';

export type FlightTripType = 'one-way' | 'round-trip' | 'multi-city';
export type CabinClass = 'economy' | 'premium_economy' | 'business' | 'first';

export interface FlightSegment {
  airline: string;
  airlineCode: string;
  airlineLogo: string;
  flightNumber: string;
  aircraft: string;
  origin: {
    code: string;
    city: string;
    airport: string;
  };
  destination: {
    code: string;
    city: string;
    airport: string;
  };
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  stops: number;
  stopoverAirports?: string[];
  baggageAllowance: string;
  cabinClass: CabinClass;
}

export interface FlightOffer {
  id: string;
  airline: string;
  airlineCode: string;
  airlineLogo: string;
  tripType: FlightTripType;
  outbound: FlightSegment;
  inbound?: FlightSegment;
  priceUSD: number;
  refundable: boolean;
  seatsLeft: number;
  fareConditions: string[];
  sourceProvider: 'Amadeus' | 'Sabre' | 'Direct Airline NDC';
}

export interface HotelOffer {
  id: string;
  name: string;
  city: string;
  country: string;
  address: string;
  rating: number; // 1 - 5
  reviewsCount: number;
  pricePerNightUSD: number;
  image: string;
  roomTypes: {
    name: string;
    capacity: number;
    bedType: string;
    priceUSD: number;
    amenities: string[];
    breakfastIncluded: boolean;
    cancellationPolicy: string;
  }[];
  amenities: string[];
  proximityToHaram?: string; // e.g. "50m from Masjid Al-Haram" for Makkah
  sourceProvider: 'HotelBeds' | 'Direct Contract' | 'Expedia Partner';
}

export interface TransferOption {
  id: string;
  category: 'Executive Sedan' | 'Luxury SUV' | 'VIP Van' | 'Airport Shuttle';
  vehicleModel: string;
  maxPassengers: number;
  maxLuggage: number;
  priceUSD: number;
  meetAndGreet: boolean;
  freeCancellationHours: number;
  features: string[];
  image: string;
}

export interface HolidayPackage {
  id: string;
  title: string;
  subtitle: string;
  destination: string;
  country: string;
  durationDays: number;
  durationNights: number;
  priceUSD: number;
  category: 'Umrah' | 'Luxury' | 'Family' | 'Safari' | 'Honeymoon';
  image: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  departureDates: string[];
  featured?: boolean;
}

export interface PassengerDetails {
  title: 'Mr' | 'Mrs' | 'Ms' | 'Dr' | 'Alhaji' | 'Hajiya';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  passportNumber: string;
  passportExpiry: string;
  nationality: string;
  mealPreference?: string;
  wheelchairNeeded?: boolean;
}

export interface BookingRecord {
  id: string;
  referenceNumber: string; // e.g., ET-782910
  userId: string;
  type: 'flight' | 'hotel' | 'transfer' | 'package' | 'visa';
  title: string;
  detailsSummary: string;
  bookingDate: string;
  travelDate: string;
  returnDate?: string;
  passenger: PassengerDetails;
  currency: CurrencyCode;
  totalAmountUSD: number;
  paidAmountConverted: number;
  serviceFeeUSD: number;
  paymentMethod: 'paystack_card' | 'flutterwave_transfer' | 'usd_card' | 'corporate_account';
  paymentReference: string;
  status: 'CONFIRMED' | 'TICKETED' | 'PENDING' | 'CANCELLED' | 'REFUND_REQUESTED' | 'REFUNDED';
  supplierConfirmationId: string;
  eTicketNumber?: string;
  notes?: string;
}

export interface VisaRequirement {
  country: string;
  countryCode: string;
  visaType: string;
  processingTimeDays: string;
  feeUSD: number;
  requirements: string[];
  eligibilityNotes: string;
}

export interface VisaApplication {
  id: string;
  applicantName: string;
  email: string;
  phone: string;
  targetCountry: string;
  travelDate: string;
  passportNumber: string;
  status: 'RECEIVED' | 'DOCS_REVIEW' | 'SUBMITTED_EMBASSY' | 'APPROVED' | 'REQUIRES_INFO';
  createdAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: 'customer' | 'admin' | 'corporate_agent';
  frequentFlyerNo?: string;
  loyaltyMiles: number;
  loyaltyTier: 'Silver' | 'Gold' | 'Platinum';
  passportNo?: string;
  savedDestinations: string[];
}
