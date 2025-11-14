import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStepper } from '../StepperContext';

const StepperItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { getListenerObserver, stepIndex } = useStepper();
  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        'min-w-0 shrink-0 grow-0 basis-full px-4 relative',
        className,
      )}
      {...props}
    >
      {getListenerObserver(stepIndex) === 'loading' && (
        <div className="flex justify-center items-center w-full backdrop-brightness-[110%] h-full absolute z-10 backdrop-blur-[2px]  bg-[#ffffff66] transition-all duration-300">
          <Loader2 size={32} className="animate-spin" />
        </div>
      )}
      {props.children}
    </div>
  );
});
StepperItem.displayName = 'StepperItem';

export { StepperItem };
