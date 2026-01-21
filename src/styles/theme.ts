// PALETA DE COLORES
export const colors = {
  // Primarios
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',  // Azul principal
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  
  // Secundarios (Verde/Success)
  success: {
    400: '#4ADE80',
    500: '#10B981',
    600: '#059669',
  },
  
  // Acento (Naranja/Warning)
  accent: {
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
  },
  
  // Peligro (Rojo)
  danger: {
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
  },
  
  // Grises/Fondos
  dark: {
    900: '#0F172A',  // Negro profundo
    800: '#1E293B',  // Gris muy oscuro
    700: '#334155',  // Gris oscuro
    600: '#475569',  // Gris medio oscuro
    500: '#64748B',  // Gris medio
    400: '#94A3B8',  // Gris claro
    300: '#CBD5E1',
    200: '#E2E8F0',
    100: '#F1F5F9',
  },
  
  // Textos
  text: {
    primary: '#F8FAFC',    // Blanco casi puro
    secondary: '#CBD5E1',  // Gris claro
    tertiary: '#94A3B8',   // Gris medio
    disabled: '#64748B',   // Gris oscuro
  }
};

// ESPACIADO
export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
};

// RADIOS (bordes redondeados)
export const radius = {
  sm: '0.375rem',  // 6px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  full: '9999px',  // Completamente redondo
};

// SOMBRAS
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  glow: '0 0 20px rgba(59, 130, 246, 0.3)',  // Brillo azul
};

// TAMAÑOS DE FUENTE
export const fontSize = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem',  // 36px
  '5xl': '3rem',     // 48px
};

// PESOS DE FUENTE
export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
};

// TRANSICIONES
export const transitions = {
  fast: '150ms ease-in-out',
  base: '200ms ease-in-out',
  slow: '300ms ease-in-out',
};

// TAMAÑOS DE INPUTS (móvil-first)
export const inputSizes = {
  sm: {
    height: '2.5rem',   // 40px
    padding: '0.5rem 0.75rem',
    fontSize: fontSize.sm,
  },
  md: {
    height: '3rem',     // 48px - PERFECTO PARA MÓVIL
    padding: '0.75rem 1rem',
    fontSize: fontSize.base,
  },
  lg: {
    height: '3.5rem',   // 56px
    padding: '1rem 1.25rem',
    fontSize: fontSize.lg,
  },
};

// TAMAÑOS DE BOTONES
export const buttonSizes = {
  sm: {
    height: '2.5rem',
    padding: '0.5rem 1rem',
    fontSize: fontSize.sm,
  },
  md: {
    height: '3rem',     // 48px - PERFECTO PARA MÓVIL
    padding: '0.75rem 1.5rem',
    fontSize: fontSize.base,
  },
  lg: {
    height: '3.5rem',   // 56px
    padding: '1rem 2rem',
    fontSize: fontSize.lg,
  },
};