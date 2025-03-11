
import { ArrowRight, TrendingUp, PiggyBank, LineChart } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative overflow-hidden px-6 py-16 md:py-24 lg:py-32 z-0">
      {/* Background Elements */}
      <div className="absolute inset-0 z-[-1] bg-gradient-radial from-blue-50 to-transparent opacity-70" />
      <div className="absolute inset-0 z-[-1] bg-noise opacity-40" />
      
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-blue-100/70 text-blue-800 text-sm font-medium backdrop-blur-sm">
          <TrendingUp className="w-4 h-4 mr-2" />
          <span>Track your financial growth</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 motion-safe:animate-fade-in">
          Salary Increment Analyzer
        </h1>
        
        <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed motion-safe:animate-fade-in" style={{ animationDelay: "200ms" }}>
          Upload your monthly salary, savings, and spending data to track your financial progress
          and compare it with inflation rates for meaningful insights.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 motion-safe:animate-fade-in" style={{ animationDelay: "400ms" }}>
          <FeatureCard 
            icon={<TrendingUp className="w-6 h-6 text-blue-500" />}
            title="Track Growth"
            description="Monitor how your income is growing over time"
          />
          <FeatureCard 
            icon={<LineChart className="w-6 h-6 text-purple-500" />}
            title="Beat Inflation"
            description="See the real value of your money against inflation"
          />
          <FeatureCard 
            icon={<PiggyBank className="w-6 h-6 text-green-500" />}
            title="Optimize Savings"
            description="Get insights to improve your savings strategy"
          />
        </div>
        
        <a 
          href="#upload-section" 
          className="inline-flex items-center gap-2 px-6 py-3 text-white bg-blue-600 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl motion-safe:animate-fade-in" 
          style={{ animationDelay: "600ms" }}
        >
          Get Started
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) => {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-lg border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 p-3 rounded-full bg-gray-50">
          {icon}
        </div>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
};

export default Hero;
