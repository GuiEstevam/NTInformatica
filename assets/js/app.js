/**
 * App Principal - NT Informática
 * Entry point da aplicação
 */

import { initNavigation } from './navigation.js';
import { initContactForm } from './contact-form.js';
import { initScrollAnimations } from './scroll-animations.js';
import { initPageTransitions } from './page-transitions.js';
import { initDarkMode } from './dark-mode.js';
import { initScrollToTop } from './scroll-to-top.js';
import { initFaqAccordion } from './faq.js';

// Inicializar dark mode IMEDIATAMENTE para evitar flash (executa antes do DOM)
initDarkMode();

// Aguardar DOM carregar
document.addEventListener('DOMContentLoaded', () => {
 // Inicializar transições de página (deve ser primeiro)
 initPageTransitions();

 // Inicializar navegação
 initNavigation();

 // Inicializar formulário de contato
 initContactForm();

 // Inicializar animações de scroll
 initScrollAnimations();

 // Inicializar botão voltar ao topo
 initScrollToTop();

 // Inicializar FAQ (apenas onde existir)
 initFaqAccordion();

 console.log('NT Informática - Site carregado com sucesso');
});
