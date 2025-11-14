import React from 'react';
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import type { FieldParams } from '../interfaces/FieldParams';
import type { CustomInputFieldElementParams } from '../interfaces/CustomInputFieldElementParams';
import type { FieldReactFormMaker } from '../interfaces/FieldInterfaces';

interface FormFieldElementProps<T extends FieldValues> {
  elementField: FieldReactFormMaker;
  index: string;
  form: UseFormReturn<T>;
  InpuTComponentCallBack: (params: FieldParams) => JSX.Element;
}

function FormFieldElement<T extends FieldValues>({
  elementField,
  index: key,
  form,
  InpuTComponentCallBack,
}: FormFieldElementProps<T>) {
  return (
    <FormField
      key={`fomr-field-element-${key}`}
      control={form.control}
      name={elementField.inputName as Path<T>}
      render={({ field }) => (
        <FormItem
          className="flex flex-col"
          key={`formitem${key}`}
          onBlur={(e: any) => {
            if (elementField.onBlur) {
              e.controlField = field;
              e.form = form;
              elementField.onBlur(e);
            }
          }}
          onSelect={(e: any) => {
            if (elementField.onSelect) {
              e.controlField = field;
              e.form = form;
              elementField.onSelect(e);
            }
          }}
          onChange={(e: any) => {
            if (elementField.onChange) {
              e.controlField = field;
              e.form = form;
              elementField.onChange(e);
            }
          }}
          onClick={(e: any) => {
            if (elementField.onClick) {
              e.controlField = field;
              e.form = form;
              elementField.onClick(e);
            }
          }}
        >
          {elementField.label && !elementField.isSecure && (
            <FormLabel htmlFor={elementField.inputName}>
              {elementField.label}
            </FormLabel>
          )}
          <FormControl>
            <InpuTComponentCallBack
              zFields={field}
              fieldProps={elementField}
              indexField={`input${key}`}
            />
          </FormControl>
          {elementField.description && !elementField.isSecure && (
            <FormDescription>{elementField.description}</FormDescription>
          )}
          <FormMessage />
          {elementField.children &&
            React.isValidElement(elementField.children) &&
            React.cloneElement(elementField.children, {
              zFields: field,
              fieldProps: elementField,
              index: key,
              ...elementField.props,
            } as CustomInputFieldElementParams<any>)}
        </FormItem>
      )}
    />
  );
}

export default FormFieldElement;
