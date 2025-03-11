
import { ChartData, InsightData, UserData } from "@/types";

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
