/**
 * Inicialização do Dark Mode - Deve ser executado ANTES do CSS carregar
 * Este arquivo é servido como estático da pasta public/ para garantir carregamento imediato
 * 
 * IMPORTANTE: Este arquivo deve ser carregado ANTES dos CSS para evitar FOUC
 * Executa imediatamente quando carregado (sem aguardar DOM)
 */
(function () {
  'use strict';
  
  // Executar IMEDIATAMENTE, sem aguardar nada
  try {
    const savedTheme = localStorage.getItem('nt-informatica-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // Se não há preferência salva, usar preferência do sistema
    // Se há preferência salva, usar ela
    const shouldBeDark = savedTheme === null ? prefersDark : savedTheme === 'dark';
    const html = document.documentElement;
    
    if (shouldBeDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  } catch (e) {
    // Fallback: usar preferência do sistema se localStorage não estiver disponível
    try {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      }
      console.error('[Dark Mode Init] Erro:', e.message, {
        prefersDark: prefersDark,
        hasDarkClass: document.documentElement.classList.contains('dark')
      });
    } catch (e2) {
      // Se tudo falhar, não fazer nada (CSS vai usar @media como fallback)
      console.error('[Dark Mode Init] Erro crítico:', e2.message);
    }
  }
})();

