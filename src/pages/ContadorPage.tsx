import { useState } from 'react';

export function ContadorPage() {
  const [contador, setContador] = useState(0);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-8">{contador}</h1>
        
        <div className="flex gap-4">
          <button
            onClick={() => setContador(contador + 1)}
            className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-bold text-xl"
          >
            +1
          </button>
          
          <button
            onClick={() => setContador(contador - 1)}
            className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-lg font-bold text-xl"
          >
            -1
          </button>
          
          <button
            onClick={() => setContador(0)}
            className="bg-gray-500 hover:bg-gray-600 px-6 py-3 rounded-lg font-bold text-xl"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}