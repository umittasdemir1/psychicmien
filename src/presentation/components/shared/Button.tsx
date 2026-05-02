import Link from 'next/link';
import { cn } from '@/lib/utils';
import styles from './Button.module.css';

type Variant = 'primary' | 'secondary' | 'accent' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: Variant;
  size?: Size;
  external?: boolean;
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(styles.btn, styles[variant], styles[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function LinkButton({ href, variant = 'primary', size = 'md', external, className, children, ...props }: LinkButtonProps) {
  const cls = cn(styles.btn, styles[variant], styles[size], className);
  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...props}>
      {children}
    </Link>
  );
}
