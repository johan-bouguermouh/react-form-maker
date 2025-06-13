import React from 'react';
import { Switch } from '@/components/ui/switch';
import { cn } from '../../../lib/utils';
import { FieldParams } from '../interfaces/FieldParams';

function SwitchInput({ zFields, fieldProps, indexField }: FieldParams) {
  return (
    <Switch
      key={indexField}
      disabled={fieldProps.disabled}
      className={cn(fieldProps.className)}
      {...zFields}
      checked={zFields.value}
      onCheckedChange={(checked: boolean) => {
        zFields.onChange(checked);
      }}
    />
  );
}

export default React.memo(SwitchInput);
