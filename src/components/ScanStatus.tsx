
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, Search } from 'lucide-react';

const ScanStatus: React.FC = () => {
  const [progress, setProgress] = React.useState(0);
  const [currentStep, setCurrentStep] = React.useState(0);
  
  const steps = [
    { name: 'Analyzing page structure', icon: <Search className="h-5 w-5 mr-2" /> },
    { name: 'Checking input fields', icon: <AlertTriangle className="h-5 w-5 mr-2" /> },
    { name: 'Scanning script content', icon: <Shield className="h-5 w-5 mr-2" /> }
  ];

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          return 100;
        }
        const newProgress = oldProgress + 1;
        
        // Update current step based on progress
        if (newProgress < 30) setCurrentStep(0);
        else if (newProgress < 70) setCurrentStep(1);
        else setCurrentStep(2);
        
        return newProgress;
      });
    }, 30);

    return () => {
      clearTimeout(timer);
    };
  }, [progress]);

  return (
    <div className="w-full max-w-3xl mx-auto p-6 rounded-lg bg-card shadow-sm border-t-4 border-primary">
      <h3 className="text-lg font-medium mb-2">Scanning in progress...</h3>
      
      <div className="security-scanning-animation relative rounded-md bg-muted/50 p-4 mb-4">
        <div className="scan-line animate-scan-line"></div>
        <div className="flex items-center text-primary animate-pulse-scan">
          {steps[currentStep].icon}
          <span>{steps[currentStep].name}</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Scan progress</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  );
};

export default ScanStatus;
