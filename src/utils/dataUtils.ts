
import { ChartData, InflationData, InsightData, UserData } from "@/types";

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

// Process user data into chart-friendly format
export const processDataForChart = (userData: UserData): ChartData[] => {
  const chartData: ChartData[] = [];
  
  // Ensure data is sorted by date
  const sortedSalary = [...userData.salary].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const sortedSavings = [...userData.savings].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const sortedSpending = [...userData.spending].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Create a data point for each salary entry
  sortedSalary.forEach(salaryItem => {
    const date = new Date(salaryItem.date);
    const formattedDate = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    
    // Find corresponding savings for the same month/year
    const savingsItem = sortedSavings.find(s => {
      const sDate = new Date(s.date);
      return sDate.getMonth() === date.getMonth() && 
             sDate.getFullYear() === date.getFullYear();
    });
    
    // Find corresponding spending for the same month/year
    const spendingItem = sortedSpending.find(s => {
      const sDate = new Date(s.date);
      return sDate.getMonth() === date.getMonth() && 
             sDate.getFullYear() === date.getFullYear();
    });
    
    // Get inflation rate and calculate adjusted salary
    const inflationRate = getInflationRate(salaryItem.date, userData.country);
    const adjustedSalary = calculateInflationAdjustedSalary(salaryItem.amount, inflationRate);
    
    chartData.push({
      name: formattedDate,
      salary: salaryItem.amount,
      adjustedSalary: Number(adjustedSalary.toFixed(2)),
      savings: savingsItem?.amount || 0,
      spending: spendingItem?.amount || 0,
    });
  });
  
  return chartData;
};

// Generate insights based on user data
export const generateInsights = (
  userData: UserData, 
  chartData: ChartData[]
): InsightData[] => {
  const insights: InsightData[] = [];
  
  if (chartData.length < 2) {
    return [
      {
        title: "More Data Needed",
        description: "Please upload data for at least two months to get insights.",
        type: "neutral"
      }
    ];
  }
  
  // Calculate salary growth rate
  const firstSalary = chartData[0].salary;
  const lastSalary = chartData[chartData.length - 1].salary;
  const salaryGrowthRate = ((lastSalary - firstSalary) / firstSalary) * 100;
  
  // Calculate inflation-adjusted growth rate
  const firstAdjustedSalary = chartData[0].adjustedSalary;
  const lastAdjustedSalary = chartData[chartData.length - 1].adjustedSalary;
  const adjustedGrowthRate = ((lastAdjustedSalary - firstAdjustedSalary) / firstAdjustedSalary) * 100;
  
  // Calculate average savings rate
  const totalIncome = chartData.reduce((sum, item) => sum + item.salary, 0);
  const totalSavings = chartData.reduce((sum, item) => sum + item.savings, 0);
  const savingsRate = (totalSavings / totalIncome) * 100;
  
  // Compare salary growth with inflation
  if (salaryGrowthRate > 0) {
    insights.push({
      title: "Salary Growth",
      description: `Your salary has grown by ${salaryGrowthRate.toFixed(1)}% over the period.`,
      type: salaryGrowthRate > 10 ? "positive" : "neutral",
      value: salaryGrowthRate
    });
  } else {
    insights.push({
      title: "Salary Decline",
      description: `Your salary has decreased by ${Math.abs(salaryGrowthRate).toFixed(1)}% over the period.`,
      type: "negative",
      value: salaryGrowthRate
    });
  }
  
  // Inflation impact insight
  const inflationImpact = salaryGrowthRate - adjustedGrowthRate;
  if (inflationImpact > 0) {
    insights.push({
      title: "Inflation Impact",
      description: `Inflation has reduced your real salary growth by ${inflationImpact.toFixed(1)}%.`,
      type: inflationImpact > 5 ? "negative" : "neutral",
      value: inflationImpact
    });
  }
  
  // Savings rate insight
  insights.push({
    title: "Savings Rate",
    description: `Your average savings rate is ${savingsRate.toFixed(1)}% of income.`,
    type: savingsRate > 20 ? "positive" : savingsRate > 10 ? "neutral" : "negative",
    value: savingsRate
  });
  
  // Spending trend
  const firstSpending = chartData[0].spending;
  const lastSpending = chartData[chartData.length - 1].spending;
  const spendingGrowthRate = ((lastSpending - firstSpending) / firstSpending) * 100;
  
  if (spendingGrowthRate > 15) {
    insights.push({
      title: "Increasing Expenses",
      description: `Your spending has increased by ${spendingGrowthRate.toFixed(1)}% over the period.`,
      type: "negative",
      value: spendingGrowthRate
    });
  } else if (spendingGrowthRate < -10) {
    insights.push({
      title: "Reduced Spending",
      description: `You've reduced your spending by ${Math.abs(spendingGrowthRate).toFixed(1)}% over the period.`,
      type: "positive",
      value: spendingGrowthRate
    });
  }
  
  return insights;
};

// Parse CSV data format
export const parseCSVData = (csv: string, type: 'salary' | 'savings' | 'spending'): any[] => {
  const lines = csv.split('\n');
  const headers = lines[0].split(',');
  
  // Find date and amount column indices
  const dateIndex = headers.findIndex(h => h.toLowerCase().includes('date'));
  const amountIndex = headers.findIndex(h => h.toLowerCase().includes('amount'));
  
  // Additional column for spending category if applicable
  const categoryIndex = type === 'spending' 
    ? headers.findIndex(h => h.toLowerCase().includes('category')) 
    : -1;
  
  if (dateIndex === -1 || amountIndex === -1) {
    throw new Error(`CSV must include date and amount columns. Found headers: ${headers.join(', ')}`);
  }
  
  return lines.slice(1).filter(line => line.trim()).map(line => {
    const values = line.split(',');
    
    const entry: any = {
      date: values[dateIndex].trim(),
      amount: parseFloat(values[amountIndex].trim())
    };
    
    if (type === 'spending' && categoryIndex !== -1) {
      entry.category = values[categoryIndex]?.trim() || 'Uncategorized';
    }
    
    return entry;
  });
};

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
  const country = countries.find(c => c.currency.code === currencyCode);
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode || 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
