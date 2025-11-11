'use client';

import React from 'react';
import Link from 'next/link';
import ReactFormMaker from '@/components/ReactFormMaker/ReactFormMaker';
import Field from '@/components/ReactFormMaker/FormFields/Class/FieldFactory/FieldFactory.class';
import FieldSet from '@/components/ReactFormMaker/FormFields/Class/Fieldset.class';
import { z } from 'zod';

export default function Home() {
  // Exemple de démonstration simple
  const demoFields = new FieldSet(
    'demonstration-principale',
    {
      legend: 'Démonstration Principale',
    },
    [
      new Field('name')
        .text(z.string().min(2, 'Au moins 2 caractères'))
        .setLabel('Nom complet')
        .setPlaceholder('Entrez votre nom'),
      new Field('email')
        .text(z.string().email('Email invalide'))
        .setLabel('Email'),
      new Field('age')
        .number(z.number().min(18, 'Au moins 18 ans'))
        .setLabel('Âge')
        .setPlaceholder('25'),
      new Field('country')
        .select(['France', 'Espagne', 'Italie', 'Allemagne'])
        .setLabel('Pays'),
      new Field('newsletter').checkbox().setLabel('Recevoir la newsletter'),
    ],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  ReactFormMaker
                </h1>
                <p className="text-sm text-gray-500">
                  Générateur de formulaires dynamiques
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link
                href="/test-simple"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                🧪 Test Simple
              </Link>
              <Link
                href="/field-tests"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Voir les tests N2N
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Créez des formulaires{' '}
            <span className="text-blue-600">dynamiques</span> en quelques lignes
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            ReactFormMaker utilise une API fluide avec validation Zod intégrée
            pour générer des formulaires complexes avec une approche déclarative
            et type-safe.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/test-simple"
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              🧪 Test Simple
            </Link>
            <Link
              href="/field-tests"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Explorer les composants
            </Link>
            <a
              href="https://github.com/johan-bouguermouh/react-form-maker"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Voir sur GitHub
            </a>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Fonctionnalités */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                🚀 Fonctionnalités principales
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 text-green-600 p-1 rounded">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      API Fluide & Type-Safe
                    </h4>
                    <p className="text-gray-600">
                      Classes Field, TextField, FieldSet avec chaînage de
                      méthodes
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 text-green-600 p-1 rounded">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      20+ Types de Champs
                    </h4>
                    <p className="text-gray-600">
                      Text, Password, Select, Date, File, Custom Components...
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 text-green-600 p-1 rounded">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Validation Zod Intégrée
                    </h4>
                    <p className="text-gray-600">
                      Validation automatique avec messages d'erreur
                      personnalisés
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 text-green-600 p-1 rounded">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      React Hook Form
                    </h4>
                    <p className="text-gray-600">
                      Performance optimisée avec validation temps réel
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 text-green-600 p-1 rounded">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Shadcn/ui & Tailwind
                    </h4>
                    <p className="text-gray-600">
                      Design system moderne et personnalisable
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Code Example */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                💻 Exemple de code
              </h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                <pre>{`// Création de champs avec l'API fluide
const emailField = new Field('email')
  .text(z.string().email('Email invalide'))
  .setLabel('Email')
  .getConfig();

const passwordField = new Field('password')
  .password(z.string().min(8, 'Au moins 8 caractères'))
  .setLabel('Mot de passe')
  .getConfig();

const fieldset = new FieldSet('login', {
  legend: 'Connexion'
}, [emailField, passwordField]);

// Rendu du formulaire
<ReactFormMaker
  formfields={[fieldset]}
  onSubmit={(data) => console.log(data)}
/>`}</pre>
              </div>
            </div>
          </div>

          {/* Demo Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              🎯 Démonstration interactive
            </h3>
            <ReactFormMaker
              formfields={[demoFields]}
              onSubmit={(data) => {
                console.log('Données du formulaire:', data);
                alert('Formulaire soumis ! Voir la console pour les données.');
              }}
              btnTextSubmit="Soumettre"
              className="space-y-4"
            />
          </div>
        </div>

        {/* Types de champs */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">
            📦 Types de champs disponibles
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                category: 'Texte et saisie',
                count: 5,
                icon: '📝',
                items: ['Text', 'Password', 'Textarea', 'Number', 'Phone'],
              },
              {
                category: 'Sélection',
                count: 6,
                icon: '🎯',
                items: [
                  'Select',
                  'Autocomplete',
                  'MultiSelect',
                  'Radio',
                  'Checkbox',
                  'Switch',
                ],
              },
              {
                category: 'Dates',
                count: 2,
                icon: '📅',
                items: ['Date', 'DateRange'],
              },
              {
                category: 'Visuels',
                count: 2,
                icon: '🎨',
                items: ['TileSelector', 'TileMultiSelector'],
              },
              {
                category: 'Fichiers',
                count: 2,
                icon: '📎',
                items: ['File', 'FileDropZone'],
              },
              {
                category: 'Avancé',
                count: 2,
                icon: '⚙️',
                items: ['Custom', 'FieldSet'],
              },
            ].map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">{category.icon}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {category.category}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {category.count} composants
                    </p>
                  </div>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  {category.items.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16 bg-blue-600 text-white rounded-xl p-8">
          <h3 className="text-2xl font-bold mb-4">
            Prêt à tester ReactFormMaker ?
          </h3>
          <p className="text-blue-100 mb-6">
            Explorez tous les types de champs avec nos tests interactifs de
            non-régression.
          </p>
          <Link
            href="/field-tests"
            className="bg-white text-secondary px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors inline-block"
          >
            Accéder aux tests N2N →
          </Link>
        </div>
      </div>
    </div>
  );
}
