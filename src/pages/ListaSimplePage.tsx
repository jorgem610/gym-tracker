import { useState } from 'react';

export function ListaSimplePage() {
  // Estado: array de ejercicios (solo nombres)
  const [ejercicios, setEjercicios] = useState<string[]>([]);
  
  // Estado: input
  const [nuevoEjercicio, setNuevoEjercicio] = useState('');

  // Añadir ejercicio
  const agregarEjercicio = () => {
    if (nuevoEjercicio.trim() === '') {
      alert('Escribe un nombre');
      return;
    }
    
    setEjercicios([...ejercicios, nuevoEjercicio]);
    setNuevoEjercicio(''); // Limpiar input
  };

  // Borrar ejercicio
  const borrarEjercicio = (index: number) => {
    setEjercicios(ejercicios.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">📝 Lista de Ejercicios</h1>

        {/* Formulario */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={nuevoEjercicio}
              onChange={(e) => setNuevoEjercicio(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && agregarEjercicio()}
              placeholder="Nombre del ejercicio..."
              className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={agregarEjercicio}
              className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg font-medium"
            >
              Añadir
            </button>
          </div>
        </div>

        {/* Lista */}
        <div className="space-y-3">
          {ejercicios.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No hay ejercicios. Añade uno arriba.
            </p>
          ) : (
            ejercicios.map((ejercicio, index) => (
              <div
                key={index}
                className="bg-gray-800 p-4 rounded-lg flex justify-between items-center"
              >
                <span className="text-lg">{ejercicio}</span>
                <button
                  onClick={() => borrarEjercicio(index)}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm"
                >
                  Borrar
                </button>
              </div>
            ))
          )}
        </div>

        {/* Contador */}
        <p className="text-gray-400 text-center mt-8">
          Total: {ejercicios.length} ejercicio(s)
        </p>
      </div>
    </div>
  );
}