import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useStepper } from '../StepperContext';

/**
 * ### StepperContent Component
 *
 * The `StepperContent` component is a component that allows you to display the content of the stepper.
 * Here, the content of the stepper is displayed in a horizontal way. A slider is used to display the content of the stepper.
 *
 * ---
 *
 * #### Behavior
 *
 * - Position of the slider is updated when the step index changes.
 * - The slider is translated by the percentage of the step index.
 * - First Div is the container of the slider in overflow hidden (don't show the content outside the container).
 */
const StepperContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const { stepIndex, getNbSteps } = useStepper();

  useEffect(() => {
    const newPos = stepIndex * 100;
    sliderRef.current?.style.setProperty(
      'transform',
      `translateX(-${newPos}%)`,
    );
  }, [stepIndex]);

  return (
    <div ref={ref} className="overflow-hidden flex-auto">
      <div
        ref={sliderRef}
        className={cn(
          'flex',
          `w-[${getNbSteps() * 100}%]`,
          'transition-transform',
          'duration-300',
          'transform',
          'ease-in-out',
          className,
        )}
        {...props}
      />
    </div>
  );
});
StepperContent.displayName = 'StepperContent';

export { StepperContent };
