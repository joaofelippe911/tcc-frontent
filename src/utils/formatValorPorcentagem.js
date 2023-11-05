export function formatValorPorcentagem(value) {
  if (!value) {
    return '% 0';
  }

  const numeroLimpo = value.replace(/\D/g, '');
  const numero = parseFloat(numeroLimpo) || 0;
  if (numero > 100) {
    return '% 100';
  }
  const numeroFormatado = `% ${numero}`;
  return numeroFormatado;
}