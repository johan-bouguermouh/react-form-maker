export interface Option {
  value: string | number;
  label: string;
}

/**
 * **Type guard function to check if one option are of type `Option` or `string`.**
 * - - -
 * @param element - The element to check.
 * @returns {boolean} A boolean indicating whether the element is a `Option` type.
 * _is defined by the presence of the `value` property._
 */
export function isOption(element: string | Option): element is Option {
  return (element as Option).value !== undefined;
}

/**
 * **Function to extract the value from an option.**
 * - - -
 * @param option - The option to extract the value from.
 * @returns {string | number} The value of the option.
 * _If the option is a string, it returns the string itself._
 */
export function useValueOption(option: string | Option) {
  return isOption(option) ? option.value : option;
}

export function isOptionsArray(
  options: (string | Option)[] | undefined,
): options is Option[] {
  return Array.isArray(options) && options.every((option) => isOption(option));
}

/**
 * **Type guard function to check if all options are of type `Option` and not `string`.**
 * - - -
 * _This function is used when componenent needs to ensure that all options are of type `Option`._
 * @param options
 * @returns {Option[]} An array of options.
 */
export function mustBeArrayOfOptions(
  options: (string | Option)[] | undefined,
): Option[] {
  if (!options) {
    return [];
  }
  return options.filter(isOption);
}
