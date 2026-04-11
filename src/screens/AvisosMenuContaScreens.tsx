import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../contexts/AuthContext';

const C = { primary: '#20539D', white: '#FFFFFF', bg: '#F0F4FB', card: '#FFFFFF', text: '#1A2942', sub: '#6B7E9B', border: '#E8EEF7', urgent: '#DC2626', urgentBg: '#FEF2F2', open: '#D97706', openBg: '#FFFBEB', done: '#16A34A', doneBg: '#F0FDF4' };

function PageHeader({ title, sub }: { title: string; sub: string }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.header, { paddingTop: insets.top + 14 }]}>
      <View style={s.hCircle} />
      <Text style={s.hTitle}>{title}</Text>
      <Text style={s.hSub}>{sub}</Text>
    </View>
  );
}

// ── AVISOS ────────────────────────────────────────────────────────────────────
const AVISOS = [
  { id: 1, tipo: 'Manutenção', titulo: 'Servidores offline domingo 02h–05h', hora: 'Hoje, 09:14', icon: 'construct-outline' as const, cor: C.open, bg: C.openBg },
  { id: 2, tipo: 'Segurança', titulo: 'Nova política de senhas corporativas', hora: 'Ontem, 16:42', icon: 'key-outline' as const, cor: C.primary, bg: '#EAF0FB' },
  { id: 3, tipo: 'Alerta', titulo: 'Tentativas de phishing — Dep. Financeiro', hora: '08/03, 11:00', icon: 'warning-outline' as const, cor: C.urgent, bg: C.urgentBg },
];

export function AvisosScreen() {
  return (
    <View style={s.root}>
      <PageHeader title="Avisos" sub={`${AVISOS.length} avisos não lidos`} />
      <ScrollView contentContainerStyle={s.list} showsVerticalScrollIndicator={false}>
        {AVISOS.map(a => (
          <TouchableOpacity key={a.id} style={s.card} accessible={true} accessibilityLabel={a.titulo}>
            <View style={[s.aIcon, { backgroundColor: a.bg }]}>
              <Ionicons name={a.icon} size={22} color={a.cor} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[s.aType, { color: a.cor }]}>{a.tipo}</Text>
                <Text style={s.meta}>{a.hora}</Text>
              </View>
              <Text style={s.ttitle}>{a.titulo}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

// ── MENU ──────────────────────────────────────────────────────────────────────
const MENU_ITEMS = [
  { icon: 'ticket-outline' as const, label: 'Novo Chamado', sub: 'Abrir solicitação de suporte' },
  { icon: 'bar-chart-outline' as const, label: 'Relatórios', sub: 'Visualizar métricas e dados' },
  { icon: 'people-outline' as const, label: 'Equipe', sub: 'Gerenciar técnicos' },
  { icon: 'settings-outline' as const, label: 'Configurações', sub: 'Preferências do sistema' },
  { icon: 'help-circle-outline' as const, label: 'Suporte', sub: 'Central de ajuda' },
];

export function MenuScreen() {
  return (
    <View style={s.root}>
      <PageHeader title="Menu" sub="Navegação rápida" />
      <ScrollView contentContainerStyle={s.list} showsVerticalScrollIndicator={false}>
        {MENU_ITEMS.map(item => (
          <TouchableOpacity key={item.label} style={s.menuItem} accessible={true} accessibilityLabel={item.label}>
            <View style={s.menuIcon}>
              <Ionicons name={item.icon} size={22} color={C.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.menuLabel}>{item.label}</Text>
              <Text style={s.menuSub}>{item.sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={C.sub} />
          </TouchableOpacity>
        ))}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

// ── CONTA ─────────────────────────────────────────────────────────────────────
export function ContaScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // PUXANDO OS DADOS DO FIREBASE
  const { usuario, deslogar } = useAuth();

  const handleLogout = async () => {
    try {
      await deslogar(); // Avisa o Firebase que o usuário saiu
      navigation.replace('Login'); // Joga de volta para a tela de login
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <View style={s.root}>
      <PageHeader title="Minha Conta" sub="Configurações do perfil" />

      <ScrollView contentContainerStyle={s.list} showsVerticalScrollIndicator={false}>

        {/* Bloco do Avatar (Agora com dados reais) */}
        <View style={{ alignItems: 'center', marginVertical: 20 }}>
          <Text style={[s.statVal, { fontSize: 22 }]}>{usuario?.nome || 'Usuário'}</Text>
          <Text style={{ color: C.sub }}>{usuario?.email || 'E-mail não disponível'}</Text>
        </View>

        {/* Stats */}
        <View style={s.statsRow}>
          {[['32', 'Resolvidos'], ['4', 'Pendentes'], ['98%', 'Satisfação']].map(([v, l]) => (
            <React.Fragment key={l}>
              <View style={s.statItem}>
                <Text style={s.statVal}>{v}</Text>
                <Text style={s.statLabel}>{l}</Text>
              </View>
              {l !== 'Satisfação' && <View style={s.statDiv} />}
            </React.Fragment>
          ))}
        </View>

        {/* Opções */}
        {([
          { icon: 'person-outline' as const, label: 'Editar perfil' },
          { icon: 'lock-closed-outline' as const, label: 'Alterar senha' },
          { icon: 'notifications-outline' as const, label: 'Notificações' },
        ]).map(item => (
          <TouchableOpacity
            key={item.label}
            style={s.menuItem}
            accessible={true}
            accessibilityLabel={item.label}
          >
            <View style={s.menuIcon}>
              <Ionicons name={item.icon} size={20} color={C.primary} />
            </View>
            <Text style={[s.menuLabel, { flex: 1 }]}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={16} color={C.sub} />
          </TouchableOpacity>
        ))}

        {/* Botão Sair Atualizado */}
        <TouchableOpacity
          style={s.logout}
          onPress={handleLogout}
          accessible={true}
          accessibilityLabel="Sair da conta"
          accessibilityRole="button"
        >
          <Ionicons name="log-out-outline" size={18} color={C.urgent} />
          <Text style={s.logoutText}>Sair da conta</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

// ── Styles compartilhados ─────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: { backgroundColor: C.primary, paddingHorizontal: 20, paddingBottom: 20, overflow: 'hidden', position: 'relative' },
  hCircle: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.06)', right: -50, top: -50 },
  hTitle: { fontSize: 22, fontWeight: '800', color: C.white, marginBottom: 2 },
  hSub: { fontSize: 12, color: 'rgba(255,255,255,0.65)' },
  list: { padding: 16 },
  card: { backgroundColor: C.card, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10, borderWidth: 1, borderColor: C.border, elevation: 2 },
  aIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  aType: { fontSize: 11, fontWeight: '700', marginBottom: 3 },
  ttitle: { fontSize: 13, fontWeight: '600', color: C.text },
  meta: { fontSize: 11, color: C.sub },
  menuItem: { backgroundColor: C.card, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10, borderWidth: 1, borderColor: C.border, elevation: 2 },
  menuIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#EAF0FB', justifyContent: 'center', alignItems: 'center' },
  menuLabel: { fontSize: 14, fontWeight: '700', color: C.text },
  menuSub: { fontSize: 12, color: C.sub, marginTop: 1 },
  profileCard: { backgroundColor: C.card, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14, borderWidth: 1, borderColor: C.border },
  avatar: { width: 56, height: 56, borderRadius: 16, backgroundColor: C.primary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 20, fontWeight: '800', color: C.white },
  profileName: { fontSize: 16, fontWeight: '800', color: C.text },
  profileRole: { fontSize: 12, color: C.sub, marginTop: 2 },
  profileEmail: { fontSize: 11, color: C.primary, marginTop: 2 },
  statsRow: { backgroundColor: C.card, borderRadius: 16, padding: 16, flexDirection: 'row', justifyContent: 'space-around', marginBottom: 14, borderWidth: 1, borderColor: C.border },
  statItem: { alignItems: 'center' },
  statVal: { fontSize: 22, fontWeight: '800', color: C.primary },
  statLabel: { fontSize: 12, color: C.sub, marginTop: 2 },
  statDiv: { width: 1, backgroundColor: C.border },
  logout: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 10, padding: 14, borderRadius: 14, borderWidth: 1.5, borderColor: C.urgent + '55', backgroundColor: C.urgentBg },
  logoutText: { fontSize: 14, fontWeight: '700', color: C.urgent },
});
