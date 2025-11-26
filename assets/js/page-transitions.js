/**
 * Transições de Página - NT Informática
 * Fade-out ao sair e fade-in ao entrar
 */

// Verificar suporte para prefers-reduced-motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Inicializa transições de página
 */
export function initPageTransitions() {
  if (prefersReducedMotion) {
    return; // Não aplicar transições se o usuário prefere movimento reduzido
  }

  // Adicionar classe de fade-in ao carregar a página
  document.body.classList.add('page-loading');
  
  // Fade-in ao carregar
  window.addEventListener('load', () => {
    document.body.classList.remove('page-loading');
    document.body.classList.add('page-loaded');
  });

  // Fade-out ao clicar em links internos
  const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]');
  
  internalLinks.forEach(link => {
    // Ignorar links com hash (âncoras)
    if (link.getAttribute('href')?.includes('#')) {
      return;
    }
    
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // Verificar se é link interno
      if (href && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
        // Fade-out antes de navegar
        document.body.classList.add('page-exiting');
        
        // Aguardar um pouco para a animação
        setTimeout(() => {
          // A navegação acontecerá normalmente
        }, 150);
      }
    });
  });
}

// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPageTransitions);
} else {
  initPageTransitions();
}

