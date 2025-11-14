import React, { memo } from 'react';
import { z } from 'zod';
import type { FieldParams } from '../interfaces/FieldParams';
import type { FieldReactFormMaker } from '../interfaces/FieldInterfaces';
import TileSelector from '../enhancements/TileSelector/TileSelector';
import { isOption } from '../utils/typeGuards/optionsFields.TypeGuards';

function TileSelectorInput({ zFields, fieldProps, indexField }: FieldParams) {
  // Typage explicite pour éviter l'unsafe destructuring
  const { value, onChange, ...restZfields } = zFields as {
    value: string | number;
    onChange: (val: string | number) => void;
    [key: string]: unknown;
  };

  function testhandlerOnChange(value: string | number) {
    onChange(value);
  }
  if (!fieldProps.options) {
    return null;
  }
  function valueExcludes(fieldProps: FieldReactFormMaker): string[] {
    if (!fieldProps.options || !fieldProps.zodObject) {
      return [];
    }

    const schema = fieldProps.zodObject;
    let schemaValues: string[] = [];

    if (schema instanceof z.ZodEnum) {
      schemaValues = schema._def.values; // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    } else if (schema instanceof z.ZodUnion) {
      schemaValues = (schema._def.options as z.ZodEnum<any>[]).flatMap(
        (option) =>
          option instanceof z.ZodEnum ? (option._def.values as string[]) : [],
      );
    }

    if (!schemaValues.length) {
      return [];
    }

    return fieldProps.options.reduce<string[]>((acc, option) => {
      const optionValue = isOption(option) ? option.label : option;
      if (
        !schemaValues.includes(
          isOption(optionValue) ? optionValue.label : optionValue,
        )
      ) {
        acc.push(isOption(optionValue) ? optionValue.label : optionValue);
      }
      return acc;
    }, []);
  }

  return (
    <TileSelector
      id={fieldProps.inputName}
      onClick={testhandlerOnChange}
      {...restZfields}
      value={typeof value === 'string' ? value : String(value)}
      defaultValue={fieldProps.defaultValues}
      options={fieldProps.options}
      className={fieldProps.className}
      disabled={fieldProps.disabled}
      key={indexField}
      legend={fieldProps.legend}
      excludes={valueExcludes(fieldProps)}
    />
  );
}

export default memo(TileSelectorInput);
