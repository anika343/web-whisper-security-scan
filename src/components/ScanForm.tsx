
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Info, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { VulnerabilityResult } from '@/types/vulnerability';
import { scanWebsite } from '@/services/scannerService';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface ScanFormProps {
  onScanComplete: (results: VulnerabilityResult[]) => void;
  onScanStart: () => void;
}

const ScanForm: React.FC<ScanFormProps> = ({ onScanComplete, onScanStart }) => {
  const [url, setUrl] = useState<string>('');
  const [scanning, setScanning] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
    setErrorMessage(null);
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
        setErrorMessage(result.message || "Failed to scan the website");
        toast({
          title: "Scan Failed",
          description: "See details below for more information",
          variant: "destructive"
        });
        onScanComplete([]);
      }
    } catch (error) {
      console.error("Error during scan:", error);
      setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred");
      toast({
        title: "Scan Error",
        description: "See details below for more information",
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
          placeholder="http://localhost/mysite or http://localhost:8080"
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
      
      {errorMessage && (
        <Alert variant="destructive" className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Scan Failed</AlertTitle>
          <AlertDescription>
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="text-xs text-muted-foreground mt-4 space-y-1">
        <p>
          <Info className="inline h-3 w-3 mr-1" />
          The scanner works with both public websites and locally hosted sites (including XAMPP).
        </p>
        <p>
          <Info className="inline h-3 w-3 mr-1" />
          For XAMPP sites, enter URL as: <code className="bg-muted px-1 rounded">http://localhost/your-project</code>
        </p>
        
        <Accordion type="single" collapsible className="w-full mt-2">
          <AccordionItem value="cors-help">
            <AccordionTrigger className="text-xs py-1">
              XAMPP CORS Configuration Help
            </AccordionTrigger>
            <AccordionContent className="text-xs space-y-1">
              <p>If scanning fails, you need to enable CORS in your XAMPP server:</p>
              <ol className="list-decimal list-inside pl-2 space-y-1">
                <li>Find your Apache config in XAMPP (usually in <code className="bg-muted px-1 rounded">xampp/apache/conf/httpd.conf</code>)</li>
                <li>Add these lines at the end of the file:</li>
                <pre className="bg-muted p-2 rounded-md text-[10px] overflow-x-auto my-1">
{`<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET,POST,OPTIONS,DELETE,PUT"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization"
</IfModule>`}
                </pre>
                <li>Restart your Apache server</li>
              </ol>
              <p>Alternatively, add a <code className="bg-muted px-1 rounded">.htaccess</code> file to your web project with the same content.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default ScanForm;
