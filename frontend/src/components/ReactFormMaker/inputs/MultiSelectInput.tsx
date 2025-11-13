import React from 'react';
import type { FieldParams } from '../interfaces/FieldParams';
import { isOption } from '../utils/typeGuards/optionsFields.TypeGuards';
import {
  type MultiSelectParams,
  MultiSelect,
} from '../enhancements/MultiSelect/MultiSelect';

interface MultiSelectInputProps
  extends FieldParams,
    Partial<MultiSelectParams> {}

function MultiSelectInput({ zFields, fieldProps }: MultiSelectInputProps) {
  const { value, onChange, ...restZfields } = zFields;

  if (!fieldProps.options) {
    return null;
  }

  const serializedOptions = fieldProps.options.map((option) => {
    if (isOption(option)) {
      return option;
    }
    return { value: option, label: option };
  });

  return (
    <MultiSelect
      id={fieldProps.inputName}
      onChange={onChange}
      {...restZfields}
      defaultValues={value ? value : fieldProps.defaultValues}
      options={serializedOptions}
    />
  );
}

export default React.memo(MultiSelectInput);
