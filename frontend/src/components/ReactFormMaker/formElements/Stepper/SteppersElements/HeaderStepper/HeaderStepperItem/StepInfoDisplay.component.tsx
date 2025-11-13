// StepInfoDisplay.component.tsx
import { forwardRef } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import { Large, Muted } from '@/components/ui/Typography';

type StepInfoDisplayProps = {
  stepName: string;
  legend: string | undefined;
  orientation: string;
  maxWidth: number;
  opacityClass: string;
  positionTooltip: () => 'center' | 'start' | 'end';
};

const StepInfoDisplay = forwardRef<HTMLDivElement, StepInfoDisplayProps>(
  ({ stepName, legend, orientation, opacityClass, positionTooltip }, ref) => {
    return (
      <>
        {orientation === 'horizontal' ? (
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger disabled>
                <span className={`max-h-[72px] line-clamp-3 ${opacityClass}`}>
                  {stepName}
                </span>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                align={positionTooltip()}
                className="z-99 bg-[#000000FE] p-2 rounded-lg"
              >
                <Muted className="max-w-[200px] block ">{legend}</Muted>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <div className={opacityClass} ref={ref}>
            <Large className="text-md">{stepName}</Large>
            <Muted>{legend}</Muted>
          </div>
        )}
      </>
    );
  },
);

StepInfoDisplay.displayName = 'StepInfoDisplay';

export default StepInfoDisplay;
