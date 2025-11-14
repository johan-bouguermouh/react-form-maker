import type {
  CompositeField,
  DividerReactFormMaker,
  FieldReactFormMaker,
  ReactFormMakerFieldset,
  ReactFormMakerStep,
} from '../../interfaces/FieldInterfaces';

export function isCompositeField(element: unknown): element is CompositeField {
  return (element as CompositeField).fields !== undefined;
}

/**
 * **Type guard function to check if a given element is of type `FieldReactFormMaker`.**
 * - - -
 * @param element - The element to check.
 * @returns {boolean} A boolean indicating whether the element is a `FieldReactFormMaker`.
 * is defined by the presence of the `inputName` property.
 */
export function isFieldReactFormMaker(
  element: CompositeField,
): element is FieldReactFormMaker {
  return (element as FieldReactFormMaker).inputName !== undefined;
}

/**
 *  **Type guard function to check if a given element is of type `DividerReactFormMaker`.**
 * is defined by the presence of the `isDiv` property.
 * - - -
 * @param element - The element to check.
 * @returns {boolean} A boolean indicating whether the element is a `DividerReactFormMaker`.
 *
 */
export function isDividerReactFormMaker(
  element: CompositeField,
): element is DividerReactFormMaker {
  return (element as DividerReactFormMaker).isDiv !== undefined;
}

/**
 *  **Type guard function to check if a given element is of type `ReactFormMakerFieldset`.**
 *  Is defined by the presence of the `fieldset` property.
 * - - -
 * @param element  - The element to check.
 * @returns {boolean} A boolean indicating whether the element is a `ReactFormMakerFieldset`.
 */
export function isReactFormMakerFieldset(
  element: CompositeField,
): element is ReactFormMakerFieldset {
  return (element as ReactFormMakerFieldset).fieldset !== undefined;
}

/**
 *  ** Type guard function to check if a given element is of type `ReactFormMakerStep`.**
 *  Is defined by the presence of the `isStep` or `stepName` property.
 * - - -
 * @param element - The element to check.
 * @returns {boolean} A boolean indicating whether the element is a `ReactFormMakerStep`.
 */
export function isStepReactFormMaker(
  element: CompositeField,
): element is ReactFormMakerStep {
  return (
    (element as ReactFormMakerStep).isStep !== undefined ||
    (element as ReactFormMakerStep).stepName !== undefined
  );
}
