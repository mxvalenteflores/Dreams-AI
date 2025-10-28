import React, { useState, useCallback } from 'react';
import { Question, DreamAnalysis, Answers } from './types';
import * as geminiService from './services/geminiService';
import DreamInputForm from './components/DreamInputForm';
import ClarificationQuestions from './components/ClarificationQuestions';
import DreamResultDisplay from './components/DreamResultDisplay';
import Loader from './components/Loader';
import SparklesIcon from './components/icons/SparklesIcon';

type AppStep = 'input' | 'clarifying' | 'result';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('input');
  const [dreamDescription, setDreamDescription] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [analysis, setAnalysis] = useState<DreamAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  const handleDescriptionSubmit = useCallback(async (description: string) => {
    setLoadingMessage('Invocando preguntas desde el éter...');
    setError(null);
    try {
      const generatedQuestions = await geminiService.generateQuestions(description);
      setDreamDescription(description);
      if (generatedQuestions.length > 0) {
        setQuestions(generatedQuestions);
        setStep('clarifying');
      } else {
        // No questions, go straight to analysis
        setLoadingMessage('Tejiendo los hilos de tu sueño...');
        const result = await geminiService.analyzeDream(description, {});
        setAnalysis(result);
        setStep('result');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ocurrió un error desconocido.');
      setStep('input');
    } finally {
      setLoadingMessage('');
    }
  }, []);

  const handleAnswersSubmit = useCallback(async (answers: Answers) => {
    setLoadingMessage('Tejiendo los hilos de tu sueño...');
    setError(null);
    try {
      const result = await geminiService.analyzeDream(dreamDescription, answers);
      setAnalysis(result);
      setStep('result');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ocurrió un error desconocido.');
      setStep('input');
    } finally {
      setLoadingMessage('');
    }
  }, [dreamDescription]);

  const handleReset = () => {
    setStep('input');
    setDreamDescription('');
    setQuestions([]);
    setAnalysis(null);
    setError(null);
    setLoadingMessage('');
  };

  const renderContent = () => {
    if (loadingMessage) {
      return <Loader text={loadingMessage} />;
    }

    switch (step) {
      case 'input':
        return <DreamInputForm onSubmit={handleDescriptionSubmit} isLoading={!!loadingMessage} />;
      case 'clarifying':
        return <ClarificationQuestions questions={questions} onSubmit={handleAnswersSubmit} isLoading={!!loadingMessage} />;
      case 'result':
        return analysis ? <DreamResultDisplay analysis={analysis} onReset={handleReset} /> : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900/60 to-gray-900 text-white font-sans">
      <div className="relative isolate min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        {/* Background Glows */}
        <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/2 w-[40rem] h-[40rem] bg-purple-600/20 rounded-full blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/2 w-[40rem] h-[40rem] bg-pink-500/20 rounded-full blur-3xl" aria-hidden="true" />
        
        <header className="text-center mb-10 w-full max-w-3xl">
          <h1 className="flex items-center justify-center gap-4 text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            <SparklesIcon className="w-8 h-8 md:w-10 md:h-10" />
            Tejedor de Sueños IA
          </h1>
          <p className="mt-2 text-lg text-gray-400">Tu guía personal al reino del subconsciente.</p>
        </header>
        
        <main className="w-full flex-grow flex items-center justify-center">
          <div className="w-full">
            {error && !loadingMessage && (
              <div className="w-full max-w-2xl mx-auto text-center p-4 mb-4 bg-red-500/20 border border-red-500 rounded-lg">
                <p className="font-semibold">Ocurrió un error:</p>
                <p>{error}</p>
                <button onClick={handleReset} className="mt-2 text-sm font-bold underline">Intentar de Nuevo</button>
              </div>
            )}
            {renderContent()}
          </div>
        </main>

        <footer className="text-center text-gray-500 mt-10 text-sm">
          <p>{`© ${new Date().getFullYear()} Tejedor de Sueños IA. Las interpretaciones son para fines de entretenimiento.`}</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
