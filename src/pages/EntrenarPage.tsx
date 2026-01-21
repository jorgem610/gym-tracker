import { useState, useEffect } from 'react';
import { useRutinas } from '../hooks/useRutinas';
import { useEntrenar } from '../hooks/useEntrenar';
import { useTecnicas } from '../hooks/useTecnicas';
import { obtenerEjercicios } from '../services/ejercicios.service';
import { obtenerUltimaSesionEjercicio, calcularSugerencia } from '../services/historial.service';
import type { Ejercicio, EjercicioSesion, SerieSesion, BloqueEjecutado, DiaRutina } from '../types';

export function EntrenarPage() {
  const { rutinas } = useRutinas();
  const { obtenerTecnicaPorId } = useTecnicas();
  const {
    sesionActual,
    guardando,
    iniciarSesion,
    actualizarBloque,
    toggleBloqueCompletado,
    finalizarSesion,
    cancelarSesion,
  } = useEntrenar();

  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState<DiaRutina | null>(null);
  const [historial, setHistorial] = useState<Map<string, any>>(new Map());
  const [_cargandoHistorial, setCargandoHistorial] = useState(false);

  const rutinaActiva = rutinas.find(r => r.activa);

  useEffect(() => {
    cargarEjercicios();
  }, []);

  const cargarEjercicios = async () => {
    try {
      const data = await obtenerEjercicios();
      setEjercicios(data);
    } catch (error) {
      console.error('Error al cargar ejercicios:', error);
    }
  };

  const handleIniciarEntrenamiento = async (dia: DiaRutina) => {
    if (!rutinaActiva) return;

    // Crear estructura de ejercicios iniciales con bloques
    const ejerciciosIniciales: EjercicioSesion[] = dia.ejercicios.map(ejDia => {
      // MODO SIMPLE
      if (ejDia.seriesSimples) {
        const series: SerieSesion[] = [];
        for (let i = 1; i <= ejDia.seriesSimples; i++) {
          series.push({
            numero: i,
            bloques: [
              {
                numero: 1,
                tipo: 'principal',
                peso: 0,
                reps: 0,
                completado: false,
              }
            ],
            completada: false,
          });
        }
        return {
          ejercicioId: ejDia.ejercicioId,
          series,
          configuracion: ejDia,
        };
      }

      // MODO AVANZADO
      if (ejDia.seriesAvanzadas) {
        const series: SerieSesion[] = ejDia.seriesAvanzadas.map(configSerie => {
          const bloques: BloqueEjecutado[] = configSerie.bloques.map(configBloque => ({
            numero: configBloque.numero,
            tipo: configBloque.tipo,
            peso: 0,
            reps: 0,
            tiempoSegundos: configBloque.tiempoSegundos,
            completado: false,
          }));

          return {
            numero: configSerie.numero,
            bloques,
            completada: false,
          };
        });

        return {
          ejercicioId: ejDia.ejercicioId,
          series,
          configuracion: ejDia,
        };
      }

      // Fallback
      return {
        ejercicioId: ejDia.ejercicioId,
        series: [],
        configuracion: ejDia,
      };
    });

    iniciarSesion(rutinaActiva.id, dia.id, ejerciciosIniciales);

    // Cargar historial de todos los ejercicios del día
    await cargarHistorialDia(dia);

    setDiaSeleccionado(dia);
  };

  const cargarHistorialDia = async (dia: DiaRutina) => {
    setCargandoHistorial(true);
    const nuevoHistorial = new Map();

    try {
      for (const ejDia of dia.ejercicios) {
        const ultimaSesion = await obtenerUltimaSesionEjercicio('demo-user', ejDia.ejercicioId);
        
        if (ultimaSesion) {
          const ejercicioHistorial = ultimaSesion.ejercicios.find(
            e => e.ejercicioId === ejDia.ejercicioId
          );
          
          if (ejercicioHistorial) {
            nuevoHistorial.set(ejDia.ejercicioId, ejercicioHistorial);
          }
        }
      }

      setHistorial(nuevoHistorial);
    } catch (error) {
      console.error('Error al cargar historial:', error);
    } finally {
      setCargandoHistorial(false);
    }
  };

  const obtenerEjercicio = (ejercicioId: string) => {
    return ejercicios.find(e => e.id === ejercicioId);
  };

  // VISTA 1: Seleccionar día
  if (!sesionActual && rutinaActiva) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Entrenar</h1>

          {rutinaActiva.dias.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-xl mb-2">No hay días en la rutina activa</p>
              <p className="text-sm">Añade días a tu rutina primero</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rutinaActiva.dias.map(dia => (
                <div
                  key={dia.id}
                  onClick={() => handleIniciarEntrenamiento(dia)}
                  className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <h3 className="text-2xl font-bold mb-2">{dia.nombre}</h3>
                  <p className="text-gray-400 mb-2">{dia.tipo}</p>
                  <p className="text-sm text-gray-500">
                    {dia.ejercicios.length} ejercicio(s)
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // VISTA 2: Entrenando
  if (sesionActual && diaSeleccionado) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">{diaSeleccionado.nombre}</h1>
            <p className="text-gray-400">{diaSeleccionado.tipo}</p>
            <p className="text-sm text-gray-500">
              {new Date().toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* Ejercicios */}
          <div className="space-y-6 mb-8">
            {sesionActual.ejercicios.map((ejercicioSesion, ejIndex) => {
              const ejercicio = obtenerEjercicio(ejercicioSesion.ejercicioId);
              if (!ejercicio) return null;

              return (
                <div key={ejercicioSesion.ejercicioId} className="bg-gray-800 p-6 rounded-lg">
                  {/* Nombre ejercicio */}
                  <h3 className="text-xl font-bold mb-4">
                    {ejIndex + 1}. {ejercicio.nombre}
                  </h3>

                  {/* Series */}
                  <div className="space-y-4">
                    {ejercicioSesion.series.map((serie, serieIdx) => {
                      // Obtener configuración de esta serie
                      const configSerie = ejercicioSesion.configuracion?.seriesAvanzadas?.[serieIdx];
                      const tecnica = configSerie ? obtenerTecnicaPorId(configSerie.tecnicaId) : null;

                      // Obtener historial del ejercicio
                      const ejercicioHistorial = historial.get(ejercicioSesion.ejercicioId);
                      const serieHistorial = ejercicioHistorial?.series?.[serieIdx];
                      const bloqueHistorial = serieHistorial?.bloques?.[0];

                      return (
                        <div key={serie.numero} className="bg-gray-700 p-4 rounded-lg space-y-3">
                          {/* Header de serie con técnica */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-bold text-white">
                                Serie {serie.numero}
                              </p>
                              {tecnica && (
                                <span 
                                  className="text-xs px-2 py-1 rounded font-medium text-white"
                                  style={{ backgroundColor: tecnica.color }}
                                >
                                  {tecnica.icono} {tecnica.nombre}
                                </span>
                              )}
                              {configSerie?.rir !== undefined && (
                                <span className="text-xs text-gray-400">
                                  • RIR {configSerie.rir}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Bloques */}
                          <div className="space-y-2">
                            {serie.bloques.map((bloque, bloqueIdx) => {
                              // Obtener configuración de este bloque
                              const configBloque = configSerie?.bloques?.[bloqueIdx];

                              // Calcular sugerencia de historial
                              let sugerenciaHistorial = null;
                              if (bloqueHistorial && configBloque?.repsMin && configBloque?.repsMax) {
                                sugerenciaHistorial = calcularSugerencia(
                                  bloqueHistorial.peso,
                                  bloqueHistorial.reps,
                                  configBloque.repsMin,
                                  configBloque.repsMax
                                );
                              }

                              // Calcular sugerencia de % peso
                              let sugerenciaPorcentaje = null;
                              if (configBloque?.porcentajePeso && configBloque.porcentajePeso < 100) {
                                let pesoBase = 0;
                                
                                if (bloqueIdx === 0) {
                                  if (serieIdx > 0) {
                                    const serieAnterior = ejercicioSesion.series[serieIdx - 1];
                                    const ultimoBloqueAnterior = serieAnterior.bloques[serieAnterior.bloques.length - 1];
                                    pesoBase = ultimoBloqueAnterior?.peso || 0;
                                  }
                                } else {
                                  pesoBase = serie.bloques[bloqueIdx - 1]?.peso || 0;
                                }
                                
                                if (pesoBase > 0) {
                                  sugerenciaPorcentaje = {
                                    peso: Math.round((pesoBase * (configBloque.porcentajePeso / 100)) * 2) / 2,
                                    porcentaje: configBloque.porcentajePeso
                                  };
                                }
                              }

                              return (
                                <div
                                  key={bloque.numero}
                                  className={`p-3 rounded-lg border-2 transition-colors ${
                                    bloque.completado
                                      ? 'border-green-500 bg-green-900/20'
                                      : 'border-gray-600 bg-gray-700'
                                  }`}
                                >
                                  {/* Header del bloque */}
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2 flex-wrap text-xs">
                                      {bloque.tipo !== 'principal' && (
                                        <span className="px-2 py-0.5 bg-blue-500 rounded text-white font-medium">
                                          {bloque.tipo}
                                        </span>
                                      )}
                                      {configBloque && (
                                        <span className="text-gray-400">
                                          {configBloque.repsMin === configBloque.repsMax 
                                            ? `${configBloque.repsMax} reps`
                                            : `${configBloque.repsMin}-${configBloque.repsMax} reps`
                                          }
                                        </span>
                                      )}
                                    </div>

                                    {/* Checkbox */}
                                    <input
                                      type="checkbox"
                                      checked={bloque.completado}
                                      onChange={() =>
                                        toggleBloqueCompletado(
                                          ejercicioSesion.ejercicioId,
                                          serie.numero,
                                          bloque.numero
                                        )
                                      }
                                      className="w-5 h-5 cursor-pointer"
                                    />
                                  </div>

                                  {/* Historial y sugerencias */}
                                  {bloqueHistorial && (
                                    <div className="space-y-1 mb-2">
                                      <div className="text-xs text-gray-400">
                                        📊 Última: {bloqueHistorial.peso}kg × {bloqueHistorial.reps} reps
                                      </div>
                                      
                                      {/* Sugerencia de historial */}
                                      {sugerenciaHistorial && bloque.peso === 0 && (
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs text-yellow-400 font-medium">
                                            💡 Sugerido (historial): {sugerenciaHistorial.peso}kg × {sugerenciaHistorial.reps} reps
                                          </span>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              actualizarBloque(
                                                ejercicioSesion.ejercicioId,
                                                serie.numero,
                                                bloque.numero,
                                                sugerenciaHistorial!.peso,
                                                sugerenciaHistorial!.reps
                                              );
                                            }}
                                            className="text-xs bg-yellow-500 hover:bg-yellow-600 text-black px-2 py-1 rounded font-medium"
                                          >
                                            Usar
                                          </button>
                                        </div>
                                      )}

                                      {/* Sugerencia de % peso */}
                                      {sugerenciaPorcentaje && bloque.peso === 0 && (
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs text-blue-400 font-medium">
                                            ⚙️ Calculado ({sugerenciaPorcentaje.porcentaje}% Top): {sugerenciaPorcentaje.peso}kg
                                          </span>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              actualizarBloque(
                                                ejercicioSesion.ejercicioId,
                                                serie.numero,
                                                bloque.numero,
                                                sugerenciaPorcentaje!.peso,
                                                bloque.reps
                                              )
                                            }
                                            className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded font-medium"
                                          >
                                            Usar
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Inputs */}
                                  <div className="flex items-center gap-3">
                                    {/* Peso */}
                                    <div className="flex items-center gap-2 flex-1">
                                      <input
                                        type="number"
                                        value={bloque.peso || ''}
                                        onChange={(e) =>
                                          actualizarBloque(
                                            ejercicioSesion.ejercicioId,
                                            serie.numero,
                                            bloque.numero,
                                            Number(e.target.value),
                                            bloque.reps
                                          )
                                        }
                                        placeholder="Peso"
                                        step="0.5"
                                        className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      />
                                      <span className="text-sm text-gray-400">kg</span>
                                    </div>

                                    {/* Reps */}
                                    {bloque.tipo !== 'isometrica' && (
                                      <div className="flex items-center gap-2 flex-1">
                                        <span className="text-sm text-gray-400">×</span>
                                        <input
                                          type="number"
                                          value={bloque.reps || ''}
                                          onChange={(e) =>
                                            actualizarBloque(
                                              ejercicioSesion.ejercicioId,
                                              serie.numero,
                                              bloque.numero,
                                              bloque.peso,
                                              Number(e.target.value)
                                            )
                                          }
                                          placeholder="Reps"
                                          className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-400">reps</span>
                                      </div>
                                    )}

                                    {/* Tiempo */}
                                    {bloque.tipo === 'isometrica' && bloque.tiempoSegundos && (
                                      <div className="flex items-center gap-2 flex-1">
                                        <span className="text-yellow-400 font-medium">
                                          ⏱️ {bloque.tiempoSegundos}"
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <button
              onClick={finalizarSesion}
              disabled={guardando}
              className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-medium py-4 rounded-lg transition-colors"
            >
              {guardando ? 'Guardando...' : 'Finalizar Sesión'}
            </button>
            <button
              onClick={cancelarSesion}
              disabled={guardando}
              className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white font-medium py-4 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Sin rutina activa
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-xl mb-2 text-gray-400">No hay rutina activa</p>
        <p className="text-sm text-gray-500">Activa una rutina primero</p>
      </div>
    </div>
  );
}
