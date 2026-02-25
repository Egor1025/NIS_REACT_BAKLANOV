import type { SelectHTMLAttributes } from 'react'

export interface SelectOption<T extends string | number> {
  label: string
  value: T
}

interface SelectProps<T extends string | number>
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label: string
  options: ReadonlyArray<SelectOption<T>>
  value: T
  onChange: (nextValue: T) => void
}

export const Select = <T extends string | number>({
  label,
  options,
  value,
  onChange,
  id,
  className = '',
  ...rest
}: SelectProps<T>) => {
  const inputId = id ?? rest.name

  return (
    <label className="select-field" htmlFor={inputId}>
      <span className="select-field__label">{label}</span>
      <select
        id={inputId}
        className={`select-field__control ${className}`.trim()}
        value={String(value)}
        onChange={(event) => {
          const selectedOption = options.find((option) => String(option.value) === event.target.value)

          if (selectedOption) {
            onChange(selectedOption.value)
          }
        }}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
