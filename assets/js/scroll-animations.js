/**
 * Animações de Scroll - NT Informática
 * Usa Intersection Observer para animar elementos ao entrarem na viewport
 */

// Verificar suporte para prefers-reduced-motion
const prefersReducedMotion = window.matchMedia(
 '(prefers-reduced-motion: reduce)'
).matches;

// Configuração do Intersection Observer - mais agressivo para carregar junto com o scroll
const observerOptions = {
 root: null,
 rootMargin: '0px 0px -200px 0px', // Iniciar animação quando elemento estiver 200px antes da viewport
 threshold: 0.01, // Muito baixo para detectar elementos assim que começam a aparecer
};

/**
 * Inicializa animações de scroll
 */
/**
 * Função de easing circular (ease-out) para animação suave
 * Retorna um valor entre 0 e 1 baseado no progresso (0 a 1)
 */
function easeOutCirc(t) {
 return Math.sqrt(1 - Math.pow(t - 1, 2));
}

/**
 * Animar contador de números com easing circular suave
 */
function animateCounter(element, target, duration = 2500) {
 const isPercentage = target.includes('%');
 const isPlus = target.includes('+');
 const numericTarget = parseInt(target.replace(/[^0-9]/g, ''));
 const start = 0;
 const startTime = performance.now();

 // Função para formatar número com pontos
 const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
 };

 // Adicionar classe para transição suave
 element.style.transition = 'none';

 const animate = (currentTime) => {
  const elapsed = currentTime - startTime;
  const progress = Math.min(elapsed / duration, 1);
  
  // Aplicar easing circular (começa rápido e desacelera suavemente)
  const easedProgress = easeOutCirc(progress);
  const current = start + (numericTarget - start) * easedProgress;

  let displayValue = Math.floor(current);
  
  // Formatar números grandes (>= 1000) com pontos
  if (displayValue >= 1000) {
   displayValue = formatNumber(displayValue);
  }
  
  if (isPlus) displayValue = `+${displayValue}`;
  if (isPercentage) displayValue = `${displayValue}%`;

  element.textContent = displayValue;

  if (progress < 1) {
   requestAnimationFrame(animate);
  } else {
   // Finalizar animação
   element.textContent = target; // Garantir valor final exato
  }
 };

 requestAnimationFrame(animate);
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
 // Excluir elementos que estão dentro de grupos com stagger-animation (serão animados pelo grupo)
 const fadeInElements = document.querySelectorAll('.fade-in:not(.stagger-animation .fade-in)');
 const slideUpElements = document.querySelectorAll('.slide-up:not(.stagger-animation .slide-up)');
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

      // Animar também os elementos filhos com fade-in e slide-up dentro do grupo IMEDIATAMENTE
      // (sem delay adicional para que apareçam junto com o scroll)
      const childFadeInElements = entry.target.querySelectorAll('.fade-in');
      const childSlideUpElements = entry.target.querySelectorAll('.slide-up');
      
      childFadeInElements.forEach((child) => {
       // Animar imediatamente quando o grupo pai for animado
       child.classList.add('animate-in');
      });
      
      childSlideUpElements.forEach((child) => {
       // Animar imediatamente quando o grupo pai for animado
       child.classList.add('animate-in');
      });

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
     
     // Adicionar classe para ativar animação CSS
     entry.target.classList.add('counting');
     
     // Iniciar animação do contador
     animateCounter(entry.target, target, 2500);
     
     // Remover classe após animação
     setTimeout(() => {
      entry.target.classList.remove('counting');
     }, 2500);
     
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
