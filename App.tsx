import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Contextos
import { ChamadosProvider } from './src/contexts/ChamadosContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { AuthProvider } from './src/contexts/AuthContext';

// Telas
import LoginScreen from './src/screens/LoginScreen';
import CadastroScreen from './src/screens/auth/CadastroScreen';
import EsqueceuSenhaScreen from './src/screens/auth/EsqueceuSenhaScreen';
import MainTabs from './src/routes/MainTabs';
import NovoChamadoScreen from './src/screens/NovoChamadoScreen';
import DetalhesChamadoScreen from './src/screens/DetalhesChamadoScreen';
import { RootStackParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ChamadosProvider>
          <NavigationContainer>
            <StatusBar style="light" backgroundColor="#20539D" />
            <Stack.Navigator screenOptions={{ headerShown: false }}>

              {/* Fluxo de Auth */}
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Cadastro" component={CadastroScreen} />
              <Stack.Screen name="EsqueceuSenha" component={EsqueceuSenhaScreen} />

              {/* App principal */}
              <Stack.Screen name="MainTabs" component={MainTabs} />

              {/* Fluxo de chamados (sobre as tabs) */}
              <Stack.Screen
                name="NovoChamado"
                component={NovoChamadoScreen}
                options={{ presentation: 'card' }}
              />
              <Stack.Screen
                name="DetalhesChamado"
                component={DetalhesChamadoScreen}
                options={{ presentation: 'card' }}
              />

            </Stack.Navigator>
          </NavigationContainer>
        </ChamadosProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}