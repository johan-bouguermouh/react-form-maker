import { FieldErrors } from 'react-hook-form';
import useFormGenConfigStep from './FormGenStep.config';
import FormDataStep from './FormGenStep.interface';
import ReactFormMaker from '@/components/ReactFormMaker/ReactFormMaker';
import { PhoneInput } from '@/components/ReactFormMaker/enhancements/PhoneInput';

function FormGenStep() {
  const { MyformConfig } = useFormGenConfigStep();

  function onSubmit(
    data: FormDataStep | false,
    errors: FieldErrors<FormDataStep> | false,
  ) {
    if (!errors) {
      console.log('Form submission success:', data);
    } else {
      console.log('Form submission failed:', errors);
    }
  }

  return (
    <div>
      <ReactFormMaker<FormDataStep>
        onSubmit={(data, err) => onSubmit(data, err)}
        formfields={MyformConfig}
        className="flex flex-col gap-4 p-4 rounded-lg shadow-lg mx-auto mt-4 bg-white"
        stepper={true}
      />
    </div>
  );
}

export default FormGenStep;
