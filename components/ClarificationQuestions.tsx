import React, { useState, useEffect } from 'react';
import { Question, Answers } from '../types';

interface ClarificationQuestionsProps {
  questions: Question[];
  onSubmit: (answers: Answers) => void;
  isLoading: boolean;
}

const ClarificationQuestions: React.FC<ClarificationQuestionsProps> = ({ questions, onSubmit, isLoading }) => {
  const [answers, setAnswers] = useState<Answers>({});

  useEffect(() => {
    const initialAnswers: Answers = {};
    questions.forEach(q => {
      initialAnswers[q.question] = [];
    });
    setAnswers(initialAnswers);
  }, [questions]);

  const handleCheckboxChange = (question: string, option: string) => {
    setAnswers(prev => {
      const currentAnswers = prev[question] || [];
      const newAnswers = currentAnswers.includes(option)
        ? currentAnswers.filter(a => a !== option)
        : [...currentAnswers, option];
      return { ...prev, [question]: newAnswers };
    });
  };

  const handleNoRecuerdoChange = (question: string, checked: boolean) => {
    setAnswers(prev => ({
      ...prev,
      [question]: checked ? null : [],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(answers);
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in-up">
      <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">Aclaremos Algunas Cosas</h2>
      <p className="text-gray-400 text-center mb-8">Tus respuestas ayudarán a crear una imagen más vívida de tu sueño.</p>
      <form onSubmit={handleSubmit} className="space-y-8">
        {questions.map((q, index) => (
          <div key={index} className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-lg">
            <p className="font-semibold text-lg text-purple-300 mb-4">{q.question}</p>
            <div className="space-y-3">
              {q.options.map((opt, optIndex) => (
                <label key={optIndex} className="flex items-center text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-600 bg-gray-800 text-purple-500 focus:ring-purple-600 cursor-pointer"
                    checked={answers[q.question]?.includes(opt) ?? false}
                    onChange={() => handleCheckboxChange(q.question, opt)}
                    disabled={isLoading || answers[q.question] === null}
                  />
                  <span className="ml-3">{opt}</span>
                </label>
              ))}
              <div className="border-t border-gray-700 my-3"></div>
              <label className="flex items-center text-gray-500 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-gray-600 bg-gray-800 text-purple-500 focus:ring-purple-600 cursor-pointer"
                  checked={answers[q.question] === null}
                  onChange={(e) => handleNoRecuerdoChange(q.question, e.target.checked)}
                  disabled={isLoading}
                />
                <span className="ml-3 italic">No recuerdo</span>
              </label>
            </div>
          </div>
        ))}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full font-bold text-lg text-white py-3 px-6 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg"
        >
          {isLoading ? 'Analizando...' : 'Tejer mi Sueño'}
        </button>
      </form>
    </div>
  );
};

export default ClarificationQuestions;
