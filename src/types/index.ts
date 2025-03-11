
export interface SalaryData {
  date: string;
  amount: number;
}

export interface SavingsData {
  date: string;
  amount: number;
}

export interface SpendingData {
  date: string;
  amount: number;
  category?: string;
}

export interface UserData {
  salary: SalaryData[];
  savings: SavingsData[];
  spending: SpendingData[];
  currency: string;
  country: string;
}

export interface CountryInfo {
  code: string;
  name: string;
  currency: {
    code: string;
    symbol: string;
  };
  flag: string;
}

export interface InflationData {
  year: number;
  month: number;
  rate: number;
}

export interface ChartData {
  name: string;
  salary: number;
  adjustedSalary: number;
  savings: number;
  spending: number;
}

export interface InsightData {
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral';
  value?: number | string;
}
