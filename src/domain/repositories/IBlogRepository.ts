import { BlogPost } from '../entities/BlogPost';

export interface IBlogRepository {
  getAll(publishedOnly?: boolean): Promise<BlogPost[]>;
  getBySlug(slug: string): Promise<BlogPost | null>;
  getByCategory(category: string): Promise<BlogPost[]>;
  create(data: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost>;
  update(id: string, data: Partial<BlogPost>): Promise<BlogPost>;
  delete(id: string): Promise<void>;
}
