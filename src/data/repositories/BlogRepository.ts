import { SupabaseClient } from '@supabase/supabase-js';
import { BlogPost } from '../../domain/entities/BlogPost';
import { IBlogRepository } from '../../domain/repositories/IBlogRepository';
import { toBlogPost } from '../mappers';
import { Database } from '../supabase/types';

type DB = SupabaseClient<Database>;

export class BlogRepository implements IBlogRepository {
  constructor(private supabase: DB) {}

  async getAll(publishedOnly = true): Promise<BlogPost[]> {
    let query = this.supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false });
    if (publishedOnly) query = query.eq('is_published', true);
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map(toBlogPost);
  }

  async getBySlug(slug: string): Promise<BlogPost | null> {
    const { data, error } = await this.supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error) return null;
    return toBlogPost(data);
  }

  async getByCategory(category: string): Promise<BlogPost[]> {
    const { data, error } = await this.supabase
      .from('blog_posts')
      .select('*')
      .eq('category', category)
      .eq('is_published', true)
      .order('published_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(toBlogPost);
  }

  async create(input: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> {
    const { data, error } = await this.supabase
      .from('blog_posts')
      .insert({
        title: input.title,
        slug: input.slug,
        excerpt: input.excerpt,
        content: input.content,
        cover_image: input.coverImage,
        category: input.category,
        tags: input.tags,
        is_published: input.isPublished,
        published_at: input.publishedAt,
      })
      .select()
      .single();
    if (error) throw error;
    return toBlogPost(data);
  }

  async update(id: string, input: Partial<BlogPost>): Promise<BlogPost> {
    const { data, error } = await this.supabase
      .from('blog_posts')
      .update({
        ...(input.title !== undefined && { title: input.title }),
        ...(input.slug !== undefined && { slug: input.slug }),
        ...(input.excerpt !== undefined && { excerpt: input.excerpt }),
        ...(input.content !== undefined && { content: input.content }),
        ...(input.coverImage !== undefined && { cover_image: input.coverImage }),
        ...(input.category !== undefined && { category: input.category }),
        ...(input.tags !== undefined && { tags: input.tags }),
        ...(input.isPublished !== undefined && { is_published: input.isPublished }),
        ...(input.publishedAt !== undefined && { published_at: input.publishedAt }),
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return toBlogPost(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.from('blog_posts').delete().eq('id', id);
    if (error) throw error;
  }
}
