import React from 'react';
import type { FieldParams } from '../interfaces/FieldParams';
import { SelectAutocomplete } from '../enhancements/SelectAutocomplete';

function SelectAutocompleteInput({ zFields, fieldProps }: FieldParams) {
  const { options } = fieldProps;
  if (!options) {
    new Error(
      `SelectAutocompleteInput: options must be an array of Option objects, received ${JSON.stringify(options)}`,
    );
    return null;
  }

  return (
    <SelectAutocomplete
      id={fieldProps.inputName}
      /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
      defaultValue={fieldProps.defaultValues}
      options={options}
      {...zFields}
    />
  );
}

export default React.memo(SelectAutocompleteInput);
