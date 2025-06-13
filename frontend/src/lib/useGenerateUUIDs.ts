import { useMemo } from 'react';
import { v4 as uuidV4 } from 'uuid';

/**
 * Custom hook pour générer des UUIDs pour chaque élément d'un tableau.
 * @template T Le type des éléments du tableau.
 * @param {T[]} array - Le tableau pour lequel générer des UUIDs.
 * @returns {string[]} - Un tableau d'UUIDs.
 */
export function useGenerateUUIDs<T>(array: T[]): string[] {
  const uuids = useMemo(() => array.map(() => uuidV4()), [array.length]);
  return uuids;
}
