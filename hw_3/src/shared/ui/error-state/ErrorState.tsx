import { Button } from '@/shared/ui/button/Button'

interface ErrorStateProps {
  message: string
  retryLabel?: string
  onRetry?: () => void
}

export const ErrorState = ({ message, retryLabel = 'Retry', onRetry }: ErrorStateProps) => {
  return (
    <div className="state-block state-block_error" role="alert">
      <p>{message}</p>
      {onRetry ? (
        <Button variant="secondary" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </div>
  )
}
