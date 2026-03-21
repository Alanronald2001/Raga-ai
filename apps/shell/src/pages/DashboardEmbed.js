import { jsx as _jsx } from "react/jsx-runtime";
import MFEFrame from '../components/layout/MFEFrame';
export default function DashboardEmbed() {
    return _jsx(MFEFrame, { src: "http://localhost:5175/dashboard", title: "Dashboard" });
}
