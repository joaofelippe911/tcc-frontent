export function formatValorParaApi(value) {
  const numeroLimpo = value.replace(/\D/g, '');

  // Converte para número
  const numero = parseFloat(numeroLimpo) / 100;

  // Retorna o valor numérico
  return numero;
}
