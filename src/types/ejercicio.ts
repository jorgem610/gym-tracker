// Grupos musculares específicos
export type GrupoMuscular = 
  | 'Pecho' 
  | 'Espalda' 
  | 'Hombros' 
  | 'Bíceps' 
  | 'Tríceps'
  | 'Cuádriceps'
  | 'Femoral'
  | 'Glúteos'
  | 'Gemelos'
  | 'Core';

// Rango de repeticiones
export interface RangoReps {
  min: number;
  max: number;
}

// Ejercicio completo
export interface Ejercicio {
  id: string;
  nombre: string;
  grupoMuscular: GrupoMuscular;
  rangoReps: RangoReps;
  incrementoPeso: number;
  notas?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Para crear ejercicio (sin id, sin fechas)
export type CrearEjercicioDTO = Omit<Ejercicio, 'id' | 'createdAt' | 'updatedAt'>;

// Para actualizar ejercicio (todo opcional excepto id)
export type ActualizarEjercicioDTO = Partial<Ejercicio> & { id: string };