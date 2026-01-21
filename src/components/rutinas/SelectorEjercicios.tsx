import { useState, useEffect } from 'react';
import { obtenerEjercicios } from '../../services/ejercicios.service';
import { useTecnicas } from '../../hooks/useTecnicas';
import type { Ejercicio, ConfigSerie } from '../../types';

interface SelectorEjerciciosProps {
  onSeleccionar: (ejercicioId: string, config: { seriesSimples?: number; seriesAvanzadas?: ConfigSerie[] }) => void;
  onCancelar: () => void;
  ejerciciosExcluidos?: string[];
}

export function SelectorEjercicios({ 
  onSeleccionar, 
  onCancelar,
  ejerciciosExcluidos = []
}: SelectorEjerciciosProps) {
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Modo: 'simple' o 'avanzado'
  const [modo, setModo] = useState<'simple' | 'avanzado'>('simple');
  
  // Modo Simple
  const [seriesSimples, setSeriesSimples] = useState(3);
  
  // Modo Avanzado
  const [seriesAvanzadas, setSeriesAvanzadas] = useState<ConfigSerie[]>([
    {
      numero: 1,
      tecnicaId: '',
      rir: 0,
      bloques: [
        {
          numero: 1,
          tipo: 'principal',
          repsMin: 10,
          repsMax: 10,
        }
      ]
    }
  ]);
  
  const { tecnicasPredefinidas, loading: loadingTecnicas } = useTecnicas();

  useEffect(() => {
    cargarEjercicios();
  }, []);

  const cargarEjercicios = async () => {
    try {
      const data = await obtenerEjercicios();
      const disponibles = data.filter(e => !ejerciciosExcluidos.includes(e.id));
      setEjercicios(disponibles);
      if (disponibles.length > 0) {
        setEjercicioSeleccionado(disponibles[0].id);
      }
    } catch (error) {
      console.error('Error al cargar ejercicios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!ejercicioSeleccionado) {
    alert('Selecciona un ejercicio');
    return;
  }

  if (modo === 'simple') {
    onSeleccionar(ejercicioSeleccionado, { seriesSimples });
  } else {
    // Validar que todas las series tengan técnica
    const todasConTecnica = seriesAvanzadas.every(s => s.tecnicaId);
    if (!todasConTecnica) {
      alert('Todas las series deben tener una técnica asignada');
      return;
    }

    // Convertir seriesAvanzadas a estructura con bloques
    const seriesConBloques = seriesAvanzadas.map(serie => ({
      numero: serie.numero,
      tecnicaId: serie.tecnicaId,
      rir: serie.rir,
      descansoSegundos: serie.descansoSegundos,
      notasGenerales: serie.notasGenerales,
      bloques: [
        {
          numero: 1,
          tipo: 'principal' as const,
          repsMin: serie.bloques[0]?.repsMin || 10,
          repsMax: serie.bloques[0]?.repsMax || 10,
        }
      ]
    }));

    onSeleccionar(ejercicioSeleccionado, { seriesAvanzadas: seriesConBloques });
  }
};

  const añadirSerie = () => {
    setSeriesAvanzadas([
      ...seriesAvanzadas,
      { 
        numero: seriesAvanzadas.length + 1, 
        tecnicaId: '', 
        bloques: [
          {
            numero: 1,
            tipo: 'principal',
            repsMin: 10,
            repsMax: 10,
          }
        ]
      }
    ]);
  };

  const actualizarSerie = (index: number, campo: keyof ConfigSerie, valor: any) => {
    const nuevasSeries = [...seriesAvanzadas];
    (nuevasSeries[index] as any)[campo] = valor;
    setSeriesAvanzadas(nuevasSeries);
  };

  const eliminarSerie = (index: number) => {
    if (seriesAvanzadas.length === 1) {
      alert('Debe haber al menos 1 serie');
      return;
    }
    const nuevasSeries = seriesAvanzadas.filter((_, i) => i !== index);
    // Renumerar
    nuevasSeries.forEach((s, i) => s.numero = i + 1);
    setSeriesAvanzadas(nuevasSeries);
  };

  if (loading || loadingTecnicas) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg text-center">
        <p>Cargando...</p>
      </div>
    );
  }

  if (ejercicios.length === 0) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg text-center">
        <p className="text-gray-400 mb-4">No hay ejercicios disponibles</p>
        <button
          onClick={onCancelar}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg space-y-4">
      <h3 className="text-xl font-bold mb-4">Añadir Ejercicio</h3>

      {/* Selector de ejercicio */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Ejercicio *
        </label>
        <select
          value={ejercicioSeleccionado}
          onChange={(e) => setEjercicioSeleccionado(e.target.value)}
          className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {ejercicios.map(ejercicio => (
            <option key={ejercicio.id} value={ejercicio.id}>
              {ejercicio.nombre} ({ejercicio.grupoMuscular})
            </option>
          ))}
        </select>
      </div>

      {/* Selector de modo */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Modo de configuración
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setModo('simple')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              modo === 'simple'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            🟢 Simple
          </button>
          <button
            type="button"
            onClick={() => setModo('avanzado')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              modo === 'avanzado'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            🔴 Avanzado
          </button>
        </div>
      </div>

      {/* MODO SIMPLE */}
      {modo === 'simple' && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Número de series *
          </label>
          <input
            type="number"
            value={seriesSimples}
            onChange={(e) => setSeriesSimples(Number(e.target.value))}
            min="1"
            max="10"
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-400 mt-2">
            Modo principiante: solo registrarás peso y reps sin técnicas específicas
          </p>
        </div>
      )}

      {/* MODO AVANZADO */}
      {modo === 'avanzado' && (
        <div className="space-y-3">
          <p className="text-sm text-gray-400">
            Configura cada serie con su técnica específica
          </p>

          {seriesAvanzadas.map((serie, index) => (
            <div key={index} className="bg-gray-700 p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Serie {serie.numero}</h4>
                {seriesAvanzadas.length > 1 && (
                  <button
                    type="button"
                    onClick={() => eliminarSerie(index)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    ✕ Quitar
                  </button>
                )}
              </div>

              {/* Técnica */}
              <div>
                <label className="block text-xs text-gray-400 mb-1">Técnica *</label>
                <select
                  value={serie.tecnicaId}
                  onChange={(e) => actualizarSerie(index, 'tecnicaId', e.target.value)}
                  className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecciona técnica...</option>
                  {tecnicasPredefinidas.map(tecnica => (
                    <option key={tecnica.id} value={tecnica.id}>
                      {tecnica.icono} {tecnica.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reps objetivo */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-1">Reps objetivo</label>
                  <input
                    type="number"
                    value={serie.bloques[0]?.repsMin || ''}
                    onChange={(e) => {
                      const nuevas = [...seriesAvanzadas];
                      if (nuevas[index].bloques[0]) {
                        nuevas[index].bloques[0].repsMin = Number(e.target.value);
                        nuevas[index].bloques[0].repsMax = Number(e.target.value);
                      }
                      setSeriesAvanzadas(nuevas);
                    }}
                    placeholder="10"
                    min="1"
                    max="50"
                    className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* RIR */}
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-1">RIR</label>
                  <input
                    type="number"
                    value={serie.rir || ''}
                    onChange={(e) => actualizarSerie(index, 'rir', Number(e.target.value))}
                    placeholder="0"
                    min="0"
                    max="5"
                    className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Notas */}
              <div>
                <label className="block text-xs text-gray-400 mb-1">Notas (opcional)</label>
                <input
                  type="text"
                  value={serie.notasGenerales || ''}
                  onChange={(e) => actualizarSerie(index, 'notasGenerales', e.target.value)}
                  placeholder="Ej: Pausas de 2 segundos"
                  className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={añadirSerie}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm transition-colors"
          >
            + Añadir Serie
          </button>
        </div>
      )}

      {/* Botones */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors"
        >
          Añadir
        </button>
        <button
          type="button"
          onClick={onCancelar}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 rounded-lg transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}