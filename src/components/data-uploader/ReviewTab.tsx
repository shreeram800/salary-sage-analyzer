
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DollarSign, PiggyBank, Wallet } from "lucide-react";
import CountrySelector from "../CountrySelector";
import DataSummaryCard from "./DataSummaryCard";
import { CountryInfo } from "@/types";

interface ReviewTabProps {
  selectedCountry: CountryInfo | null;
  onCountrySelect: (country: CountryInfo) => void;
  salaryData: any[];
  savingsData: any[];
  spendingData: any[];
  onSubmit: () => void;
}

const ReviewTab = ({
  selectedCountry,
  onCountrySelect,
  salaryData,
  savingsData,
  spendingData,
  onSubmit
}: ReviewTabProps) => {
  const countDataPoints = (dataArray: any[]) => dataArray.length;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label className="text-base">Select Your Country</Label>
        <CountrySelector
          selectedCountry={selectedCountry}
          onSelect={onCountrySelect}
        />
        <p className="text-sm text-gray-500">
          We'll use this to compare your data with local inflation rates.
        </p>
      </div>
      
      <div className="space-y-3">
        <Label className="text-base">Data Summary</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DataSummaryCard
            title="Salary Data"
            icon={<DollarSign className="h-4 w-4" />}
            data={salaryData}
            dataPoints={countDataPoints(salaryData)}
          />
          <DataSummaryCard
            title="Savings Data"
            icon={<PiggyBank className="h-4 w-4" />}
            data={savingsData}
            dataPoints={countDataPoints(savingsData)}
          />
          <DataSummaryCard
            title="Spending Data"
            icon={<Wallet className="h-4 w-4" />}
            data={spendingData}
            dataPoints={countDataPoints(spendingData)}
          />
        </div>
      </div>
      
      <Button 
        onClick={onSubmit} 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 mt-4"
        disabled={!selectedCountry || salaryData.length === 0}
      >
        Analyze My Financial Data
      </Button>
    </div>
  );
};

export default ReviewTab;
