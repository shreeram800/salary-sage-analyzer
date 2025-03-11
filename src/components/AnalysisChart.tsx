
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";
import { ChartData, UserData } from "@/types";
import { formatCurrency } from "@/utils/dataUtils";

interface AnalysisChartProps {
  chartData: ChartData[];
  userData: UserData;
}

const AnalysisChart = ({ chartData, userData }: AnalysisChartProps) => {
  const [activeChart, setActiveChart] = useState("combined");

  const currencyFormatter = (value: number) => {
    return formatCurrency(value, userData.currency);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
          <p className="font-medium text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center gap-2 mb-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-700">{entry.name}:</span>
              <span className="text-sm font-medium">
                {currencyFormatter(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full glass-card transition-all duration-500 motion-safe:animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-medium">Financial Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeChart} onValueChange={setActiveChart}>
          <TabsList className="grid grid-cols-4 w-full mb-6">
            <TabsTrigger value="combined">Combined</TabsTrigger>
            <TabsTrigger value="salary">Salary vs Inflation</TabsTrigger>
            <TabsTrigger value="savings">Savings</TabsTrigger>
            <TabsTrigger value="spending">Spending</TabsTrigger>
          </TabsList>

          <TabsContent value="combined" className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis 
                  tickFormatter={currencyFormatter} 
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="salary"
                  name="Salary"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="adjustedSalary"
                  name="Inflation-Adjusted Salary"
                  stroke="#7c3aed"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="savings"
                  name="Savings"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="spending"
                  name="Spending"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="salary" className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="salaryGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="adjustedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis 
                  tickFormatter={currencyFormatter} 
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="salary"
                  name="Salary"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#salaryGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="adjustedSalary"
                  name="Inflation-Adjusted"
                  stroke="#7c3aed"
                  fillOpacity={1}
                  fill="url(#adjustedGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="savings" className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis 
                  tickFormatter={currencyFormatter} 
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="savings"
                  name="Savings"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="salary"
                  name="Salary"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  opacity={0.3}
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="spending" className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis 
                  tickFormatter={currencyFormatter} 
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="spending"
                  name="Spending"
                  fill="#f97316"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="salary"
                  name="Salary"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  opacity={0.3}
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AnalysisChart;
