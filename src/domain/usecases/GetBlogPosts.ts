import { BlogPost } from '../entities/BlogPost';
import { IBlogRepository } from '../repositories/IBlogRepository';

export class GetBlogPosts {
  constructor(private repo: IBlogRepository) {}

  async execute(publishedOnly = true): Promise<BlogPost[]> {
    return this.repo.getAll(publishedOnly);
  }
}

export class GetBlogPost {
  constructor(private repo: IBlogRepository) {}

  async execute(slug: string): Promise<BlogPost | null> {
    return this.repo.getBySlug(slug);
  }
}
