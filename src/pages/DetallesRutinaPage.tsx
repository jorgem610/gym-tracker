import { useState, useEffect } from 'react';
import { useRutinas } from '../hooks/useRutinas';
import { obtenerEjercicios } from '../services/ejercicios.service';
import { FormularioDia } from '../components/rutinas/FormularioDia';
import { SelectorEjercicios } from '../components/rutinas/SelectorEjercicios';
import { DetalleDia } from '../components/rutinas/DetalleDia';
import { EditarEjercicio } from '../components/rutinas/EditarEjercicio';
import type { Rutina, DiaRutina, TipoDia, Ejercicio, EjercicioDia, ConfigSerie } from '../types';

interface DetallesRutinaPageProps {
  rutina: Rutina;
  onVolver: () => void;
}

export function DetallesRutinaPage({ rutina, onVolver }: DetallesRutinaPageProps) {
  const { actualizar } = useRutinas();
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [rutinaLocal, setRutinaLocal] = useState<Rutina>(rutina);
  
  const [mostrarFormularioDia, setMostrarFormularioDia] = useState(false);
  const [diaEditando, setDiaEditando] = useState<DiaRutina | null>(null);
  
  const [diaParaAñadirEjercicio, setDiaParaAñadirEjercicio] = useState<DiaRutina | null>(null);

  const [ejercicioEditando, setEjercicioEditando] = useState<{
  dia: DiaRutina;
  ejercicio: EjercicioDia;
  } | null>(null);

  // Cargar ejercicios al montar
  useEffect(() => {
    cargarEjercicios();
  }, []);

  const cargarEjercicios = async () => {
    try {
      const data = await obtenerEjercicios();
      setEjercicios(data);
    } catch (error) {
      console.error('Error al cargar ejercicios:', error);
    }
  };

  // DÍAS

  const handleAñadirDia = (nombre: string, tipo: TipoDia) => {
    const nuevoDia: DiaRutina = {
      id: `dia_${Date.now()}`,
      nombre,
      tipo,
      ejercicios: [],
    };

    const nuevaRutina = {
      ...rutinaLocal,
      dias: [...rutinaLocal.dias, nuevoDia],
    };

    setRutinaLocal(nuevaRutina);
    actualizar(rutina.id, { dias: nuevaRutina.dias });
    setMostrarFormularioDia(false);
  };

  const handleEditarDia = (dia: DiaRutina) => {
    setDiaEditando(dia);
    setMostrarFormularioDia(true);
  };

  const handleActualizarDia = (nombre: string, tipo: TipoDia) => {
    if (!diaEditando) return;

    const diasActualizados = rutinaLocal.dias.map(d =>
      d.id === diaEditando.id ? { ...d, nombre, tipo } : d
    );

    const nuevaRutina = { ...rutinaLocal, dias: diasActualizados };
    setRutinaLocal(nuevaRutina);
    actualizar(rutina.id, { dias: diasActualizados });
    
    setMostrarFormularioDia(false);
    setDiaEditando(null);
  };

  const handleBorrarDia = (diaId: string) => {
    const diasActualizados = rutinaLocal.dias.filter(d => d.id !== diaId);
    
    const nuevaRutina = { ...rutinaLocal, dias: diasActualizados };
    setRutinaLocal(nuevaRutina);
    actualizar(rutina.id, { dias: diasActualizados });
  };

  // EJERCICIOS

  const handleAñadirEjercicioADia = (dia: DiaRutina) => {
   
    setDiaParaAñadirEjercicio(dia);

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleSeleccionarEjercicio = (
  ejercicioId: string, 
  config: { seriesSimples?: number; seriesAvanzadas?: ConfigSerie[] }
  ) => {
    if (!diaParaAñadirEjercicio) return;

    const nuevoEjercicioDia: EjercicioDia = {
      ejercicioId,
      orden: diaParaAñadirEjercicio.ejercicios.length + 1,
      seriesSimples: config.seriesSimples,
      seriesAvanzadas: config.seriesAvanzadas,
    };

    const diasActualizados = rutinaLocal.dias.map(d =>
      d.id === diaParaAñadirEjercicio.id
        ? { ...d, ejercicios: [...d.ejercicios, nuevoEjercicioDia] }
        : d
    );

    const nuevaRutina = { ...rutinaLocal, dias: diasActualizados };
    setRutinaLocal(nuevaRutina);
    actualizar(rutina.id, { dias: diasActualizados });
    
    setDiaParaAñadirEjercicio(null);
  };

  const handleQuitarEjercicio = (diaId: string, ejercicioId: string) => {
    const diasActualizados = rutinaLocal.dias.map(d =>
      d.id === diaId
        ? { ...d, ejercicios: d.ejercicios.filter(e => e.ejercicioId !== ejercicioId) }
        : d
    );

    const nuevaRutina = { ...rutinaLocal, dias: diasActualizados };
    setRutinaLocal(nuevaRutina);
    actualizar(rutina.id, { dias: diasActualizados });
  };

  const handleMoverEjercicio = (diaId: string, fromIndex: number, toIndex: number) => {
    const diasActualizados = rutinaLocal.dias.map(d => {
      if (d.id !== diaId) return d;

      const nuevosEjercicios = [...d.ejercicios];
      const [ejercicioMovido] = nuevosEjercicios.splice(fromIndex, 1);
      nuevosEjercicios.splice(toIndex, 0, ejercicioMovido);

      return { ...d, ejercicios: nuevosEjercicios };
    });

    const nuevaRutina = { ...rutinaLocal, dias: diasActualizados };
    setRutinaLocal(nuevaRutina);
    actualizar(rutina.id, { dias: diasActualizados });
  };

  const handleEditarEjercicio = (dia: DiaRutina, ejercicioDia: EjercicioDia) => {
  setEjercicioEditando({ dia, ejercicio: ejercicioDia });
};

const handleGuardarEdicion = (ejercicioActualizado: EjercicioDia) => {
  if (!ejercicioEditando) return;

  const diasActualizados = rutinaLocal.dias.map(d => {
    if (d.id !== ejercicioEditando.dia.id) return d;

    const ejerciciosActualizados = d.ejercicios.map(e => 
      e.ejercicioId === ejercicioActualizado.ejercicioId ? ejercicioActualizado : e
    );

    return { ...d, ejercicios: ejerciciosActualizados };
  });

  const nuevaRutina = { ...rutinaLocal, dias: diasActualizados };
  setRutinaLocal(nuevaRutina);
  actualizar(rutina.id, { dias: diasActualizados });
  
  setEjercicioEditando(null);
};

  

  const handleCancelar = () => {
  setMostrarFormularioDia(false);
  setDiaEditando(null);
  setDiaParaAñadirEjercicio(null);
  setEjercicioEditando(null);  // ← AÑADIR ESTA LÍNEA
};

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onVolver}
            className="text-blue-400 hover:text-blue-300 mb-4 flex items-center gap-2"
          >
            ← Volver a rutinas
          </button>
          
          <h1 className="text-4xl font-bold mb-2">{rutinaLocal.nombre}</h1>
          {rutinaLocal.descripcion && (
            <p className="text-gray-400">{rutinaLocal.descripcion}</p>
          )}
        </div>

        {/* Botón añadir día */}
        {!mostrarFormularioDia && !diaParaAñadirEjercicio && (
          <button
            onClick={() => setMostrarFormularioDia(true)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors mb-6"
          >
            + Añadir Día
          </button>
        )}

        {/* Formulario día */}
        {mostrarFormularioDia && (
          <div className="mb-6">
            <FormularioDia
              onGuardar={diaEditando ? handleActualizarDia : handleAñadirDia}
              onCancelar={handleCancelar}
              diaInicial={diaEditando}
            />
          </div>
        )}

        {/* Selector de ejercicios */}
        {diaParaAñadirEjercicio && (
          <div className="mb-6">
            <SelectorEjercicios
              onSeleccionar={handleSeleccionarEjercicio}
              onCancelar={handleCancelar}
              ejerciciosExcluidos={diaParaAñadirEjercicio.ejercicios.map(e => e.ejercicioId)}
            />
          </div>
        )}

        {/* Lista de días */}
        <div className="space-y-4">
          {rutinaLocal.dias.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-xl mb-2">No hay días en esta rutina</p>
              <p className="text-sm">Añade tu primer día con el botón de arriba</p>
            </div>
          ) : (
            rutinaLocal.dias.map(dia => (
              <DetalleDia
                key={dia.id}
                dia={dia}
                ejercicios={ejercicios}
                onEditarDia={handleEditarDia}
                onBorrarDia={handleBorrarDia}
                onAñadirEjercicio={handleAñadirEjercicioADia}
                onQuitarEjercicio={handleQuitarEjercicio}
                onMoverEjercicio={handleMoverEjercicio}
                onEditarEjercicio={handleEditarEjercicio}
              />
            ))
          )}
        </div>
        {/* Modal editar ejercicio */}
        {ejercicioEditando && (
          <EditarEjercicio
            ejercicioDia={ejercicioEditando.ejercicio}
            ejercicio={ejercicios.find(e => e.id === ejercicioEditando.ejercicio.ejercicioId)!}
            onGuardar={handleGuardarEdicion}
            onCancelar={handleCancelar}
          />
        )}
      </div>
      
    </div>
  );
}