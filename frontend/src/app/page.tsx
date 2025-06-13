'use client';
import FieldSet from '@/components/ReactFormMaker/FormFields/Class/Fieldset.class';
import { TextField } from '@/components/ReactFormMaker/FormFields/Class/TextFields.class';
import ReactFormMaker from '@/components/ReactFormMaker/ReactFormMaker';
import React from 'react';

export default function Home() {
  const emailField = new TextField('email').isEmail();
  const passwordField = new TextField('password').password().confirmPassword();

  const fieldset = new FieldSet(
    'login',
    {
      legend: 'Connexion',
    },
    [emailField, passwordField],
  );

  const formFields = [fieldset];

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-[url(https://visme.co/blog/wp-content/uploads/2017/07/50-Beautiful-and-Minimalist-Presentation-Backgrounds-042.jpg)] bg-cover bg-center">
      <ReactFormMaker
        formfields={formFields}
        onSubmit={(data) => console.log(data)}
        btnTextSubmit="Se connecter"
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-md"
      />
    </div>
  );
}
