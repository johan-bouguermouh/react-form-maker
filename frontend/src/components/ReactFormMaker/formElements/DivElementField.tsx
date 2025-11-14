import React, { useMemo } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { Slottable } from '@radix-ui/react-slot';
import type {
  CompositeField,
  DividerReactFormMaker,
} from '../interfaces/FieldInterfaces';

interface DivElementFieldProps {
  elementField: DividerReactFormMaker;
  FormFieldsMap: (dataField: CompositeField[]) => (React.JSX.Element | null)[];
}

const DivElementField: React.FC<DivElementFieldProps> = ({
  elementField,
  FormFieldsMap,
}) => {
  const uuid = useMemo(() => {
    return uuidV4();
  }, []);

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
