import type { ZodType } from 'zod';
import type { UseFormReturn } from 'react-hook-form';
import type { FormFieldEvent } from './FormFieldEvent';
import type { StepFormState } from '../formElements/Stepper/SteppersElements/StepperContext.interface';

export type InputType =
  | 'text'
  | 'password'
  | 'select'
  | 'selectAutocomplete'
  | 'multiSelect'
  | 'textarea'
  | 'date'
  | 'dateRange'
  | 'radio'
  | 'checkbox'
  | 'switch'
  | 'file'
  | 'fileDropZone'
  | 'number'
  | 'custom'
  | 'tileSelector'
  | 'tileMultiSelector'
  | 'phoneNumber';

/**
 * @description **This is the interface for the ReactFormMaker component.**
 * _CompositeField is the main state of a type on which all object-specific interfaces whose purpose is to contain specific fields._
 *
 * _The use of this state implies that the functionality used to route the rendering of form fields probably involves a recursive approach._
 *
 * ---
 *
 * @param {string} classname The className for styling the field. We use Tailwind CSS to style the field. This is optional.
 * @param { FieldReactFormMake[] | DividerReactFormMaker [] | ReactFormMakerFieldset[]} fields The children of the input field. This is the children of the input field that will be displayed. You can use it to display the children components inside the input field. This is optional, but recommended for the fieldset.
 * @param {boolean} isHide Hide the composite field. If isHide is true, the composite field will be hidden. You can use it to hide the composite field for security purposes and use it with hook to show it.
 */
export interface CompositeField {
  /**
   * @description
   * The className for styling the field.
   * We use Tailwind CSS to style the field.
   * This is optional.
   */
  classname?: string;
  /**
   * @description
   * The children of the input field.
   * This is the children of the input field that will be displayed.
   * You can use it to display the children components inside the input field.
   * This is optional, but recommended for the fieldset.
   */
  fields?: (
    | FieldReactFormMaker
    | DividerReactFormMaker
    | ReactFormMakerFieldset
  )[];
  /**
   * @description
   * Hide the composite field. If isHide is true, the composite field will be hidden.
   * You can use it to hide the composite field for security purposes and use it with hook to show it.
   */
  isHide?: boolean;
}

/**
 * @description
 * **This is an interface used in the ReactFormMaker component. **
 * _FieldReactFormMaker is the interface for form fields._
 *
 * ---
 *
 * ### Properties

| Attribute                       | Type             | Required    | Description                                                                                                                                                  |
|---------------------------------|------------------|-------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `inputName`                     | `string`                                                                                 | Required    | *The name of the input field. This is the key of the object returned when the form is submitted.*                                                            |
| `label`                         | `string`                                                                                 | Optional    | *The label of the input field, displayed above the input field for accessibility purposes.*                                                                  |
| `placeholder`                   | `string`                                                                                 | Optional    | *The placeholder text displayed inside the input field when empty. Relevant for input types like text, password, textarea, date, and number.*                |
| `inputType`                     | `string`                                                                                 | Required    | *The type of the input field to display.*                                                                                                                    |
| `zodObject`                     | `ZodType<any>`                                                                           | Optional    | *The Zod object used to validate the input field. Recommended for type-safe validation. [More info](https://zod.dev/?id=primitives).*                        |
| `defaultValues`                 | `any`                                                                                    | Optional    | *The default values displayed in the input field.*                                                                                                           |
| `options`                       | `string[]` or `{ value: string; label: string }[]`                                       | Optional    | *Options for `select`, `radio`, or `checkbox` input types. Required if the input type is one of these.*                                                      |
| `className`                     | `string`                                                                                 | Optional    | *The className for styling the input field using Tailwind CSS. [More info](https://tailwindcss.com/).*                                                        |
| `disabled`                      | `boolean`                                                                                | Optional    | *Disables the input field when true.*                                                                                                                        |
| `fields`                        | `(extended CompositeField)[]`              | Optional    | *Child components displayed within the input field.*                                                                                                         |
| `isDiv`                         | `boolean`                                                                                | Optional    | *If true, renders the fieldset as a `<div>` instead of a semantic `<fieldset>`.*                                                                             |
| `legend`                        | `string`                                                                                 | Optional    | *The legend of the input field displayed as the title of the fieldset.*                                                                                      |
| `legendClassName`               | `string`                                                                                 | Optional    | *The className for styling the legend using Tailwind CSS.*                                                                                                   |
| `description`                   | `string`                                                                                 | Optional    | *The description text displayed with the input field.*                                                                                                       |
| `isSecure`                      | `boolean`                                                                                | Optional    | *Hides the input field for security purposes when true.*                                                                                                     |

---

### Events

| Event               | Type                | Required    | Description                                                                                                                                                  |
|---------------------|---------------------|-------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `onBlur`            | `FormFieldEvent`   | Optional    | *Triggered on blur of the input field. Includes a `form` attribute of type `UseFormReturn<T>` for direct form control.*                                     |
| `onSelect`          | `FormFieldEvent`   | Optional    | *Triggered on focus of the input field. Includes a `form` attribute of type `UseFormReturn<T>` for direct form control.*                                    |
| `onChange`          | `FormFieldEvent`   | Optional    | *Triggered on input value change. Includes a `form` attribute of type `UseFormReturn<T>` for direct form control.*                                         |


---

### JSX Elements

| Attribute                    | Type                | Required    | Description                                                                                                                                                  |
|------------------------------|---------------------|-------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `children`                   | `React.ReactNode`  | Optional    | *Child components displayed within the input field.*                                                                                                         |
| `customInputFieldElement`    | `React.ReactNode`  | Optional    | *Custom ReactNode used to render the input field. Must be a valid input field element for use with the `ReactFormMaker` component.*                          |

---

### Other Props

| Attribute      | Type                  | Required    | Description                                                                                                                                                  |
|----------------|-----------------------|-------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `props`        | `Record<string, any>`| Optional    | *Additional props passed to the input field.*                                                                                                               |

 * ---
 * @extends CompositeField
 * @see {@link CompositeField}
 */
export interface FieldReactFormMaker extends CompositeField {
  /**
   * @description
   * The name of the input field, is required.
   * This is the key of the object that will be returned when the form is submitted.
   */
  inputName: string;
  /**
   * @description
   * The label of the input field.
   * This is the text that will be displayed above the input field.
   * It is directly related to the inputName and inputType for the accessibility of the form.
   * This is optional.
   */
  label?: string;
  /**
   * @description
   * The placeholder of the input field.
   * This is the text that will be displayed inside the input field when it is empty.
   * Kinds of inputType: text, password, textarea, date, number can have a placeholder.
   * This is optional.
   */
  placeholder?: string;
  /**
   * @description
   * The type of the input field.
   * This is the type of the input field that will be displayed.
   * This is required.
   */
  inputType: InputType;
  /**
   * @description
   * The Zod object of the input field.
   * This is the Zod object that will be used to validate the input field.
   * This is optional but recommended.
   * You can read more about Zod here: https://zod.dev/?id=primitives
   * We use the Zod object to validate the input field and to return the object with the correct types.
   * If you don't provide a Zod object, the input field will be validated with the default values.
   */
  zodObject?: ZodType;
  /**
   * @description
   * The default values of the input field.
   * This is the default value that will be displayed in the input field.
   * This is optional.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValues?: any;
  /**
   * @description
   * The options of the input field for the select, radio, and checkbox input types.
   * If the inputType is select, radio, or checkbox, you need to provide the options.
   * Will Be changed to options: string[] | { value: string; label: string }[]; in the future.
   */
  options?: string[] | { value: string | number; label: string }[];
  /**
   * @description
   * The className of the input field.
   * This is the className of the input field that will be displayed.
   * We use Tailwind CSS to style the input field.
   * If you want read more about Tailwind CSS here: https://tailwindcss.com/
   * This is optional.
   */
  className?: string;
  /**
   * @description
   * **Disabled the input field.**
   *
   * This is the boolean that will be used to disable the input field.
   *
   * _This is optional._
   */
  disabled?: boolean;
  /**
   * @description
   * The children of the input field.
   * This is the children of the input field that will be displayed.
   * You can use it to display the children components inside the input field.
   * This is optional.
   */
  fields?: (
    | FieldReactFormMaker
    | DividerReactFormMaker
    | ReactFormMakerFieldset
  )[];
  /**
   * @description
   * This bollean is used to declare this fieldset as a div.
   * If isDiv is true, the fieldset will be a div and have no semantic meaning.
   * You can use it to group the fields in a div for styling purposes.
   * This is optional.
   */
  isDiv?: boolean;
  /**
   * @description
   * The legend of the input field.
   * This is the legend of the fieldset that will be displayed.
   * This is optional.
   */
  legend?: string;
  /**
   * @description
   * The className for styling the fieldset.
   * We use Tailwind CSS to style the fieldset.
   * This is optional.
   */
  legendClassName?: string;
  /**
   * @description
   * The description of the input field.
   * This is the description of the input field that will be displayed.
   * This is optional.
   */
  description?: string;
  /**
   * @description
   * IsSecure is used to hide the input field.
   * If isSecure is true, the input field will be hidden.
   * You can use it to hide the input field for security purposes.
   * This is optional.
   */
  isSecure?: boolean;
  /**
   * @description
   * The onBlur event of the input field.
   * This is the onBlur event of the input field that will be triggered.
   * We add the attribute form of type UseFormReturn<any> to the event for controlling the form directly from the event.
   * This is optional.
   */
  onBlur?: (event: FormFieldEvent) => void;
  /**
   * @description
   * The onFocus event of the input field.
   * This is the onFocus event of the input field that will be triggered.
   * We add the attribute form of type UseFormReturn<any> to the event for controlling the form directly from the event.
   * This is optional.
   */
  onSelect?: (event: FormFieldEvent) => void;
  /**
   * @description
   * The onChange event of the input field.
   * This is the onChange event of the input field that will be triggered.
   * We add the attribute form of type UseFormReturn<any> to the event for controlling the form directly from the event.
   * This is optional.
   * You can use it to trigger the onChange event of the input field.
   */
  onChange?: (event: FormFieldEvent) => void;

  /**
   * @description
   *
   * The onClick event of the input field.
   * This is the onClick event of the input field that will be triggered.
   * We add the attribute form of type UseFormReturn<any> to the event for controlling the form directly from the event.
   * This is optional.
   * You can use it to trigger the onClick event of the input field.
   * @param event
   * @returns
   */
  onClick?: (event: FormFieldEvent) => void;
  /**
   * @description
   * This is way to add a custom component or Element to the field.
   * If you want to add a custom component or Element to the field, you can use this prop.
   * The Children will be displayed under the input field.
   * This is optional.
   */
  children?: React.ReactNode;
  /**
   * @description
   * The customInputFieldElement of the input field.
   * This is the customInputFieldElement is a ReactNode that will be displayed.
   * The difference between children and customInputFieldElement is that customInputFieldElement will be used by the ReactFormMaker component to display the input field.
   * This Element must be a valid input field element for the ReactFormMaker component.
   * This is optional.
   */
  customInputFieldElement?: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props?: Record<string, any>;
}

/**
 * @description
 * **This is the interface for the ReactFormMaker component.**
 * _DividerReactFormMaker is the interface for the divider in the form._
 *
 * ### Usage
 *
 * You can use this interface on an object that is part of your form's reading continuation. Its declaration allows the program to continue assigning zodObjects to the form. It also allows you to declare useful separations, so you can take control of the user interface and compose your form more freely.
 *
 * ### Properties
 *
 * @param {boolean} isDiv This bollean is used to declare this fieldset as a div. If isDiv is true, the fieldset will be a div and have no semantic meaning. You can use it to group the fields in a div for styling purposes. This is optional.
 * @param {string} className The className for styling the fieldset. We use Tailwind CSS to style the fieldset. This is optional.
 * @param {boolean} isHide Hide the fieldset. If isHide is true, the fieldset will be hidden. You can use it to hide the fieldset for security purposes and use it with hook to show it. This is optional.
 * @param {FieldReactFormMaker[] | DividerReactFormMaker[] | ReactFormMakerFieldset[]} fields The children of the input field. This is the children of the input field that will be displayed. You can use it to display the children components inside the input field. This is optional.
 *
 * ### JSX Elements
 *
 * @param {JSX.Element} children The children of the input field. This is the children of the input field that will be displayed. You can use it to display the children components inside the input field.
 *  _This is optional._
 *
 * ---
 *
 * @extends CompositeField
 * @see {@link CompositeField}
 */
export interface DividerReactFormMaker extends CompositeField {
  /**
   * @description
   * This bollean is used to declare this fieldset as a div.
   * If isDiv is true, the fieldset will be a div and have no semantic meaning.
   * You can use it to group the fields in a div for styling purposes.
   */
  isDiv: boolean;
  /**
   * @description
   * The className for styling the fieldset.
   * We use Tailwind CSS to style the fieldset.
   * This is optional.
   */
  className?: string;
  /**
   * @description
   * Hide the fieldset. If isHide is true, the fieldset will be hidden.
   * You can use it to hide the fieldset for security purposes and use it with hook to show it.
   * This is optional.
   */
  isHide?: boolean;
  /**
   * @description
   * The legend of the input field.
   * This is the legend of the fieldset that will be displayed.
   * This is optional.
   */
  fields?: (
    | FieldReactFormMaker
    | DividerReactFormMaker
    | ReactFormMakerFieldset
  )[];
  /**
   * @description
   * The legend of the input field.
   * This is the legend of the fieldset that will be displayed.
   * This is optional.
   */
  children?: JSX.Element;
}

/**
 * @description
 * This is the interface for the ReactFormMaker component.
 * ReactFormMakerFieldset is the interface for the fieldset in the form.
 * We need to use it in the ReactFormMakerParams interface to define the fieldset of the form.
 * The ReactFormMakerParams interface is used to define the props of the ReactFormMaker component.
 * Is a recursive interface that can have children fields.
 *
 * ---
 *
 * ## Properties
 *
 * ### Usage
 * 
 * | Attribute           | Type                                                                                                                                         | Required    | Description                                                                                                   |
|---------------------|----------------------------------------------------------------------------------------------------------------------------------------------|-------------|---------------------------------------------------------------------------------------------------------------|
| `fieldset`          | `string`                                                                                                                                     | Required    | *The fieldset of the form. This is the fieldset of the form that will be displayed.*                          |
| `legend`            | `string`                                                                                                                                     | Optional    | *The legend of the input field. This is the title of the fieldset that will be displayed.*                    |
| `legendClassName`   | `string`                                                                                                                                     | Optional    | *The className for styling the legend, using Tailwind CSS. [More info](https://tailwindcss.com/).*            |
| `className`         | `string`                                                                                                                                     | Optional    | *The className for styling the fieldset, using Tailwind CSS. [More info](https://tailwindcss.com/).*          |
| `description`       | `string`                                                                                                                                     | Optional    | *The description of the input field that will be displayed.*                                                 |
| `fields`            | (`FieldReactFormMaker` or `DividerReactFormMaker` or `ReactFormMakerFieldset`)[]                                                                 | Optional    | *The fields of the form that will be displayed.*                                                             |
| `isHide`            | `boolean`                                                                                                                                    | Optional    | *Hides the fieldset. If true, the fieldset will be hidden, useful for security purposes when combined with hooks.* |
 * 
 * ---
 * 
 * @extends CompositeField
 * @see {@link CompositeField} For more information about the CompositeField interface.
 * 
 * ---
 * 
 * @see {@link FieldReactFormMaker} 
 * @see {@link DividerReactFormMaker}
 * @see {@link ReactFormMakerStep}
 */
export interface ReactFormMakerFieldset extends CompositeField {
  /**
   * @description
   * The fieldset of the form.
   * This is the fieldset of the form that will be displayed.
   * This is required.
   */
  fieldset: string;
  /**
   * @description
   * The legend of the input field.
   * This is the legend of the fieldset that will be displayed.
   * This is optional.
   * You can use it to display the legend of the fieldset.
   * The legend is the title of the fieldset.
   */
  legend?: string;
  /**
   * @description
   * The className for styling the legend.
   * We use Tailwind CSS to style the legend.
   * If you want to read more about Tailwind CSS here: https://tailwindcss.com/
   * This is optional.
   */
  legendClassName?: string;
  /**
   * @description
   * The className for styling the fieldset.
   * We use Tailwind CSS to style the fieldset.
   * If you want to read more about Tailwind CSS here: https://tailwindcss.com/
   * This is optional.
   */
  className?: string;
  /**
   * @description
   * The description of the input field.
   * This is the description of the input field that will be displayed.
   * This is optional.
   */
  fields?: (
    | FieldReactFormMaker
    | DividerReactFormMaker
    | ReactFormMakerFieldset
  )[];
  /**
   * @description
   * Hide the fieldset. If isHide is true, the fieldset will be hidden.
   * You can use it to hide the fieldset for security purposes and use it with hook to show it.
   * This is optional.
   */
  isHide?: boolean;
}

/**
 * @description **This is the interface for the ReactFormMaker component.**
 * ReactFormMakerStep is the interface for the steps in the form. We need to use it in the ReactFormMakerParams interface to define the steps of the form.
 *
 * ---
 *
 * ### Properties
 *
 * @param {string} stepName The stepName of the form. This is the stepName of the form that will be displayed. This is required.
 * @param {boolean} isStep Define the fieldset as a step of Stepper. If isStep is true, the fieldset will be a step of Stepper.
 * @param {string} legend The legend of the input field. This is the legend of the fieldset that will be displayed. This is optional. You can use it to display the legend of the fieldset. The legend is the title of the fieldset.
 * @param {string} legendClassName The className for styling the legend. We use Tailwind CSS to style the legend. If you want to read more about Tailwind CSS here: https://tailwindcss.com/ This is optional.
 * @param {string} className The className for styling the fieldset. We use Tailwind CSS to style the fieldset. If you want to read more about Tailwind CSS here: https://tailwindcss.com/ This is optional.
 * @param {string} description The description of the input field. This is the description of the input field that will be displayed. This is optional.
 * @param {FieldReactFormMaker[]} fields The fields of the form. This is the fields of the form that will be displayed. This is optional. You can use it to display the fields of the form.
 * @param {boolean} isHide Hide the fieldset. If isHide is true, the fieldset will be hidden. You can use it to hide the fieldset for security purposes and use it with hook to show it. This is optional.
 * @param {boolean} disabledBefore disabledBefore is used to define if button before the current step is disabled. If disabledBefore is true, the button before the current step is disabled and cannot be clicked. disabledBefore disabled possibility to go back to any previous step in the stepper header and the stepper footer. False by default. This is optional.
 * @param {boolean} isStrict IsStrict is used to define if the step is strict. If isStrict is true, the step will be strict and the user cannot go to the next step without filling the current step. If any validation of zod is invalid, the user cannot go to the next step. False by default. This is optional.
 *
 * ### Events
 *
 * ### JSX Elements
 *
 * @param {React.ReactNode} children The children of the input field. This is the children of the input field that will be displayed. You can use it to display the children components inside the input field. This is optional.
 *
 * ---
 *
 * @extends CompositeField
 * @see {@link CompositeField}
 */
export interface ReactFormMakerStep extends CompositeField {
  /**
   * @description
   * The stepName of the form.
   * This is the stepName of the form that will be displayed.
   * This is required.
   */
  stepName: string;
  /**
   * @description
   * isStep Define the fieldset as a step of Stepper.
   * If isStep is true, the fieldset will be a step of Stepper.
   */
  isStep?: boolean;
  /**
   * @description
   * The legend of the input field.
   * This is the legend of the fieldset that will be displayed.
   * This is optional.
   * You can use it to display the legend of the fieldset.
   * The legend is the title of the fieldset.
   */
  legend?: string;
  /**
   * @description
   * The className for styling the legend.
   * We use Tailwind CSS to style the legend.
   * If you want to read more about Tailwind CSS here: https://tailwindcss.com/
   * This is optional.
   */
  legendClassName?: string;
  /**
   * @description
   * The className for styling the fieldset.
   * We use Tailwind CSS to style the fieldset.
   * If you want to read more about Tailwind CSS here: https://tailwindcss.com/
   * This is optional.
   */
  className?: string;
  /**
   * @description
   * The description of the input field.
   * This is the description of the input field that will be displayed.
   * This is optional.
   */
  fields?: (
    | FieldReactFormMaker
    | DividerReactFormMaker
    | ReactFormMakerFieldset
  )[];
  /**
   * @description
   * Hide the fieldset. If isHide is true, the fieldset will be hidden.
   * You can use it to hide the fieldset for security purposes and use it with hook to show it.
   * This is optional.
   */
  isHide?: boolean;

  /**
   * @description
   * The children of the input field.
   * This is the children of the input field that will be displayed.
   * You can use it to display the children components inside the input field.
   * This is optional.
   */
  children?: React.ReactNode;

  /**
   * @description
   * disabledBefore is used to define if button before the current step is disabled.
   * If disabledBefore is true, the button before the current step is disabled and cannot be clicked.
   * disabledBefore disabled possibility to go back to any previous step in the stepper header and the stepper footer.
   * False by default.
   */
  disabledBefore?: boolean;

  /**
   * @description
   * IsStrict is used to define if the step is strict.
   * If isStrict is true, the step will be strict and the user cannot go to the next step without filling the current step.
   * If any validation of zod is invalid, the user cannot go to the next step.
   * False by default.
   * This is optional.
   */
  isStrict?: boolean;

  /**
   * @description
   * onBeforeNextStep is used to define a function that will be executed before switching to the next step.
   * This is optional.
   * This function will be executed before switching to the next step and after the triggering of validation form when step is the current step.
   *
   * @param data The data of the form.
   * @returns Promise<boolean> if true, the user can switch to the next step, if false, the user cannot switch to the next step.
   */
  onBeforeNextStep?: (data: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    submissionState: StepFormState<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: UseFormReturn<any>;
  }) => Promise<boolean>;

  /**
   * @description
   * **Componenent for Icon of the step.**
   *
   * If IconStep is not provided, the step will have defaults icons depending on the step status.
   * This is optional.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  IconStep?: React.ComponentType<any>;

  /**
   * @description
   * change name of the button next
   * this is optional
   */
  buttonNextContent?: string;

  /**
   * @description
   * change name of the button previous
   * tjhis is optional
   */
  buttonPreviousContent?: string;

  /**
   * @description
   * **Add additional buttons to the step.**
   * This is optional.
   *
   * This element jsx erith the context of the step.
   * We can use it to add additional buttons to the step.
   * This button will be displayed in the footer of the step after the button next and the button previous.
   *
   */
  additionalButtons?: React.ReactNode;

  /**
   * @description
   * **Add additionclassname stepper footer.**
   * This is optional.
   */
  footerClassName?: string | string[];
}
