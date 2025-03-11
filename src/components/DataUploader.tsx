
import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parseCSVData } from "@/utils/dataUtils";
import { UserData, CountryInfo } from "@/types";
import { AlertCircle, DollarSign, PiggyBank, Wallet } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import FileUploadTab from "./data-uploader/FileUploadTab";
import ReviewTab from "./data-uploader/ReviewTab";

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
    
    if (!file) return;
    
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
        const formattedDate = date.toISOString().split('T')[0];
        
        data.push({
          date: formattedDate,
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="salary">Salary</TabsTrigger>
            <TabsTrigger value="savings">Savings</TabsTrigger>
            <TabsTrigger value="spending">Spending</TabsTrigger>
            <TabsTrigger value="review">Review</TabsTrigger>
          </TabsList>
          
          <TabsContent value="salary">
            <FileUploadTab
              type="salary"
              fileRef={salaryFileRef}
              onFileUpload={(e) => handleFileUpload(e, 'salary')}
              onSampleData={() => handleSampleData('salary')}
              title="Salary"
              icon={<DollarSign className="h-6 w-6 text-green-500" />}
            />
          </TabsContent>
          
          <TabsContent value="savings">
            <FileUploadTab
              type="savings"
              fileRef={savingsFileRef}
              onFileUpload={(e) => handleFileUpload(e, 'savings')}
              onSampleData={() => handleSampleData('savings')}
              title="Savings"
              icon={<PiggyBank className="h-6 w-6 text-purple-500" />}
            />
          </TabsContent>
          
          <TabsContent value="spending">
            <FileUploadTab
              type="spending"
              fileRef={spendingFileRef}
              onFileUpload={(e) => handleFileUpload(e, 'spending')}
              onSampleData={() => handleSampleData('spending')}
              title="Spending"
              icon={<Wallet className="h-6 w-6 text-orange-500" />}
            />
          </TabsContent>
          
          <TabsContent value="review">
            <ReviewTab
              selectedCountry={selectedCountry}
              onCountrySelect={setSelectedCountry}
              salaryData={salaryData}
              savingsData={savingsData}
              spendingData={spendingData}
              onSubmit={handleSubmit}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DataUploader;
