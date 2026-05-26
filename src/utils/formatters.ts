/**
 * Formats a raw string of digits or a number into BRL currency (R$ X.XXX,XX)
 * Example: "125050" -> "R$ 1.250,50"
 */
export const formatCurrency = (value: string | number): string => {
  if (value === undefined || value === null) return '';

  let numericString =
    typeof value === 'number'
      ? value.toFixed(2).replace('.', '')
      : value.replace(/\D/g, '');

  if (!numericString) return 'R$ 0,00';

  // Pad with leading zeros if it's less than 3 digits
  while (numericString.length < 3) {
    numericString = '0' + numericString;
  }

  const cents = numericString.slice(-2);
  const integerPart = numericString.slice(0, -2);

  // Format integer part with dots for thousands
  const formattedInteger = Number(integerPart).toLocaleString('pt-BR');

  return `R$ ${formattedInteger},${cents}`;
};

/**
 * Parses formatted currency string (e.g. "R$ 1.250,50") back to a float number
 */
export const parseCurrencyToNumber = (value: string): number => {
  if (!value) return 0;

  // Remove non-numeric characters except dots and commas
  const cleaned = value.replace(/[^\d,]/g, '').replace(',', '.');
  const parsed = parseFloat(cleaned);

  return isNaN(parsed) ? 0 : parsed;
};
