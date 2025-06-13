import React from 'react';
import { FieldParams } from '../interfaces/FieldParams';
import { isOption } from '../utils/typeGuards/optionsFields.TypeGuards';
import {
  MultiSelect,
  MultiSelectParams,
} from '../enhancements/MultiSelect/MultiSelect';

interface MultiSelectInputProps
  extends FieldParams,
    Partial<MultiSelectParams> {}

function MultiSelectInput({
  zFields,
  fieldProps,
  indexField,
  ...restProps
}: MultiSelectInputProps) {
  const { value, onChange, ...restZfields } = zFields;

  if (!fieldProps.options) {
    return null;
  }

  const serializedOptions = fieldProps.options.map((option) => {
    if (isOption(option)) {
      return option;
    } else {
      return { value: option, label: option };
    }
  });

  return (
    <MultiSelect
      id={fieldProps.inputName}
      onChange={onChange}
      {...restZfields}
      defaultValues={value}
      options={serializedOptions}
    />
  );
}

export default React.memo(MultiSelectInput);
