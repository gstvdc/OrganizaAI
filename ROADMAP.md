# OrganizAI - Educação Financeira com IA Generativa

Este projeto é uma aplicação de educação financeira que utiliza Inteligência Artificial Generativa (Google Gemini) para fornecer diagnósticos, simulando cenários financeiros de usuários e gerando relatórios de insights e conselhos personalizados.

---

## 🗺️ Mapa de Etapas do Projeto

Utilize esta lista para acompanhar o progresso do desenvolvimento do projeto. Marque as caixas conforme for concluindo cada etapa.

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

### 🔁 Fase 5.5: Remover a API Key do Usuário — Gemini via Variável de Ambiente

Esta fase elimina completamente a necessidade de o usuário configurar uma API Key do Google Gemini. A chave passa a ser uma variável de ambiente do projeto (`VITE_GEMINI_API_KEY`), configurada pelo desenvolvedor no `.env.local` durante o desenvolvimento e no painel do serviço de deploy (Vercel, Netlify, etc.) em produção. O usuário abre o app e o diagnóstico funciona imediatamente, sem nenhuma etapa de configuração.

O Google Gemini oferece um tier gratuito generoso via Google AI Studio (`aistudio.google.com`), que é suficiente para uso educacional e projetos pessoais — sem necessidade de cartão de crédito.

> **Importante para o Claude da IDE:** esta fase não troca a biblioteca nem o modelo — `@google/generative-ai` e `gemini-2.5-flash` continuam sendo usados. A única mudança é de onde vem a chave: antes do usuário via localStorage, agora da variável de ambiente `import.meta.env.VITE_GEMINI_API_KEY`.

---

- [x] **25. Mover a API Key do Gemini para Variável de Ambiente**

  **Objetivo:** Fazer com que `src/services/gemini.ts` leia a chave diretamente de `import.meta.env.VITE_GEMINI_API_KEY` em vez de recebê-la como parâmetro vindo do `useApiKey` hook. Isso torna a chave invisível ao usuário final.

  **Como funciona na prática:**
  - Em desenvolvimento local: o desenvolvedor cria `.env.local` com `VITE_GEMINI_API_KEY=AIza...` (já estava em `.env.example`)
  - Em produção (Vercel/Netlify/etc.): a mesma variável é configurada no painel de ambiente do serviço de deploy
  - O Vite injeta `import.meta.env.VITE_GEMINI_API_KEY` no bundle em build time — a chave nunca aparece para o usuário final em runtime, apenas no bundle compilado (comportamento padrão e aceito para projetos frontend com tier gratuito)

  **Arquivos a modificar:**
  - `src/services/gemini.ts`:

    Atualmente as funções `generateFinancialDiagnosis` e `sendChatMessage` recebem `apiKey: string` como último parâmetro e instanciam `new GoogleGenerativeAI(apiKey)` com esse valor.

    A mudança é simples: criar uma constante no topo do arquivo que lê a env var, e usá-la internamente em vez do parâmetro:

    ```ts
    // Adicionar no topo do arquivo, após os imports:
    const GEMINI_API_KEY =
      (import.meta.env.VITE_GEMINI_API_KEY as string) ?? '';
    ```

    Em seguida, **remover o parâmetro `apiKey: string`** das assinaturas de ambas as funções exportadas e substituir `new GoogleGenerativeAI(apiKey)` por `new GoogleGenerativeAI(GEMINI_API_KEY)` nos dois lugares onde aparece.

    As novas assinaturas ficam:

    ```ts
    export const generateFinancialDiagnosis = async (
      simulationData: SimulationDetails,
    ): Promise<DiagnosisResponse>

    export const sendChatMessage = async (
      history: { role: 'user' | 'model'; text: string }[],
      newMessage: string,
      simulation: SimulationDetails,
      diagnosis: DiagnosisResponse,
    ): Promise<string>
    ```

  - `src/pages/Result.tsx`:
    - Remover os imports de `useApiKey` e `ApiKeySetup`
    - Remover a desestruturação `const { apiKey, hasApiKey, saveApiKey } = useApiKey()`
    - Remover a função `handleKeySave`
    - Na função `fetchDiagnosis`, remover o parâmetro `key: string` e a passagem desse parâmetro para `generateFinancialDiagnosis`. A chamada fica: `const result = await generateFinancialDiagnosis(simData)`
    - No `useEffect` que dispara o diagnóstico, substituir `if (simulation && hasApiKey && !diagnosis)` por `if (simulation && !diagnosis)` — o diagnóstico é gerado automaticamente assim que a simulação carrega, sem gate de chave
    - Remover o bloco JSX inteiro que renderiza `<ApiKeySetup>` quando `!hasApiKey && !diagnosis` — esse estado não existe mais
    - Remover o bloco JSX de erro que renderizava `<ApiKeySetup onSave={handleKeySave} />` dentro do estado de erro com API key já definida

  - `src/components/AiChat.tsx`:
    - Remover o import de `useApiKey` e `IconLock`
    - Remover `const { apiKey, hasApiKey } = useApiKey()`
    - Na função `send`, remover o parâmetro `apiKey` da chamada de `sendChatMessage`. A chamada fica: `const response = await sendChatMessage(messages, trimmed, simulation, diagnosis)`
    - Remover completamente o bloco `if (!hasApiKey) { return <div>Chat indisponível...</div> }` — o chat sempre estará disponível
    - Remover `IconLock` do JSX se não for mais usado em nenhum outro lugar do componente

  - `src/hooks/useApiKey.ts` — **não deletar** (pode ser útil futuramente), mas adicionar comentário no topo:

    ```ts
    // Não utilizado desde a Fase 5.5.
    // A API Key do Gemini agora é lida diretamente de import.meta.env.VITE_GEMINI_API_KEY
    // em src/services/gemini.ts, sem necessidade de input do usuário.
    ```

  - `src/components/ApiKeySetup.tsx` — **não deletar**, apenas não é mais renderizado em nenhum lugar. Adicionar comentário no topo:

    ```tsx
    // Não utilizado desde a Fase 5.5.
    // O usuário não precisa mais configurar a API Key manualmente.
    ```

  - `.env.example` — atualizar o comentário para deixar claro o novo fluxo:
    ```
    # Gemini API Key — obtenha gratuitamente em https://aistudio.google.com/app/apikey
    # Desenvolvimento local: copie este arquivo para .env.local e preencha com sua chave
    # Produção: configure VITE_GEMINI_API_KEY no painel de ambiente do seu serviço de deploy
    # O usuário final não precisa configurar nada — a chave fica no servidor/build
    VITE_GEMINI_API_KEY=
    ```

---

- [x] **26. Atualizar a Página Home para Refletir o App sem Barreiras**

  **Objetivo:** Atualizar os textos da hero section e do roadmap na `src/pages/Home.tsx` para comunicar que o app funciona sem configuração, e remover a menção de que a API Key é necessária.

  **Arquivos a modificar:**
  - `src/pages/Home.tsx`:
    - No array `ROADMAP_ITEMS`, atualizar a descrição do card de diagnóstico: substituir `'Integração com Google Gemini para gerar insights e plano de ação personalizados.'` por `'Integração com Google Gemini para gerar insights e plano de ação personalizados — sem configuração necessária.'`
    - No subtítulo da hero section `<p className="text-sm text-slate-400...">`, se houver menção a "API Key" ou "configuração", remover ou suavizar o texto

  - `.env.example` — já atualizado no item 25

---

### ✅ Fase 6: Engajamento e Acompanhamento do Usuário

Esta fase transforma o app de uma ferramenta de diagnóstico pontual em um sistema de acompanhamento financeiro contínuo. O usuário passa a ter razões para voltar ao app, acompanhar seu progresso e agir sobre as recomendações da IA.

> **Pré-requisito:** a Fase 5.5 deve estar completa antes de iniciar esta fase. Todos os itens abaixo assumem que `src/services/gemini.ts` já não recebe `apiKey` como parâmetro, e que `Result.tsx` e `AiChat.tsx` já foram atualizados para não depender de `useApiKey`.

---

- [x] **27. Checklist Interativa do Plano de Ação**

  **Objetivo:** Converter os itens do `planoAcao[]` retornados pelo Gemini em checkboxes interativos na página de Resultado, com progresso salvo no localStorage por simulação.

  **Contexto do projeto:**
  - O array `diagnosis.planoAcao` já existe com objetos `{ titulo: string, descricao: string }[]`
  - O widget decorativo `ChecklistWidgetContent` na `src/pages/Home.tsx` já mostra o conceito visualmente na hero section — a implementação real é a concretização desse mockup
  - O `localStorage` já é usado extensivamente no projeto com padrões como `diagnosis_{id}` e `simulation_{id}`

  **Arquivos a criar:**
  - `src/hooks/useChecklist.ts` — hook que carrega/salva o estado `{ [stepIndex]: boolean }` no localStorage com a chave `checklist_{simulationId}`. Exportar também uma função pura `getChecklistProgress(id: string, total: number): { completedCount: number, progressPercent: number }` para ser usada sem hook (no Histórico). O hook deve expor: `checked`, `toggle(index: number)`, `completedCount`, `progressPercent`, `isAllDone`

  - `src/components/ActionPlanChecklist.tsx` — componente que recebe `simulationId: string` e `steps: { titulo: string, descricao: string }[]`. Cada item é um `<button>` que ao clicar chama `toggle(idx)`. Exibe:
    - Barra de progresso animada no topo com `transition-all duration-500`, mudando de cor: `bg-violet-500` (0–29%) → `bg-amber-500` (30–59%) → `bg-lime-500` (60–99%) → `bg-accent-lime` (100%)
    - Contador "X/N concluídas" no canto superior direito
    - Cada item não concluído: número do step em círculo + título em `text-white` + descrição em `text-slate-400`
    - Cada item concluído: ícone de check verde no círculo + título em `text-accent-lime line-through` + descrição em `text-slate-500 line-through`
    - Mensagem motivacional no rodapé quando `isAllDone === true`: `"🎉 Parabéns! Você concluiu todas as ações do seu plano financeiro."`
    - Usar classes Tailwind já presentes no projeto: `glass-panel`, `rounded-3xl`, `border border-white/5`, `bg-white/[0.02]`, `animate-fadeIn`

  - `src/components/ChecklistProgressBadge.tsx` — componente leve para os cards do Histórico. Chama `getChecklistProgress()` diretamente (sem hook). Exibe mini barra de progresso e texto:
    - `completedCount === 0`: "Plano de ação não iniciado" em `text-slate-500`
    - `0 < completedCount < total`: "X/N ações concluídas" em `text-slate-400` + barra colorida
    - `completedCount === total`: "✓ Plano concluído" em `text-accent-lime` + barra cheia

  **Arquivos a modificar:**
  - `src/pages/Result.tsx` — importar `ActionPlanChecklist` e substituir o bloco JSX do "Action Plan" (o `<div>` com a classe `relative space-y-6 before:absolute before:inset-y-1 before:left-3.5 before:w-0.5 before:bg-violet-600/30`) pelo novo componente:

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

  - `src/pages/History.tsx` — adicionar helper `loadCachedDiagnosis(id: string)` junto ao `loadCachedScore` existente (lê `diagnosis_{id}` do localStorage e retorna o objeto parseado ou null). Dentro do `.map()` dos cards de simulação, após o `ScoreBadge`, adicionar:
    ```tsx
    {
      (() => {
        const cached = loadCachedDiagnosis(sim.id);
        const totalSteps = cached?.planoAcao?.length ?? 0;
        return totalSteps > 0 ? (
          <div className="mt-3">
            <ChecklistProgressBadge
              simulationId={sim.id}
              totalSteps={totalSteps}
            />
          </div>
        ) : null;
      })();
    }
    ```
    Importar `ChecklistProgressBadge` no topo do arquivo.

---

- [x] **28. Gráfico de Evolução do Score de Saúde Financeira**

  **Objetivo:** Criar uma seção no `src/pages/History.tsx` que exibe um gráfico de linha mostrando a evolução do `saudeFinanceiraScore` ao longo das simulações do usuário, ordenado cronologicamente.

  **Contexto do projeto:**
  - Cada simulação tem `sim.date` (string `dd/mm/yyyy`)
  - O score está em `localStorage` com chave `diagnosis_{id}` → campo `saudeFinanceiraScore`
  - A função `loadCachedScore(id)` já existe em `History.tsx` e retorna `number | null`

  **Dependência a instalar:** `npm install recharts`

  **Arquivos a criar:**
  - `src/components/ScoreEvolutionChart.tsx` — componente que recebe `simulations: StoredSimulation[]` (ordem cronológica: mais antiga primeiro). Internamente constrói:

    ```ts
    const data = simulations
      .map((s) => ({
        date: s.date,
        score: loadCachedScore(s.id),
        label: s.profile.name,
      }))
      .filter((d) => d.score !== null);
    ```

    Se `data.length < 2`, renderizar estado vazio: card `glass-panel rounded-3xl p-6` com texto "Faça pelo menos 2 simulações com diagnóstico para ver a evolução do seu score".

    Quando `data.length >= 2`, usar `<ResponsiveContainer width="100%" height={220}>` com `<LineChart>` do Recharts contendo:
    - `<CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />`
    - `<XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />`
    - `<YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />`
    - `<Tooltip contentStyle={{ background: '#030014', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />`
    - `<Line type="monotone" dataKey="score" stroke="#c5ff22" strokeWidth={2} dot={{ fill: '#c5ff22', r: 4 }} activeDot={{ r: 6 }} />`

    Envolver em container com `className="glass-panel rounded-3xl p-6 shadow-2xl"`, título "Evolução da Saúde Financeira" e subtítulo "Score ao longo das suas simulações".

  **Arquivos a modificar:**
  - `src/pages/History.tsx` — importar `ScoreEvolutionChart` e adicionar logo abaixo do header da página (antes da lista de cards), somente se `simulations.length >= 1`:
    ```tsx
    {
      simulations.length >= 1 && (
        <div className="mb-8">
          <ScoreEvolutionChart simulations={[...simulations].reverse()} />
        </div>
      );
    }
    ```
    O `.reverse()` é necessário porque `loadSimulations()` retorna em ordem decrescente, mas o gráfico precisa da ordem cronológica (mais antiga → mais recente, da esquerda para direita).

---

- [x] **29. Renderização de Markdown no Diagnóstico Geral**

  **Objetivo:** O campo `diagnosticoGeral` retornado pelo Gemini contém formatação Markdown (quebras de linha `\n`, listas com `-`, negrito com `**texto**`). Atualmente é renderizado como `<p>` simples, perdendo toda a formatação.

  **Contexto do projeto:**
  - O prompt em `src/utils/prompt.ts` instrui o Gemini a retornar `diagnosticoGeral` "em formato markdown amigável com quebras de linha \n"
  - Em `src/pages/Result.tsx`, o campo é exibido em um `<p className="... whitespace-pre-line">`

  **Dependência a instalar:** `npm install react-markdown`

  **Arquivos a modificar:**
  - `src/pages/Result.tsx` — adicionar `import ReactMarkdown from 'react-markdown'` no topo. Localizar o `<p>` que renderiza `{diagnosis.diagnosticoGeral}` e substituir por:
    ```tsx
    <div className="space-y-2">
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
    </div>
    ```

---

- [x] **30. Comparação Lado a Lado de Duas Simulações**

  **Objetivo:** Criar uma página `/comparar` onde o usuário seleciona duas simulações do histórico e vê um diff visual com renda, despesas, saldo e score lado a lado.

  **Contexto do projeto:**
  - As simulações ficam em `localStorage` com chave `simulation_{id}` (objeto `SimulationDetails` completo)
  - A tipagem `SimulationDetails` está em `src/types/index.ts`
  - O score vem de `diagnosis_{id}` → `saudeFinanceiraScore`
  - O roteamento usa React Router DOM — ver `src/App.tsx` para o padrão de `<Route>`
  - Design padrão: `glass-panel rounded-3xl border border-white/5 bg-white/[0.01] p-6 shadow-2xl`

  **Arquivos a criar:**
  - `src/pages/Compare.tsx` — página com estrutura:
    1. Header: título "Comparar Simulações" + subtítulo
    2. Dois `<select>` estilizados com `className="glass-input"` para escolher simulação A e simulação B. Populados com `JSON.parse(localStorage.getItem('simulations') || '[]')`, mostrando `${sim.profile.name} — ${sim.date}` como label. Ler query string `?a={id}` com `useSearchParams()` para pré-selecionar a primeira simulação
    3. Quando ambas selecionadas, exibir dois cards lado a lado (`grid grid-cols-2 gap-4`) com: nome + data, `ScoreBadge` com o score do diagnóstico (lido via `loadCachedScore`)
    4. Tabela de comparação com as linhas: Renda Total, Despesas Fixas, Despesas Variáveis, Saldo Líquido, Dívidas, Reservas. Cada célula usa `formatCurrency`. Para cada linha, calcular qual valor é "melhor": para Renda, Saldo e Reservas → maior é melhor; para Despesas e Dívidas → menor é melhor. Destacar o valor vencedor em `text-accent-lime font-bold` e o perdedor em `text-rose-400`

  **Arquivos a modificar:**
  - `src/App.tsx` — adicionar:

    ```tsx
    import { Compare } from './pages/Compare';
    // dentro de <Routes>:
    <Route path="/comparar" element={<Compare />} />;
    ```

  - `src/components/Header.tsx` — no array `NAV_LINKS`, adicionar `{ to: '/comparar', label: 'Comparar', exact: false }`. Para não poluir o nav de quem não tem simulações, inicializar com `const [hasEnough] = useState(() => JSON.parse(localStorage.getItem('simulations') || '[]').length >= 2)` e só incluir o link se `hasEnough === true`

  - `src/pages/History.tsx` — nos cards de simulação, adicionar um botão `<Button variant="ghost" size="sm">` com texto "Comparar" que chama `navigate(\`/comparar?a=${sim.id}\`)`usando`useNavigate`

---

- [x] **31. Editar Simulação Existente**

  **Objetivo:** Permitir que o usuário reabra uma simulação salva, edite os valores e re-submeta para gerar um novo diagnóstico com o Gemini, sem precisar preencher tudo do zero.

  **Contexto do projeto:**
  - O formulário usa `useForm` de `src/hooks/useForm.ts` com `initialData` zerado
  - Ao editar, deve criar um novo `simulationId` para preservar o histórico — nunca sobrescrever
  - Após a Fase 5.5, o Gemini é chamado automaticamente ao carregar a página de resultado, sem gate de API Key

  **Arquivos a modificar:**
  - `src/hooks/useForm.ts` — adicionar parâmetro opcional `preloadData?: Partial<SimulationData>` na assinatura de `useForm`. Inicializar o estado com `{ ...initialData, ...preloadData }`

  - `src/pages/Simulation.tsx` — adicionar no topo do componente:

    ```tsx
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('edit');
    ```

    Se `editId` existir, carregar `localStorage.getItem(\`simulation\_${editId}\`)`e converter os campos numéricos para formato de moeda com`formatCurrency()`(ex:`finances.income.salary`→`formatCurrency(String(finances.income.salary))`). Passar o objeto convertido para `useForm({ preloadData: convertedData })`.

    Exibir banner no topo do formulário quando `editId` não é null:

    ```tsx
    <div className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-400">
      ✏️ Editando simulação de {originalDate} — um novo registro será criado ao
      finalizar
    </div>
    ```

  - `src/pages/History.tsx` — adicionar botão "Editar" em cada card:
    ```tsx
    <Button
      variant="ghost"
      size="sm"
      onClick={() => navigate(`/simulacao?edit=${sim.id}`)}
    >
      Editar
    </Button>
    ```

---

### 🚀 Fase 7: Produto, Distribuição e Experiência Avançada

Esta fase eleva o OrganizAI de projeto educacional a produto com experiência próxima de um app profissional: instalável, com dicas geradas automaticamente pelo Gemini e exportação de relatórios em PDF.

> **Pré-requisito:** as Fases 5.5 e 6 devem estar completas. Todos os serviços de IA nesta fase usam o `src/services/gemini.ts` já atualizado, que lê a chave da variável de ambiente automaticamente.

---

- [x] **32. Dicas Financeiras Diárias com Gemini**

  **Objetivo:** Adicionar uma seção na `src/pages/Home.tsx` com uma dica financeira gerada pelo Gemini, contextualizada ao perfil da última simulação do usuário. A dica é gerada automaticamente uma vez por dia e cacheada no localStorage. O usuário não precisa fazer nada — ela aparece na Home ao retornar ao app.

  **Contexto do projeto:**
  - A última simulação pode ser obtida com `JSON.parse(localStorage.getItem('simulations') || '[]').at(-1)` para o ID mais recente, depois `localStorage.getItem(\`simulation\_${id}\`)` para os dados completos
  - O `GEMINI_API_KEY` já está disponível em `import.meta.env.VITE_GEMINI_API_KEY` desde a Fase 5.5 — não receber como parâmetro

  **Arquivos a criar:**
  - `src/services/dailyTip.ts` — função `getDailyTip(profile: { name: string, mainGoal: string }): Promise<string>`:
    1. Checar cache: `const cache = JSON.parse(localStorage.getItem('daily_tip') || 'null')`. Se `cache?.date === new Date().toLocaleDateString('pt-BR')`, retornar `cache.tip` sem chamar a API
    2. Instanciar `new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)` e chamar `model.generateContent(prompt)` com o modelo `gemini-2.5-flash`. Prompt:
       ```
       Você é o OrganizAI. Gere UMA dica financeira prática e motivacional de no máximo 2 frases curtas para ${profile.name}, que tem como objetivo: "${profile.mainGoal}". Seja direto, encorajador e específico para esse objetivo. Retorne APENAS a dica, sem saudações, sem prefixos como "Dica:" e sem aspas.
       ```
    3. Salvar no localStorage: `localStorage.setItem('daily_tip', JSON.stringify({ date: new Date().toLocaleDateString('pt-BR'), tip: responseText }))`
    4. Retornar `responseText`

  - `src/components/DailyTip.tsx` — componente sem props. No `useEffect`, verificar se existe alguma simulação no localStorage; se sim, carregar o perfil da última e chamar `getDailyTip()`. Estrutura visual:
    - Container: `glass-panel rounded-3xl p-5 border border-white/5`
    - Cabeçalho: ícone de lâmpada (do `icons.tsx` se disponível, ou SVG inline) + texto "Dica do dia" em `text-xs font-bold tracking-wider text-slate-400 uppercase`
    - Corpo: a dica em `text-sm text-slate-300 leading-relaxed mt-2`
    - Botão: `"↻ Nova dica"` em `text-[10px] text-slate-500 hover:text-slate-300 cursor-pointer` que limpa o cache com `localStorage.removeItem('daily_tip')` e força nova chamada à API
    - Loading: dois blocos `<div className="h-3 rounded bg-white/5 animate-pulse">` de larguras 100% e 75%
    - Se não houver simulações salvas, retornar `null` sem renderizar nada

  **Arquivos a modificar:**
  - `src/pages/Home.tsx` — importar `DailyTip` e adicionar entre a hero section e o bloco de tech stack:
    ```tsx
    {
      localStorage.getItem('simulations') && (
        <div className="mt-12">
          <DailyTip />
        </div>
      );
    }
    ```

---

- [x] **33. Exportar Diagnóstico como PDF**

  **Objetivo:** Adicionar um botão "Exportar PDF" na página de Resultado que gera um PDF do diagnóstico completo formatado para impressão ou compartilhamento. Não requer nenhuma chamada adicional à API do Gemini — usa apenas os dados já em memória.

  **Contexto do projeto:**
  - Os dados já estão todos disponíveis: `simulation: SimulationDetails` e `diagnosis: DiagnosisResponse`
  - A identidade visual usa `#030014` como background e `#c5ff22` como accent

  **Dependência a instalar:** `npm install jspdf`

  **Arquivos a criar:**
  - `src/utils/exportPdf.ts` — função `exportDiagnosisPdf(simulation: SimulationDetails, diagnosis: DiagnosisResponse): Promise<void>` usando `jspdf` programaticamente (não via screenshot, para garantir texto selecionável e qualidade de impressão).

    Estrutura do PDF:
    1. Cabeçalho: "OrganizAI." em bold grande + "Relatório de Diagnóstico Financeiro" + data de geração
    2. Linha separadora horizontal `doc.line()`
    3. Seção "Perfil": nome, idade, ocupação, objetivo principal — usar `doc.setFont` para alternar bold/normal
    4. Score: "Saúde Financeira: XX/100" com barra visual desenhada com dois `doc.rect()` sobrepostos (fundo cinza + preenchimento colorido proporcional ao score)
    5. Seção "Diagnóstico Geral": `doc.splitTextToSize(diagnosis.diagnosticoGeral, 170)` para quebra automática de linha
    6. Seção "Pontos Fortes": lista com "✓ " prefixando cada item
    7. Seção "Oportunidades de Melhoria": lista com "→ " prefixando cada item
    8. Seção "Plano de Ação": lista numerada com título em bold + descrição em normal para cada step
    9. Rodapé: "Gerado por OrganizAI" + data

    Cores para impressão (evitar o neon `#c5ff22` — não imprime bem em papel):
    - Texto principal: `[30, 30, 46]` (RGB de `#1e1e2e`)
    - Títulos de seção: `[79, 70, 229]` (RGB de `#4f46e5` — indigo legível em papel)
    - Texto secundário/descrições: `[71, 85, 105]` (RGB de `#475569` — slate-600)

    Ao final: `doc.save(\`organizai-${simulation.profile.name.replace(/\s+/g, '-')}-${simulation.date.replace(/\//g, '-')}.pdf\`)`

  **Arquivos a modificar:**
  - `src/pages/Result.tsx` — no bloco de footer actions (div com `flex flex-col justify-end gap-4 border-t border-white/5 pt-6`), adicionar antes dos botões existentes:
    ```tsx
    {
      diagnosis && !loading && (
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
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Exportar PDF
        </Button>
      );
    }
    ```
    Adicionar `const [isExporting, setIsExporting] = useState(false)` e o import `import { exportDiagnosisPdf } from '../utils/exportPdf'`

---

- [x] **34. PWA — Instalação como App**

  **Objetivo:** Tornar o OrganizAI instalável como Progressive Web App em dispositivos móveis e desktop, com ícone na tela inicial e suporte a uso offline básico (assets estáticos cacheados).

  **Contexto do projeto:**
  - Bundler: Vite
  - Cores: `#030014` (background), `#c5ff22` (accent-lime)
  - Não há `manifest.json` nem service worker atualmente

  **Dependência a instalar:** `npm install -D vite-plugin-pwa`

  **Arquivos a criar:**
  - `public/manifest.json`:

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

  - `public/icon-192.png` e `public/icon-512.png` — ícones do app. Podem ser gerados em https://favicon.io com as letras "OA" na cor `#c5ff22` sobre fundo `#030014`

  **Arquivos a modificar:**
  - `vite.config.ts` — adicionar o plugin:

    ```ts
    import { VitePWA } from 'vite-plugin-pwa';

    // dentro de plugins: []:
    VitePWA({
      registerType: 'autoUpdate',
      manifest: false, // usa o manifest.json do diretório public/
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
    });
    ```

  - `index.html` — adicionar dentro de `<head>`:
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

## 🛠️ Tecnologias Principais

- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Google Gemini API** — modelo `gemini-2.5-flash` — IA Generativa gratuita via Google AI Studio
- **Vite**
- **ESLint** & **Prettier**

---

## 📦 Dependências Adicionais das Novas Fases

| Fase                  | Pacote          | Comando                          | Motivo                                |
| --------------------- | --------------- | -------------------------------- | ------------------------------------- |
| 5.5 — Remover API Key | nenhuma         | —                                | Apenas refatora o código existente    |
| 28 — Gráfico de Score | recharts        | `npm install recharts`           | Gráfico de linha do score             |
| 29 — Markdown         | react-markdown  | `npm install react-markdown`     | Renderizar diagnóstico formatado      |
| 33 — Export PDF       | jspdf           | `npm install jspdf`              | Geração de PDF com texto selecionável |
| 34 — PWA              | vite-plugin-pwa | `npm install -D vite-plugin-pwa` | Service worker + instalação           |

---

## 🗂️ Estrutura de Arquivos após Todas as Fases

```
src/
├── components/
│   ├── ActionPlanChecklist.tsx     ← NOVO (Fase 6 / item 27)
│   ├── AiChat.tsx                  ← MODIFICADO (Fase 5.5 / item 25)
│   ├── ApiKeySetup.tsx             ← DEPRECATED (mantido, não renderizado)
│   ├── Button.tsx
│   ├── ChecklistProgressBadge.tsx  ← NOVO (Fase 6 / item 27)
│   ├── CurrencyInput.tsx
│   ├── DailyTip.tsx                ← NOVO (Fase 7 / item 32)
│   ├── FormProgress.tsx
│   ├── FormStep.tsx
│   ├── Header.tsx                  ← MODIFICADO (Fase 6 / item 30)
│   ├── ScoreEvolutionChart.tsx     ← NOVO (Fase 6 / item 28)
│   └── icons.tsx
├── constants/
│   └── goals.ts
├── hooks/
│   ├── useApiKey.ts                ← DEPRECATED (mantido com comentário)
│   ├── useChecklist.ts             ← NOVO (Fase 6 / item 27)
│   └── useForm.ts                  ← MODIFICADO (Fase 6 / item 31)
├── pages/
│   ├── Compare.tsx                 ← NOVO (Fase 6 / item 30)
│   ├── History.tsx                 ← MODIFICADO (Fases 6 e 7)
│   ├── Home.tsx                    ← MODIFICADO (Fase 5.5 / item 26 + Fase 7 / item 32)
│   ├── Result.tsx                  ← MODIFICADO (Fase 5.5 / item 25 + Fases 6 e 7)
│   └── Simulation.tsx              ← MODIFICADO (Fase 6 / item 31)
├── services/
│   ├── dailyTip.ts                 ← NOVO (Fase 7 / item 32)
│   └── gemini.ts                   ← MODIFICADO (Fase 5.5 / item 25)
├── types/
│   └── index.ts
└── utils/
    ├── exportPdf.ts                ← NOVO (Fase 7 / item 33)
    ├── formatters.ts
    └── prompt.ts                   ← INALTERADO
```

---

## 📋 Convenções do Projeto (para manter consistência)

**localStorage keys em uso:**

- `simulations` — array de metadados de simulações
- `simulation_{id}` — objeto `SimulationDetails` completo
- `diagnosis_{id}` — objeto `DiagnosisResponse` completo
- `checklist_{id}` — estado da checklist `{ [index]: boolean }` ← NOVO Fase 6
- `daily_tip` — cache da dica diária `{ date: string, tip: string }` ← NOVO Fase 7
- `organizai_gemini_api_key` — ← OBSOLETA após Fase 5.5 (não remover para não quebrar dados de usuários existentes que salvaram a chave)

**Variável de ambiente:**

- `VITE_GEMINI_API_KEY` — chave da API do Gemini; configurada no `.env.local` para desenvolvimento e no painel do serviço de deploy para produção. **Nunca exposta ao usuário final via UI**

**Como o Gemini é instanciado após a Fase 5.5 (padrão para todos os serviços):**

```ts
import { GoogleGenerativeAI } from '@google/generative-ai';
const ai = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
```

Nunca mais receber `apiKey` como parâmetro de função.

**Paleta de cores (Tailwind tokens):**

- `bg-space-950` / `text-space-950` — `#030014`
- `text-accent-lime` / `bg-accent-lime` — `#c5ff22`
- `glass-panel` — classe utilitária com `backdrop-blur` e borda sutil
- Animações: `animate-fadeIn`, `animate-float-slow`, `animate-float-medium`, `animate-shake`

**Padrão de componente:**

```tsx
interface MeuComponenteProps { ... }
export const MeuComponente: React.FC<MeuComponenteProps> = ({ ... }) => { ... };
```

**Padrão de serviço (gemini.ts como referência após Fase 5.5):**

- Funções assíncronas puras; API Key lida de `import.meta.env.VITE_GEMINI_API_KEY` internamente
- Sem estado interno — estado fica nos componentes/hooks
- Erros propagados com `throw` para o chamador tratar
