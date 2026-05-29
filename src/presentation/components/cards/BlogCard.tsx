import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '@/domain/entities/BlogPost';
import { formatDate, truncate } from '@/lib/utils';
import styles from './BlogCard.module.css';

interface BlogCardProps {
  post: BlogPost;
  lang: string;
}

export function BlogCard({ post, lang }: BlogCardProps) {
  const { title, slug, excerpt, coverImage, category, publishedAt } = post;

  return (
    <article className={styles.card}>
      {coverImage && (
        <div className={styles.imageWrapper}>
          <Image
            src={coverImage}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={styles.image}
            unoptimized
          />
        </div>
      )}
      <div className={styles.content}>
        {category && (
          <span className={styles.category}>{category}</span>
        )}
        <h3 className={styles.title}>
          <Link href={`/${lang}/blog/${slug}`} className={styles.titleLink}>
            {title}
          </Link>
        </h3>
        {excerpt && (
          <p className={styles.excerpt}>
            {truncate(excerpt, 120)}
          </p>
        )}
        {publishedAt && (
          <p className={styles.date}>
            {formatDate(publishedAt)}
          </p>
        )}
      </div>
    </article>
  );
}
