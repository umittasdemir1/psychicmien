import { SupabaseClient } from '@supabase/supabase-js';
import { Product } from '../../domain/entities/Product';
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { toProduct } from '../mappers';
import { Database } from '../supabase/types';

type DB = SupabaseClient<Database>;

export class ProductRepository implements IProductRepository {
  constructor(private supabase: DB) {}

  async getAll(): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return (data ?? []).map(toProduct);
  }

  async getFeatured(): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('is_published', true)
      .eq('is_featured', true)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return (data ?? []).map(toProduct);
  }

  async getById(id: string): Promise<Product | null> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return toProduct(data);
  }

  async create(input: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const { data, error } = await this.supabase
      .from('products')
      .insert({
        title: input.title,
        description: input.description,
        price: input.price,
        currency: input.currency,
        image_url: input.imageUrl,
        etsy_url: input.etsyUrl,
        category: input.category,
        is_featured: input.isFeatured,
        is_published: input.isPublished,
        sort_order: input.sortOrder,
      })
      .select()
      .single();
    if (error) throw error;
    return toProduct(data);
  }

  async update(id: string, input: Partial<Product>): Promise<Product> {
    const { data, error } = await this.supabase
      .from('products')
      .update({
        ...(input.title !== undefined && { title: input.title }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.price !== undefined && { price: input.price }),
        ...(input.imageUrl !== undefined && { image_url: input.imageUrl }),
        ...(input.etsyUrl !== undefined && { etsy_url: input.etsyUrl }),
        ...(input.category !== undefined && { category: input.category }),
        ...(input.isFeatured !== undefined && { is_featured: input.isFeatured }),
        ...(input.isPublished !== undefined && { is_published: input.isPublished }),
        ...(input.sortOrder !== undefined && { sort_order: input.sortOrder }),
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return toProduct(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.from('products').delete().eq('id', id);
    if (error) throw error;
  }
}
