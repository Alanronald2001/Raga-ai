import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged, sendPasswordResetEmail, } from 'firebase/auth';
import { auth } from './firebase';
// Map Firebase user → your app User type
export function toAppUser(fbUser) {
    return {
        uid: fbUser.uid,
        email: fbUser.email ?? '',
        displayName: fbUser.displayName ?? fbUser.email?.split('@')[0] ?? 'User',
        role: 'doctor', // default — extend with Firestore claims later
        avatar: fbUser.photoURL ?? undefined,
    };
}
export async function signIn(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return toAppUser(cred.user);
}
export async function signUp(email, password) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    return toAppUser(cred.user);
}
export async function signOut() {
    await firebaseSignOut(auth);
}
export async function resetPassword(email) {
    await sendPasswordResetEmail(auth, email);
}
export function subscribeToAuthState(callback) {
    return onAuthStateChanged(auth, fbUser => callback(fbUser ? toAppUser(fbUser) : null));
}
export async function getIdToken() {
    const fbUser = auth.currentUser;
    if (!fbUser)
        return null;
    return fbUser.getIdToken();
}
