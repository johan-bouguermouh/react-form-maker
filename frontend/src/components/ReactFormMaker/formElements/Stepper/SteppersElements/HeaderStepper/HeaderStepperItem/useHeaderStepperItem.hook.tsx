// useHeaderStepperItem.hook.ts
import { useCallback, useRef, useImperativeHandle, createElement } from 'react';
import HeaderStepperItemStyle from './HeaderStepperItem.style';
import { useStepper } from '@/components/ReactFormMaker/formElements/Stepper/StepperContext';
import { Circle, CircleCheck, CircleDashed, CircleDotIcon } from 'lucide-react';
import { type SizeElement } from '../HeaderStepper.hook';
import { type StepElement } from '../../StepperContext.interface';

interface UseHeaderStepperItemProps {
  step: StepElement;
  index: number;
  size: SizeElement;
  ref: React.Ref<HTMLDivElement>;
}

export function useHeaderStepperItem({
  step,
  size,
  ref,
}: UseHeaderStepperItemProps) {
  const { stepName, stepIndex, legend, isNext, isDone, isdisabled, isCurrent } =
    step;

  const { getCurrentStep, steps, goToStep, orientation, getListenerObserver } =
    useStepper();

  const localRef = useRef<HTMLDivElement | null>(null);
  useImperativeHandle(ref, () => localRef.current as HTMLDivElement);

  const styleProps = {
    isdisabled,
    isCurrent,
    isDone,
    currentStepIndex: getCurrentStep().stepIndex,
    stepIndex,
    orientation,
  };

  const styles = new HeaderStepperItemStyle(styleProps);

  const isLastStep = useCallback(
    () => stepIndex === steps.length - 1,
    [stepIndex, steps.length],
  );

  const maxWidth =
    size.width > 0 ? Math.floor(size.width / steps.length - 12) : 150;

  const icon = useCallback(() => {
    if (step.IconStep) {
      return createElement(step.IconStep, { className: styles.opacityClass });
    }
    if (isCurrent) return <CircleDotIcon className={styles.opacityClass} />;
    if (isDone) return <CircleCheck className={styles.opacityClass} />;
    if (isdisabled) return <CircleDashed className={styles.opacityClass} />;
    if (isNext) return <Circle className={styles.opacityClass} />;
    return <Circle className={styles.opacityClass} />;
  }, [isCurrent, isDone, isNext, isdisabled, styles.opacityClass]);

  const ajustHeightProgressBar = () => {
    if (orientation === 'horizontal') return { height: '1px' };
    const heightBar =
      localRef.current !== null
        ? {
            'min-height': localRef.current.offsetHeight.toString() + 'px',
            'max-height': localRef.current.offsetHeight.toString() + 'px',
          }
        : { flex: 1 };
    return heightBar;
  };

  const positionTooltip = (): 'start' | 'end' | 'center' => {
    if (orientation === 'horizontal') {
      if (stepIndex === 0) return 'start';
      if (stepIndex === steps.length - 1) return 'end';
      return 'center';
    }
    return 'start';
  };

  const infoShouldBeDisplayed = (maxWidth: number) => {
    if (orientation === 'horizontal') return maxWidth > 80;
    return true;
  };

  function formIsLoading(): boolean {
    return getListenerObserver(getCurrentStep().stepIndex) === 'loading';
  }

  return {
    stepName,
    legend,
    isLastStep,
    localRef,
    styles,
    maxWidth,
    icon,
    ajustHeightProgressBar,
    positionTooltip,
    infoShouldBeDisplayed,
    goToStep,
    orientation,
    formIsLoading,
  };
}
