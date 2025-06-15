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
import * as SelectPrimitive from '@radix-ui/react-select';
import { FieldParams } from '../interfaces/FieldParams';
import { isOption } from '../utils/typeGuards/optionsFields.TypeGuards';
import { mergeRefs } from '@/lib/utils';

const SelectSimple = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>, // Type attendu par SelectTrigger
  FieldParams
>(
  (
    { zFields, fieldProps, indexField }: FieldParams,
    ref: React.ForwardedRef<React.ElementRef<typeof SelectPrimitive.Trigger>>,
  ) => {
    const { ref: zFieldsRef, ...restZFields } = zFields;
    return (
      <Select
        key={indexField}
        // className={fieldProps.className}
        disabled={fieldProps.disabled}
        onValueChange={(value: string | number) => {
          // si la valeut est un string numeraire alors on le change en number
          let newValue = value;
          if (
            typeof value === 'string' &&
            Number.isFinite(parseInt(value, 10))
          ) {
            newValue = Number(value);
          }
          zFields.onChange(newValue);
        }}
        {...restZFields}
      >
        <SelectTrigger ref={mergeRefs(ref, zFieldsRef)}>
          <SelectValue placeholder={fieldProps.placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{fieldProps.label}</SelectLabel>
            {fieldProps.options?.map((option) => (
              <SelectItem
                key={isOption(option) ? `select-item-${option.value}` : option}
                value={isOption(option) ? (option.value as string) : option}
              >
                {isOption(option) ? option.label : option}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  },
);
SelectSimple.displayName = 'SelectSimple';

export default SelectSimple;
