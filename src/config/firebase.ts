import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeAuth } from 'firebase/auth';

// @ts-ignore - Apontando para o local exato onde o código mora
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyCvRz_FITcbCIMbEv-_BopFzHy6_9vmDoY",
    authDomain: "talktech-d9d6c.firebaseapp.com",
    projectId: "talktech-d9d6c",
    storageBucket: "talktech-d9d6c.firebasestorage.app",
    messagingSenderId: "30774790915",
    appId: "1:30774790915:web:fe68a2ea9467492a8d7736",
    measurementId: "G-BELGGET696"
};

export const app = initializeApp(firebaseConfig);

// MUDANÇA AQUI: Inicializa o Auth com persistência para salvar o login no celular
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export const db = initializeFirestore(app, {
    experimentalForceLongPolling: true
});
export const storage = getStorage(app);