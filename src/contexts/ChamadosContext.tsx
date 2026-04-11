import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

// --- TIPAGENS ---
export interface Mensagem {
    id: string;
    texto: string;
    autor: 'usuario' | 'tecnico' | 'sistema';
    data: string;
    fotoUrl?: string;
}

export interface Chamado {
    id: string;
    titulo: string;
    descricao: string;
    status: 'Aberto' | 'Em Atendimento' | 'Finalizado';
    prioridade: 'Baixa' | 'Média' | 'Alta' | 'Urgente';
    fila: string;
    dataCriacao: string;
    mensagens: Mensagem[];
}

interface ChamadosContextType {
    chamados: Chamado[];
    criarChamado: (titulo: string, descricao: string, prioridade: Chamado['prioridade'], fila: string, fotoUri?: string) => Promise<void>;
    adicionarMensagem: (chamadoId: string, texto: string, autor: Mensagem['autor']) => Promise<void>;
    finalizarChamado: (chamadoId: string, motivo: string) => Promise<void>;
    reabrirChamado: (chamadoId: string) => Promise<void>;
}

export const ChamadosContext = createContext<ChamadosContextType>({} as ChamadosContextType);

export const ChamadosProvider = ({ children }: { children: ReactNode }) => {
    const [chamados, setChamados] = useState<Chamado[]>([]);

    // 1. LER DADOS DO FIREBASE EM TEMPO REAL
    useEffect(() => {
        const q = query(collection(db, 'chamados'), orderBy('dataCriacao', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const chamadosData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Chamado[];
            setChamados(chamadosData);
        });

        return () => unsubscribe();
    }, []);

    // 2. CRIAR UM NOVO CHAMADO NO FIREBASE (COM CORREÇÃO DA FOTO)
    const criarChamado = async (titulo: string, descricao: string, prioridade: Chamado['prioridade'], fila: string, fotoUri?: string) => {
        const novaMensagem: Mensagem = {
            id: Date.now().toString(),
            texto: descricao,
            autor: 'usuario',
            data: new Date().toISOString(),
        };

        // O Firebase odeia "undefined", então só passamos a foto se ela existir
        if (fotoUri) {
            novaMensagem.fotoUrl = fotoUri;
        }

        const novoChamado = {
            titulo,
            descricao,
            status: 'Aberto',
            prioridade,
            fila,
            dataCriacao: new Date().toISOString(),
            mensagens: [novaMensagem],
        };

        await addDoc(collection(db, 'chamados'), novoChamado);
    };

    // 3. ADICIONAR MENSAGEM (CHAT)
    const adicionarMensagem = async (chamadoId: string, texto: string, autor: Mensagem['autor']) => {
        const chamadoAtual = chamados.find(c => c.id === chamadoId);
        if (!chamadoAtual) return;

        const novaMensagem: Mensagem = {
            id: Date.now().toString(),
            texto,
            autor,
            data: new Date().toISOString(),
        };

        const novasMensagens = [...chamadoAtual.mensagens, novaMensagem];

        const chamadoRef = doc(db, 'chamados', chamadoId);
        await updateDoc(chamadoRef, {
            mensagens: novasMensagens,
            status: autor === 'tecnico' && chamadoAtual.status === 'Aberto' ? 'Em Atendimento' : chamadoAtual.status
        });
    };

    // 4. FINALIZAR CHAMADO
    const finalizarChamado = async (chamadoId: string, motivo: string) => {
        const chamadoAtual = chamados.find(c => c.id === chamadoId);
        if (!chamadoAtual) return;

        const mensagemSistema: Mensagem = {
            id: Date.now().toString(),
            texto: `Chamado finalizado. Motivo: ${motivo}`,
            autor: 'sistema',
            data: new Date().toISOString(),
        };

        const chamadoRef = doc(db, 'chamados', chamadoId);
        await updateDoc(chamadoRef, {
            status: 'Finalizado',
            mensagens: [...chamadoAtual.mensagens, mensagemSistema]
        });
    };

    // 5. REABRIR CHAMADO
    const reabrirChamado = async (chamadoId: string) => {
        const chamadoAtual = chamados.find(c => c.id === chamadoId);
        if (!chamadoAtual) return;

        const mensagemSistema: Mensagem = {
            id: Date.now().toString(),
            texto: `Chamado reaberto pelo usuário.`,
            autor: 'sistema',
            data: new Date().toISOString(),
        };

        const chamadoRef = doc(db, 'chamados', chamadoId);
        await updateDoc(chamadoRef, {
            status: 'Aberto',
            mensagens: [...chamadoAtual.mensagens, mensagemSistema]
        });
    };

    return (
        <ChamadosContext.Provider value={{ chamados, criarChamado, adicionarMensagem, finalizarChamado, reabrirChamado }}>
            {children}
        </ChamadosContext.Provider>
    );
};

export const useChamados = () => useContext(ChamadosContext);