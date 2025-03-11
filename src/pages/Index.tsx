
import { useState } from "react";
import Hero from "@/components/Hero";
import DataUploader from "@/components/DataUploader";
import AnalysisChart from "@/components/AnalysisChart";
import InsightsPanel from "@/components/InsightsPanel";
import { ChartData, InsightData, UserData } from "@/types";
import { processDataForChart, generateInsights } from "@/utils/dataUtils";

const Index = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleDataUploaded = (data: UserData) => {
    setUserData(data);
    
    // Process the data for charts
    const processedData = processDataForChart(data);
    setChartData(processedData);
    
    // Generate insights
    const generatedInsights = generateInsights(data, processedData);
    setInsights(generatedInsights);
    
    // Show results
    setShowResults(true);
    
    // Scroll to results after a short delay
    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4">
        <Hero />
        
        <div id="upload-section" className="py-12">
          <DataUploader onDataUploaded={handleDataUploaded} />
        </div>
        
        {showResults && userData && (
          <div id="results-section" className="py-12 space-y-10">
            <AnalysisChart chartData={chartData} userData={userData} />
            <InsightsPanel insights={insights} userData={userData} />
          </div>
        )}
        
        <footer className="py-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Salary Increment Analyzer. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
