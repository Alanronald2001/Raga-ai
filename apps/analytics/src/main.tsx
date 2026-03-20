import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AnalyticsProvider } from './context/AnalyticsContext'
import AppRouter from './routes/AppRouter'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AnalyticsProvider>
      <AppRouter />
    </AnalyticsProvider>
  </StrictMode>
)
