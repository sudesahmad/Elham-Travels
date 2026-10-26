import React, { useState } from 'react';
import { FlightOffer, CurrencyCode } from '../types/travel';
import { formatPrice, formatDuration } from '../utils/formatters';
import { 
  Plane, 
  Clock, 
  Luggage, 
  CheckCircle, 
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface FlightResultsProps {
  flights: FlightOffer[];
  currentCurrency: CurrencyCode;
  onSelectFlight: (flight: FlightOffer) => void;
  searchSummary?: {
    origin: string;
    destination: string;
    passengers: number;
    cabinClass: string;
  };
}

export const FlightResults: React.FC<FlightResultsProps> = ({
  flights,
  currentCurrency,
  onSelectFlight,
  searchSummary
}) => {
  const [selectedAirlineFilter, setSelectedAirlineFilter] = useState<string>('all');
  const [stopsFilter, setStopsFilter] = useState<'all' | 'nonstop' | 'stops'>('all');
  const [expandedFlightId, setExpandedFlightId] = useState<string | null>(null);

  const airlinesList = Array.from(new Set(flights.map((f) => f.airline)));

  const filteredFlights = flights.filter((flight) => {
    if (selectedAirlineFilter !== 'all' && flight.airline !== selectedAirlineFilter) {
      return false;
    }
    if (stopsFilter === 'nonstop' && flight.outbound.stops > 0) {
      return false;
    }
    if (stopsFilter === 'stops' && flight.outbound.stops === 0) {
      return false;
    }
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedFlightId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title & Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Verified Inventory</span>
            <span>·</span>
            <span>GDS & Direct NDC</span>
            {searchSummary && (
              <>
                <span>·</span>
                <span className="font-semibold text-slate-700">
                  {searchSummary.origin} ⇄ {searchSummary.destination} ({searchSummary.passengers} Pax · {searchSummary.cabinClass})
                </span>
              </>
            )}
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            Available Flight Schedules & Fares
          </h2>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-white border border-slate-200 rounded-lg p-1.5 shadow-sm">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium mr-1">Airline:</span>
            <select
              value={selectedAirlineFilter}
              onChange={(e) => setSelectedAirlineFilter(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer text-slate-800 font-semibold"
            >
              <option value="all">All Airlines</option>
              {airlinesList.map((airline) => (
                <option key={airline} value={airline}>{airline}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
            <button
              onClick={() => setStopsFilter('all')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                stopsFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Stops
            </button>
            <button
              onClick={() => setStopsFilter('nonstop')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                stopsFilter === 'nonstop' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Direct Non-stop
            </button>
          </div>
        </div>
      </div>

      {/* Flight Cards List */}
      <div className="space-y-4">
        {filteredFlights.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200 text-slate-500">
            <Plane className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No flights match the current filter criteria</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting the airline or stops filter to view all available flights.</p>
            <button
              onClick={() => { setSelectedAirlineFilter('all'); setStopsFilter('all'); }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredFlights.map((flight) => {
            const isExpanded = expandedFlightId === flight.id;
            const outbound = flight.outbound;

            return (
              <div
                key={flight.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-amber-400 transition-all shadow-sm hover:shadow-md overflow-hidden"
              >
                <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Airline & Flight Identity */}
                  <div className="flex items-center gap-3.5 min-w-[200px]">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl shadow-inner">
                      {flight.airlineLogo}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 leading-tight">
                        {flight.airline}
                      </h4>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span>{outbound.flightNumber}</span>
                        <span>·</span>
                        <span>{outbound.aircraft}</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium inline-block mt-1">
                        Verified via {flight.sourceProvider}
                      </span>
                    </div>
                  </div>

                  {/* Flight Timeline */}
                  <div className="flex-1 max-w-xl flex items-center justify-between gap-4">
                    {/* Departure */}
                    <div className="text-left">
                      <span className="text-xl font-extrabold text-slate-900 tabular-nums">
                        {outbound.departureTime}
                      </span>
                      <span className="block text-xs font-bold text-slate-700 mt-0.5">
                        {outbound.origin.code}
                      </span>
                      <span className="text-[11px] text-slate-500 truncate block max-w-[130px]">
                        {outbound.origin.city}
                      </span>
                    </div>

                    {/* Flight Duration Bar */}
                    <div className="flex-1 flex flex-col items-center px-2">
                      <span className="text-xs text-slate-500 tabular-nums flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {formatDuration(outbound.durationMinutes)}
                      </span>
                      <div className="w-full flex items-center gap-1 my-1.5">
                        <div className="h-[2px] flex-1 bg-slate-200" />
                        <Plane className="w-3.5 h-3.5 text-amber-500 rotate-90 shrink-0" />
                        <div className="h-[2px] flex-1 bg-slate-200" />
                      </div>
                      <span className="text-[11px] font-medium text-slate-600">
                        {outbound.stops === 0 ? (
                          <span className="text-emerald-700">Direct Non-stop</span>
                        ) : (
                          <span className="text-amber-700">{outbound.stops} stop ({outbound.stopoverAirports?.join(', ')})</span>
                        )}
                      </span>
                    </div>

                    {/* Arrival */}
                    <div className="text-right">
                      <span className="text-xl font-extrabold text-slate-900 tabular-nums">
                        {outbound.arrivalTime}
                      </span>
                      <span className="block text-xs font-bold text-slate-700 mt-0.5">
                        {outbound.destination.code}
                      </span>
                      <span className="text-[11px] text-slate-500 truncate block max-w-[130px]">
                        {outbound.destination.city}
                      </span>
                    </div>
                  </div>

                  {/* Baggage & Inclusions */}
                  <div className="hidden xl:flex flex-col justify-center text-xs text-slate-600 border-l border-slate-100 pl-4 min-w-[160px]">
                    <div className="flex items-center gap-1.5 font-medium text-slate-800">
                      <Luggage className="w-3.5 h-3.5 text-slate-500" />
                      <span>{outbound.baggageAllowance}</span>
                    </div>
                    <span className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>{flight.refundable ? 'Refundable fare' : 'Standard non-refundable'}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      {flight.seatsLeft} seats remaining at this rate
                    </span>
                  </div>

                  {/* Pricing and Action */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 border-slate-100 pt-3 lg:pt-0 min-w-[180px]">
                    <div className="text-left lg:text-right">
                      <span className="text-xs text-slate-400 block">Total per passenger</span>
                      <span className="text-2xl font-black text-slate-900 tabular-nums">
                        {formatPrice(flight.priceUSD, currentCurrency)}
                      </span>
                      <span className="text-[10px] text-slate-500 block">Taxes & airport fees included</span>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => toggleExpand(flight.id)}
                        className="p-2 text-slate-500 hover:text-slate-800 transition-colors"
                        title="Flight details"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => onSelectFlight(flight)}
                        className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-lg transition-all shadow-sm hover:shadow flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <span>Select Flight</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Collapsible Details Drawer */}
                {isExpanded && (
                  <div className="bg-slate-50 border-t border-slate-200 p-5 text-xs text-slate-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                          <Plane className="w-3.5 h-3.5 text-amber-600" />
                          <span>Flight Segment Breakdown</span>
                        </h5>
                        <div className="space-y-2 bg-white p-3.5 rounded-lg border border-slate-200">
                          <p><strong className="text-slate-900">Departure:</strong> {outbound.origin.airport} ({outbound.origin.code}) at {outbound.departureTime}</p>
                          <p><strong className="text-slate-900">Arrival:</strong> {outbound.destination.airport} ({outbound.destination.code}) at {outbound.arrivalTime}</p>
                          <p><strong className="text-slate-900">Aircraft:</strong> {outbound.aircraft} · Operated by {flight.airline}</p>
                          {outbound.stopoverAirports && outbound.stopoverAirports.length > 0 && (
                            <p className="text-amber-800"><strong className="text-slate-900">Stopovers:</strong> {outbound.stopoverAirports.join(', ')}</p>
                          )}
                          {flight.inbound && (
                            <div className="pt-2 border-t border-slate-100">
                              <span className="font-semibold text-slate-800 block mb-1">Return Segment ({flight.inbound.flightNumber}):</span>
                              <p>{flight.inbound.origin.city} ({flight.inbound.departureTime}) → {flight.inbound.destination.city} ({flight.inbound.arrivalTime})</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Fare Rules & Baggage Allowance</span>
                        </h5>
                        <ul className="space-y-1.5 bg-white p-3.5 rounded-lg border border-slate-200">
                          {flight.fareConditions.map((condition, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{condition}</span>
                            </li>
                          ))}
                          <li className="flex items-start gap-1.5 pt-1 text-[11px] text-slate-500">
                            <span>* NCAA Passenger Bill of Rights and airline carriage contract apply to all issued e-tickets.</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
