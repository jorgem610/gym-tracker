import { useState } from 'react';
import { useTecnicas } from '../../hooks/useTecnicas';
import type { DiaRutina, Ejercicio, ConfigSerie, EjercicioDia } from '../../types';

interface DetalleDiaProps {
  dia: DiaRutina;
  ejercicios: Ejercicio[];
  onEditarDia: (dia: DiaRutina) => void;
  onBorrarDia: (diaId: string) => void;
  onAñadirEjercicio: (dia: DiaRutina) => void;
  onQuitarEjercicio: (diaId: string, ejercicioId: string) => void;
  onMoverEjercicio: (diaId: string, fromIndex: number, toIndex: number) => void;
  onEditarEjercicio: (dia: DiaRutina, ejercicioDia: EjercicioDia) => void;
}

export function DetalleDia({
  dia,
  ejercicios,
  onEditarDia,
  onBorrarDia,
  onAñadirEjercicio,
  onQuitarEjercicio,
  onMoverEjercicio,
  onEditarEjercicio
}: DetalleDiaProps) {
  const [expandido, setExpandido] = useState(true);
  const { obtenerTecnicaPorId } = useTecnicas();

  const obtenerEjercicio = (ejercicioId: string) => {
    return ejercicios.find(e => e.id === ejercicioId);
  };

  const handleBorrarDia = () => {
    if (window.confirm(`¿Borrar día "${dia.nombre}"?`)) {
      onBorrarDia(dia.id);
    }
  };

  const handleQuitarEjercicio = (ejercicioId: string) => {
    if (window.confirm('¿Quitar este ejercicio del día?')) {
      onQuitarEjercicio(dia.id, ejercicioId);
    }
  };

  const moverArriba = (index: number) => {
    if (index > 0) {
      onMoverEjercicio(dia.id, index, index - 1);
    }
  };

  const moverAbajo = (index: number) => {
    if (index < dia.ejercicios.length - 1) {
      onMoverEjercicio(dia.id, index, index + 1);
    }
  };

  // Renderizar info de series según modo
  const renderInfoSeries = (ejercicioDia: any) => {
    // MODO SIMPLE
    if (ejercicioDia.seriesSimples) {
      return (
        <p className="text-sm text-gray-400">
          {ejercicioDia.seriesSimples} series • Modo Simple
        </p>
      );
    }

    // MODO AVANZADO
    if (ejercicioDia.seriesAvanzadas && ejercicioDia.seriesAvanzadas.length > 0) {
      return (
        <div className="space-y-1 mt-2">
          {ejercicioDia.seriesAvanzadas.map((serie: ConfigSerie, idx: number) => {
            const tecnica = obtenerTecnicaPorId(serie.tecnicaId);
            
            return (
              <div key={idx} className="text-xs text-gray-400 flex items-center gap-2">
                <span className="text-gray-500">S{serie.numero}:</span>
                {tecnica && (
                  <span 
                    className="px-2 py-0.5 rounded text-white font-medium"
                    style={{ backgroundColor: tecnica.color || '#6B7280' }}
                  >
                    {tecnica.icono} {tecnica.nombre}
                  </span>
                )}
                {/* Mostrar bloques */}
                {serie.bloques && serie.bloques.length > 0 && (
                  <span>
                    {serie.bloques.map(b => {
                      if (b.repsMin && b.repsMax && b.repsMin === b.repsMax) {
                        return `${b.repsMax} reps`;
                      } else if (b.repsMin && b.repsMax) {
                        return `${b.repsMin}-${b.repsMax} reps`;
                      }
                      return '';
                    }).filter(Boolean).join(' • ')}
                  </span>
                )}
                {serie.rir !== undefined && (
                  <span>• RIR {serie.rir}</span>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    return <p className="text-sm text-gray-400">Sin configuración</p>;
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      {/* Header del día */}
      <div className="bg-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setExpandido(!expandido)}
            className="text-2xl hover:text-blue-400 transition-colors"
          >
            {expandido ? '▼' : '▶'}
          </button>
          <div>
            <h3 className="text-xl font-bold">{dia.nombre}</h3>
            <p className="text-sm text-gray-400">
              {dia.tipo} • {dia.ejercicios.length} ejercicio(s)
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEditarDia(dia)}
            className="bg-gray-600 hover:bg-gray-500 px-3 py-2 rounded-lg transition-colors"
            title="Editar día"
          >
            ✏️
          </button>
          <button
            onClick={handleBorrarDia}
            className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg transition-colors"
            title="Borrar día"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Contenido expandible */}
      {expandido && (
        <div className="p-4 space-y-3">
          {/* Lista de ejercicios */}
          {dia.ejercicios.length === 0 ? (
            <p className="text-gray-400 text-center py-4">
              No hay ejercicios en este día
            </p>
          ) : (
            dia.ejercicios.map((ejercicioDia, index) => {
              const ejercicio = obtenerEjercicio(ejercicioDia.ejercicioId);
              
              if (!ejercicio) {
                return (
                  <div key={ejercicioDia.ejercicioId} className="bg-red-900/20 p-3 rounded-lg">
                    <p className="text-red-400">Ejercicio no encontrado</p>
                  </div>
                );
              }

              return (
                <div
                  key={ejercicioDia.ejercicioId}
                  className="bg-gray-700 p-4 rounded-lg"
                >
                  {/* Header ejercicio */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 font-mono text-sm">
                          {index + 1}.
                        </span>
                        <p className="font-medium text-lg">{ejercicio.nombre}</p>
                      </div>
                      
                      {/* Info de series */}
                      {renderInfoSeries(ejercicioDia)}
                    </div>

                    {/* Controles */}
                    <div className="flex gap-1">
                      {/* Mover arriba */}
                      <button
                        onClick={() => moverArriba(index)}
                        disabled={index === 0}
                        className="bg-gray-600 hover:bg-gray-500 disabled:opacity-30 disabled:cursor-not-allowed px-2 py-1 rounded text-sm transition-colors"
                        title="Mover arriba"
                      >
                        ▲
                      </button>

                      {/* Mover abajo */}
                      <button
                        onClick={() => moverAbajo(index)}
                        disabled={index === dia.ejercicios.length - 1}
                        className="bg-gray-600 hover:bg-gray-500 disabled:opacity-30 disabled:cursor-not-allowed px-2 py-1 rounded text-sm transition-colors"
                        title="Mover abajo"
                      >
                        ▼
                      </button>

                      {/* EDITAR */}
                      <button
                        onClick={() => onEditarEjercicio(dia, ejercicioDia)}
                        className="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded text-sm transition-colors"
                        title="Editar"
                      >
                        ✏️
                      </button>

                      {/* Quitar */}
                      <button
                        onClick={() => handleQuitarEjercicio(ejercicioDia.ejercicioId)}
                        className="bg-red-500 hover:bg-red-600 px-2 py-1 rounded text-sm transition-colors"
                        title="Quitar"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Botón añadir ejercicio */}
          <button
            onClick={() => onAñadirEjercicio(dia)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors mt-4"
          >
            + Añadir Ejercicio
          </button>
        </div>
      )}
    </div>
  );
}