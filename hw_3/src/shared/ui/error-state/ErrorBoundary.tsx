import { Component, type ErrorInfo, type PropsWithChildren, type ReactNode } from 'react'
import i18next from 'i18next'
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
            <h2>{i18next.t('errorBoundary.title')}</h2>
            <p>{i18next.t('errorBoundary.description')}</p>
            <Button
              onClick={() => {
                window.location.reload()
              }}
            >
              {i18next.t('errorBoundary.reload')}
            </Button>
          </div>
        </section>
      )
    }

    return this.props.children
  }
}
