import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import type { TecnicaEntrenamiento, CrearTecnicaDTO } from '../types';

const COLLECTION_NAME = 'tecnicas_entrenamiento';

// CREAR técnica
export async function crearTecnica(data: CrearTecnicaDTO): Promise<TecnicaEntrenamiento> {
  try {
    const dataLimpia = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    );

    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...dataLimpia,
      esPredefinida: data.esPredefinida || false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return {
      id: docRef.id,
      ...data,
      esPredefinida: data.esPredefinida || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error('Error al crear técnica:', error);
    throw new Error('No se pudo crear la técnica');
  }
}

// OBTENER todas las técnicas
export async function obtenerTecnicas(): Promise<TecnicaEntrenamiento[]> {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        nombre: data.nombre,
        descripcion: data.descripcion,
        esPredefinida: data.esPredefinida || false,
        icono: data.icono,
        color: data.color,
        parametros: data.parametros,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as TecnicaEntrenamiento;
    });
  } catch (error) {
    console.error('Error al obtener técnicas:', error);
    throw new Error('No se pudieron cargar las técnicas');
  }
}

// OBTENER técnicas predefinidas
export async function obtenerTecnicasPredefinidas(): Promise<TecnicaEntrenamiento[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('esPredefinida', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        nombre: data.nombre,
        descripcion: data.descripcion,
        esPredefinida: true,
        icono: data.icono,
        color: data.color,
        parametros: data.parametros,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as TecnicaEntrenamiento;
    });
  } catch (error) {
    console.error('Error al obtener técnicas predefinidas:', error);
    throw new Error('No se pudieron cargar las técnicas predefinidas');
  }
}

// ACTUALIZAR técnica (solo si NO es predefinida)
export async function actualizarTecnica(
  id: string, 
  data: Partial<Omit<TecnicaEntrenamiento, 'id' | 'createdAt' | 'updatedAt' | 'esPredefinida'>>
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    
    const dataLimpia = Object.fromEntries(
      Object.entries({
        ...data,
        updatedAt: Timestamp.now(),
      }).filter(([_, v]) => v !== undefined)
    );

    await updateDoc(docRef, dataLimpia);
  } catch (error) {
    console.error('Error al actualizar técnica:', error);
    throw new Error('No se pudo actualizar la técnica');
  }
}

// BORRAR técnica (solo si NO es predefinida)
export async function borrarTecnica(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error('Error al borrar técnica:', error);
    throw new Error('No se pudo borrar la técnica');
  }
}

// SEEDEAR técnicas predefinidas (ejecutar una vez)
export async function seedearTecnicasPredefinidas(): Promise<void> {
  try {
    // Verificar si ya existen
    const existentes = await obtenerTecnicasPredefinidas();
    if (existentes.length > 0) {
      console.log('Técnicas predefinidas ya existen');
      return;
    }

    const tecnicasPredefinidas: CrearTecnicaDTO[] = [
      {
        nombre: 'Normal',
        descripcion: 'Serie estándar sin técnica especial',
        esPredefinida: true,
        icono: '💪',
        color: '#6B7280',
        parametros: {
          sugerenciaDescanso: '60-90 segundos',
        }
      },
      {
        nombre: 'Top Set',
        descripcion: 'Serie al máximo peso posible con técnica perfecta',
        esPredefinida: true,
        icono: '🔥',
        color: '#EF4444',
        parametros: {
          requiereRIR: true,
          sugerenciaReps: '6-9 reps',
          sugerenciaDescanso: '5-6 minutos',
          instrucciones: 'Máximo peso con técnica impecable. Realiza series de aproximación antes (50%, 75%, 90%).'
        }
      },
      {
        nombre: 'Back Off',
        descripcion: 'Serie con 20-30% menos peso que la Top Set',
        esPredefinida: true,
        icono: '⚡',
        color: '#F59E0B',
        parametros: {
          requiereRIR: true,
          requierePorcentajePeso: true,
          sugerenciaReps: '10-15 reps',
          sugerenciaDescanso: '3-4 minutos',
          instrucciones: 'Usa 70-80% del peso de la Top Set. Al fallo técnico.'
        }
      },
      {
        nombre: 'Drop Set',
        descripcion: 'Reducir peso 20% sin descanso hasta el fallo',
        esPredefinida: true,
        icono: '⬇️',
        color: '#8B5CF6',
        parametros: {
          requiereRIR: true,
          sugerenciaReps: 'Al fallo en cada bajada',
          sugerenciaDescanso: '0 segundos entre bajadas',
          instrucciones: 'Serie al fallo → bajar peso 20% → serie al fallo → repetir.'
        }
      },
      {
        nombre: 'Rest Pause',
        descripcion: 'Pausas de 10-15" entre microseries al fallo',
        esPredefinida: true,
        icono: '⏸️',
        color: '#EC4899',
        parametros: {
          requiereDescansoEspecifico: true,
          sugerenciaReps: '3-4 reps por microserie',
          sugerenciaDescanso: '10-15 segundos',
          instrucciones: 'Serie pesada RIR 1 → pausa 10-15" → 3-4 reps forzadas → repetir.'
        }
      },
      {
        nombre: 'Myo Reps',
        descripcion: '5 microseries de 3 reps con 15" descanso',
        esPredefinida: true,
        icono: '🎯',
        color: '#10B981',
        parametros: {
          requiereDescansoEspecifico: true,
          sugerenciaReps: '3 reps × 5 series',
          sugerenciaDescanso: '15 segundos',
          instrucciones: 'Serie inicial RIR 1 → 5 microseries de 3 reps con 15" descanso al fallo.'
        }
      },
      {
        nombre: 'Cluster',
        descripcion: '4 series con 15-20" descanso, mismas reps',
        esPredefinida: true,
        icono: '🔗',
        color: '#3B82F6',
        parametros: {
          requiereDescansoEspecifico: true,
          sugerenciaDescanso: '15-20 segundos',
          instrucciones: 'Serie 1: RIR 2-3 → Serie 2: RIR 1-2 → Series 3-4: RIR 0.'
        }
      },
      {
        nombre: 'Balístico',
        descripcion: 'Mismo peso, máximas reps explosivas hasta perder velocidad',
        esPredefinida: true,
        icono: '💥',
        color: '#F97316',
        parametros: {
          sugerenciaDescanso: '60-90 segundos',
          instrucciones: 'Mismo peso en todas las series. Al fallo cuando pierdes velocidad explosiva.'
        }
      },
      {
        nombre: 'FST-7',
        descripcion: '7 microseries de 8-15 reps con 7-20" descanso',
        esPredefinida: true,
        icono: '7️⃣',
        color: '#06B6D4',
        parametros: {
          requiereDescansoEspecifico: true,
          sugerenciaReps: '8-15 reps',
          sugerenciaDescanso: '7-20 segundos',
          instrucciones: '7 microseries con descansos mínimos para congestión máxima.'
        }
      },
      {
        nombre: 'Superserie',
        descripcion: 'Dos ejercicios seguidos sin descanso',
        esPredefinida: true,
        icono: '🔄',
        color: '#84CC16',
        parametros: {
          sugerenciaDescanso: '0 segundos entre ejercicios',
          instrucciones: 'Ejercicio A → inmediatamente Ejercicio B → descanso.'
        }
      }
    ];

    // Crear todas en Firebase
    for (const tecnica of tecnicasPredefinidas) {
      await crearTecnica(tecnica);
    }

    console.log('✅ Técnicas predefinidas creadas exitosamente');
  } catch (error) {
    console.error('Error al seedear técnicas:', error);
    throw error;
  }
}