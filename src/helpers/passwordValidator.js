export function passwordValidator(password) {
  if (!password) return "Senha não pode estar vazia."
  if (password.length < 6) return 'Senha deve conter ao menos 6 caracteres.'
  return ''
}
