'use client';

import React from 'react';
import ReactFormMaker from '@/components/ReactFormMaker/ReactFormMaker';
import Field from '@/components/ReactFormMaker/FormFields/Class/FieldFactory/FieldFactory.class';
import FieldSet from '@/components/ReactFormMaker/FormFields/Class/Fieldset.class';
import { z } from 'zod';

export default function TestSimplePage() {
  // Test super simple avec juste un champ
  const fields = [
    new Field('name')
      .text(z.string().min(2, 'Au moins 2 caractères'))
      .setLabel('Votre nom')
      .setPlaceholder('Entrez votre nom')
      .getConfig(),

    new Field('email')
      .text(z.string().email('Email invalide'))
      .setLabel('Votre email')
      .setPlaceholder('email@example.com')
      .getConfig(),

    new Field('password')
      .password(z.string().min(6, 'Au moins 6 caractères'))
      .setLabel('Mot de passe')
      .setPlaceholder('Votre mot de passe')
      .getConfig(),
  ];

  const handleSubmit = (data: any) => {
    console.log('Données du formulaire:', data);
    alert('Formulaire soumis ! Vérifiez la console.');
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        🧪 Test Simple des Champs
      </h1>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Formulaire de test</h2>

        <ReactFormMaker formfields={fields} onSubmit={handleSubmit}>
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              ✅ Soumettre le formulaire
            </button>
          </div>
        </ReactFormMaker>
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
