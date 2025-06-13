import React from 'react';
import { DateRangePicker } from '../enhancements/DateRangePicker';
import { FieldParams } from '../interfaces/FieldParams';

function DateRangeInput({ zFields, fieldProps, indexField }: FieldParams) {
  return (
    <DateRangePicker
      zFields={zFields}
      fieldProps={fieldProps}
      indexField={indexField}
    />
  );
}

export default React.memo(DateRangeInput);
