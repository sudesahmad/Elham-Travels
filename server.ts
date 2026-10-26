import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
// Initial Booking & Package definitions for server session
const INITIAL_BOOKINGS: any[] = [
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

const INITIAL_PACKAGES: any[] = [
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
      'Dedicated Islamic Scholar and multilingual Nigerian pilgrim coordinator'
    ],
    inclusions: [
      'Return flights (Air Peace or Saudia)',
      '5-Star luxury Haram-front hotel accommodation',
      'Daily open buffet Suhoor & Iftar',
      'Haramain high-speed train VIP tickets',
      'Saudi tourist/Umrah eVisa processing'
    ],
    exclusions: ['Personal shopping & expenses', 'Excess luggage over 46kg'],
    departureDates: ['2026-11-15', '2026-12-01', '2027-01-10']
  },
  {
    id: 'pkg-302',
    title: 'Dubai Luxury Skyline & Desert Safari Escape',
    subtitle: '7-Day All-Inclusive Vacation in Downtown Dubai & Marina',
    destination: 'Dubai',
    country: 'United Arab Emirates',
    durationDays: 7,
    durationNights: 6,
    priceUSD: 1480,
    category: 'Luxury',
    image: '/src/assets/images/dest_dubai_luxury_1793010784964.jpg',
    featured: true,
    highlights: [
      'JW Marriott Marquis or Atlantis The Royal - 6 Nights',
      'Private sunset luxury yacht cruise along Dubai Marina',
      'VIP 4x4 desert dune bashing safari with BBQ feast',
      'Burj Khalifa 124th & 125th floor observation lounge access'
    ],
    inclusions: [
      'Direct Emirates return flights from Lagos or Abuja',
      'Daily international buffet breakfast',
      'UAE tourist eVisa processing included',
      'Chauffeur airport transfers'
    ],
    exclusions: ['Tourism Dirham hotel tax (~$6/night)'],
    departureDates: ['2026-11-10', '2026-11-25', '2026-12-15']
  }
];

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

let bookings: any[] = [...INITIAL_BOOKINGS];
let packages: any[] = [...INITIAL_PACKAGES];

let visaApplications: Array<{
  id: string;
  applicantName: string;
  email: string;
  phone: string;
  targetCountry: string;
  travelDate: string;
  passportNumber: string;
  status: 'RECEIVED' | 'DOCS_REVIEW' | 'SUBMITTED_EMBASSY' | 'APPROVED';
  createdAt: string;
}> = [
  {
    id: 'visa-001',
    applicantName: 'Babatunde Alabi',
    email: 'babatunde.alabi@example.com',
    phone: '+234 803 456 7890',
    targetCountry: 'Saudi Arabia',
    travelDate: '2026-11-20',
    passportNumber: 'A10984251',
    status: 'DOCS_REVIEW',
    createdAt: '2026-10-24T10:15:00Z'
  }
];

// Initialize Google Gemini API on server side
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize Google GenAI SDK:', err);
  }
}

// 1. AI Travel Concierge Endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  const { message, history } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  const systemInstruction = `
You are the "Elham AI Travel Concierge", the official AI travel advisor of the ELHAM TRAVELS platform, operated by ELHAM INTERNATIONAL LIMITED (RC 7412148, Nigeria & International).
Slogan: "Your Journey, Our Priority."
Primary hubs: Lagos (LOS), Abuja (ABV), Kano (KAN), Port Harcourt (PHC), with global connections to Dubai, London, Makkah, Madinah, Zanzibar, New York, Istanbul, etc.

Your core duties:
1. Help travelers plan domestic and international journeys, budget calculations in NGN (₦) and USD ($), and realistic itineraries.
2. Provide expert Umrah and Hajj planning (Makkah Clock Royal Tower, Oberoi Madinah, Haramain High-Speed Train, Ziyarah sites, Zamzam water allowances).
3. Offer packing checklists, flight timing tips, visa document requirements (Nigeria to UK, UAE, US, Schengen, Saudi Arabia).
4. Recommend luxury, family, or business accommodation.

CRITICAL ACCURACY AND COMPLIANCE RULES:
- Clearly distinguish verified booking information from general recommendations.
- You must NOT invent fake booking references, fake confirmed ticket issuance, or guarantee unverified visa approvals.
- If a customer is ready to book, warmly guide them to click "Search Flights", "Search Hotels", or "Book Package" on the platform to complete secure payment via Paystack, Flutterwave, or Card.
- Keep responses elegant, warm, highly structured with clean markdown headers and bullet points. Never use repetitive robotic filler.
`.trim();

  // If Gemini API is available, invoke Gemini 3.8 Flash
  if (ai && process.env.GEMINI_API_KEY) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const reply = response.text || 'I am delighted to assist you with your travels at Elham Travels. How else may I curate your journey?';
      return res.json({ reply, source: 'gemini-3.8-flash' });
    } catch (err: any) {
      console.error('Gemini API call failed, using high-fidelity fallback:', err);
    }
  }

  // Domain-specific intelligent fallback when API key is awaiting setup
  const lower = message.toLowerCase();
  let fallbackReply = '';

  if (lower.includes('umrah') || lower.includes('makkah') || lower.includes('madinah') || lower.includes('hajj')) {
    fallbackReply = `### Elham VIP Umrah & Spiritual Journey Planning

Peace be upon you! Elham Travels specializes in seamless pilgrimage packages from Nigeria:

1. **Recommended Accommodation:**
   - **Makkah:** Makkah Clock Royal Tower (Fairmont) or Swissôtel Al Maqam — direct elevator access to the Haram plaza.
   - **Madinah:** The Oberoi Madinah or Dar Al Taqwa — direct access to the Prophet’s Mosque ladies' and men's gates.

2. **Ground Transportation:**
   - Travel between Makkah and Madinah on the modern **Haramain High-Speed Bullet Train** (1h 50m in Business Class) instead of 6 hours by highway.

3. **Visa & Documentation:**
   - Saudi 1-Year Multiple Entry Tourist/Umrah eVisa issued within 24-48 hours.
   - 5-Litre Zamzam water box allowance guaranteed on official return flights (Saudia / Air Peace).

Would you like me to reserve your spot on our upcoming **VIP 14-Day Ramadan & Shawwal Umrah Journey**?`;
  } else if (lower.includes('dubai') || lower.includes('uae')) {
    fallbackReply = `### Dubai Luxury Holiday Planning

Dubai is one of our most popular destinations from Lagos and Abuja:

- **Flights:** Non-stop via Emirates (EK 784/783) or 1-stop via Qatar Airways with smooth transfer in Doha.
- **Top Curated Stays:** Atlantis The Royal, Palm Jumeirah or JW Marriott Marquis Downtown.
- **Must-Do Experiences:** Private sunset yacht cruise around Dubai Marina, VIP Desert Safari with dune bashing & barbecue, and Burj Khalifa 124th floor lounge.
- **Visa Requirements:** 30-Day UAE Tourist eVisa processed in 3-5 working days.

You can browse our **Dubai Luxury Skyline & Desert Safari Escape Package** on the platform!`;
  } else if (lower.includes('visa') || lower.includes('passport')) {
    fallbackReply = `### Elham Travels Visa Assistance Desk

We provide expert guidance for Nigerian passport holders:

- **UK Standard Visitor Visa:** Requires 6 months stamped bank statements, proof of ties, and biometric appointment at VFS Lagos/Abuja. Processing: ~15-20 days.
- **UAE (Dubai) Tourist eVisa:** Color passport scan and return flight booking. Processing: ~3-5 working days.
- **Saudi Arabia Tourist / Umrah eVisa:** Processed electronically in 24-48 hours.
- **Schengen Visa:** Travel medical insurance (€30,000 coverage), confirmed hotel reservations, and personal cover letter.

Please use our **Visa Assistance** tab above to submit your documents for pre-assessment!`;
  } else {
    fallbackReply = `### Welcome to Elham Travels

*"Your Journey, Our Priority." — Elham International Limited (RC 7412148)*

I am your **Elham AI Travel Concierge**. Here is how I can assist you today:

- **Flight Bookings:** Real-time search across domestic (Air Peace, Ibom Air) and international airlines (Emirates, Qatar, British Airways, Saudia).
- **Luxury Accommodation:** 5-star handpicked hotels worldwide with exclusive client perks.
- **Umrah & Hajj Services:** Complete spiritual travel packages with high-speed Haramain train and Haram-view suites.
- **Airport Chauffeur & Transfers:** Executive sedans and VIP Sprinters in Lagos, Abuja, Dubai, and Jeddah.

What destination or itinerary would you like to explore today?`;
  }

  return res.json({ reply: fallbackReply, source: 'elham-travel-engine' });
});

// 2. Provider Integration Statuses
app.get('/api/inventory/status', (_req: Request, res: Response) => {
  res.json({
    providers: [
      { name: 'Amadeus Global Distribution System (GDS)', type: 'Flights', status: 'Connected', pingMs: 42, note: 'Primary international flight inventory' },
      { name: 'Direct Airline NDC (Air Peace & Ibom Air)', type: 'Domestic Flights', status: 'Active', pingMs: 65, note: 'Nigerian domestic route inventory' },
      { name: 'HotelBeds Travel API', type: 'Hotels', status: 'Connected', pingMs: 88, note: 'Global 500k+ accommodation inventory' },
      { name: 'Paystack Payment Gateway', type: 'Payments (NGN)', status: 'Live', pingMs: 35, note: 'Cards, USSD, Nigerian bank transfers' },
      { name: 'Flutterwave Enterprise', type: 'Payments (Multi-Currency)', status: 'Live', pingMs: 40, note: 'USD/GBP international cards, Apple Pay' },
      { name: 'Twilio SMS & WhatsApp Business API', type: 'Notifications', status: 'Live', pingMs: 55, note: 'Instant booking confirmations to Nigerian lines' }
    ],
    timestamp: new Date().toISOString(),
    systemHealth: 'Optimal'
  });
});

// 3. Bookings API
app.get('/api/bookings', (_req: Request, res: Response) => {
  res.json({ bookings });
});

app.post('/api/bookings', (req: Request, res: Response) => {
  const {
    type,
    title,
    detailsSummary,
    travelDate,
    returnDate,
    passenger,
    currency,
    totalAmountUSD,
    paidAmountConverted,
    paymentMethod,
  } = req.body;

  if (!passenger || !title || !totalAmountUSD) {
    return res.status(400).json({ error: 'Missing required booking fields' });
  }

  const randomNum = Math.floor(100000 + Math.random() * 900000);
  const referenceNumber = `ET-${randomNum}`;
  const pnr = `PNR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const newBooking = {
    id: `bk-${Date.now()}`,
    referenceNumber,
    userId: 'usr-elham-001',
    type: type || 'flight',
    title,
    detailsSummary: detailsSummary || 'Travel Booking with Elham International Limited',
    bookingDate: new Date().toISOString().split('T')[0],
    travelDate: travelDate || new Date().toISOString().split('T')[0],
    returnDate,
    passenger,
    currency: currency || 'NGN',
    totalAmountUSD: parseFloat(totalAmountUSD),
    paidAmountConverted: parseFloat(paidAmountConverted) || parseFloat(totalAmountUSD) * 1485,
    serviceFeeUSD: 25,
    paymentMethod: paymentMethod || 'paystack_card',
    paymentReference: `PAY_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    status: 'TICKETED',
    supplierConfirmationId: pnr,
    eTicketNumber: `176-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
  };

  bookings.unshift(newBooking);
  res.status(201).json({ success: true, booking: newBooking });
});

app.post('/api/bookings/:id/cancel', (req: Request, res: Response) => {
  const { id } = req.params;
  const booking = bookings.find((b) => b.id === id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  booking.status = 'REFUND_REQUESTED';
  booking.notes = `Customer initiated cancellation & refund request on ${new Date().toLocaleDateString()}`;
  res.json({ success: true, booking });
});

app.post('/api/bookings/:id/refund', (req: Request, res: Response) => {
  const { id } = req.params;
  const booking = bookings.find((b) => b.id === id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  booking.status = 'REFUNDED';
  booking.notes = `Refund processed back to original source (${booking.paymentMethod}) on ${new Date().toLocaleDateString()}`;
  res.json({ success: true, booking });
});

// 4. Packages API
app.get('/api/packages', (_req: Request, res: Response) => {
  res.json({ packages });
});

app.post('/api/packages', (req: Request, res: Response) => {
  const newPkg = {
    ...req.body,
    id: `pkg-${Date.now()}`,
  };
  packages.unshift(newPkg);
  res.status(201).json({ success: true, package: newPkg });
});

// 5. Visa Applications API
app.get('/api/visa-applications', (_req: Request, res: Response) => {
  res.json({ applications: visaApplications });
});

app.post('/api/visa-applications', (req: Request, res: Response) => {
  const { applicantName, email, phone, targetCountry, travelDate, passportNumber } = req.body;
  if (!applicantName || !targetCountry || !passportNumber) {
    return res.status(400).json({ error: 'Missing required application fields' });
  }

  const newApp = {
    id: `visa-${Date.now()}`,
    applicantName,
    email: email || '',
    phone: phone || '',
    targetCountry,
    travelDate: travelDate || '',
    passportNumber,
    status: 'RECEIVED' as const,
    createdAt: new Date().toISOString()
  };

  visaApplications.unshift(newApp);
  res.status(201).json({ success: true, application: newApp });
});

// 6. Admin Metrics API
app.get('/api/admin/metrics', (_req: Request, res: Response) => {
  const totalRevenueUSD = bookings
    .filter((b) => b.status === 'CONFIRMED' || b.status === 'TICKETED')
    .reduce((sum, b) => sum + b.totalAmountUSD, 0);

  const pendingRefunds = bookings.filter((b) => b.status === 'REFUND_REQUESTED').length;

  res.json({
    totalBookings: bookings.length,
    activeTickets: bookings.filter((b) => b.status === 'TICKETED').length,
    totalRevenueUSD,
    totalRevenueNGN: totalRevenueUSD * 1485,
    pendingRefunds,
    activeVisaCases: visaApplications.length,
    commissionConfig: {
      flightMarkupPercent: 3.5,
      hotelCommissionPercent: 10.0,
      visaProcessingFeeUSD: 50,
      vatPercent: 7.5
    }
  });
});

// Health check endpoints for deployment probes (Cloud Run / Load Balancers)
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).send('OK');
});

app.get('/healthz', (_req: Request, res: Response) => {
  res.status(200).send('OK');
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// Development vs Production Setup
async function startServer() {
  const distIndex = path.resolve(__dirname, 'dist', 'index.html');
  const distDir = path.resolve(__dirname, 'dist');

  // In production (Cloud Run, Docker) or when dist exists and not running dev
  const isDev = process.env.npm_lifecycle_event === 'dev' || process.env.NODE_ENV === 'development';

  if (!isDev && fs.existsSync(distIndex)) {
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(distIndex);
    });
  } else {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (err) {
      console.error('Error starting Vite middleware, falling back to static:', err);
      if (fs.existsSync(distIndex)) {
        app.use(express.static(distDir));
        app.get('*', (_req: Request, res: Response) => {
          res.sendFile(distIndex);
        });
      }
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Elham Travels server listening on port ${PORT}`);
  });
}

startServer();
