export const lightTheme = {
    colors: {
        primary: '#0066FF',    // Azul limpo
        secondary: '#00B4D8',  // Cyan limpo
        accent: '#7209B7',     // Roxo
        background: '#F8FAFC', // Cinza muito claro pra fundo
        card: '#FFFFFF',       // Branco para cards
        text: '#0F172A',       // Texto escuro (slate-900)
        textMuted: '#64748B',  // Texto secundário (slate-500)
        error: '#EF4444',      // Vermelho (destructive)
        success: '#22C55E',    // Verde
        warning: '#F59E0B',    // Laranja
        inputBackground: '#F1F5F9', // slate-100
        placeholder: '#94A3B8', // slate-400
        chatOutgoing: '#0066FF',
        chatIncoming: '#FFFFFF',
        border: '#E2E8F0',     // slate-200
    },
    gradients: {
        brand: ['#0066FF', '#00B4D8'] as [string, string, ...string[]],
        button: ['#0066FF', '#0077FF'] as [string, string, ...string[]],
    },
    typography: {
        bold: '700',
        semiBold: '600',
        regular: '400',
    }
};

export const darkTheme = {
    colors: {
        primary: '#3B82F6',    // Azul vibrante
        secondary: '#06B6D4',  // Cyan vibrante
        accent: '#8B5CF6',     // Roxo pastel
        background: '#0F172A', // Slate 900
        card: '#1E293B',       // Slate 800
        text: '#F8FAFC',       // Slate 50
        textMuted: '#94A3B8',  // Slate 400
        error: '#F87171',      // Destructive
        success: '#4ADE80',    // Success
        warning: '#FBBF24',    // Warning
        inputBackground: '#334155', // Slate 700
        placeholder: '#64748B', // Slate 500
        chatOutgoing: '#3B82F6',
        chatIncoming: '#1E293B',
        border: '#334155',     // Slate 700
    },
    gradients: {
        brand: ['#3B82F6', '#06B6D4', '#8B5CF6'] as [string, string, ...string[]],
        button: ['#3B82F6', '#6366F1'] as [string, string, ...string[]],
    },
    typography: {
        bold: '700',
        semiBold: '600',
        regular: '400',
    }
};

// Default export uses dark theme to maintain current look, but aliased for gradual migration
export const Theme = darkTheme;

export default Theme;
