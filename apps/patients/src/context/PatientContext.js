import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState, useCallback, useMemo, } from 'react';
import { getPatients } from '@raga/mock-api';
import { onBridgeMessage } from '@raga/shared-types';
// ── Context ──────────────────────────────────────────────────────
const PatientContext = createContext(null);
// ── Provider ─────────────────────────────────────────────────────
export function PatientProvider({ children }) {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [viewMode, setViewMode] = useState('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAuthed, setIsAuthed] = useState(false);
    // ── Fetch ──────────────────────────────────────────────────────
    const fetchPatients = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getPatients();
            setPatients(data);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load patients');
        }
        finally {
            setLoading(false);
        }
    }, []);
    // ── Bridge: wait for AUTH_TOKEN_READY before fetching ─────────
    useEffect(() => {
        const unsubscribe = onBridgeMessage(msg => {
            if (msg.type === 'AUTH_TOKEN_READY') {
                setIsAuthed(true);
                // store token if you need it for real API calls later
                // e.g. sessionStorage.setItem('token', msg.payload.token)
            }
            if (msg.type === 'AUTH_SIGNED_OUT') {
                setIsAuthed(false);
                setPatients([]);
                setSelectedPatient(null);
            }
        });
        // Signal shell that this MFE is ready to receive auth
        if (window.parent !== window) {
            window.parent.postMessage({ type: 'MFE_READY' }, '*');
        }
        return unsubscribe;
    }, []);
    // ── Fetch once authed ──────────────────────────────────────────
    useEffect(() => {
        if (isAuthed)
            fetchPatients();
    }, [isAuthed, fetchPatients]);
    // ── Derived: filtered list ─────────────────────────────────────
    const filtered = useMemo(() => {
        let list = patients;
        if (statusFilter !== 'all') {
            list = list.filter(p => p.status === statusFilter);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(p => p.name.toLowerCase().includes(q) ||
                p.department.toLowerCase().includes(q) ||
                p.email.toLowerCase().includes(q) ||
                p.phone.includes(q) ||
                p.id.toLowerCase().includes(q));
        }
        return list;
    }, [patients, statusFilter, searchQuery]);
    // ── Actions ───────────────────────────────────────────────────
    const setSearch = useCallback((query) => {
        setSearchQuery(query);
        setSelectedPatient(null);
    }, []);
    const selectPatient = useCallback((patient) => {
        setSelectedPatient(patient);
    }, []);
    const refetch = useCallback(async () => {
        if (isAuthed)
            await fetchPatients();
    }, [isAuthed, fetchPatients]);
    return (_jsx(PatientContext.Provider, { value: {
            patients,
            filtered,
            selectedPatient,
            viewMode,
            searchQuery,
            statusFilter,
            loading,
            error,
            isAuthed,
            setViewMode,
            setSearch,
            setStatusFilter,
            selectPatient,
            refetch,
        }, children: children }));
}
// ── Hook ─────────────────────────────────────────────────────────
export function usePatients() {
    const ctx = useContext(PatientContext);
    if (!ctx)
        throw new Error('usePatients must be used inside <PatientProvider>');
    return ctx;
}
