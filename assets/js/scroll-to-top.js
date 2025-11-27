/**
 * Scroll to Top Button - NT Informática
 * Botão flutuante para voltar ao topo da página
 */

export function initScrollToTop() {
  const scrollButton = document.getElementById('scroll-to-top');
  if (!scrollButton) return;

  // Verificar se o usuário prefere movimento reduzido
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Função para mostrar/ocultar botão baseado no scroll
  function toggleScrollButton() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const threshold = 300; // Aparecer após 300px de scroll

    if (scrollY > threshold) {
      scrollButton.classList.add('scroll-to-top--visible');
      scrollButton.disabled = false;
    } else {
      scrollButton.classList.remove('scroll-to-top--visible');
      scrollButton.disabled = true;
    }
  }

  // Função para scroll suave ao topo
  function scrollToTop() {
    if (prefersReducedMotion) {
      // Scroll instantâneo para usuários que preferem movimento reduzido
      window.scrollTo({
        top: 0,
        behavior: 'auto',
      });
    } else {
      // Scroll suave
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }

    // Focar no skip link ou no main content após scroll
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      setTimeout(() => {
        mainContent.focus();
        mainContent.blur(); // Remover foco visual, mas manter acessibilidade
      }, prefersReducedMotion ? 0 : 500);
    }
  }

  // Event listeners
  window.addEventListener('scroll', toggleScrollButton, { passive: true });
  scrollButton.addEventListener('click', scrollToTop);

  // Verificar estado inicial
  toggleScrollButton();
}
