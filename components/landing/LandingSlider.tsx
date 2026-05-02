"use client";

import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LandingSliderProps {
  children: React.ReactNode;
  className?: string;
  itemClassName?: string;
  showArrows?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function LandingSlider({
  children,
  className,
  itemClassName,
  showArrows = true,
  autoPlay = false,
  autoPlayInterval = 5000
}: LandingSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const childrenCount = React.Children.count(children);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);

      // Calculate active index for dots
      const index = Math.round(scrollLeft / (clientWidth || 1));
      setActiveIndex(index);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth, scrollLeft, scrollWidth } = scrollRef.current;
      
      if (direction === "right" && scrollLeft + clientWidth >= scrollWidth - 10) {
        // Loop back to start
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else if (direction === "left" && scrollLeft <= 10) {
        // Loop to end
        scrollRef.current.scrollTo({ left: scrollWidth, behavior: "smooth" });
      } else {
        const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    checkScroll();
    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", checkScroll);
    }
    window.addEventListener("resize", checkScroll);

    // AutoPlay logic
    let interval: NodeJS.Timeout;
    if (autoPlay && childrenCount > 1 && !isPaused) {
      interval = setInterval(() => {
        scroll("right");
      }, autoPlayInterval);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", checkScroll);
      }
      window.removeEventListener("resize", checkScroll);
      if (interval) clearInterval(interval);
    };
  }, [children, autoPlay, autoPlayInterval, childrenCount, isPaused]);



  return (
    <div 
      className="relative group/slider w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Navigation Arrows - Desktop only by default, visible on hover */}
      {showArrows && childrenCount > 1 && (
        <>
          <div
            className={cn(
              "absolute -left-4 top-1/2 -translate-y-1/2 z-20 transition-all duration-300 opacity-0 group-hover/slider:opacity-100 hidden lg:block",
              !showLeftArrow && "pointer-events-none scale-90 !opacity-0"
            )}
          >
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-md border-border/50 shadow-xl hover:bg-primary hover:text-primary-foreground transition-all"
              onClick={(e) => {
                e.preventDefault();
                scroll("left");
              }}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>

          <div
            className={cn(
              "absolute -right-4 top-1/2 -translate-y-1/2 z-20 transition-all duration-300 opacity-0 group-hover/slider:opacity-100 hidden lg:block",
              !showRightArrow && "pointer-events-none scale-90 !opacity-0"
            )}
          >
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-md border-border/50 shadow-xl hover:bg-primary hover:text-primary-foreground transition-all"
              onClick={(e) => {
                e.preventDefault();
                scroll("right");
              }}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </>
      )}

      <div
        ref={scrollRef}
        className={cn(
          "flex w-full snap-x snap-mandatory gap-6 overflow-x-auto pb-8 pt-4 scrollbar-hidden sm:grid sm:grid-cols-3 sm:overflow-x-visible sm:pb-0 sm:pt-0",
          className
        )}
      >
        {React.Children.map(children, (child) => (
          <div className={cn("min-w-[85vw] snap-center sm:min-w-0 h-full", itemClassName)}>
            {child}
          </div>
        ))}
      </div>

      {/* Enhanced Scroll indicator for mobile */}
      {childrenCount > 1 && (
        <div className="mt-4 flex justify-center gap-2 sm:hidden">
          {React.Children.map(children, (_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                activeIndex === i ? "w-6 bg-primary" : "w-2 bg-primary/20"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
