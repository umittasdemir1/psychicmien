import Image from 'next/image';
import { Product } from '@/domain/entities/Product';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  buyLabel: string;
}

export function ProductCard({ product, buyLabel }: ProductCardProps) {
  const { title, price, imageUrl, etsyUrl } = product;

  return (
    <article className={styles.card}>
      {imageUrl && (
        <div className={styles.imageWrapper}>
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={styles.image}
            unoptimized
          />
        </div>
      )}
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        {price && (
          <p className={styles.price}>
            ${price.toFixed(2)}
          </p>
        )}
        <a
          href={etsyUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className={styles.button}
        >
          {buyLabel}
        </a>
      </div>
    </article>
  );
}
