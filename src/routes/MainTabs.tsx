import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import ChamadosScreen from '../screens/ChamadosScreen';
import { AvisosScreen, MenuScreen, ContaScreen } from '../screens/AvisosMenuContaScreens';

const Tab = createBottomTabNavigator();

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_ICONS: Record<string, { on: IoniconName; off: IoniconName }> = {
  Menu: { on: 'menu', off: 'menu-outline' },
  Avisos: { on: 'notifications', off: 'notifications-outline' },
  Home: { on: 'home', off: 'home-outline' },
  Chamados: { on: 'ticket', off: 'ticket-outline' },
  Conta: { on: 'person-circle', off: 'person-circle-outline' },
};

// Botão flutuante centralizado para a aba Home
function FloatingHomeButton(props: BottomTabBarButtonProps) {
  return (
    <TouchableOpacity
      {...(props as any)}
      style={styles.floatingBtn}
      activeOpacity={0.85}
    >
      {props.children}
    </TouchableOpacity>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#20539D',
        tabBarInactiveTintColor: '#9DAFC6',
        tabBarStyle: styles.bar,
        tabBarLabelStyle: styles.label,
        tabBarIcon: ({ focused, color, size }) => {
          const cfg = TAB_ICONS[route.name] ?? TAB_ICONS['Home'];
          const iconSize = route.name === 'Home' ? 28 : 22;
          const iconColor = route.name === 'Home' ? '#FFFFFF' : color;
          return (
            <Ionicons
              name={focused ? cfg.on : cfg.off}
              size={iconSize}
              color={iconColor}
              accessible={true}
              accessibilityLabel={`Aba ${route.name}`}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Menu" component={MenuScreen} />
      <Tab.Screen name="Avisos" component={AvisosScreen} />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: '',
          tabBarButton: (props) => <FloatingHomeButton {...props} />,
        }}
      />
      <Tab.Screen name="Chamados" component={ChamadosScreen} />
      <Tab.Screen name="Conta" component={ContaScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8EEF7',
    height: Platform.OS === 'ios' ? 84 : 64,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 6,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 16,
    shadowColor: '#20539D',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
  },
  floatingBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -22, // sobe além da barra
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#20539D',
    shadowColor: '#20539D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 12,
    alignSelf: 'center',
  },
});
