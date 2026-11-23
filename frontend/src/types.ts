export type Condition =
  | 'Healthy'
  | 'Green mold (Trichoderma)'
  | 'Bacterial blotch'
  | 'Cobweb mold'
  | 'Yellowing / stress'
  | 'Dry bubble';

export type HealthStatus = 'healthy' | 'warning' | 'critical';

export interface Detection { label: string; x: number; y: number; w: number; h: number; score: number } // box in % of image
export interface ClassScore { label: string; value: number }
export interface User { name: string; email: string; farm?: string }

export interface Screening {
  id: string;
  date: string; // ISO
  imageUrl?: string;
  condition: Condition;
  confidence: number; // 0-100
  status: HealthStatus;
  batch: string;
  findings: string[];
  recommendations: string[];
  scores: ClassScore[];
  detections: Detection[];
}
