import React, { useCallback, useState } from 'react';
import {
  CompositeField,
  FieldReactFormMaker,
} from '../interfaces/FieldInterfaces';
import { FieldParams } from '../interfaces/FieldParams';
import { useGenerateUUIDs } from '@/lib/useGenerateUUIDs';
import {
  isDividerReactFormMaker,
  isFieldReactFormMaker,
  isReactFormMakerFieldset,
} from '../utils/typeGuards/compositeField.TypeGuards';
import DivElementField from '../formElements/DivElementField';
import FormFieldElement from '../formElements/FormFieldElement';
import {
  ControllerRenderProps,
  FieldValues,
  Path,
  UseFormReturn,
} from 'react-hook-form';
import InputComponent from '../formElements/InputComponent';
import { cn } from '@/lib/utils';

interface UseFormFieldsMapReturn<T extends FieldValues> {
  /**
   * A memoized callback function that renders the `InputComponent` with the provided field parameters.
   */
  InpuTComponentCallBack: ({
    zFields,
    fieldProps,
    indexField,
  }: FieldParams) => React.ReactElement<typeof InputComponent>;

  /**
   * **Generates an array of React elements or null based on the provided data fields.**
   * - - -
   * @param {CompositeField[]} dataField - An array of composite fields to be rendered.
   * @returns {(React.JSX.Element | null)[]} An array of React elements or null.
   *
   * @callback FormFieldsMap
   * - - -
   * @example
   * ``` javascript
   * const fields = [
   *   { type: 'divider', ... },
   *   { type: 'field', ... }
   * ];
   * const renderedFields = FormFieldsMap(fields);
   * ```
   *  - - -
   * @remarks
   * - Uses `useState` to manage UUIDs for each field.
   * - Uses `useEffect` to generate new UUIDs whenever `dataField` changes.
   * - Renders different components based on the type of field.
   * - Utilizes `isDividerReactFormMaker` and `isFieldReactFormMaker` to determine the type of field.
   * - - -
   * @see {@link uuidV4} for UUID generation.
   * @see {@link DivElementField} for rendering divider elements.
   * @see {@link FormFieldElement} for rendering form field elements.
   */
  FormFieldsMap: (dataField: CompositeField[]) => (React.ReactElement | null)[];

  /**
   * **Generates an array of Fieldset elements based on the provided form fields.**
   * @param {CompositeField[]} formfields - An array of composite fields to be rendered.
   * @returns {(React.JSX.Element | null)[]} An array of React elements or null.
   *
   * @callback FieldsetMap
   * - - -
   * @example
   * ``` javascript
   * const fields = [
   *   { type: 'fieldset', ... },
   *   { type: 'fieldset', ... }
   * ];
   * const renderedFields = FieldsetMap(fields);
   * ```
   *  - - -
   * @remarks
   * - Uses `useState` to manage UUIDs for each field.
   * - Uses `useEffect` to generate new UUIDs whenever `formfields` changes.
   * - Renders different components based on the type of field.
   * - Utilizes `isReactFormMakerFieldset` to determine the type of field.
   * - - -
   * @see {@link uuidV4} for UUID generation.
   */
  FieldsetMap: (
    formfields: CompositeField[],
  ) => (React.ReactElement<'fieldset'> | null)[];
}

export function useFormFieldsMap<T extends FieldValues>(
  form: UseFormReturn<T>,
): UseFormFieldsMapReturn<T> {
  const InpuTComponentCallBack = useCallback(
    ({
      zFields,
      fieldProps,
      indexField,
    }: FieldParams): React.ReactElement<typeof InputComponent> => (
      <InputComponent
        zFields={zFields as ControllerRenderProps<T, Path<T>>}
        fieldProps={fieldProps as FieldReactFormMaker}
        indexField={indexField}
      />
    ),
    [],
  );

  const FormFieldsMap = useCallback(
    (dataField: CompositeField[]) => {
      const uuids = useGenerateUUIDs<CompositeField>(dataField);

      return dataField?.map((elementField: CompositeField, index) => {
        if (isDividerReactFormMaker(elementField)) {
          return (
            <DivElementField
              key={uuids ? uuids[index] : index}
              elementField={elementField}
              uuid={uuids[index]}
              FormFieldsMap={FormFieldsMap}
            />
          );
        }
        if (isFieldReactFormMaker(elementField)) {
          return (
            <div role="form-field-element" className="mb-4" key={uuids[index]}>
              <FormFieldElement<T>
                elementField={elementField}
                index={'FormFieldElement' + uuids[index] + index}
                form={form}
                InpuTComponentCallBack={InpuTComponentCallBack}
              />
            </div>
          );
        }
        return null;
      });
    },
    [form],
  );

  const FieldsetMap = useCallback(
    (
      formfields: CompositeField[],
    ): (React.ReactElement<'fieldset'> | null)[] => {
      const uuids = useGenerateUUIDs<CompositeField>(formfields);

      return formfields.map((element, index) => {
        if (isReactFormMakerFieldset(element)) {
          return (
            <fieldset
              key={uuids ? 'fieldset' + uuids[index] : 'fieldset' + index}
              className={cn({ hidden: element.isHide }, element.className)}
            >
              {element.legend && (
                <legend
                  key={uuids[index] + 'legend'}
                  className={cn(
                    'text-lg font-bold pb-3',
                    element.legendClassName,
                  )}
                >
                  {element.legend}
                </legend>
              )}
              {FormFieldsMap(element.fields as FieldReactFormMaker[])}
            </fieldset>
          );
        }
        return null;
      });
    },
    [FormFieldsMap],
  );

  return { InpuTComponentCallBack, FormFieldsMap, FieldsetMap };
}
