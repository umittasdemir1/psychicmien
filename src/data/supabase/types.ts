export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          user_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          price: number | null;
          currency: string;
          image_url: string | null;
          etsy_url: string;
          category: string | null;
          is_featured: boolean;
          is_published: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          price?: number | null;
          currency?: string;
          image_url?: string | null;
          etsy_url: string;
          category?: string | null;
          is_featured?: boolean;
          is_published?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          price?: number | null;
          currency?: string;
          image_url?: string | null;
          etsy_url?: string;
          category?: string | null;
          is_featured?: boolean;
          is_published?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string | null;
          cover_image: string | null;
          category: string | null;
          tags: string[];
          is_published: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content?: string | null;
          cover_image?: string | null;
          category?: string | null;
          tags?: string[];
          is_published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string | null;
          content?: string | null;
          cover_image?: string | null;
          category?: string | null;
          tags?: string[];
          is_published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      horoscopes: {
        Row: {
          id: string;
          sign: string;
          period: string;
          content: string;
          date: string;
          love_rating: number | null;
          career_rating: number | null;
          health_rating: number | null;
          lucky_number: number | null;
          lucky_color: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          sign: string;
          period: string;
          content: string;
          date: string;
          love_rating?: number | null;
          career_rating?: number | null;
          health_rating?: number | null;
          lucky_number?: number | null;
          lucky_color?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          sign?: string;
          period?: string;
          content?: string;
          date?: string;
          love_rating?: number | null;
          career_rating?: number | null;
          health_rating?: number | null;
          lucky_number?: number | null;
          lucky_color?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      tarot_cards: {
        Row: {
          id: string;
          name: string;
          slug: string;
          arcana: string;
          suit: string | null;
          card_number: number | null;
          image_url: string | null;
          upright_meaning: string | null;
          reversed_meaning: string | null;
          description: string | null;
          keywords: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          arcana: string;
          suit?: string | null;
          card_number?: number | null;
          image_url?: string | null;
          upright_meaning?: string | null;
          reversed_meaning?: string | null;
          description?: string | null;
          keywords?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          arcana?: string;
          suit?: string | null;
          card_number?: number | null;
          image_url?: string | null;
          upright_meaning?: string | null;
          reversed_meaning?: string | null;
          description?: string | null;
          keywords?: string[];
          created_at?: string;
        };
        Relationships: [];
      };
      zodiac_signs: {
        Row: {
          id: string;
          name: string;
          slug: string;
          symbol: string | null;
          element: string | null;
          modality: string | null;
          ruling_planet: string | null;
          date_range: string | null;
          description: string | null;
          traits: string[];
          image_url: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          symbol?: string | null;
          element?: string | null;
          modality?: string | null;
          ruling_planet?: string | null;
          date_range?: string | null;
          description?: string | null;
          traits?: string[];
          image_url?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          symbol?: string | null;
          element?: string | null;
          modality?: string | null;
          ruling_planet?: string | null;
          date_range?: string | null;
          description?: string | null;
          traits?: string[];
          image_url?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
