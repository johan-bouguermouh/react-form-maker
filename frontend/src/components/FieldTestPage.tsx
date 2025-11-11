'use client';

import React from 'react';
import ReactFormMaker from '@/components/ReactFormMaker/ReactFormMaker';
import { CompositeField } from '@/components/ReactFormMaker/interfaces/FieldInterfaces';

interface TestExample {
  title: string;
  description: string;
  fields: CompositeField[];
  complexity: 'Simple' | 'Intermédiaire' | 'Avancé';
}

interface FieldProperty {
  property: string;
  type: string;
  required: boolean;
  description: string;
}

interface FieldTestPageProps {
  title: string;
  description: string;
  properties: FieldProperty[];
  examples: TestExample[];
  validationRules?: string[];
  usageNotes?: string[];
}

export default function FieldTestPage({
  title,
  description,
  properties,
  examples,
  validationRules = [],
  usageNotes = [],
}: FieldTestPageProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-lg text-gray-600">{description}</p>
      </div>

      {/* Documentation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          📋 Documentation
        </h2>

        {/* Properties Table */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Propriétés</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Propriété
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {properties.map((property, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600">
                      {property.property}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-800">
                      {property.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          property.required
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {property.required ? 'Oui' : 'Non'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {property.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Validation Rules */}
        {validationRules.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">
              🔒 Règles de validation
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              {validationRules.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Usage Notes */}
        {usageNotes.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">
              💡 Notes d'usage
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              {usageNotes.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Examples */}
      <div className="space-y-6">
        {examples.map((example, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {example.title}
              </h3>
              <span
                className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                  example.complexity === 'Simple'
                    ? 'bg-green-100 text-green-800'
                    : example.complexity === 'Intermédiaire'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                }`}
              >
                {example.complexity}
              </span>
            </div>

            <p className="text-gray-600 mb-6">{example.description}</p>

            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <ReactFormMaker
                formfields={example.fields}
                onSubmit={(data: any) => {
                  console.log(`${example.title} - Données soumises:`, data);
                  alert(`${example.title} - Voir la console pour les données`);
                }}
              >
                <button
                  type="submit"
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Tester la soumission
                </button>
              </ReactFormMaker>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
