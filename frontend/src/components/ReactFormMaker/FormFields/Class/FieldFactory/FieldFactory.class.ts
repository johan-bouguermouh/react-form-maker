import { z, ZodNumber, ZodString, ZodType, type ZodTypeDef } from 'zod';
import React from 'react';
import type {
  DividerReactFormMaker,
  FieldReactFormMaker,
  InputType,
  ReactFormMakerFieldset,
} from '../../../interfaces/FieldInterfaces';
import type { FormFieldEvent } from '../../../interfaces/FormFieldEvent';
import type { CustomInputFieldElementParams } from '@/components/ReactFormMaker/interfaces/CustomInputFieldElementParams';
import type { Option } from '@/components/ReactFormMaker/utils/typeGuards/optionsFields.TypeGuards';

import {
  isBetween,
  islaterThan,
  isOlderThan,
  type SimpleDurationValues,
} from '../../../utils/validators/dateValidators';

/**
 * Represents a condition where a value must be in the past.
 */
type Past = 'past';

/**
 * Represents a condition where a value must be in the future.
 */
type Future = 'future';

/**
 * Represents a condition where a value must be more than a specified duration.
 *
 * @property {string} type - The type of condition, which is always 'moreThan' for this interface.
 * @property {SimpleDurationValues} value - The duration value that the condition is compared against.
 */
type OlderThan = { type: 'olderThan'; value: SimpleDurationValues };

/**
 * Represents a condition where a value must be less than a specified duration.
 *
 * @property {string} type - The type of the condition, which is always 'olderThan'.
 * @property {SimpleDurationValues} value - The value that the condition is compared against.
 */
type LaterThan = { type: 'laterThan'; value: SimpleDurationValues };

/**
 * Represents a type that indicates a difference of values. Is used to calculate the difference in a DateRangeType between two `from` values and `to` values.
 *
 * @property type - A string literal type that is always 'differenceOf'.
 * @property value - An object of type `SimpleDurationValues` that holds the duration values.
 */
type IsBetween = { type: 'isBetween'; value: SimpleDurationValues };

type IsOutside = { type: 'isOutside'; value: SimpleDurationValues };

// Définition du type ZodeDateType
/**
 * Represents a type for date validation in Zod.
 *
 * This type can be one of the following:
 * - `Past`: A date must be in the past.
 * - `Future`: A date must be in the future.
 * - `OlderThan`: Defines a difference between today's date and the input selected by the user, e.g.{type : olderThan, value: {years: 18}} to define a birthDate for which the user must select a date prior to 18 years of age
 * - `LaterThan`: Defines a difference between today's date and the input selected by the user, e.g.{type : laterThan, value: {weeks: 1}} to define a date that must be at least 1 week away
 * - `ZodType<any, ZodTypeDef, any>`: A generic Zod type for any date validation.
 */
type ZodeDateType =
  | Past
  | Future
  | OlderThan
  | LaterThan
  | ZodType<any, ZodTypeDef, any>;

/**
 * Represents a date range with a start date (`from`) and an end date (`to`).
 *
 * @typedef {Object} DateRangeType
 * @property {ZodeDateType} from - The start date of the range.
 * @property {ZodeDateType} to - The end date of the range.
 */
type DateRangeType = {
  from: ZodeDateType;
  to: ZodeDateType;
};

/**
 * A type representing a date range, which can be one of the following:
 * - `DateRangeType`: A custom type representing a range of dates.
 * - `DifferenceOf`: A custom type representing the difference between two dates.
 * - `ZodType<any, ZodTypeDef, any>`: A Zod schema type that can validate any value.
 */
type ZodDateRangeType =
  | DateRangeType
  | IsBetween
  | IsOutside
  | ZodType<any, ZodTypeDef, any>;

/**
 * Converts a string to a no-spaces string by replacing all spaces with underscores.
 * If the input string contains spaces, a warning is logged to the console.
 *
 * @param value - The input string to be converted.
 * @returns The converted string with spaces replaced by underscores.
 */
function createNoSpacesString(value: string): string {
  if (value.includes(' ')) {
    console.warn(`Name of field cannot contain spaces: ${value}`);
    return value.trim().replaceAll(' ', '_');
  }
  return value;
}

/**
 * Determines the Zod type based on the input value's type.
 *
 * @param value - The value to determine the type for.
 * @returns A ZodType corresponding to the type of the input value.
 *
 * The function returns:
 * - `z.string()` if the value is a string.
 * - `z.number()` if the value is a number.
 * - `z.boolean()` if the value is a boolean.
 * - `z.object(value)` if the value is an object.
 * - `z.any()` for any other type.
 */
function defineType(value: any): ZodType<any, ZodTypeDef, any> {
  switch (typeof value) {
    case 'string':
      return z.string();
    case 'number':
      return z.number();
    case 'boolean':
      return z.boolean();
    case 'object':
      return z.object(value);
    default:
      return z.any();
  }
}

function stringifyDuration(duration: SimpleDurationValues): string {
  const { years, months, weeks, days } = duration;
  const parts = [];
  if (years) parts.push(`${years} year${years > 1 ? 's' : ''}`);
  if (weeks) parts.push(`${weeks} week${weeks > 1 ? 's' : ''}`);
  if (months) parts.push(`${months} month${months > 1 ? 's' : ''}`);
  if (days) parts.push(`${days} day${days > 1 ? 's' : ''}`);

  return parts.join(', ');
}

/**
 * @template T - The type of the form data.
 *
 *
 * @attribute {T} inputName - The name of the input field.
 * @class Field
 * @implements {FieldReactFormMaker}
 */
export default class Field<T extends FieldReactFormMaker> {
  inputName: string;

  label?: string;

  placeholder?: string;

  defaultValues: any;

  zodObject: ZodType<any, ZodTypeDef, any> | undefined;

  inputType: InputType = 'text';

  // defaultValue?: any;
  options?: string[] | Option[];

  className?: string;

  isHide?: boolean;

  disabled?: boolean | undefined;

  fields?: (
    | FieldReactFormMaker
    | DividerReactFormMaker
    | ReactFormMakerFieldset
  )[];

  legend?: string;

  legendClassName?: string;

  description?: string;

  isSecure?: boolean;

  children?: React.ReactNode;

  customInputFieldElement?: React.ReactNode;

  props?: Record<string, any>;

  onBlur?: ((event: FormFieldEvent) => void) | undefined;

  onSelect?: ((event: FormFieldEvent) => void) | undefined;

  onChange?: ((event: FormFieldEvent) => void) | undefined;

  onClick?: ((event: FormFieldEvent) => void) | undefined;

  constructor(name: string, entries?: Partial<T>) {
    this.inputName = createNoSpacesString(name);
    if (entries) Object.assign(this, entries);
  }

  /**
   * Creates a Zod schema from a list of options.
   *
   * @param options - An array of options which can be either strings or objects with a `value` property.
   * @param hasMultipleInput - A boolean indicating if the input can have multiple values. Defaults to `false`.
   * @returns A Zod schema that validates the provided options.
   *
   * @remarks
   * - If `options` contains objects, it assumes each object has a `value` property and creates a schema based on the type of the first `value`.
   * - If `options` contains strings, it creates an enum schema from the strings.
   * - The schema includes a refinement to ensure the value is one of the provided options.
   *
   * @example
   * ```typescript
   * const options = ['option1', 'option2', 'option3'];
   * const schema = createEnumFromOptions(options);
   * // schema will be a Zod enum schema for the provided options
   * ```
   *
   * @example
   * ```typescript
   * const options = [{ value: 1, label: "first Label" }, { value: 2, label: "second Label" }];
   * const schema = createEnumFromOptions(options);
   * // schema will be a Zod schema based on the type of the `value` property
   * ```
   */
  private createEnumFromOptions(
    options: string[] | Option[],
    hasMultipleInput?: boolean,
  ): ZodType<any, ZodTypeDef, any> {
    hasMultipleInput = hasMultipleInput || false;
    // define options type
    const isComplexeOption =
      typeof options[0] === 'object' && options[0].hasOwnProperty('value');
    let zodObject: ZodType<any, ZodTypeDef, any>;
    if (isComplexeOption) {
      options = options as Option[];
      const typeValue = defineType(options[0].value);
      zodObject = hasMultipleInput ? z.array(typeValue) : typeValue;
    } else {
      zodObject = hasMultipleInput
        ? z.array(z.enum(options as [string, ...string[]]))
        : z.enum(options as [string, ...string[]]);
    }

    zodObject.refine(
      (data) => {
        if (isComplexeOption) {
          options = options as Option[];
          return options.some((option) => option.value === data);
        }
        return options.includes(data);
      },
      {
        message: 'Invalid option selected',
      },
    );

    return zodObject;
  }

  /**
   * Defines a Zod date type based on the provided `ZodeDateType`.
   *
   * @param type - The type of date validation to apply. It can be one of the following:
   * - 'past': Validates that the date is in the past.
   * - 'future': Validates that the date is in the future.
   * - An object with a `type` property:
   *   - `{ type: 'olderThan', value: Date }`: Validates that the date is older than the specified value.
   *   - `{ type: 'laterThan', value: Date }`: Validates that the date is later than the specified value.
   * - An instance of `ZodType`: Uses the provided Zod type for validation.
   *
   * @returns A Zod date type with the specified validation.
   */
  private defineZodDateType(type: ZodeDateType): ZodType<any, ZodTypeDef, any> {
    switch (type) {
      case 'past':
        return z.date().refine((date) => date < new Date(), {
          message: 'Date must be in the past',
        });
      case 'future':
        return z.date().refine((date) => date > new Date(), {
          message: 'Date must be in the future',
        });
      default:
        if (typeof type === 'object' && 'type' in type) {
          if (type.type === 'olderThan') {
            return z.date().refine((date) => isOlderThan(date, type.value), {
              message: `Date must be later than ${stringifyDuration(type?.value)} ago`,
            });
          }
          if (type.type === 'laterThan') {
            return z.date().refine((date) => islaterThan(date, type.value), {
              message: `Date must be older than ${stringifyDuration(type?.value)} away`,
            });
          }
        } else if (type instanceof ZodType) {
          return type;
        }
    }

    return z.date();
  }

  /**
   * ** Set Config **
   *
   * You can set the config object for the field with this method :
   *  - **label** : If you want to set a label it will be displayed above the field
   *  - **placeholder** : If you want to set a placeholder
   * - **defaultValues** : If you want to set a default value (warning: this value will be overrided by the value in the form)
   * - **zodObject** : Set a zod object to validate the field (see zod documentation: https://zod.dev/
   * - **inputType** : Set the type of the input. _is recommended to use the methods provided by the class to set the input type_
   * - **options** : If you want to set options for a select or radio input (only used for select and radio input type)
   * - **className** : If you want to set a class name to the
   * - **isHide** : If you want to hide the field
   * - **disabled** : If you want to disable the field
   * - **fields** : If you want to set a fieldset
   * - **legend** : If you want to set a legend to the fieldset
   * - **legendClassName** : If you want to set a class name to the legend
   * - **description** : If you want to set a description to the field
   * - **isSecure** : If you want to set the field as secure
   * - **children** : If you want to set children to the field (is recommended to use the methods provided by the class to set)
   *
   * ---
   * Set the config object for the field
   * @param entries config object to set
   * @returns
   */
  setConfig(entries: Partial<FieldReactFormMaker>): this {
    Object.assign(this, entries);
    return this;
  }

  /**
   * @description
   * The onBlur event of the input field.
   * This is the onBlur event of the input field that will be triggered.
   * We add the attribute form of type UseFormReturn<any> to the event for controlling the form directly from the event.
   * _This is optional._
   *
   * ---
   *
   * @see {@link FormFieldEvent}
   */
  public handlerBlur(callback: (e: FormFieldEvent) => void): this {
    this.onBlur = callback;
    return this;
  }

  /**
   * @description
   * The onFocus event of the input field.
   * This is the onFocus event of the input field that will be triggered.
   * We add the attribute form of type UseFormReturn<T> to the event for controlling the form directly from the event.
   * _This is optional._
   *
   * ---
   *
   * @see {@link FormFieldEvent}
   */
  public handlerSelect(callback: (e: FormFieldEvent) => void): this {
    this.onSelect = callback;
    return this;
  }

  /**
   * @description
   * The onChange event of the input field.
   * This is the onChange event of the input field that will be triggered.
   * We add the attribute form of type UseFormReturn<any> to the event for controlling the form directly from the event.
   * _This is optional._
   * You can use it to trigger the onChange event of the input field.
   *
   * ---
   *
   * @see {@link FormFieldEvent}
   */
  public handlerChange(callback: (e: FormFieldEvent) => void): this {
    this.onChange = callback;
    return this;
  }

  /**
   * Registers a callback function to be executed when a click event occurs on the form field.
   * is used whene native trigger of click is on element of the field
   * like TileSelector, TileMultiSelector, and cutom component
   *
   * @param callback - The function to be called when the click event is triggered.
   *                   It receives a `FormFieldEvent` object as its argument.
   * @returns The current instance of the class, allowing for method chaining.
   */
  public handlerClick(callback: (e: FormFieldEvent) => void): this {
    this.onClick = callback;
    return this;
  }

  /**
   * Sets the input type to 'text' and optionally assigns a Zod schema object for validation.
   *
   * @param {ZodType<any, ZodTypeDef, String>} [zodObject] - Optional Zod schema object for validation. If not provided, defaults to a string schema.
   * @returns {this} The current instance of the class for method chaining.
   */
  public text(zodObject?: ZodType<any, ZodTypeDef, string>): this {
    if (!zodObject || zodObject === undefined) {
      zodObject = z.string();
    }
    this.zodObject = zodObject;
    this.zodObject as ZodString;
    this.inputType = 'text';
    return this;
  }

  /**
   * Sets the field as a password input with optional Zod validation.
   *
   * @param zodObject - An optional Zod schema object for validating the password. If not provided, a default schema is used.
   *   The default schema requires:
   *   - A minimum length of 8 characters.
   *   - At least one uppercase letter.
   *   - At least one lowercase letter.
   *   - At least one number.
   *
   * ---
   * @info > If you use key name `password` exactly, and second password type with namekey `confirmPassword`, the form will automaticly check if the two passwords are the same. The seconde password will be deleted from returned data for security reason.
   * @returns The current instance of the class for method chaining.
   */
  public password(zodObject?: ZodType<any, ZodTypeDef, string>): this {
    if (!zodObject || zodObject === undefined) {
      zodObject = z
        .string()
        .min(6, {
          message: 'Password must be at least 6 characters.',
        })
        .refine(
          (data) => {
            // regex password submition
            return data.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/);
          },
          {
            message:
              'Password must contain at least one uppercase letter, one lowercase letter and one number.',
          },
        );
    }
    this.zodObject = zodObject;
    this.zodObject as ZodString;
    this.inputType = 'password';
    return this;
  }

  /**
   * Configures the field as a select input with the provided options and optional Zod schema.
   *
   * @param option - An array of strings or Option objects representing the selectable options.
   * @param zodObject - An optional Zod schema object for validating the selected option.
   *  If not provided, a default schema is created based on the type of the options.
   * @returns The current instance of the field for method chaining.
   *
   * ---
   *
   * @see {@link Option} for the interface used in the `option` argument.
   * @see {@link createEnumFromOptions} for creating a Zod schema from the provided options when no Zod schema is provided.
   */
  public select(
    option: string[] | Option[],
    zodObject?: ZodType<any, ZodTypeDef, any>,
  ): this {
    if (!zodObject || zodObject === undefined) {
      zodObject = this.createEnumFromOptions(option);
    }

    this.options = option;
    this.zodObject = zodObject;
    this.inputType = 'select';
    return this;
  }

  /**
   * Configures the field as a select autocomplete input.
   *
   * @param option - An array of strings or Option objects representing the selectable options.
   * @param zodObject - An optional Zod schema object for validation. If not provided, a schema will be created from the options.
   * If the options are strings, the schema will be an enum schema. If the options are objects, the schema will be based on the type of the `value` property.
   * @returns The current instance of the class for method chaining.
   *
   * ---
   *
   * @see {@link Option} for the interface used in the `option` argument.
   * @see {@link createEnumFromOptions} for creating a Zod schema from the provided options when no Zod schema is provided.
   */
  public selectAutocomplete(
    option: string[] | Option[],
    zodObject?: ZodType<any, ZodTypeDef, any>,
  ): this {
    if (!zodObject || zodObject === undefined) {
      zodObject = this.createEnumFromOptions(option);
    }

    this.options = option;
    this.zodObject = zodObject;
    this.inputType = 'selectAutocomplete';
    return this;
  }

  /**
   * Sets the input type to 'textarea' and optionally assigns a Zod validation schema.
   *
   * @param {ZodType<any, ZodTypeDef, String>} [zodObject] - Optional Zod validation schema for the textarea input. If not provided, defaults to a string schema.
   * @returns {this} The current instance of the class for method chaining.
   */
  public textarea(zodObject?: ZodType<any, ZodTypeDef, string>): this {
    if (!zodObject || zodObject === undefined) {
      zodObject = z.string();
    }
    this.inputType = 'textarea';
    return this;
  }

  /**
   * Sets the field type to 'date' and assigns a Zod date schema to the field.
   *
   * @param {ZodeDateType} [zodObject] - An optional Zod date schema object. If not provided, a default Zod date schema will be used.
   * Possible values for the schema are:
   * - **past**: The date must be in the past.
   * - **future**: The date must be in the future.
   * - **OlderThan**: The date must be more than a specified date. The schema must be an object with a `type` property set to 'moreThan' and a `value` property with the date to compare against.
   * - **LaterThan**: The date must be less than a specified date. The schema must be an object with a `type` property set to 'lessThan' and a `value` property with the date to compare against.
   * - A Zod schema object for date validation.
   * @returns {this} The current instance of the class for method chaining.
   *
   * @remarks OlderThan and LaterThan are used to compare the date with a specified date. he used type is SimpleDurationValues
   * SimpleDurationValues is an object with the following properties:
   * ```typescript
   * type SimpleDurationValues = {
   *    years?: number;
   *    months?: number;
   *    weeks?: number;
   *    days?: number;
   * }
   * ```
   *
   * ---
   *
   * @example
   * ```typescript
   *
   * const dateField = new Field('dateField').date('past'); ///on error return "Date must be in the past"
   * const dateField = new Field('dateField').date('future'); ///on error return "Date must be in the future"
   * const dateField = new Field('dateField').date({ type: 'LaterThan', value: { week: 1 } });
   * //on error return : "Date must be late than 1 week away"
   * const dateField = new Field('dateField').date({ type: 'OlderThan', value: { years: 18 } });
   * //on error return : "Date must be older than 18 years ago"
   *
   * // Version with Zod schema if you want more specific validation
   * const dateField = new Field('dateField').date(z.date().refine((date) => date > new Date(), { message: 'Date must be in the future' })); ///on error return "Date must be in the future"
   *```
   * ---
   * @see {@link ZodeDateType} for the possible values for the Zod date schema.
   * @see {@link defineZodDateType} for creating a Zod date schema based on the provided value.
   * @see {@link SimpleDurationValues} for the interface used in the `value` property of the `moreThan` and `lessThan` schemas.
   */
  public date(zodDateHelper?: ZodeDateType): this {
    if (!zodDateHelper || zodDateHelper === undefined) {
      zodDateHelper = z.date();
    } else {
      zodDateHelper = this.defineZodDateType(zodDateHelper);
    }
    this.zodObject = zodDateHelper;
    this.inputType = 'date';
    return this;
  }

  /**
   * **Date Range Picker**
   *
   * ---
   *
   * @param {ZodDateRangeType} [zodObject] - An optional Zod date range schema object. If not provided, a default Zod date range schema will be used.
   * Possible values for the schema are:
   * - **isBetween**: The difference between the chosen dates must be less than the specified duration. The schema must be an object with a `type` property set to 'isBetween' and a `value` property with the duration to compare against.
   * - **isOutside**: The difference between the chosen dates must be more than the specified duration. The schema must be an object with a `type` property set to 'isOutside' and a `value` property with the duration to compare against.
   * - A Zod schema object for date range validation.
   *
   *  *ZodShema need to be an object with the following properties:*
   *
   * ```typescript
   *       zodObject = z.object({
   *     from: z.date(),
   *     to: z.date(),
   *   });
   * ```
   *
   * ---
   *
   * @example
   *
   * ```typescript
   * const dateRangeField = new Field('dateRangeField').dateRange({ type: 'isBetween', { weeks: 1 }});
   * //on error return : "The difference between the chosen dates must be less than 1 week"
   *
   * const dateRangeField = new Field('dateRangeField').dateRange({ type: 'isOutside', { mouths: 1, years: 1 }});
   * //on error return : "The difference between the chosen dates must be more than 1 month and 1 year"
   *
   * // Version with Zod schema if you want more specific validation
   * const dateRangeField = new Field('dateRangeField').dateRange(z.object({
   *    from: z.date().refine((date) => date < new Date(), { message: 'Date must be in the past' }),
   *   to: z.date().refine((date) => date > new Date(), { message: 'Date must be in the future' }));
   * }));
   * ```
   */
  public dateRange(zodObject?: ZodDateRangeType): this {
    if (!zodObject || zodObject === undefined) {
      zodObject = z.object({
        from: z.date(),
        to: z.date(),
      });
    } else if (typeof zodObject === 'object' && 'type' in zodObject) {
      const { type, value } = zodObject;
      switch (type) {
        case 'isBetween':
          zodObject = z
            .object({
              from: z.date(),
              to: z.date(),
            })
            .superRefine((data, ctx) => {
              const { from, to } = data;
              if (from && to) {
                const constrainIsRespected = isBetween(from, to, value);
                if (!constrainIsRespected) {
                  ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `The difference between the chosen dates must be less than ${stringifyDuration(value)}`,
                  });
                }
              } else {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: "You must provide a 'from' and 'to' date",
                });
              }
            });

        case 'isOutside':
          zodObject = z
            .object({
              from: z.date(),
              to: z.date(),
            })
            .superRefine((data, ctx) => {
              const { from, to } = data;
              if (from && to) {
                const constrainIsRespected = !isBetween(from, to, value);
                if (!constrainIsRespected) {
                  ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `The difference between the chosen dates must be more than ${stringifyDuration(value)}`,
                  });
                }
              } else {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: "You must provide a 'from' and 'to' date",
                });
              }
            });
      }
    } else if (zodObject instanceof ZodType) {
      zodObject = zodObject;
    } else if (
      typeof zodObject === 'object' &&
      'from' in zodObject &&
      'to' in zodObject
    ) {
      zodObject = z.object({
        from: this.defineZodDateType(zodObject.from),
        to: this.defineZodDateType(zodObject.to),
      });
    } else {
      console.warn('Invalid date range type');
      zodObject = z.object({
        from: z.date(),
        to: z.date(),
      });
    }
    this.zodObject = zodObject;
    this.inputType = 'dateRange';
    return this;
  }

  /**
   * ** Field Type **
   *
   * @beta This method is still in beta and may change in the future.
   * ---
   * define the field type as radio
   */
  public radio(
    option: string[],
    zodObject?: ZodType<any, ZodTypeDef, any>,
  ): this {
    if (!zodObject || zodObject === undefined) {
      zodObject = this.createEnumFromOptions(option);
    }
    this.options = option;
    this.zodObject = zodObject;
    this.inputType = 'radio';
    return this;
  }

  /**
   * ** Field Type **
   *
   * ---
   * define the field type as checkbox
   */
  public checkbox(zodObject?: ZodType<any, ZodTypeDef, any>): this {
    if (!zodObject || zodObject === undefined) {
      zodObject = z.boolean();
    }
    this.zodObject = zodObject;
    this.inputType = 'checkbox';
    return this;
  }

  /**
   * ** Field Type **
   *
   * ---
   * define the field type as switch
   */
  public switch(zodObject?: ZodType<any, ZodTypeDef, any>): this {
    if (!zodObject || zodObject === undefined) {
      zodObject = z.boolean();
    }
    this.inputType = 'switch';
    return this;
  }

  /**
   * ** Field Type **
   *
   * ---
   * define the field type as file
   */
  public file(zodObject?: ZodType<any, ZodTypeDef, any>): this {
    if (!zodObject || zodObject === undefined) {
      zodObject = z.instanceof(File);
    }
    this.zodObject = zodObject;
    this.inputType = 'file';
    return this;
  }

  public fileDropZone(zodObject?: ZodType<any, ZodTypeDef, any>): this {
    if (!zodObject || zodObject === undefined) {
      zodObject = z.array(z.instanceof(File));
    }
    this.zodObject = zodObject;
    this.inputType = 'fileDropZone';
    return this;
  }

  /**
   * ** Field Type **
   *
   * ---
   * define the field type as number
   */
  public number(zodObject?: ZodType<any, ZodTypeDef, any>): this {
    if (!zodObject || zodObject === undefined) {
      zodObject = z
        .string()
        .refine((data) => !isNaN(Number(data)), {
          message: 'Invalid number',
        })
        .transform((data) => Number(data));
    }
    this.zodObject = zodObject;
    this.zodObject as ZodNumber;
    return this;
  }

  /**
   * **Field Type: Custom**
   *
   * ---
   * Allows defining a custom field using a React component. This method is useful for integrating custom components
   * into the form system while automatically wrapping the provided properties into the `props` key.
   *
   * ---
   * @template T - The type of the specific properties for the custom component.
   *
   * @param {React.ComponentType<CustomInputFieldElementParams<T>>} type
   * The React component to use as the custom field. This component must accept props conforming to `CustomInputFieldElementParams<T>`.
   *
   * @param {T} [props]
   * The specific properties to pass to the custom component. These properties will automatically be wrapped into the `props` key.
   * If no properties are provided, an empty object will be passed by default.
   *
   * @param {...React.ReactNode} children
   * Optional React children to include within the custom component.
   *
   * @returns {this} The current instance of the class, allowing method chaining.
   *
   * ---
   *
   * @remarks
   * - This method is useful for creating custom input fields that are not covered by the standard field types.
   * - It allows for greater flexibility and customization in the form system.
   * - The properties like `zFields`, `fieldProps`, and `index` will be dynamically injected into the cloned component.
   */
  public custom<T>(
    type: React.ComponentType<
      CustomInputFieldElementParams<
        T extends Record<string, any> ? T : Record<string, any>
      >
    >,
    props?: T,
    ...children: React.ReactNode[]
  ): this {
    this.inputType = 'custom';

    // Encapsuler automatiquement les propriétés dans un objet `props`
    const wrappedProps: CustomInputFieldElementParams<
      T extends Record<string, any> ? T : Record<string, any>
    > = {
      props: (props || {}) as T extends Record<string, any>
        ? T
        : Record<string, any>, // Si `props` est vide, on passe un objet vide
    };

    this.customInputFieldElement = React.createElement(
      type,
      wrappedProps,
      ...children,
    );
    return this;
  }

  /**
   * ** Field Type **
   *
   * ---
   * define the field type as tileSelector
   */
  public tileSelector(
    option: string[] | Option[],
    zodObject?: ZodType<any, ZodTypeDef, any>,
  ): this {
    // if the option is a string array, convert it to an array of options with the same value and label
    if (typeof option[0] === 'string') {
      option = (option as string[]).map((value) => {
        return { value, label: value } as Option;
      });
    }

    if (!zodObject || zodObject === undefined) {
      zodObject = this.createEnumFromOptions(option);
    }
    this.options = option;
    this.zodObject = zodObject;
    this.inputType = 'tileSelector';
    return this;
  }

  /**
   * ** Field Type **
   *
   * ---
   * define the field type as tileMultiSelector
   */
  public tileMultiSelector(
    option: string[] | Option[],
    zodObject?: ZodType<any, ZodTypeDef, any>,
  ): this {
    if (!zodObject || zodObject === undefined) {
      zodObject = this.createEnumFromOptions(option, true);
    }

    this.options = option;
    this.zodObject = zodObject;
    this.inputType = 'tileMultiSelector';
    return this;
  }

  /**
   * **MultiSelect**
   *
   * ---
   *
   * define the field type as multiSelect
   * @param option
   * @param zodObject
   * @returns
   */
  public multiSelect(
    option: string[] | Option[],
    zodObject?: ZodType<any, ZodTypeDef, any>,
  ): this {
    // if the option is a string array, convert it to an array of options with the same value and label
    if (typeof option[0] === 'string') {
      option = (option as string[]).map((value) => {
        return { value, label: value } as Option;
      });
    }
    if (!zodObject || zodObject === undefined) {
      zodObject = this.createEnumFromOptions(option, true);
    }
    this.options = option;
    this.zodObject = zodObject;
    this.inputType = 'multiSelect';
    return this;
  }

  /**
   * **Phone Number field**
   *
   * ---
   *
   * Define the field type as phoneNumber
   * @param zodObject
   * *optional zod object to validate the phone number, if not provided a default zod object will be used to validate the phone number on **international format***
   * @returns
   */
  public phoneNumber(zodObject?: ZodType<any, ZodTypeDef, any>): this {
    if (!zodObject || zodObject === undefined) {
      zodObject = z.string().refine((data) => {
        return data.match(
          /^\+((?:9[679]|8[035789]|6[789]|5[90]|42|3[578]|2[1-689])|9[0-58]|8[1246]|6[0-6]|5[1-8]|4[013-9]|3[0-469]|2[70]|7|1)(?:\W*\d){0,13}\d$/,
        );
      });
    }
    this.zodObject = zodObject;
    this.inputType = 'phoneNumber';
    return this;
  }

  /**
   * **Add childre JSX Element under the field**
   *
   * Set a component as children of the field
   *
   * @param children
   * @returns
   */
  public Children<T>(
    type: React.ComponentType<
      CustomInputFieldElementParams<
        T extends Record<string, any> ? T : Record<string, any>
      >
    >,
    props?: T,
    ...children: React.ReactNode[]
  ): this {
    // Encapsuler automatiquement les propriétés dans un objet `props`
    const wrappedProps: CustomInputFieldElementParams<
      T extends Record<string, any> ? T : Record<string, any>
    > = {
      props: (props || {}) as T extends Record<string, any>
        ? T
        : Record<string, any>, // Si `props` est vide, on passe un objet vide
    };

    this.children = React.createElement(type, wrappedProps, ...children);
    return this;
  }

  /**
   * **Disabled input**
   *
   * @param value Can be use a codition to enable or disable the field, by default the field is disabled
   * @returns
   */
  disable(value: boolean = true): this {
    this.disabled = value;
    return this;
  }

  /**
   * ** Hide input **
   *
   * @param value Can be use a codition to hide or show the field, by default the field is hidden
   * @returns
   */
  hide(value: boolean = true): this {
    this.isHide = value;
    return this;
  }

  /**
   * **Optionnal input**
   * @param value define the field as optional
   * @returns
   */
  optionnal(value: boolean = true): this {
    if (value) {
      this.zodObject = this.zodObject
        ? this.zodObject.optional()
        : z.any().optional();
    }
    return this;
  }

  /**
   * Define the field as nullable
   * @param value define the field as nullable or not by default the field is nullable
   * @returns
   */
  nullable(value: boolean = true): this {
    if (value) {
      this.zodObject = this.zodObject
        ? this.zodObject.nullable()
        : z.any().nullable();
    }
    return this;
  }

  /**
   * **Set error a single error message**
   *
   * ---
   *
   * Set a custom error message for the field. This method will override any previous error messages set for the field.
   * * @param message The error message to set for the field.
   * * @returns The current instance of the field for method chaining.
   *
   * ---
   *
   * *If you need to set complex error messages, you need to improve the setValidation method with a custom zod object.*
   */
  public err(message: string): this {
    if (this.zodObject) {
      this.zodObject = this.zodObject.refine(() => false, {
        message,
      });
    } else {
      this.zodObject = z.any().refine(() => false, {
        message,
      });
    }
    return this;
  }

  /** GETTER */

  getConfig(): Partial<FieldReactFormMaker> {
    return {
      inputName: this.inputName,
      label: this.label,
      placeholder: this.placeholder,
      defaultValues: this.defaultValues,
      zodObject: this.zodObject,
      inputType: this.inputType,
      options: this.options,
      className: this.className,
      isHide: this.isHide,
      disabled: this.disabled,
      fields: this.fields,
      legend: this.legend,
      legendClassName: this.legendClassName,
      description: this.description,
      isSecure: this.isSecure,
      children: this.children,
      customInputFieldElement: this.customInputFieldElement,
      props: this.props,
    };
  }

  /**
   * Get the field name
   * @returns
   */
  getName(): string {
    return this.inputName;
  }

  /**
   * Get the field type
   * @returns
   */
  getType(): InputType {
    return this.inputType;
  }

  /**
   * Get the field label
   * @returns
   */
  getLabel(): string | undefined {
    return this.label;
  }

  /**
   * Get the field placeholder
   * @returns
   */
  getPlaceholder(): string | undefined {
    return this.placeholder;
  }

  /**
   * Get the field default value
   * @returns
   */
  getDefaultValues(): any {
    return this.defaultValues;
  }

  getZodObject(): ZodType<any, ZodTypeDef, any> | undefined {
    return this.zodObject;
  }

  getOptions(): string[] | Option[] | undefined {
    return this.options;
  }

  getClassName(): string | undefined {
    return this.className;
  }

  isHidden(): boolean | undefined {
    return this.isHide;
  }

  isDisabled(): boolean | undefined {
    return this.disabled;
  }

  getFields():
    | (FieldReactFormMaker | DividerReactFormMaker | ReactFormMakerFieldset)[]
    | undefined {
    return this.fields;
  }

  getLegend(): string | undefined {
    return this.legend;
  }

  getLegendClassName(): string | undefined {
    return this.legendClassName;
  }

  getDescription(): string | undefined {
    return this.description;
  }

  hasSecure(): boolean | undefined {
    return this.isSecure;
  }

  getChildren(): React.ReactNode | undefined {
    return this.children;
  }

  getCustomInputFieldElement(): React.ReactNode | undefined {
    return this.customInputFieldElement;
  }

  getProps(): Record<string, any> | undefined {
    return this.props;
  }

  /**
   * Get the field value
   * @returns
   */
  getValue(): any {
    return this.props?.value;
  }

  /** SETTER */

  /**
   * Set the field name
   * @param value
   * @returns
   */
  setName(value: string): this {
    this.inputName = value;
    return this;
  }

  /**
   * Set the field label
   * @param value
   * @returns
   */
  setLabel(value: string): this {
    this.label = value;
    return this;
  }

  /**
   * Set the field placeholder
   * @param value
   * @returns
   */
  setPlaceholder(value: string): this {
    this.placeholder = value;
    return this;
  }

  /**
   * Set the field default value
   * @param value
   * @returns
   */
  setDefaultValues(value: any): this {
    this.defaultValues = value;
    return this;
  }

  /**
   * set if the field is disabled
   * @param value
   * @returns
   */
  setDisabled(value: boolean): this {
    this.disabled = value;
    return this;
  }

  /**
   * Set the field zod object
   * @param value
   * @returns
   */
  setValidation(value: ZodType<any, ZodTypeDef, any>): this {
    this.zodObject = value;
    return this;
  }
}
