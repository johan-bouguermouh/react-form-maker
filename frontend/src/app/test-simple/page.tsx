'use client';

import React from 'react';
import ReactFormMaker from '@/components/ReactFormMaker/ReactFormMaker';
import Field from '@/components/ReactFormMaker/FormFields/Class/FieldFactory/FieldFactory.class';
import FieldSet from '@/components/ReactFormMaker/FormFields/Class/Fieldset.class';
import { z } from 'zod';
import { TextField } from '@/components/ReactFormMaker/FormFields/Class/TextFields.class';

export default function TestSimplePage() {
  // Test super simple avec juste un champ
  const firstNameField = new Field('firstName')
    .text()
    .setLabel('Prénom')
    .setPlaceholder('Entrez votre prénom')
    .setValidation(
      z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
    );
  const lastNameField = new Field('lastName')
    .text()
    .setLabel('Nom de famille')
    .setPlaceholder('Entrez votre nom de famille')
    .setValidation(
      z
        .string()
        .min(2, 'Le nom de famille doit contenir au moins 2 caractères'),
    );

  const emailField = new TextField('email')
    .isEmail()
    .setLabel('Adresse e-mail')
    .setPlaceholder('Entrez votre adresse e-mail')
    .setValidation(z.string().email('Adresse e-mail invalide'));
  const passwordField = new Field('password')
    .password()
    .setLabel('Mot de passe')
    .setPlaceholder('Entrez votre mot de passe');

  const confirmPasswordField = new Field('confirmPassword')
    .password()
    .setLabel('Confirmer le mot de passe')
    .setPlaceholder('Confirmez votre mot de passe');

  const phoneNumberField = new Field('phoneNumber')
    .phoneNumber()
    .setLabel('Numéro de téléphone')
    .optionnal();

  const acceptTermsField = new Field('acceptTerms')
    .checkbox()
    .setLabel("J'accepte les termes et conditions");

  const personalInfoFieldSet = new Field('personalInfo')
    .textarea()
    .optionnal()
    .setPlaceholder('Informations personnelles supplémentaires');

  const handleSubmit = (data: any) => {
    console.log('Données du formulaire:', data);
    alert(`Formulaire soumis ! Vérifiez la console.
      ${JSON.stringify(data, null, 2)}
      `);
  };

  const inscriptionFieldSet = new FieldSet(
    'inscriptionForm',
    {
      legend: "Formulaire d'inscription",
    },
    [
      firstNameField,
      lastNameField,
      emailField,
      passwordField,
      confirmPasswordField,
      phoneNumberField,
      acceptTermsField,
      personalInfoFieldSet,
    ],
  );

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        🧪 Test Simple des Champs
      </h1>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Formulaire de test</h2>

        <ReactFormMaker
          formfields={[inscriptionFieldSet]}
          onSubmit={handleSubmit}
          btnTextSubmit="Soumettre"
        ></ReactFormMaker>
      </div>

      <div className="mt-8 bg-gray-100 rounded-lg p-4">
        <h3 className="font-semibold mb-2">📝 Instructions :</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Remplissez tous les champs</li>
          <li>• Les erreurs de validation s'affichent en rouge</li>
          <li>
            • Cliquez sur "Soumettre" pour voir les données dans la console
          </li>
        </ul>
      </div>
    </div>
  );
}
