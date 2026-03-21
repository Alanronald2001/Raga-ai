// MFE → Shell (no React needed, just window)
export function postToShell(msg) {
    if (window.parent && window.parent !== window) {
        window.parent.postMessage(msg, '*');
    }
}
// Listen for bridge messages
export function onBridgeMessage(handler) {
    const listener = (event) => {
        if (event.data && typeof event.data.type === 'string') {
            handler(event.data);
        }
    };
    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
}
