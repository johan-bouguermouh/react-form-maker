'use client';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Slottable } from '@radix-ui/react-slot';
import React, { useCallback } from 'react';
import { FieldValues } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { ReactFormMakerParams } from './interfaces/FormParams';
import mapChildrenWithForm from './formElements/mapChildrenWithForm';
import validateStepperFormFields from './utils/validators/formValidators';
import useFormHandlers from './hooks/useFormHandlers.hook';
import { useReactFormMaker } from './hooks/useReactFormMaker.hook';
import { useFormFieldsMap } from './hooks/useFormFieldsMap';
import StepperForm from './formElements/Stepper/StepperForm.componenent';

/**
 * A React component for dynamically generating forms using a set of field definitions.
 * Supports both standard and stepper-based forms with customizable layouts and behaviors.
 *
 * @template T - A generic type extending `FieldValues` from React Hook Form.
 *
 * @param {ReactFormMakerParams<T>} props - The props for the ReactFormMaker component.
 * @param {FormField<T>[]} props.formfields - An array of form field definitions used to generate the form.
 * @param {string} [props.className] - Optional CSS class for the form container.
 * @param {string} [props.footerClassName='flex justify-end gap-4'] - Optional CSS class for the footer section.
 * @param {(data: T) => void} props.onSubmit - Callback function triggered on form submission with valid data.
 * @param {React.ReactNode} [props.children] - Optional children to be rendered inside the form.
 * @param {string} [props.btnTextSubmit='Submit'] - Text for the submit button.
 * @param {string} [props.btnSubmitClassName] - Optional CSS class for the submit button.
 * @param {boolean} [props.stepper=false] - Whether to render the form as a stepper.
 * @param {'horizontal' | 'vertical'} [props.orientation='horizontal'] - Orientation of the stepper form. Used only if `stepper` is true.
 *
 * @returns {JSX.Element} The rendered form component.
 *
 * @example
 * ```tsx
 * const formfields = [
 *   { name: 'username', type: 'text', label: 'Username', validation: { required: true } },
 *   { name: 'password', type: 'password', label: 'Password', validation: { required: true } },
 * ];
 *
 * function handleSubmit(data: FieldValues) {
 *   console.log(data);
 * }
 *
 * <ReactFormMaker
 *   formfields={formfields}
 *   onSubmit={handleSubmit}
 *   className="custom-form"
 *   btnTextSubmit="Login"
 * />
 * ```
 */
export default function ReactFormMaker<T extends FieldValues>({
  formfields,
  className,
  footerClassName = 'flex justify-end gap-4',
  onSubmit,
  // setZodObject, deprecated
  children,
  btnTextSubmit = 'Submit',
  btnSubmitClassName,
  stepper = false,
  orientation = 'horizontal',
}: ReactFormMakerParams<T>) {
  const { form, zObject, hasSubmitButton } = useReactFormMaker<T>(formfields);
  const { onValid, onInvalid } = useFormHandlers<T>({ onSubmit });
  const { FormFieldsMap, FieldsetMap } = useFormFieldsMap<T>(form);
  const mappedChildren = useCallback(
    () => mapChildrenWithForm(children, form),
    [children, form],
  );
  /** STEPPER FORM */
  if (stepper) {
    validateStepperFormFields(formfields, stepper);

    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onValid, onInvalid)}
          className={cn(
            ' flex flex-col gap-4 p-4 rounded-lg shadow-lg mx-auto mt-4 bg-white w-5/6 h-full min-h-80 overflow-hidden',
            className,
          )}
        >
          <StepperForm<T>
            form={form}
            formfields={formfields}
            zObject={zObject}
            orientation={orientation}
            formFieldsMap={FormFieldsMap}
          />
        </form>
      </Form>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onValid, onInvalid)}
        className={className}
      >
        {FieldsetMap(formfields)}

        <footer className={footerClassName}>
          <Slottable>{mappedChildren()}</Slottable>
          {!hasSubmitButton(children) && (
            <Button type="submit" className={btnSubmitClassName}>
              {btnTextSubmit}
            </Button>
          )}
        </footer>
      </form>
    </Form>
  );
}
