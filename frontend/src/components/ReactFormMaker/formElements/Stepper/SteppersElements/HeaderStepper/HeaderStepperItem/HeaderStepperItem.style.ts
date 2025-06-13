// HeaderStepperItem.style.ts
import { cn } from '@/lib/utils';

interface StyleProps {
  isdisabled: boolean;
  isCurrent: boolean;
  isDone: boolean;
  currentStepIndex: number;
  stepIndex: number;
  orientation: string;
}

class HeaderStepperItemStyle {
  opacityClass: string;
  cursorClass: string;
  barProgressClass: string;
  stepDirectionContainerClass: string;
  positionLabelClass: string;
  progressBarPositionClass: string;

  constructor(props: StyleProps) {
    this.opacityClass = cn(
      'opacity-60', // Default opacity
      {
        'opacity-80': props.isDone,
        'opacity-100': props.isCurrent,
        'opacity-40': props.isdisabled,
      },
    );

    this.cursorClass = cn({
      'cursor-not-allowed': props.isdisabled,
      'cursor-pointer': !props.isdisabled,
    });

    this.barProgressClass = cn({
      'bg-primary': props.currentStepIndex > props.stepIndex,
      'bg-gray-200': props.currentStepIndex <= props.stepIndex,
    });

    this.stepDirectionContainerClass = cn({
      'flex flex-col items-center justify-center mx-2 relative w-8 h-8 z-10':
        props.orientation === 'horizontal',
      'flex flex-row relative': props.orientation !== 'horizontal',
    });

    this.positionLabelClass = cn({
      'w-1 h-8 text-center absolute top-0 transform translate-y-[32px] flex flex-col h-24':
        props.orientation === 'horizontal',
      'text-start absolute top-0 transform translate-x-[32px] flex flex-col h-24':
        props.orientation !== 'horizontal',
    });

    this.progressBarPositionClass = cn({
      'flex-1 h-0.5': props.orientation === 'horizontal',
      'flex-1 w-0.5 ml-3': props.orientation !== 'horizontal',
    });
  }
}

export default HeaderStepperItemStyle;
