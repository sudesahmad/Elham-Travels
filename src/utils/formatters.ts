import { CurrencyCode } from '../types/travel';
import { CURRENCY_RATES } from '../data/mockTravelData';

export function convertUSD(amountUSD: number, targetCurrency: CurrencyCode): number {
  const rateObj = CURRENCY_RATES[targetCurrency] || CURRENCY_RATES.USD;
  return amountUSD * rateObj.rateToUSD;
}

export function formatPrice(amountUSD: number, targetCurrency: CurrencyCode = 'NGN'): string {
  const converted = convertUSD(amountUSD, targetCurrency);
  const rateObj = CURRENCY_RATES[targetCurrency] || CURRENCY_RATES.USD;

  if (targetCurrency === 'NGN') {
    return `${rateObj.symbol}${Math.round(converted).toLocaleString('en-NG')}`;
  } else if (targetCurrency === 'SAR') {
    return `${Math.round(converted).toLocaleString('en-US')} ${rateObj.symbol}`;
  } else {
    return `${rateObj.symbol}${converted.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}
