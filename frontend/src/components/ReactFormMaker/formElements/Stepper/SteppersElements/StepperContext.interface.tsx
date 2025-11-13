import type { FieldError, FieldValues, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import type { ReactFormMakerStep } from '../../../interfaces/FieldInterfaces';

/**
 * **Define the structure of a field state in the stepper context**
 *
 * _Cette interface résume l'état d'un champs selon le formContext de React Hook Form_
 */
export interface FieldState<T> {
  /**
   * @type {boolean}
   *
   * **Define if the field is valid**
   *
   * _The valid state is a boolean that indicates if React Hook Form considers the field to be valid.
   * More explicitly, it is the result of the validation of the field by the zod schema._
   */
  invalid: boolean;

  /**
   * @type {boolean}
   *
   * **Define if the field is dirty**
   * _The dirty state is a boolean that indicates if the field has been modified by the user._
   */
  isDirty: boolean;

  /**
   * @type {boolean}
   *
   * **Define if the field is touched**
   * _The touched state is a boolean that indicates if the field has been touched by the user._
   */
  isTouched: boolean;

  /**
   * @type {boolean}
   *
   * **Define if the field is validating**
   *
   * _The validating state is a boolean that indicates if the field is currently being validated by the zod schema._
   */
  isValidating: boolean;

  /**
   * @type {FieldError | undefined}
   *
   * **Define the error of the field**
   *
   * _The error state is an object that contains the error message if the field is invalid._
   * _If the field is valid, the error state is undefined._
   * _The error message is the message returned by the zod schema if the field is invalid._
   *
   * @see {@link FieldError}
   */
  error?: FieldError | undefined;
}

/**
 * **Define the structure of a field state detail in the stepper context for each fields**
 *
 * _This interface summarizes the state of a field according to the formContext of React Hook Form_
 */
export interface FieldStatesDetail<T> {
  /**
   * @type {boolean}
   *
   * **Defines whether the field is considered valid as a whole.**
   *
   * _The fluctuation of this value is arbitrary and depends on whether the original field has optional or nullable attributes._
   */
  isValid: boolean;

  /**
   * @type {any}
   *
   * **Value of the field**
   *
   * _The value of the field is the value entered by the user in the field._
   * _This value can be the default value applied by the program._
   */
  value: any;

  /**
   * @type {FieldState<T>}
   *
   * **State of the field**
   *
   * _Allows you to obtain more details about the reason for the isValid state_
   *
   * @see {@link FieldState}
   */
  FieldState: FieldState<T>;

  /**
   * @type {z.ZodType<T>}
   *
   * **Zod schema of the field**
   *
   * _The zod schema of the field is the schema used to validate the field._
   *
   * @see {@link z.ZodType}
   */
  zField: z.ZodType<T>;
}

/**
 * **Define the structure of a step form state in the stepper context**
 *
 * This interface brings together all the status of the fields that make it up. It provides a general overview of form status, as well as precise details on the status of each form.
 */
export interface StepFormState<T> {
  /**
   * @type {boolean}
   *
   * **Define if the step is valid**
   *
   * _The isValidStep state defines whether the step is considered valid as a whole._
   *
   * _This state is a general synthesis of all the fields that make it up. It is true if all fields are considered valid._
   *
   * ---
   *
   * > **Warning**: this state does not ensure that nullable or optional fields are in a dirty state.
   */
  isValidStep: boolean;

  /**
   * @type {FieldStatesDetail<T>[]}
   *
   * **Details of the fields of the step**
   *
   * _The fieldStatesDetails state is a list of all the fields that make up the step, with their respective states._
   *
   * ---
   *
   * @see {@link FieldStatesDetail}
   */
  fieldStatesDetails: { [key: string]: FieldStatesDetail<T> };
}

/**
 * **Define the structure of a step element in the stepper context**
 *
 * _Step Element is a representation of a step, it contains all the information needed to manage the step and its fields_
 * _Here states could be managed to know if the step is done, current, next, disabled, subjected to strict effect or subjected to disabled effect_
 *
 * ---
 *
 * @param {number} stepIndex - The index of the step in the stepper
 * @param {boolean} isDone - The state of the step, if it is done or not
 * @param {boolean} isCurrent - The state of the step, if it is the current step or not
 * @param {boolean} isNext - The state of the step, if it is the next step or not
 * @param {boolean} isdisabled - The state of the step, if it is disabled or not
 * @param {string[]} subjectedStrictSteps - list of other steps that block this step due to their strict effect
 * @param {string[]} subjectedDisabledBeforeSteps - list of other steps that block this step due to their constraint effect after their respective submission: “disabledBefore state”.
 *
 * ---
 *
 * @extends {ReactFormMakerStep}
 * @see {@link ReactFormMakerStep}
 */
export interface StepElement extends ReactFormMakerStep {
  /**
   * @type {number}
   *
   * **Indexation of the step in the stepper**
   *
   * _Index is incremented by 1 for each step_
   *
   * _Index starts at 0_
   *
   */
  stepIndex: number;
  /**
   * @type {boolean}
   *
   * **Define if the step is done**
   * The isDone state defines whether the part of the form it contains, as well as each step field, has been filled in and defined as correct.
   *
   * _The state can change when one of the fields has been changed and returns an error, or when the next step is taken (a partial submission is then executed)._
   */
  isDone: boolean;
  /**
   * @type {boolean}
   *
   * **Define if the step is the current step**
   *
   * The isCurrent state defines whether the step is the one currently displayed in the stepper.
   *
   * _This field is used to follow the step displayed on the screen when the carousel is slid._
   */
  isCurrent: boolean;

  /**
   * @type {boolean}
   *
   * **Define if the step is the next step**
   *
   * The isNext state defines whether the step is the next step to be displayed in the stepper.
   *
   * _This field is used to follow the step displayed on the screen when the carousel is slid._
   */
  isNext: boolean;

  /**
   * @type {boolean}
   *
   * **Define if the step is disabled**
   *
   * The isDisabled state is an overview of whether the step can be consulted by the user.
   * The isDisabled state depends on its default state, but can also be forced by adjacent steps (preceding or following)
   *
   *_see next two properties_.
   */
  isdisabled: boolean;

  /**
   * @type {string[]}
   *
   * **List of other steps that block this step due to their strict effect**
   *
   * The subjectedStrictSteps state is a list of other steps that block this step due to their strict effect.
   *
   *  _If the table contains at least one value, the step is considered disabled._
   */
  subjectedStrictSteps: string[];

  /**
   * @type {string[]}
   *
   * **List of other steps that block this step due to their constraint effect after their respective submission: “disabledBefore state”**
   *
   * The subjectedDisabledBeforeSteps state is a list of other steps that block this step due to their constraint effect after their respective submission: “disabledBefore state”.
   *
   * _If the table contains at least one value, the step is considered disabled._
   */
  subjectedDisabledBeforeSteps: string[];
}

/**
 * **Stepper Context to manage the steps of a form in a stepper components**
 *
 * _The stepper context is a context that allows you to manage the steps of a form in a stepper._
 *
 * ---
 *
 * @param {StepElement[]} steps - List of steps
 * @param {() => number} getNbSteps - Get the number of steps in the stepper
 * @param {() => StepElement} getCurrentStep - Get the current step in the stepper
 * @param {(stepIndex: number) => void} goToStep - Go to a specific step in the stepper
 * @param {() => void} goNextStep - Go to the next step in the stepper
 * @param {() => void} goPreviousStep - Go to the previous step in the stepper
 * @param {UseFormReturn<T>} form - Access the form context of React Hook Form
 * @param {() => StepFormState<T>} getFieldStatesBySteps - Get the state of the fields of the form according to the steps
 * @param {() => StepElement | undefined} getPreviousStep - Get the previous step in the stepper
 * @param {() => StepElement | undefined} getNextStep - Get the next step in the stepper
 * @param {number} stepIndex - Index of the current step in the stepper
 * @param {'vertical' | 'horizontal'} orientation - orientation of the stepper
 * @param {(width: number) => void} shiftOrientation - Shift the orientation of the stepper
 *
 */
export interface StepperContextProps<T extends FieldValues> {
  /**
   * @type {StepElement[]}
   *
   * **List of steps**
   *
   * _The steps state is a list of all the steps that make up the form._
   *
   * For more information :  {@link StepElement}
   */
  steps: StepElement[];

  /**
   * **Get the number of steps in the stepper**
   *
   * @returns {number}
   */
  getNbSteps: () => number;
  /**
   * ** Get the current step in the stepper**
   * @returns {StepElement}
   *
   * For more informations see : {@link StepElement}
   */
  getCurrentStep: () => StepElement;

  /**
   * **Go to a specific step in the stepper**
   *
   * _handle the transition between steps_
   *
   * @param {number} stepIndex - The index of the step in the stepper
   *
   * @returns {void}
   */
  goToStep: (stepIndex: number) => void;

  /**
   * **Go to the next step in the stepper**
   *
   * _handle the transition between steps by incrementing the step index_
   *
   * @returns {void}
   */
  goNextStep: () => void;

  /**
   * **Go to the previous step in the stepper**
   *
   * _handle the transition between steps by decrementing the step index_
   *
   * @returns {void}
   */
  goPreviousStep: () => void;

  /**
   * **Access the form context of React Hook Form**
   *
   * _ Used to manage the form and its fields_
   *
   * @type {UseFormReturn<T>}
   *
   * For more informations see : {@link UseFormReturn}
   */
  form: UseFormReturn<T>;

  /**
   * **Get the state of the fields of the form according to the steps**
   *
   * _Used to manage the form and its fields whene the step form has presubmitted_
   *
   * @returns {StepFormState<T>}
   * For more informations see : {@link StepFormState}
   */
  getFieldStatesBySteps: (stepIndex?: number) => StepFormState<T>;

  /**
   * **Get the previous step in the stepper**
   *
   * _Is used for control management between different step states if there are causal links between_
   *
   * @returns {StepElement | undefined}
   * For more informations see : {@link StepElement}
   */
  getPreviousStep: () => StepElement | undefined;

  /**
   * **Get the next step in the stepper**
   *
   * _Is used for control management between different step states if there are causal links between_
   * @returns {StepElement | undefined}
   */
  getNextStep: () => StepElement | undefined;

  /**
   * @type {number}
   *
   * **Index of the current step in the stepper**
   */
  stepIndex: number;

  /**
   * @type {'vertical' | 'horizontal'}
   *
   * **orientation of the stepper**
   *
   * _Becarful, the orientation is mutable_
   *
   * _The orientation state is a string that indicates the orientation of the stepper._
   *
   * For more informations see : {@link orientationMutable}
   */
  orientation: 'vertical' | 'horizontal';

  /**
   * **Shift the orientation of the stepper**
   *
   * _The orientation of the stepper is shifted according to the width of the component_
   * @param width
   * @returns
   */
  shiftOrientation: (width: number) => void;

  /**
   * **Get the state of the listener observer**
   * _The listener observer is a state that allows you to know the status of the listener_
   * @param key
   * @returns
   */
  getListenerObserver: (
    index: number,
  ) => 'idle' | 'loading' | 'resolved' | 'rejected';
}

/**
 * **Define the structure of the orientation mutable**
 *
 * _This interface summarizes the orientation of the stepper and its mutability_
 *
 * ---
 *
 * @param {'vertical' | 'horizontal'} orientation - The orientation of the stepper
 * @param {boolean} isOriginal - The state of the orientation, if it is the original orientation or not
 */
export interface orientationMutable {
  /**
   * @type {'vertical' | 'horizontal'}
   *
   * Define the orientation of the stepper
   */
  orientation: 'vertical' | 'horizontal';

  /**
   * @type {boolean}
   *
   * Define if the orientation is the original orientation
   *
   * _If the orientation has been mutated by program, the isOriginal state is false_
   */
  isOriginal: boolean;
}
