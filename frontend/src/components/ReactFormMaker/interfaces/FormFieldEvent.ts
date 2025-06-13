import { ControllerRenderProps, UseFormReturn } from 'react-hook-form';

/**
 * @description
 * This is the interface for the ReactFormMaker component.
 * FormFieldEvent is the interface for the custom event of the input field.
 * FormFieldEnvent add the controlField and form attributes to the React.FocusEvent<HTMLInputElement> interface.
 * Also, we add form attribute to the React.FocusEvent<HTMLInputElement> interface to control the form directly from the event.
 */
export interface FormFieldEvent extends React.FocusEvent<HTMLInputElement> {
  controlField?: ControllerRenderProps<any, string>;
  form?: UseFormReturn<any>;
}
