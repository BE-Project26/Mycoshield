import type { Condition, HealthStatus } from '../types';

export interface ConditionInfo {
  status: HealthStatus;
  color: string; // chart colour
  findings: string[];
  recommendations: string[];
}

export const CATALOG: Record<Condition, ConditionInfo> = {
  Healthy: {
    status: 'healthy',
    color: '#3d7352',
    findings: ['Even grey-to-cream cap colour', 'Firm, intact gill structure', 'No visible mould or lesions'],
    recommendations: ['Harvest at the usual stage', 'Keep humidity between 85–90%', 'Continue routine screening']
  },
  'Green mold (Trichoderma)': {
    status: 'critical',
    color: '#b4483a',
    findings: ['Green sporulating patches on substrate surface', 'White mycelium losing density near the patches', 'Pattern consistent with Trichoderma colonisation'],
    recommendations: ['Isolate the affected bag or block immediately', 'Remove nearby blocks showing early discolouration', 'Sanitise the room and review pasteurisation']
  },
  'Bacterial blotch': {
    status: 'warning',
    color: '#c8923b',
    findings: ['Brown, sunken blotches on cap surface', 'Slightly slimy texture indicated by glossy reflections', 'Lesions concentrated where water pooled'],
    recommendations: ['Lower surface moisture and improve airflow', 'Reduce misting frequency', 'Harvest unaffected mushrooms first']
  },
  'Cobweb mold': {
    status: 'warning',
    color: '#a2917a',
    findings: ['Fine, wispy grey-white growth over pins and caps', 'Growth spreads faster than normal mycelium', 'Early-stage cobweb pattern'],
    recommendations: ['Spot-treat with a light hydrogen peroxide mist', 'Increase fresh air exchange', 'Re-screen within 24 hours']
  },
  'Yellowing / stress': {
    status: 'warning',
    color: '#d9b45a',
    findings: ['Yellow tint along cap edges', 'Mild curling at the margins', 'No signs of pathogen growth'],
    recommendations: ['Check temperature and CO₂ levels', 'Reduce direct light exposure', 'Re-screen after the next flush']
  },
  'Dry bubble': {
    status: 'critical',
    color: '#6b5d4c',
    findings: ['Deformed, bulbous fruiting bodies', 'Pale, dry-looking tissue with uneven texture', 'Pattern consistent with Lecanicillium infection'],
    recommendations: ['Remove and bag infected fruiting bodies', 'Avoid moving them through clean areas', 'Disinfect tools between blocks']
  }
};

export const CONDITIONS = Object.keys(CATALOG) as Condition[];

/** Simulated per-class scores and detection boxes. Replace with model output. */
export function analyse(condition: Condition, confidence: number, seed = 1) {
  const others = CONDITIONS.filter((c) => c !== condition);
  const picks = others.slice(seed % others.length).concat(others).slice(0, 3);
  const rest = 100 - confidence;
  const weights = [0.55, 0.3, 0.15];
  const scores = [
    { label: condition, value: confidence },
    ...picks.map((label, i) => ({ label, value: Math.round(rest * weights[i] * 10) / 10 }))
  ];
  const spots = [[10, 16, 40, 48], [52, 8, 36, 44], [28, 50, 42, 40]];
  const detections = spots.slice(0, 1 + (seed % 3)).map(([x, y, w, h], i) => ({
    label: condition === 'Healthy' ? 'Healthy fruiting body' : condition,
    x, y, w, h, score: Math.max(60, Math.round(confidence - i * 3))
  }));
  return { scores, detections };
}
