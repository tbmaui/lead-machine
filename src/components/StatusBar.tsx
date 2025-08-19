import { useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";
import { Check } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Status = 'pending' | 'processing' | 'searching' | 'enriching' | 'completed' | 'failed';

interface StatusBarProps {
  status: Status;
  progress: number; // 0..100
  steps?: string[];
}

export function StatusBar({ status, progress, steps }: StatusBarProps) {
  const safeProgress = Math.max(0, Math.min(100, progress));
  const prefersReducedMotion = useReducedMotion();
  const animated = useAnimatedNumber(safeProgress, prefersReducedMotion ? 0 : 600, prefersReducedMotion);

  const currentLabel = useMemo(() => {
    if (status === 'failed') return 'Error encountered';
    if (status === 'completed') return 'Completed';
    if (status === 'searching') return 'Searching for companies and contacts...';
    if (status === 'enriching') return 'Enriching and verifying contact data...';
    if (status === 'processing') return 'Processing...';
    return 'Initializing search parameters...';
  }, [status]);

  const currentStepIndex = useMemo(() => {
    if (!steps || steps.length === 0) return 0;
    const idx = Math.min(Math.floor((safeProgress / 100) * steps.length), steps.length - 1);
    return idx;
  }, [safeProgress, steps]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm" aria-live="polite" aria-atomic>
        <span className="text-muted-foreground">Overall Progress</span>
        <span className="font-medium">{animated}%</span>
      </div>
      <Progress
        value={animated}
        className={cn("h-4")}
        aria-label="Lead generation progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={animated}
      />
      <div className="text-sm text-muted-foreground" aria-live="polite" aria-atomic>
        {currentLabel}
      </div>

      {steps && steps.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
          {steps.map((label, idx) => {
            const isDone = idx < currentStepIndex;
            const isActive = idx === currentStepIndex && status !== 'completed' && status !== 'failed';
            const isFuture = idx > currentStepIndex;

            const stepSize = 100 / steps.length;
            const stepStart = idx * stepSize;
            const stepEnd = (idx + 1) * stepSize;
            const withinStep = Math.min(Math.max((safeProgress - stepStart) / (stepEnd - stepStart), 0), 1);

            return (
              <div
                key={idx}
                className={cn(
                  "relative p-3 rounded-md transition-all duration-300 will-change-transform",
                  isActive && "neu-raised scale-[1.01]",
                  isDone && "neu-flat opacity-95",
                  isFuture && "neu-base opacity-85"
                )}
                aria-current={isActive ? "step" : undefined}
              >
                <div className="flex items-center gap-2 text-sm">
                  <div
                    className={cn(
                      "w-2.5 h-2.5 rounded-full",
                      isActive && "bg-primary animate-pulse",
                      isDone && "bg-green-500",
                      isFuture && "bg-muted-foreground/40"
                    )}
                    aria-hidden
                  />
                  <span className={cn("transition-colors", isActive && "font-medium")}>{label}</span>
                  {isDone && <Check className="ml-auto h-4 w-4 text-green-600 opacity-90 transition-opacity" />}
                </div>

                {/* micro per-step progress strip */}
                <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-md overflow-hidden" aria-hidden>
                  <div
                    className={cn(
                      "h-full transition-[width] duration-300",
                      isDone && "bg-green-500/70",
                      isActive && "bg-primary/70",
                      isFuture && "bg-muted/60"
                    )}
                    style={{ width: `${isDone ? 100 : isActive ? withinStep * 100 : 0}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default StatusBar;


