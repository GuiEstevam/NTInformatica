/**
 * Navegação Sticky - NT Informática
 * Menu responsivo com suporte a multi-página
 */

export function initNavigation() {
  const nav = document.getElementById('main-navigation');
  if (!nav) return;

  const navLinks = nav.querySelectorAll('a.nav-link, a.nav__logo');
  const hamburger = nav.querySelector('.nav-hamburger');
  const navMenu = nav.querySelector('.nav-menu');

  // Smooth scroll apenas para âncoras na mesma página
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // Se não tiver href, deixar comportamento padrão
      if (!href) return;
      
      // Se for link externo (http/https), deixar comportamento padrão
      if (href.startsWith('http://') || href.startsWith('https://')) {
        return;
      }
      
      // Se for mailto ou tel, deixar comportamento padrão
      if (href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }

      // Se for link para outra página (com .html ou diferente da atual), deixar comportamento padrão
      const currentPath = window.location.pathname;
      const normalizedCurrentPath = currentPath === '/' || currentPath === '/index.html' ? '/' : currentPath.replace(/\.html$/, '');
      const normalizedHref = href === '/' || href === '/index.html' ? '/' : href.split('#')[0].replace(/\.html$/, '');
      
      // Se for para outra página, deixar comportamento padrão (navegação normal)
      if (normalizedHref !== normalizedCurrentPath) {
        return;
      }

      // Se chegou aqui, é link na mesma página
      // Se tiver âncora (#), fazer smooth scroll
      if (href.includes('#')) {
        const hash = href.split('#')[1];
        const targetElement = document.getElementById(hash);

        if (targetElement) {
          e.preventDefault();
          const navHeight = nav.offsetHeight;
          const targetPosition = targetElement.offsetTop - navHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Fechar menu mobile se aberto
          if (navMenu && navMenu.classList.contains('nav-menu--open')) {
            navMenu.classList.remove('nav-menu--open');
            hamburger?.classList.remove('nav-hamburger--active');
            document.body.style.overflow = '';
          }
        }
      }
      // Se não tiver âncora, deixar comportamento padrão (scroll para topo)
    });
  });

  // Sticky navigation
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      nav.classList.add('nav--sticky');
    } else {
      nav.classList.remove('nav--sticky');
    }

    lastScroll = currentScroll;
  });

  // Menu mobile (hamburger)
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('nav-menu--open');
      hamburger.classList.toggle('nav-hamburger--active');
      document.body.style.overflow = navMenu.classList.contains('nav-menu--open') ? 'hidden' : '';
    });

    // Fechar ao clicar fora
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && navMenu.classList.contains('nav-menu--open')) {
        navMenu.classList.remove('nav-menu--open');
        hamburger.classList.remove('nav-hamburger--active');
        document.body.style.overflow = '';
      }
    });
  }

  // Ativar link da página atual baseado na URL
  function updateActiveLink() {
    const currentPath = window.location.pathname;
    
    navLinks.forEach(link => {
      link.classList.remove('nav-link--active');
      const href = link.getAttribute('href');
      
      if (!href) return;

      // Normalizar paths
      const linkPath = href === '/' || href === '/index.html' ? '/' : href.replace(/\.html$/, '');
      const normalizedCurrentPath = currentPath === '/' || currentPath === '/index.html' ? '/' : currentPath.replace(/\.html$/, '');

      // Ativar link se corresponder à página atual
      if (linkPath === normalizedCurrentPath || 
          (linkPath === '/' && normalizedCurrentPath === '/index.html') ||
          (linkPath === '/index.html' && normalizedCurrentPath === '/')) {
        link.classList.add('nav-link--active');
      }
    });
  }

  // Atualizar link ativo ao carregar a página
  updateActiveLink();

  // Atualizar link ativo ao navegar (para SPAs ou mudanças de hash)
  window.addEventListener('popstate', updateActiveLink);
}
