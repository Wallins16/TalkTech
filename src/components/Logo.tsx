import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LogoProps {
    showSubtitle?: boolean;
}

export default function Logo({ showSubtitle = true }: LogoProps) {
    return (
        <View style={styles.container}>
            <View style={styles.badge}>
                <Ionicons name="hardware-chip" size={32} color="#fff" />
            </View>
            <Text style={styles.name}>TalkTech</Text>
            {showSubtitle && (
                <Text style={styles.subtitle}>Gestão Corporativa de Chamados</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { alignItems: 'center', marginBottom: 24 },
    badge: {
        width: 64,
        height: 64,
        borderRadius: 18,
        backgroundColor: '#20539D',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#20539D',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    name: { fontSize: 28, fontWeight: '800', color: '#20539D' },
    subtitle: { fontSize: 13, color: '#6B7E9B', marginTop: 4 },
});
