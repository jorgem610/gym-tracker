import { useState } from 'react';
import { useEjercicios } from '../hooks/useEjercicios';
import type { Ejercicio, GrupoMuscular } from '../types';

export function EjerciciosPage() {
  const { ejercicios, crear, actualizar, borrar, loading } = useEjercicios();
  
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [ejercicioEditando, setEjercicioEditando] = useState<Ejercicio | null>(null);
  
  const [nombre, setNombre] = useState('');
  const [grupoMuscular, setGrupoMuscular] = useState<GrupoMuscular>('Pecho');
  const [repsMin, setRepsMin] = useState(6);
  const [repsMax, setRepsMax] = useState(12);
  const [incrementoPeso, setIncrementoPeso] = useState(2.5);
  const [notas, setNotas] = useState('');

  const resetFormulario = () => {
    setNombre('');
    setGrupoMuscular('Pecho');
    setRepsMin(6);
    setRepsMax(12);
    setIncrementoPeso(2.5);
    setNotas('');
    setEjercicioEditando(null);
    setMostrarFormulario(false);
  };

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    if (repsMin > repsMax) {
      alert('El mínimo de reps debe ser menor que el máximo');
      return;
    }

    try {
      await crear({
        nombre: nombre.trim(),
        grupoMuscular,
        rangoReps: { min: repsMin, max: repsMax },
        incrementoPeso,
        notas: notas.trim() || undefined,
      });

      alert('✅ Ejercicio creado');
      resetFormulario();
    } catch (error) {
      alert('❌ Error al crear ejercicio');
    }
  };

  const handleEditar = (ejercicio: Ejercicio) => {
    setEjercicioEditando(ejercicio);
    setNombre(ejercicio.nombre);
    setGrupoMuscular(ejercicio.grupoMuscular);
    setRepsMin(ejercicio.rangoReps?.min);
    setRepsMax(ejercicio.rangoReps?.max);
    setIncrementoPeso(ejercicio.incrementoPeso);
    setNotas(ejercicio.notas || '');
    setMostrarFormulario(true);
  };

  const handleActualizar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ejercicioEditando) return;

    if (repsMin > repsMax) {
      alert('El mínimo de reps debe ser menor que el máximo');
      return;
    }

    try {
      await actualizar(ejercicioEditando.id, {
        nombre: nombre.trim(),
        grupoMuscular,
        rangoReps: { min: repsMin, max: repsMax },
        incrementoPeso,
        notas: notas.trim() || undefined,
      });

      alert('✅ Ejercicio actualizado');
      resetFormulario();
    } catch (error) {
      alert('❌ Error al actualizar ejercicio');
    }
  };

  const handleBorrar = async (id: string, nombre: string) => {
    if (!window.confirm(`¿Borrar ejercicio "${nombre}"?`)) return;

    try {
      await borrar(id);
      alert('✅ Ejercicio borrado');
    } catch (error) {
      alert('❌ Error al borrar ejercicio');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-center">Cargando ejercicios...</p>
        </div>
      </div>
    );
  }

  // Agrupar por grupo muscular
  const ejerciciosPorGrupo = ejercicios.reduce((acc, ej) => {
    if (!acc[ej.grupoMuscular]) acc[ej.grupoMuscular] = [];
    acc[ej.grupoMuscular].push(ej);
    return acc;
  }, {} as Record<GrupoMuscular, Ejercicio[]>);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Ejercicios</h1>

        {/* Botón crear */}
        {!mostrarFormulario && (
          <button
            onClick={() => setMostrarFormulario(true)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors mb-6"
          >
            + Crear Ejercicio
          </button>
        )}

        {/* Formulario */}
        {mostrarFormulario && (
          <form
            onSubmit={ejercicioEditando ? handleActualizar : handleCrear}
            className="bg-gray-800 p-6 rounded-lg mb-6 space-y-4"
          >
            <h3 className="text-xl font-bold">
              {ejercicioEditando ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}
            </h3>

            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium mb-2">Nombre *</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Press Banca"
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
              />
            </div>

            {/* Grupo Muscular */}
            <div>
              <label className="block text-sm font-medium mb-2">Grupo Muscular *</label>
              <select
                value={grupoMuscular}
                onChange={(e) => setGrupoMuscular(e.target.value as GrupoMuscular)}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
              >
                <option value="Pecho">Pecho</option>
                <option value="Espalda">Espalda</option>
                <option value="Hombros">Hombros</option>
                <option value="Bíceps">Bíceps</option>
                <option value="Tríceps">Tríceps</option>
                <option value="Cuádriceps">Cuádriceps</option>
                <option value="Femoral">Femoral</option>
                <option value="Glúteos">Glúteos</option>
                <option value="Gemelos">Gemelos</option>
                <option value="Core">Core</option>
              </select>
            </div>

            {/* Rango de Reps */}
            <div>
              <label className="block text-sm font-medium mb-2">Rango de Repeticiones *</label>
              <div className="flex gap-3 items-center">
                <input
                  type="number"
                  value={repsMin}
                  onChange={(e) => setRepsMin(Number(e.target.value))}
                  min="1"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
                  placeholder="Min"
                />
                <span>-</span>
                <input
                  type="number"
                  value={repsMax}
                  onChange={(e) => setRepsMax(Number(e.target.value))}
                  min="1"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
                  placeholder="Max"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Ej: 6-12 reps para hipertrofia
              </p>
            </div>

            {/* Incremento de Peso */}
            <div>
              <label className="block text-sm font-medium mb-2">Incremento de Peso (kg) *</label>
              <input
                type="number"
                value={incrementoPeso}
                onChange={(e) => setIncrementoPeso(Number(e.target.value))}
                step="0.5"
                min="0.5"
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
                placeholder="2.5"
              />
              <p className="text-xs text-gray-400 mt-1">
                Cuánto peso añadir cuando progresas (normalmente 2.5kg)
              </p>
            </div>

            {/* Notas */}
            <div>
              <label className="block text-sm font-medium mb-2">Notas</label>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Notas sobre técnica, variantes, etc..."
                rows={3}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
              />
            </div>

            {/* Botones */}
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg"
              >
                {ejercicioEditando ? 'Actualizar' : 'Crear'}
              </button>
              <button
                type="button"
                onClick={resetFormulario}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {/* Lista de ejercicios por grupo */}
        <div className="space-y-6">
          {(Object.keys(ejerciciosPorGrupo) as GrupoMuscular[]).map(grupo => (
            <div key={grupo}>
              <h2 className="text-2xl font-bold mb-4">{grupo}</h2>
              <div className="space-y-2">
                {ejerciciosPorGrupo[grupo]?.map(ejercicio => (
                  <div
                    key={ejercicio.id}
                    className="bg-gray-800 p-4 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-lg">{ejercicio.nombre}</p>
                      <p className="text-sm text-gray-400">
                      {ejercicio.rangoReps ? (
                        <>
                          {ejercicio.rangoReps.min}-{ejercicio.rangoReps.max} reps • 
                          Incremento: {ejercicio.incrementoPeso}kg
                        </>
                      ) : (
                        <>Incremento: {ejercicio.incrementoPeso}kg</>
                      )}
                    </p>
                      {ejercicio.notas && (
                        <p className="text-sm text-gray-500 mt-1">{ejercicio.notas}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditar(ejercicio)}
                        className="bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded text-sm"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleBorrar(ejercicio.id, ejercicio.nombre)}
                        className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded text-sm"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {ejercicios.length === 0 && !mostrarFormulario && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-xl mb-2">No hay ejercicios creados</p>
            <p className="text-sm">Crea tu primer ejercicio con el botón de arriba</p>
          </div>
        )}
      </div>
    </div>
  );
}