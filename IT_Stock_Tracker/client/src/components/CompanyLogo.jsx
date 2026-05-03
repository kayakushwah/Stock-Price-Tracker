import { useState } from 'react';

// Map of stock symbols to their official Clearbit logo domain
const LOGO_DOMAINS = {
  // IT Stocks
  TCS: 'tcs.com',
  INFY: 'infosys.com',
  WIT: 'wipro.com',
  HCLTECH: 'hcltech.com',
  TECHM: 'techmahindra.com',
  LTIM: 'ltimindtree.com',
  PERSISTENT: 'persistent.com',
  MPHASIS: 'mphasis.com',
  KPITTECH: 'kpit.com',
  COFORGE: 'coforge.com',
  OFSS: 'oracle.com',
  HEXAWARE: 'hexaware.com',
  // Global Tech
  AAPL: 'apple.com',
  MSFT: 'microsoft.com',
  GOOGL: 'google.com',
  AMZN: 'amazon.com',
  NVDA: 'nvidia.com',
  TSLA: 'tesla.com',
  META: 'meta.com',
  // Banking
  HDFCBANK: 'hdfcbank.com',
  ICICIBANK: 'icicibank.com',
  SBIN: 'sbi.co.in',
  KOTAKBANK: 'kotak.com',
  AXISBANK: 'axisbank.com',
  PNB: 'pnbindia.in',
  BOB: 'bankofbaroda.in',
  YESBANK: 'yesbank.in',
  IDFCFIRSTB: 'idfcfirstbank.com',
  INDUSINDBK: 'indusind.com',
  FEDERALBNK: 'federalbank.co.in',
  BANDHANBNK: 'bandhanbank.com',
  // FMCG
  ITC: 'itcportal.com',
  HINDUNILVR: 'hul.co.in',
  NESTLEIND: 'nestle.in',
  BRITANNIA: 'britannia.co.in',
  DABUR: 'dabur.com',
  GODREJCP: 'godrejcp.com',
  MARICO: 'marico.com',
  COLPAL: 'colgate.co.in',
  // Auto
  TATAMOTORS: 'tatamotors.com',
  MARUTI: 'marutisuzuki.com',
  BAJAJ: 'bajajauto.com',
  HEROMOTOCO: 'heromotocorp.com',
  EICHERMOT: 'eichergroup.com',
  // Energy
  RELIANCE: 'ril.com',
  ONGC: 'ongcindia.com',
  NTPC: 'ntpc.co.in',
  TATAPOWER: 'tatapower.com',
  ADANIGREEN: 'adanigreen.com',
  COALINDIA: 'coalindia.in',
};

/**
 * Renders the official company logo from Clearbit's logo API.
 * Falls back to nothing if the logo fails to load.
 * Pass `size` as a number (pixels).
 */
export default function CompanyLogo({ symbol, size = 32, className = '' }) {
  const [error, setError] = useState(false);

  const key = symbol ? symbol.split('.')[0].toUpperCase() : '';
  const domain = LOGO_DOMAINS[key];

  // If no domain mapping found or image failed, render nothing
  if (!domain || error) return null;

  return (
    <img
      src={`https://logo.clearbit.com/${domain}`}
      alt={`${key} logo`}
      width={size}
      height={size}
      className={`object-contain rounded-lg bg-white ${className}`}
      style={{ width: size, height: size, minWidth: size }}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}
