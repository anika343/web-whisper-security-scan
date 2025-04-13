
import React, { useState } from 'react';
import ScanForm from './ScanForm';
import VulnerabilityList from './VulnerabilityList';
import ScanStatus from './ScanStatus';

const Scanner: React.FC = () => {
  const [results, setResults] = useState<VulnerabilityResult[]>([]);
  const [scanning, setScanning] = useState<boolean>(false);
  const [scanComplete, setScanComplete] = useState<boolean>(false);

  const handleScanStart = () => {
    setScanning(true);
    setScanComplete(false);
    setResults([]);
  };

  const handleScanComplete = (scanResults: VulnerabilityResult[]) => {
    setResults(scanResults);
    setScanning(false);
    setScanComplete(true);
  };

  return (
    <div className="w-full flex flex-col gap-6 py-6">
      <ScanForm 
        onScanComplete={handleScanComplete}
      />
      
      {scanning && (
        <ScanStatus />
      )}
      
      {scanComplete && results.length > 0 && (
        <VulnerabilityList results={results} />
      )}
      
      {scanComplete && results.length === 0 && (
        <div className="text-center p-8 bg-green-50 rounded-lg border border-green-100">
          <h3 className="text-xl font-medium text-green-700">No Vulnerabilities Found!</h3>
          <p className="text-green-600 mt-2">Great news! No XSS vulnerabilities were detected.</p>
        </div>
      )}
    </div>
  );
};

export default Scanner;
