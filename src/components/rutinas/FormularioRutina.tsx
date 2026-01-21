import { useState } from 'react';
import type { CrearRutinaDTO, Rutina } from '../../types';

interface FormularioRutinaProps {
  onGuardar: (rutina: CrearRutinaDTO) => Promise<void>;
  onCancelar: () => void;
  rutinaInicial?: Rutina | null;
}

export function FormularioRutina({ onGuardar, onCancelar, rutinaInicial }: FormularioRutinaProps) {
  const [nombre, setNombre] = useState(rutinaInicial?.nombre || '');
  const [descripcion, setDescripcion] = useState(rutinaInicial?.descripcion || '');
  const [guardando, setGuardando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombre.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    try {
      setGuardando(true);
      await onGuardar({
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || undefined,
        dias: rutinaInicial?.dias || [],
        activa: rutinaInicial?.activa || false,
      });
      
      setNombre('');
      setDescripcion('');
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar la rutina');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg space-y-4">
      <h2 className="text-2xl font-bold mb-4">
        {rutinaInicial ? 'Editar Rutina' : 'Nueva Rutina'}
      </h2>

      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Nombre de la rutina *
        </label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej: Mi PPL 6 días"
          className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={guardando}
        />
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Descripción (opcional)
        </label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Ej: Rutina Push/Pull/Legs para volumen"
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
          {guardando ? 'Guardando...' : (rutinaInicial ? 'Actualizar' : 'Crear Rutina')}
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