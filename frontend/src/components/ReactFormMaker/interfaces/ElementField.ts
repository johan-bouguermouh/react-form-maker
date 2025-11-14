import type { FieldReactFormMaker } from './FieldInterfaces';
import type { FormFieldEvent } from './FormFieldEvent';

export interface ElementField extends FieldReactFormMaker {
  fields?: any; //eslint-disable-line @typescript-eslint/no-explicit-any
  field?: any; //eslint-disable-line @typescript-eslint/no-explicit-any
  isDiv?: boolean;
  isHide?: boolean;
  className?: string;
  children?: React.ReactNode;
  props?: Record<string, any>; //eslint-disable-line @typescript-eslint/no-explicit-any
  onBlur?: (event: FormFieldEvent) => void;
  onFocus?: (event: FormFieldEvent) => void;
  onChange?: (event: FormFieldEvent) => void;
  onSelect?: (event: FormFieldEvent) => void;
}
