import React, { useState } from 'react';
import { CurrencyCode, PassengerDetails, BookingRecord } from '../types/travel';
import { formatPrice } from '../utils/formatters';
import { 
  CreditCard, 
  Building, 
  Lock, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  Copy, 
  Printer, 
  X, 
  ArrowRight,
  RefreshCw,
  QrCode
} from 'lucide-react';

interface PaymentModalProps {
  itemType: 'flight' | 'hotel' | 'transfer' | 'package';
  itemTitle: string;
  itemDetails: string;
  totalUSD: number;
  currentCurrency: CurrencyCode;
  passenger: PassengerDetails;
  travelDate: string;
  returnDate?: string;
  onClose: () => void;
  onBookingConfirmed: (newBooking: BookingRecord) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  itemType,
  itemTitle,
  itemDetails,
  totalUSD,
  currentCurrency,
  passenger,
  travelDate,
  returnDate,
  onClose,
  onBookingConfirmed,
}) => {
  const [gateway, setGateway] = useState<'paystack' | 'flutterwave'>('paystack');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank_transfer' | 'usd_card'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'input' | 'verifying' | 'success' | 'failed'>('input');
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);

  // Card Inputs
  const [cardNumber, setCardNumber] = useState('5399 4100 8921 4402');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('812');
  const [cardPin, setCardPin] = useState('');
  const [showPinField, setShowPinField] = useState(false);

  // Virtual Bank Transfer State
  const [virtualAccountCopied, setVirtualAccountCopied] = useState(false);
  const virtualBankName = 'Wema Bank / Paystack Titan';
  const virtualAccountNumber = '0291847102';

  const convertedTotal = Math.round(totalUSD * (currentCurrency === 'NGN' ? 1485 : 1));

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(virtualAccountNumber);
    setVirtualAccountCopied(true);
    setTimeout(() => setVirtualAccountCopied(false), 2000);
  };

  const handleInitiatePayment = async () => {
    if (paymentMethod === 'card' && !showPinField) {
      setShowPinField(true);
      return;
    }

    setIsProcessing(true);
    setPaymentStep('verifying');

    // Simulate gateway handshakes & webhook verification
    setTimeout(async () => {
      try {
        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: itemType,
            title: itemTitle,
            detailsSummary: itemDetails,
            travelDate,
            returnDate,
            passenger,
            currency: currentCurrency,
            totalAmountUSD: totalUSD,
            paidAmountConverted: convertedTotal,
            paymentMethod: paymentMethod === 'card' ? 'paystack_card' : paymentMethod === 'bank_transfer' ? 'flutterwave_transfer' : 'usd_card',
          }),
        });

        const data = await response.json();
        if (data.success && data.booking) {
          setConfirmedBooking(data.booking);
          setPaymentStep('success');
          onBookingConfirmed(data.booking);
        } else {
          setPaymentStep('failed');
        }
      } catch (err) {
        console.error('Payment processing failed:', err);
        setPaymentStep('failed');
      } finally {
        setIsProcessing(false);
      }
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-400 flex items-center justify-center text-slate-950 font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Secure Travel Checkout</h3>
              <p className="text-xs text-slate-400">Encrypted PCI-DSS Level 1 Compliant Gateway</p>
            </div>
          </div>
          {paymentStep !== 'verifying' && (
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Verifying Screen */}
        {paymentStep === 'verifying' && (
          <div className="p-10 text-center space-y-4">
            <RefreshCw className="w-12 h-12 text-amber-500 animate-spin mx-auto" />
            <h4 className="text-lg font-bold text-slate-900">Contacting Payment Gateway...</h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Authorizing transaction and verifying airline reservation PNR. Please do not refresh or navigate back.
            </p>
          </div>
        )}

        {/* Failed Screen */}
        {paymentStep === 'failed' && (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Payment Authorization Incomplete</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              The card or transfer authorization was not completed. No funds have been debited for this booking reference.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setPaymentStep('input')}
                className="px-4 py-2 text-xs font-bold bg-amber-400 text-slate-950 rounded-lg hover:bg-amber-300"
              >
                Retry with another method
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Success Screen & E-Ticket Voucher */}
        {paymentStep === 'success' && confirmedBooking && (
          <div className="p-6 space-y-5">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block">
                Payment Verified & Ticket Issued
              </span>
              <h4 className="text-xl font-extrabold text-slate-900 mt-1">
                Booking Confirmed!
              </h4>
              <p className="text-xs text-slate-500">
                A confirmation SMS & email have been dispatched to {passenger.email}.
              </p>
            </div>

            {/* Official Digital Ticket Card */}
            <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-4 text-xs space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Elham Booking Ref</span>
                  <span className="text-base font-black text-amber-900 font-mono tracking-wider">
                    {confirmedBooking.referenceNumber}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Supplier PNR</span>
                  <span className="font-mono font-bold text-slate-800">
                    {confirmedBooking.supplierConfirmationId}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div>
                  <span className="text-slate-400 block text-[10px]">Primary Traveler</span>
                  <span className="font-bold text-slate-900">{passenger.title} {passenger.firstName} {passenger.lastName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Service / Route</span>
                  <span className="font-semibold truncate block">{itemTitle}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Travel Date</span>
                  <span className="font-medium">{travelDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Total Amount Paid</span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {formatPrice(totalUSD, currentCurrency)}
                  </span>
                </div>
              </div>

              {confirmedBooking.eTicketNumber && (
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">E-Ticket No: <strong className="text-slate-800 font-mono">{confirmedBooking.eTicketNumber}</strong></span>
                  <QrCode className="w-5 h-5 text-slate-700" />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Receipt</span>
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Go to My Bookings
              </button>
            </div>
          </div>
        )}

        {/* Input & Gateway Selection Screen */}
        {paymentStep === 'input' && (
          <div className="p-6 space-y-5">
            {/* Order Summary Strip */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900 block text-sm truncate max-w-xs">{itemTitle}</span>
                <span className="text-slate-500 block text-[11px] truncate max-w-xs">{itemDetails}</span>
                <span className="text-slate-500 text-[10px] mt-0.5 block">Traveler: {passenger.firstName} {passenger.lastName}</span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-400 block uppercase">Total Payable</span>
                <span className="text-xl font-black text-slate-900 tabular-nums">
                  {formatPrice(totalUSD, currentCurrency)}
                </span>
                <span className="text-[9px] text-emerald-700 block">No hidden surcharge</span>
              </div>
            </div>

            {/* Gateway Toggle */}
            <div className="flex items-center justify-between p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setGateway('paystack')}
                className={`flex-1 py-2 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
                  gateway === 'paystack'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Paystack Nigeria (Cards & NIP)</span>
              </button>
              <button
                onClick={() => setGateway('flutterwave')}
                className={`flex-1 py-2 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
                  gateway === 'flutterwave'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Flutterwave (Cards & Global)</span>
              </button>
            </div>

            {/* Payment Method Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`flex items-center gap-1.5 pb-1 font-bold border-b-2 transition-all ${
                  paymentMethod === 'card'
                    ? 'text-amber-800 border-amber-600'
                    : 'text-slate-500 border-transparent hover:text-slate-800'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Nigerian Debit/Credit Card</span>
              </button>
              <button
                onClick={() => setPaymentMethod('bank_transfer')}
                className={`flex items-center gap-1.5 pb-1 font-bold border-b-2 transition-all ${
                  paymentMethod === 'bank_transfer'
                    ? 'text-amber-800 border-amber-600'
                    : 'text-slate-500 border-transparent hover:text-slate-800'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>Bank Transfer (Instant NIP)</span>
              </button>
              <button
                onClick={() => setPaymentMethod('usd_card')}
                className={`flex items-center gap-1.5 pb-1 font-bold border-b-2 transition-all ${
                  paymentMethod === 'usd_card'
                    ? 'text-amber-800 border-amber-600'
                    : 'text-slate-500 border-transparent hover:text-slate-800'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>USD Card / Apple Pay</span>
              </button>
            </div>

            {/* Card Method */}
            {(paymentMethod === 'card' || paymentMethod === 'usd_card') && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="0000 0000 0000 0000"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-mono font-medium tracking-wider text-slate-900"
                    />
                    <div className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">
                      {paymentMethod === 'card' ? 'Verve / Mastercard' : 'Visa / Amex'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-mono font-medium text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">CVV / Security Code</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="123"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-mono font-medium text-slate-900"
                    />
                  </div>
                </div>

                {showPinField && (
                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                    <label className="block text-xs font-bold text-slate-900 mb-1">Enter 4-Digit Card PIN to Authorize:</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardPin}
                      onChange={(e) => setCardPin(e.target.value)}
                      placeholder="••••"
                      className="w-32 bg-white border border-amber-400 rounded-lg p-2 text-center text-sm font-mono tracking-widest text-slate-900 font-bold focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500 block mt-1">Secured by 2-Factor Bank Verification</span>
                  </div>
                )}
              </div>
            )}

            {/* Instant Bank Transfer Method */}
            {paymentMethod === 'bank_transfer' && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                <p className="text-slate-600">
                  Transfer the exact amount below to this dedicated virtual account. It will be verified automatically in 60 seconds:
                </p>

                <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Bank Name:</span>
                    <strong className="text-slate-900">{virtualBankName}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Account Number:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-slate-900">{virtualAccountNumber}</span>
                      <button
                        onClick={handleCopyAccount}
                        className="p-1 hover:bg-slate-100 rounded text-amber-700"
                        title="Copy account"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  {virtualAccountCopied && (
                    <span className="text-[10px] text-emerald-600 block text-right font-medium">Account copied!</span>
                  )}
                  <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                    <span className="text-slate-500">Beneficiary:</span>
                    <strong className="text-slate-900">Elham International Limited</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Exact Amount:</span>
                    <strong className="text-amber-900 font-black text-sm tabular-nums">
                      {formatPrice(totalUSD, currentCurrency)}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {/* Action Button with Duplicate Protection */}
            <div className="pt-2">
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleInitiatePayment}
                className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 uppercase tracking-wider"
              >
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                <span>
                  {paymentMethod === 'bank_transfer'
                    ? 'I Have Sent The Bank Transfer'
                    : showPinField
                    ? 'Authorize & Issue E-Ticket'
                    : `Pay ${formatPrice(totalUSD, currentCurrency)} Securely`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Duplicate Payment Protected</span>
                </span>
                <span>·</span>
                <span>IATA & NCAA Regulated</span>
                <span>·</span>
                <span>Instant Ticket Issuance</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
