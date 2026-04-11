import React, { useState, useRef } from 'react';
import {
    View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity,
    KeyboardAvoidingView, Platform, Modal, Image, Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useChamados, Mensagem } from '../contexts/ChamadosContext';
import { RootStackScreenProps } from '../types/navigation';

const C = {
    primary: '#20539D', white: '#FFFFFF', bg: '#F0F4FB', card: '#FFFFFF',
    text: '#1A2942', sub: '#6B7E9B', border: '#E8EEF7',
    urgent: '#DC2626', urgentBg: '#FEF2F2',
    open: '#D97706', openBg: '#FFFBEB',
    done: '#16A34A', doneBg: '#F0FDF4',
};

export default function DetalhesChamadoScreen({
    navigation,
    route,
}: RootStackScreenProps<'DetalhesChamado'>) {
    const { chamadoId } = route.params;
    const insets = useSafeAreaInsets();
    const { chamados, adicionarMensagem, finalizarChamado, reabrirChamado } = useChamados();

    const chamado = chamados.find(c => c.id === chamadoId);

    const [texto, setTexto] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [motivo, setMotivo] = useState('');
    const flatRef = useRef<FlatList>(null);

    if (!chamado) {
        return (
            <View style={[s.root, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: C.sub }}>Chamado não encontrado.</Text>
            </View>
        );
    }

    const isFinalizado = chamado.status === 'Finalizado';

    const statusColor = isFinalizado
        ? C.done
        : chamado.prioridade === 'Urgente'  // <--- A correção foi aqui!
            ? C.urgent
            : C.open;

    const enviarMensagem = () => {
        const t = texto.trim();
        if (!t) return;
        adicionarMensagem(chamado.id, t, 'usuario'); // Mudou de 'user' para 'usuario' conforme o Firebase
        setTexto('');
        setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
    };

    const confirmarFinalizar = () => {
        const m = motivo.trim();
        if (!m) return;
        finalizarChamado(chamado.id, m);
        setModalVisible(false);
        setMotivo('');
    };

    // ─── Render de balão ──────────────────────────────────────────────────────

    const renderMensagem = ({ item }: { item: Mensagem }) => {
        // O autor no Firebase agora é 'usuario' em vez de 'user'
        const isUser = item.autor === 'usuario';

        // Formatar a data (String do Firebase) para H:M
        const dataObj = new Date(item.data);
        const horaFormatada = dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        return (
            <View style={[s.bubbleRow, isUser ? s.rowRight : s.rowLeft]}>
                {!isUser && (
                    <View style={s.avatarSuport}>
                        <Ionicons name="headset" size={14} color={C.white} />
                    </View>
                )}
                <View style={[s.bubble, isUser ? s.bubbleUser : s.bubbleSuport]}>
                    {item.fotoUrl && ( // No Firebase usamos fotoUrl em vez de fotoUri
                        <Image
                            source={{ uri: item.fotoUrl }}
                            style={s.fotoBubble}
                            resizeMode="cover"
                            accessibilityLabel="Foto do equipamento"
                        />
                    )}
                    <Text style={[s.bubbleText, isUser ? s.bubbleTextUser : s.bubbleTextSuport]}>
                        {item.texto}
                    </Text>
                    <Text style={[s.bubbleTime, isUser ? s.bubbleTimeUser : s.bubbleTimeSuport]}>
                        {horaFormatada}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: C.bg }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            {/* Header */}
            <View style={[s.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} accessibilityLabel="Voltar">
                    <Ionicons name="arrow-back" size={22} color={C.white} />
                </TouchableOpacity>
                <View style={{ flex: 1, marginHorizontal: 10 }}>
                    <Text style={s.headerTitle} numberOfLines={1}>{chamado.titulo}</Text>
                    <View style={s.statusPill}>
                        <View style={[s.statusDot, { backgroundColor: statusColor }]} />
                        <Text style={[s.statusText, { color: statusColor }]}>{chamado.status}</Text>
                        <Text style={s.depText}> · Dep. {chamado.fila}</Text>
                    </View>
                </View>
                {isFinalizado ? (
                    <TouchableOpacity
                        style={s.actionBtnReopen}
                        onPress={() => reabrirChamado(chamado.id)}
                        accessibilityLabel="Reabrir chamado"
                    >
                        <Ionicons name="refresh" size={14} color={C.open} />
                        <Text style={[s.actionBtnText, { color: C.open }]}>Reabrir</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={s.actionBtnFinish}
                        onPress={() => setModalVisible(true)}
                        accessibilityLabel="Finalizar chamado"
                    >
                        <Ionicons name="checkmark-circle" size={14} color={C.white} />
                        <Text style={[s.actionBtnText, { color: C.white }]}>Finalizar</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Chat FlatList */}
            <FlatList
                ref={flatRef}
                data={chamado.mensagens}
                keyExtractor={item => item.id}
                renderItem={renderMensagem}
                contentContainerStyle={s.chatContent}
                onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: false })}
                showsVerticalScrollIndicator={false}
            />

            {/* Rodapé de input */}
            {!isFinalizado && (
                <View style={[s.footer, { paddingBottom: insets.bottom + 8 }]}>
                    <TextInput
                        style={s.chatInput}
                        placeholder="Digite sua mensagem..."
                        placeholderTextColor={C.sub}
                        value={texto}
                        onChangeText={setTexto}
                        multiline
                        accessibilityLabel="Campo de mensagem"
                    />
                    <TouchableOpacity
                        style={[s.sendBtn, !texto.trim() && s.sendBtnDisabled]}
                        onPress={enviarMensagem}
                        disabled={!texto.trim()}
                        accessibilityLabel="Enviar mensagem"
                    >
                        <Ionicons name="send" size={18} color={C.white} />
                    </TouchableOpacity>
                </View>
            )}

            {/* Modal: finalizar chamado */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable style={s.overlay} onPress={() => setModalVisible(false)}>
                    <Pressable style={s.modalCard} onPress={() => { }}>
                        <Text style={s.modalTitle}>Finalizar Chamado</Text>
                        <Text style={s.modalSub}>Informe o motivo da resolução para registrar no histórico.</Text>

                        <TextInput
                            style={s.modalInput}
                            placeholder="Ex: Problema resolvido após reinicialização..."
                            placeholderTextColor={C.sub}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            value={motivo}
                            onChangeText={setMotivo}
                            autoFocus
                        />

                        <View style={s.modalActions}>
                            <TouchableOpacity
                                style={s.modalCancelBtn}
                                onPress={() => { setModalVisible(false); setMotivo(''); }}
                            >
                                <Text style={s.modalCancelText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[s.modalConfirmBtn, !motivo.trim() && { opacity: 0.5 }]}
                                onPress={confirmarFinalizar}
                                disabled={!motivo.trim()}
                            >
                                <Ionicons name="checkmark-circle" size={16} color={C.white} />
                                <Text style={s.modalConfirmText}>Confirmar</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </KeyboardAvoidingView>
    );
}

const s = StyleSheet.create({
    root: { flex: 1, backgroundColor: C.bg },

    // Header
    header: {
        backgroundColor: C.primary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingBottom: 14,
    },
    backBtn: { width: 34, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 15, fontWeight: '800', color: C.white },
    statusPill: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
    statusDot: { width: 7, height: 7, borderRadius: 3.5, marginRight: 5 },
    statusText: { fontSize: 11, fontWeight: '700' },
    depText: { fontSize: 11, color: 'rgba(255,255,255,0.65)' },

    actionBtnFinish: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: C.done, borderRadius: 20,
        paddingHorizontal: 10, paddingVertical: 6,
    },
    actionBtnReopen: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: C.openBg, borderRadius: 20,
        paddingHorizontal: 10, paddingVertical: 6,
        borderWidth: 1, borderColor: C.open,
    },
    actionBtnText: { fontSize: 12, fontWeight: '700' },

    // Chat
    chatContent: { padding: 14, paddingBottom: 20 },
    bubbleRow: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-end' },
    rowRight: { justifyContent: 'flex-end' },
    rowLeft: { justifyContent: 'flex-start' },

    avatarSuport: {
        width: 28, height: 28, borderRadius: 14,
        backgroundColor: C.primary,
        justifyContent: 'center', alignItems: 'center',
        marginRight: 8,
    },

    bubble: {
        maxWidth: '78%', borderRadius: 16, padding: 10,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.07, shadowRadius: 4, elevation: 2,
    },
    bubbleUser: {
        backgroundColor: C.primary,
        borderBottomRightRadius: 4,
    },
    bubbleSuport: {
        backgroundColor: C.white,
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: C.border,
    },
    bubbleText: { fontSize: 14, lineHeight: 20 },
    bubbleTextUser: { color: C.white },
    bubbleTextSuport: { color: C.text },
    bubbleTime: { fontSize: 10, marginTop: 4 },
    bubbleTimeUser: { color: 'rgba(255,255,255,0.6)', textAlign: 'right' },
    bubbleTimeSuport: { color: C.sub },

    fotoBubble: {
        width: '100%', height: 160,
        borderRadius: 10, marginBottom: 8,
    },

    // Footer input
    footer: {
        flexDirection: 'row', alignItems: 'flex-end',
        backgroundColor: C.white,
        borderTopWidth: 1, borderTopColor: C.border,
        paddingHorizontal: 12, paddingTop: 10, gap: 8,
    },
    chatInput: {
        flex: 1, backgroundColor: C.bg,
        borderRadius: 22, borderWidth: 1, borderColor: C.border,
        paddingHorizontal: 16, paddingVertical: 10,
        fontSize: 14, color: C.text, maxHeight: 100,
    },
    sendBtn: {
        width: 42, height: 42, borderRadius: 21,
        backgroundColor: C.primary,
        justifyContent: 'center', alignItems: 'center',
    },
    sendBtnDisabled: { backgroundColor: C.sub },

    // Modal
    overlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    modalCard: {
        backgroundColor: C.white,
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: 24,
    },
    modalTitle: { fontSize: 18, fontWeight: '800', color: C.text, marginBottom: 6 },
    modalSub: { fontSize: 13, color: C.sub, marginBottom: 16 },
    modalInput: {
        backgroundColor: C.bg, borderRadius: 12,
        borderWidth: 1.5, borderColor: C.border,
        paddingHorizontal: 14, paddingVertical: 12,
        fontSize: 14, color: C.text, minHeight: 100,
        marginBottom: 16,
    },
    modalActions: { flexDirection: 'row', gap: 10 },
    modalCancelBtn: {
        flex: 1, paddingVertical: 14, borderRadius: 12,
        borderWidth: 1.5, borderColor: C.border,
        justifyContent: 'center', alignItems: 'center',
    },
    modalCancelText: { fontSize: 14, fontWeight: '700', color: C.sub },
    modalConfirmBtn: {
        flex: 1.5, flexDirection: 'row', gap: 6,
        paddingVertical: 14, borderRadius: 12,
        backgroundColor: C.done,
        justifyContent: 'center', alignItems: 'center',
    },
    modalConfirmText: { fontSize: 14, fontWeight: '700', color: C.white },
});