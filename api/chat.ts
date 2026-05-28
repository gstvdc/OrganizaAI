import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? '';
const MAX_MESSAGE_LENGTH = 2_000;
const MAX_SYSTEM_PROMPT_LENGTH = 1_000;
const MAX_HISTORY_TURNS = 20;
const MAX_HISTORY_ITEM_LENGTH = 2_000;
const RATE_LIMIT = 20;
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
    const body = req.body as {
      history?: unknown;
      newMessage?: unknown;
      systemPrompt?: unknown;
    };

    if (typeof body.newMessage !== 'string' || !body.newMessage.trim())
      return res.status(400).json({ error: 'Campo "newMessage" é obrigatório.' });

    if (body.newMessage.length > MAX_MESSAGE_LENGTH)
      return res.status(400).json({ error: 'Mensagem excede o tamanho máximo permitido.' });

    if (typeof body.systemPrompt !== 'string' || !body.systemPrompt.trim())
      return res.status(400).json({ error: 'Campo "systemPrompt" é obrigatório.' });

    if (body.systemPrompt.length > MAX_SYSTEM_PROMPT_LENGTH)
      return res.status(400).json({ error: 'systemPrompt excede o tamanho máximo permitido.' });

    const rawHistory = Array.isArray(body.history) ? body.history : [];
    const history = rawHistory
      .slice(-MAX_HISTORY_TURNS)
      .filter(
        (m): m is { role: 'user' | 'model'; text: string } =>
          typeof m === 'object' &&
          m !== null &&
          ((m as { role?: unknown }).role === 'user' ||
            (m as { role?: unknown }).role === 'model'),
      )
      .map((m) => ({
        role: m.role,
        parts: [{ text: String(m.text ?? '').slice(0, MAX_HISTORY_ITEM_LENGTH) }],
      }));

    const ai = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = ai.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: body.systemPrompt,
    });

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(body.newMessage);
    return res.status(200).json({ text: result.response.text() });
  } catch (err) {
    console.error('[/api/chat]', err);
    return res.status(500).json({ error: 'Erro ao processar mensagem. Tente novamente.' });
  }
}
