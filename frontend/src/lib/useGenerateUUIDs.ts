import { useMemo } from 'react';
import { v4 as uuidV4 } from 'uuid';

/**
 * Custom hook pour générer des UUIDs pour chaque élément d'un tableau.
 * @template T Le type des éléments du tableau.
 * @param {T[]} array - Le tableau pour lequel générer des UUIDs.
 * @returns {string[]} - Un tableau d'UUIDs.
 */
/**
 * Génère des clés stables pour chaque élément du tableau, en utilisant une propriété unique si possible.
 * Si aucune propriété unique n'est disponible, utilise le type + index comme fallback.
 */
export function useGenerateUUIDs<
  T extends { inputName?: string; name?: string },
>(array: T[]): string[] {
  return array.map(
    (item, idx) =>
      item.inputName ||
      item.name ||
      `${item.constructor?.name || 'item'}-${idx}`,
  );
}
