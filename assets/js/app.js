/**
 * App Principal - NT Informática
 * Entry point da aplicação
 */

import { initNavigation } from './navigation.js';
import { initContactForm } from './contact-form.js';
import { initScrollAnimations } from './scroll-animations.js';
import { initPageTransitions } from './page-transitions.js';

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
  
  console.log('NT Informática - Site carregado com sucesso');
});

