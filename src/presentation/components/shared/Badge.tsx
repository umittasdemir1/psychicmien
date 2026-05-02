import { cn } from '@/lib/utils';
import styles from './Badge.module.css';

type BadgeVariant = 'default' | 'primary' | 'accent' | 'fire' | 'earth' | 'air' | 'water';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn(styles.badge, styles[variant], className)}>
      {children}
    </span>
  );
}
