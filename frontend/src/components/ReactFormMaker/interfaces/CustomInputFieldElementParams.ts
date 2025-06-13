import { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';
import { FieldReactFormMaker } from './FieldInterfaces';

export interface CustomInputFieldElementParams<T extends FieldValues> {
  zFields?: ControllerRenderProps<T, Path<T>>;
  fieldProps?: FieldReactFormMaker;
  index?: string;
  props?: T;
}
