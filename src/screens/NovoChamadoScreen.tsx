import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    ScrollView, Image, Alert, KeyboardAvoidingView, Platform,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useChamados } from '../contexts/ChamadosContext'; // Removido o tipo Prioridade que não existe mais
import { RootStackScreenProps } from '../types/navigation';

const schema = z.object({
    titulo: z.string().min(5, 'Título deve ter pelo menos 5 caracteres'),
    descricao: z.string().min(10, 'Descreva o problema com pelo menos 10 caracteres'),
    dep: z.string().min(2, 'Informe o departamento'),
    prioridade: z.enum(['Urgente', 'Aberto']),
});
type FormData = z.infer<typeof schema>;

const C = {
    primary: '#20539D', white: '#FFFFFF', bg: '#F0F4FB', card: '#FFFFFF',
    text: '#1A2942', sub: '#6B7E9B', border: '#E8EEF7',
    urgent: '#DC2626', urgentBg: '#FEF2F2',
    open: '#D97706', openBg: '#FFFBEB',
    error: '#DC2626',
};

export default function NovoChamadoScreen({ navigation }: RootStackScreenProps<'NovoChamado'>) {
    const insets = useSafeAreaInsets();
    const { criarChamado } = useChamados();
    const [fotoUri, setFotoUri] = useState<string | undefined>(undefined);
    const [loadingFoto, setLoadingFoto] = useState(false);

    const { control, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { titulo: '', descricao: '', dep: '', prioridade: 'Aberto' },
    });

    const prioridadeAtual = watch('prioridade');

    // ─── Image picker ─────────────────────────────────────────────────────────

    const handleFoto = () => {
        Alert.alert(
            'Anexar Foto',
            'Escolha a origem da imagem',
            [
                {
                    text: 'Câmera',
                    onPress: () => abrirCamera(),
                },
                {
                    text: 'Galeria',
                    onPress: () => abrirGaleria(),
                },
                { text: 'Cancelar', style: 'cancel' },
            ],
        );
    };

    const abrirCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão necessária', 'Permita o acesso à câmera nas configurações.');
            return;
        }
        setLoadingFoto(true);
        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });
            if (!result.canceled && result.assets[0]) {
                setFotoUri(result.assets[0].uri);
            }
        } finally {
            setLoadingFoto(false);
        }
    };

    const abrirGaleria = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão necessária', 'Permita o acesso à galeria nas configurações.');
            return;
        }
        setLoadingFoto(true);
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });
            if (!result.canceled && result.assets[0]) {
                setFotoUri(result.assets[0].uri);
            }
        } finally {
            setLoadingFoto(false);
        }
    };

    // ─── Submit ───────────────────────────────────────────────────────────────

    const onSubmit = async (data: FormData) => {
        try {
            console.log("Tentando enviar para o Firebase...", data);

            await criarChamado(
                data.titulo,
                data.descricao,
                data.prioridade as any,
                data.dep,
                fotoUri
            );

            console.log("Chamado salvo com sucesso!");
            navigation.goBack();
        } catch (error: any) {
            console.error("Erro ao gravar no Firebase:", error);
            Alert.alert(
                "Erro de Conexão",
                "Não foi possível salvar o chamado no banco de dados. Verifique o terminal para mais detalhes."
            );
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: C.bg }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            {/* Header */}
            <View style={[s.header, { paddingTop: insets.top + 14 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} accessibilityLabel="Voltar">
                    <Ionicons name="arrow-back" size={22} color={C.white} />
                </TouchableOpacity>
                <Text style={s.headerTitle}>Novo Chamado</Text>
                <View style={{ width: 36 }} />
            </View>

            <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">

                {/* Título */}
                <Text style={s.label}>Título do Chamado *</Text>
                <Controller
                    control={control}
                    name="titulo"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[s.input, errors.titulo && s.inputError]}
                            placeholder="Ex: Impressora offline — Sala 2A"
                            placeholderTextColor={C.sub}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errors.titulo && <Text style={s.errorText}>{errors.titulo.message}</Text>}

                {/* Departamento */}
                <Text style={s.label}>Departamento *</Text>
                <Controller
                    control={control}
                    name="dep"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[s.input, errors.dep && s.inputError]}
                            placeholder="Ex: Financeiro, RH, TI..."
                            placeholderTextColor={C.sub}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errors.dep && <Text style={s.errorText}>{errors.dep.message}</Text>}

                {/* Prioridade */}
                <Text style={s.label}>Prioridade *</Text>
                <Controller
                    control={control}
                    name="prioridade"
                    render={({ field: { onChange, value } }) => (
                        <View style={s.prioRow}>
                            <TouchableOpacity
                                style={[s.prioBtn, value === 'Aberto' && s.prioBtnAberto]}
                                onPress={() => onChange('Aberto')}
                            >
                                <Ionicons
                                    name="folder-open-outline"
                                    size={16}
                                    color={value === 'Aberto' ? C.open : C.sub}
                                />
                                <Text style={[s.prioText, value === 'Aberto' && { color: C.open }]}>
                                    Aberto
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[s.prioBtn, value === 'Urgente' && s.prioBtnUrgente]}
                                onPress={() => onChange('Urgente')}
                            >
                                <Ionicons
                                    name="warning-outline"
                                    size={16}
                                    color={value === 'Urgente' ? C.urgent : C.sub}
                                />
                                <Text style={[s.prioText, value === 'Urgente' && { color: C.urgent }]}>
                                    Urgente
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />

                {/* Descrição */}
                <Text style={s.label}>Descrição do Problema *</Text>
                <Controller
                    control={control}
                    name="descricao"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[s.input, s.textArea, errors.descricao && s.inputError]}
                            placeholder="Descreva o problema detalhadamente..."
                            placeholderTextColor={C.sub}
                            multiline
                            numberOfLines={5}
                            textAlignVertical="top"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errors.descricao && <Text style={s.errorText}>{errors.descricao.message}</Text>}

                {/* Botão de foto */}
                <Text style={s.label}>Foto do Equipamento</Text>
                <TouchableOpacity style={s.fotoBtn} onPress={handleFoto} disabled={loadingFoto}>
                    {loadingFoto ? (
                        <ActivityIndicator color={C.primary} />
                    ) : (
                        <>
                            <Ionicons name="camera" size={22} color={C.primary} />
                            <Text style={s.fotoBtnText}>
                                {fotoUri ? 'Trocar Foto do Equipamento' : 'Anexar Foto do Equipamento'}
                            </Text>
                        </>
                    )}
                </TouchableOpacity>

                {/* Miniatura da foto */}
                {fotoUri && (
                    <View style={s.previewContainer}>
                        <Image source={{ uri: fotoUri }} style={s.preview} resizeMode="cover" />
                        <TouchableOpacity
                            style={s.removePhoto}
                            onPress={() => setFotoUri(undefined)}
                            accessibilityLabel="Remover foto"
                        >
                            <Ionicons name="close-circle" size={24} color={C.urgent} />
                        </TouchableOpacity>
                    </View>
                )}

                {/* Botão enviar */}
                <TouchableOpacity style={s.submitBtn} onPress={handleSubmit(onSubmit)}>
                    <Ionicons name="send" size={18} color={C.white} />
                    <Text style={s.submitText}>Abrir Chamado</Text>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const s = StyleSheet.create({
    header: {
        backgroundColor: C.primary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    backBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '800', color: C.white },

    content: { padding: 20 },

    label: { fontSize: 13, fontWeight: '700', color: C.text, marginBottom: 6, marginTop: 16 },
    input: {
        backgroundColor: C.card,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: C.border,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 14,
        color: C.text,
    },
    textArea: { height: 120, paddingTop: 12 },
    inputError: { borderColor: C.error },
    errorText: { fontSize: 12, color: C.error, marginTop: 4 },

    prioRow: { flexDirection: 'row', gap: 10 },
    prioBtn: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 6, paddingVertical: 12, borderRadius: 12,
        borderWidth: 1.5, borderColor: C.border, backgroundColor: C.card,
    },
    prioBtnAberto: { borderColor: C.open, backgroundColor: '#FFFBEB' },
    prioBtnUrgente: { borderColor: C.urgent, backgroundColor: '#FEF2F2' },
    prioText: { fontSize: 14, fontWeight: '700', color: C.sub },

    fotoBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        backgroundColor: '#EAF0FB',
        borderRadius: 12, borderWidth: 1.5, borderColor: C.primary,
        borderStyle: 'dashed', paddingVertical: 16, paddingHorizontal: 16,
        justifyContent: 'center',
    },
    fotoBtnText: { fontSize: 14, fontWeight: '700', color: C.primary },

    previewContainer: { marginTop: 12, borderRadius: 14, overflow: 'hidden', position: 'relative' },
    preview: { width: '100%', height: 200, borderRadius: 14 },
    removePhoto: {
        position: 'absolute', top: 8, right: 8,
        backgroundColor: C.white, borderRadius: 12,
    },

    submitBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 8, backgroundColor: C.primary,
        borderRadius: 14, paddingVertical: 16, marginTop: 28,
    },
    submitText: { fontSize: 16, fontWeight: '800', color: C.white },
});