/**
 * Validadores - NT Informática
 * Validação de formulários PT-BR
 */

/**
 * Valida e-mail
 * @param {string} email - E-mail a ser validado
 * @returns {boolean} true se válido
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

/**
 * Valida telefone brasileiro
 * @param {string} phone - Telefone a ser validado
 * @returns {boolean} true se válido
 */
export function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  
  // Remove tudo que não é número
  const cleaned = phone.replace(/\D/g, '');
  
  // Telefone fixo (10 dígitos) ou celular (11 dígitos)
  return cleaned.length === 10 || cleaned.length === 11;
}

/**
 * Valida CPF (formato básico)
 * @param {string} cpf - CPF a ser validado
 * @returns {boolean} true se válido
 */
export function validateCPF(cpf) {
  if (!cpf || typeof cpf !== 'string') return false;
  
  const cleaned = cpf.replace(/\D/g, '');
  
  // Deve ter 11 dígitos
  if (cleaned.length !== 11) return false;
  
  // Não pode ser todos os dígitos iguais
  if (/^(\d)\1{10}$/.test(cleaned)) return false;
  
  // Validação dos dígitos verificadores
  let sum = 0;
  let remainder;
  
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleaned.substring(i - 1, i)) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.substring(9, 10))) return false;
  
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleaned.substring(i - 1, i)) * (12 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.substring(10, 11))) return false;
  
  return true;
}

/**
 * Valida campo obrigatório
 * @param {string} value - Valor a ser validado
 * @returns {boolean} true se preenchido
 */
export function validateRequired(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
}

/**
 * Valida tamanho mínimo
 * @param {string} value - Valor a ser validado
 * @param {number} minLength - Tamanho mínimo
 * @returns {boolean} true se válido
 */
export function validateMinLength(value, minLength) {
  if (!value || typeof value !== 'string') return false;
  return value.trim().length >= minLength;
}

/**
 * Valida tamanho máximo
 * @param {string} value - Valor a ser validado
 * @param {number} maxLength - Tamanho máximo
 * @returns {boolean} true se válido
 */
export function validateMaxLength(value, maxLength) {
  if (!value || typeof value !== 'string') return true;
  return value.trim().length <= maxLength;
}

/**
 * Sanitiza texto (previne XSS)
 * @param {string} text - Texto a ser sanitizado
 * @returns {string} Texto sanitizado
 */
export function escapeHtml(text) {
  if (!text || typeof text !== 'string') return '';
  
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

