
import { useState } from "react";
import Hero from "@/components/Hero";
import DataUploader from "@/components/DataUploader";
import AnalysisChart from "@/components/AnalysisChart";
import InsightsPanel from "@/components/InsightsPanel";
import { ChartData, InsightData, UserData } from "@/types";
import { processDataForChart } from "@/utils/dataProcessingUtils";
import { generateInsights } from "@/utils/insightsUtils";
import { analyzeDataWithAI } from "@/utils/aiAnalysis";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [perplexityKey, setPerplexityKey] = useState<string>("");
  const [showKeyInput, setShowKeyInput] = useState(false);

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

  const handleAIAnalysis = async () => {
    if (!userData || !chartData.length) {
      toast({
        variant: "destructive",
        title: "No data to analyze",
        description: "Please upload your financial data first."
      });
      return;
    }

    if (!perplexityKey) {
      setShowKeyInput(true);
      return;
    }

    setIsAnalyzing(true);
    try {
      const analysis = await analyzeDataWithAI(userData, chartData, perplexityKey);
      setAiAnalysis(analysis.explanation);
      setInsights(prev => [...analysis.insights, ...prev]);
      
      toast({
        title: "Analysis Complete",
        description: "AI has analyzed your financial data and generated insights."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Failed to analyze data. Please check your API key and try again."
      });
    } finally {
      setIsAnalyzing(false);
    }
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Analysis Results</h2>
              {showKeyInput ? (
                <div className="flex gap-2 items-center">
                  <input
                    type="password"
                    placeholder="Enter Perplexity API Key"
                    className="px-3 py-2 border rounded-md"
                    value={perplexityKey}
                    onChange={(e) => setPerplexityKey(e.target.value)}
                  />
                  <Button 
                    onClick={() => {
                      setShowKeyInput(false);
                      handleAIAnalysis();
                    }}
                    disabled={!perplexityKey}
                  >
                    Submit
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleAIAnalysis}
                  disabled={isAnalyzing}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze with AI"
                  )}
                </Button>
              )}
            </div>
            
            <AnalysisChart chartData={chartData} userData={userData} />
            
            {aiAnalysis && (
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-medium mb-4">AI Analysis</h3>
                <div className="prose max-w-none">
                  {aiAnalysis.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-700">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}
            
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
