/// <reference types="@testing-library/jest-dom" />
import { render, screen, waitFor } from '@testing-library/react'
import App from './App'
import { subscribeToAuthState } from './services/auth'

// Mock the auth service
jest.mock('./services/auth', () => ({
  subscribeToAuthState: jest.fn(),
  getIdToken: jest.fn(() => Promise.resolve('mock-token')),
}))

// Mock the lazy-loaded pages to avoid complexity in this test
jest.mock('./pages/Auth/LoginPage', () => () => <div data-testid="login-page">Login Page</div>)
jest.mock('./pages/DashboardEmbed', () => () => <div data-testid="dashboard-page">Dashboard</div>)

describe('App', () => {
  it('renders login page when user is not authenticated', async () => {
    // Mock user as null
    ;(subscribeToAuthState as jest.Mock).mockImplementation((callback) => {
      callback(null)
      return jest.fn() // unsubscribe
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByTestId('login-page')).toBeInTheDocument()
    })
  })

  it('renders dashboard when user is authenticated', async () => {
    // Mock user as authenticated
    const mockUser = {
      uid: '123',
      email: 'test@example.com',
      displayName: 'Test User',
      role: 'doctor',
    }
    ;(subscribeToAuthState as jest.Mock).mockImplementation((callback) => {
      callback(mockUser)
      return jest.fn()
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument()
    })
  })
})
