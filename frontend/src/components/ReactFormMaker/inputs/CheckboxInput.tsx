import React from 'react';
import CheckboxWithText from '../enhancements/CheckboxWithText';
import type { FieldParams } from '../interfaces/FieldParams';

function CheckboxInput({ zFields, fieldProps, indexField }: FieldParams) {
  return (
    <CheckboxWithText
      zFields={zFields}
      fieldProps={fieldProps}
      indexField={indexField}
    />
  );
}

export default React.memo(CheckboxInput);
