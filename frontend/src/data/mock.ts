import type { Condition, Screening } from '../types';
import { CATALOG, analyse } from './conditions';

const ago = (days: number, hours = 0) => new Date(Date.now() - days * 864e5 - hours * 36e5).toISOString();

const seed: [Condition, number, number, number, string][] = [
  ['Healthy', 97.2, 0, 2, 'B-214'],
  ['Green mold (Trichoderma)', 93.8, 0, 6, 'B-209'],
  ['Healthy', 95.4, 1, 1, 'B-214'],
  ['Bacterial blotch', 88.1, 1, 5, 'B-207'],
  ['Healthy', 98.0, 2, 3, 'B-212'],
  ['Yellowing / stress', 81.6, 2, 8, 'B-211'],
  ['Healthy', 96.3, 3, 2, 'B-212'],
  ['Cobweb mold', 86.9, 3, 7, 'B-205'],
  ['Healthy', 94.7, 4, 4, 'B-210'],
  ['Dry bubble', 90.2, 5, 1, 'B-203'],
  ['Healthy', 97.9, 5, 6, 'B-210'],
  ['Healthy', 92.5, 6, 3, 'B-208'],
  ['Bacterial blotch', 84.4, 7, 2, 'B-207'],
  ['Healthy', 96.8, 8, 5, 'B-206']
];

export const mockScreenings: Screening[] = seed.map(([condition, confidence, d, h, batch], i) => ({
  id: `MS-${1048 - i}`,
  date: ago(d, h),
  condition,
  confidence,
  status: CATALOG[condition].status,
  batch,
  findings: CATALOG[condition].findings,
  recommendations: CATALOG[condition].recommendations,
  ...analyse(condition, confidence, i)
}));

export const weeklyTrend = [
  { day: 'Mon', healthy: 18, issues: 3 },
  { day: 'Tue', healthy: 22, issues: 4 },
  { day: 'Wed', healthy: 19, issues: 2 },
  { day: 'Thu', healthy: 25, issues: 5 },
  { day: 'Fri', healthy: 27, issues: 3 },
  { day: 'Sat', healthy: 21, issues: 6 },
  { day: 'Sun', healthy: 24, issues: 2 }
];
