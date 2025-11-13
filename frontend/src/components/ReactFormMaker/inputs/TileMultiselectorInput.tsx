import React from 'react';
import type { FieldParams } from '../interfaces/FieldParams';
import type { FieldReactFormMaker } from '../interfaces/FieldInterfaces';
import { isOption } from '../utils/typeGuards/optionsFields.TypeGuards';
import { z } from 'zod';
import TileMultiSelector, {
  type TileMultiSelectorProps,
} from '../enhancements/TileSelector/TileMultiSelector';

interface TileMultiSelectorInputProps
  extends FieldParams,
    Partial<TileMultiSelectorProps> {}

function TileMultiSelectorInput({
  zFields,
  fieldProps,
  indexField,
  ...restProps
}: TileMultiSelectorInputProps) {
  const { value, onChange, ...restZfields } = zFields;

  if (!fieldProps.options) {
    return null;
  }
  function valueExcludes(fieldProps: FieldReactFormMaker): string[] {
    if (!fieldProps.options || !fieldProps.zodObject) {
      return [];
    }

    const schema = fieldProps.zodObject;
    let schemaValues: (string | number)[] = [];

    if (schema instanceof z.ZodEnum) {
      schemaValues = schema._def.values;
    } else if (schema instanceof z.ZodUnion) {
      schemaValues = schema._def.options.flatMap((option: any) =>
        option instanceof z.ZodEnum ? option._def.values : [],
      );
    }

    if (!schemaValues.length) {
      return [];
    }

    return fieldProps.options.reduce<string[]>((acc, option) => {
      const optionValue = isOption(option) ? option.label : option;
      if (!schemaValues.includes(optionValue)) {
        acc.push(optionValue);
      }
      return acc;
    }, []);
  }

  return (
    <TileMultiSelector
      id={fieldProps.inputName}
      onSelect={onChange}
      onChange={onChange}
      {...restZfields}
      value={value}
      defaultValue={fieldProps.defaultValues}
      options={fieldProps.options}
      className={fieldProps.className}
      disabled={fieldProps.disabled}
      key={indexField}
      legend={fieldProps.legend}
      excludes={valueExcludes(fieldProps)}
      {...restProps}
    />
  );
}

export default React.memo(TileMultiSelectorInput);
