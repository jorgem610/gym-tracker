import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';
import type { Sesion } from '../types';

const SESIONES_COLLECTION = 'sesiones';

// Obtener última sesión de un ejercicio específico
export async function obtenerUltimaSesionEjercicio(
  userId: string,
  ejercicioId: string
): Promise<Sesion | null> {
  try {
    const q = query(
      collection(db, SESIONES_COLLECTION),
      where('userId', '==', userId),
      where('completada', '==', true),
      orderBy('fecha', 'desc'),
      limit(50) // Últimas 50 sesiones
    );

    const snapshot = await getDocs(q);
    
    // Buscar la sesión más reciente que contenga este ejercicio
    for (const doc of snapshot.docs) {
      const sesion = { id: doc.id, ...doc.data() } as Sesion;
      const tieneEjercicio = sesion.ejercicios.some(e => e.ejercicioId === ejercicioId);
      
      if (tieneEjercicio) {
        return sesion;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error al obtener última sesión:', error);
    return null;
  }
}

// Calcular sugerencia de progresión
export function calcularSugerencia(
  pesoAnterior: number,
  repsAnteriores: number,
  repsMin: number,
  repsMax: number
): { peso: number; reps: number; razon: string } {
  // Si está en el TOPE del rango → Sube peso
  if (repsAnteriores >= repsMax) {
    return {
      peso: pesoAnterior + 2.5,
      reps: repsMin,
      razon: `Llegaste al tope (${repsMax} reps) → Sube peso`
    };
  }
  
  // Si está DENTRO del rango → +1 rep
  if (repsAnteriores >= repsMin && repsAnteriores < repsMax) {
    return {
      peso: pesoAnterior,
      reps: repsAnteriores + 1,
      razon: `Dentro del rango → +1 rep`
    };
  }
  
  // Si está DEBAJO del rango → Recuperar al mínimo
  if (repsAnteriores < repsMin) {
    return {
      peso: pesoAnterior,
      reps: repsMin,
      razon: `Recuperar al mínimo del rango`
    };
  }
  
  // Si está SOBRE el rango → Sube peso
  return {
    peso: pesoAnterior + 2.5,
    reps: repsMin,
    razon: `Superaste el rango → Sube peso`
  };
}