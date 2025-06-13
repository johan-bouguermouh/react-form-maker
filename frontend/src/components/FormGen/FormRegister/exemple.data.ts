import { Option } from '@/components/ReactFormMaker/enhancements/SelectAutocomplete';

/**
 * A simple dat informations of Cities
 *
 * ```ts
 * type element = {
 *    value: number;
 *    label: string;
 *    zipCode: string;
 * }
 *
 * ```
 */
const data: (Option & { zipCode: string })[] = [
  {
    value: 1,
    label: 'Paris',
    zipCode: '75000',
  },
  {
    value: 2,
    label: 'Marseille',
    zipCode: '13000',
  },
  {
    value: 3,
    label: 'Lyon',
    zipCode: '69000',
  },
  {
    value: 4,
    label: 'Toulouse',
    zipCode: '31000',
  },
  {
    value: 5,
    label: 'Nice',
    zipCode: '06000',
  },
];

export default data;
