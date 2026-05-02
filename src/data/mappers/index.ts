import { Product } from '../../domain/entities/Product';
import { BlogPost } from '../../domain/entities/BlogPost';
import { Horoscope } from '../../domain/entities/Horoscope';
import { TarotCard } from '../../domain/entities/TarotCard';
import { ZodiacSign } from '../../domain/entities/ZodiacSign';
import { Database } from '../supabase/types';

type ProductRow = Database['public']['Tables']['products']['Row'];
type BlogPostRow = Database['public']['Tables']['blog_posts']['Row'];
type HoroscopeRow = Database['public']['Tables']['horoscopes']['Row'];
type TarotCardRow = Database['public']['Tables']['tarot_cards']['Row'];
type ZodiacSignRow = Database['public']['Tables']['zodiac_signs']['Row'];

export function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: row.price,
    currency: row.currency,
    imageUrl: row.image_url,
    etsyUrl: row.etsy_url,
    category: row.category,
    isFeatured: row.is_featured,
    isPublished: row.is_published,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toBlogPost(row: BlogPostRow): BlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    coverImage: row.cover_image,
    category: row.category,
    tags: row.tags ?? [],
    isPublished: row.is_published,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toHoroscope(row: HoroscopeRow): Horoscope {
  return {
    id: row.id,
    sign: row.sign,
    period: row.period as Horoscope['period'],
    content: row.content,
    date: row.date,
    loveRating: row.love_rating,
    careerRating: row.career_rating,
    healthRating: row.health_rating,
    luckyNumber: row.lucky_number,
    luckyColor: row.lucky_color,
    createdAt: row.created_at,
  };
}

export function toTarotCard(row: TarotCardRow): TarotCard {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    arcana: row.arcana as TarotCard['arcana'],
    suit: row.suit as TarotCard['suit'],
    cardNumber: row.card_number,
    imageUrl: row.image_url,
    uprightMeaning: row.upright_meaning,
    reversedMeaning: row.reversed_meaning,
    description: row.description,
    keywords: row.keywords ?? [],
    createdAt: row.created_at,
  };
}

export function toZodiacSign(row: ZodiacSignRow): ZodiacSign {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    symbol: row.symbol,
    element: row.element as ZodiacSign['element'],
    modality: row.modality as ZodiacSign['modality'],
    rulingPlanet: row.ruling_planet,
    dateRange: row.date_range,
    description: row.description,
    traits: row.traits ?? [],
    imageUrl: row.image_url,
  };
}
