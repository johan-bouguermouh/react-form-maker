import React, { type ReactNode, useEffect } from 'react';
import type { FieldValues } from 'react-hook-form';
import useResizeObserver from '@react-hook/resize-observer';
import { cn } from '@/lib/utils';
import { useStepper } from '../StepperContext';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
interface StepperProps<T extends FieldValues> {
  children: ReactNode;
}
/**
 * ### Stepper Component
 *
 * The `Stepper` component is a component that allows you to display the stepper.
 *
 * ---
 *
 * #### Behavior
 *  > _Becarfull ! Orientation define the orientation of navigation stepper_
 *
 * - The orientation of the stepper is updated when the width of the container changes.
 * - The orientation of the stepper is horizontal by default.
 * - The orientation of the stepper is horizontal when the width of the container is less than 768px.
 *
 * ---
 *
 *
 * @param param0
 * @returns
 */
function Stepper<T extends FieldValues>({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & StepperProps<T>) {
  const { orientation: stepperOrientation, shiftOrientation } = useStepper();
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [cnOrientation, setCnOrientation] =
    React.useState<string>(' flex flex-row');

  useResizeObserver(wrapperRef, (entry) => {
    shiftOrientation(entry.contentRect.width);
  });

  useEffect(() => {
    if (stepperOrientation === 'horizontal') {
      setCnOrientation(' flex flex-col gap-4');
    } else {
      setCnOrientation(' flex flex-row');
    }
  }, [stepperOrientation]);

  return (
    <div
      ref={wrapperRef}
      className={cn('relative ', props.className) + cnOrientation}
    >
      {children}
    </div>
  );
}

export { Stepper };
