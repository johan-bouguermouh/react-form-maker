import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { FieldParams } from '../interfaces/FieldParams';

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
