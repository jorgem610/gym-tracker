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
import type { Ejercicio, CrearEjercicioDTO } from '../types';

// Nombre de la colección en Firebase
const COLLECTION_NAME = 'ejercicios';

// CREAR ejercicio
export async function crearEjercicio(data: CrearEjercicioDTO): Promise<Ejercicio> {
  try {

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
    console.error('Error al crear ejercicio:', error);
    throw new Error('No se pudo crear el ejercicio');
  }
}

// OBTENER todos los ejercicios
export async function obtenerEjercicios(): Promise<Ejercicio[]> {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        nombre: data.nombre,
        grupoMuscular: data.grupoMuscular,
        rangoReps: data.rangoReps,
        incrementoPeso: data.incrementoPeso,
        notas: data.notas,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Ejercicio;
    });
  } catch (error) {
    console.error('Error al obtener ejercicios:', error);
    throw new Error('No se pudieron cargar los ejercicios');
  }
}

// ACTUALIZAR ejercicio
export async function actualizarEjercicio(
  id: string, 
  data: Partial<Omit<Ejercicio, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error al actualizar ejercicio:', error);
    throw new Error('No se pudo actualizar el ejercicio');
  }
}

// BORRAR ejercicio
export async function borrarEjercicio(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error('Error al borrar ejercicio:', error);
    throw new Error('No se pudo borrar el ejercicio');
  }
}