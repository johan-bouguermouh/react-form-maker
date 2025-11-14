import React from 'react';
import InputPasswordVisibility from '../enhancements/InputPasswordVisibility';
import type { FieldParams } from '../interfaces/FieldParams';

function PasswordInput({ zFields, fieldProps, indexField }: FieldParams) {
  return (
    <InputPasswordVisibility
      key={indexField}
      zFields={zFields}
      fieldProps={fieldProps}
      indexField={indexField}
    />
  );
}

export default React.memo(PasswordInput);
