import { useState } from 'react';
import { useTecnicas } from '../hooks/useTecnicas';
import type { CrearTecnicaDTO } from '../types';

export function TecnicasPage() {
  const { 
    tecnicasPredefinidas, 
    tecnicasPersonalizadas, 
    crear, 
    actualizar, 
    borrar,
    loading 
  } = useTecnicas();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [tecnicaEditando, setTecnicaEditando] = useState<any>(null);

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [icono, setIcono] = useState('💪');
  const [color, setColor] = useState('#6B7280');

  const resetFormulario = () => {
    setNombre('');
    setDescripcion('');
    setIcono('💪');
    setColor('#6B7280');
    setTecnicaEditando(null);
    setMostrarFormulario(false);
  };

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    try {
      const nuevaTecnica: CrearTecnicaDTO = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        esPredefinida: false,
        icono,
        color,
      };

      await crear(nuevaTecnica);
      alert('✅ Técnica creada');
      resetFormulario();
    } catch (error) {
      alert('❌ Error al crear técnica');
    }
  };

  const handleEditar = (tecnica: any) => {
    setTecnicaEditando(tecnica);
    setNombre(tecnica.nombre);
    setDescripcion(tecnica.descripcion);
    setIcono(tecnica.icono || '💪');
    setColor(tecnica.color || '#6B7280');
    setMostrarFormulario(true);
  };

  const handleActualizar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tecnicaEditando) return;

    try {
      await actualizar(tecnicaEditando.id, {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        icono,
        color,
      });
      alert('✅ Técnica actualizada');
      resetFormulario();
    } catch (error) {
      alert('❌ Error al actualizar técnica');
    }
  };

  const handleBorrar = async (id: string, nombre: string) => {
    if (!window.confirm(`¿Borrar técnica "${nombre}"?`)) return;

    try {
      await borrar(id);
      alert('✅ Técnica borrada');
    } catch (error) {
      alert('❌ Error al borrar técnica');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-center">Cargando técnicas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Técnicas de Entrenamiento</h1>

        {/* Botón crear */}
        {!mostrarFormulario && (
          <button
            onClick={() => setMostrarFormulario(true)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors mb-6"
          >
            + Crear Técnica Personalizada
          </button>
        )}

        {/* Formulario */}
        {mostrarFormulario && (
          <form 
            onSubmit={tecnicaEditando ? handleActualizar : handleCrear}
            className="bg-gray-800 p-6 rounded-lg mb-6 space-y-4"
          >
            <h3 className="text-xl font-bold">
              {tecnicaEditando ? 'Editar Técnica' : 'Nueva Técnica'}
            </h3>

            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium mb-2">Nombre *</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Series de calentamiento"
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium mb-2">Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Describe brevemente la técnica..."
                rows={3}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
              />
            </div>

            {/* Icono y Color */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Icono</label>
                <input
                  type="text"
                  value={icono}
                  onChange={(e) => setIcono(e.target.value)}
                  placeholder="💪"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg text-center text-2xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Color</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full bg-gray-700 h-11 rounded-lg"
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg"
              >
                {tecnicaEditando ? 'Actualizar' : 'Crear'}
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

        {/* Lista de técnicas */}
        <div className="space-y-6">
          {/* Predefinidas */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-400">
              Técnicas Predefinidas
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Estas técnicas no se pueden editar ni borrar
            </p>
            <div className="space-y-2">
              {tecnicasPredefinidas.map(tecnica => (
                <div
                  key={tecnica.id}
                  className="bg-gray-800 p-4 rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span 
                      className="text-2xl px-3 py-1 rounded"
                      style={{ backgroundColor: tecnica.color }}
                    >
                      {tecnica.icono}
                    </span>
                    <div>
                      <p className="font-medium">{tecnica.nombre}</p>
                      <p className="text-sm text-gray-400">{tecnica.descripcion}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Personalizadas */}
          {tecnicasPersonalizadas.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-blue-400">
                Tus Técnicas Personalizadas
              </h2>
              <div className="space-y-2">
                {tecnicasPersonalizadas.map(tecnica => (
                  <div
                    key={tecnica.id}
                    className="bg-gray-800 p-4 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span 
                        className="text-2xl px-3 py-1 rounded"
                        style={{ backgroundColor: tecnica.color }}
                      >
                        {tecnica.icono}
                      </span>
                      <div>
                        <p className="font-medium">{tecnica.nombre}</p>
                        <p className="text-sm text-gray-400">{tecnica.descripcion}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditar(tecnica)}
                        className="bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded text-sm"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleBorrar(tecnica.id, tecnica.nombre)}
                        className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded text-sm"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}