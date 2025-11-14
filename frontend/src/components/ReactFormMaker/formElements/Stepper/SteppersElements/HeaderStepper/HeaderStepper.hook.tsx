import { useRef, useState } from 'react';
import useResizeObserver from '@react-hook/resize-observer';
import { useStepper } from '../../StepperContext';
import type { StepElement } from '../StepperContext.interface';

interface HeaderStepperReturn {
  /**
   * Reference to the stepper navigation element
   * @type {React.RefObject<HTMLDivElement>}
   * @default null
   */
  navRef: React.RefObject<HTMLDivElement>;
  /**
   * Reference to the steps elements in the stepper navigation
   * Used to calculate the height of the stepper navigation in vertical orientation
   * and determine the height of the stepper navigation in horizontal orientation
   * @type {React.MutableRefObject<(HTMLDivElement | null)[]>}
   * @default []
   */
  stepElements: React.MutableRefObject<(HTMLDivElement | null)[]>;
  /**
   * Array of step elements
   * @type {StepElement[]}
   */
  steps: StepElement[];
  /**
   * Orientation of the stepper defined in the StepperContext and passed to the HeaderStepper
   * @type {string}
   */
  orientation: string;
  /**
   * Size of the stepper navigation
   * Observed by the ResizeObserver to calculate the height and width of the stepper navigation
   * @type {SizeElement}
   */
  size: SizeElement;
}

export interface SizeElement {
  width: number;
  height: number;
}

/**
 * Hook to manage the stepper navigation element
 * @returns {HeaderStepperReturn}
 */
export function useHeaderStepper(): HeaderStepperReturn {
  const navRef = useRef<HTMLDivElement>(null);
  const stepElements = useRef<(HTMLDivElement | null)[]>([]);
  const { steps, orientation } = useStepper();
  const [size, setSize] = useState<SizeElement>({
    width: 0,
    height: 0,
  });

  const calculateNavHeight = () => {
    if (orientation === 'vertical') {
      const totalHeight: number = stepElements.current.reduce((sum, el) => {
        return sum + (el?.offsetHeight || 0) + 24;
      }, 0);
      return Math.floor(totalHeight);
    }
    const heights = stepElements.current
      .filter((el) => el !== null)
      .map((el) => el.offsetHeight || 150);

    if (heights.length === 0) {
      return 150;
    }

    const maxHeight: number = Math.max(...heights);
    return Math.floor(maxHeight);
  };

  function calculateNavWidth(entry: ResizeObserverEntry) {
    if (orientation === 'horizontal') {
      return entry.contentRect.width;
    }
    return 270;
  }

  if (typeof window !== 'undefined') {
    useResizeObserver(navRef, (entry) => {
      setSize({
        width: calculateNavWidth(entry),
        height: calculateNavHeight(),
      });
    });
  }

  return {
    navRef,
    stepElements,
    steps,
    orientation,
    size,
  };
}
