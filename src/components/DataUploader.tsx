
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseCSVData } from "@/utils/dataUtils";
import { UserData, CountryInfo } from "@/types";
import CountrySelector from "./CountrySelector";
import { AlertCircle, Upload, DollarSign, PiggyBank, Wallet } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

interface DataUploaderProps {
  onDataUploaded: (data: UserData) => void;
}

const DataUploader = ({ onDataUploaded }: DataUploaderProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("salary");
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo | null>(null);
  const [salaryData, setSalaryData] = useState<any[]>([]);
  const [savingsData, setSavingsData] = useState<any[]>([]);
  const [spendingData, setSpendingData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const salaryFileRef = useRef<HTMLInputElement>(null);
  const savingsFileRef = useRef<HTMLInputElement>(null);
  const spendingFileRef = useRef<HTMLInputElement>(null);
  
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'salary' | 'savings' | 'spending'
  ) => {
    setError(null);
    const file = event.target.files?.[0];
    
    if (!file) {
      return;
    }
    
    try {
      const text = await file.text();
      const parsedData = parseCSVData(text, type);
      
      if (parsedData.length === 0) {
        throw new Error("No valid data found in the file.");
      }
      
      switch (type) {
        case 'salary':
          setSalaryData(parsedData);
          break;
        case 'savings':
          setSavingsData(parsedData);
          break;
        case 'spending':
          setSpendingData(parsedData);
          break;
      }
      
      toast({
        title: "File uploaded successfully",
        description: `${parsedData.length} entries loaded for ${type} data.`,
      });
      
      // Move to next tab automatically
      if (type === 'salary') setActiveTab('savings');
      else if (type === 'savings') setActiveTab('spending');
      else if (type === 'spending') setActiveTab('review');
      
    } catch (err) {
      setError(`Error parsing file: ${err instanceof Error ? err.message : "Unknown error"}`);
      
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: err instanceof Error ? err.message : "Failed to parse file",
      });
    }
  };
  
  const handleSampleData = (type: 'salary' | 'savings' | 'spending') => {
    const currentDate = new Date();
    const generateSampleData = (months: number = 12) => {
      const data = [];
      for (let i = 0; i < months; i++) {
        const date = new Date(currentDate);
        date.setMonth(currentDate.getMonth() - i);
        
        // Format date as YYYY-MM-DD
        const formattedDate = date.toISOString().split('T')[0];
        
        data.push({
          date: formattedDate,
          // Generate slightly varying amounts
          amount: type === 'salary' ? 
                  5000 + Math.floor(Math.random() * 500) * (1 + i/24) : 
                  type === 'savings' ? 
                  1000 + Math.floor(Math.random() * 300) : 
                  2500 + Math.floor(Math.random() * 500),
          ...(type === 'spending' ? { category: 'General' } : {})
        });
      }
      return data;
    };
    
    const sampleData = generateSampleData();
    
    switch (type) {
      case 'salary':
        setSalaryData(sampleData);
        break;
      case 'savings':
        setSavingsData(sampleData);
        break;
      case 'spending':
        setSpendingData(sampleData);
        break;
    }
    
    toast({
      title: "Sample data loaded",
      description: `Sample ${type} data generated for the last 12 months.`,
    });
    
    // Move to next tab automatically
    if (type === 'salary') setActiveTab('savings');
    else if (type === 'savings') setActiveTab('spending');
    else if (type === 'spending') setActiveTab('review');
  };
  
  const handleSubmit = () => {
    if (!selectedCountry) {
      setError("Please select your country to continue.");
      return;
    }
    
    if (salaryData.length === 0) {
      setError("Salary data is required to continue.");
      setActiveTab('salary');
      return;
    }
    
    const userData: UserData = {
      salary: salaryData,
      savings: savingsData.length > 0 ? savingsData : [],
      spending: spendingData.length > 0 ? spendingData : [],
      country: selectedCountry.code,
      currency: selectedCountry.currency.code,
    };
    
    onDataUploaded(userData);
    
    toast({
      title: "Analysis ready",
      description: "Your financial data has been processed successfully.",
    });
  };
  
  const countDataPoints = (dataArray: any[]) => {
    return dataArray.length;
  };
  
  const dataSummaryCard = (
    title: string, 
    icon: React.ReactNode, 
    data: any[], 
    dataPoints: number
  ) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-100 shadow-sm p-4 flex flex-col">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-full bg-blue-50 text-blue-500">
          {icon}
        </div>
        <h3 className="font-medium">{title}</h3>
      </div>
      {dataPoints > 0 ? (
        <div className="mt-1">
          <p className="text-sm text-gray-500">
            {dataPoints} data points loaded
          </p>
          <p className="text-sm text-gray-500">
            Date range: {data.length > 0 ? (
              <>
                {new Date(data[data.length - 1].date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} 
                {" to "} 
                {new Date(data[0].date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </>
            ) : "N/A"}
          </p>
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">No data uploaded yet</p>
      )}
    </div>
  );
  
  const renderTabContent = (
    type: 'salary' | 'savings' | 'spending',
    fileRef: React.RefObject<HTMLInputElement>,
    icon: React.ReactNode,
    title: string,
    description: string
  ) => (
    <div className="space-y-4 transition-all duration-300 animate-scale-in">
      <div className="space-y-2">
        <Label htmlFor={`${type}-file`} className="text-base">Upload {title} Data</Label>
        <div className="flex gap-2">
          <Input
            id={`${type}-file`}
            type="file"
            accept=".csv"
            ref={fileRef}
            onChange={(e) => handleFileUpload(e, type)}
            className="opacity-0 absolute"
          />
          <Button 
            onClick={() => fileRef.current?.click()}
            variant="outline" 
            className="w-full h-28 flex-col gap-2 hover:bg-blue-50 border-dashed border-2 transition-all duration-200"
          >
            <Upload className="h-6 w-6 text-blue-500" />
            <span className="font-medium">Upload CSV</span>
            <span className="text-xs text-gray-500">
              CSV with date and amount columns
            </span>
          </Button>
          <Button
            variant="outline"
            className="w-full h-28 flex-col gap-2 hover:bg-blue-50 transition-all duration-200"
            onClick={() => handleSampleData(type)}
          >
            {icon}
            <span className="font-medium">Use Sample Data</span>
            <span className="text-xs text-gray-500">
              Generate 12 months of sample data
            </span>
          </Button>
        </div>
      </div>
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-medium block mb-1">CSV Format:</span>
          Your file should include columns for date (YYYY-MM-DD) and amount.
          {type === 'spending' && " You can also include a category column."}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Example: date,amount{type === 'spending' ? ",category" : ""}
        </p>
      </div>
    </div>
  );
  
  return (
    <Card className="w-full glass-card mb-8 transition-all duration-500 motion-safe:animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-medium">Upload Your Financial Data</CardTitle>
        <CardDescription>
          Upload your salary, savings, and spending data for analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="salary">Salary</TabsTrigger>
            <TabsTrigger value="savings">Savings</TabsTrigger>
            <TabsTrigger value="spending">Spending</TabsTrigger>
            <TabsTrigger value="review">Review</TabsTrigger>
          </TabsList>
          
          <TabsContent value="salary" className="space-y-4">
            {renderTabContent(
              'salary',
              salaryFileRef,
              <DollarSign className="h-6 w-6 text-green-500" />,
              'Salary',
              'Upload your monthly salary data'
            )}
          </TabsContent>
          
          <TabsContent value="savings" className="space-y-4">
            {renderTabContent(
              'savings',
              savingsFileRef,
              <PiggyBank className="h-6 w-6 text-purple-500" />,
              'Savings',
              'Upload your monthly savings data'
            )}
          </TabsContent>
          
          <TabsContent value="spending" className="space-y-4">
            {renderTabContent(
              'spending',
              spendingFileRef,
              <Wallet className="h-6 w-6 text-orange-500" />,
              'Spending',
              'Upload your monthly spending data'
            )}
          </TabsContent>
          
          <TabsContent value="review" className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base">Select Your Country</Label>
              <CountrySelector
                selectedCountry={selectedCountry}
                onSelect={setSelectedCountry}
              />
              <p className="text-sm text-gray-500">
                We'll use this to compare your data with local inflation rates.
              </p>
            </div>
            
            <div className="space-y-3">
              <Label className="text-base">Data Summary</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dataSummaryCard(
                  "Salary Data", 
                  <DollarSign className="h-4 w-4" />, 
                  salaryData,
                  countDataPoints(salaryData)
                )}
                {dataSummaryCard(
                  "Savings Data", 
                  <PiggyBank className="h-4 w-4" />, 
                  savingsData,
                  countDataPoints(savingsData)
                )}
                {dataSummaryCard(
                  "Spending Data", 
                  <Wallet className="h-4 w-4" />, 
                  spendingData,
                  countDataPoints(spendingData)
                )}
              </div>
            </div>
            
            <Button 
              onClick={handleSubmit} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 mt-4"
              disabled={!selectedCountry || salaryData.length === 0}
            >
              Analyze My Financial Data
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DataUploader;
