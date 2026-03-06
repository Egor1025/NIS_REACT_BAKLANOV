import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const Input = ({ label, error, id, className = '', ...rest }: InputProps) => {
  const inputId = id ?? rest.name

  return (
    <label className="input-field" htmlFor={inputId}>
      <span className="input-field__label">{label}</span>
      <input id={inputId} className={`input-field__control ${className}`.trim()} {...rest} />
      {error ? <span className="input-field__error">{error}</span> : null}
    </label>
  )
}
