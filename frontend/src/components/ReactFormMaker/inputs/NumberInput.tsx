import React from 'react';
import { Input } from '@/components/ui/input';
import { FieldParams } from '../interfaces/FieldParams';

function NumberInput({ zFields, fieldProps, indexField }: FieldParams) {
  return (
    <Input
      className={fieldProps.className}
      disabled={fieldProps.disabled}
      key={indexField}
      type="number"
      placeholder={fieldProps.placeholder}
      {...zFields}
    />
  );
}

export default React.memo(NumberInput);
