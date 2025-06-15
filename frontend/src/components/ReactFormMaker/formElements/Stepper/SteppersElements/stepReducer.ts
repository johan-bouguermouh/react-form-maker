import { CompositeField } from '@/components/ReactFormMaker/interfaces/FieldInterfaces';
import { isStepReactFormMaker } from '@/components/ReactFormMaker/utils/typeGuards/compositeField.TypeGuards';
import { StepElement } from './StepperContext.interface';

type TypeReducerActionNames =
  | 'CHANGE_FOCUS'
  | 'SET_DONE'
  | 'REMOVE_DONE'
  | 'SET_STRICT_DISABLED_EFFECT'
  | 'SET_BETFORE_DISABLED_EFFECT';

type ActionType = {
  type: TypeReducerActionNames;
  currentStepIndex?: number;
};

export function setStrictDisabledEffect(state: StepElement[]): StepElement[] {
  const disabledAfterBy: string[] = [];

  return state.map((step: StepElement) => {
    const newStep = {
      ...step,
      subjectedStrictSteps: [...disabledAfterBy],
      isdisabled:
        disabledAfterBy.length > 0 ||
        step.subjectedDisabledBeforeSteps.length > 0,
    };
    if (step.isStrict && !step.isDone) {
      disabledAfterBy.push(step.stepName);
    }
    return newStep;
  });
}

export function setDisabledBeforeEffect(state: StepElement[]): StepElement[] {
  const disabledBeforeBy: string[] = [];

  const currentStates = state.map((step: StepElement) => {
    return step;
  });

  const newStates = currentStates.reverse().map((step: StepElement) => {
    const newStep = {
      ...step,
      subjectedDisabledBeforeSteps: [...disabledBeforeBy],
      isdisabled:
        disabledBeforeBy.length > 0 ||
        step.subjectedStrictSteps.length > 0 ||
        (step.disabledBefore !== undefined &&
          step.disabledBefore === true &&
          step.isDone),
    };
    if (step.disabledBefore && step.isDone) {
      disabledBeforeBy.push(step.stepName);
    }
    return newStep;
  });

  return newStates.reverse();
}

export function initialSteps(formfields: CompositeField[]): StepElement[] {
  const currentForm: StepElement[] = formfields
    .filter((field) => isStepReactFormMaker(field))
    .map((step, index) => ({
      ...step,
      stepIndex: index,
      isDone: false,
      isCurrent: index === 0,
      isNext: index === 1,
      isdisabled: false,
      subjectedStrictSteps: [],
      subjectedDisabledBeforeSteps: [],
    }));

  const currentFormWithStrictEffect = setStrictDisabledEffect(currentForm);
  return setDisabledBeforeEffect(currentFormWithStrictEffect);
}

const stepReducer = (
  state: StepElement[],
  action: ActionType,
): StepElement[] => {
  switch (action.type) {
    case 'SET_STRICT_DISABLED_EFFECT':
      return setStrictDisabledEffect(state);

    case 'SET_BETFORE_DISABLED_EFFECT':
      return setDisabledBeforeEffect(state);

    case 'CHANGE_FOCUS':
      return state.map((step, index) => {
        if (action.currentStepIndex === undefined) {
          throw new Error(
            'currentStepIndex is required for CHANGE_FOCUS action',
          );
        }
        if (index === action.currentStepIndex) {
          return {
            ...step,
            isCurrent: true,
            isNext: false,
          };
        }
        if (index === action.currentStepIndex + 1) {
          return {
            ...step,
            isNext: true,
            isCurrent: false,
          };
        }
        return {
          ...step,
          isCurrent: false,
          isNext: false,
        };
      });
    case 'SET_DONE':
      return state.map((step, index) => {
        if (index === action.currentStepIndex) {
          return {
            ...step,
            isDone: true,
          };
        }
        return step;
      });
    case 'REMOVE_DONE':
      return state.map((step, index) => {
        if (index === action.currentStepIndex) {
          return {
            ...step,
            isDone: false,
          };
        }
        return step;
      });
    default:
      return state;
  }
};

export default stepReducer;
