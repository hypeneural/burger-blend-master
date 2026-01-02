import { cn } from "@/lib/utils";

type AppStep = "home" | "customize" | "report";

const steps: { id: AppStep; label: string }[] = [
  { id: "home", label: "Escolher" },
  { id: "customize", label: "Customizar" },
  { id: "report", label: "Receita" },
];

interface StepperProps {
  current: AppStep;
  onStepChange?: (step: AppStep) => void;
}

export function Stepper({ current, onStepChange }: StepperProps) {
  const currentIndex = Math.max(
    0,
    steps.findIndex((step) => step.id === current),
  );

  return (
    <div className="sticky top-0 z-30 -mx-4 px-4 pt-4 pb-3 bg-background/90 backdrop-blur border-b border-border/60">
      <div className="flex items-center w-full">
        {steps.map((step, index) => {
          const isComplete = index < currentIndex;
          const isActive = index === currentIndex;
          const isClickable = index <= currentIndex;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <button
                type="button"
                onClick={() => isClickable && onStepChange?.(step.id)}
                className={cn(
                  "flex items-center gap-2 text-[11px] uppercase tracking-wide transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground",
                  isClickable ? "cursor-pointer" : "cursor-default",
                )}
                aria-current={isActive ? "step" : undefined}
              >
                <span
                  className={cn(
                    "h-6 w-6 rounded-full border-2 flex items-center justify-center text-[11px] font-semibold",
                    isActive || isComplete
                      ? "border-primary bg-primary text-primary-foreground shadow-warm"
                      : "border-border bg-card text-muted-foreground",
                  )}
                >
                  {index + 1}
                </span>
                <span>{step.label}</span>
              </button>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-2 h-0.5 flex-1 rounded-full",
                    isComplete ? "bg-primary" : "bg-border",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
