/**
 * Sistema de Toast Global - NT Informática
 * Conforme regras do projeto
 */

(function() {
  'use strict';

  // Criar container se não existir
  function ensureContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'global-toast-container';
      document.body.appendChild(container);
    }
    return container;
  }

  // Ícones por tipo
  const icons = {
    success: '<i class="fas fa-check-circle" aria-hidden="true"></i>',
    error: '<i class="fas fa-exclamation-circle" aria-hidden="true"></i>',
    warning: '<i class="fas fa-exclamation-triangle" aria-hidden="true"></i>',
    info: '<i class="fas fa-info-circle" aria-hidden="true"></i>'
  };

  /**
   * Mostra um toast
   * @param {string} message - Mensagem a ser exibida
   * @param {string} type - Tipo: 'success', 'error', 'warning', 'info'
   * @param {number} duration - Duração em ms (padrão: 5000)
   */
  function showToast(message, type = 'info', duration = 5000) {
    const container = ensureContainer();
    
    // Validar tipo
    if (!['success', 'error', 'warning', 'info'].includes(type)) {
      type = 'info';
    }

    // Criar elemento toast
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');

    // Ícone
    const icon = document.createElement('span');
    icon.className = 'toast__icon';
    icon.innerHTML = icons[type];
    icon.setAttribute('aria-hidden', 'true');

    // Mensagem
    const messageEl = document.createElement('span');
    messageEl.className = 'toast__message';
    messageEl.textContent = message;

    // Botão fechar
    const closeBtn = document.createElement('button');
    closeBtn.className = 'toast__close';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Fechar notificação');
    closeBtn.setAttribute('type', 'button');
    
    closeBtn.addEventListener('click', () => {
      removeToast(toast);
    });

    // Montar toast
    toast.appendChild(icon);
    toast.appendChild(messageEl);
    toast.appendChild(closeBtn);

    // Adicionar ao container
    container.appendChild(toast);

    // Remover automaticamente após duração
    if (duration > 0) {
      setTimeout(() => {
        removeToast(toast);
      }, duration);
    }

    return toast;
  }

  /**
   * Remove um toast
   * @param {HTMLElement} toast - Elemento toast a ser removido
   */
  function removeToast(toast) {
    if (!toast || !toast.parentNode) return;

    toast.classList.add('toast--removing');
    
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }

  // Expor globalmente
  window.showToast = showToast;
})();

