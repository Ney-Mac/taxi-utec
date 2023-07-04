import { emailValidator } from "./emailValidator";

export function emailOrPhoneValidator(emailOrPhone){
    if(!emailOrPhone) return 'Insira seu email ou número de telemóvel.';

    if(!/^\d+$/.test(emailOrPhone)){
        if(emailValidator(emailOrPhone)) return 'Email ou número de telemóvel inválido.';
    }
    
    return '';
}