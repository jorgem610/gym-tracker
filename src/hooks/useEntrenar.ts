import { useState } from 'react';
import type { Sesion, EjercicioSesion } from '../types';
import * as sesionesService from '../services/sesiones.service';

export function useEntrenar() {
  const [sesionActual, setSesionActual] = useState<Sesion | null>(null);
  const [guardando, setGuardando] = useState(false);

  const iniciarSesion = (
    rutinaId: string,
    diaId: string,
    ejerciciosIniciales: EjercicioSesion[]
  ) => {
    const nuevaSesion: Sesion = {
      id: `temp_${Date.now()}`,
      userId: 'demo-user',
      rutinaId,
      diaId,
      fecha: new Date(),
      ejercicios: ejerciciosIniciales,
      completada: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setSesionActual(nuevaSesion);
  };

  const actualizarBloque = (
    ejercicioId: string,
    numeroSerie: number,
    numeroBloque: number,
    peso: number,
    reps: number
  ) => {
    if (!sesionActual) return;

    const ejerciciosActualizados = sesionActual.ejercicios.map(ej => {
      if (ej.ejercicioId !== ejercicioId) return ej;

      const seriesActualizadas = ej.series.map(serie => {
        if (serie.numero !== numeroSerie) return serie;

        const bloquesActualizados = serie.bloques.map(bloque => {
          if (bloque.numero !== numeroBloque) return bloque;

          return {
            ...bloque,
            peso,
            reps,
          };
        });

        return {
          ...serie,
          bloques: bloquesActualizados,
        };
      });

      return {
        ...ej,
        series: seriesActualizadas,
      };
    });

    setSesionActual({
      ...sesionActual,
      ejercicios: ejerciciosActualizados,
    });
  };

  const toggleBloqueCompletado = (
    ejercicioId: string,
    numeroSerie: number,
    numeroBloque: number
  ) => {
    if (!sesionActual) return;

    const ejerciciosActualizados = sesionActual.ejercicios.map(ej => {
      if (ej.ejercicioId !== ejercicioId) return ej;

      const seriesActualizadas = ej.series.map(serie => {
        if (serie.numero !== numeroSerie) return serie;

        const bloquesActualizados = serie.bloques.map(bloque => {
          if (bloque.numero !== numeroBloque) return bloque;

          return {
            ...bloque,
            completado: !bloque.completado,
          };
        });

        // Serie completada = todos los bloques completados
        const todosCompletados = bloquesActualizados.every(b => b.completado);

        return {
          ...serie,
          bloques: bloquesActualizados,
          completada: todosCompletados,
        };
      });

      return {
        ...ej,
        series: seriesActualizadas,
      };
    });

    setSesionActual({
      ...sesionActual,
      ejercicios: ejerciciosActualizados,
    });
  };

  const guardarSesion = async () => {
    if (!sesionActual) return;

    try {
      setGuardando(true);
      await sesionesService.crearSesion({
        userId: 'demo-user',
        rutinaId: sesionActual.rutinaId,
        diaId: sesionActual.diaId,
        fecha: sesionActual.fecha,
        ejercicios: sesionActual.ejercicios,
        completada: sesionActual.completada,
        duracion: sesionActual.duracion,
        notas: sesionActual.notas,
      });

      // Limpiar sesión después de guardar
      setSesionActual(null);
      alert('Sesión guardada exitosamente');
    } catch (error) {
      console.error('Error al guardar sesión:', error);
      alert('Error al guardar la sesión');
    } finally {
      setGuardando(false);
    }
  };

  const finalizarSesion = async () => {
  if (!sesionActual) return;

  const sesionFinalizada = {
    ...sesionActual,
    completada: true,
  };

  setSesionActual(sesionFinalizada);

  try {
    setGuardando(true);
    
    // Filtrar campos undefined
    const data: any = {
      userId: 'demo-user',
      rutinaId: sesionFinalizada.rutinaId,
      diaId: sesionFinalizada.diaId,
      fecha: sesionFinalizada.fecha,
      ejercicios: sesionFinalizada.ejercicios,
      completada: true,
    };

    // Solo añadir si tienen valor
    if (sesionFinalizada.duracion !== undefined) {
      data.duracion = sesionFinalizada.duracion;
    }
    if (sesionFinalizada.notas) {
      data.notas = sesionFinalizada.notas;
    }

    await sesionesService.crearSesion(data);

    setSesionActual(null);
    alert('¡Sesión completada!');
  } catch (error) {
    console.error('Error al finalizar sesión:', error);
    alert('Error al finalizar la sesión');
  } finally {
    setGuardando(false);
  }
};

  const cancelarSesion = () => {
    if (window.confirm('¿Descartar sesión actual?')) {
      setSesionActual(null);
    }
  };

  return {
    sesionActual,
    guardando,
    iniciarSesion,
    actualizarBloque,
    toggleBloqueCompletado,
    guardarSesion,
    finalizarSesion,
    cancelarSesion,
  };
}