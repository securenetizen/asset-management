import { cn } from '../../lib/utils';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function Loading({ size = 'medium', className }: LoadingProps) {
  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    medium: 'h-8 w-8 border-3',
    large: 'h-12 w-12 border-4',
  };
  
  return (
    <div className="flex items-center justify-center w-full h-full min-h-[200px]">
      <div className={cn(
        'animate-spin rounded-full border-t-transparent border-primary-600',
        sizeClasses[size],
        className
      )} />
    </div>
  );
}