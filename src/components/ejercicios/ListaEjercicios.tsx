import { useState } from 'react';
import type { Ejercicio } from '../../types';

interface ListaEjerciciosProps {
  ejercicios: Ejercicio[];
  onEditar: (ejercicio: Ejercicio) => void;
  onBorrar: (id: string) => void;
  onBorrarMultiples: (ids: string[]) => void;
}

export function ListaEjercicios({ ejercicios, onEditar, onBorrar, onBorrarMultiples }: ListaEjerciciosProps) {
  const [seleccionados, setSeleccionados] = useState<string[]>([]);

  // Toggle selección individual
  const toggleSeleccion = (id: string) => {
    if (seleccionados.includes(id)) {
      setSeleccionados(seleccionados.filter(sid => sid !== id));
    } else {
      setSeleccionados([...seleccionados, id]);
    }
  };

  // Seleccionar/Deseleccionar todos
  const toggleTodos = () => {
    if (seleccionados.length === ejercicios.length) {
      setSeleccionados([]);
    } else {
      setSeleccionados(ejercicios.map(ej => ej.id));
    }
  };

  // Borrar seleccionados
  const borrarSeleccionados = () => {
    if (window.confirm(`¿Borrar ${seleccionados.length} ejercicio(s)?`)) {
      onBorrarMultiples(seleccionados);
      setSeleccionados([]);
    }
  };

  if (ejercicios.length === 0) {
    return (
      <div className="bg-gray-800 p-8 rounded-lg text-center">
        <p className="text-gray-400 text-lg">No hay ejercicios todavía</p>
        <p className="text-gray-500 text-sm mt-2">Crea tu primer ejercicio para empezar</p>
      </div>
    );
  }

  return (
    <div>
      {/* Barra de acciones */}
      <div className="flex justify-between items-center mb-4 bg-gray-800 p-4 rounded-lg">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={seleccionados.length === ejercicios.length}
            onChange={toggleTodos}
            className="w-5 h-5 cursor-pointer"
          />
          <span className="text-sm">
            {seleccionados.length === ejercicios.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
          </span>
        </label>

        {seleccionados.length > 0 && (
          <button
            onClick={borrarSeleccionados}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            🗑️ Borrar ({seleccionados.length})
          </button>
        )}
      </div>

      {/* Lista de ejercicios */}
      <div className="space-y-4">
        {ejercicios.map(ejercicio => (
          <div 
            key={ejercicio.id} 
            className={`bg-gray-800 p-5 rounded-lg transition-all ${
              seleccionados.includes(ejercicio.id) ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={seleccionados.includes(ejercicio.id)}
                onChange={() => toggleSeleccion(ejercicio.id)}
                className="w-5 h-5 mt-1 cursor-pointer"
              />

              {/* Información */}
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{ejercicio.nombre}</h3>
                
                <div className="space-y-1 text-sm text-gray-400">
                  <p>
                    <span className="text-gray-500">Grupo:</span>{' '}
                    <span className="text-white font-medium">{ejercicio.grupoMuscular}</span>
                  </p>
                  
                  <p>
                    <span className="text-gray-500">Rango:</span>{' '}
                    <span className="text-white font-medium">
                      {ejercicio.rangoReps?.min || 0}-{ejercicio.rangoReps?.max || 0} reps
                    </span>
                  </p>
                  
                  <p>
                    <span className="text-gray-500">Incremento:</span>{' '}
                    <span className="text-white font-medium">{ejercicio.incrementoPeso} kg</span>
                  </p>
                  
                  {ejercicio.notas && (
                    <p className="mt-2 text-gray-400 italic">
                      "{ejercicio.notas}"
                    </p>
                  )}
                </div>
              </div>

              {/* Botones individuales */}
              <div className="flex gap-2">
                <button
                  onClick={() => onEditar(ejercicio)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  Editar
                </button>
                
                <button
                  onClick={() => {
                    if (window.confirm(`¿Borrar "${ejercicio.nombre}"?`)) {
                      onBorrar(ejercicio.id);
                    }
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}