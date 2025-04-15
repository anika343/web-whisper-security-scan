
import React from 'react';
import { Heart, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card border-t py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground flex items-center">
            Built with <Heart className="h-4 w-4 text-security-critical mx-1" /> and security in mind
          </p>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <a 
              href="https://github.com/example/web-whisper" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-4 w-4 mr-1" />
              GitHub
            </a>
            
            <span className="text-sm text-muted-foreground">
              Version 1.0.0
            </span>
          </div>
        </div>
        
        <div className="mt-4 text-center text-xs text-muted-foreground">
          <p>Web Whisper is for educational purposes only. Always consult with a security professional for thorough assessments.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
