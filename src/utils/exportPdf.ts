import { jsPDF } from 'jspdf';
import type { SimulationDetails, DiagnosisResponse } from '../types';

const COLOR_TITLE: [number, number, number] = [79, 70, 229];
const COLOR_TEXT: [number, number, number] = [30, 30, 46];
const COLOR_SECONDARY: [number, number, number] = [71, 85, 105];
const COLOR_BAR_BG: [number, number, number] = [226, 232, 240];
const COLOR_BAR_FILL: [number, number, number] = [79, 70, 229];

const formatCurrencyPdf = (value: number): string =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const exportDiagnosisPdf = async (
  simulation: SimulationDetails,
  diagnosis: DiagnosisResponse,
): Promise<void> => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentW = pageW - margin * 2;
  let y = 20;

  const addPage = () => {
    doc.addPage();
    y = 20;
  };

  const checkPageBreak = (needed = 10) => {
    if (y + needed > 275) addPage();
  };

  const sectionTitle = (text: string) => {
    checkPageBreak(12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...COLOR_TITLE);
    doc.text(text, margin, y);
    y += 2;
    doc.setDrawColor(...COLOR_TITLE);
    doc.setLineWidth(0.3);
    doc.line(margin, y, margin + contentW, y);
    y += 6;
  };

  // ── Cabeçalho ──────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...COLOR_TITLE);
  doc.text('OrganizAI.', margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_SECONDARY);
  doc.text('Relatório de Diagnóstico Financeiro', margin, y + 7);
  doc.text(`Gerado em: ${simulation.date}`, pageW - margin, y + 7, { align: 'right' });

  y += 14;
  doc.setDrawColor(...COLOR_BAR_BG);
  doc.setLineWidth(0.5);
  doc.line(margin, y, margin + contentW, y);
  y += 10;

  // ── Perfil ──────────────────────────────────────────────────
  sectionTitle('Perfil do Usuário');

  const profileRows = [
    ['Nome', simulation.profile.name],
    ['Idade', `${simulation.profile.age} anos`],
    ['Ocupação', simulation.profile.occupation || '—'],
    ['Objetivo Principal', simulation.profile.mainGoal],
  ];

  profileRows.forEach(([label, value]) => {
    checkPageBreak(8);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...COLOR_SECONDARY);
    doc.text(`${label}:`, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLOR_TEXT);
    doc.text(value, margin + 38, y);
    y += 7;
  });

  y += 4;

  // ── Resumo Financeiro ───────────────────────────────────────
  sectionTitle('Resumo Financeiro');

  const financeRows = [
    ['Receita Total', formatCurrencyPdf(simulation.finances.income.total)],
    ['Despesas Totais', formatCurrencyPdf(simulation.finances.totalExpenses)],
    ['Saldo Líquido', formatCurrencyPdf(simulation.finances.netBalance)],
    ['Reservas', formatCurrencyPdf(simulation.finances.savingsAndDebts.amountSaved)],
    ['Dívidas', formatCurrencyPdf(simulation.finances.savingsAndDebts.currentDebts)],
  ];

  financeRows.forEach(([label, value]) => {
    checkPageBreak(8);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...COLOR_SECONDARY);
    doc.text(`${label}:`, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLOR_TEXT);
    doc.text(value, margin + 50, y);
    y += 7;
  });

  y += 4;

  // ── Score de Saúde Financeira ───────────────────────────────
  sectionTitle('Saúde Financeira');

  checkPageBreak(18);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_TEXT);
  doc.text(`Score: ${diagnosis.saudeFinanceiraScore}/100`, margin, y);
  y += 6;

  const barW = contentW * 0.6;
  const barH = 5;
  doc.setFillColor(...COLOR_BAR_BG);
  doc.roundedRect(margin, y, barW, barH, 2, 2, 'F');
  const fillW = (diagnosis.saudeFinanceiraScore / 100) * barW;
  doc.setFillColor(...COLOR_BAR_FILL);
  doc.roundedRect(margin, y, fillW, barH, 2, 2, 'F');
  y += 12;

  // ── Diagnóstico Geral ───────────────────────────────────────
  sectionTitle('Diagnóstico Geral');

  const cleanText = diagnosis.diagnosticoGeral.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\n+/g, ' ');
  const lines = doc.splitTextToSize(cleanText, contentW);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...COLOR_TEXT);

  lines.forEach((line: string) => {
    checkPageBreak(6);
    doc.text(line, margin, y);
    y += 6;
  });

  y += 4;

  // ── Pontos Fortes ───────────────────────────────────────────
  sectionTitle('Pontos Fortes');

  diagnosis.pontosFortes.forEach((item) => {
    const itemLines = doc.splitTextToSize(`✓  ${item}`, contentW);
    checkPageBreak(itemLines.length * 6 + 4);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...COLOR_TEXT);
    itemLines.forEach((line: string) => {
      doc.text(line, margin, y);
      y += 6;
    });
    y += 2;
  });

  y += 2;

  // ── Oportunidades ───────────────────────────────────────────
  sectionTitle('Oportunidades de Melhoria');

  diagnosis.oportunidadesMelhoria.forEach((item) => {
    const itemLines = doc.splitTextToSize(`→  ${item}`, contentW);
    checkPageBreak(itemLines.length * 6 + 4);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...COLOR_TEXT);
    itemLines.forEach((line: string) => {
      doc.text(line, margin, y);
      y += 6;
    });
    y += 2;
  });

  y += 2;

  // ── Plano de Ação ───────────────────────────────────────────
  sectionTitle('Plano de Ação');

  diagnosis.planoAcao.forEach((step, idx) => {
    const titleLines = doc.splitTextToSize(`${idx + 1}. ${step.titulo}`, contentW);
    const descLines = doc.splitTextToSize(`    ${step.descricao}`, contentW);
    checkPageBreak((titleLines.length + descLines.length) * 6 + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...COLOR_TEXT);
    titleLines.forEach((line: string) => {
      doc.text(line, margin, y);
      y += 6;
    });

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLOR_SECONDARY);
    descLines.forEach((line: string) => {
      doc.text(line, margin, y);
      y += 6;
    });
    y += 4;
  });

  // ── Rodapé ──────────────────────────────────────────────────
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    const pageH = doc.internal.pageSize.getHeight();
    doc.setDrawColor(...COLOR_BAR_BG);
    doc.setLineWidth(0.3);
    doc.line(margin, pageH - 14, margin + contentW, pageH - 14);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...COLOR_SECONDARY);
    doc.text('Gerado por OrganizAI — organizai.app', margin, pageH - 8);
    doc.text(`Página ${i}/${totalPages}`, pageW - margin, pageH - 8, { align: 'right' });
  }

  const safeName = simulation.profile.name.replace(/\s+/g, '-');
  const safeDate = simulation.date.replace(/\//g, '-');
  doc.save(`organizai-${safeName}-${safeDate}.pdf`);
};
