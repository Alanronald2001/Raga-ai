import { jsx as _jsx } from "react/jsx-runtime";
import { AnalyticsProvider } from './context/AnalyticsContext';
import AppRouter from './routes/AppRouter';
export default function App() {
    return (_jsx(AnalyticsProvider, { children: _jsx("div", { className: "min-h-screen bg-slate-50 antialiased", children: _jsx(AppRouter, {}) }) }));
}
