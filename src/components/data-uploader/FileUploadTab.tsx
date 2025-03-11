
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, DollarSign, PiggyBank, Wallet } from "lucide-react";

interface FileUploadTabProps {
  type: 'salary' | 'savings' | 'spending';
  fileRef: React.RefObject<HTMLInputElement>;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSampleData: () => void;
  title: string;
  icon: React.ReactNode;
}

const FileUploadTab = ({ 
  type, 
  fileRef, 
  onFileUpload, 
  onSampleData, 
  title, 
  icon 
}: FileUploadTabProps) => {
  return (
    <div className="space-y-4 transition-all duration-300 animate-scale-in">
      <div className="space-y-2">
        <Label htmlFor={`${type}-file`} className="text-base">Upload {title} Data</Label>
        <div className="flex gap-2">
          <Input
            id={`${type}-file`}
            type="file"
            accept=".csv"
            ref={fileRef}
            onChange={onFileUpload}
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
            onClick={onSampleData}
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
};

export default FileUploadTab;
