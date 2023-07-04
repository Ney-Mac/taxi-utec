export function emailValidator(email) {
  const re = /\S+@\S+\.\S+/
  if (!email) return "Email não pode estar vazio."
  if (!re.test(email)) return 'Ooops! Insira um email válido.'
  return ''
}
