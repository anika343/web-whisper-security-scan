
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Info } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { VulnerabilityResult } from '@/types/vulnerability';
import { scanWebsite } from '@/services/scannerService';

interface ScanFormProps {
  onScanComplete: (results: VulnerabilityResult[]) => void;
  onScanStart: () => void;
}

const ScanForm: React.FC<ScanFormProps> = ({ onScanComplete, onScanStart }) => {
  const [url, setUrl] = useState<string>('');
  const [scanning, setScanning] = useState<boolean>(false);
  const { toast } = useToast();

  const handleScan = async () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }

    setScanning(true);
    onScanStart();
    
    try {
      const result = await scanWebsite(url);
      
      if (result.success) {
        toast({
          title: "Scan Complete",
          description: `Found ${result.vulnerabilities.length} potential vulnerabilities on ${url}`
        });
        onScanComplete(result.vulnerabilities);
      } else {
        toast({
          title: "Scan Failed",
          description: result.message || "Failed to scan the website",
          variant: "destructive"
        });
        onScanComplete([]);
      }
    } catch (error) {
      console.error("Error during scan:", error);
      toast({
        title: "Scan Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
      onScanComplete([]);
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 rounded-lg bg-card shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Enter Website URL to Scan</h2>
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          type="url"
          placeholder="https://example.com or http://localhost:3000"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-grow"
        />
        <Button 
          onClick={handleScan} 
          disabled={scanning || !url}
          className="min-w-[120px]"
        >
          {scanning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Scanning...
            </>
          ) : "Scan Now"}
        </Button>
      </div>
      <div className="text-xs text-muted-foreground mt-2 space-y-1">
        <p>
          <Info className="inline h-3 w-3 mr-1" />
          The scanner works with both public websites and locally hosted sites.
        </p>
        <p>
          <Info className="inline h-3 w-3 mr-1" />
          For local sites, CORS must be enabled on your development server.
        </p>
      </div>
    </div>
  );
};

export default ScanForm;
