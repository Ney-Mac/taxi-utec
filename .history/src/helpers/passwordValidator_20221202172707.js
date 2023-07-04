export function passwordValidator(password) {
  if (!password) return "Insira sua senha."
  if (password.length < 5) return 'A senha deve ter pelo menos 5 caracteres.'
  return ''
}
