import { TarotCard } from '../entities/TarotCard';
import { ITarotRepository } from '../repositories/ITarotRepository';

export class GetTarotCards {
  constructor(private repo: ITarotRepository) {}

  async execute(): Promise<TarotCard[]> {
    return this.repo.getAll();
  }
}

export class GetTarotCard {
  constructor(private repo: ITarotRepository) {}

  async execute(slug: string): Promise<TarotCard | null> {
    return this.repo.getBySlug(slug);
  }
}
