import { useState, useEffect } from 'react';
import { useTecnicas } from '../../hooks/useTecnicas';
import type { EjercicioDia, ConfigSerie, ConfigBloque, Ejercicio } from '../../types';

interface EditarEjercicioProps {
  ejercicioDia: EjercicioDia;
  ejercicio: Ejercicio;
  onGuardar: (ejercicioActualizado: EjercicioDia) => void;
  onCancelar: () => void;
}

export function EditarEjercicio({
  ejercicioDia,
  ejercicio,
  onGuardar,
  onCancelar,
}: EditarEjercicioProps) {
  const { tecnicasPredefinidas } = useTecnicas();
  
  // Detectar modo
  const modoInicial = ejercicioDia.seriesSimples ? 'simple' : 'avanzado';
  const [modo, setModo] = useState<'simple' | 'avanzado'>(modoInicial);
  
  // Modo simple
  const [seriesSimples, setSeriesSimples] = useState(ejercicioDia.seriesSimples || 3);
  
  // Modo avanzado
  const [seriesAvanzadas, setSeriesAvanzadas] = useState<ConfigSerie[]>(
    ejercicioDia.seriesAvanzadas || []
    
  );

  // Detectar si la técnica requiere diferentes tipos de bloques
const requiereTipoBloque = (tecnicaId: string): boolean => {
  const tecnica = tecnicasPredefinidas.find(t => t.id === tecnicaId);
  if (!tecnica) return false;
  
  // Técnicas que tienen bloques con diferentes tipos
  const tecnicasMultiples = ['Rest Pause', 'Myo Reps'];
  return tecnicasMultiples.includes(tecnica.nombre);
};

// Detectar si la técnica usa % peso variable
const requierePorcentajePeso = (tecnicaId: string): boolean => {
  const tecnica = tecnicasPredefinidas.find(t => t.id === tecnicaId);
  if (!tecnica) return false;
  
  // Solo Drop Set necesita % peso visible
  return tecnica.nombre === 'Drop Set';
};

  // Bloquear scroll cuando el modal está abierto
useEffect(() => {
  // Guardar overflow actual
  const originalOverflow = document.body.style.overflow;
  
  // Bloquear scroll
  document.body.style.overflow = 'hidden';
  
  // Restaurar al desmontar
  return () => {
    document.body.style.overflow = originalOverflow;
  };
}, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const ejercicioActualizado: EjercicioDia = {
      ...ejercicioDia,
    };

    if (modo === 'simple') {
      ejercicioActualizado.seriesSimples = seriesSimples;
      delete ejercicioActualizado.seriesAvanzadas;
    } else {
      // Validar técnicas
      const todasConTecnica = seriesAvanzadas.every(s => s.tecnicaId);
      if (!todasConTecnica) {
        alert('Todas las series deben tener una técnica asignada');
        return;
      }

      ejercicioActualizado.seriesAvanzadas = seriesAvanzadas;
      delete ejercicioActualizado.seriesSimples;
    }

    onGuardar(ejercicioActualizado);
  };

  const añadirSerie = () => {
  const nuevaSerie: ConfigSerie = {
    numero: seriesAvanzadas.length + 1,
    tecnicaId: '',
    rir: 0,
    bloques: [
      {
        numero: 1,
        tipo: 'principal',
        repsMin: 10,
        repsMax: 10,
        porcentajePeso: 100,  // ← Primera serie siempre 100%
      }
    ]
  };
  setSeriesAvanzadas([...seriesAvanzadas, nuevaSerie]);
};

  const actualizarSerie = (index: number, campo: keyof ConfigSerie, valor: any) => {
  const nuevas = [...seriesAvanzadas];
  (nuevas[index] as any)[campo] = valor;
  
  // Si cambia la técnica, ajustar % peso del primer bloque
  if (campo === 'tecnicaId') {
    const tecnica = tecnicasPredefinidas.find(t => t.id === valor);
    if (tecnica && nuevas[index].bloques.length > 0) {
      if (tecnica.nombre === 'Back Off') {
        nuevas[index].bloques[0].porcentajePeso = 80;
      } else if (tecnica.nombre === 'Top Set' || tecnica.nombre === 'Normal') {
        nuevas[index].bloques[0].porcentajePeso = 100;
      }
    }
  }
  
  setSeriesAvanzadas(nuevas);
};

  const actualizarBloque = (
    serieIndex: number,
    bloqueIndex: number,
    campo: keyof ConfigBloque,
    valor: any
  ) => {
    const nuevas = [...seriesAvanzadas];
    (nuevas[serieIndex].bloques[bloqueIndex] as any)[campo] = valor;
    setSeriesAvanzadas(nuevas);
  };

  const añadirBloque = (serieIndex: number) => {
  const nuevas = [...seriesAvanzadas];
  const serie = nuevas[serieIndex];
  const tecnica = tecnicasPredefinidas.find(t => t.id === serie.tecnicaId);
  
  // Calcular % peso según técnica
  let porcentajePeso = 100;
  
  if (tecnica) {
    if (tecnica.nombre === 'Drop Set') {
      // Drop Set: 80% del bloque anterior
      const ultimoBloque = serie.bloques[serie.bloques.length - 1];
      const porcentajeAnterior = ultimoBloque.porcentajePeso || 100;
      porcentajePeso = Math.round(porcentajeAnterior * 0.8);
    } else if (['Rest Pause', 'Myo Reps', 'Cluster', 'Top Set', 'Balístico'].includes(tecnica.nombre)) {
      // Mismo peso para todas estas técnicas
      porcentajePeso = 100;
    } else if (tecnica.nombre === 'Back Off') {
      // Back Off: 80% fijo
      porcentajePeso = 80;
    }
  }
  
  const nuevoBloque: ConfigBloque = {
    numero: serie.bloques.length + 1,
    tipo: 'principal',
    repsMin: 10,
    repsMax: 10,
    porcentajePeso,
  };
  
  nuevas[serieIndex].bloques.push(nuevoBloque);
  setSeriesAvanzadas(nuevas);
};

  const eliminarBloque = (serieIndex: number, bloqueIndex: number) => {
    const nuevas = [...seriesAvanzadas];
    if (nuevas[serieIndex].bloques.length === 1) {
      alert('Debe haber al menos 1 bloque por serie');
      return;
    }
    nuevas[serieIndex].bloques.splice(bloqueIndex, 1);
    // Renumerar bloques
    nuevas[serieIndex].bloques.forEach((b, i) => b.numero = i + 1);
    setSeriesAvanzadas(nuevas);
  };

  const eliminarSerie = (index: number) => {
    if (seriesAvanzadas.length === 1) {
      alert('Debe haber al menos 1 serie');
      return;
    }
    const nuevas = seriesAvanzadas.filter((_, i) => i !== index);
    // Renumerar
    nuevas.forEach((s, i) => s.numero = i + 1);
    setSeriesAvanzadas(nuevas);
  };

  return (
  <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
    {/* Header fijo */}
    <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
      <button
        type="button"
        onClick={onCancelar}
        className="text-blue-400 hover:text-blue-300 font-medium"
      >
        ← Cancelar
      </button>
      
      <h3 className="text-lg font-bold truncate mx-4">{ejercicio.nombre}</h3>
      
      <button
        type="button"
        onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
      >
        Guardar
      </button>
    </div>

    {/* Contenido scrolleable */}
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Selector modo */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Modo de configuración
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setModo('simple')}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
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
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
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
              Número de series
            </label>
            <input
              type="number"
              value={seriesSimples}
              onChange={(e) => setSeriesSimples(Number(e.target.value))}
              min="1"
              max="10"
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg text-lg"
            />
          </div>
        )}

        {/* MODO AVANZADO */}
        {modo === 'avanzado' && (
          <div className="space-y-4">
            {seriesAvanzadas.map((serie, serieIdx) => (
              <div key={serieIdx} className="bg-gray-800 p-4 rounded-lg space-y-3 border border-gray-700">
                {/* Header serie */}
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-lg">Serie {serie.numero}</h4>
                  {seriesAvanzadas.length > 1 && (
                    <button
                      type="button"
                      onClick={() => eliminarSerie(serieIdx)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm"
                    >
                      ✕ Quitar
                    </button>
                  )}
                </div>

                {/* Técnica */}
                <div>
                  <label className="block text-sm font-medium mb-2">Técnica *</label>
                  <select
                    value={serie.tecnicaId}
                    onChange={(e) => actualizarSerie(serieIdx, 'tecnicaId', e.target.value)}
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg text-base"
                  >
                    <option value="">Selecciona técnica...</option>
                    {tecnicasPredefinidas.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.icono} {t.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* RIR */}
                <div>
                  <label className="block text-sm font-medium mb-2">RIR (Reps in Reserve)</label>
                  <input
                    type="number"
                    value={serie.rir || ''}
                    onChange={(e) => actualizarSerie(serieIdx, 'rir', Number(e.target.value))}
                    placeholder="0"
                    min="0"
                    max="5"
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg text-lg"
                  />
                </div>

                {/* Bloques */}
                <div className="space-y-3 pt-2">
                  <p className="text-xs text-gray-400 font-medium">BLOQUES DE LA SERIE:</p>
                  
                  {serie.bloques.map((bloque, bloqueIdx) => (
                    <div key={bloqueIdx} className="bg-gray-600 p-3 rounded space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Bloque {bloque.numero}</span>
                        {serie.bloques.length > 1 && (
                          <button
                            type="button"
                            onClick={() => eliminarBloque(serieIdx, bloqueIdx)}
                            className="text-red-400 hover:text-red-300 text-xs"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      {/* Tipo de bloque - SOLO si la técnica lo requiere */}
                      {requiereTipoBloque(serie.tecnicaId) && (
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Tipo</label>
                          <select
                            value={bloque.tipo}
                            onChange={(e) => actualizarBloque(serieIdx, bloqueIdx, 'tipo', e.target.value)}
                            className="w-full bg-gray-500 text-white px-3 py-2 rounded text-sm"
                          >
                            <option value="principal">Principal</option>
                            <option value="rest-pause">Rest Pause</option>
                            <option value="myo-rep">Myo Rep</option>
                          </select>
                        </div>
                      )}

                      {/* Reps */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Reps Min</label>
                          <input
                            type="number"
                            value={bloque.repsMin || ''}
                            onChange={(e) => actualizarBloque(serieIdx, bloqueIdx, 'repsMin', Number(e.target.value))}
                            placeholder="6"
                            min="1"
                            className="w-full bg-gray-500 text-white px-3 py-2 rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Reps Max</label>
                          <input
                            type="number"
                            value={bloque.repsMax || ''}
                            onChange={(e) => actualizarBloque(serieIdx, bloqueIdx, 'repsMax', Number(e.target.value))}
                            placeholder="9"
                            min="1"
                            className="w-full bg-gray-500 text-white px-3 py-2 rounded text-sm"
                          />
                        </div>
                      </div>

                      {/* % Peso - SOLO si la técnica lo requiere */}
                      {requierePorcentajePeso(serie.tecnicaId) && (
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">% Peso</label>
                          <input
                            type="number"
                            value={bloque.porcentajePeso || ''}
                            onChange={(e) => actualizarBloque(serieIdx, bloqueIdx, 'porcentajePeso', Number(e.target.value))}
                            placeholder="100"
                            min="10"
                            max="100"
                            className="w-full bg-gray-500 text-white px-3 py-2 rounded text-sm"
                          />
                        </div>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => añadirBloque(serieIdx)}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded text-sm border border-gray-600"
                  >
                    + Añadir Bloque
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={añadirSerie}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg"
            >
              + Añadir Serie
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);
}