/**
 * Formatadores - NT Informática
 * Formatação PT-BR usando Intl
 */

/**
 * Formata data no formato DD/MM/YYYY
 * @param {Date|string} date - Data a ser formatada
 * @returns {string} Data formatada
 */
export function formatDate(date) {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(dateObj);
}

/**
 * Formata data e hora no formato DD/MM/YYYY HH:MM
 * @param {Date|string} date - Data a ser formatada
 * @returns {string} Data e hora formatadas
 */
export function formatDateTime(date) {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
}

/**
 * Formata data relativa (há X dias, etc)
 * @param {Date|string} date - Data a ser formatada
 * @returns {string} Data relativa formatada
 */
export function formatRelativeDate(date) {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  const now = new Date();
  const diffMs = now - dateObj;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `Há ${diffDays} dias`;
  if (diffDays < 30) return `Há ${Math.floor(diffDays / 7)} semanas`;
  if (diffDays < 365) return `Há ${Math.floor(diffDays / 30)} meses`;
  
  return formatDate(dateObj);
}

/**
 * Formata número no formato PT-BR
 * @param {number} number - Número a ser formatado
 * @param {number} decimals - Casas decimais (padrão: 2)
 * @returns {string} Número formatado
 */
export function formatNumber(number, decimals = 2) {
  if (number === null || number === undefined || isNaN(number)) return '';
  
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(number);
}

/**
 * Formata telefone no formato (XX) XXXXX-XXXX
 * @param {string} phone - Telefone a ser formatado
 * @returns {string} Telefone formatado
 */
export function formatPhone(phone) {
  if (!phone) return '';
  
  // Remove tudo que não é número
  const cleaned = phone.replace(/\D/g, '');
  
  // Formata conforme tamanho
  if (cleaned.length === 10) {
    // Telefone fixo: (XX) XXXX-XXXX
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else if (cleaned.length === 11) {
    // Celular: (XX) XXXXX-XXXX
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
}

/**
 * Trunca texto com ellipsis
 * @param {string} text - Texto a ser truncado
 * @param {number} maxLength - Tamanho máximo
 * @returns {string} Texto truncado
 */
export function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

