// Tipo de día de entrenamiento
export type TipoDia = 'Push' | 'Pull' | 'Legs' | 'Torso' | 'Full Body' | 'Personalizado';

// Ejercicio dentro de un día de rutina
export interface EjercicioDia {
  ejercicioId: string;
  orden: number;
  
  // MODO SIMPLE (para principiantes)
  seriesSimples?: number; // Ej: 3 (tres series normales)
  
  // MODO AVANZADO (para usuarios experimentados)
  seriesAvanzadas?: ConfigSerie[];
  
  notasGenerales?: string;
}

// Un día de la rutina
export interface DiaRutina {
  id: string;
  nombre: string;        // "Push", "Pull", "Legs", etc.
  tipo: TipoDia;
  ejercicios: EjercicioDia[];
}

// Rutina completa
export interface Rutina {
  id: string;
  nombre: string;        // "PPL 6 días", "Torso-Pierna", etc.
  descripcion?: string;
  dias: DiaRutina[];
  activa: boolean;       // Solo una rutina puede estar activa
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// SESIONES DE ENTRENAMIENTO
// ============================================

// Bloque ejecutado en sesión (peso/reps reales)
export interface BloqueEjecutado {
  numero: number;
  tipo: TipoBloque;
  peso: number;
  reps: number;
  tiempoSegundos?: number;  // Para isométricas
  completado: boolean;
}

// Serie ejecutada en sesión
export interface SerieSesion {
  numero: number;
  bloques: BloqueEjecutado[];  // ← Array de bloques ejecutados
  completada: boolean;
  notasSerie?: string;
}

export interface EjercicioSesion {
  ejercicioId: string;
  series: SerieSesion[];
  configuracion?: EjercicioDia;  // ← Guardamos la config original
}

export interface Sesion {
  id: string;
  userId: string; 
  rutinaId: string;
  diaId: string;
  fecha: Date;
  ejercicios: EjercicioSesion[];
  completada: boolean;
  duracion?: number;
  notas?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CrearSesionDTO {
  userId: string;
  rutinaId: string;
  diaId: string;
  fecha: Date;
  ejercicios: EjercicioSesion[];
  completada: boolean;
  duracion?: number;
  notas?: string;
}

// ============================================
// TÉCNICAS DE ENTRENAMIENTO
// ============================================

export interface TecnicaEntrenamiento {
  id: string;
  nombre: string; // "Top Set", "Drop Set", "Mi técnica"
  descripcion: string; // "Serie al máximo peso posible"
  esPredefinida: boolean; // true = no se puede borrar
  icono?: string; // "🔥", "💪", "⚡"
  color?: string; // "#FF5733" para UI
  parametros?: TecnicaParametros; // Configuración avanzada
  createdAt: Date;
  updatedAt: Date;
}

export interface TecnicaParametros {
  requiereRIR?: boolean; // ¿Necesita especificar RIR?
  requierePorcentajePeso?: boolean; // ¿Usa % de peso? (Back Off)
  requiereDescansoEspecifico?: boolean; // ¿Descanso custom?
  sugerenciaReps?: string; // "6-9 reps", "Al fallo", etc.
  sugerenciaDescanso?: string; // "5-6 minutos", "15 segundos"
  instrucciones?: string; // Explicación detallada
}

export interface CrearTecnicaDTO {
  nombre: string;
  descripcion: string;
  esPredefinida?: boolean;
  icono?: string;
  color?: string;
  parametros?: TecnicaParametros;
}

// Tipo de bloque dentro de una serie
export type TipoBloque = 
  | 'principal'      // Serie normal
  | 'rest-pause'     // Microserie Rest Pause
  | 'drop'           // Bajada Drop Set
  | 'myo-rep'        // Microserie Myo Reps
  | 'parcial'        // Parciales
  | 'isometrica'     // Isométrica
  | 'cluster';       // Cluster

// Configuración de un bloque individual
export interface ConfigBloque {
  numero: number;
  tipo: TipoBloque;
  repsMin?: number;
  repsMax?: number;
  porcentajePeso?: number;  // % del peso base (100, 80, 50)
  tiempoSegundos?: number;  // Para isométricas
  notas?: string;
}

// Configuración de serie completa
export interface ConfigSerie {
  numero: number;
  tecnicaId: string;
  rir?: number;
  descansoSegundos?: number;
  bloques: ConfigBloque[];  // ← Array de bloques
  notasGenerales?: string;
}


export type CrearRutinaDTO = Omit<Rutina, 'id' | 'createdAt' | 'updatedAt'>;
export type ActualizarRutinaDTO = Partial<Rutina> & { id: string };