
import React from 'react';
import Header from '@/components/Header';
import Scanner from '@/components/Scanner';
import Footer from '@/components/Footer';
import { ShieldAlert, Shield, ShieldCheck } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4">
        <div className="py-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            Web Whisper Security Scanner
          </h1>
          <p className="mt-2 text-xl text-muted-foreground max-w-2xl mx-auto">
            Detect XSS vulnerabilities in your web applications
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-4xl mx-auto">
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <div className="flex justify-center mb-4">
                <ShieldAlert className="h-10 w-10 text-security-critical" />
              </div>
              <h2 className="text-lg font-semibold mb-2">Detect Vulnerabilities</h2>
              <p className="text-muted-foreground text-sm">
                Identify potential XSS security issues in your web application before attackers do.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <div className="flex justify-center mb-4">
                <Shield className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-lg font-semibold mb-2">Assess Risk Levels</h2>
              <p className="text-muted-foreground text-sm">
                Understand the severity of each vulnerability with clear risk classifications.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <div className="flex justify-center mb-4">
                <ShieldCheck className="h-10 w-10 text-security-low" />
              </div>
              <h2 className="text-lg font-semibold mb-2">Fix Security Issues</h2>
              <p className="text-muted-foreground text-sm">
                Get remediation guidance to effectively address and resolve detected vulnerabilities.
              </p>
            </div>
          </div>
        </div>
        
        <Scanner />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
