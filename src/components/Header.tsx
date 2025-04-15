
import React from 'react';
import { ShieldAlert } from 'lucide-react';

const Header = () => {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">Web Whisper</span>
        </div>
        <nav>
          <ul className="flex space-x-4 text-sm">
            <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
            <li><a href="#about" className="hover:text-primary transition-colors">About</a></li>
            <li><a href="#docs" className="hover:text-primary transition-colors">Documentation</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
