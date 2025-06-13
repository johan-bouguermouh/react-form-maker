import { z } from 'zod';
import { DogIcon } from 'lucide-react';
import { FormFieldEvent } from '../../ReactFormMaker/interfaces/FormFieldEvent';
import { ReactFormMakerStep } from '@/components/ReactFormMaker/interfaces/FieldInterfaces';
import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { useStepper } from '@/components/ReactFormMaker/formElements/Stepper/StepperContext';
import { Button } from '@/components/ui/button';
import { CustomInputFieldElementParams } from '@/components/ReactFormMaker/interfaces/CustomInputFieldElementParams';
import { TileMultiSelectorProps } from '@/components/ReactFormMaker/enhancements/TileSelector/TileMultiSelector';
import TileMultiSelectorInput from '@/components/ReactFormMaker/inputs/TileMultiselectorInput';
import { TextField } from '@/components/ReactFormMaker/FormFields/Class/TextFields.class';

interface ReturnStepExempleFormConfig {
  MyformConfig: ReactFormMakerStep[];
}

const AdditionnalButtonFooterStepper = () => {
  const { getCurrentStep, goToStep, getFieldStatesBySteps, form } =
    useStepper();

  const handleOnclik = (e: any) => {
    console.log(getFieldStatesBySteps());
    form.getFieldState;
  };

  return (
    <Button
      className="btn btn-primary"
      type="button"
      onClick={(e) => handleOnclik(e)}
    >
      This is a custom button
    </Button>
  );
};

const CustomTileMultiSelector = (
  params: Partial<
    CustomInputFieldElementParams<Partial<TileMultiSelectorProps>>
  >,
) => {
  const { fieldProps, zFields, index, props } = params;

  if (!fieldProps || !zFields) {
    return null;
  }

  return (
    <>
      <TileMultiSelectorInput
        zFields={zFields}
        fieldProps={fieldProps}
        indexField={index ? index : ''}
        icon={<DogIcon />}
      />
    </>
  );
};

export default function useFormGenConfigStep(): ReturnStepExempleFormConfig {
  const [name, setName] = useState<string>('');

  const MyformConfig: ReactFormMakerStep[] = [
    {
      stepName: 'user information',
      isStep: true,
      legend: 'A simple légende of user information',
      isStrict: true,
      disabledBefore: true,
      buttonNextContent: 'This i stou volonties',
      // additionalButtons: <AdditionnalButtonFooterStepper />,
      footerClassName: 'flex sm:flex-col sm:align-center gap-2 ',
      fields: [
        {
          isDiv: true,
          className:
            'flex justify-center gap-4 items-center transform scale-110',
          isHide: false,
          children: (
            <div className="flex flex-col items-center gap-4">
              <img src="/vite.svg" alt="vite logo" />
              <h1 className="text-2xl font-bold">Welcome to Vite</h1>
            </div>
          ),
        },
        new TextField('email').isEmail(),
        {
          isDiv: true,
          className: 'flex justify-space-between gap-4',
          isHide: false,
          fields: [
            {
              inputName: 'FistName',
              label: 'First Name',
              className: 'form-input',
              placeholder: 'Your First Name',
              inputType: 'text',
              zodObject: z.string().min(2, {
                message: 'First Name must be at least 2 characters.',
              }),
            },
            {
              inputName: 'LastName',
              label: 'Last Name',
              className: 'form-input',
              placeholder: 'Your Last Name',
              inputType: 'text',
              zodObject: z.string().min(2, {
                message: 'Last Name must be at least 2 characters.',
              }),
            },
          ],
        },
        {
          inputName: 'BirthDate',
          label: 'Birth Date',
          className: 'form-input',
          placeholder: 'Your Birth Date',
          inputType: 'date',
          zodObject: z.date().refine((date) => date < new Date(), {
            message: 'Birth Date must be less than today',
          }),
        },
        {
          inputName: 'email',
          label: 'Email',
          className: 'form-input',
          placeholder: 'your email',
          inputType: 'text',
          zodObject: z.string().email({
            message: 'Email is not valid.',
          }),
          onSelect: (e: React.FocusEvent<HTMLInputElement>) => {
            console.log('toto');
          },
        },
      ],
    },
    {
      stepName: 'Adresse Information',
      legend: `Hello ${name}, please enter your address information`,
      IconStep: MapPin,

      fields: [
        {
          isDiv: true,
          className: 'flex justify-space-between gap-4',
          isHide: false,
          fields: [
            {
              inputName: 'zipCode',
              label: 'Zip Code',
              className: 'form-input',
              placeholder: 'Your Zip Code',
              inputType: 'number',
              description: 'Enter zip code 13000 to see the magic',
              zodObject: z.string().min(5, {
                message: 'Zip Code must be at least 5 characters.',
              }),
              onChange: (e: FormFieldEvent) => {
                if (!e.form) return;
                if (e.form.getValues('zipCode') === '13000') {
                  e.form.setValue('city', 'Marseille');
                }
              },
            },
            {
              inputName: 'city',
              label: 'City',
              className: 'form-input',
              placeholder: 'Your City',
              inputType: 'text',
              zodObject: z.string().min(2, {
                message: 'City must be at least 2 characters.',
              }),
            },
          ],
        },
      ],
    },
    {
      stepName: 'Other Information',
      legend: 'Other Information',
      isStrict: true,
      fields: [
        {
          inputName: 'typeOfAccount',
          label: 'Type of account',
          className: 'form-input',
          placeholder: 'Your Type of account',
          defaultValues: 'free',
          inputType: 'radio',
          options: ['free', 'premium', 'gold'],
          zodObject: z.enum(['free', 'premium', 'gold']),
        },
        {
          inputName: 'newsletter',
          label: 'I want to receive the newsletter',
          className: 'form-input',
          inputType: 'switch',
          defaultValues: false,
          zodObject: z.boolean(),
        },
        {
          inputName: 'avatarFile',
          label: 'Upload your avatar',
          className: 'form-input',
          inputType: 'file',
          zodObject: z
            .instanceof(File)
            .refine((file) => file.size < 7000000, {
              message: 'Your resume must be less than 7MB.',
            })
            .optional(),
        },
      ],
    },
    {
      stepName: 'Terms and Conditions',
      legend: 'Terms and Conditions',
      fields: [
        {
          inputName: 'acceptTerms',
          label: 'I accept the terms and conditions',
          className: 'form-input',
          inputType: 'checkbox',
          zodObject: z.boolean().optional(),
        },
      ],
    },
  ];

  return { MyformConfig };
}
