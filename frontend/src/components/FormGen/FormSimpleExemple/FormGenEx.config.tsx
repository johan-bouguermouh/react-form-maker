import { z } from 'zod';
// import { ThisIsCustomField } from "./ThisIsCustomField";
import { useState } from 'react';
import GaugePassword from '../../GaugePassword';
import { ReactFormMakerFieldset } from '../../ReactFormMaker/interfaces/FieldInterfaces';
import { FormFieldEvent } from '../../ReactFormMaker/interfaces/FormFieldEvent';

interface ReturnUseApp {
  MyformConfig: ReactFormMakerFieldset[];
  toggleFieldSet: () => void;
  fieldSetisHide: boolean;
}

export default function useFormGenConfigEx(): ReturnUseApp {
  const [fieldSetisHide, setFieldSetisHide] = useState(true);

  function toggleFieldSet() {
    setFieldSetisHide(!fieldSetisHide);
  }

  const MyformConfig: ReactFormMakerFieldset[] = [
    {
      fieldset: 'User Information',
      // legend: "User Information",
      className: 'p-4 rounded-lg shadow-lg w-[600px]',
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
        {
          inputName: 'phoneNumber',
          inputType: 'phoneNumber',
          label: 'Phone Number',
          placeholder: 'Your Phone Number',
          zodObject: z.string().min(10, {
            message: 'Phone Number must be at least 10 characters.',
          }),
        },
        {
          inputName: 'username',
          label: 'Username',
          className: 'bg-green-200',
          placeholder: 'shadcn',
          defaultValues: 'Jhon',
          inputType: 'text',
          zodObject: z.string().min(2, {
            message: 'Username must be at least 2 characters.',
          }),
        },
        {
          inputName: 'DateRangePicker',
          label: 'Date Range Picker',
          className: 'form-input',
          inputType: 'dateRange',

          zodObject: z.object({
            from: z.date(),
            to: z.date(),
          }),
          onSelect: (e: FormFieldEvent) => {
            console.log(e);
          },
          defaultValues: {
            from: new Date(2024, 0, 10),
            to: new Date(2024, 0, 20),
          },
        },
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
            console.log(e.target.value);
          },
        },
        {
          inputName: 'Password',
          label: 'Password',
          className: 'form-input',
          placeholder: 'your password',
          inputType: 'password',
          zodObject: z.string().min(6, {
            message: 'Password must be at least 6 characters.',
          }),
          children: <GaugePassword props={{ exemple: 'Blabla' }} />,
          onBlur: (e: FormFieldEvent) => {
            if (e.form) {
              const password: string = e.form.getValues('Password') as string;
              const firstName: string = e.form.getValues('FistName') as string;
              const lastName: string = e.form.getValues('LastName') as string;

              if (firstName || lastName) {
                if (
                  password.includes(firstName) ||
                  password.includes(lastName)
                ) {
                  e.form.setError('Password', {
                    type: 'manual',
                    message:
                      'Password must not contain your first or last name.',
                  });
                }
              }
            }
          },
        },
        {
          inputName: 'validatePassword',
          label: 'Validate Password',
          className: 'form-input',
          placeholder: 'your password',
          inputType: 'password',
          // zObkect validate password doit être égale à password
          zodObject: z.string(),
          onBlur: (e: FormFieldEvent) => {
            if (!e.form) return;
            // on récupère le password
            const password: string = e.form.getValues('Password') as string;
            // on récupère le validatePassword
            const validatePassword: string = e.form.getValues(
              'validatePassword',
            ) as string;
            // Si le password est différent du validatePassword alors on trigger une erreur
            if (password !== validatePassword) {
              e.form.setError('validatePassword', {
                type: 'manual',
                message: 'Password must be the same.',
              });
            }
          },
        },
      ],
    },
    {
      fieldset: 'AdresseInformation',
      legend: 'Adresse Information',
      className: 'p-4 rounded-lg shadow-lg',
      fields: [
        {
          inputName: 'Address',
          label: 'Address',
          className: 'form-input',
          placeholder: 'Your Address',
          inputType: 'textarea',
          zodObject: z.string().min(10, {
            message: 'Address must be at least 10 characters.',
          }),
        },
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
              onBlur: (e: FormFieldEvent) => {
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
      fieldset: 'Other Information',
      legend: 'Other Information',
      className: 'p-4 rounded-lg shadow-lg',
      isHide: fieldSetisHide,
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
          zodObject: z.instanceof(File).refine((file) => file.size < 7000000, {
            message: 'Your resume must be less than 7MB.',
          }),
        },
      ],
    },
    {
      fieldset: 'Terms and Conditions',
      legend: 'Terms and Conditions',
      className: 'p-4 rounded-lg shadow-lg',
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

  return { MyformConfig, toggleFieldSet, fieldSetisHide };
}
