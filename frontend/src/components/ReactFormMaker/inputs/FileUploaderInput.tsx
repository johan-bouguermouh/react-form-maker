import React from 'react';
import { FieldParams } from '../interfaces/FieldParams';
import DefaultFileUploader from '../enhancements/FileUploader/variants/DefaultFileUploader';
import { DropzoneOptions } from 'react-dropzone';
import { z } from 'zod';

function isFile(obj: any): boolean {
  return (
    obj instanceof File ||
    Object.prototype.toString.call(obj) === '[object File]'
  );
}

function FileDropZone({ zFields, fieldProps, indexField }: FieldParams) {
  const { value, onChange, ...restZfields } = zFields;

  const exempleInstanceOfFileExemple = new File([], 'exemple.txt', {
    type: 'text/plain',
  });

  const dropzoneOptions: DropzoneOptions = {
    disabled: fieldProps.disabled,
  };

  // Filtrer les propriétés inexistantes
  const filteredFieldProps = Object.fromEntries(
    Object.entries(fieldProps).filter(([_, v]) => v !== undefined),
  );

  return (
    <DefaultFileUploader
      value={value}
      onValueChange={onChange}
      {...restZfields}
      {...filteredFieldProps}
      className={fieldProps.className}
      dropzoneOptions={dropzoneOptions}
    />
  );
}

export default React.memo(FileDropZone);
