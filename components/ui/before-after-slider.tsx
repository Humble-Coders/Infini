"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ArrowLeftRight } from "lucide-react";
import { cn } from "@/components/ui/utils";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  alt: string;
  className?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  alt,
  className,
  beforeLabel = "Raw / As-built",
  afterLabel = "MMP Treated",
}: BeforeAfterSliderProps) {
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Starting at 50%
  const [position, setPosition] = useState(50);
  
  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    
    setPosition(percent);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsResizing(false);
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      handleMove(e.clientX);
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!isResizing) return;
      handleMove(e.touches[0].clientX);
    };

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div 
      ref={containerRef}
      className={cn("relative w-full h-full overflow-hidden select-none cursor-ew-resize group touch-none", className)}
      onMouseDown={(e) => {
        setIsResizing(true);
        handleMove(e.clientX);
      }}
      onTouchStart={(e) => {
        setIsResizing(true);
        handleMove(e.touches[0].clientX);
      }}
    >
      {/* After image (background) */}
      <div className="absolute inset-0 w-full h-full">
        <Image 
          src={afterImage} 
          alt={`${alt} (After)`} 
          fill 
          sizes="(min-width: 1024px) 1200px, 100vw" 
          className="object-cover pointer-events-none" 
        />
        <div className="absolute bottom-4 right-4 z-10 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full font-mono text-[10px] tracking-widest text-white uppercase border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {afterLabel}
        </div>
      </div>

      {/* Before image (foreground) */}
      <div 
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        {/* The image itself must be fixed to the container width so it crops instead of squishing */}
        <div className="absolute inset-y-0 left-0 w-full h-full" style={{ width: containerRef.current ? containerRef.current.clientWidth + "px" : "100vw" }}>
          <Image 
            src={beforeImage} 
            alt={`${alt} (Before)`} 
            fill 
            sizes="(min-width: 1024px) 1200px, 100vw" 
            className="object-cover pointer-events-none filter brightness-75 contrast-125 sepia-[0.15] saturate-0" 
          />
        </div>
        <div className="absolute bottom-4 left-4 z-10 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full font-mono text-[10px] tracking-widest text-white uppercase border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {beforeLabel}
        </div>
      </div>

      {/* Slider handle */}
      <div 
        className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-10 bg-white rounded-full flex items-center justify-center shadow-lg text-accent hover:scale-110 transition-transform pointer-events-auto">
          <ArrowLeftRight className="size-5" strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
}
