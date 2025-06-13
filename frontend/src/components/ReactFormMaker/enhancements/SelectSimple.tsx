import React from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from '@/components/ui/select';
import { FieldParams } from '../interfaces/FieldParams';
import { isOption } from '../utils/typeGuards/optionsFields.TypeGuards';
import * as SelectPrimitive from '@radix-ui/react-select';

const SelectSimple = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>, // Type attendu par SelectTrigger
  FieldParams
>(
  (
    { zFields, fieldProps, indexField }: FieldParams,
    ref: React.ForwardedRef<any>,
  ) => (
    <Select
      key={indexField}
      //className={fieldProps.className}
      disabled={fieldProps.disabled}
      onValueChange={(value: string | number) => {
        //si la valeut est un string numeraire alors on le change en number
        if (typeof value === 'string' && !isNaN(Number(value))) {
          value = Number(value);
        }
        zFields.onChange(value);
      }}
      {...zFields}
    >
      <SelectTrigger ref={ref}>
        <SelectValue placeholder={fieldProps.placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{fieldProps.label}</SelectLabel>
          {fieldProps.options?.map((option, index) => (
            <SelectItem
              key={isOption(option) ? 'select-item-' + option.value : option}
              value={isOption(option) ? (option.value as string) : option}
            >
              {isOption(option) ? option.label : option}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
);
SelectSimple.displayName = 'SelectSimple';

export default SelectSimple;
