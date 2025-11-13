import { Button } from '@/components/ui/button';
import React from 'react';
import { cn } from '@/lib/utils';
import { type ButtonProps } from 'react-day-picker';
import { useStepper } from '../StepperContext';

interface FooterStepperReactHookFormProps extends Omit<ButtonProps, 'variant'> {
  className?: string;
  variant?:
    | 'outline'
    | 'ghost'
    | 'default'
    | 'link'
    | 'destructive'
    | 'secondary'
    | null
    | undefined;
}

/**
 * ### FooterStepperReactHookForm Component
 *
 * The footer of the stepper is a component that allows you to navigate between the steps of the stepper.
 *
 * The footer is composed of two buttons:
 *  - The first button allows you to go back to the previous step.
 *  - The second button allows you to go to the next step.
 *
 * The footer is displayed at the bottom of the stepper.
 *
 * #### Behavior
 *
 *  - If the current step is the first step, the previous button is disabled.
 *  - If the previous step is disabled, the previous button is disabled.
 *  - If Steps is not valid, the next button is disabled.
 *  - If the current step is the last step, the next button is replaced by a submit button.
 */
const FooterStepperReactHookForm = React.forwardRef<
  HTMLButtonElement,
  FooterStepperReactHookFormProps
>(({ className = '', variant = 'default' }, ref) => {
  const {
    getFieldStatesBySteps,
    goNextStep,
    goPreviousStep,
    getCurrentStep,
    getNbSteps,
    getPreviousStep,
    getListenerObserver,
  } = useStepper();

  const step = getCurrentStep();

  function isLastStep() {
    return getCurrentStep().stepIndex === getNbSteps() - 1;
  }

  function hasPreviousButton() {
    const prevStep = getPreviousStep();
    if (getCurrentStep().stepIndex === 0) {
      return false;
    }
    if (prevStep?.disabledBefore && prevStep.isDone) {
      return false;
    }

    return true;
  }

  function formIsLoading(): boolean {
    return getListenerObserver(getCurrentStep().stepIndex) === 'loading';
  }

  return (
    <footer
      ref={ref}
      className={cn(
        'flex flex-col-reverse align-center sm:flex-row sm:justify-between transition-all duration-300',
        step.footerClassName,
      )}
    >
      {hasPreviousButton() ? (
        <Button
          className="w-full sm:w-auto mt-2"
          onClick={goPreviousStep}
          type="button"
          variant="secondary"
          disabled={formIsLoading()}
        >
          Previous
        </Button>
      ) : (
        <div />
      )}
      {isLastStep() ? (
        <Button
          className="w-full sm:w-auto mt-2"
          type="submit"
          disabled={!getFieldStatesBySteps().isValidStep || formIsLoading()}
        >
          {step.buttonNextContent ? step.buttonNextContent : 'Previous'}
        </Button>
      ) : (
        <Button
          className="w-full sm:w-auto mt-2"
          onClick={goNextStep}
          type="button"
          disabled={!getFieldStatesBySteps().isValidStep || formIsLoading()}
          variant={variant}
        >
          {step.buttonNextContent ? step.buttonNextContent : 'Next'}
        </Button>
      )}
      {step?.additionalButtons}
    </footer>
  );
});

FooterStepperReactHookForm.displayName = 'FooterStepperReactHookForm';

export default FooterStepperReactHookForm;
