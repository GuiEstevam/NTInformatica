/**
 * Animações de Scroll - NT Informática
 * Usa Intersection Observer para animar elementos ao entrarem na viewport
 */

// Verificar suporte para prefers-reduced-motion
const prefersReducedMotion = window.matchMedia(
 '(prefers-reduced-motion: reduce)'
).matches;

// Configuração do Intersection Observer
const observerOptions = {
 root: null,
 rootMargin: '0px 0px -80px 0px', // Iniciar animação quando elemento estiver 80px antes da viewport (mais cedo = mais suave)
 threshold: 0.15, // Aumentado para iniciar quando mais visível
};

/**
 * Inicializa animações de scroll
 */
/**
 * Animar contador de números
 */
function animateCounter(element, target, duration = 2000) {
 const isPercentage = target.includes('%');
 const isPlus = target.includes('+');
 const numericTarget = parseInt(target.replace(/[^0-9]/g, ''));
 const start = 0;
 const increment = numericTarget / (duration / 16); // 60fps
 let current = start;

 // Função para formatar número com pontos
 const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
 };

 const timer = setInterval(() => {
  current += increment;
  if (current >= numericTarget) {
   current = numericTarget;
   clearInterval(timer);
  }

  let displayValue = Math.floor(current);
  
  // Formatar números grandes (>= 1000) com pontos
  if (displayValue >= 1000) {
   displayValue = formatNumber(displayValue);
  }
  
  if (isPlus) displayValue = `+${displayValue}`;
  if (isPercentage) displayValue = `${displayValue}%`;

  element.textContent = displayValue;
 }, 16);
}

export function initScrollAnimations() {
 if (prefersReducedMotion) {
  // Se o usuário prefere movimento reduzido, apenas remover classes de animação
  const animatedElements = document.querySelectorAll(
   '.fade-in, .slide-up, .stagger-animation'
  );
  animatedElements.forEach((el) => {
   el.classList.add('animate-in');
  });
  return;
 }

 // Criar observer
 const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
   if (entry.isIntersecting) {
    entry.target.classList.add('animate-in');

    // Remover will-change após animação para otimizar performance
    setTimeout(() => {
     entry.target.style.willChange = 'auto';
    }, 900); // Duração da animação (0.9s)

    // Opcional: parar de observar após animar (melhor performance)
    observer.unobserve(entry.target);
   }
  });
 }, observerOptions);

 // Observar elementos com classes de animação
 const fadeInElements = document.querySelectorAll('.fade-in');
 const slideUpElements = document.querySelectorAll('.slide-up');
 const staggerElements = document.querySelectorAll('.stagger-animation');

 [...fadeInElements, ...slideUpElements, ...staggerElements].forEach((el) => {
  observer.observe(el);
 });

 // Para elementos com stagger (animação progressiva)
 if (staggerElements.length > 0) {
  const staggerObserver = new IntersectionObserver((entries) => {
   entries.forEach((entry) => {
    if (entry.isIntersecting) {
     // Adicionar delay progressivo baseado na ordem no DOM
     const index = Array.from(staggerElements).indexOf(entry.target);
     // Delay mais refinado: começa mais rápido e acelera suavemente
     const delay = index * 80; // Reduzido para 80ms (mais fluido)
     setTimeout(() => {
      entry.target.classList.add('animate-in');

      // Remover will-change após animação para otimizar performance
      setTimeout(() => {
       entry.target.style.willChange = 'auto';
      }, 900 + delay); // Duração da animação + delay
     }, delay);
     staggerObserver.unobserve(entry.target);
    }
   });
  }, observerOptions);

  staggerElements.forEach((el) => {
   staggerObserver.observe(el);
  });
 }

 // Animar contadores de estatísticas (hero e stats expandidas)
 const statsNumbers = document.querySelectorAll(
  '.hero__stats-number[data-count], .stats__number[data-count]'
 );
 if (statsNumbers.length > 0) {
  const statsObserver = new IntersectionObserver((entries) => {
   entries.forEach((entry) => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
     const target = entry.target.textContent.trim();
     entry.target.dataset.animated = 'true';
     animateCounter(entry.target, target, 2000);
     statsObserver.unobserve(entry.target);
    }
   });
  }, observerOptions);

  statsNumbers.forEach((el) => {
   statsObserver.observe(el);
  });
 }
}

// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
 document.addEventListener('DOMContentLoaded', initScrollAnimations);
} else {
 initScrollAnimations();
}
