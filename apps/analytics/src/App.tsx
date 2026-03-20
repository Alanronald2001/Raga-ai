import { AnalyticsProvider } from './context/AnalyticsContext'
import AppRouter from './routes/AppRouter'

export default function App() {
  return (
    <AnalyticsProvider>
      <div className="min-h-screen bg-slate-50 antialiased">
        <AppRouter />
      </div>
    </AnalyticsProvider>
  )
}
