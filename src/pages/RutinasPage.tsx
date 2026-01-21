import { useState } from 'react';
import { useRutinas } from '../hooks/useRutinas';
import { FormularioRutina } from '../components/rutinas/FormularioRutina';
import { ListaRutinas } from '../components/rutinas/ListaRutinas';
import { DetallesRutinaPage } from './DetallesRutinaPage';
import type { Rutina, CrearRutinaDTO } from '../types';

export function RutinasPage() {
  const { rutinas, loading, error, crear, actualizar, borrar, activar } = useRutinas();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [rutinaEditando, setRutinaEditando] = useState<Rutina | null>(null);
  const [rutinaViendoDetalles, setRutinaViendoDetalles] = useState<Rutina | null>(null);

  const handleGuardar = async (data: CrearRutinaDTO) => {
    if (rutinaEditando) {
      await actualizar(rutinaEditando.id, data);
      setRutinaEditando(null);
    } else {
      await crear(data);
    }
    setMostrarFormulario(false);
  };

  const handleEditar = (rutina: Rutina) => {
    setRutinaEditando(rutina);
    setMostrarFormulario(true);
  };

  const handleCancelar = () => {
    setMostrarFormulario(false);
    setRutinaEditando(null);
  };

  const handleBorrar = async (id: string) => {
    await borrar(id);
  };

  const handleActivar = async (id: string) => {
    await activar(id);
  };

  const handleVerDetalles = (rutina: Rutina) => {
    setRutinaViendoDetalles(rutina);
  };

  const handleVolverDeDetalles = () => {
    setRutinaViendoDetalles(null);
  };

  // Si está viendo detalles, mostrar esa página
  if (rutinaViendoDetalles) {
    return (
      <DetallesRutinaPage
        rutina={rutinaViendoDetalles}
        onVolver={handleVolverDeDetalles}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Cargando rutinas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">❌ {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">📋 Mis Rutinas</h1>
            <p className="text-gray-400">
              Crea y organiza tus rutinas de entrenamiento
            </p>
          </div>

          {!mostrarFormulario && (
            <button
              onClick={() => setMostrarFormulario(true)}
              className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              + Nueva Rutina
            </button>
          )}
        </div>

        {/* Formulario (si está abierto) */}
        {mostrarFormulario && (
          <div className="mb-8">
            <FormularioRutina
              onGuardar={handleGuardar}
              onCancelar={handleCancelar}
              rutinaInicial={rutinaEditando}
            />
          </div>
        )}

        {/* Lista de rutinas */}
        <ListaRutinas
          rutinas={rutinas}
          onEditar={handleEditar}
          onBorrar={handleBorrar}
          onActivar={handleActivar}
          onVerDetalles={handleVerDetalles}
        />
      </div>
    </div>
  );
}