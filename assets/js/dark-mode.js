/**
 * Sistema de Dark Mode - NT Informática
 * Suporta toggle manual e preferência do sistema
 */

const DARK_MODE_KEY = 'nt-informatica-theme';
const DARK_MODE_CLASS = 'dark';

/**
 * Inicializa o sistema de dark mode
 * NOTA: A classe .dark já deve ter sido aplicada pelo script de inicialização (dark-mode-init.js)
 * Esta função apenas configura os listeners e garante sincronização
 */
export function initDarkMode() {
  // Verificar se a classe já foi aplicada pelo script de inicialização
  // Se não foi, aplicar agora (fallback caso o script de inicialização não tenha carregado)
  const html = document.documentElement;
  const hasDarkClass = html.classList.contains(DARK_MODE_CLASS);
  
  // Se a classe não foi aplicada, verificar e aplicar (fallback)
  if (!hasDarkClass) {
    try {
      const savedTheme = localStorage.getItem(DARK_MODE_KEY);
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Se não há preferência salva, usar preferência do sistema
      // Se há preferência salva, usar ela
      const shouldBeDark = savedTheme === null ? prefersDark : savedTheme === 'dark';
      
      if (shouldBeDark) {
        html.classList.add(DARK_MODE_CLASS);
      } else {
        html.classList.remove(DARK_MODE_CLASS);
      }
    } catch (e) {
      // Fallback: usar preferência do sistema se localStorage não estiver disponível
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        html.classList.add(DARK_MODE_CLASS);
      }
    }
  }
  
  // Aguardar DOM para configurar botão
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupDarkModeListeners);
  } else {
    setupDarkModeListeners();
  }
}

// Variável global para evitar múltiplos listeners
let darkModeClickHandler = null;

/**
 * Configura listeners e botão após DOM estar pronto
 */
function setupDarkModeListeners() {
  // Listener para mudanças na preferência do sistema (se não houver preferência salva)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (localStorage.getItem(DARK_MODE_KEY) === null) {
      applyDarkMode(e.matches);
    }
  });
  
  // Usar event delegation no document - remover listener anterior se existir
  if (darkModeClickHandler) {
    document.removeEventListener('click', darkModeClickHandler);
  }
  
  darkModeClickHandler = (e) => {
    // Verificar se o clique foi no botão ou em algum elemento dentro dele
    const clickedElement = e.target;
    const toggleButton = clickedElement.closest('#dark-mode-toggle') || 
                         (clickedElement.id === 'dark-mode-toggle' ? clickedElement : null) ||
                         clickedElement.closest('.dark-mode-toggle');
    
    if (toggleButton) {
      e.preventDefault();
      e.stopPropagation();
      toggleDarkMode();
    }
  };
  
  document.addEventListener('click', darkModeClickHandler, true); // Usar capture phase
  
  // Também adicionar listener direto no botão quando disponível
  function attachButtonListener() {
    const toggleButton = document.getElementById('dark-mode-toggle');
    if (toggleButton && !toggleButton.hasAttribute('data-listener-attached')) {
      toggleButton.setAttribute('data-listener-attached', 'true');
      toggleButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleDarkMode();
      });
      return true;
    }
    return false;
  }
  
  // Tentar anexar listener várias vezes (caso o partial carregue depois)
  attachButtonListener();
  setTimeout(() => attachButtonListener(), 100);
  setTimeout(() => attachButtonListener(), 500);
  setTimeout(() => attachButtonListener(), 1000);
  
  // Usar MutationObserver para detectar quando o botão for adicionado
  if (document.body) {
    const buttonObserver = new MutationObserver(() => {
      attachButtonListener();
    });
    
    buttonObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Timeout de segurança
    setTimeout(() => buttonObserver.disconnect(), 10000);
  }
  
  // Atualizar ícone do botão quando disponível
  function updateButtonIcon() {
    const toggleButton = document.getElementById('dark-mode-toggle');
    if (toggleButton) {
      updateToggleButtonIcon(isDarkMode());
      return true;
    }
    return false;
  }
  
  // Tentar atualizar ícone várias vezes (caso o partial carregue depois)
  updateButtonIcon();
  setTimeout(() => updateButtonIcon(), 100);
  setTimeout(() => updateButtonIcon(), 500);
  setTimeout(() => updateButtonIcon(), 1000);
  
  // Usar MutationObserver para detectar quando o botão for adicionado
  const observer = new MutationObserver(() => {
    updateButtonIcon();
  });
  
  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Timeout de segurança
    setTimeout(() => observer.disconnect(), 5000);
  }
}

/**
 * Aplica ou remove o dark mode
 */
function applyDarkMode(isDark) {
  const html = document.documentElement;
  
  if (isDark) {
    html.classList.add(DARK_MODE_CLASS);
  } else {
    html.classList.remove(DARK_MODE_CLASS);
  }
  
  // Atualizar ícone do botão
  updateToggleButtonIcon(isDark);
}

/**
 * Alterna entre dark e light mode
 */
function toggleDarkMode() {
  const html = document.documentElement;
  const isDark = html.classList.contains(DARK_MODE_CLASS);
  const newMode = !isDark;
  
  applyDarkMode(newMode);
  
  // Salvar preferência
  localStorage.setItem(DARK_MODE_KEY, newMode ? 'dark' : 'light');
}

/**
 * Atualiza o ícone do botão de toggle
 */
function updateToggleButtonIcon(isDark) {
  const toggleButton = document.getElementById('dark-mode-toggle');
  if (!toggleButton) return;
  
  const iconSun = toggleButton.querySelector('.dark-mode-toggle__icon--sun');
  const iconMoon = toggleButton.querySelector('.dark-mode-toggle__icon--moon');
  
  if (iconSun && iconMoon) {
    if (isDark) {
      iconSun.classList.add('hidden');
      iconMoon.classList.remove('hidden');
    } else {
      iconSun.classList.remove('hidden');
      iconMoon.classList.add('hidden');
    }
  }
}

/**
 * Retorna se o dark mode está ativo
 */
export function isDarkMode() {
  return document.documentElement.classList.contains(DARK_MODE_CLASS);
}

