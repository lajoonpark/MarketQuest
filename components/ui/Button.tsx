import * as React from 'react'

import { cn } from '@/lib/utils'

export const buttonVariants = ({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  className?: string
} = {}) =>
  cn(
    'inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-60',
    {
      'bg-indigo-500 text-white hover:bg-indigo-400': variant === 'primary',
      'border border-gray-700 bg-gray-900 text-white hover:bg-gray-800': variant === 'secondary',
      'text-gray-200 hover:bg-gray-800': variant === 'ghost',
      'bg-rose-500 text-white hover:bg-rose-400': variant === 'danger',
      'h-9 px-3 text-sm': size === 'sm',
      'h-10 px-4 text-sm': size === 'md',
      'h-12 px-5 text-base': size === 'lg',
    },
    className
  )

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, className })}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
