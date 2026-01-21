import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import type { Rutina, CrearRutinaDTO } from '../types';

// Nombre de la colección en Firebase
const COLLECTION_NAME = 'rutinas';

// CREAR rutina
export async function crearRutina(data: CrearRutinaDTO): Promise<Rutina> {
  try {
    // Filtrar campos undefined
    const dataLimpia = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    );

    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...dataLimpia,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return {
      id: docRef.id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error('Error al crear rutina:', error);
    throw new Error('No se pudo crear la rutina');
  }
}

// OBTENER todas las rutinas
export async function obtenerRutinas(): Promise<Rutina[]> {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        nombre: data.nombre,
        descripcion: data.descripcion,
        dias: data.dias || [],
        activa: data.activa || false,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Rutina;
    });
  } catch (error) {
    console.error('Error al obtener rutinas:', error);
    throw new Error('No se pudieron cargar las rutinas');
  }
}

// ACTUALIZAR rutina
export async function actualizarRutina(
  id: string,
  data: Partial<Rutina>
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    
    // Convertir datos para Firebase (sin undefined)
    const dataParaFirebase: any = {
      updatedAt: Timestamp.now(),
    };

    // Copiar campos simples
    if (data.nombre !== undefined) dataParaFirebase.nombre = data.nombre;
    if (data.descripcion !== undefined) dataParaFirebase.descripcion = data.descripcion;
    if (data.activa !== undefined) dataParaFirebase.activa = data.activa;

    // Manejar días (estructura compleja)
    if (data.dias !== undefined) {
      dataParaFirebase.dias = data.dias.map(dia => ({
        id: dia.id,
        nombre: dia.nombre,
        tipo: dia.tipo,
        ejercicios: dia.ejercicios.map(ej => {
          const ejercicioLimpio: any = {
            ejercicioId: ej.ejercicioId,
            orden: ej.orden,
          };

          // Modo simple
          if (ej.seriesSimples !== undefined) {
            ejercicioLimpio.seriesSimples = ej.seriesSimples;
          }

          // Modo avanzado
          if (ej.seriesAvanzadas !== undefined) {
            ejercicioLimpio.seriesAvanzadas = ej.seriesAvanzadas.map(serie => {
              const serieLimpia: any = {
                numero: serie.numero,
                tecnicaId: serie.tecnicaId,
                bloques: serie.bloques.map(bloque => {
                  const bloqueLimpio: any = {
                    numero: bloque.numero,
                    tipo: bloque.tipo,
                  };

                  // Solo añadir campos que existen
                  if (bloque.repsMin !== undefined) bloqueLimpio.repsMin = bloque.repsMin;
                  if (bloque.repsMax !== undefined) bloqueLimpio.repsMax = bloque.repsMax;
                  if (bloque.porcentajePeso !== undefined) bloqueLimpio.porcentajePeso = bloque.porcentajePeso;
                  if (bloque.tiempoSegundos !== undefined) bloqueLimpio.tiempoSegundos = bloque.tiempoSegundos;
                  if (bloque.notas !== undefined) bloqueLimpio.notas = bloque.notas;

                  return bloqueLimpio;
                }),
              };

              // Campos opcionales de serie
              if (serie.rir !== undefined) serieLimpia.rir = serie.rir;
              if (serie.descansoSegundos !== undefined) serieLimpia.descansoSegundos = serie.descansoSegundos;
              if (serie.notasGenerales !== undefined) serieLimpia.notasGenerales = serie.notasGenerales;

              return serieLimpia;
            });
          }

          // Notas generales
          if (ej.notasGenerales !== undefined) {
            ejercicioLimpio.notasGenerales = ej.notasGenerales;
          }

          return ejercicioLimpio;
        }),
      }));
    }

    await updateDoc(docRef, dataParaFirebase);
  } catch (error) {
    console.error('Error al actualizar rutina:', error);
    throw new Error('No se pudo actualizar la rutina');
  }
}

// BORRAR rutina
export async function borrarRutina(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error('Error al borrar rutina:', error);
    throw new Error('No se pudo borrar la rutina');
  }
}

// ACTIVAR rutina (desactiva todas las demás)
export async function activarRutina(id: string): Promise<void> {
  try {
    // Primero obtenemos todas las rutinas
    const rutinas = await obtenerRutinas();
    
    // Desactivamos todas
    for (const rutina of rutinas) {
      if (rutina.activa && rutina.id !== id) {
        await actualizarRutina(rutina.id, { activa: false });
      }
    }
    
    // Activamos la seleccionada
    await actualizarRutina(id, { activa: true });
  } catch (error) {
    console.error('Error al activar rutina:', error);
    throw new Error('No se pudo activar la rutina');
  }
}