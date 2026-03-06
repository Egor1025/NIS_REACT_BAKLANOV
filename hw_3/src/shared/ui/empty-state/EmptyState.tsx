interface EmptyStateProps {
  message: string
}

export const EmptyState = ({ message }: EmptyStateProps) => {
  return <div className="state-block state-block_empty">{message}</div>
}
