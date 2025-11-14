import React from 'react';
import DatePickerSimple from '../enhancements/DatePickerSimple';
import type { FieldParams } from '../interfaces/FieldParams';

function DateInput({ zFields, fieldProps, indexField }: FieldParams) {
  return (
    <DatePickerSimple
      zFields={zFields}
      fieldProps={fieldProps}
      indexField={indexField}
    />
  );
}

export default React.memo(DateInput);
