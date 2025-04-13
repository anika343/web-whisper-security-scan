
import React from 'react';
import { Shield } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full py-4 px-6 border-b bg-card">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary">Web Whisper</h1>
        </div>
        <div className="text-sm text-muted-foreground">
          XSS Vulnerability Scanner
        </div>
      </div>
    </header>
  );
};

export default Header;
