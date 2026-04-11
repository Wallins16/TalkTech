import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Ionicons } from '@expo/vector-icons';
import { RootStackScreenProps } from '../../types/navigation';
import Logo from '../../components/Logo';
import { useTheme } from '../../contexts/ThemeContext';

const forgotPasswordSchema = z.object({ email: z.string().email('E-mail inválido').regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Formato corporativo inválido') });
type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function EsqueceuSenhaScreen({ navigation }: RootStackScreenProps<'EsqueceuSenha'>) {
    const { colors } = useTheme();
    const { control, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>({ resolver: zodResolver(forgotPasswordSchema), defaultValues: { email: '' } });
    const onSubmit = (data: ForgotPasswordForm) => { console.log(data); navigation.goBack(); };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Logo showSubtitle={false} />
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.primary }]}>Recuperar Senha</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Insira seu e-mail corporativo</Text>
                </View>
                <View style={[styles.form, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.label, { color: colors.text }]}>E-mail Corporativo</Text>
                    <View style={[styles.inputContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
                        <Ionicons name="mail-outline" color={colors.textSecondary} size={20} style={styles.inputIcon} />
                        <Controller control={control} name="email" render={({ field: { onChange, onBlur, value } }) => (<TextInput style={[styles.input, { color: colors.text }, errors.email && styles.inputError]} placeholder="exemplo@empresa.com" placeholderTextColor={colors.textSecondary} onBlur={onBlur} onChangeText={onChange} value={value} keyboardType="email-address" autoCapitalize="none" />)} />
                    </View>
                    {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

                    <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleSubmit(onSubmit)} activeOpacity={0.8}>
                        <Text style={styles.buttonText}>Enviar Instruções</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={[styles.backButtonText, { color: colors.textSecondary }]}>Voltar para o Login</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#F5F7FA' }, scrollContent: { flexGrow: 1, padding: 20, paddingTop: 40 }, header: { marginBottom: 20, alignItems: 'center' }, title: { fontSize: 28, fontWeight: 'bold', color: '#0056b3', marginBottom: 8 }, subtitle: { fontSize: 16, color: '#666' }, form: { backgroundColor: '#FFF', padding: 25, borderRadius: 15, elevation: 5 }, label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 }, inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8 }, inputIcon: { marginLeft: 12 }, input: { flex: 1, padding: 12, fontSize: 16, color: '#111827' }, inputError: { borderColor: '#EF4444' }, errorText: { color: '#EF4444', fontSize: 12, marginTop: 4, fontWeight: '500' }, button: { backgroundColor: '#0056b3', height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 25 }, buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }, backButton: { marginTop: 20, alignItems: 'center' }, backButtonText: { color: '#666', fontSize: 14, fontWeight: '500' } });
