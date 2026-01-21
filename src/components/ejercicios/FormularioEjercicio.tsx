import { useState } from 'react';
import type { CrearEjercicioDTO, GrupoMuscular, Ejercicio } from '../../types';
import { GRUPOS_MUSCULARES, RANGOS_PRESETS, INCREMENTOS_PESO } from '../../constants/ejercicios';

interface FormularioEjercicioProps {
  onGuardar: (ejercicio: CrearEjercicioDTO) => Promise<void>;
  onCancelar: () => void;
  ejercicioInicial?: Ejercicio | null;  // ← Añade esta línea
}

export function FormularioEjercicio({ onGuardar, onCancelar, ejercicioInicial }: FormularioEjercicioProps){
  // Estados para cada campo del formulario
    const [nombre, setNombre] = useState(ejercicioInicial?.nombre || '');
    const [grupoMuscular, setGrupoMuscular] = useState<GrupoMuscular>(ejercicioInicial?.grupoMuscular || 'Pecho');
    const [rangoMin, setRangoMin] = useState(ejercicioInicial?.rangoReps?.min || 6);
    const [rangoMax, setRangoMax] = useState(ejercicioInicial?.rangoReps?.max || 8);
    const [incrementoPeso, setIncrementoPeso] = useState(ejercicioInicial?.incrementoPeso || 2.5);
    const [notas, setNotas] = useState(ejercicioInicial?.notas || '');
    const [guardando, setGuardando] = useState(false);

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación simple
    if (!nombre.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    if (rangoMin >= rangoMax) {
      alert('El mínimo debe ser menor que el máximo');
      return;
    }

    try {
      setGuardando(true);
      await onGuardar({
        nombre: nombre.trim(),
        grupoMuscular,
        rangoReps: { min: rangoMin, max: rangoMax },
        incrementoPeso,
        notas: notas.trim() || undefined,
      });
      
      // Limpiar formulario después de guardar
      setNombre('');
      setNotas('');
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar el ejercicio');
    } finally {
      setGuardando(false);
    }
  };

  // Aplicar preset de rango
  const aplicarPreset = (min: number, max: number) => {
    setRangoMin(min);
    setRangoMax(max);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg space-y-4">
      <h2 className="text-2xl font-bold mb-4">
        {ejercicioInicial ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}
      </h2>

      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Nombre del ejercicio *
        </label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej: Press Banca"
          className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={guardando}
        />
      </div>

      {/* Grupo Muscular */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Grupo Muscular *
        </label>
        <select
          value={grupoMuscular}
          onChange={(e) => setGrupoMuscular(e.target.value as GrupoMuscular)}
          className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={guardando}
        >
          {GRUPOS_MUSCULARES.map(grupo => (
            <option key={grupo} value={grupo}>{grupo}</option>
          ))}
        </select>
      </div>

      {/* Rango de Reps */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Rango de Repeticiones *
        </label>
        
        {/* Botones de presets */}
        <div className="flex flex-wrap gap-2 mb-3">
          {RANGOS_PRESETS.map(preset => (
            <button
              key={preset.label}
              type="button"
              onClick={() => aplicarPreset(preset.min, preset.max)}
              className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm transition-colors"
              disabled={guardando}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Inputs mín/máx */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs text-gray-400 mb-1">Mínimo</label>
            <input
              type="number"
              value={rangoMin}
              onChange={(e) => setRangoMin(Number(e.target.value))}
              min="1"
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={guardando}
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-400 mb-1">Máximo</label>
            <input
              type="number"
              value={rangoMax}
              onChange={(e) => setRangoMax(Number(e.target.value))}
              min="1"
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={guardando}
            />
          </div>
        </div>
      </div>

      {/* Incremento de Peso */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Incremento de Peso (kg) *
        </label>
        <select
          value={incrementoPeso}
          onChange={(e) => setIncrementoPeso(Number(e.target.value))}
          className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={guardando}
        >
          {INCREMENTOS_PESO.map(peso => (
            <option key={peso} value={peso}>{peso} kg</option>
          ))}
        </select>
      </div>

      {/* Notas (opcional) */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Notas (opcional)
        </label>
        <textarea
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          placeholder="Ej: Mantener escápulas retraídas"
          rows={3}
          className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          disabled={guardando}
        />
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={guardando}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {guardando ? 'Guardando...' : (ejercicioInicial ? 'Actualizar' : 'Guardar Ejercicio')}
        </button>
        <button
          type="button"
          onClick={onCancelar}
          disabled={guardando}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}