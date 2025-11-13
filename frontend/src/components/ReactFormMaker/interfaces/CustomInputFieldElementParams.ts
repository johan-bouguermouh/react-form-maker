import type { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';
import type { FieldReactFormMaker } from './FieldInterfaces';

export interface CustomInputFieldElementParams<T extends FieldValues> {
  zFields?: ControllerRenderProps<T, Path<T>>;
  fieldProps?: FieldReactFormMaker;
  index?: string;
  props?: T;
}
