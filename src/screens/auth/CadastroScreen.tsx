import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Ionicons } from '@expo/vector-icons';
import { RootStackScreenProps } from '../../types/navigation';
import Logo from '../../components/Logo';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const cadastroSchema = z.object({
    nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
    email: z.string().email('E-mail inválido'),
    password: z.string().min(6, 'Pelo menos 6 caracteres'),
    confirmPassword: z.string().min(6, 'Pelo menos 6 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"]
});

type CadastroForm = z.infer<typeof cadastroSchema>;

export default function CadastroScreen({ navigation }: RootStackScreenProps<'Cadastro'>) {
    const { colors } = useTheme();
    const { cadastrar } = useAuth();

    const { control, handleSubmit, formState: { errors } } = useForm<CadastroForm>({
        resolver: zodResolver(cadastroSchema),
        defaultValues: { nome: '', email: '', password: '', confirmPassword: '' }
    });

    const onSubmit = async (data: CadastroForm) => {
        try {
            await cadastrar(data.nome, data.email, data.password);
            Alert.alert("Sucesso", "Conta criada com sucesso!");
            // O AuthContext vai detectar o login e mudar a rota sozinho
        } catch (error: any) {
            console.error(error);
            Alert.alert("Erro no Cadastro", "Verifique os dados ou se o e-mail já existe.");
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Logo showSubtitle={false} />
                <View style={styles.header}>
                    <Text style={styles.title}>Crie sua conta</Text>
                    <Text style={styles.subtitle}>Preencha os dados para acessar o TalkTech</Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Nome Completo</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" color="#666" size={20} style={styles.inputIcon} />
                        <Controller
                            control={control}
                            name="nome"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={[styles.input, errors.nome && styles.inputError]}
                                    placeholder="Seu nome"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                        />
                    </View>
                    {errors.nome && <Text style={styles.errorText}>{errors.nome.message}</Text>}

                    <Text style={[styles.label, { marginTop: 15 }]}>E-mail Corporativo</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" color="#666" size={20} style={styles.inputIcon} />
                        <Controller
                            control={control}
                            name="email"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={[styles.input, errors.email && styles.inputError]}
                                    placeholder="exemplo@empresa.com"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            )}
                        />
                    </View>
                    {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

                    <Text style={[styles.label, { marginTop: 15 }]}>Senha</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" color="#666" size={20} style={styles.inputIcon} />
                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={[styles.input, errors.password && styles.inputError]}
                                    placeholder="******"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    secureTextEntry
                                />
                            )}
                        />
                    </View>
                    {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

                    <Text style={[styles.label, { marginTop: 15 }]}>Confirmar Senha</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" color="#666" size={20} style={styles.inputIcon} />
                        <Controller
                            control={control}
                            name="confirmPassword"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={[styles.input, errors.confirmPassword && styles.inputError]}
                                    placeholder="******"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    secureTextEntry
                                />
                            )}
                        />
                    </View>
                    {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: colors.primary }]}
                        onPress={handleSubmit(onSubmit)}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>Finalizar Cadastro</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backButtonText}>Já tem uma conta? Faça login</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    scrollContent: { flexGrow: 1, padding: 20, paddingTop: 40 },
    header: { marginBottom: 20, alignItems: 'center' },
    title: { fontSize: 28, fontWeight: 'bold', color: '#0056b3', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#666' },
    form: { backgroundColor: '#FFF', padding: 25, borderRadius: 15, elevation: 5 },
    label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8 },
    inputIcon: { marginLeft: 12 },
    input: { flex: 1, padding: 12, fontSize: 16, color: '#111827' },
    inputError: { borderColor: '#EF4444' },
    errorText: { color: '#EF4444', fontSize: 12, marginTop: 4, fontWeight: '500' },
    button: { height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 25 },
    buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    backButton: { marginTop: 20, alignItems: 'center' },
    backButtonText: { color: '#666', fontSize: 14, fontWeight: '500' }
});