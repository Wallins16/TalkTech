import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useChamados, Chamado } from '../contexts/ChamadosContext';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../contexts/AuthContext';

const C = {
  primary: '#20539D', white: '#FFFFFF', bg: '#F0F4FB', card: '#FFFFFF',
  text: '#1A2942', sub: '#6B7E9B', border: '#E8EEF7',
  urgent: '#DC2626', urgentBg: '#FEF2F2',
  open: '#D97706', openBg: '#FFFBEB',
  done: '#16A34A', doneBg: '#F0FDF4',
};

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const { chamados } = useChamados();
  const { usuario } = useAuth();

  const urgentes = chamados.filter(c => c.prioridade === 'Urgente');
  const abertos = chamados.filter(c => c.status === 'Aberto');
  const finalizados = chamados.filter(c => c.status === 'Finalizado');

  const renderUrgente = ({ item }: { item: Chamado }) => (
    <TouchableOpacity
      style={s.ticket}
      onPress={() => navigation.navigate('DetalhesChamado', { chamadoId: item.id })}
    >
      <View style={[s.stripe, { backgroundColor: item.prioridade === 'Urgente' ? C.urgent : C.open }]} />
      <View style={{ flex: 1 }}>
        <Text style={[s.ticketId, { color: C.primary }]}>
          {item.id.substring(0, 6)} · {item.prioridade === 'Urgente' ? 'Crítico' : 'Normal'}
        </Text>
        <Text style={s.ticketTitle} numberOfLines={1}>{item.titulo}</Text>
        <Text style={s.ticketMeta}>Fila: {item.fila}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={C.sub} />
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <FlatList
        data={urgentes}
        keyExtractor={item => item.id}
        renderItem={renderUrgente}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          s.listContent,
          { paddingBottom: Platform.OS === 'ios' ? insets.bottom + 84 : 80 },
        ]}
        ListHeaderComponent={
          <>
            {/* Header Azul Corrigido */}
            <View style={[s.header, { paddingTop: insets.top + 10 }]}>
              <View style={{ flex: 1 }}>
                <Text style={s.greet}>Olá, {usuario?.nome || 'Técnico'}</Text>
                <Text style={s.role}>Técnico de TI</Text>
              </View>

              <TouchableOpacity
                style={s.newBtn}
                onPress={() => navigation.navigate('NovoChamado')}
              >
                <Ionicons name="add-circle" size={20} color={C.white} />
                <Text style={s.newBtnText}>Novo</Text>
              </TouchableOpacity>
            </View>

            {/* Cards de status */}
            <View style={s.statusSection}>
              <Text style={s.secTitle}>Status dos Chamados</Text>
              <View style={s.statusRow}>
                <View style={[s.statusCard, { backgroundColor: C.urgentBg, borderColor: C.urgent + '44' }]}>
                  <Ionicons name="warning" size={20} color={C.urgent} />
                  <Text style={[s.statusVal, { color: C.urgent }]}>{urgentes.length}</Text>
                  <Text style={[s.statusLabel, { color: C.urgent }]}>Urgentes</Text>
                </View>
                <View style={[s.statusCard, { backgroundColor: C.openBg, borderColor: C.open + '44' }]}>
                  <Ionicons name="folder-open" size={20} color={C.open} />
                  <Text style={[s.statusVal, { color: C.open }]}>{abertos.length}</Text>
                  <Text style={[s.statusLabel, { color: C.open }]}>Abertos</Text>
                </View>
                <View style={[s.statusCard, { backgroundColor: C.doneBg, borderColor: C.done + '44' }]}>
                  <Ionicons name="checkmark-circle" size={20} color={C.done} />
                  <Text style={[s.statusVal, { color: C.done }]}>{finalizados.length}</Text>
                  <Text style={[s.statusLabel, { color: C.done }]}>Finalizados</Text>
                </View>
              </View>
            </View>

            <Text style={[s.secTitle, { paddingHorizontal: 16 }]}>Chamados Urgentes</Text>
            {urgentes.length === 0 && (
              <View style={s.emptyUrgentes}>
                <Ionicons name="checkmark-circle" size={36} color={C.done} />
                <Text style={s.emptyText}>Nenhum chamado urgente no momento!</Text>
              </View>
            )}
          </>
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    backgroundColor: C.primary,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  greet: { fontSize: 20, fontWeight: '800', color: C.white, marginBottom: 4 },
  role: { fontSize: 13, color: 'rgba(255,255,255,0.75)' },
  newBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7,
  },
  newBtnText: { fontSize: 13, fontWeight: '700', color: C.white },
  statusSection: { padding: 16 },
  secTitle: { fontSize: 14, fontWeight: '700', color: C.text, marginBottom: 10, marginTop: 4 },
  statusRow: { flexDirection: 'row', gap: 10, marginBottom: 4 },
  statusCard: { flex: 1, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1 },
  statusVal: { fontSize: 22, fontWeight: '800', marginVertical: 4 },
  statusLabel: { fontSize: 11, fontWeight: '600' },
  listContent: { paddingTop: 0 },
  ticket: {
    backgroundColor: C.card, borderRadius: 14, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    marginBottom: 10, marginHorizontal: 16,
    borderWidth: 1, borderColor: C.border, elevation: 2,
  },
  stripe: { width: 4, height: 44, borderRadius: 4 },
  ticketId: { fontSize: 12, fontWeight: '700', marginBottom: 2 },
  ticketTitle: { fontSize: 13, fontWeight: '600', color: C.text, marginBottom: 3 },
  ticketMeta: { fontSize: 11, color: C.sub },
  emptyUrgentes: { alignItems: 'center', paddingVertical: 32, gap: 10 },
  emptyText: { fontSize: 14, color: C.sub },
});