'use client';

import { CodeBlock } from '@/components/CodeBlock';
import Field from '@/components/ReactFormMaker/FormFields/Class/FieldFactory/FieldFactory.class';
import FieldSet from '@/components/ReactFormMaker/FormFields/Class/Fieldset.class';
import { TextField } from '@/components/ReactFormMaker/FormFields/Class/TextFields.class';
import { ReactFormMakerStep } from '@/components/ReactFormMaker/interfaces/FieldInterfaces';
import ReactFormMaker from '@/components/ReactFormMaker/ReactFormMaker';
import { H3, H4, Lead, P } from '@/components/ui/Typography';
import Link from 'next/link';

export default function TestTextPage() {
  type FormData = {
    /** First step */
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
    /** second step */
    avatarUrl?: File;
    phoneNumber?: string;
    personalInfo?: string;
  };

  const textField = new TextField('namefield').setLabel('Insert a simple text');
  const stepp01: ReactFormMakerStep = {
    stepName: 'first Step',
    isStep: true,
    legend: 'Step 1: Basic Information',
    fields: [
      new TextField('firstname').setLabel('First Name').setPlaceholder('John'),
      new TextField('lastname').setLabel('Last Name').setPlaceholder('Doe'),
      new TextField('email')
        .isEmail()
        .setLabel('Email Address')
        .setPlaceholder('john.doe@example.com'),
      new TextField('password')
        .password()
        .setLabel('Password')
        .setPlaceholder('Enter your password'),
      new TextField('confirmPassword')
        .password()
        .setLabel('Confirm Password')
        .setPlaceholder('Re-enter your password'),
      new Field('acceptTerms')
        .checkbox()
        .setLabel('Accept Terms')
        .setPlaceholder(''),
    ],
  };

  const stepp02: ReactFormMakerStep = {
    stepName: 'second Step',
    isStep: true,
    legend: 'Step 2: Additional Information',
    fields: [
      new Field('avatarUrl')
        .file()
        .setLabel('Avatar URL')
        .setPlaceholder('Upload your avatar image'),
      new Field('phoneNumber')
        .phoneNumber()
        .setLabel('Phone Number')
        .setPlaceholder('Enter your phone number'),
      new TextField('personalInfo').textarea(),
    ],
  };
  return (
    <div className="max-w-2xl w-full mx-auto">
      <H3>TextField Class</H3>
      <p className="my-4">
        React Form Maker can be used to create stepper formular for mor user
        experience. The stepper mode in ReactFormMaker lets you build multi-step
        forms with guided user progression and per-step validation. Instead of
        displaying all fields at once, your form is split into logical
        steps—each validated independently—making complex data entry more
        manageable and user-friendly. Powered by React Hook Form, the stepper
        ensures robust state management, flexible customization, and a seamless
        developer experience for building advanced, interactive forms.
      </p>
      <hr className="my-4" />
      <H4 className="my-4" id="basic-usage">
        Basic Usage
      </H4>
      <Lead className="my-4 text-xs">
        TextField uses method chaining, each setter returns the field itself.
        This lets you build and customize fields in a single, readable line,
        making form setup fast and flexible.
      </Lead>
      <CodeBlock src="./src/app/test-simple/text/page.tsx">
        {`const yourStep: ReactFormMakerStep = {
  stepName: 'first Step',
  isStep: true,
  legend: 'Step 1: Basic Information',
  fields: [
    new TextField('firstname').setLabel('First Name')
    new TextField('lastname').setLabel('Last Name'),
    new TextField('email').isEmail().setLabel('Email Address')
  ]};
  
  ...

  <ReactFormMaker<FormData>
    formfields={[yourStep]} // You can pass multiple steps like FieldSet
    stepper={true} // enable stepper mode
    onSubmit={(data, error) => {}}
    orientation="horizontal" // or vertical
    className="p-4 bg-white rounded-xl shadow-md"
    btnTextSubmit="Tester"
  />

  `}
      </CodeBlock>

      <ReactFormMaker<FormData>
        formfields={[stepp01, stepp02]}
        stepper={true}
        orientation="vertical"
        className="w-full m-0 max-h-[80vh]"
        onSubmit={(data, error) => {
          if (error) return;
          if (!data) return;
          console.log('Données du formulaire:', data);
          alert(`Formulaire soumis ! Vérifiez la console.
      ${JSON.stringify(data, null, 2)}
      `);
        }}
        btnTextSubmit="Tester"
      />
    </div>
  );
}
