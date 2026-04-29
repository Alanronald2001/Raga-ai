/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders correctly', () => {
    render(<Badge status="active" />)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('applies solid variant classes correctly', () => {
    const { rerender } = render(<Badge status="active" variant="solid" />)
    expect(screen.getByText('Active')).toHaveClass('bg-emerald-600')

    rerender(<Badge status="critical" variant="solid" />)
    expect(screen.getByText('Critical')).toHaveClass('bg-red-600')
  })
})
