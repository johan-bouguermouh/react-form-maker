import React, { useMemo } from 'react';
import type { FieldParams } from '../interfaces/FieldParams';
import type { FieldValues } from 'react-hook-form';
import TextInput from '../inputs/TextInput';
import PasswordInput from '../inputs/PasswordInput';
import SelectInput from '../inputs/SelectInput';
import TextareaInput from '../inputs/TextareaInput';
import DateInput from '../inputs/DateInput';
import RadioInput from '../inputs/RadioInput';
import CheckboxInput from '../inputs/CheckboxInput';
import SwitchInput from '../inputs/SwitchInput';
import NumberInput from '../inputs/NumberInput';
import FileInput from '../inputs/FileInput';
import { v4 as uuidV4 } from 'uuid';
import TileSelectorInput from '../inputs/TileSelectorInput';
import TileMultiSelectorInput from '../inputs/TileMultiselectorInput';
import SelectAutocompleteInput from '../inputs/SelectAutocompleteInput';
import PhoneNumberInput from '../inputs/PhoneNumberInput';
import FileDropZone from '../inputs/FileUploaderInput';
import MultiSelectInput from '../inputs/MultiSelectInput';
import DateRangeInput from '../inputs/DateRangeInput';

/**
 * InputComponent is a versatile component that renders different types of input fields
 * based on the `inputType` provided in the `fieldProps`. It supports various input types
 * such as text, password, select, textarea, date, dateRange, radio, checkbox, switch, file,
 * number, and custom components.
 *
 * @param {FieldParams} params - The parameters for the input field.
 * @param {Object} params.fieldProps - The properties of the field.
 * @param {string} params.fieldProps.inputType - The type of input to render.
 * @param {React.ReactNode} params.fieldProps.children - The children elements for custom input.
 * @param {number} params.indexField - The index of the field.
 *
 * @returns {JSX.Element} The rendered input component based on the **input type**.
 *
 * ---
 *
 * @see {@link FieldParams} for the interface used in the `params` argument.
 */
function InputComponent<T extends FieldValues>(
  params: FieldParams<T>,
): JSX.Element {
  const {
    fieldProps: { inputType, customInputFieldElement },
    indexField,
  } = params;

  //const [uuid, setUuid] = useState<string>(uuidV4());
  const uuid = useMemo(() => uuidV4(), []);

  switch (inputType) {
    case 'text':
      return <TextInput {...params} key={uuid} />;
    case 'password':
      return <PasswordInput {...params} key={uuid} />;
    case 'select':
      return <SelectInput {...params} key={uuid} />;
    case 'selectAutocomplete':
      return <SelectAutocompleteInput {...params} key={uuid} />;
    case 'multiSelect':
      return <MultiSelectInput {...params} key={uuid} />;
    case 'textarea':
      return <TextareaInput {...params} key={uuid} />;
    case 'date':
      return <DateInput {...params} key={uuid} />;
    case 'dateRange':
      return <DateRangeInput {...params} key={uuid} />;
    case 'radio':
      return <RadioInput {...params} key={uuid} />;
    case 'checkbox':
      return <CheckboxInput {...params} key={uuid} />;
    case 'switch':
      return <SwitchInput {...params} key={uuid} />;
    case 'file':
      return <FileInput {...params} key={uuid} />;
    case 'fileDropZone':
      return <FileDropZone {...params} key={uuid} />;
    case 'number':
      return <NumberInput {...params} key={uuid} />;
    case 'tileSelector':
      return <TileSelectorInput {...params} key={uuid} />;
    case 'tileMultiSelector':
      return <TileMultiSelectorInput {...params} key={uuid} />;
    case 'phoneNumber':
      return <PhoneNumberInput {...params} key={uuid} />;
    case 'custom':
      return React.cloneElement(customInputFieldElement as React.ReactElement, {
        ...params,
      });
    default:
      return (
        <p key={uuid}>{`Type d'input non reconnu : ${inputType as string}`}</p>
      );
  }
}

export default InputComponent;
