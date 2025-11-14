import React from 'react';
import PhoneInput from '../enhancements/PhoneInput';
import type { FieldParams } from '../interfaces/FieldParams';

function PhoneNumberInput({ zFields, fieldProps, indexField }: FieldParams) {
  return (
    <PhoneInput
      id={fieldProps.inputName}
      className={fieldProps.className}
      disabled={fieldProps.disabled}
      key={indexField}
      placeholder={fieldProps.placeholder}
      {...zFields}
    />
  );
}

export default React.memo(PhoneNumberInput);
