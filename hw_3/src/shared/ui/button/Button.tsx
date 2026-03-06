import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  fullWidth?: boolean
}

export const Button = ({
  variant = 'primary',
  fullWidth = false,
  children,
  className = '',
  ...rest
}: PropsWithChildren<ButtonProps>) => {
  const widthClassName = fullWidth ? 'button_full-width' : ''

  return (
    <button className={`button button_${variant} ${widthClassName} ${className}`.trim()} {...rest}>
      {children}
    </button>
  )
}
