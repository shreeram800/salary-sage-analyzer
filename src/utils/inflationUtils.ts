
import { InflationData } from "@/types";

// Sample inflation data for different countries
const inflationRates: Record<string, InflationData[]> = {
  US: [
    { year: 2023, month: 1, rate: 6.4 },
    { year: 2023, month: 6, rate: 3.0 },
    { year: 2023, month: 12, rate: 3.4 },
    { year: 2024, month: 1, rate: 3.1 },
    { year: 2024, month: 2, rate: 3.2 },
  ],
  UK: [
    { year: 2023, month: 1, rate: 10.1 },
    { year: 2023, month: 6, rate: 7.9 },
    { year: 2023, month: 12, rate: 4.0 },
    { year: 2024, month: 1, rate: 4.0 },
    { year: 2024, month: 2, rate: 3.4 },
  ],
  IN: [
    { year: 2023, month: 1, rate: 6.5 },
    { year: 2023, month: 6, rate: 4.8 },
    { year: 2023, month: 12, rate: 5.7 },
    { year: 2024, month: 1, rate: 5.1 },
    { year: 2024, month: 2, rate: 5.1 },
  ],
  // Add more countries as needed
};

// Get inflation rate for a specific date and country
export const getInflationRate = (date: string, country: string): number => {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  
  const countryRates = inflationRates[country] || inflationRates.US;
  
  // Find the closest inflation rate
  const closest = countryRates.reduce((prev, curr) => {
    const prevDate = new Date(prev.year, prev.month - 1);
    const currDate = new Date(curr.year, curr.month - 1);
    const targetDate = new Date(year, month - 1);
    
    const prevDiff = Math.abs(prevDate.getTime() - targetDate.getTime());
    const currDiff = Math.abs(currDate.getTime() - targetDate.getTime());
    
    return currDiff < prevDiff ? curr : prev;
  });
  
  return closest.rate;
};

// Adjust salary for inflation
export const calculateInflationAdjustedSalary = (
  amount: number, 
  inflationRate: number
): number => {
  return amount / (1 + inflationRate / 100);
};
