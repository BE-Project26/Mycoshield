import type { Screening } from '../types';
import { CATALOG, CONDITIONS, analyse } from '../data/conditions';

/**
 * Swap `mockScreeningService` for an implementation that sends the image to your
 * inference endpoint and maps the response (condition, confidence, scores, boxes) into a `Screening`.
 */
export interface ScreeningService {
  screen(file: File, batch: string): Promise<Screening>;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const mockScreeningService: ScreeningService = {
  async screen(file, batch) {
    await wait(2400);
    const condition = Math.random() < 0.4 ? 'Healthy' : CONDITIONS[Math.floor(Math.random() * CONDITIONS.length)];
    const info = CATALOG[condition];
    const confidence = Math.round((78 + Math.random() * 21) * 10) / 10;
    return {
      id: `MS-${Math.floor(1049 + Math.random() * 900)}`,
      date: new Date().toISOString(),
      imageUrl: URL.createObjectURL(file),
      condition, confidence, status: info.status, batch,
      findings: info.findings,
      recommendations: info.recommendations,
      ...analyse(condition, confidence, Math.floor(Math.random() * 9))
    };
  }
};
