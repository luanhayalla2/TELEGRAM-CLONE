export const Theme = {
    colors: {
        primary: '#2F6BFF',    // Azul Neon
        secondary: '#37C6E6',  // Ciano
        accent: '#7A3CFF',     // Roxo Neon
        background: '#0B0F2B', // Azul Escuro (Fundo)
        text: '#FFFFFF',       // Texto
        error: '#FF4B4B',
        inputBackground: '#1A1F3D',
        placeholder: '#8E94B7',
        card: '#11163A',
    },
    gradients: {
        brand: ['#2F6BFF', '#37C6E6', '#7A3CFF'] as [string, string, ...string[]],
        button: ['#2F6BFF', '#7A3CFF'] as [string, string, ...string[]],
    },
    typography: {
        bold: '700',
        semiBold: '600',
        regular: '400',
    }
};

export default Theme;
