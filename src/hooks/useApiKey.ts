import { useCallback, useState } from 'react';

const STORAGE_KEY = 'organizai_gemini_api_key';

const getEnvKey = (): string =>
  (import.meta.env.VITE_GEMINI_API_KEY as string | undefined) ?? '';

export const useApiKey = () => {
  const [storedKey, setStoredKey] = useState<string>(() => {
    // Env var takes precedence; localStorage is the manual fallback
    const env = getEnvKey().trim();
    if (env) return env;
    return localStorage.getItem(STORAGE_KEY) ?? '';
  });

  const apiKey = storedKey.trim();
  const hasApiKey = apiKey.length > 0;

  const saveApiKey = useCallback((key: string) => {
    const trimmed = key.trim();
    localStorage.setItem(STORAGE_KEY, trimmed);
    setStoredKey(trimmed);
  }, []);

  const clearApiKey = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setStoredKey(getEnvKey().trim());
  }, []);

  return { apiKey, hasApiKey, saveApiKey, clearApiKey };
};
