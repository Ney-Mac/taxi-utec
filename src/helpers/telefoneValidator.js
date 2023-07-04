export function telefoneValidator(telefone) {
  if (!telefone) return "Insira seu número telefonico."
  if (!/^\d+$/.test(telefone)) return "Insira um número válido."
  return ''
}
