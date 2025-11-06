import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  elevated?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className = '', hover = false, elevated = false, onClick }: CardProps) {
  const baseStyles = 'bg-background-card dark:bg-background-dark-card rounded-lg p-8 transition-all duration-base';
  const hoverStyles = hover ? 'hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-dark-md cursor-pointer' : '';
  const elevatedStyles = elevated ? 'shadow-md dark:shadow-dark-md border-t-2 border-gold-500 dark:border-gold-dark-500' : 'shadow-sm dark:shadow-dark-sm';
  
  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${elevatedStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
