import { useState, useEffect } from 'react';
import type { Ejercicio, CrearEjercicioDTO } from '../types';
import { 
  crearEjercicio as crearEjercicioService,
  obtenerEjercicios as obtenerEjerciciosService,
  actualizarEjercicio as actualizarEjercicioService,
  borrarEjercicio as borrarEjercicioService
} from '../services/ejercicios.service';

export function useEjercicios() {
  // Estado: lista de ejercicios
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  
  // Estado: está cargando?
  const [loading, setLoading] = useState(true);
  
  // Estado: hay error?
  const [error, setError] = useState<string | null>(null);

  // Cargar ejercicios al montar el componente
  useEffect(() => {
    cargarEjercicios();
  }, []);

  // Función para cargar ejercicios
  const cargarEjercicios = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await obtenerEjerciciosService();
      setEjercicios(data);
    } catch (err) {
      setError('Error al cargar ejercicios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Función para crear ejercicio
  const crear = async (data: CrearEjercicioDTO) => {
    try {
      const nuevoEjercicio = await crearEjercicioService(data);
      setEjercicios(prev => [...prev, nuevoEjercicio]);
      return nuevoEjercicio;
    } catch (err) {
      setError('Error al crear ejercicio');
      console.error(err);
      throw err;
    }
  };

  // Función para actualizar ejercicio
  const actualizar = async (id: string, data: Partial<Omit<Ejercicio, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      await actualizarEjercicioService(id, data);
      setEjercicios(prev => 
        prev.map(ej => ej.id === id ? { ...ej, ...data, updatedAt: new Date() } : ej)
      );
    } catch (err) {
      setError('Error al actualizar ejercicio');
      console.error(err);
      throw err;
    }
  };

  // Función para borrar ejercicio
  const borrar = async (id: string) => {
    try {
      await borrarEjercicioService(id);
      setEjercicios(prev => prev.filter(ej => ej.id !== id));
    } catch (err) {
      setError('Error al borrar ejercicio');
      console.error(err);
      throw err;
    }
  };

  return {
    ejercicios,
    loading,
    error,
    crear,
    actualizar,
    borrar,
    recargar: cargarEjercicios,
  };
}