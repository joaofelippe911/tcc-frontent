function formatValor(valor) {
  if (typeof valor !== "number") {
    return "Valor inválido";
  }

  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
