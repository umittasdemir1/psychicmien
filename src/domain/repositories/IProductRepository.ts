import { Product } from '../entities/Product';

export interface IProductRepository {
  getAll(): Promise<Product[]>;
  getFeatured(): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
  create(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product>;
  update(id: string, data: Partial<Product>): Promise<Product>;
  delete(id: string): Promise<void>;
}
