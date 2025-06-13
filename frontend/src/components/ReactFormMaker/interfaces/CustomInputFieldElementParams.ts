import { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';
import { FieldReactFormMaker } from './FieldInterfaces';

export interface CustomInputFieldElementParams<T> {
  zFields?: ControllerRenderProps<any, Path<any>>;
  fieldProps?: FieldReactFormMaker;
  index?: string;
  props?: T;
}
