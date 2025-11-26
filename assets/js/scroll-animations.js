/**
 * Animações de Scroll - NT Informática
 * Usa Intersection Observer para animar elementos ao entrarem na viewport
 */

// Verificar suporte para prefers-reduced-motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Configuração do Intersection Observer
const observerOptions = {
  root: null,
  rootMargin: '0px 0px -50px 0px', // Iniciar animação quando elemento estiver 50px antes da viewport
  threshold: 0.1
};

/**
 * Inicializa animações de scroll
 */
export function initScrollAnimations() {
  if (prefersReducedMotion) {
    // Se o usuário prefere movimento reduzido, apenas remover classes de animação
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .stagger-animation');
    animatedElements.forEach(el => {
      el.classList.add('animate-in');
    });
    return;
  }

  // Criar observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        // Opcional: parar de observar após animar (melhor performance)
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observar elementos com classes de animação
  const fadeInElements = document.querySelectorAll('.fade-in');
  const slideUpElements = document.querySelectorAll('.slide-up');
  const staggerElements = document.querySelectorAll('.stagger-animation');

  [...fadeInElements, ...slideUpElements, ...staggerElements].forEach(el => {
    observer.observe(el);
  });

  // Para elementos com stagger (animação progressiva)
  if (staggerElements.length > 0) {
    const staggerObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Adicionar delay progressivo
          setTimeout(() => {
            entry.target.classList.add('animate-in');
          }, index * 100); // 100ms de delay entre cada elemento
          staggerObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    staggerElements.forEach(el => {
      staggerObserver.observe(el);
    });
  }
}

// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollAnimations);
} else {
  initScrollAnimations();
}

