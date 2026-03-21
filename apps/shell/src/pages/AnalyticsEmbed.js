import { jsx as _jsx } from "react/jsx-runtime";
import MFEFrame from '../components/layout/MFEFrame';
export default function AnalyticsEmbed() {
    return _jsx(MFEFrame, { src: "http://localhost:5175/analytics", title: "Analytics" });
}
