export type Element = 'fire' | 'earth' | 'air' | 'water';
export type Modality = 'cardinal' | 'fixed' | 'mutable';

export interface ZodiacSign {
  id: string;
  name: string;
  slug: string;
  symbol: string | null;
  element: Element | null;
  modality: Modality | null;
  rulingPlanet: string | null;
  dateRange: string | null;
  description: string | null;
  traits: string[];
  imageUrl: string | null;
}
