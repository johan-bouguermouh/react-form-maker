// hooks/useFormHandlers.ts
import {
  SubmitHandler,
  SubmitErrorHandler,
  FieldErrors,
  FieldValues,
} from 'react-hook-form';

interface userFormHandlerParams<T extends FieldValues> {
  /**
   * Function to be called when the form is submitted. This function will be called with the data or errors.
   * @param data Represents the data of the form when the form is submitted.
   * @param errors Represents the errors of the form when the form is submitted.
   * @returns
   */
  onSubmit: (data: false | T, errors: false | FieldErrors<T>) => void;
}

interface UseFormHandlersReturn<T extends FieldValues> {
  /**
   * Function to be called when the form is submitted.
   * This is an abstraction to the `onSubmit` function provided by the user. Used with OnInvalid and OnValid, this twin function will call the user's `onSubmit` function with the data or errors.
   * @param data
   */
  onValid: SubmitHandler<T>;
  /**
   * Function to be called when the form is submitted and has errors.
   * @param errors
   */
  onInvalid: SubmitErrorHandler<T>;
}

/**
 * Custom hook that returns the `onValid` and `onInvalid` functions to be called when the form is submitted.
 * @param onSubmit - The function to be called when the form is submitted.
 * @returns
 */
export function useFormHandlers<T extends FieldValues>({
  onSubmit,
}: userFormHandlerParams<T>): UseFormHandlersReturn<T> {
  const onValid: SubmitHandler<T> = (data: T) => {
    onSubmit(data, false);
  };

  const onInvalid: SubmitErrorHandler<T> = (errors: FieldErrors<T>) => {
    onSubmit(false, errors);
  };

  return { onValid, onInvalid };
}
