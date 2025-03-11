
import React from 'react';

interface DataSummaryCardProps {
  title: string;
  icon: React.ReactNode;
  data: any[];
  dataPoints: number;
}

const DataSummaryCard = ({ title, icon, data, dataPoints }: DataSummaryCardProps) => {
  return (
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
};

export default DataSummaryCard;
