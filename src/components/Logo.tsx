import { useState, useEffect } from 'react';
import logoLong from '@/assets/logo-long.png';
import { removeBackground, loadImage } from '@/utils/backgroundRemoval';

const Logo = () => {
  const [processedLogoUrl, setProcessedLogoUrl] = useState<string>(logoLong);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const processLogo = async () => {
      try {
        setIsProcessing(true);
        
        // Fetch the original logo
        const response = await fetch(logoLong);
        const blob = await response.blob();
        
        // Load as image element
        const imgElement = await loadImage(blob);
        
        // Remove background
        const processedBlob = await removeBackground(imgElement);
        
        // Create URL for the processed image
        const processedUrl = URL.createObjectURL(processedBlob);
        setProcessedLogoUrl(processedUrl);
        
        setIsProcessing(false);
      } catch (error) {
        console.error('Failed to process logo:', error);
        setIsProcessing(false);
        // Keep original logo on error
      }
    };

    processLogo();
  }, []);

  return (
    <div className="w-full flex justify-center py-4 bg-background">
      {isProcessing ? (
        <div className="h-36 w-auto flex items-center">
          <div className="text-muted-foreground">Processing logo...</div>
        </div>
      ) : (
        <img 
          src={processedLogoUrl} 
          alt="Complete Controller" 
          className="h-36 w-auto" 
        />
      )}
    </div>
  );
};

export default Logo;
