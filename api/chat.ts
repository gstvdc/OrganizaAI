import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? '';
const MAX_MESSAGE_LENGTH = 2_000;
const MAX_HISTORY_TURNS = 20;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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

    const rawHistory = Array.isArray(body.history) ? body.history : [];
    const history = rawHistory
      .slice(-MAX_HISTORY_TURNS)
      .filter(
        (m): m is { role: 'user' | 'model'; text: string } =>
          typeof m === 'object' &&
          m !== null &&
          (m as { role?: unknown }).role === 'user' ||
          (typeof m === 'object' && m !== null && (m as { role?: unknown }).role === 'model'),
      )
      .map((m) => ({ role: m.role, parts: [{ text: String(m.text ?? '') }] }));

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
