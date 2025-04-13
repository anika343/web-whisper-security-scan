
import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full py-4 border-t">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center">
        <div className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Web Whisper Security Scanner
        </div>
        <div className="text-sm text-muted-foreground mt-2 sm:mt-0">
          For educational purposes only. No actual scanning is performed.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
