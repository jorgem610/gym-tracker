import { useState, useEffect } from 'react';
import type { TecnicaEntrenamiento, CrearTecnicaDTO } from '../types';
import * as tecnicasService from '../services/tecnicas.service';

export function useTecnicas() {
  const [tecnicas, setTecnicas] = useState<TecnicaEntrenamiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seedeado, setSeedeado] = useState(false);

  // Cargar técnicas al montar
  useEffect(() => {
    cargarTecnicas();
  }, []);

  useEffect(() => {
    if (!loading && !seedeado && tecnicas.length === 0) {
      seedearPredefinidas();
      setSeedeado(true);
    }
  }, [loading, tecnicas, seedeado]);

  const cargarTecnicas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tecnicasService.obtenerTecnicas();
      setTecnicas(data);
    } catch (err) {
      setError('Error al cargar técnicas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const crear = async (data: CrearTecnicaDTO) => {
    try {
      const nuevaTecnica = await tecnicasService.crearTecnica(data);
      setTecnicas(prev => [...prev, nuevaTecnica]);
      return nuevaTecnica;
    } catch (err) {
      console.error('Error al crear técnica:', err);
      throw err;
    }
  };

  const actualizar = async (id: string, data: Partial<TecnicaEntrenamiento>) => {
    try {
      await tecnicasService.actualizarTecnica(id, data);
      setTecnicas(prev => 
        prev.map(t => t.id === id ? { ...t, ...data } : t)
      );
    } catch (err) {
      console.error('Error al actualizar técnica:', err);
      throw err;
    }
  };

  const borrar = async (id: string) => {
    try {
      // Verificar que no sea predefinida
      const tecnica = tecnicas.find(t => t.id === id);
      if (tecnica?.esPredefinida) {
        throw new Error('No se pueden borrar técnicas predefinidas');
      }

      await tecnicasService.borrarTecnica(id);
      setTecnicas(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error al borrar técnica:', err);
      throw err;
    }
  };

  const seedearPredefinidas = async () => {
    try {
      await tecnicasService.seedearTecnicasPredefinidas();
      await cargarTecnicas(); // Recargar después de seedear
    } catch (err) {
      console.error('Error al seedear técnicas:', err);
      throw err;
    }
  };

  // Filtros útiles
  const tecnicasPredefinidas = tecnicas.filter(t => t.esPredefinida);
  const tecnicasPersonalizadas = tecnicas.filter(t => !t.esPredefinida);

  const obtenerTecnicaPorId = (id: string) => {
    return tecnicas.find(t => t.id === id);
  };

  return {
    tecnicas,
    tecnicasPredefinidas,
    tecnicasPersonalizadas,
    loading,
    error,
    crear,
    actualizar,
    borrar,
    seedearPredefinidas,
    recargar: cargarTecnicas,
    obtenerTecnicaPorId,
  };
}