import type { PropsWithChildren } from 'react'

interface CardProps {
  className?: string
}

export const Card = ({ children, className = '' }: PropsWithChildren<CardProps>) => {
  return <article className={`card ${className}`.trim()}>{children}</article>
}
