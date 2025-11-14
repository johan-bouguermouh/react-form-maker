import React from 'react';
import type { DropzoneOptions } from 'react-dropzone';
import type { FieldParams } from '../interfaces/FieldParams';
import DefaultFileUploader from '../enhancements/FileUploader/variants/DefaultFileUploader';

// function isFile(obj: any): boolean {
//   return (
//     obj instanceof File ||
//     Object.prototype.toString.call(obj) === '[object File]'
//   );
// }

function FileDropZone({ zFields, fieldProps }: FieldParams) {
  /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
  const { value, onChange, ...restZfields } = zFields;

  const dropzoneOptions: DropzoneOptions = {
    disabled: fieldProps.disabled,
  };

  // Filtrer les propriétés inexistantes
  const filteredFieldProps = Object.fromEntries(
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    Object.entries(fieldProps).filter(([_, v]) => v !== undefined),
  );

  return (
    <DefaultFileUploader
      /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
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
