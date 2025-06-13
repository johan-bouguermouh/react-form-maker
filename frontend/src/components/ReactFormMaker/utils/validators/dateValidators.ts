export interface SimpleDurationValues {
  days?: number;
  weeks?: number;
  months?: number;
  years?: number;
}

/**
 * **isOlderThan**
 * Vérifie si la date de naissance est antérieure à une date calculée en soustrayant un certain nombre d'années, de mois et de jours de la date actuelle.
 *
 * @param {Date} birthDate - La date de naissance sous forme d'objet Date.
 * @param {SimpleDurationValues} comparisonDate - La différence en années, mois et jours.
 * @returns {boolean} `true` si la date de naissance est antérieure à la date calculée, `false` sinon.
 *
 * ---
 *
 * #### Exemple
 *
 * ##### Utilisation simple
 *
 * ```typescript
 * const birthDate = new Date('1990-01-01');
 * const comparisonDate = { years: 18 };
 * const isAdult = isOlderThan(birthDate, comparisonDate);
 * console.log(isAdult); // retourn true
 * ```
 *
 * ##### Autre Exemple d'utilisation
 *
 * ```typescript
 * // On verfie si la date est supérieure à 1 an et 6 mois
 * const birthDate = new Date('2024-01-01');
 * const comparisonDate = { years: 1, months: 6 };
 * const isOlder = isOlderThan(birthDate, comparisonDate);
 * console.log(isOlder); // retourne true
 *
 * // ou aussi
 * const secondComparisonDate = { months: 18 };
 * const isOlder = isOlderThan(birthDate, secondComparisonDate);
 * console.log(isOlder); // retourne true
 * ```
 */
const isOlderThan = (
  birthDate: Date,
  comparisonDate: SimpleDurationValues,
): boolean => {
  const now = new Date();
  const comparison = new Date(
    now.getFullYear() - (comparisonDate.years || 0),
    now.getMonth() - (comparisonDate.months || 0),
    now.getDate() - (comparisonDate.days || 0),
  );
  if (comparisonDate.weeks) {
    comparison.setDate(comparison.getDate() - comparisonDate.weeks * 7);
  }
  return birthDate.getTime() < comparison.getTime();
};

const islaterThan = (
  birthDate: Date,
  comparisonDate: SimpleDurationValues,
): boolean => {
  const now = new Date();
  const comparison = new Date(
    now.getFullYear() + (comparisonDate.years || 0),
    now.getMonth() + (comparisonDate.months || 0),
    now.getDate() + (comparisonDate.days || 0),
  );
  if (comparisonDate.weeks) {
    comparison.setDate(comparison.getDate() + comparisonDate.weeks * 7);
  }
  return birthDate.getTime() > comparison.getTime();
};

const isBetween = (
  from: Date,
  to: Date,
  comparisonDate: SimpleDurationValues,
): boolean => {
  const comparison = new Date(
    from.getFullYear() + (comparisonDate.years || 0),
    from.getMonth() + (comparisonDate.months || 0),
    from.getDate() + (comparisonDate.days || 0),
  );
  if (comparisonDate.weeks) {
    comparison.setDate(comparison.getDate() + comparisonDate.weeks * 7);
  }
  return to.getTime() > comparison.getTime();
};

export { isOlderThan, islaterThan, isBetween };
