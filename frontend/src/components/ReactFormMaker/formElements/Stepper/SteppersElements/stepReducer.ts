import { CompositeField } from '@/components/ReactFormMaker/interfaces/FieldInterfaces';
import { StepElement } from './StepperContext.interface';
import { isStepReactFormMaker } from '@/components/ReactFormMaker/utils/typeGuards/compositeField.TypeGuards';

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

export function setStrictDisabledEffect(state: StepElement[]): StepElement[] {
  let disabledAfterBy: string[] = [];

  return state.map((step: StepElement, index: number) => {
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
  let disabledBeforeBy: string[] = [];

  const currentStates = state.map((step: StepElement, index: number) => {
    return step;
  });

  const newStates = currentStates
    .reverse()
    .map((step: StepElement, index: number) => {
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

let boudary = 0;

const stepReducer = (state: StepElement[], action: any): StepElement[] => {
  switch (action.type) {
    case 'SET_STRICT_DISABLED_EFFECT':
      return setStrictDisabledEffect(state);

    case 'SET_BETFORE_DISABLED_EFFECT':
      return setDisabledBeforeEffect(state);

    case 'CHANGE_FOCUS':
      return state.map((step, index) => {
        if (index === action.currentStepIndex) {
          return {
            ...step,
            isCurrent: true,
            isNext: false,
          };
        } else if (index === action.currentStepIndex + 1) {
          return {
            ...step,
            isNext: true,
            isCurrent: false,
          };
        } else {
          return {
            ...step,
            isCurrent: false,
            isNext: false,
          };
        }
      });
    case 'SET_DONE':
      return state.map((step, index) => {
        if (index === action.currentStepIndex) {
          return {
            ...step,
            isDone: true,
          };
        } else {
          return step;
        }
      });
    case 'REMOVE_DONE':
      return state.map((step, index) => {
        if (index === action.currentStepIndex) {
          return {
            ...step,
            isDone: false,
          };
        } else {
          return step;
        }
      });
    default:
      return state;
  }
};

export default stepReducer;
