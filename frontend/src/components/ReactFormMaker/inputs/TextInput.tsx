import React from 'react';
import type { FieldParams } from '../interfaces/FieldParams';
import { Input } from '@/components/ui/input';

function TextInput({ zFields, fieldProps, indexField }: FieldParams) {
  const { value, onChange, ...restZfields } = zFields;
  if (value === undefined || value === null) {
    zFields.value = '';
  }
  return (
    <Input
      id={fieldProps.inputName}
      className={fieldProps.className}
      disabled={fieldProps.disabled}
      key={indexField}
      placeholder={fieldProps.placeholder}
      {...zFields}
    />
  );
}

export default React.memo(TextInput);
