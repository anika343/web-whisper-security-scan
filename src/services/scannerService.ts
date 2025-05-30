
import { VulnerabilityResult } from "@/types/vulnerability";

interface ScanResponse {
  vulnerabilities: VulnerabilityResult[];
  success: boolean;
  message?: string;
}

export async function scanWebsite(url: string, bypassCorsProxy: boolean = false): Promise<ScanResponse> {
  try {
    // Step 1: Validate and format URL
    let targetUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      targetUrl = 'http://' + url; // Default to http:// for local development
    }

    // Step 2: Determine if it's a local URL
    const isLocalUrl = targetUrl.includes('localhost') || 
                       targetUrl.includes('127.0.0.1') || 
                       targetUrl.match(/^https?:\/\/\d+\.\d+\.\d+\.\d+/) ||
                       targetUrl.includes('xampp');

    // Step 3: Fetch website content
    let response;
    let responseData;
    
    if (isLocalUrl || bypassCorsProxy) {
      try {
        // Direct fetch for local URLs (will work if CORS is enabled on local server)
        // or when user chooses to bypass CORS proxy
        response = await fetch(targetUrl, {
          method: 'GET',
          headers: {
            'Accept': 'text/html',
          },
        });
      } catch (error) {
        return {
          success: false,
          message: isLocalUrl 
            ? "Cannot access local server. Make sure CORS is enabled on your XAMPP server. See the notes below for configuration help."
            : "Cannot access the website directly. The site may have CORS restrictions. Try disabling the 'Bypass CORS proxy' option.",
          vulnerabilities: []
        };
      }
    } else {
      // Use CORS proxy for public websites
      const corsProxy = "https://corsproxy.io/?";
      const proxyUrl = `${corsProxy}${encodeURIComponent(targetUrl)}`;
      
      try {
        response = await fetch(proxyUrl, {
          method: 'GET',
          headers: {
            'Accept': 'text/html',
          },
        });
        
        // Check for JSON response which might indicate an error
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
          
          // Check for specific error messages
          if (responseData.error) {
            if (responseData.error.code === 403) {
              return {
                success: false,
                message: "The CORS proxy is currently blocked in your region. Try enabling the 'Bypass CORS proxy' option above, or use a local development server instead.",
                vulnerabilities: []
              };
            }
            
            return {
              success: false,
              message: `CORS proxy error: ${responseData.error.message || "Unknown error"}`,
              vulnerabilities: []
            };
          }
        }
      } catch (error) {
        return {
          success: false,
          message: "Failed to connect to the CORS proxy. Please try enabling the 'Bypass CORS proxy' option above, or scan a local website.",
          vulnerabilities: []
        };
      }
    }

    if (!response.ok) {
      return {
        success: false,
        message: `Failed to fetch website: ${response.status} ${response.statusText}. Please check the URL and try again.`,
        vulnerabilities: []
      };
    }

    // Get the HTML content (if we haven't already parsed it as JSON)
    const htmlContent = responseData ? JSON.stringify(responseData) : await response.text();
    
    // Analyze for XSS vulnerabilities
    const vulnerabilities = analyzeForXssVulnerabilities(htmlContent, targetUrl);
    
    return {
      success: true,
      vulnerabilities
    };
  } catch (error) {
    console.error("Scan error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
      vulnerabilities: []
    };
  }
}

function analyzeForXssVulnerabilities(html: string, url: string): VulnerabilityResult[] {
  const vulnerabilities: VulnerabilityResult[] = [];
  const vulnerabilityId = Date.now().toString();
  
  // Check for reflected inputs in forms
  const formRegex = /<form[^>]*>([\s\S]*?)<\/form>/gi;
  let formMatch;
  let formIndex = 0;
  
  while ((formMatch = formRegex.exec(html)) !== null) {
    const formContent = formMatch[1];
    const inputRegex = /<input[^>]*>/gi;
    let inputMatch;
    
    while ((inputMatch = inputRegex.exec(formContent)) !== null) {
      const inputTag = inputMatch[0];
      
      // Check for unsanitized inputs
      if (inputTag.includes('type="text"') || inputTag.includes("type='text'") || 
          inputTag.includes('type="search"') || inputTag.includes("type='search'")) {
        if (!inputTag.includes('pattern=') && !formContent.includes('encodeURIComponent') && !formContent.includes('escapeHTML')) {
          vulnerabilities.push({
            id: `${vulnerabilityId}-form-${formIndex}`,
            type: 'Potential XSS in Form',
            description: 'Form input without proper validation or sanitization',
            severity: 'medium',
            location: `${url} - Form Input`,
            remediation: 'Add input validation with pattern attribute or implement server-side sanitization. Use DOMPurify or similar libraries to sanitize user input.',
            code: inputTag
          });
        }
      }
      formIndex++;
    }
  }
  
  // Check for inline JavaScript with document.write
  const documentWriteRegex = /document\.write\s*\(([^)]+)\)/gi;
  let documentWriteMatch;
  let documentWriteIndex = 0;
  
  while ((documentWriteMatch = documentWriteRegex.exec(html)) !== null) {
    const documentWriteContent = documentWriteMatch[0];
    
    // Check if document.write uses variables or dynamic content
    if (documentWriteContent.includes('location.') || 
        documentWriteContent.includes('window.') || 
        documentWriteContent.includes('document.') ||
        documentWriteContent.includes('$') ||
        documentWriteContent.includes('"+') || 
        documentWriteContent.includes("'+")) {
      vulnerabilities.push({
        id: `${vulnerabilityId}-docwrite-${documentWriteIndex}`,
        type: 'Reflected XSS',
        description: 'Potentially unsafe use of document.write with dynamic content',
        severity: 'high',
        location: `${url} - Inline Script`,
        remediation: 'Avoid using document.write with dynamic content. Use safer alternatives like textContent or createElement.',
        code: documentWriteContent
      });
      documentWriteIndex++;
    }
  }
  
  // Check for eval usage
  const evalRegex = /eval\s*\(([^)]+)\)/gi;
  let evalMatch;
  let evalIndex = 0;
  
  while ((evalMatch = evalRegex.exec(html)) !== null) {
    vulnerabilities.push({
      id: `${vulnerabilityId}-eval-${evalIndex}`,
      type: 'Dangerous JavaScript',
      description: 'Use of eval() which can execute arbitrary code',
      severity: 'critical',
      location: `${url} - JavaScript`,
      remediation: 'Avoid using eval() entirely. Use safer alternatives such as Function constructor or JSON.parse() for JSON data.',
      code: evalMatch[0]
    });
    evalIndex++;
  }
  
  // Check for innerHTML assignments
  const innerHTMLRegex = /\.innerHTML\s*=\s*([^;]+)/gi;
  let innerHTMLMatch;
  let innerHTMLIndex = 0;
  
  while ((innerHTMLMatch = innerHTMLRegex.exec(html)) !== null) {
    const innerHTMLContent = innerHTMLMatch[0];
    
    if (innerHTMLContent.includes('location.') || 
        innerHTMLContent.includes('window.') || 
        innerHTMLContent.includes('document.') ||
        innerHTMLContent.includes('$') ||
        innerHTMLContent.includes('"+') || 
        innerHTMLContent.includes("'+")) {
      vulnerabilities.push({
        id: `${vulnerabilityId}-innerhtml-${innerHTMLIndex}`,
        type: 'DOM-based XSS',
        description: 'Potentially unsafe use of innerHTML with dynamic content',
        severity: 'high',
        location: `${url} - JavaScript`,
        remediation: 'Use textContent instead of innerHTML, or sanitize input with DOMPurify before using innerHTML.',
        code: innerHTMLContent
      });
      innerHTMLIndex++;
    }
  }
  
  // Check for missing Content-Security-Policy header
  if (!html.includes('<meta http-equiv="Content-Security-Policy"')) {
    vulnerabilities.push({
      id: `${vulnerabilityId}-csp`,
      type: 'Missing Security Headers',
      description: 'No Content Security Policy (CSP) found',
      severity: 'medium',
      location: `${url} - Headers`,
      remediation: 'Add a Content-Security-Policy meta tag or HTTP header to restrict which resources can be loaded.',
      code: '<meta http-equiv="Content-Security-Policy" content="default-src \'self\'">'
    });
  }
  
  return vulnerabilities;
}
