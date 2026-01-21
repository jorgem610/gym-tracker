import { useState } from 'react';
import type { DiaRutina, TipoDia } from '../../types';

const TIPOS_DIA: TipoDia[] = ['Push', 'Pull', 'Legs', 'Torso', 'Full Body', 'Personalizado'];

interface FormularioDiaProps {
  onGuardar: (nombre: string, tipo: TipoDia) => void;
  onCancelar: () => void;
  diaInicial?: DiaRutina | null;
}

export function FormularioDia({ onGuardar, onCancelar, diaInicial }: FormularioDiaProps) {
  const [nombre, setNombre] = useState(diaInicial?.nombre || '');
  const [tipo, setTipo] = useState<TipoDia>(diaInicial?.tipo || 'Push');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombre.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    onGuardar(nombre.trim(), tipo);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg space-y-4">
      <h3 className="text-xl font-bold mb-4">
        {diaInicial ? 'Editar Día' : 'Añadir Día'}
      </h3>

      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Nombre del día *
        </label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej: Lunes, Martes, Día 1"
          className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tipo */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Tipo de día *
        </label>
        <div className="grid grid-cols-2 gap-2">
          {TIPOS_DIA.map(tipoDia => (
            <button
              key={tipoDia}
              type="button"
              onClick={() => setTipo(tipoDia)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                tipo === tipoDia
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {tipoDia}
            </button>
          ))}
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors"
        >
          {diaInicial ? 'Actualizar' : 'Añadir Día'}
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