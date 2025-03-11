
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InsightData, UserData } from "@/types";
import { formatCurrency } from "@/utils/dataUtils";
import { TrendingUp, TrendingDown, AlertCircle, Check, Info } from "lucide-react";

interface InsightsPanelProps {
  insights: InsightData[];
  userData: UserData;
}

const InsightsPanel = ({ insights, userData }: InsightsPanelProps) => {
  const getInsightIcon = (type: string, value?: number | string) => {
    switch (type) {
      case "positive":
        return (
          <div className="rounded-full p-2 bg-green-100 text-green-600">
            <TrendingUp className="w-5 h-5" />
          </div>
        );
      case "negative":
        return (
          <div className="rounded-full p-2 bg-red-100 text-red-600">
            <TrendingDown className="w-5 h-5" />
          </div>
        );
      case "neutral":
        return (
          <div className="rounded-full p-2 bg-blue-100 text-blue-600">
            <Info className="w-5 h-5" />
          </div>
        );
      default:
        return (
          <div className="rounded-full p-2 bg-gray-100 text-gray-600">
            <AlertCircle className="w-5 h-5" />
          </div>
        );
    }
  };

  const getInsightValue = (insight: InsightData) => {
    if (insight.value === undefined) return null;
    
    if (typeof insight.value === "number") {
      // If it looks like a percentage
      if (insight.title.toLowerCase().includes("rate") || 
          insight.title.toLowerCase().includes("growth") || 
          insight.title.toLowerCase().includes("impact") ||
          Math.abs(insight.value) < 100) {
        const value = Math.abs(insight.value);
        return (
          <div className={`text-2xl font-semibold ${insight.type === "positive" ? "text-green-600" : insight.type === "negative" ? "text-red-600" : "text-blue-600"}`}>
            {value.toFixed(1)}%
          </div>
        );
      }
      
      // If it looks like a currency amount
      return (
        <div className={`text-2xl font-semibold ${insight.type === "positive" ? "text-green-600" : insight.type === "negative" ? "text-red-600" : "text-blue-600"}`}>
          {formatCurrency(insight.value as number, userData.currency)}
        </div>
      );
    }
    
    // String value
    return (
      <div className={`text-lg font-medium ${insight.type === "positive" ? "text-green-600" : insight.type === "negative" ? "text-red-600" : "text-blue-600"}`}>
        {insight.value}
      </div>
    );
  };

  return (
    <Card className="w-full glass-card transition-all duration-500 motion-safe:animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-medium">Key Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-md ${
                insight.type === "positive" 
                  ? "bg-green-50/50 border-green-100" 
                  : insight.type === "negative" 
                  ? "bg-red-50/50 border-red-100" 
                  : "bg-blue-50/50 border-blue-100"
              }`}
            >
              <div className="flex items-start gap-3">
                {getInsightIcon(insight.type, insight.value)}
                <div className="flex-1">
                  <h3 className="font-medium text-lg mb-1">{insight.title}</h3>
                  <p className="text-gray-700 text-sm mb-2">{insight.description}</p>
                  {getInsightValue(insight)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InsightsPanel;
