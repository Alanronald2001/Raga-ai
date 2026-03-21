import { jsx as _jsx } from "react/jsx-runtime";
import { useParams } from 'react-router-dom';
import MFEFrame from '../components/layout/MFEFrame';
export default function PatientsEmbed() {
    const { id } = useParams();
    const src = id ? `http://localhost:5174/${id}` : 'http://localhost:5174/';
    return _jsx(MFEFrame, { src: src, title: "Patients" });
}
