import type { DiagnosisResponse } from '../types';

export const MOCK_DIAGNOSIS: DiagnosisResponse = {
  saudeFinanceiraScore: 62,
  diagnosticoGeral: `Sua situação financeira apresenta uma base sólida, com receita mensal estável e comprometimento moderado das despesas. O saldo positivo ao final do mês indica capacidade real de poupança, mas ainda não está sendo aproveitada ao máximo.\n\n**Pontos de atenção:** os gastos variáveis representam uma fatia considerável do orçamento e possuem grande potencial de otimização. Com alguns ajustes estratégicos, você pode acelerar o acúmulo de patrimônio e se aproximar dos seus objetivos financeiros com mais velocidade.\n\nO caminho para uma saúde financeira excelente está ao seu alcance — pequenas mudanças consistentes geram grandes resultados ao longo do tempo.`,
  pontosFortes: [
    'Saldo mensal positivo, demonstrando que você gasta menos do que ganha — base fundamental para construção de patrimônio.',
    'Controle sobre despesas fixas dentro de uma faixa saudável, sem comprometimento excessivo da renda com obrigações recorrentes.',
    'Abertura para educação financeira e busca ativa por melhorias — fator decisivo para transformação financeira de longo prazo.',
  ],
  oportunidadesMelhoria: [
    'Gastos variáveis (lazer, alimentação fora, compras) podem ser reduzidos em 15–20% sem impacto significativo na qualidade de vida.',
    'Ausência de reserva de emergência estruturada — meta prioritária antes de qualquer outro investimento.',
    'Dívidas em aberto com juros acima da rentabilidade de qualquer investimento tradicional — quitá-las é o melhor "investimento" possível.',
  ],
  planoAcao: [
    {
      titulo: 'Construir fundo de emergência',
      descricao:
        'Reserve 3 a 6 meses de despesas em uma conta de alta liquidez (CDB, Tesouro Selic ou conta remunerada). Comece separando pelo menos 10% da renda mensal para este fim antes de qualquer outro gasto.',
    },
    {
      titulo: 'Mapear e cortar gastos variáveis',
      descricao:
        'Anote todos os gastos por 30 dias e identifique os 3 maiores vilões do orçamento. Estabeleça limites semanais para categorias como lazer e alimentação fora de casa.',
    },
    {
      titulo: 'Quitar dívidas com juros altos',
      descricao:
        'Liste todas as dívidas por taxa de juros (maior para menor). Direcione o máximo possível para a dívida mais cara primeiro — estratégia "bola de neve reversa" ou "avalanche".',
    },
    {
      titulo: 'Automatizar a poupança',
      descricao:
        'Configure uma transferência automática no dia do pagamento para uma conta separada de investimentos. O que não é visto não é gasto — pague-se primeiro antes de qualquer outra despesa.',
    },
    {
      titulo: 'Diversificar fontes de renda',
      descricao:
        'Explore oportunidades de renda extra compatíveis com suas habilidades: freelances, venda de produtos digitais, consultoria ou monetização de hobbies. Mesmo R$ 300/mês extras fazem diferença composta no longo prazo.',
    },
  ],
};
