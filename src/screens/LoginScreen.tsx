import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RootStackScreenProps } from '../types/navigation';

const schema = z.object({
  email: z.string().min(1, 'E-mail obrigatório').email('E-mail inválido'),
  senha: z.string().min(6, 'Mínimo 6 caracteres'),
});
type FormData = z.infer<typeof schema>;

export default function LoginScreen({ navigation }: RootStackScreenProps<'Login'>) {
  const [showSenha, setShowSenha] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', senha: '' },
  });

  const onSubmit = (_data: FormData) => {
    navigation.replace('MainTabs');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#20539D' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        {/* Hero */}
        <View style={s.hero}>
          <View style={s.logoBadge}>
            <Ionicons name="hardware-chip" size={34} color="#fff" accessible accessibilityLabel="Logo TalkTech" />
          </View>
          <Text style={s.appName}>TalkTech</Text>
          <Text style={s.appSub}>Gestão Corporativa de Chamados</Text>
        </View>

        {/* Card branco */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Entrar na sua conta</Text>

          <Text style={s.label}>E-mail</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[s.input, errors.email && s.inputError]}
                placeholder="exemplo@empresa.com.br"
                placeholderTextColor="#A0AEBF"
                keyboardType="email-address"
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                accessible
                accessibilityLabel="Campo de e-mail"
              />
            )}
          />
          {errors.email && <Text style={s.errorText}>{errors.email.message}</Text>}

          <Text style={s.label}>Senha</Text>
          <Controller
            control={control}
            name="senha"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={[s.inputRow, errors.senha && s.inputError]}>
                <TextInput
                  style={{ flex: 1, fontSize: 15, color: '#1A2942' }}
                  placeholder="••••••••"
                  placeholderTextColor="#A0AEBF"
                  secureTextEntry={!showSenha}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  accessible
                  accessibilityLabel="Campo de senha"
                />
                <TouchableOpacity
                  onPress={() => setShowSenha(v => !v)}
                  accessible
                  accessibilityLabel={showSenha ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  <Ionicons name={showSenha ? 'eye-off-outline' : 'eye-outline'} size={18} color="#6B7E9B" />
                </TouchableOpacity>
              </View>
            )}
          />
          {errors.senha && <Text style={s.errorText}>{errors.senha.message}</Text>}

          {/* Link Esqueceu senha */}
          <TouchableOpacity
            onPress={() => navigation.navigate('EsqueceuSenha')}
            style={s.forgotLink}
          >
            <Text style={s.forgotText}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          {/* Botão Entrar */}
          <TouchableOpacity
            style={s.btn}
            onPress={handleSubmit(onSubmit)}
            accessible
            accessibilityLabel="Botão Entrar"
            accessibilityRole="button"
          >
            <Text style={s.btnText}>Entrar</Text>
          </TouchableOpacity>

          {/* Link Cadastro */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Cadastro')}
            style={s.registerLink}
          >
            <Text style={s.registerText}>
              Não tem conta?{' '}
              <Text style={{ color: '#20539D', fontWeight: '700' }}>Cadastre-se</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  hero: { alignItems: 'center', paddingTop: 70, paddingBottom: 40 },
  logoBadge: {
    width: 68, height: 68, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 14,
  },
  appName: { fontSize: 30, fontWeight: '800', color: '#fff' },
  appSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 },

  card: { flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 28 },
  cardTitle: { fontSize: 20, fontWeight: '800', color: '#1A2942', marginBottom: 20 },

  label: { fontSize: 13, fontWeight: '600', color: '#3D5A80', marginBottom: 6 },
  input: {
    backgroundColor: '#F5F8FF', borderRadius: 12,
    borderWidth: 1.5, borderColor: '#D6E0F0',
    paddingHorizontal: 14, height: 50,
    fontSize: 15, color: '#1A2942', marginBottom: 4,
  },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F5F8FF', borderRadius: 12,
    borderWidth: 1.5, borderColor: '#D6E0F0',
    paddingHorizontal: 14, height: 50, marginBottom: 4,
  },
  inputError: { borderColor: '#DC2626', backgroundColor: '#FEF2F2' },
  errorText: { fontSize: 12, color: '#DC2626', marginBottom: 10 },

  forgotLink: { alignSelf: 'flex-end', marginBottom: 8, marginTop: 4 },
  forgotText: { fontSize: 12, color: '#20539D', fontWeight: '600' },

  btn: {
    backgroundColor: '#20539D', borderRadius: 12,
    height: 52, justifyContent: 'center', alignItems: 'center', marginTop: 16,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  registerLink: { marginTop: 20, alignItems: 'center' },
  registerText: { fontSize: 14, color: '#6B7E9B' },
});
