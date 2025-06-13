import React from 'react';
import { FieldParams } from '../interfaces/FieldParams';
import TileSelector from '../enhancements/TileSelector/TileSelector';
import { isOption } from '../utils/typeGuards/optionsFields.TypeGuards';
import { FieldReactFormMaker } from '../interfaces/FieldInterfaces';
import { z } from 'zod';

function TileSelectorInput({ zFields, fieldProps, indexField }: FieldParams) {
  const { value, onChange, ...restZfields } = zFields;

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
      value={value}
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

export default React.memo(TileSelectorInput);
