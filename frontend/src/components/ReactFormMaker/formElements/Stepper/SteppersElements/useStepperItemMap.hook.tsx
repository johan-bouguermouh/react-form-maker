import React, { useCallback } from 'react';
import type {
  CompositeField,
  FieldReactFormMaker,
  ReactFormMakerStep,
} from '../../../interfaces/FieldInterfaces';
import { StepperItem } from './StepperItems';
import { isStepReactFormMaker } from '../../../utils/typeGuards/compositeField.TypeGuards';
import { H3, Lead } from '@/components/ui/Typography';

interface UseStepperItemsMapReturn {
  /**
   * ### Array of StepperItems components
   *
   * This function allows you to map the form fields to the StepperItems component.
   *
   * ---
   *
   *  #### StepperItem Content
   *
   * The StepperItem component is a component that allows you to display the content of the stepper :
   *  - The title of the step is displayed in a `H3` tag.
   *  - The legend of the step is displayed in a `Lead` tag. (optional, if the legend is not defined, the tag is not displayed)
   *  - Rest of fields are displayed by the `FieldReactFormMaker` present in the each `ReactFormMakerStep` object.
   *
   * ---
   *
   * For more information, see the {@link FieldReactFormMaker} and {@link ReactFormMakerStep} interfaces.
   *
   * @param formfields
   * @returns
   */
  StepperItemsMap: (
    formfields: CompositeField[],
  ) => (React.ReactElement<typeof StepperItem> | null)[];
}

export function useStepperItemsMap(
  FormFieldsMap: (dataField: CompositeField[]) => (React.JSX.Element | null)[],
): UseStepperItemsMapReturn {
  const StepperItemsMap = useCallback(
    (
      formfields: CompositeField[],
    ): (React.ReactElement<typeof StepperItem> | null)[] => {
      return formfields.map((element, index) => {
        if (isStepReactFormMaker(element)) {
          return (
            <StepperItem
              key={`stepper-${element.stepName}-${index}`}
              className={`${element.className} ${element.isHide ? 'hidden' : ''}`}
            >
              <H3 className={element?.legendClassName}>{element.stepName}</H3>
              {element?.legend && (
                <Lead className={element?.legendClassName}>
                  {element.legend}
                </Lead>
              )}
              {FormFieldsMap(element.fields as FieldReactFormMaker[])}
            </StepperItem>
          );
        }
        return null;
      });
    },
    [FormFieldsMap],
  );

  return { StepperItemsMap };
}
