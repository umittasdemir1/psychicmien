export interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  currency: string;
  imageUrl: string | null;
  etsyUrl: string;
  category: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}
