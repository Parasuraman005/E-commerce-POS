import React, { useState } from "react";
import { Skeleton } from "./Skeleton";

interface BrandedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackIcon?: React.ReactNode;
}

export const BrandedImage: React.FC<BrandedImageProps> = ({ 
  src, 
  alt, 
  className, 
  fallbackIcon,
  ...props 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <Skeleton className="absolute inset-0 z-10" />
      )}
      
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-brand-bg text-brand-text-secondary">
          {fallbackIcon || <span className="text-[10px] font-bold uppercase tracking-widest">Asset Missing</span>}
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          referrerPolicy="no-referrer"
          {...props}
        />
      )}
    </div>
  );
};
