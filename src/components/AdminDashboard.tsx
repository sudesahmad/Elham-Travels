import React, { useState, useEffect } from 'react';
import { BookingRecord, CurrencyCode, HolidayPackage } from '../types/travel';
import { formatPrice } from '../utils/formatters';
import { 
  ShieldCheck, 
  BarChart3, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Plus, 
  Package, 
  FileCheck2, 
  Settings, 
  Activity, 
  X, 
  Check, 
  TrendingUp, 
  CreditCard,
  Search
} from 'lucide-react';

interface AdminDashboardProps {
  bookings: BookingRecord[];
  packages: HolidayPackage[];
  currentCurrency: CurrencyCode;
  onClose: () => void;
  onApproveRefund: (bookingId: string) => void;
  onAddNewPackage: (pkg: HolidayPackage) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  bookings,
  packages,
  currentCurrency,
  onClose,
  onApproveRefund,
  onAddNewPackage,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'packages' | 'visas' | 'providers' | 'settings'>('overview');
  const [adminMetrics, setAdminMetrics] = useState<any>(null);
  const [providerStatuses, setProviderStatuses] = useState<any[]>([]);
  const [visaApplications, setVisaApplications] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // New Package Form State
  const [showNewPkgModal, setShowNewPkgModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newDestination, setNewDestination] = useState('');
  const [newPriceUSD, setNewPriceUSD] = useState(1200);
  const [newDays, setNewDays] = useState(7);
  const [newCategory, setNewCategory] = useState<'Umrah' | 'Luxury' | 'Family' | 'Safari' | 'Honeymoon'>('Luxury');
  const [newHighlights, setNewHighlights] = useState('5-Star Hotel Accommodations\nAirport VIP Transfers\nDaily Breakfast\nCity Tour Guide');

  useEffect(() => {
    fetch('/api/admin/metrics')
      .then((res) => res.json())
      .then((data) => setAdminMetrics(data))
      .catch((err) => console.error('Failed to load metrics:', err));

    fetch('/api/inventory/status')
      .then((res) => res.json())
      .then((data) => setProviderStatuses(data.providers || []))
      .catch((err) => console.error('Failed to load providers:', err));

    fetch('/api/visa-applications')
      .then((res) => res.json())
      .then((data) => setVisaApplications(data.applications || []))
      .catch((err) => console.error('Failed to load visas:', err));
  }, [bookings.length]);

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    const pkg: HolidayPackage = {
      id: `pkg-${Date.now()}`,
      title: newTitle,
      subtitle: newSubtitle,
      destination: newDestination,
      country: newDestination.split(',')[1]?.trim() || 'International',
      durationDays: newDays,
      durationNights: newDays - 1,
      priceUSD: newPriceUSD,
      category: newCategory,
      image: newCategory === 'Umrah' ? '/src/assets/images/dest_mecca_madinah_1793010787032.jpg' : '/src/assets/images/dest_dubai_skyline_1793010783631.jpg',
      highlights: newHighlights.split('\n').filter(Boolean),
      inclusions: ['Flight tickets', '5★ Hotel', 'Breakfast', 'Transfers'],
      exclusions: ['Personal shopping', 'Tips'],
      departureDates: ['2026-12-01', '2026-12-15', '2027-01-10'],
    };

    onAddNewPackage(pkg);
    setShowNewPkgModal(false);
    setNewTitle('');
    setNewSubtitle('');
  };

  const filteredBookings = bookings.filter((b) => 
    b.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.passenger.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.passenger.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 text-white rounded-2xl max-w-6xl w-full shadow-2xl border border-slate-800 overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Admin Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-slate-950 font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">ELHAM TRAVELS MANAGEMENT CONSOLE</h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-mono font-bold">
                  LEVEL 4 AUTHORIZED
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Elham International Limited · RC 7412148 · Operational Control Center
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-900 border-b border-slate-800 px-6 py-2 flex items-center gap-2 text-xs font-semibold shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'overview' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Executive KPIs
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'bookings' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('packages')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'packages' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Package Management ({packages.length})
          </button>
          <button
            onClick={() => setActiveTab('visas')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'visas' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Visa Inquiries ({visaApplications.length})
          </button>
          <button
            onClick={() => setActiveTab('providers')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'providers' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Provider Live Status
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-950/50">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* KPI Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span>Gross Sales Volume</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-2xl font-black text-white tabular-nums block">
                    {adminMetrics ? formatPrice(adminMetrics.totalRevenueUSD, currentCurrency) : '₦8.4M'}
                  </span>
                  <span className="text-[10px] text-emerald-400 mt-1 block">+18.4% vs previous 30 days</span>
                </div>

                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span>Issued Tickets</span>
                    <CheckCircle className="w-4 h-4 text-amber-400" />
                  </div>
                  <span className="text-2xl font-black text-white tabular-nums block">
                    {bookings.filter((b) => b.status === 'TICKETED' || b.status === 'CONFIRMED').length}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 block">Real-time GDS ticketed orders</span>
                </div>

                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span>Pending Refund Requests</span>
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                  </div>
                  <span className="text-2xl font-black text-amber-400 tabular-nums block">
                    {bookings.filter((b) => b.status === 'REFUND_REQUESTED').length}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 block">Awaiting payment reverse approval</span>
                </div>

                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span>Visa Advisory Cases</span>
                    <FileCheck2 className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="text-2xl font-black text-white tabular-nums block">
                    {visaApplications.length}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 block">UK, US, UAE & Saudi cases</span>
                </div>
              </div>

              {/* Commission and Service Rates */}
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                <h4 className="text-sm font-bold text-white mb-3">
                  Service Commission & Surcharge Config
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Flight GDS Markup</span>
                    <strong className="text-amber-400 text-sm">3.5% on Base Fare</strong>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Hotel Commission</span>
                    <strong className="text-amber-400 text-sm">10.0% Wholesale Split</strong>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Visa Filing Fee</span>
                    <strong className="text-amber-400 text-sm">$50 Fixed Advisory</strong>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Nigeria VAT</span>
                    <strong className="text-amber-400 text-sm">7.5% Statutory</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BOOKINGS TABLE */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Ref, Passenger, Route..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <span className="text-xs text-slate-400">Showing {filteredBookings.length} records</span>
              </div>

              <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-3">Reference / PNR</th>
                      <th className="p-3">Passenger</th>
                      <th className="p-3">Itinerary</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 font-mono font-bold text-amber-400">
                          {b.referenceNumber}
                          <span className="block text-[10px] text-slate-500">{b.supplierConfirmationId}</span>
                        </td>
                        <td className="p-3">
                          <strong className="text-white">{b.passenger.firstName} {b.passenger.lastName}</strong>
                          <span className="block text-[10px] text-slate-400">{b.passenger.phone}</span>
                        </td>
                        <td className="p-3">
                          <span className="font-semibold text-white truncate max-w-xs block">{b.title}</span>
                          <span className="text-[10px] text-slate-400 block">{b.travelDate}</span>
                        </td>
                        <td className="p-3 font-bold tabular-nums text-white">
                          {formatPrice(b.totalAmountUSD, currentCurrency)}
                        </td>
                        <td className="p-3 text-[10px]">
                          <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                            {b.paymentMethod.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            b.status === 'TICKETED' || b.status === 'CONFIRMED'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : b.status === 'REFUND_REQUESTED'
                              ? 'bg-amber-950 text-amber-400 border border-amber-800'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {b.status === 'REFUND_REQUESTED' && (
                            <button
                              onClick={() => onApproveRefund(b.id)}
                              className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded text-[10px] cursor-pointer"
                            >
                              Approve Refund
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PACKAGES */}
          {activeTab === 'packages' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Live Holiday & Umrah Packages</h4>
                  <p className="text-xs text-slate-400">Create and publish packages even before GDS suppliers are connected.</p>
                </div>
                <button
                  onClick={() => setShowNewPkgModal(true)}
                  className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Travel Package</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {packages.map((pkg) => (
                  <div key={pkg.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">
                        {pkg.category} · {pkg.durationDays} Days
                      </span>
                      <strong className="text-amber-400 tabular-nums text-sm font-black">
                        {formatPrice(pkg.priceUSD, currentCurrency)}
                      </strong>
                    </div>
                    <h5 className="font-bold text-sm text-white">{pkg.title}</h5>
                    <p className="text-xs text-slate-400 line-clamp-2">{pkg.subtitle}</p>
                    <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800 flex justify-between">
                      <span>Destination: {pkg.destination}</span>
                      <span className="text-emerald-400">Published</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: VISA INQUIRIES */}
          {activeTab === 'visas' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white">Submitted Visa Pre-Screening Applications</h4>
              <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase border-b border-slate-800">
                    <tr>
                      <th className="p-3">Applicant Name</th>
                      <th className="p-3">Target Country</th>
                      <th className="p-3">Passport No</th>
                      <th className="p-3">Contact</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {visaApplications.map((app) => (
                      <tr key={app.id}>
                        <td className="p-3 font-bold text-white">{app.applicantName}</td>
                        <td className="p-3 font-semibold text-amber-400">{app.targetCountry}</td>
                        <td className="p-3 font-mono">{app.passportNumber}</td>
                        <td className="p-3 text-[11px] text-slate-400">{app.email} · {app.phone}</td>
                        <td className="p-3">
                          <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800 font-semibold">
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: PROVIDER STATUS */}
          {activeTab === 'providers' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white">Live Inventory & Gateway Health Monitor</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {providerStatuses.map((p, idx) => (
                  <div key={idx} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">{p.name}</span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">{p.type} · {p.note}</span>
                      <span className="text-[10px] text-slate-500 block mt-1">Latency: {p.pingMs}ms</span>
                    </div>
                    <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* MODAL: CREATE PACKAGE */}
        {showNewPkgModal && (
          <div className="fixed inset-0 z-60 bg-slate-950/80 flex items-center justify-center p-4">
            <div className="bg-slate-900 text-white rounded-xl max-w-lg w-full p-6 border border-slate-700 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h4 className="text-sm font-bold">Create New Travel Package</h4>
                <button onClick={() => setShowNewPkgModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>

              <form onSubmit={handleCreatePackage} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Package Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Kenya Masai Mara Safari Special"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Subtitle / Summary</label>
                  <input
                    type="text"
                    required
                    value={newSubtitle}
                    onChange={(e) => setNewSubtitle(e.target.value)}
                    placeholder="e.g. 6-Day Wildlife Game Drives & Luxury Tented Camp"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Destination</label>
                    <input
                      type="text"
                      required
                      value={newDestination}
                      onChange={(e) => setNewDestination(e.target.value)}
                      placeholder="e.g. Nairobi & Masai Mara, Kenya"
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Price (USD)</label>
                    <input
                      type="number"
                      required
                      value={newPriceUSD}
                      onChange={(e) => setNewPriceUSD(parseInt(e.target.value, 10))}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Duration (Days)</label>
                    <input
                      type="number"
                      value={newDays}
                      onChange={(e) => setNewDays(parseInt(e.target.value, 10))}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                    >
                      <option value="Umrah">Umrah & Spiritual</option>
                      <option value="Luxury">Luxury Tour</option>
                      <option value="Safari">Safari & Adventure</option>
                      <option value="Honeymoon">Honeymoon</option>
                      <option value="Family">Family Holiday</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Key Highlights (1 per line)</label>
                  <textarea
                    rows={3}
                    value={newHighlights}
                    onChange={(e) => setNewHighlights(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewPkgModal(false)}
                    className="px-3 py-1.5 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg"
                  >
                    Publish Package
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
