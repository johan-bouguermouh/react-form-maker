import React from 'react';
import SelectSimple from '../enhancements/SelectSimple';
import { FieldParams } from '../interfaces/FieldParams';
import { FieldValues } from 'react-hook-form';

function SelectInput({ zFields, fieldProps, indexField }: FieldParams) {
  return (
    <SelectSimple
      zFields={zFields}
      fieldProps={fieldProps}
      indexField={indexField}
      {...zFields}
    />
  );
}

export default React.memo(SelectInput);
