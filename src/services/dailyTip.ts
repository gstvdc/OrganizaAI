import { GoogleGenerativeAI } from '@google/generative-ai';

interface DailyTipCache {
  date: string;
  tip: string;
}

const CACHE_KEY = 'daily_tip';

const FALLBACK_TIPS = [
  'Separe ao menos 10% da sua renda antes de qualquer gasto — pague-se primeiro e invista no seu futuro.',
  'Revise suas assinaturas mensais hoje: cancele qualquer serviço que você não usou nos últimos 30 dias.',
  'Antes de uma compra impulsiva, espere 48 horas. Na maioria das vezes, o desejo passa.',
  'Anote todos os seus gastos por uma semana — a consciência sobre para onde vai o dinheiro é o primeiro passo para mudança.',
  'Uma reserva de emergência de 3 a 6 meses de despesas é o melhor seguro contra imprevistos financeiros.',
  'Priorize quitar dívidas com juros acima de 12% ao ano — são a maior ameaça ao seu patrimônio.',
  'Compare preços antes de comprar: ferramentas gratuitas online podem economizar dezenas de reais por semana.',
];

const getTodayDate = (): string => new Date().toLocaleDateString('pt-BR');

const getCachedTip = (): string | null => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cache: DailyTipCache = JSON.parse(raw);
    return cache.date === getTodayDate() ? cache.tip : null;
  } catch {
    return null;
  }
};

const saveTipToCache = (tip: string): void => {
  localStorage.setItem(CACHE_KEY, JSON.stringify({ date: getTodayDate(), tip }));
};

export const clearDailyTipCache = (): void => {
  localStorage.removeItem(CACHE_KEY);
};

export const getDailyTip = async (profile: {
  name: string;
  mainGoal: string;
}): Promise<string> => {
  const cached = getCachedTip();
  if (cached) return cached;

  const apiKey =
    (import.meta.env.VITE_GEMINI_API_KEY as string | undefined)?.trim() ||
    localStorage.getItem('organizai_gemini_api_key')?.trim() ||
    '';
  const ai = new GoogleGenerativeAI(apiKey);
  const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const result = await model.generateContent(
    `Você é o OrganizAI. Gere UMA dica financeira prática e motivacional de no máximo 2 frases curtas para ${profile.name}, que tem como objetivo: "${profile.mainGoal}". Seja direto, encorajador e específico para esse objetivo. Retorne APENAS a dica, sem saudações, sem prefixos como "Dica:" e sem aspas.`,
  );

  const tip = result.response.text().trim();
  saveTipToCache(tip);
  return tip;
};

export const getFallbackTip = (): string => {
  const dayOfWeek = new Date().getDay();
  return FALLBACK_TIPS[dayOfWeek % FALLBACK_TIPS.length];
};
