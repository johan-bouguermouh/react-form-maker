import React from 'react';
import type { FieldParams } from '../interfaces/FieldParams';
import { Textarea } from '@/components/ui/textarea';

function TextareaInput({ zFields, fieldProps, indexField }: FieldParams) {
  return (
    <Textarea
      className={fieldProps.className}
      disabled={fieldProps.disabled}
      key={indexField}
      placeholder={fieldProps.placeholder}
      {...zFields}
    />
  );
}

export default React.memo(TextareaInput);
