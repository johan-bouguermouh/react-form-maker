import React from 'react';
import type { FieldParams } from '../interfaces/FieldParams';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '../../../lib/utils';

function CheckboxWithText(params: FieldParams): JSX.Element {
  const { zFields, fieldProps, indexField } = params;
  const classNameLabel =
    'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70';
  const classNameContainer = 'flex space-x-2 items-top';

  return (
    <div className={classNameContainer}>
      <Checkbox
        key={indexField}
        className={cn(fieldProps.className)}
        /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
        defaultChecked={zFields.value}
        id={fieldProps.inputName}
        {...zFields}
        onCheckedChange={(checked: boolean) => {
          zFields.onChange(checked);
        }}
      />
      <div className="grid gap-1.5 leading-none">
        <label htmlFor={fieldProps.inputName} className={classNameLabel}>
          {fieldProps.label}
        </label>
      </div>
    </div>
  );
}

export default CheckboxWithText;
