import React from 'react';
import type {
  CompositeField,
  DividerReactFormMaker,
} from '../interfaces/FieldInterfaces';
import { Slottable } from '@radix-ui/react-slot';

interface DivElementFieldProps {
  elementField: DividerReactFormMaker;
  uuid: string;
  FormFieldsMap: (dataField: CompositeField[]) => (React.JSX.Element | null)[];
}

const DivElementField: React.FC<DivElementFieldProps> = ({
  elementField,
  uuid,
  FormFieldsMap,
}) => {
  return (
    <div
      key={uuid}
      className={`${elementField.className} ${elementField.isHide ? 'hidden' : ''}`}
    >
      {
        // Si l'élément comprend des sous-champs, on continue de les mapper
        elementField.fields && FormFieldsMap(elementField.fields)
      }
      <Slottable>
        {
          // Si le champ est de type custom, on clone l'élément JSX et on lui passe les props
          elementField.children &&
            React.cloneElement(elementField.children as React.ReactElement, {})
        }
      </Slottable>
    </div>
  );
};

export default DivElementField;
