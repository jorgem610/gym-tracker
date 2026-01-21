import type { Rutina } from '../../types';

interface ListaRutinasProps {
  rutinas: Rutina[];
  onEditar: (rutina: Rutina) => void;
  onBorrar: (id: string) => void;
  onActivar: (id: string) => void;
  onVerDetalles: (rutina: Rutina) => void;
}

export function ListaRutinas({ 
  rutinas, 
  onEditar, 
  onBorrar, 
  onActivar,
  onVerDetalles 
}: ListaRutinasProps) {
  
  if (rutinas.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-xl mb-2">No hay rutinas creadas</p>
        <p className="text-sm">Crea tu primera rutina con el botón de arriba</p>
      </div>
    );
  }

  const handleBorrar = (id: string, nombre: string) => {
    if (window.confirm(`¿Seguro que quieres borrar "${nombre}"?`)) {
      onBorrar(id);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {rutinas.map(rutina => (
        <div 
          key={rutina.id}
          className={`bg-gray-800 p-6 rounded-lg border-2 transition-all ${
            rutina.activa 
              ? 'border-green-500 shadow-lg shadow-green-500/20' 
              : 'border-transparent'
          }`}
        >
          {/* Header con badge activa */}
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold">{rutina.nombre}</h3>
            {rutina.activa && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                ACTIVA
              </span>
            )}
          </div>

          {/* Descripción */}
          {rutina.descripcion && (
            <p className="text-gray-400 text-sm mb-4">{rutina.descripcion}</p>
          )}

          {/* Info días */}
          <div className="mb-4">
            <p className="text-gray-400 text-sm">
              {rutina.dias.length} {rutina.dias.length === 1 ? 'día' : 'días'} de entrenamiento
            </p>
            {rutina.dias.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {rutina.dias.map(dia => (
                  <span 
                    key={dia.id} 
                    className="bg-gray-700 text-xs px-2 py-1 rounded"
                  >
                    {dia.nombre}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onVerDetalles(rutina)}
              className="flex-1 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Ver Detalles
            </button>
            
            {!rutina.activa && (
              <button
                onClick={() => onActivar(rutina.id)}
                className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Activar
              </button>
            )}
            
            <button
              onClick={() => onEditar(rutina)}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              ✏️
            </button>
            
            <button
              onClick={() => handleBorrar(rutina.id, rutina.nombre)}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}