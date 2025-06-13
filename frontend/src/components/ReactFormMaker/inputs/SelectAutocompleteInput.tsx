import React from 'react';
import { FieldParams } from '../interfaces/FieldParams';
import { SelectAutocomplete } from '../enhancements/SelectAutocomplete';
import {
  isOption,
  mustBeArrayOfOptions,
} from '../utils/typeGuards/optionsFields.TypeGuards';

function SelectAutocompleteInput({
  zFields,
  fieldProps,
  indexField,
}: FieldParams) {
  const { value, onChange, ...restZfields } = zFields;
  const options = fieldProps.options;
  if (!options) {
    throw new Error(
      `SelectAutocompleteInput: options must be an array of Option objects, received ${JSON.stringify(options)}`,
    );
    return null;
  }

  return (
    <SelectAutocomplete
      id={fieldProps.inputName}
      defaultValue={fieldProps.defaultValues}
      options={options}
      {...zFields}
    />
  );
}

export default React.memo(SelectAutocompleteInput);
