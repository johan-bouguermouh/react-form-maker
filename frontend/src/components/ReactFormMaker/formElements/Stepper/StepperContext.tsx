import React from 'react';
import { UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { CompositeField } from '../../interfaces/FieldInterfaces';
import {
  isFieldReactFormMaker,
  isStepReactFormMaker,
} from '../../utils/typeGuards/compositeField.TypeGuards';
import stepReducer, { initialSteps } from './SteppersElements/stepReducer';
import { z } from 'zod';
import {
  orientationMutable,
  StepElement,
  StepFormState,
  StepperContextProps,
} from './SteppersElements/StepperContext.interface';
import { usePromiseObserver } from '@/lib/usePromiseObserver';
import { CommandManager } from '@/lib/commandManager';

let bounced = 0;

const StepperContext = React.createContext<
  StepperContextProps<any> | undefined
>(undefined);

function extractFieldNamesFromStep(
  step: CompositeField,
  FieldNames: string[] = [],
): string[] {
  if (step.fields && step.fields.length > 0) {
    step.fields.forEach((field) => {
      if (isFieldReactFormMaker(field)) {
        FieldNames.push(field.inputName);
      } else {
        extractFieldNamesFromStep(field, FieldNames);
      }
    });
  }
  return FieldNames;
}

/**
 * ### Stepper Provider
 *
 * The `StepperProvider` component is a component that allows you to manage the state of the stepper.
 * This Provider is used specifically for the stepper in the form.
 *
 * ---
 *
 * #### Proprieties to pass
 *
 * - `children`: used to display the children of the component
 * - `form`: used to manage the form state inside each step
 * - `formfields`:  used to manage the steps and the rendering of the form
 * - `zObject`:  used to manage the validation of the form
 * - `orientation`: used to manage the orientation of the stepper (default: 'horizontal')
 *
 * ---
 *
 * For more information, see the {@link StepperProvider} interface or the {@link StepperContextProps} interface
 * @param param0
 * @returns
 */
export const StepperProvider = <T extends FieldValues>({
  children,
  form,
  formfields,
  zObject,
  orientation = 'horizontal',
}: {
  children: React.ReactNode;
  form: UseFormReturn<T>;
  formfields: CompositeField[];
  orientation?: 'vertical' | 'horizontal';
  zObject: { [key in keyof T]: z.ZodType<T[key], z.ZodTypeDef, T[key]> };
}) => {
  const [stepIndex, setStepIndex] = React.useState<number>(0);
  const [orientationMutable, setOrientationMutable] =
    React.useState<orientationMutable>({ orientation, isOriginal: true });

  const onBeforeNextStepMapper = React.useMemo(() => {
    return formfields
      .filter((field) => isStepReactFormMaker(field))
      .reduce(
        (acc, step) => {
          if (step.onBeforeNextStep) {
            acc[step.stepName] = step.onBeforeNextStep;
          }
          return acc;
        },
        {} as {
          [key: string]: (data: {
            submissionState: StepFormState<T>;
            form: UseFormReturn<T>;
          }) => Promise<boolean>;
        },
      );
  }, [formfields]);

  const handlersObserver = usePromiseObserver<
    {
      submissionState: StepFormState<T>;
      form: UseFormReturn<T>;
    },
    boolean
  >(onBeforeNextStepMapper);

  const inputsNamesBySteps: string[][] = React.useMemo(() => {
    return formfields.map((stepField) => {
      return extractFieldNamesFromStep(stepField);
    });
  }, [formfields]);

  const [steps, dispatch] = React.useReducer(
    stepReducer,
    formfields,
    initialSteps,
  );

  const getFieldStatesBySteps = (
    index: number = stepIndex,
  ): StepFormState<T> => {
    const StepFormState: StepFormState<T> = {
      isValidStep: true,
      fieldStatesDetails: {},
    };
    const currentInputsNames = inputsNamesBySteps[index] as Path<T>[];
    currentInputsNames.forEach((inputName) => {
      let isValid = false;
      const value = form.getValues(inputName);
      const fiedState = form.getFieldState(inputName);
      const zField = zObject[inputName];

      const { invalid, isDirty } = fiedState;
      const fieldHasValue: boolean = value !== undefined;
      const fieldIsNullable: boolean = zField.isNullable();
      const fieldIsOptional: boolean = zField.isOptional();
      if (fieldIsOptional || fieldIsNullable) {
        isValid = isDirty ? !invalid : true;
      } else {
        isValid = isDirty ? !invalid : fieldHasValue;
      }
      const keyName = inputName as string;
      if (!isValid) {
        StepFormState.isValidStep = false;
      }
      StepFormState.fieldStatesDetails[keyName] = {
        isValid,
        value,
        FieldState: fiedState,
        zField,
      };
    });

    return StepFormState;
  };

  React.useEffect(() => {
    dispatch({ type: 'CHANGE_FOCUS', currentStepIndex: stepIndex });
  }, [stepIndex]);

  const triggeringFormStep = async (
    currentStepIndex: number,
  ): Promise<boolean> => {
    const inputsNames = inputsNamesBySteps[currentStepIndex] as Path<T>[];
    return await form.trigger(inputsNames);
  };

  const executeStepCompletion = async (currentStepIndex: number) => {
    const dispachQueue = new CommandManager({
      dispatch,
      stepIndex: currentStepIndex,
    });

    dispachQueue.addCommands([
      {
        name: 'setDone',
        command: async ({ dispatch, stepIndex }) => {
          dispatch({ type: 'SET_DONE', currentStepIndex: stepIndex });
          return { success: true };
        },
      },
      {
        name: 'setStrictDisabledEffect',
        command: async ({ dispatch }) => {
          dispatch({ type: 'SET_STRICT_DISABLED_EFFECT' });
          return { success: true };
        },
      },
      {
        name: 'setBeforeDisabledEffect',
        command: async ({ dispatch }) => {
          dispatch({ type: 'SET_BETFORE_DISABLED_EFFECT' });
          return { success: true };
        },
      },
    ]);
    await dispachQueue.execute();
  };

  const getNbSteps = () => steps.length;

  const getCurrentStep = () => steps[stepIndex];

  const goToStep = async (newStepIndex: number) => {
    if (stepIndex === newStepIndex) {
      return;
    } else if (steps[newStepIndex].isdisabled) {
      return;
    } else if (stepIndex > newStepIndex) {
      setStepIndex(newStepIndex);
      return;
    }
    triggeringFormStep(stepIndex).then((isValid) => {
      if (isValid) {
        executeStepCompletion(stepIndex).then(() => {
          setStepIndex(newStepIndex);
        });
      } else {
        dispatch({ type: 'REMOVE_DONE', currentStepIndex: stepIndex });
      }
    });
  };

  const goNextStep = (): void => {
    triggeringFormStep(stepIndex).then((isValid) => {
      if (isValid) {
        if (steps[stepIndex].onBeforeNextStep) {
          const submissionState = getFieldStatesBySteps();
          const data = {
            submissionState,
            form,
          };
          handlersObserver.execute(steps[stepIndex].stepName, data);
          steps[stepIndex].onBeforeNextStep(data).then((isSwitch: boolean) => {
            if (isSwitch) {
              executeStepCompletion(stepIndex).then(() => {
                setStepIndex(stepIndex + 1);
              });
            }
          });
        } else {
          executeStepCompletion(stepIndex).then(() => {
            setStepIndex(stepIndex + 1);
          });
        }
      } else {
        dispatch({ type: 'REMOVE_DONE', currentStepIndex: stepIndex });
      }
    });
  };

  const goPreviousStep = (): void => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  const getPreviousStep = (): StepElement | undefined => {
    if (stepIndex > 0) {
      return steps[stepIndex - 1];
    }
    return undefined;
  };

  const getNextStep = (): StepElement | undefined => {
    if (stepIndex < steps.length - 1) {
      return steps[stepIndex + 1];
    }
    return undefined;
  };

  const shiftOrientation = (width: number): void => {
    const { orientation: currentOrientation, isOriginal } = orientationMutable;
    if (width < 640) {
      if (currentOrientation === 'vertical' && isOriginal) {
        setOrientationMutable({ orientation: 'horizontal', isOriginal: false });
      }
    } else if (currentOrientation === 'horizontal' && !isOriginal) {
      setOrientationMutable({ orientation: 'vertical', isOriginal: true });
    }
  };

  const getListenerObserver = (
    index: number,
  ): 'idle' | 'loading' | 'resolved' | 'rejected' => {
    const { stepName } = steps[index];
    return handlersObserver.listener(stepName);
  };

  return (
    <StepperContext.Provider
      value={{
        steps,
        getNbSteps,
        getCurrentStep,
        goToStep,
        goNextStep,
        goPreviousStep,
        form: form as UseFormReturn<T>,
        getFieldStatesBySteps,
        getPreviousStep,
        getNextStep,
        stepIndex,
        orientation: orientationMutable.orientation,
        shiftOrientation,
        getListenerObserver,
      }}
    >
      {children}
    </StepperContext.Provider>
  );
};

/**
 * ### Stepper Context Hook
 *
 * Hook to use the stepper context in a functional component of stepper components
 *
 * @returns StepperContextProps
 *
 * ---
 *
 * Must be used within a StepperProvider
 *
 * ---
 *
 * For more information, see the {@link StepperContextProps} interface
 */
export const useStepper = <T extends FieldValues>() => {
  const context = React.useContext(
    StepperContext as React.Context<StepperContextProps<T> | undefined>,
  );
  if (!context) {
    throw new Error('useStepper must be used within a StepperProvider');
  }
  return context;
};
