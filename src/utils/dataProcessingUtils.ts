
import { ChartData, UserData } from "@/types";
import { getInflationRate, calculateInflationAdjustedSalary } from "./inflationUtils";

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
