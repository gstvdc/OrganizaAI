# OrganizAI — Educação Financeira com IA Generativa

> **📌 LEIA ANTES DE COMEÇAR — INSTRUÇÕES PARA O CLAUDE DA IDE**
>
> Este arquivo é o roadmap completo do projeto OrganizAI. Ele está sendo passado para você (Claude Code / Claude na IDE) para que implemente as fases pendentes uma a uma.
>
> **Como trabalhar com este arquivo:**
>
> - As fases marcadas com `[x]` já estão implementadas — não mexa nelas
> - As fases marcadas com `[ ]` são o que você precisa implementar
> - Cada item descreve exatamente quais arquivos criar, quais modificar, e qual lógica aplicar
> - Implemente **um item por vez**, confirme que funciona, depois avance
> - Sempre respeite os padrões visuais e de código descritos na seção "Convenções" no final deste arquivo
> - Quando um item diz "INALTERADO", significa que o JSX/lógica original deve ser preservado sem alterações
> - O projeto usa **pnpm** como gerenciador de pacotes — use `pnpm add` em vez de `npm install`
>
> **Stack atual do projeto:**
> React 19 · TypeScript · Tailwind CSS v4 · Vite 8 · React Router DOM v7 · `@google/generative-ai`
>
> **Estrutura relevante:**
>
> ```
> /
> ├── api/                    ← Vercel Serverless Functions (criadas na Fase 5.5)
> ├── src/
> │   ├── components/         ← Componentes React reutilizáveis
> │   ├── hooks/              ← Custom hooks
> │   ├── pages/              ← Páginas (Result, History, Home, Simulation)
> │   ├── services/           ← gemini.ts (integração com IA)
> │   ├── types/index.ts      ← Interfaces TypeScript (SimulationDetails, DiagnosisResponse)
> │   └── utils/              ← formatters.ts, prompt.ts
> ├── .env.local              ← GEMINI_API_KEY (nunca commitar)
> └── vercel.json             ← Configuração de rewrites
> ```

---

## 🗺️ Mapa de Etapas do Projeto

---

### 🚀 Fase 1: Setup e Estrutura Inicial

- [x] **01. Criando o Projeto com React, TypeScript e IA Generativa**
- [x] **02. Preparando a Base do Projeto com React, TypeScript e GitHub**
- [x] **03. Configurando o Tailwind CSS e a Fonte Inter no Projeto**
- [x] **04. Configurando Temas Light e Dark com Design Tokens**
- [x] **05. Configurando as Rotas da Aplicação com React Router DOM**

---

### 🧩 Fase 2: Componentes de UI e Layout

- [x] **06. Como Criar um Botão Reutilizável no React**
- [x] **07. Criando o Header e o Layout Base da Aplicação**
- [x] **08. Theme Context, Dark Mode e Preferência do Usuário**

---

### 📝 Fase 3: Formulário de Simulação

- [x] **09. Criando a Página Inicial do Formulário de Simulação**
- [x] **10. Adicionando Progresso ao Formulário de Simulação**
- [x] **11. Criando o Card de Pergunta e o Input do Formulário**
- [x] **12. Criando a Interface Básica do FormStep**
- [x] **13. Implementando a Navegação entre as Etapas do Formulário**
- [x] **14. Criando Máscara Monetária para os Inputs do Formulário**
- [x] **15. Salvando os Dados da Simulação no LocalStorage**

---

### 📊 Fase 4: Resultados e Integração com IA (Gemini)

- [x] **16. Criando a Página de Resultado da Simulação**
- [x] **17. Recuperando Simulações pelo ID na Página de Resultado**
- [x] **18. Criando o Prompt Estruturado para o Educador Financeiro com IA**
- [x] **19. Configurando a API Key do Gemini no Projeto**
- [x] **20. Criando o Service de Integração com o Gemini**
- [x] **21. Evitando Chamadas Duplicadas e Salvando os Insights da IA**
- [x] **22. Tratando Loading e Erros nos Insights da IA**
- [x] **23. Exibindo os Insights da IA na Tela de Resultado**

---

### 💬 Fase 5: Histórico e Recursos Extras

- [x] **24. Histórico de Simulações e Chat com IA**

---

### ✅ Fase 5.5: Backend Proxy — Gemini sem API Key do Usuário (CONCLUÍDA)

**Objetivo desta fase:** o usuário abre o site e usa direto, sem configurar nada. A chave do Gemini fica guardada no servidor (Vercel) e nunca é exposta no browser. Isso é feito criando dois endpoints serverless na pasta `api/` que funcionam como proxy entre o frontend e a API do Google Gemini.

**Contexto importante:**

- O projeto já tem `@google/generative-ai` instalado — ele será usado dentro das functions (Node.js), não mais no browser
- O `src/services/gemini.ts` atual chama o Gemini diretamente do browser recebendo `apiKey` como parâmetro — isso será substituído por chamadas `fetch` para os endpoints `/api/diagnose` e `/api/chat`
- As funções exportadas de `gemini.ts` (`generateFinancialDiagnosis` e `sendChatMessage`) mantêm os mesmos nomes para minimizar mudanças no resto do código, mas perdem o parâmetro `apiKey`
- Em dev local, usar `vercel dev` (não `vite dev`) para que as functions rodem junto com o frontend

---

- [x] **25. Criar as Vercel Serverless Functions como Proxy do Gemini**

  **Dependência a instalar:** `pnpm add -D @vercel/node`

  **Arquivo a criar — `api/diagnose.ts`** (na raiz do projeto, não dentro de `src/`):

  ````ts
  import type { VercelRequest, VercelResponse } from '@vercel/node';
  import { GoogleGenerativeAI } from '@google/generative-ai';

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? '';

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

  export default async function handler(
    req: VercelRequest,
    res: VercelResponse,
  ) {
    if (req.method !== 'POST')
      return res.status(405).json({ error: 'Method not allowed' });
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (!GEMINI_API_KEY)
      return res.status(500).json({ error: 'Serviço de IA não configurado.' });
    try {
      const { prompt } = req.body as { prompt: string };
      if (!prompt)
        return res.status(400).json({ error: 'Campo "prompt" é obrigatório.' });
      const ai = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const result = await model.generateContent(prompt);
      const parsed = JSON.parse(sanitizeJsonResponse(result.response.text()));
      return res.status(200).json(parsed);
    } catch (err) {
      console.error('[/api/diagnose]', err);
      return res
        .status(500)
        .json({ error: 'Erro ao gerar diagnóstico. Tente novamente.' });
    }
  }
  ````

  **Arquivo a criar — `api/chat.ts`** (na raiz do projeto):

  ```ts
  import type { VercelRequest, VercelResponse } from '@vercel/node';
  import { GoogleGenerativeAI } from '@google/generative-ai';

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? '';

  export default async function handler(
    req: VercelRequest,
    res: VercelResponse,
  ) {
    if (req.method !== 'POST')
      return res.status(405).json({ error: 'Method not allowed' });
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (!GEMINI_API_KEY)
      return res.status(500).json({ error: 'Serviço de IA não configurado.' });
    try {
      const { history, newMessage, systemPrompt } = req.body as {
        history: { role: 'user' | 'model'; text: string }[];
        newMessage: string;
        systemPrompt: string;
      };
      if (!newMessage || !systemPrompt)
        return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
      const ai = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = ai.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction: systemPrompt,
      });
      const chat = model.startChat({
        history: (history ?? []).map((m) => ({
          role: m.role,
          parts: [{ text: m.text }],
        })),
      });
      const result = await chat.sendMessage(newMessage);
      return res.status(200).json({ text: result.response.text() });
    } catch (err) {
      console.error('[/api/chat]', err);
      return res
        .status(500)
        .json({ error: 'Erro ao processar mensagem. Tente novamente.' });
    }
  }
  ```

  **Arquivo a criar — `vercel.json`** (na raiz do projeto):

  ```json
  {
    "rewrites": [{ "source": "/api/(.*)", "destination": "/api/$1" }]
  }
  ```

---

- [x] **26. Reescrever `src/services/gemini.ts` para Chamar o Proxy**

  O arquivo deixa de importar ou instanciar `GoogleGenerativeAI` — isso agora é responsabilidade das functions. Ele passa a usar `fetch` para os endpoints `/api/diagnose` e `/api/chat`.

  A constante `API_BASE` garante que em dev local (`vercel dev`) as chamadas vão para `http://localhost:3000`, e em produção vão para `/api/...` do mesmo domínio (sem CORS).

  **Substituir `src/services/gemini.ts` inteiro por:**

  ```ts
  import type { SimulationDetails, DiagnosisResponse } from '../types';
  import { buildFinancialPrompt } from '../utils/prompt';
  import { formatCurrency } from '../utils/formatters';

  export type { SimulationDetails, DiagnosisResponse };

  const API_BASE = import.meta.env.DEV ? 'http://localhost:3000' : '';

  export const generateFinancialDiagnosis = async (
    simulationData: SimulationDetails,
  ): Promise<DiagnosisResponse> => {
    const response = await fetch(`${API_BASE}/api/diagnose`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: buildFinancialPrompt(simulationData) }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(
        (err as { error?: string }).error ?? `Erro ${response.status}`,
      );
    }
    const data = (await response.json()) as Partial<DiagnosisResponse>;
    return {
      diagnosticoGeral: data.diagnosticoGeral ?? '',
      pontosFortes: data.pontosFortes ?? [],
      oportunidadesMelhoria: data.oportunidadesMelhoria ?? [],
      planoAcao: data.planoAcao ?? [],
      saudeFinanceiraScore:
        typeof data.saudeFinanceiraScore === 'number'
          ? data.saudeFinanceiraScore
          : 70,
    };
  };

  const buildChatSystemPrompt = (
    simulation: SimulationDetails,
    diagnosis: DiagnosisResponse,
  ): string => {
    const { profile, finances } = simulation;
    return `Você é o OrganizAI, assistente de educação financeira pessoal de ${profile.name}.
  Renda mensal: ${formatCurrency(finances.income.total)} | Despesas: ${formatCurrency(finances.totalExpenses)} | Saldo: ${formatCurrency(finances.netBalance)}
  Objetivo: ${profile.mainGoal} | Score: ${diagnosis.saudeFinanceiraScore}/100
  Dívidas: ${formatCurrency(finances.savingsAndDebts.currentDebts)} | Reservas: ${formatCurrency(finances.savingsAndDebts.amountSaved)}
  Diagnóstico: "${diagnosis.diagnosticoGeral.substring(0, 300)}..."
  Responda de forma empática, didática, referenciando os dados reais. Máximo 3 parágrafos.`;
  };

  export const sendChatMessage = async (
    history: { role: 'user' | 'model'; text: string }[],
    newMessage: string,
    simulation: SimulationDetails,
    diagnosis: DiagnosisResponse,
  ): Promise<string> => {
    const response = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        history,
        newMessage,
        systemPrompt: buildChatSystemPrompt(simulation, diagnosis),
      }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(
        (err as { error?: string }).error ?? `Erro ${response.status}`,
      );
    }
    const data = (await response.json()) as { text: string };
    return data.text;
  };
  ```

---

- [x] **27. Atualizar `src/pages/Result.tsx` — Remover Gate de API Key**

  Fazer apenas as seguintes mudanças cirúrgicas no `Result.tsx` existente (não reescrever o arquivo todo — preservar todo o JSX de cards financeiros, score, pontos fortes, etc.):

  **Remover imports:**

  ```tsx
  // DELETAR estas duas linhas:
  import { ApiKeySetup } from '../components/ApiKeySetup';
  import { useApiKey } from '../hooks/useApiKey';
  ```

  **Remover dentro do componente:**

  ```tsx
  // DELETAR:
  const { apiKey, hasApiKey, saveApiKey } = useApiKey();
  // DELETAR a função handleKeySave inteira
  ```

  **Simplificar `fetchDiagnosis`** — remover o parâmetro `key: string` e atualizar a chamada e a mensagem de erro:

  ```tsx
  const fetchDiagnosis = async (simData: SimulationDetails) => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateFinancialDiagnosis(simData); // sem "key"
      setDiagnosis(result);
      localStorage.setItem(`diagnosis_${simData.id}`, JSON.stringify(result));
    } catch (err) {
      console.error(err);
      setError(
        'Não foi possível gerar a análise. Tente novamente em instantes.',
      );
    } finally {
      setLoading(false);
    }
  };
  ```

  **Simplificar `useEffect`:**

  ```tsx
  // DE:
  useEffect(() => {
    if (simulation && hasApiKey && !diagnosis) {
      fetchDiagnosis(simulation, apiKey);
    }
  }, [simulation, hasApiKey, diagnosis, apiKey]);

  // PARA:
  useEffect(() => {
    if (simulation && !diagnosis) {
      fetchDiagnosis(simulation);
    }
  }, [simulation, diagnosis]);
  ```

  **No JSX, remover o bloco `ApiKeySetup` inteiro:**

  ```tsx
  // DELETAR este bloco:
  {
    !hasApiKey && !diagnosis && (
      <ApiKeySetup onSave={handleKeySave} error={error} />
    );
  }
  ```

  **Substituir o bloco de erro que continha `<ApiKeySetup onSave={handleKeySave} />`** por um botão simples de retry:

  ```tsx
  {error && hasApiKey && !loading && (
    // TROCAR o conteúdo por:
  )}
  // →
  {error && !loading && (
    <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6">
      <p className="mb-4 text-sm text-rose-400">{error}</p>
      <Button variant="outline" size="sm" onClick={() => fetchDiagnosis(simulation)}>
        Tentar novamente
      </Button>
    </div>
  )}
  ```

---

- [x] **28. Atualizar `src/components/AiChat.tsx` — Remover Gate de API Key**

  Fazer apenas as seguintes mudanças no `AiChat.tsx` existente:

  **Remover imports:**

  ```tsx
  // DELETAR:
  import { useApiKey } from '../hooks/useApiKey';
  import { IconLock } from './icons'; // remover só se não for usado em outro lugar do componente
  ```

  **Remover dentro do componente:**

  ```tsx
  // DELETAR:
  const { apiKey, hasApiKey } = useApiKey();
  ```

  **Simplificar a chamada de `sendChatMessage`** — remover o argumento `apiKey`:

  ```tsx
  // DE:
  const response = await sendChatMessage(
    messages,
    trimmed,
    simulation,
    diagnosis,
    apiKey,
  );
  // PARA:
  const response = await sendChatMessage(
    messages,
    trimmed,
    simulation,
    diagnosis,
  );
  ```

  **Remover o bloco de "Chat indisponível" inteiro:**

  ```tsx
  // DELETAR este bloco completo:
  if (!hasApiKey) {
    return (
      <div className="glass-panel rounded-3xl p-8 ...">
        ...Chat indisponível...
      </div>
    );
  }
  ```

---

- [x] **29. Configurar `.env.local` e Atualizar `.env.example`**

  **`.env.local`** (criar se não existir — nunca commitar):

  ```
  GEMINI_API_KEY=AIza...sua_chave_do_google_ai_studio
  ```

  **`.env.example`** (atualizar comentário):

  ```
  # Gemini API Key — obtenha gratuitamente em https://aistudio.google.com/app/apikey
  # Em desenvolvimento: copie para .env.local e preencha
  # Em produção (Vercel): configure GEMINI_API_KEY no painel de Environment Variables
  # O usuário final do site não precisa configurar nada
  GEMINI_API_KEY=
  ```

  **Para rodar localmente após esta fase:**

  ```bash
  pnpm add -g vercel   # instalar CLI da Vercel (uma vez)
  vercel dev           # sobe frontend + functions juntos na porta 3000
  ```

  O `pnpm dev` (Vite puro) não executa as functions — usar sempre `vercel dev` para testar.

  **Para publicar:**
  1. `vercel` na raiz do projeto (ou conectar o repositório no painel vercel.com)
  2. No painel da Vercel → Settings → Environment Variables → adicionar `GEMINI_API_KEY` com o valor da chave
  3. Fazer redeploy — o site fica público, gratuito, sem pedir nada ao usuário

---

### ✅ Fase 6: Engajamento e Acompanhamento do Usuário

> **Pré-requisito:** ✅ Fase 5.5 concluída. O Gemini está funcionando via Vercel Functions com a chave configurada na Vercel. Pode iniciar esta fase diretamente.

---

- [ ] **30. Checklist Interativa do Plano de Ação**

  **Objetivo:** Converter os itens do `planoAcao[]` retornados pelo Gemini em checkboxes interativos na página de Resultado, com progresso salvo no localStorage por simulação.

  **Contexto:**
  - `diagnosis.planoAcao` é `{ titulo: string, descricao: string }[]`
  - O widget decorativo `ChecklistWidgetContent` na `Home.tsx` já mostra visualmente o conceito — a implementação real é a concretização desse mockup
  - Chave de localStorage: `checklist_{simulationId}` → `{ [stepIndex: number]: boolean }`

  **Arquivo a criar — `src/hooks/useChecklist.ts`:**

  ```ts
  import { useState, useCallback } from 'react';

  export type ChecklistState = Record<number, boolean>;

  function load(id: string): ChecklistState {
    try {
      return JSON.parse(localStorage.getItem(`checklist_${id}`) ?? '{}');
    } catch {
      return {};
    }
  }

  function save(id: string, state: ChecklistState) {
    try {
      localStorage.setItem(`checklist_${id}`, JSON.stringify(state));
    } catch {}
  }

  export function useChecklist(simulationId: string, totalSteps: number) {
    const [checked, setChecked] = useState<ChecklistState>(() =>
      load(simulationId),
    );
    const toggle = useCallback(
      (index: number) => {
        setChecked((prev) => {
          const next = { ...prev, [index]: !prev[index] };
          save(simulationId, next);
          return next;
        });
      },
      [simulationId],
    );
    const completedCount = Object.values(checked).filter(Boolean).length;
    const progressPercent =
      totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;
    const isAllDone = completedCount === totalSteps && totalSteps > 0;
    return { checked, toggle, completedCount, progressPercent, isAllDone };
  }

  export function getChecklistProgress(
    simulationId: string,
    totalSteps: number,
  ) {
    const state = load(simulationId);
    const completedCount = Object.values(state).filter(Boolean).length;
    return {
      completedCount,
      progressPercent:
        totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0,
    };
  }
  ```

  **Arquivo a criar — `src/components/ActionPlanChecklist.tsx`:**
  - Recebe props: `simulationId: string` e `steps: { titulo: string, descricao: string }[]`
  - Usa `useChecklist(simulationId, steps.length)`
  - Barra de progresso no topo com `transition-all duration-500` e cores: `bg-violet-500` (0–29%) → `bg-amber-500` (30–59%) → `bg-lime-500` (60–99%) → `bg-accent-lime` (100%)
  - Cada item é um `<button>` com `onClick={() => toggle(idx)}`
  - Item não concluído: número em círculo `border-2 border-white/20` + título `text-white` + descrição `text-slate-400`
  - Item concluído: ícone de check em círculo `bg-accent-lime` + título `text-accent-lime line-through` + descrição `text-slate-500 line-through`
  - Quando `isAllDone`: exibir mensagem `"🎉 Parabéns! Você concluiu todas as ações do seu plano financeiro."` em card `border-accent-lime/20 bg-accent-lime/5`
  - Container: `className="rounded-3xl border border-white/5 bg-white/[0.01] p-6 shadow-2xl"`

  **Arquivo a criar — `src/components/ChecklistProgressBadge.tsx`:**
  - Recebe props: `simulationId: string` e `totalSteps: number`
  - Chama `getChecklistProgress()` diretamente (sem hook de estado)
  - Se `totalSteps === 0`: retornar `null`
  - Se `completedCount === 0`: texto "Plano de ação não iniciado" em `text-slate-500`
  - Se parcial: texto "X/N ações concluídas" em `text-slate-400` + mini barra colorida
  - Se 100%: texto "✓ Plano concluído" em `text-accent-lime` + barra cheia

  **Modificar `src/pages/Result.tsx`:**
  - Importar `ActionPlanChecklist`
  - Substituir o bloco `{diagnosis.planoAcao.length > 0 && (<div className="rounded-3xl ..."><h4>Seu Plano de Ação...</h4><div className="relative space-y-6 before:absolute...">...</div></div>)}` por:
    ```tsx
    {
      diagnosis.planoAcao.length > 0 && (
        <ActionPlanChecklist
          simulationId={simulation.id}
          steps={diagnosis.planoAcao}
        />
      );
    }
    ```

  **Modificar `src/pages/History.tsx`:**
  - Adicionar helper junto ao `loadCachedScore` existente:
    ```ts
    function loadCachedDiagnosis(id: string) {
      try {
        const r = localStorage.getItem(`diagnosis_${id}`);
        return r ? JSON.parse(r) : null;
      } catch {
        return null;
      }
    }
    ```
  - Importar `ChecklistProgressBadge`
  - Dentro do `.map()` dos cards, após o `ScoreBadge`, adicionar:
    ```tsx
    {
      (() => {
        const total = loadCachedDiagnosis(sim.id)?.planoAcao?.length ?? 0;
        return total > 0 ? (
          <div className="mt-3">
            <ChecklistProgressBadge simulationId={sim.id} totalSteps={total} />
          </div>
        ) : null;
      })();
    }
    ```

---

- [ ] **31. Gráfico de Evolução do Score de Saúde Financeira**

  **Objetivo:** Seção no Histórico mostrando a evolução do `saudeFinanceiraScore` ao longo das simulações.

  **Dependência:** `pnpm add recharts`

  **Contexto:**
  - `loadCachedScore(id)` já existe em `History.tsx` e retorna `number | null`
  - `loadSimulations()` retorna em ordem decrescente — inverter para o gráfico
  - `sim.date` é string `dd/mm/yyyy`

  **Arquivo a criar — `src/components/ScoreEvolutionChart.tsx`:**
  - Recebe `simulations: StoredSimulation[]` (ordem cronológica: mais antiga primeiro)
  - Constrói `data = simulations.map(s => ({ date: s.date, score: loadCachedScore(s.id) })).filter(d => d.score !== null)`
  - Se `data.length < 2`: card com texto "Faça pelo menos 2 simulações com diagnóstico para ver a evolução do seu score"
  - Se `data.length >= 2`: `<ResponsiveContainer width="100%" height={220}>` com `<LineChart>`:
    - `<CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />`
    - `<XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />`
    - `<YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />`
    - `<Tooltip contentStyle={{ background: '#030014', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />`
    - `<Line type="monotone" dataKey="score" stroke="#c5ff22" strokeWidth={2} dot={{ fill: '#c5ff22', r: 4 }} activeDot={{ r: 6 }} />`
  - Container: `className="glass-panel rounded-3xl p-6 shadow-2xl"` com título e subtítulo

  **Modificar `src/pages/History.tsx`:**
  - Importar `ScoreEvolutionChart`
  - Adicionar logo abaixo do header (antes da lista de cards), quando `simulations.length >= 1`:
    ```tsx
    <div className="mb-8">
      <ScoreEvolutionChart simulations={[...simulations].reverse()} />
    </div>
    ```

---

- [ ] **32. Renderização de Markdown no Diagnóstico Geral**

  **Objetivo:** Renderizar corretamente o Markdown que o Gemini retorna em `diagnosticoGeral` (negrito, listas, quebras de linha).

  **Dependência:** `pnpm add react-markdown`

  **Modificar `src/pages/Result.tsx`:**
  - Adicionar `import ReactMarkdown from 'react-markdown'`
  - Localizar o `<p className="... whitespace-pre-line">{diagnosis.diagnosticoGeral}</p>` e substituir por:
    ```tsx
    <ReactMarkdown
      components={{
        p: ({ children }) => (
          <p className="mb-3 text-sm leading-relaxed text-slate-300 last:mb-0">
            {children}
          </p>
        ),
        strong: ({ children }) => (
          <strong className="font-bold text-white">{children}</strong>
        ),
        ul: ({ children }) => (
          <ul className="mt-2 list-inside list-disc space-y-1 text-slate-400">
            {children}
          </ul>
        ),
        li: ({ children }) => (
          <li className="text-sm leading-relaxed">{children}</li>
        ),
      }}
    >
      {diagnosis.diagnosticoGeral}
    </ReactMarkdown>
    ```

---

- [ ] **33. Comparação Lado a Lado de Duas Simulações**

  **Objetivo:** Página `/comparar` onde o usuário seleciona duas simulações e vê um diff visual.

  **Arquivo a criar — `src/pages/Compare.tsx`:**
  - Ler query string `?a={id}` com `useSearchParams()` para pré-selecionar simulação A
  - Dois `<select className="glass-input">` populados com `JSON.parse(localStorage.getItem('simulations') || '[]')`, label: `"${sim.profile.name} — ${sim.date}"`
  - Ao selecionar ambas, exibir `grid grid-cols-2 gap-4` com card de cada simulação: nome, data, `ScoreBadge`
  - Tabela de comparação com linhas: Renda Total, Despesas Fixas, Despesas Variáveis, Saldo Líquido, Dívidas, Reservas
  - Lógica de destaque: para Renda/Saldo/Reservas → maior é melhor (`text-accent-lime font-bold`); para Despesas/Dívidas → menor é melhor; perdedor em `text-rose-400`
  - Usar `formatCurrency` de `../utils/formatters`

  **Modificar `src/App.tsx`:**

  ```tsx
  import { Compare } from './pages/Compare';
  // em <Routes>:
  <Route path="/comparar" element={<Compare />} />;
  ```

  **Modificar `src/components/Header.tsx`:**
  - Adicionar no array `NAV_LINKS`, condicionalmente:
    ```tsx
    const [hasEnough] = useState(
      () => JSON.parse(localStorage.getItem('simulations') || '[]').length >= 2,
    );
    // incluir { to: '/comparar', label: 'Comparar', exact: false } apenas se hasEnough
    ```

  **Modificar `src/pages/History.tsx`:**
  - Adicionar botão "Comparar" em cada card: `navigate(\`/comparar?a=${sim.id}\`)`

---

- [ ] **34. Editar Simulação Existente**

  **Objetivo:** Reabrir uma simulação salva, editar os valores e gerar novo diagnóstico sem preencher tudo do zero.

  **Modificar `src/hooks/useForm.ts`:**
  - Adicionar parâmetro opcional `preloadData?: Partial<SimulationData>` em `useForm`
  - Inicializar estado com `{ ...initialData, ...preloadData }`

  **Modificar `src/pages/Simulation.tsx`:**
  - Adicionar `const [searchParams] = useSearchParams(); const editId = searchParams.get('edit');`
  - Se `editId` existir: carregar `simulation_{editId}` do localStorage, converter campos numéricos para formato de moeda com `formatCurrency(String(valor))`, passar como `preloadData` para `useForm`
  - Exibir banner quando `editId` não for null:
    ```tsx
    <div className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-400">
      ✏️ Editando simulação de {originalDate} — um novo registro será criado ao
      finalizar
    </div>
    ```

  **Modificar `src/pages/History.tsx`:**
  - Botão "Editar" em cada card: `navigate(\`/simulacao?edit=${sim.id}\`)`

---

### 🚀 Fase 7: Produto, Distribuição e Experiência Avançada

> **Pré-requisito:** ✅ Fase 5.5 concluída. Fase 6 deve estar completa antes de iniciar esta fase.

---

- [ ] **35. Dicas Financeiras Diárias com Gemini**

  **Objetivo:** Card na Home com dica financeira gerada automaticamente pelo Gemini, baseada no perfil da última simulação. Cache de 1 dia no localStorage.

  **Arquivo a criar — `src/services/dailyTip.ts`:**

  ```ts
  const API_BASE = import.meta.env.DEV ? 'http://localhost:3000' : '';

  export async function getDailyTip(profile: {
    name: string;
    mainGoal: string;
  }): Promise<string> {
    const today = new Date().toLocaleDateString('pt-BR');
    try {
      const cache = JSON.parse(localStorage.getItem('daily_tip') ?? 'null');
      if (cache?.date === today) return cache.tip as string;
    } catch {}

    const prompt = `Você é o OrganizAI. Gere UMA dica financeira prática e motivacional de no máximo 2 frases para ${profile.name}, objetivo: "${profile.mainGoal}". Retorne APENAS a dica, sem prefixos, sem aspas.`;
    const response = await fetch(`${API_BASE}/api/diagnose`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, raw: true }), // "raw: true" sinaliza que não é JSON estruturado
    });
    // Nota: a function /api/diagnose precisará tratar "raw: true" retornando o texto puro em vez de JSON.parse
    // Ver ajuste necessário na function abaixo.
    const data = (await response.json()) as { text?: string };
    const tip = data.text ?? '';
    localStorage.setItem('daily_tip', JSON.stringify({ date: today, tip }));
    return tip;
  }
  ```

  **Ajuste em `api/diagnose.ts`** para suportar resposta em texto puro (quando `raw: true`):

  ```ts
  // No handler, após gerar o responseText:
  if (req.body.raw) {
    return res.status(200).json({ text: result.response.text() });
  }
  // caso contrário, continua o fluxo de JSON.parse existente
  ```

  **Arquivo a criar — `src/components/DailyTip.tsx`:**
  - Sem props — carrega internamente o perfil da última simulação
  - `useEffect`: verifica `localStorage.getItem('simulations')`, carrega última simulação, chama `getDailyTip()`
  - Se não houver simulações: `return null`
  - Loading: dois divs `h-3 rounded bg-white/5 animate-pulse`
  - Container: `glass-panel rounded-3xl p-5 border border-white/5` com ícone de lâmpada, título "Dica do dia", dica em `text-sm text-slate-300`, botão "↻ Nova dica" que limpa `localStorage.removeItem('daily_tip')` e força nova chamada

  **Modificar `src/pages/Home.tsx`:**

  ```tsx
  {
    localStorage.getItem('simulations') && (
      <div className="mt-12">
        <DailyTip />
      </div>
    );
  }
  ```

  Adicionar entre a hero section e o bloco de tech stack.

---

- [ ] **36. Exportar Diagnóstico como PDF**

  **Objetivo:** Botão "Exportar PDF" na página de Resultado que gera PDF com o diagnóstico completo (texto selecionável, não screenshot).

  **Dependência:** `pnpm add jspdf`

  **Arquivo a criar — `src/utils/exportPdf.ts`:**
  - Função `exportDiagnosisPdf(simulation: SimulationDetails, diagnosis: DiagnosisResponse): Promise<void>`
  - Usar `jspdf` programaticamente com `doc.setFont`, `doc.setFontSize`, `doc.text`, `doc.line`, `doc.rect`
  - Estrutura do PDF:
    1. Cabeçalho: "OrganizAI." bold + "Relatório de Diagnóstico Financeiro" + data
    2. Linha separadora `doc.line()`
    3. Perfil: nome, idade, ocupação, objetivo
    4. Score: "Saúde Financeira: XX/100" + barra desenhada com dois `doc.rect()` (fundo + preenchimento proporcional)
    5. Diagnóstico geral: `doc.splitTextToSize(texto, 170)` para quebrar linhas
    6. Pontos fortes: lista com "✓ " prefixando cada item
    7. Oportunidades: lista com "→ " prefixando cada item
    8. Plano de ação: numerado, título bold + descrição normal
    9. Rodapé: "Gerado por OrganizAI"
  - Cores (RGB para impressão — não usar #c5ff22):
    - Texto principal: `[30, 30, 46]`
    - Títulos de seção: `[79, 70, 229]`
    - Texto secundário: `[71, 85, 105]`
  - `doc.save(\`organizai-${simulation.profile.name.replace(/\s+/g, '-')}-${simulation.date.replace(/\//g, '-')}.pdf\`)`

  **Modificar `src/pages/Result.tsx`:**
  - Adicionar `const [isExporting, setIsExporting] = useState(false)` e import de `exportDiagnosisPdf`
  - No footer de ações, antes dos botões existentes, adicionar quando `diagnosis && !loading`:
    ```tsx
    <Button
      variant="outline"
      isLoading={isExporting}
      onClick={async () => {
        setIsExporting(true);
        await exportDiagnosisPdf(simulation, diagnosis);
        setIsExporting(false);
      }}
      className="gap-2"
    >
      {/* SVG de download inline */}
      Exportar PDF
    </Button>
    ```

---

- [ ] **37. PWA — Instalação como App**

  **Objetivo:** Tornar o OrganizAI instalável no celular/desktop como PWA.

  **Dependência:** `pnpm add -D vite-plugin-pwa`

  **Arquivo a criar — `public/manifest.json`:**

  ```json
  {
    "name": "OrganizAI",
    "short_name": "OrganizAI",
    "description": "Educação financeira com IA Generativa",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#030014",
    "theme_color": "#c5ff22",
    "icons": [
      { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
      {
        "src": "/icon-512.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "any maskable"
      }
    ]
  }
  ```

  Criar `public/icon-192.png` e `public/icon-512.png` — ícones com letras "OA" em `#c5ff22` sobre fundo `#030014` (usar https://favicon.io ou similar).

  **Modificar `vite.config.ts`:**

  ```ts
  import { VitePWA } from 'vite-plugin-pwa';
  // em plugins[]:
  VitePWA({
    registerType: 'autoUpdate',
    manifest: false,
    workbox: { globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'] },
  });
  ```

  **Modificar `index.html`** — adicionar em `<head>`:

  ```html
  <link rel="manifest" href="/manifest.json" />
  <meta name="theme-color" content="#c5ff22" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta
    name="apple-mobile-web-app-status-bar-style"
    content="black-translucent"
  />
  <link rel="apple-touch-icon" href="/icon-192.png" />
  ```

---

## 🛠️ Tecnologias do Projeto

| Tecnologia              | Versão | Uso                              |
| ----------------------- | ------ | -------------------------------- |
| React                   | 19     | UI                               |
| TypeScript              | ~6.0   | Tipagem                          |
| Tailwind CSS            | v4     | Estilização                      |
| Vite                    | 8      | Bundler                          |
| React Router DOM        | v7     | Roteamento                       |
| `@google/generative-ai` | ^0.24  | SDK Gemini (usado nas functions) |
| Vercel Functions        | —      | Proxy serverless para o Gemini   |

---

## 📦 Dependências a Instalar por Fase

| Fase | Pacote          | Comando                       |
| ---- | --------------- | ----------------------------- |
| 5.5  | @vercel/node    | `pnpm add -D @vercel/node`    |
| 31   | recharts        | `pnpm add recharts`           |
| 32   | react-markdown  | `pnpm add react-markdown`     |
| 36   | jspdf           | `pnpm add jspdf`              |
| 37   | vite-plugin-pwa | `pnpm add -D vite-plugin-pwa` |

---

## 🗂️ Estrutura de Arquivos Final

```
/
├── api/
│   ├── diagnose.ts             ← ✅ CRIADO (Fase 5.5)
│   └── chat.ts                 ← ✅ CRIADO (Fase 5.5)
├── public/
│   ├── manifest.json           ← NOVO (Fase 7)
│   ├── icon-192.png            ← NOVO (Fase 7)
│   └── icon-512.png            ← NOVO (Fase 7)
├── src/
│   ├── components/
│   │   ├── ActionPlanChecklist.tsx    ← NOVO (Fase 6)
│   │   ├── AiChat.tsx                ← ✅ MODIFICADO (Fase 5.5)
│   │   ├── ApiKeySetup.tsx           ← não removido, apenas não renderizado
│   │   ├── Button.tsx
│   │   ├── ChecklistProgressBadge.tsx ← NOVO (Fase 6)
│   │   ├── CurrencyInput.tsx
│   │   ├── DailyTip.tsx             ← NOVO (Fase 7)
│   │   ├── FormProgress.tsx
│   │   ├── FormStep.tsx
│   │   ├── Header.tsx               ← MODIFICADO (Fase 6)
│   │   ├── ScoreEvolutionChart.tsx  ← NOVO (Fase 6)
│   │   └── icons.tsx
│   ├── constants/goals.ts
│   ├── hooks/
│   │   ├── useApiKey.ts             ← não removido, apenas não utilizado
│   │   ├── useChecklist.ts          ← NOVO (Fase 6)
│   │   └── useForm.ts               ← MODIFICADO (Fase 6)
│   ├── pages/
│   │   ├── Compare.tsx              ← NOVO (Fase 6)
│   │   ├── History.tsx              ← MODIFICADO (Fases 6 e 7)
│   │   ├── Home.tsx                 ← MODIFICADO (Fases 5.5 e 7)
│   │   ├── Result.tsx               ← MODIFICADO (Fases 5.5 e 6)
│   │   └── Simulation.tsx           ← MODIFICADO (Fase 6)
│   ├── services/
│   │   ├── dailyTip.ts              ← NOVO (Fase 7)
│   │   └── gemini.ts                ← ✅ MODIFICADO (Fase 5.5)
│   ├── types/index.ts
│   └── utils/
│       ├── exportPdf.ts             ← NOVO (Fase 7)
│       ├── formatters.ts
│       └── prompt.ts                ← INALTERADO
├── .env.example                     ← ✅ MODIFICADO (Fase 5.5)
├── .env.local                       ← GEMINI_API_KEY (não commitar)
├── vercel.json                      ← ✅ CRIADO (Fase 5.5)
└── vite.config.ts                   ← MODIFICADO (Fase 7)
```

---

## 📋 Convenções do Projeto

**localStorage — chaves em uso:**
| Chave | Conteúdo |
|---|---|
| `simulations` | Array de metadados das simulações |
| `simulation_{id}` | Objeto `SimulationDetails` completo |
| `diagnosis_{id}` | Objeto `DiagnosisResponse` completo |
| `checklist_{id}` | `{ [index]: boolean }` — progresso da checklist |
| `daily_tip` | `{ date: string, tip: string }` — cache da dica diária |
| `organizai_gemini_api_key` | Obsoleta após Fase 5.5 — não remover para não quebrar dados existentes |

**Variável de ambiente (servidor):**

- `GEMINI_API_KEY` — usada apenas dentro das functions em `api/`. Nunca acessar no frontend.

**Paleta de cores (Tailwind tokens):**

- `bg-space-950` / `text-space-950` → `#030014`
- `text-accent-lime` / `bg-accent-lime` → `#c5ff22`
- `glass-panel` → classe utilitária com backdrop-blur e borda sutil
- Animações: `animate-fadeIn`, `animate-float-slow`, `animate-float-medium`, `animate-shake`

**Padrão de componente:**

```tsx
interface MeuComponenteProps { ... }
export const MeuComponente: React.FC<MeuComponenteProps> = ({ ... }) => { ... };
```

**Padrão de serviço (gemini.ts como referência após Fase 5.5):**

- `fetch` para `/api/...` — nunca chamar Gemini diretamente do frontend
- Funções assíncronas puras, sem estado interno
- Erros propagados com `throw` para o chamador tratar
