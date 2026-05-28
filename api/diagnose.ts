import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? '';
const MAX_PROMPT_LENGTH = 8_000;
const RATE_LIMIT = 10;
const WINDOW_MS = 60_000;

interface RateEntry { count: number; resetAt: number }
const rateStore = new Map<string, RateEntry>();

function getIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return req.socket?.remoteAddress ?? 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateStore.get(ip);
  if (!entry || now > entry.resetAt) {
    rateStore.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

const sanitizeJsonResponse = (text: string): string => {
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/, '')
      .replace(/\s*```$/, '');
  }
  return cleaned.trim();
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://organiz-ai.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  res.setHeader('Access-Control-Allow-Origin', 'https://organiz-ai.vercel.app');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (isRateLimited(getIp(req))) {
    res.setHeader('Retry-After', '60');
    return res.status(429).json({ error: 'Muitas requisições. Tente novamente em instantes.' });
  }

  if (!GEMINI_API_KEY)
    return res.status(500).json({ error: 'Serviço de IA não configurado.' });

  try {
    const body = req.body as { prompt?: unknown; raw?: unknown };

    if (typeof body.prompt !== 'string' || !body.prompt.trim())
      return res.status(400).json({ error: 'Campo "prompt" é obrigatório e deve ser texto.' });

    if (body.prompt.length > MAX_PROMPT_LENGTH)
      return res.status(400).json({ error: 'Prompt excede o tamanho máximo permitido.' });

    const ai = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(body.prompt);

    if (body.raw === true) {
      return res.status(200).json({ text: result.response.text() });
    }

    const parsed = JSON.parse(sanitizeJsonResponse(result.response.text()));
    return res.status(200).json(parsed);
  } catch (err) {
    console.error('[/api/diagnose]', err);
    return res.status(500).json({ error: 'Erro ao gerar diagnóstico. Tente novamente.' });
  }
}
