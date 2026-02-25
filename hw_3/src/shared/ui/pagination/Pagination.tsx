import { useMemo } from 'react'
import { Button } from '@/shared/ui/button/Button'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (nextPage: number) => void
}

const buildPageRange = (currentPage: number, totalPages: number): number[] => {
  const start = Math.max(1, currentPage - 2)
  const end = Math.min(totalPages, currentPage + 2)

  const pages: number[] = []

  for (let pageIndex = start; pageIndex <= end; pageIndex += 1) {
    pages.push(pageIndex)
  }

  return pages
}

export const Pagination = ({ page, totalPages, onPageChange }: PaginationProps) => {
  const pages = useMemo(() => buildPageRange(page, totalPages), [page, totalPages])

  if (totalPages <= 1) {
    return null
  }

  return (
    <nav className="pagination" aria-label="pagination">
      <Button variant="secondary" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
        {'<'}
      </Button>
      {pages.map((pageNumber) => (
        <Button
          key={pageNumber}
          variant={pageNumber === page ? 'primary' : 'secondary'}
          onClick={() => onPageChange(pageNumber)}
        >
          {pageNumber}
        </Button>
      ))}
      <Button variant="secondary" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
        {'>'}
      </Button>
    </nav>
  )
}
