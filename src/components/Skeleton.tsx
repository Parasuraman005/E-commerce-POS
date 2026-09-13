import React from "react";
import { motion } from "motion/react";

interface SkeletonProps {
  className?: string;
  variant?: "rect" | "circle" | "text" | "pill";
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = "", 
  variant = "rect", 
  width, 
  height 
}) => {
  const baseStyles = "bg-brand-bg relative overflow-hidden animate-pulse";
  
  const variantStyles = {
    rect: "rounded-lg",
    circle: "rounded-full",
    text: "rounded h-4 w-3/4",
    pill: "rounded-full h-8"
  };

  return (
    <div 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={{ width, height }}
    >
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite]" />
    </div>
  );
};

export const CardSkeleton = () => (
  <div className="bg-brand-white border border-brand-border rounded-[2.5rem] p-4 space-y-4">
    <Skeleton height={200} className="rounded-[2rem]" />
    <div className="space-y-2 px-1">
      <Skeleton variant="text" width="40%" />
      <Skeleton variant="text" width="80%" />
      <div className="flex items-center justify-between pt-2">
        <Skeleton variant="text" width="30%" />
        <Skeleton variant="circle" width={48} height={48} />
      </div>
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);
