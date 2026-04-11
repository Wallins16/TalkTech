import React, { createContext, useContext, ReactNode } from 'react';

interface ThemeColors {
    primary: string;
    background: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
}

interface ThemeContextData {
    colors: ThemeColors;
}

const colors: ThemeColors = {
    primary: '#20539D',
    background: '#F0F4FB',
    card: '#FFFFFF',
    text: '#1A2942',
    textSecondary: '#6B7E9B',
    border: '#E8EEF7',
};

const ThemeContext = createContext<ThemeContextData>({ colors });

export function ThemeProvider({ children }: { children: ReactNode }) {
    return <ThemeContext.Provider value={{ colors }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    return useContext(ThemeContext);
}
