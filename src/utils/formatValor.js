 export function formatValor(value) {
  if (!value) {
    return (0).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }
  // Remove qualquer caractere que não seja dígito numérico
  const numeroLimpo = value.replace(/\D/g, '');
  

  // Converte para número
  const numero = parseFloat(numeroLimpo) / 100;

  // Formata para reais com duas casas decimais e separador de milhar
  const numeroFormatado = numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
  });

  // Define o valor formatado de volta no campo de entrada
  return numeroFormatado;
}