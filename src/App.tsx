import { useState } from 'react';
import { RutinasPage } from './pages/RutinasPage';
import { EntrenarPage } from './pages/EntrenarPage';
import { TecnicasPage } from './pages/TecnicasPage';
import { EjerciciosPage } from './pages/EjerciciosPage';
type Vista = 'rutinas' | 'entrenar' | 'tecnicas' | 'ejercicios';

function App() {
  const [vistaActual, setVistaActual] = useState<Vista>('rutinas');

  return (
    <div>
      {/* Navegación */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-8 py-4 flex gap-4 items-center justify-between">
          <div className="flex gap-4">
            <button
              onClick={() => setVistaActual('rutinas')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                vistaActual === 'rutinas'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              📋 Rutinas
            </button>
            <button
              onClick={() => setVistaActual('entrenar')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                vistaActual === 'entrenar'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              🏋️ Entrenar
            </button>
            <button
              onClick={() => setVistaActual('tecnicas')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                vistaActual === 'tecnicas'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              ⚙️ Técnicas
            </button>
            <button
            onClick={() => setVistaActual('ejercicios')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              vistaActual === 'ejercicios'
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            💪 Ejercicios
          </button>
          </div>
        </div>
      </nav>

      {/* Contenido */}
      {vistaActual === 'rutinas' && <RutinasPage />}
      {vistaActual === 'entrenar' && <EntrenarPage />}
      {vistaActual === 'tecnicas' && <TecnicasPage />}
      {vistaActual === 'ejercicios' && <EjerciciosPage />}
    </div>
  );
}

export default App;