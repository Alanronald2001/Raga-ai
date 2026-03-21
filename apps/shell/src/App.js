import { jsx as _jsx } from "react/jsx-runtime";
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRouter from './routes/AppRouter';
export default function App() {
    return (_jsx(AuthProvider, { children: _jsx(NotificationProvider, { children: _jsx(AppRouter, {}) }) }));
}
