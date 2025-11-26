/**
 * Formulário de Contato - NT Informática
 * Validação e integração com Formspree/EmailJS
 */

import { validateEmail, validatePhone, validateRequired, escapeHtml } from './utils/validators.js';
import { formatPhone } from './utils/formatters.js';

export function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const inputs = form.querySelectorAll('input, textarea, select');
  const submitButton = form.querySelector('button[type="submit"]');
  
  // Formatação automática de telefone
  const phoneInput = form.querySelector('input[type="tel"]');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      const formatted = formatPhone(e.target.value);
      if (formatted !== e.target.value) {
        e.target.value = formatted;
      }
    });
  }

  // Validação em tempo real
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      validateField(input);
    });

    input.addEventListener('input', () => {
      clearFieldError(input);
    });
  });

  // Submit do formulário
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validar todos os campos
    let isValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });

    if (!isValid) {
      window.showToast('Por favor, preencha todos os campos obrigatórios corretamente.', 'warning', 5000);
      return;
    }

    // Desabilitar botão e inputs, mostrar loading
    submitButton.disabled = true;
    submitButton.classList.add('form-button--loading');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '';
    
    // Desabilitar todos os inputs durante o envio
    inputs.forEach(input => {
      input.disabled = true;
      input.setAttribute('aria-busy', 'true');
    });
    
    // Adicionar classe de loading ao formulário
    form.classList.add('contact-form--loading');

    try {
      // Coletar dados do formulário
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      // Sanitizar dados
      Object.keys(data).forEach(key => {
        if (typeof data[key] === 'string') {
          data[key] = escapeHtml(data[key].trim());
        }
      });

      // Enviar para Formspree (substituir pela URL do seu formulário)
      // Ou usar EmailJS conforme necessário
      const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        window.showToast('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success', 5000);
        form.reset();
        clearAllErrors();
        
        // Feedback visual de sucesso
        form.classList.add('contact-form--success');
        setTimeout(() => {
          form.classList.remove('contact-form--success');
        }, 2000);
      } else {
        throw new Error('Erro ao enviar formulário');
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      window.showToast('Erro ao enviar mensagem. Tente novamente ou entre em contato por telefone.', 'error', 5000);
      
      // Feedback visual de erro
      form.classList.add('contact-form--error');
      setTimeout(() => {
        form.classList.remove('contact-form--error');
      }, 2000);
    } finally {
      // Reabilitar botão e inputs
      submitButton.disabled = false;
      submitButton.classList.remove('form-button--loading');
      submitButton.innerHTML = originalText;
      
      inputs.forEach(input => {
        input.disabled = false;
        input.removeAttribute('aria-busy');
      });
      
      form.classList.remove('contact-form--loading');
    }
  });

  /**
   * Valida um campo
   */
  function validateField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    const fieldType = field.type;
    const errorElement = field.parentElement.querySelector('.form-error');

    clearFieldError(field);

    // Validar obrigatório
    if (isRequired && !validateRequired(value)) {
      showFieldError(field, 'Este campo é obrigatório.');
      return false;
    }

    // Validar e-mail
    if (fieldType === 'email' && value && !validateEmail(value)) {
      showFieldError(field, 'Por favor, insira um e-mail válido.');
      return false;
    }

    // Validar telefone
    if (fieldType === 'tel' && value && !validatePhone(value)) {
      showFieldError(field, 'Por favor, insira um telefone válido.');
      return false;
    }

    // Validar tamanho mínimo
    const minLength = field.getAttribute('minlength');
    if (minLength && value.length < parseInt(minLength)) {
      showFieldError(field, `Este campo deve ter no mínimo ${minLength} caracteres.`);
      return false;
    }

    // Validar tamanho máximo
    const maxLength = field.getAttribute('maxlength');
    if (maxLength && value.length > parseInt(maxLength)) {
      showFieldError(field, `Este campo deve ter no máximo ${maxLength} caracteres.`);
      return false;
    }

    return true;
  }

  /**
   * Mostra erro no campo
   */
  function showFieldError(field, message) {
    field.setAttribute('aria-invalid', 'true');
    field.classList.add('form-input--error');
    
    let errorElement = field.parentElement.querySelector('.form-error');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'form-error';
      errorElement.setAttribute('role', 'alert');
      field.parentElement.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.classList.add('form-error--show');
  }

  /**
   * Limpa erro do campo
   */
  function clearFieldError(field) {
    field.removeAttribute('aria-invalid');
    field.classList.remove('form-input--error');
    
    const errorElement = field.parentElement.querySelector('.form-error');
    if (errorElement) {
      errorElement.classList.remove('form-error--show');
      errorElement.textContent = '';
    }
  }

  /**
   * Limpa todos os erros
   */
  function clearAllErrors() {
    inputs.forEach(input => {
      clearFieldError(input);
    });
  }
}

