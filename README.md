# OrganizAI

Diagnóstico financeiro completo gerado por IA — gratuito e sem cadastro.

**[organiz-ai.vercel.app](https://organiz-ai.vercel.app)**

---

## O que é

OrganizAI é uma aplicação web que permite mapear toda a sua situação financeira em minutos e receber um diagnóstico personalizado gerado pelo Google Gemini. O resultado inclui um score de saúde financeira, pontos fortes, oportunidades de melhoria e um plano de ação prático.

## Funcionalidades

- **Simulação guiada** — 6 passos para registrar receitas, gastos fixos, gastos variáveis, reservas e dívidas
- **Diagnóstico com IA** — análise completa via Google Gemini com score, insights e plano de ação
- **Histórico de simulações** — gráfico de evolução do score ao longo do tempo
- **Checklist interativa** — acompanhe o progresso do plano de ação
- **Comparação** — veja duas simulações lado a lado
- **Exportação em PDF** — salve seu diagnóstico completo
- **PWA** — instalável no celular, funciona offline
- **Sem cadastro** — dados armazenados localmente no navegador

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite |
| Estilo | Tailwind CSS v4 |
| Roteamento | React Router v7 |
| IA | Google Gemini API |
| Gráficos | Recharts |
| PDF | jsPDF |
| Deploy | Vercel |

## Rodando localmente

```bash
# Instalar dependências
npm install

# Configurar variável de ambiente
echo "VITE_GEMINI_API_KEY=sua_chave_aqui" > .env.local

# Iniciar servidor de desenvolvimento
npm run dev
```

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `VITE_GEMINI_API_KEY` | Chave da API do Google Gemini |

## Scripts

```bash
npm run dev       # Servidor de desenvolvimento
npm run build     # Build de produção
npm run preview   # Preview do build
npm run lint      # Verificar código
npm run format    # Formatar com Prettier
```

---

Feito por [Gustavo Constante](https://github.com/gustavoconstante)
