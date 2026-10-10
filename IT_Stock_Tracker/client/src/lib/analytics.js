/**
 * analytics.js — Thin wrapper around window.dataLayer for GTM event pushes.
 *
 * GTM Container : GTM-P4N9GSR2
 * GA4 Measurement ID : G-YJ2WZ9FXKK
 *
 * Tracking Plan:
 * ┌─────────────────┬──────────────┬─────────────────────────────────┐
 * │ Event           │ Parameters   │ When it fires                   │
 * ├─────────────────┼──────────────┼─────────────────────────────────┤
 * │ stock_search    │ ticker       │ Successful search / stock view  │
 * │ search_error    │ error_type   │ Invalid symbol or rate limit    │
 * └─────────────────┴──────────────┴─────────────────────────────────┘
 *
 * error_type values:
 *   'rate_limit'     — Alpha Vantage API quota exceeded
 *   'invalid_symbol' — Symbol not found / empty quote returned
 *   'network_error'  — Unexpected fetch failure
 */

/**
 * Generic push to window.dataLayer.
 * @param {string} event - GTM event name
 * @param {Object} params - Additional parameters to include
 */
export const pushEvent = (event, params = {}) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
};

/**
 * Push a stock_search event — fired when a user successfully searches
 * for a stock (clicks a result or navigates to a stock detail page).
 * @param {string} ticker - The stock symbol (e.g. "AAPL", "TCS.BSE")
 */
export const trackStockSearch = (ticker) => {
  pushEvent('stock_search', { ticker: ticker?.toUpperCase() });
};

/**
 * Push a search_error event — fired when a search or stock fetch fails.
 * @param {'rate_limit'|'invalid_symbol'|'network_error'} errorType
 */
export const trackSearchError = (errorType) => {
  pushEvent('search_error', { error_type: errorType });
};
