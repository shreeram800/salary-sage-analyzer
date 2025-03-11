
import { UserData, ChartData, InsightData } from "@/types";

interface AIAnalysisResponse {
  insights: InsightData[];
  explanation: string;
}

const formatDataForAI = (userData: UserData, chartData: ChartData[]): string => {
  const lastEntry = chartData[chartData.length - 1];
  const firstEntry = chartData[0];
  
  const timeSpan = `${firstEntry.name} to ${lastEntry.name}`;
  const salaryGrowth = ((lastEntry.salary - firstEntry.salary) / firstEntry.salary) * 100;
  const averageSavings = chartData.reduce((sum, item) => sum + item.savings, 0) / chartData.length;
  const averageSpending = chartData.reduce((sum, item) => sum + item.spending, 0) / chartData.length;
  
  return `
Financial data analysis for period ${timeSpan}:
- Initial salary: ${firstEntry.salary} ${userData.currency}
- Current salary: ${lastEntry.salary} ${userData.currency}
- Salary growth: ${salaryGrowth.toFixed(1)}%
- Average monthly savings: ${averageSavings.toFixed(0)} ${userData.currency}
- Average monthly spending: ${averageSpending.toFixed(0)} ${userData.currency}
- Country: ${userData.country}

Please analyze this financial data and provide insights on:
1. Salary growth performance relative to inflation
2. Savings patterns and recommendations
3. Spending habits and potential areas of improvement
4. Overall financial health assessment
`;
};

export const analyzeDataWithAI = async (
  userData: UserData,
  chartData: ChartData[],
  apiKey: string
): Promise<AIAnalysisResponse> => {
  try {
    const prompt = formatDataForAI(userData, chartData);
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a financial analyst focusing on personal finance. Keep your analysis clear, actionable, and focused on key metrics. Structure your response to clearly separate different aspects of the analysis.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get AI analysis');
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    // Parse the AI response into structured insights
    const insights: InsightData[] = [
      {
        title: "AI Financial Analysis",
        description: "Detailed analysis of your financial data using artificial intelligence",
        type: "neutral",
      }
    ];

    return {
      insights,
      explanation: analysis
    };
  } catch (error) {
    console.error('AI Analysis error:', error);
    throw error;
  }
};
