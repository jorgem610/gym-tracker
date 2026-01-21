import { useState, useEffect } from 'react';
import type { Rutina, CrearRutinaDTO } from '../types';
import * as rutinasService from '../services/rutinas.service';

export function useRutinas() {
  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar rutinas al montar el componente
  useEffect(() => {
    cargarRutinas();
  }, []);

  const cargarRutinas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await rutinasService.obtenerRutinas();
      setRutinas(data);
    } catch (err) {
      setError('Error al cargar rutinas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const crear = async (data: CrearRutinaDTO) => {
    try {
      const nuevaRutina = await rutinasService.crearRutina(data);
      setRutinas(prev => [...prev, nuevaRutina]);
      return nuevaRutina;
    } catch (err) {
      console.error('Error al crear rutina:', err);
      throw err;
    }
  };

  const actualizar = async (id: string, data: Partial<Rutina>) => {
    try {
      await rutinasService.actualizarRutina(id, data);
      setRutinas(prev => 
        prev.map(r => r.id === id ? { ...r, ...data } : r)
      );
    } catch (err) {
      console.error('Error al actualizar rutina:', err);
      throw err;
    }
  };

  const borrar = async (id: string) => {
    try {
      await rutinasService.borrarRutina(id);
      setRutinas(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Error al borrar rutina:', err);
      throw err;
    }
  };

  const activar = async (id: string) => {
    try {
      await rutinasService.activarRutina(id);
      // Actualizar estado local: desactivar todas menos la seleccionada
      setRutinas(prev =>
        prev.map(r => ({ ...r, activa: r.id === id }))
      );
    } catch (err) {
      console.error('Error al activar rutina:', err);
      throw err;
    }
  };

  return {
    rutinas,
    loading,
    error,
    crear,
    actualizar,
    borrar,
    activar,
    recargar: cargarRutinas,
  };
}