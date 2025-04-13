
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ScanFormProps {
  onScanComplete: (results: VulnerabilityResult[]) => void;
}

const ScanForm: React.FC<ScanFormProps> = ({ onScanComplete }) => {
  const [url, setUrl] = useState<string>('');
  const [scanning, setScanning] = useState<boolean>(false);
  const { toast } = useToast();

  const simulateScan = async () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }

    setScanning(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock vulnerability results
    const mockResults: VulnerabilityResult[] = [
      {
        id: '1',
        type: 'Stored XSS',
        description: 'Stored Cross-Site Scripting vulnerability detected in comment form',
        severity: 'critical',
        location: '/blog/comments',
        remediation: 'Implement input validation and output encoding. Filter out script tags and HTML special characters.',
        code: '<input type="text" name="comment" value="<%= raw comment %>">'
      },
      {
        id: '2',
        type: 'Reflected XSS',
        description: 'URL parameters are reflected without proper sanitization',
        severity: 'high',
        location: '/search?q=query',
        remediation: 'Sanitize all user inputs before displaying them in the response. Use context-aware encoding.',
        code: 'document.write("Search results for: " + location.search.split("=")[1]);'
      },
      {
        id: '3',
        type: 'DOM-based XSS',
        description: 'Client-side JavaScript manipulates DOM using unsafe data from URL fragments',
        severity: 'medium',
        location: '/profile#settings',
        remediation: 'Avoid using dangerous functions like innerHTML with untrusted data. Use textContent instead.',
        code: 'element.innerHTML = location.hash.substring(1);'
      },
      {
        id: '4',
        type: 'JavaScript Injection',
        description: 'User input is directly passed to eval()',
        severity: 'critical',
        location: '/calculator',
        remediation: 'Never use eval() with user-controlled input. Use safer alternatives like Function constructor or avoid dynamic code execution.',
        code: 'eval("calculate(" + userInput + ")");'
      },
      {
        id: '5',
        type: 'HTML Injection',
        description: 'User profile information is inserted into page without escaping HTML',
        severity: 'medium',
        location: '/profile',
        remediation: 'Escape HTML entities in user-provided content before inserting into the page.',
        code: 'profileDiv.innerHTML = userData.bio;'
      }
    ];

    setScanning(false);
    onScanComplete(mockResults);
    
    toast({
      title: "Scan Complete",
      description: `Found ${mockResults.length} potential vulnerabilities on ${url}`,
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 rounded-lg bg-card shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Enter Website URL to Scan</h2>
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-grow"
        />
        <Button 
          onClick={simulateScan} 
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
      <p className="text-xs text-muted-foreground mt-2">
        Note: This is a simulation. No actual scanning will be performed.
      </p>
    </div>
  );
};

export default ScanForm;
