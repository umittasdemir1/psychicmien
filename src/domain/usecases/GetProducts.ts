import { Product } from '../entities/Product';
import { IProductRepository } from '../repositories/IProductRepository';

export class GetProducts {
  constructor(private repo: IProductRepository) {}

  async execute(featuredOnly = false): Promise<Product[]> {
    return featuredOnly ? this.repo.getFeatured() : this.repo.getAll();
  }
}
