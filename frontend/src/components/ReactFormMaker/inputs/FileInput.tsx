import React from 'react';
import { Input } from '@/components/ui/input';
import { FieldParams } from '../interfaces/FieldParams';

function FileInput({ zFields, fieldProps, indexField }: FieldParams) {
  const { value, onChange, ...restZfields } = zFields;
  return (
    <Input
      className={fieldProps.className}
      disabled={fieldProps.disabled}
      key={indexField}
      type="file"
      placeholder={fieldProps.placeholder}
      {...restZfields}
      accept="image/*, application/pdf"
      onChange={(event) =>
        onChange(event.target.files && event.target.files[0])
      }
    />
  );
}

export default React.memo(FileInput);
