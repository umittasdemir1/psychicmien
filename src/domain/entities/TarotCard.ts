export type Arcana = 'major' | 'minor';
export type Suit = 'cups' | 'wands' | 'swords' | 'pentacles';

export interface TarotCard {
  id: string;
  name: string;
  slug: string;
  arcana: Arcana;
  suit: Suit | null;
  cardNumber: number | null;
  imageUrl: string | null;
  uprightMeaning: string | null;
  reversedMeaning: string | null;
  description: string | null;
  keywords: string[];
  createdAt: string;
}
