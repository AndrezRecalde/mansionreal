// Helper para obtener color de estado

export const getEstadoColor = (theme, estadoColor) => {
    if (theme.colors[estadoColor]) {
        return theme.colors[estadoColor][4];
    }
    return estadoColor;
};
