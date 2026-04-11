import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useChamados, Chamado } from '../contexts/ChamadosContext';
import { RootStackParamList } from '../types/navigation';

const C = {
  primary: '#20539D', white: '#FFFFFF', bg: '#F0F4FB', card: '#FFFFFF',
  text: '#1A2942', sub: '#6B7E9B', border: '#E8EEF7',
  urgent: '#DC2626', urgentBg: '#FEF2F2',
  open: '#D97706', openBg: '#FFFBEB',
  done: '#16A34A', doneBg: '#F0FDF4',
};

const FILTERS = ['Todos', 'Urgente', 'Aberto', 'Finalizado'] as const;
type Filter = typeof FILTERS[number];

type Nav = NativeStackNavigationProp<RootStackParamList>;

function statusColor(status: string) {
  if (status === 'Urgente') return C.urgent;
  if (status === 'Finalizado') return C.done;
  return C.open;
}

export default function ChamadosScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const { chamados } = useChamados();
  const [filter, setFilter] = useState<Filter>('Todos');

  const lista = filter === 'Todos' ? chamados : chamados.filter(c => c.status === filter);

  const renderItem = ({ item }: { item: Chamado }) => {
    const cor = statusColor(item.status);
    return (
      <TouchableOpacity
        style={s.card}
        onPress={() => navigation.navigate('DetalhesChamado', { chamadoId: item.id })}
        accessible
        accessibilityLabel={`${item.id} ${item.titulo}`}
      >
        <View style={[s.stripe, { backgroundColor: cor }]} />
        <View style={{ flex: 1 }}>
          <Text style={[s.tid, { color: C.primary }]}>{item.id.substring(0, 8)}</Text>
          <Text style={s.ttitle} numberOfLines={1}>{item.titulo}</Text>
          <Text style={s.meta}>Dep. {item.fila} • {item.status}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={C.sub} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 14 }]}>
        <View style={{ flex: 1 }}>
          <Text style={s.hTitle}>Chamados</Text>
          <Text style={s.hSub}>{chamados.length} chamados registrados</Text>
        </View>
        <TouchableOpacity
          style={s.newBtn}
          onPress={() => navigation.navigate('NovoChamado')}
        >
          <Ionicons name="add" size={20} color={C.white} />
          <Text style={s.newBtnText}>Novo</Text>
        </TouchableOpacity>
      </View>

      {/* Filtros Travados */}
      <View style={{ height: 160 }}>
        <FlatList
          horizontal
          data={FILTERS as unknown as Filter[]}
          keyExtractor={f => f}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.filters}
          renderItem={({ item: f }) => (
            <TouchableOpacity
              style={[s.chip, filter === f && s.chipActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[s.chipText, filter === f && s.chipTextActive]}>{f}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Lista de Chamados */}
      <FlatList
        data={lista}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={[
          s.listContent,
          { paddingBottom: Platform.OS === 'ios' ? insets.bottom + 84 : 80 },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.emptyContainer}>
            <Ionicons name="ticket-outline" size={48} color={C.sub} />
            <Text style={s.emptyText}>Nenhum chamado {filter !== 'Todos' ? `com status "${filter}"` : ''}.</Text>
          </View>
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
  },
  hTitle: { fontSize: 22, fontWeight: '800', color: C.white, marginBottom: 2 },
  hSub: { fontSize: 12, color: 'rgba(255,255,255,0.65)' },
  newBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7,
  },
  newBtnText: { fontSize: 13, fontWeight: '700', color: C.white },

  filters: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12, // Espaço fixo entre eles
  },
  chip: {
    // --- MUDANÇA PARA CARDS IGUAIS ---
    width: 90,           // Todos com a mesma largura
    height: 130,         // Todos com a mesma altura (estilo card)
    borderRadius: 16,
    backgroundColor: C.card,
    borderWidth: 1.5,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
    // Sombra para destacar no fundo cinza
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chipActive: {
    backgroundColor: C.primary,
    borderColor: C.primary
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: C.sub,
    textAlign: 'center'
  },
  chipTextActive: {
    color: C.white
  },

  listContent: { padding: 16 },
  card: {
    backgroundColor: C.card, borderRadius: 14, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    marginBottom: 10, borderWidth: 1, borderColor: C.border, elevation: 2,
  },
  stripe: { width: 4, height: 44, borderRadius: 4 },
  tid: { fontSize: 11, fontWeight: '700', marginBottom: 2 },
  ttitle: { fontSize: 13, fontWeight: '600', color: C.text, marginBottom: 3 },
  meta: { fontSize: 11, color: C.sub },

  emptyContainer: { alignItems: 'center', marginTop: 60, gap: 12 },
  emptyText: { fontSize: 14, color: C.sub, textAlign: 'center' },
});