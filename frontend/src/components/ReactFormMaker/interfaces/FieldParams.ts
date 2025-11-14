import type { ClassValue } from 'clsx';
import type { ControllerRenderProps, Path } from 'react-hook-form';
import type { FieldReactFormMaker } from './FieldInterfaces';

/**
 * @description
 * This is the interface for the ReactFormMaker component.
 * FieldParams is the interface for the props of the Field component.
 * We need to use it in the Field component to define the props of the Field component under the ReactFormMaker component.
 *
 * ### Attributes
 *
 * | Name     | isRequired | Type | Description |
 * |----------|------------|------|-------------|
 * | zFields  | true       | ControllerRenderProps<any, Path<any>> | The register of the input field. |
 * | fieldProps | true     | FieldReactFormMaker | The fieldProps of the input field. |
 * | indexField | true     | string | The indexField of the input field. |
 * | id | false          | string | id of the input field. |
 * | className | false    | ClassValue[] \| string \| undefined | This is the custom className of the input field that will be displayed. |
 *
 * ---
 *
 * #### Info about the attributes
 *
 * @see {@link ControllerRenderProps} for more details.
 * @see {@link FieldReactFormMaker} for more details.
 *
 * ##### ControllerRenderProps
 *
 * | Name     | isRequired | Type | Description |
 * |----------|------------|------|-------------|
 * | onChange | true       | (...event: any[]) => void | The onChange event of the input field. |
 * | onBlur   | true       | Noop | The onBlur event of the input field. |
 * | value    | true       | FieldPathValue<TFieldValues, TName> | The value of the input field. |
 * | disabled | false      | boolean | The disabled attribute of the input field. |
 * | name     | true       | TName | The name of the input field. |
 * | ref      | true       | RefCallBack | The ref of the input field. |
 *
 */
export interface FieldParams {
  /**
   * @description
   * The register of the input field.
   * This is the register of the input field that will be displayed.
   * Is a representation of the input field in the form and interprets the input field of zodObject.
   */
  zFields: ControllerRenderProps<any, Path<any>>; // eslint-disable-line @typescript-eslint/no-explicit-any
  /**
   * @description
   * The fieldProps of the input field.
   * This is the fieldProps of the field, which is the FieldReactFormMaker interface.
   * We need to use it in the Field component to define the props of the Field component under the ReactFormMaker component.
   * This is required.
   */
  fieldProps: FieldReactFormMaker;
  /**
   * @description
   * The indexField of the input field.
   * This is the indexField of the input field that will be displayed.
   * This is required.
   */
  indexField: string;
  /**
   * @description
   * id of the input field.
   * Can be used to identify the input field. If not provided, the id will be generated automatically by the system.
   */
  id?: string;
  /**
   * @description
   * This is the custom className of the input field that will be displayed.
   * If you want to read more about Tailwind CSS here: https://tailwindcss.com/
   * This is optional.
   */
  className?: ClassValue[] | string | undefined;
}
