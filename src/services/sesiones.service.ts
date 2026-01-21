import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import type { Sesion, CrearSesionDTO } from '../types';

const COLLECTION_NAME = 'sesiones';

// CREAR sesión
export async function crearSesion(data: CrearSesionDTO): Promise<Sesion> {
  try {
    // Limpiar ejercicios
    const ejerciciosLimpios = limpiarEjercicios(data.ejercicios);

    // Filtrar undefined ANTES de enviar a Firebase
    const dataParaFirebase: any = {
      userId: data.userId,
      rutinaId: data.rutinaId,
      diaId: data.diaId,
      fecha: Timestamp.fromDate(data.fecha),
      ejercicios: ejerciciosLimpios,  // ← Usar ejercicios limpios
      completada: data.completada,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    // Solo añadir si existen
    if (data.duracion !== undefined) {
      dataParaFirebase.duracion = data.duracion;
    }
    if (data.notas !== undefined && data.notas !== '') {
      dataParaFirebase.notas = data.notas;
    }

    const docRef = await addDoc(collection(db, COLLECTION_NAME), dataParaFirebase);

    return {
      id: docRef.id,
      userId: data.userId,
      rutinaId: data.rutinaId,
      diaId: data.diaId,
      fecha: data.fecha,
      ejercicios: data.ejercicios,
      completada: data.completada,
      duracion: data.duracion,
      notas: data.notas,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error('Error al crear sesión:', error);
    throw new Error('No se pudo crear la sesión');
  }
}

// OBTENER todas las sesiones
export async function obtenerSesiones(): Promise<Sesion[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('fecha', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        rutinaId: data.rutinaId,
        diaId: data.diaId,
        fecha: data.fecha?.toDate() || new Date(),
        ejercicios: data.ejercicios || [],
        completada: data.completada || false,
        duracion: data.duracion,
        notas: data.notas,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Sesion;
    });
  } catch (error) {
    console.error('Error al obtener sesiones:', error);
    throw new Error('No se pudieron cargar las sesiones');
  }
}

// OBTENER sesiones de una rutina específica
export async function obtenerSesionesPorRutina(rutinaId: string): Promise<Sesion[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('rutinaId', '==', rutinaId),
      orderBy('fecha', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        rutinaId: data.rutinaId,
        diaId: data.diaId,
        fecha: data.fecha?.toDate() || new Date(),
        ejercicios: data.ejercicios || [],
        completada: data.completada || false,
        duracion: data.duracion,
        notas: data.notas,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Sesion;
    });
  } catch (error) {
    console.error('Error al obtener sesiones por rutina:', error);
    throw new Error('No se pudieron cargar las sesiones');
  }
}

// ACTUALIZAR sesión
export async function actualizarSesion(
  id: string, 
  data: Partial<Omit<Sesion, 'id' | 'createdAt' | 'updatedAt'>>
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
    console.error('Error al actualizar sesión:', error);
    throw new Error('No se pudo actualizar la sesión');
  }
}

// BORRAR sesión
export async function borrarSesion(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error('Error al borrar sesión:', error);
    throw new Error('No se pudo borrar la sesión');
  }
}

// Limpiar ejercicios de campos undefined
function limpiarEjercicios(ejercicios: any[]): any[] {
  return ejercicios.map(ej => ({
    ejercicioId: ej.ejercicioId,
    series: ej.series.map((serie: any) => ({
      numero: serie.numero,
      bloques: serie.bloques.map((bloque: any) => {
        const bloquelimpio: any = {
          numero: bloque.numero,
          tipo: bloque.tipo,
          peso: bloque.peso || 0,
          reps: bloque.reps || 0,
          completado: bloque.completado || false,
        };
        
        // Solo añadir tiempoSegundos si existe
        if (bloque.tiempoSegundos !== undefined) {
          bloquelimpio.tiempoSegundos = bloque.tiempoSegundos;
        }
        
        return bloquelimpio;
      }),
      completada: serie.completada || false,
    })),
    ...(ej.configuracion ? { configuracion: ej.configuracion } : {}),
  }));
}