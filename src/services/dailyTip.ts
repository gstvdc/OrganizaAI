const API_BASE = import.meta.env.DEV ? 'http://localhost:3000' : '';

const FALLBACK_TIPS = [
  'Separe ao menos 10% da sua renda antes de qualquer gasto — pague-se primeiro e invista no seu futuro.',
  'Revise suas assinaturas mensais hoje: cancele qualquer serviço que você não usou nos últimos 30 dias.',
  'Antes de uma compra impulsiva, espere 48 horas. Na maioria das vezes, o desejo passa.',
  'Anote todos os seus gastos por uma semana — a consciência sobre para onde vai o dinheiro é o primeiro passo para mudança.',
  'Uma reserva de emergência de 3 a 6 meses de despesas é o melhor seguro contra imprevistos financeiros.',
  'Priorize quitar dívidas com juros acima de 12% ao ano — são a maior ameaça ao seu patrimônio.',
  'Compare preços antes de comprar: ferramentas gratuitas online podem economizar dezenas de reais por semana.',
];

const CACHE_KEY = 'daily_tip';

const getTodayDate = (): string => new Date().toLocaleDateString('pt-BR');

export const clearDailyTipCache = (): void => {
  localStorage.removeItem(CACHE_KEY);
};

export const getDailyTip = async (profile: {
  name: string;
  mainGoal: string;
}): Promise<string> => {
  const today = getTodayDate();
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) ?? 'null') as {
      date: string;
      tip: string;
    } | null;
    if (cache?.date === today) return cache.tip;
  } catch {}

  const prompt = `Você é o OrganizAI. Gere UMA dica financeira prática e motivacional de no máximo 2 frases para ${profile.name}, objetivo: "${profile.mainGoal}". Retorne APENAS a dica, sem prefixos, sem aspas.`;

  const response = await fetch(`${API_BASE}/api/diagnose`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, raw: true }),
  });

  if (!response.ok) throw new Error('Falha ao buscar dica');
  const data = (await response.json()) as { text?: string };
  const tip = data.text ?? '';
  localStorage.setItem(CACHE_KEY, JSON.stringify({ date: today, tip }));
  return tip;
};

export const getFallbackTip = (): string => {
  return FALLBACK_TIPS[new Date().getDay() % FALLBACK_TIPS.length];
};
