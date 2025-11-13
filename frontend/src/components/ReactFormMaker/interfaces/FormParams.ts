import type { FieldErrors, FieldValues } from 'react-hook-form';
import type { CompositeField } from './FieldInterfaces';

/**
 * @description
 * This is the interface for the ReactFormMaker component.
 * ReactFormMakerParams is the interface for the props of the ReactFormMaker component.
 */
export interface ReactFormMakerParams<T extends FieldValues> {
  /**
   * @description
   * The fieldset of the form.
   * This is the fieldset of the form that will be displayed.
   * This is required.
   */
  formfields: CompositeField[];
  /**
   * @description
   * The className for styling the form.
   * We use Tailwind CSS to style the form.
   * If you want to read more about Tailwind CSS here: https://tailwindcss.com/
   * This is optional.
   */
  className?: string;
  /**
   * @description
   * The className for styling the footer.
   * We use Tailwind CSS to style the footer.
   * If you want to read more about Tailwind CSS here: https://tailwindcss.com/
   * This is optional.
   */
  footerClassName?: string;
  /**
   * @description
   * The text of the submit button.
   * This is the text of the submit button that will be displayed.
   * This is optional.
   */
  btnTextSubmit?: string;
  /**
   * @description
   * The className for styling the submit button.
   * We use Tailwind CSS to style the submit button.
   * If you want to read more about Tailwind CSS here: https://tailwindcss.com/
   * This is optional.
   */
  btnSubmitClassName?: string;

  /**
   * @description
   * The onSubmit event of the form.
   * This is the onSubmit event of the form that will be triggered.
   * We add the attribute data of type FormEvent<HTMLFormElement> to the event for controlling the form directly from the event.
   * This is required.
   * @param data
   * @returns void
   */
  onSubmit: (data: T | false, errors: FieldErrors<T> | false) => void;

  /**
   * @description
   * The children of the form.
   * This is the children of the form that will be displayed.
   * You can use it to display the children components inside the form.
   * This is optional.
   */
  children?: React.ReactNode;
  /**
   * @description
   * The setZodObject event of the form.
   * This is the setZodObject event of the form that will be triggered.
   * We add the attribute zObject of type { [key: string]: ZodType<any> } to the event for controlling the form directly from the event.
   * You can just use Hook like useState<{ [key: string]: ZodType<unknown> }>({}); to get the Zod object. The System will set the Zod object to the state automatically.
   * This is optional.
   * @param zObject
   * @returns void
   * deprecated
   */
  // setZodObject?: (zObject: { [key in keyof T]: ZodType<T[key]> }) => void;

  /**
   * @description
   * Stepper boolean value determines if the form will be displayed as a stepper.
   * By default, the stepper is set to false.
   * This is optional.
   */
  stepper?: boolean;

  /**
   * @description
   * The orientation of the form, used when the stepper is set to true.
   * This is the orientation of the form that will be displayed.
   * This is optional.
   */
  orientation?: 'vertical' | 'horizontal';
}
