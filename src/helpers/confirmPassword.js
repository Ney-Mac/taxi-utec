export function confirmPassword(p1, p2) {
    if(!p1) return 'Confirmar senha não pode estar vazio.';
    if(p1 !== p2) return 'Senha incompatível';
    return ''
}