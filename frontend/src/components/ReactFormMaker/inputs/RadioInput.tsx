import React from 'react';
import type { FieldParams } from '../interfaces/FieldParams';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  isOption,
  type Option,
  useValueOption,
} from '../utils/typeGuards/optionsFields.TypeGuards';

function RadioInput({ zFields, fieldProps, indexField }: FieldParams) {
  return (
    <RadioGroup
      className={fieldProps.className}
      disabled={fieldProps.disabled}
      key={indexField}
      {...zFields}
      onValueChange={zFields.onChange}
    >
      {fieldProps.options?.map((option: string | Option, index: number) => (
        <div className="flex items-center space-x-2" key={index}>
          <RadioGroupItem
            key={useValueOption(option)}
            value={isOption(option) ? option.label : option}
            id={isOption(option) ? option.label : option}
          />
          <Label htmlFor={isOption(option) ? option.label : option}>
            {isOption(option) ? option.label : option}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}

export default React.memo(RadioInput);
