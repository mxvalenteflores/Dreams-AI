import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type Translations = Record<string, any>;

interface LocalizationContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string, replacements?: Record<string, string>) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

const CenteredMessage: React.FC<{ children: ReactNode }> = ({ children }) => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white', backgroundColor: '#111827', fontFamily: 'sans-serif' }}>
      {children}
    </div>
);

export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>('es');
  const [translations, setTranslations] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const [enRes, esRes] = await Promise.all([
          fetch('/locales/en.json'),
          fetch('/locales/es.json')
        ]);

        if (!enRes.ok || !esRes.ok) {
          throw new Error(`HTTP error! status: EN ${enRes.status}, ES ${esRes.status}`);
        }

        const en = await enRes.json();
        const es = await esRes.json();
        setTranslations({ en, es });
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
        console.error("Failed to load translation files:", errorMessage);
        setError(`Could not load language files. Please check the network connection and refresh the page. Details: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranslations();
  }, []);

  const t = (key: string, replacements: Record<string, string> = {}): string => {
    const langTranslations = translations?.[language] || translations?.en || {};
    
    const keys = key.split('.');
    let result = keys.reduce((acc, currentKey) => acc?.[currentKey], langTranslations);

    if (result === undefined) {
      const fallbackTranslations = translations?.en || {};
      result = keys.reduce((acc, currentKey) => acc?.[currentKey], fallbackTranslations);
    }
    
    if (result === undefined) {
      return key;
    }

    let finalString = String(result);

    Object.keys(replacements).forEach(placeholder => {
        finalString = finalString.replace(`{${placeholder}}`, replacements[placeholder]);
    });

    return finalString;
  };

  if (isLoading) {
    return <CenteredMessage><p>Loading languages...</p></CenteredMessage>;
  }

  if (error) {
    return <CenteredMessage><p style={{ color: '#ef4444', maxWidth: '80%', textAlign: 'center' }}>{error}</p></CenteredMessage>;
  }

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
