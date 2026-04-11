import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';
import { app } from '../config/firebase';

// --- TIPAGENS ---
interface Usuario {
    uid: string;
    nome: string;
    email: string;
}

interface AuthContextType {
    usuario: Usuario | null;
    logar: (email: string, pass: string) => Promise<void>;
    cadastrar: (nome: string, email: string, pass: string) => Promise<void>;
    deslogar: () => Promise<void>;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const auth = getAuth(app);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                // Aqui está o segredo: se o nome não vier de primeira, a gente usa o e-mail ou 'Usuário' como backup temporário
                setUsuario({
                    uid: firebaseUser.uid,
                    nome: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuário',
                    email: firebaseUser.email || '',
                });
            } else {
                setUsuario(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);
    const logar = async (email: string, pass: string) => {
        await signInWithEmailAndPassword(auth, email, pass);
    };

    const cadastrar = async (nome: string, email: string, pass: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(userCredential.user, { displayName: nome });

        setUsuario({
            uid: userCredential.user.uid,
            nome: nome,
            email: email
        });
    };

    const deslogar = async () => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ usuario, logar, cadastrar, deslogar, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);