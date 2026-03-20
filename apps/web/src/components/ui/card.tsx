import type { ReactNode, HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
}

export function Card({
  children,
  padding = 'md',
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      className={`
        bg-[rgba(255,250,243,0.9)] rounded-[24px] border border-white/60 backdrop-blur-sm
        shadow-[0_18px_45px_rgba(10,22,41,0.07)]
        ${paddingStyles[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      {children}
    </div>
  )
}

export function CardTitle({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <h3
      className={`text-sm font-semibold text-text-primary font-display ${className}`}
    >
      {children}
    </h3>
  )
}

export function CardValue({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p
      className={`text-2xl font-bold text-text-primary font-display tracking-tight ${className}`}
    >
      {children}
    </p>
  )
}
