import React from 'react';
import { Input } from '@/components/ui/input';
import type { FieldParams } from '../interfaces/FieldParams';

function NumberInput({ zFields, fieldProps, indexField }: FieldParams) {
  return (
    <Input
      className={fieldProps.className}
      disabled={fieldProps.disabled}
      key={indexField}
      type="number"
      placeholder={fieldProps.placeholder}
      {...zFields}
      value={
        zFields.value !== undefined && zFields.value !== null
          ? Number(zFields.value)
          : ''
      }
    />
  );
}

export default React.memo(NumberInput);
