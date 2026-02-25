import { Component, type ErrorInfo, type PropsWithChildren, type ReactNode } from 'react'
import { Button } from '@/shared/ui/button/Button'

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<PropsWithChildren, ErrorBoundaryState> {
  public constructor(props: PropsWithChildren) {
    super(props)
    this.state = {
      hasError: false,
    }
  }

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return {
      hasError: true,
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled application error', error, errorInfo)
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <section className="centered-page">
          <div className="state-block state-block_error">
            <h2>Unexpected error</h2>
            <p>Please reload the page.</p>
            <Button
              onClick={() => {
                window.location.reload()
              }}
            >
              Reload
            </Button>
          </div>
        </section>
      )
    }

    return this.props.children
  }
}
