import React, { useState } from 'react';

interface DreamInputFormProps {
  onSubmit: (description: string) => void;
  isLoading: boolean;
}

const DreamInputForm: React.FC<DreamInputFormProps> = ({ onSubmit, isLoading }) => {
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      onSubmit(description.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in-up">
      <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/10">
        <label htmlFor="dream-description" className="block text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
          Describe tu Sueño
        </label>
        <p className="text-gray-400 mb-6">Escribe todo lo que puedas recordar, sin importar lo fragmentado o extraño que parezca. Cuantos más detalles, mejor.</p>
        <textarea
          id="dream-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Estaba en un bosque de cristal, y la luna cantaba..."
          className="w-full h-48 p-4 bg-gray-900/50 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 resize-none placeholder-gray-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !description.trim()}
          className="mt-6 w-full font-bold text-lg text-white py-3 px-6 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg"
        >
          {isLoading ? 'Procesando...' : 'Revelar Perspectivas'}
        </button>
      </form>
    </div>
  );
};

export default DreamInputForm;
