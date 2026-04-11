import { NativeStackScreenProps } from '@react-navigation/native-stack';

// ─── Stack raiz (auth + tabs) ─────────────────────────────────────────────────

export type RootStackParamList = {
    Login: undefined;
    Cadastro: undefined;
    EsqueceuSenha: undefined;
    MainTabs: undefined;
    NovoChamado: undefined;
    DetalhesChamado: { chamadoId: string };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
    NativeStackScreenProps<RootStackParamList, T>;