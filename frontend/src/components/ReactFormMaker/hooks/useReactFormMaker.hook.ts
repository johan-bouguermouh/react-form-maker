'use client';
/* eslint-disable import/no-named-as-default-member */

import { zodResolver } from '@hookform/resolvers/zod';
import {
  type FieldValues,
  type DefaultValues,
  type UseFormReturn,
  useForm,
} from 'react-hook-form';
import { z, type ZodType, ZodObject } from 'zod';
import React from 'react';
import type { CompositeField } from '../interfaces/FieldInterfaces';
import {
  isDividerReactFormMaker,
  isFieldReactFormMaker,
  isReactFormMakerFieldset,
} from '../utils/typeGuards/compositeField.TypeGuards';

interface UseFormGenReturn<T extends FieldValues> {
  form: UseFormReturn<T>;
  formSchema: ZodObject<{ [key in keyof T]: ZodType<T[key]> }>;
  dataFieldsDefaultValues: { [key in keyof T]?: T[key] };
  zObject: { [key in keyof T]: ZodType<T[key]> };
  hasSubmitButton: (children: React.ReactNode) => boolean;
}

export function useReactFormMaker<T extends FieldValues>(
  formfieldsAttributes: CompositeField[],
): UseFormGenReturn<T> {
  const zObject: { [key in keyof T]: ZodType<T[key]> } = {} as {
    [key in keyof T]: ZodType<T[key]>;
  };
  const dataFieldsDefaultValues: { [key in keyof T]?: T[key] } = {};

  /**
   * Recursively processes a field element and its nested fields, if any.
   *
   * @template T - The type of the form data.
   * @param {FieldReactFormMaker} element - The field element to process.
   *
   * The function performs the following actions:
   * - If the element contains nested fields, it iterates over each field.
   * - For each nested field:
   *   - If the field is a container (e.g., a div), it recursively calls `createField` on the field.
   *   - If the field is not a container:
   *     - If the field has a Zod schema object (`zodObject`), it adds it to the `zObject` map.
   *     - If the field has default values (`defaultValues`), it adds them to the `dataFieldsDefaultValues` map.
   */
  function createField(element: CompositeField): void {
    if (element.fields) {
      const dataFields = element.fields;
      if (dataFields && dataFields.length > 0) {
        dataFields.forEach((field) => {
          if (
            isDividerReactFormMaker(field) ||
            isReactFormMakerFieldset(field)
          ) {
            createField(field);
          } else if (isFieldReactFormMaker(field)) {
            if (field.zodObject !== undefined) {
              zObject[field.inputName as keyof T] = field.zodObject as ZodType<
                T[keyof T]
              >;
            }
            if (field.defaultValues !== undefined) {
              dataFieldsDefaultValues[field.inputName as keyof T] =
                field.defaultValues as T[keyof T];
            }
          }
        });
      }
    }
  }

  formfieldsAttributes.forEach((element: CompositeField) => {
    createField(element);
  });

  let zodEffect: any; //eslint-disable-line @typescript-eslint/no-explicit-any
  const formSchema = z.object(zObject);

  if ('confirmPassword' in zObject && 'password' in zObject) {
    // Typage plus précis pour data
    zodEffect = formSchema
      .refine(
        (data: Record<string, unknown>) =>
          data.password === data.confirmPassword,
        {
          message: 'Les mots de passe ne correspondent pas',
          path: ['confirmPassword'],
        },
      )
      .transform(
        ({ confirmPassword, ...rest }: Record<string, unknown>) => rest, //eslint-disable-line @typescript-eslint/no-unused-vars
      );
  }

  const form = useForm<T>({
    resolver: zodResolver(zodEffect || formSchema),
    defaultValues: dataFieldsDefaultValues as DefaultValues<T>,
    mode: 'all',
  });

  function hasSubmitButton(_childrenArg: React.ReactNode): boolean {
    // Typage sécurisé pour child
    return React.Children.toArray(_childrenArg).some(
      (
        child:
          | string
          | number
          | bigint
          | React.ReactElement<any, string | React.JSXElementConstructor<any>> //eslint-disable-line @typescript-eslint/no-explicit-any
          | Iterable<React.ReactNode>
          | React.ReactPortal
          | Promise<React.AwaitedReactNode>,
      ) => {
        /* eslint-disable @typescript-eslint/no-unsafe-member-access */
        if (React.isValidElement(child)) {
          if ((child.props.type as string) === 'submit') {
            return true;
          }
          if (child.props.children) {
            return hasSubmitButton(child.props.children as React.ReactNode);
          }
        }
        return false;
      },
      /** eslint-enable @typescript-eslint/no-unsafe-member-access */
    );
  }

  return {
    form,
    formSchema,
    dataFieldsDefaultValues,
    zObject,
    hasSubmitButton,
  };
}
/* eslint-enable import/no-named-as-default-member */
