import { useState, useEffect } from 'react';
import { onBridgeMessage } from '@raga/shared-types';
export function useAuth() {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    useEffect(() => {
        const unsubscribe = onBridgeMessage(msg => {
            if (msg.type === 'AUTH_TOKEN_READY') {
                setUser(msg.payload.user);
                setToken(msg.payload.token);
            }
            if (msg.type === 'AUTH_SIGNED_OUT') {
                setUser(null);
                setToken(null);
            }
        });
        if (window.parent !== window) {
            window.parent.postMessage({ type: 'MFE_READY' }, '*');
        }
        return unsubscribe;
    }, []);
    return { user, token, isAuthed: !!user };
}
