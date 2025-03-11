
// Sample country data
export const countries = [
  {
    code: "US",
    name: "United States",
    currency: { code: "USD", symbol: "$" },
    flag: "🇺🇸"
  },
  {
    code: "UK",
    name: "United Kingdom",
    currency: { code: "GBP", symbol: "£" },
    flag: "🇬🇧"
  },
  {
    code: "IN",
    name: "India",
    currency: { code: "INR", symbol: "₹" },
    flag: "🇮🇳"
  },
  {
    code: "CA",
    name: "Canada",
    currency: { code: "CAD", symbol: "$" },
    flag: "🇨🇦"
  },
  {
    code: "AU",
    name: "Australia",
    currency: { code: "AUD", symbol: "$" },
    flag: "🇦🇺"
  },
  {
    code: "EU",
    name: "European Union",
    currency: { code: "EUR", symbol: "€" },
    flag: "🇪🇺"
  },
  {
    code: "JP",
    name: "Japan",
    currency: { code: "JPY", symbol: "¥" },
    flag: "🇯🇵"
  },
  {
    code: "SG",
    name: "Singapore",
    currency: { code: "SGD", symbol: "$" },
    flag: "🇸🇬"
  }
];

// Format currency based on the selected country
export const formatCurrency = (amount: number, currencyCode: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode || 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
