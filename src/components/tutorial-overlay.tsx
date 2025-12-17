'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAttihc } from '@/hooks/use-attihc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { createPortal } from 'react-dom';
import { logger } from '@/lib/logger';

type TutorialStep = {
  targetId?: string;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
};

const STEPS: TutorialStep[] = [
  {
    title: "Welcome to ATTIHC",
    description: "Your distraction-free daily planner. Let's take a quick tour to help you get the most out of your day.",
    position: "center"
  },
  {
    targetId: "focus",
    title: "Focus Word",
    description: "Set a single intention for your day. Keep it short and powerful.",
    position: "bottom"
  },
  {
    targetId: "remember",
    title: "Daily Pillars",
    description: "Track what you must remember, complete, and avoid. These are your non-negotiables.",
    position: "bottom"
  },
  {
    targetId: "scratch",
    title: "Scratchpad",
    description: "A place for quick thoughts and temporary notes that don't belong anywhere else.",
    position: "top"
  },
  {
    title: "Customize Your Layout",
    description: "You can drag and drop any card to reorganize your dashboard exactly how you like it.",
    position: "center"
  },
  {
    title: "All Set!",
    description: "You're ready to start. Remember, consistency is key.",
    position: "center"
  }
];

export function TutorialOverlay() {
  const { settings, completeTutorial, setTutorialStep } = useAttihc();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const missingTargetRef = useRef<string | null>(null);

  useEffect(() => {
    setMounted(true);
    // Sync local state with persisted settings if available
    if (settings.tutorialStep !== undefined) {
      setCurrentStepIndex(settings.tutorialStep);
    }
  }, [settings.tutorialStep]);

  // Check if tutorial should run
  const shouldRun = mounted && settings.tutorialCompleted === false && !isDismissed;

  useEffect(() => {
    if (shouldRun) {
      setShouldRender(true);
      // Small delay to trigger transition
      const timer = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(timer);
    } else {
      setIsVisible(false);
      // Wait for animation to finish before unmounting
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [shouldRun]);

  const currentStep = STEPS[currentStepIndex] || STEPS[0];

  const updateRect = useCallback(() => {
    if (currentStep.targetId) {
      const element = document.querySelector(`[data-tutorial-id="${currentStep.targetId}"]`);
      if (element) {
        missingTargetRef.current = null;
        const newRect = element.getBoundingClientRect();
        // Only update if changed significantly to avoid jitter
        setRect(prev => {
          if (!prev) return newRect;
          if (
            Math.abs(prev.top - newRect.top) < 1 &&
            Math.abs(prev.left - newRect.left) < 1 &&
            Math.abs(prev.width - newRect.width) < 1 &&
            Math.abs(prev.height - newRect.height) < 1
          ) {
            return prev;
          }
          return newRect;
        });
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        if (missingTargetRef.current !== currentStep.targetId) {
          missingTargetRef.current = currentStep.targetId;
          try {
            logger.warn("[tutorial] target not found", {
              targetId: currentStep.targetId,
              step: currentStepIndex,
            });
          } catch {}
        }
        // Fallback if target not found
        setRect(null);
      }
    } else {
      setRect(null);
    }
  }, [currentStep.targetId, currentStepIndex]);

  useEffect(() => {
    if (!shouldRun) return;
    
    // Update rect immediately and on resize/scroll
    updateRect();
    const timer = setTimeout(updateRect, 100); // Wait for layout
    
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
    };
  }, [shouldRun, currentStepIndex, updateRect]);

  const dismiss = useCallback(
    (action: "finish" | "close") => {
      setIsDismissed(true);
      setIsVisible(false);
      try {
        if (action === "finish") {
          window.dispatchEvent(new CustomEvent("attihc:tutorial:completed"));
        } else {
          window.dispatchEvent(new CustomEvent("attihc:tutorial:dismissed"));
        }
      } catch {}
      try {
        completeTutorial();
      } catch (error) {
        try {
          logger.error("[tutorial] complete failed", { error, action, step: currentStepIndex });
        } catch {}
      }
    },
    [completeTutorial, currentStepIndex]
  );

  const handleNext = useCallback(() => {
    if (currentStepIndex < STEPS.length - 1) {
      const nextStep = currentStepIndex + 1;
      setCurrentStepIndex(nextStep);
      try {
        setTutorialStep(nextStep);
      } catch (error) {
        try {
          logger.error("[tutorial] set step failed", { error, nextStep });
        } catch {}
      }
      try {
        logger.info("[tutorial] step viewed", { step: nextStep });
      } catch {}
      return;
    }

    try {
      logger.info("[tutorial] finished", { step: currentStepIndex });
    } catch {}
    dismiss("finish");
  }, [currentStepIndex, setTutorialStep, dismiss]);

  const handlePrev = useCallback(() => {
    if (currentStepIndex > 0) {
      const prevStep = currentStepIndex - 1;
      setCurrentStepIndex(prevStep);
      try {
        setTutorialStep(prevStep);
      } catch (error) {
        try {
          logger.error("[tutorial] set step failed", { error, prevStep });
        } catch {}
      }
    }
  }, [currentStepIndex, setTutorialStep]);

  const handleClose = useCallback(() => {
    try {
      logger.info("[tutorial] closed", { step: currentStepIndex });
    } catch {}
    dismiss("close");
  }, [dismiss, currentStepIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!shouldRun) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          e.stopPropagation();
          handleClose();
          break;
        case 'ArrowRight':
        case 'Enter':
          e.preventDefault();
          handleNext();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handlePrev();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shouldRun, handleNext, handlePrev, handleClose]);

  if (!shouldRender) return null;

  // Calculate position styles
  const getPopoverStyle = () => {
    if (!rect || currentStep.position === 'center') {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        position: 'fixed' as const,
        zIndex: 100,
        maxWidth: '90vw',
        width: '400px'
      };
    }

    const gap = 16;
    const width = 340;
    
    let top = 0;
    let left = 0;

    // Viewport dimensions
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    switch (currentStep.position) {
      case 'top':
        top = rect.top - gap;
        left = rect.left + (rect.width / 2) - (width / 2);
        break;
      case 'bottom':
        top = rect.bottom + gap;
        left = rect.left + (rect.width / 2) - (width / 2);
        break;
      case 'left':
        top = rect.top + (rect.height / 2);
        left = rect.left - width - gap;
        break;
      case 'right':
        top = rect.top + (rect.height / 2);
        left = rect.right + gap;
        break;
    }

    // Smart positioning adjustments (keep within viewport)
    // Horizontal
    if (left < 10) left = 10;
    if (left + width > vw - 10) left = vw - width - 10;

    // Vertical
    const estimatedHeight = 200; // Approximate height of card
    if (top < 10) {
      // If clipping top, flip to bottom if possible
      if (currentStep.position === 'top') top = rect.bottom + gap;
      else top = 10;
    }
    if (top + estimatedHeight > vh - 10) {
       // If clipping bottom, flip to top if possible
       if (currentStep.position === 'bottom') top = rect.top - gap - estimatedHeight; // Naive flip, needs exact height
       // Better: clamp
       top = Math.min(top, vh - estimatedHeight - 10);
    }
    
    return {
      top,
      left,
      position: 'fixed' as const,
      width: `${width}px`,
      zIndex: 100,
      transform: currentStep.position === 'top' ? 'translateY(-100%)' : 
                 (currentStep.position === 'left' || currentStep.position === 'right') ? 'translateY(-50%)' : 'none'
    };
  };

  return createPortal(
    <div 
      className={`fixed inset-0 z-50 pointer-events-auto transition-opacity duration-300 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      aria-live="polite"
    >
      {/* High-contrast Backdrop - visible when no spotlight */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300 ${rect ? 'opacity-0' : 'opacity-100'}`} 
      />

      {/* Spotlight effect - provides its own backdrop via shadow */}
      {rect && (
        <div 
          className="absolute border-2 border-primary rounded-lg transition-all duration-300 box-content shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] animate-pulse"
          style={{
            top: rect.top - 4,
            left: rect.left - 4,
            width: rect.width + 8,
            height: rect.height + 8,
            pointerEvents: 'none',
            zIndex: 60 
          }}
        />
      )}

      {/* Dialog */}
      <Card 
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutorial-title"
        aria-describedby="tutorial-desc"
        className="shadow-2xl border-2 border-primary bg-card p-6 flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-300"
        style={getPopoverStyle()}
      >
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                Step {currentStepIndex + 1} of {STEPS.length}
              </span>
            </div>
            <h3 id="tutorial-title" className="text-xl font-serif font-bold text-foreground">
              {currentStep.title}
            </h3>
            <p id="tutorial-desc" className="text-base text-muted-foreground leading-relaxed">
              {currentStep.description}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 -mr-2 -mt-2 text-muted-foreground hover:text-foreground shrink-0 rounded-full hover:bg-muted"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleClose();
            }}
            aria-label="Close tutorial"
          >
            <X size={18} />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handlePrev();
            }}
            disabled={currentStepIndex === 0}
            className="w-24 min-h-[44px]"
          >
            <ChevronLeft size={16} className="mr-1" /> Back
          </Button>
          
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleNext();
            }}
            className="w-24 min-h-[44px] font-medium"
          >
            {currentStepIndex === STEPS.length - 1 ? (
              <>Finish <Check size={16} className="ml-1" /></>
            ) : (
              <>Next <ChevronRight size={16} className="ml-1" /></>
            )}
          </Button>
        </div>
      </Card>
    </div>,
    document.body
  );
}
