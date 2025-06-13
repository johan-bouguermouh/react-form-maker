import React from 'react';
import useFormGenConfigEx from './FormGenEx.config';
import { FieldErrors } from 'react-hook-form';
import ReactFormMaker from '../../ReactFormMaker/ReactFormMaker';
import { Button } from '../../ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import FormDataExemple from './FormGenEx.interface';

function FormGenEx() {
  const { MyformConfig, fieldSetisHide, toggleFieldSet } = useFormGenConfigEx();

  function onSubmit(
    data: FormDataExemple | false,
    errors: FieldErrors<FormDataExemple> | false,
  ) {
    if (!errors) {
      console.log('Form submission success:', data);
    } else {
      console.log('Form submission failed:', errors);
    }
  }

  function handleReloadClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    (e.target as HTMLButtonElement).form?.reset();
  }

  return (
    <ReactFormMaker<FormDataExemple>
      onSubmit={(data, err) => onSubmit(data, err)}
      formfields={MyformConfig}
      className="flex flex-col gap-4 p-4 rounded-lg shadow-lg mx-auto mt-4 bg-white"
      footerClassName="flex justify-end gap-4"
    >
      <Button
        type="button"
        className="btn btn-primary"
        onClick={(e) => handleReloadClick(e)}
      >
        <ReloadIcon />
      </Button>
      <Button
        type="button"
        className="btn btn-primary"
        onClick={toggleFieldSet}
      >
        <span>{fieldSetisHide ? 'Show' : 'Hide'}</span>
      </Button>
    </ReactFormMaker>
  );
}

export default FormGenEx;
