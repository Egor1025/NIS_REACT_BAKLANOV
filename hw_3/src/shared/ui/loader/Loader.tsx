interface LoaderProps {
  centered?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export const Loader = ({ centered = false, size = 'md' }: LoaderProps) => {
  const centeredClassName = centered ? 'loader-wrapper_centered' : ''

  return (
    <div className={`loader-wrapper ${centeredClassName}`.trim()}>
      <span className={`loader loader_${size}`} aria-label="Loading" />
    </div>
  )
}
