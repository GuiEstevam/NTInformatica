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
      // Validar campo quando o usuário sai dele
      validateField(input);
    });

    input.addEventListener('input', () => {
      // Limpar erro enquanto o usuário digita
      clearFieldError(input);
    });

    // Validar também quando o campo perde o foco após ter sido tocado
    input.addEventListener('focus', () => {
      // Marcar que o campo foi tocado
      input.dataset.touched = 'true';
    });
  });

  // Validação em tempo real para checkboxes de serviços
  const servicosCheckboxes = form.querySelectorAll('input[name="servicos"]');
  servicosCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const servicosSelecionados = Array.from(servicosCheckboxes).filter(cb => cb.checked);
      const servicosError = document.getElementById('servicos-error');
      const fieldset = form.querySelector('fieldset[aria-labelledby="servicos-label"]');
      
      if (servicosSelecionados.length > 0) {
        if (servicosError) {
          servicosError.classList.remove('form-error--show');
          servicosError.textContent = '';
        }
        if (fieldset) {
          fieldset.classList.remove('form-fieldset--error');
        }
      }
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

    // Validar serviços de interesse (pelo menos um checkbox selecionado)
    const servicosCheckboxes = form.querySelectorAll('input[name="servicos"]');
    const servicosSelecionados = Array.from(servicosCheckboxes).filter(cb => cb.checked);
    const servicosError = document.getElementById('servicos-error');
    
    if (servicosSelecionados.length === 0) {
      isValid = false;
      if (servicosError) {
        servicosError.textContent = 'Selecione pelo menos um serviço de interesse.';
        servicosError.classList.add('form-error--show');
      }
      // Adicionar classe de erro no fieldset
      const fieldset = form.querySelector('fieldset[aria-labelledby="servicos-label"]');
      if (fieldset) {
        fieldset.classList.add('form-fieldset--error');
      }
    } else {
      if (servicosError) {
        servicosError.classList.remove('form-error--show');
        servicosError.textContent = '';
      }
      const fieldset = form.querySelector('fieldset[aria-labelledby="servicos-label"]');
      if (fieldset) {
        fieldset.classList.remove('form-fieldset--error');
      }
    }

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
      // Coletar e sanitizar dados do formulário
      const formData = new FormData(form);
      const data = {};

      formData.forEach((value, key) => {
        if (key === 'servicos') {
          if (!Array.isArray(data.servicos)) {
            data.servicos = [];
          }
          data.servicos.push(escapeHtml((value || '').trim()));
          return;
        }

        if (key === 'consentimento') {
          data.consentimento = true;
          return;
        }

        if (typeof value === 'string') {
          data[key] = escapeHtml(value.trim());
        } else {
          data[key] = value;
        }
      });

      data.consentimento = !!form.querySelector('#consentimento')?.checked;
      if (!Array.isArray(data.servicos)) {
        data.servicos = [];
      }

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
    const tagName = field.tagName.toLowerCase();
    const fieldType = field.type;
    const isRequired = field.hasAttribute('required');

    clearFieldError(field);

    if (fieldType === 'checkbox') {
      if (isRequired && !field.checked) {
        showFieldError(field, 'Este campo é obrigatório.');
        return false;
      }
      return true;
    }

    if (tagName === 'select' && field.multiple) {
      const selected = Array.from(field.selectedOptions).map(option => option.value).filter(Boolean);
      if (isRequired && selected.length === 0) {
        showFieldError(field, 'Selecione pelo menos uma opção.');
        return false;
      }
      return true;
    }

    const value = field.value.trim();

    // Validar campo obrigatório primeiro
    if (isRequired && !validateRequired(value)) {
      showFieldError(field, 'Este campo é obrigatório.');
      return false;
    }

    // Se o campo não é obrigatório e está vazio, é válido
    if (!value) {
      return true;
    }

    // Validar formato de email
    if (fieldType === 'email' && !validateEmail(value)) {
      showFieldError(field, 'Por favor, insira um e-mail válido.');
      return false;
    }

    // Validar formato de telefone
    if (fieldType === 'tel' && !validatePhone(value)) {
      showFieldError(field, 'Por favor, insira um telefone válido.');
      return false;
    }

    const minLength = field.getAttribute('minlength');
    if (minLength && value.length < parseInt(minLength, 10)) {
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
    
    // Adicionar classe de erro baseada no tipo de campo
    const tagName = field.tagName.toLowerCase();
    if (tagName === 'input') {
      field.classList.add('form-input--error');
    } else if (tagName === 'select') {
      field.classList.add('form-select--error');
    } else if (tagName === 'textarea') {
      field.classList.add('form-textarea--error');
    }
    
    const errorElement = getFieldErrorElement(field);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('form-error--show');
    }
  }

  /**
   * Limpa erro do campo
   */
  function clearFieldError(field) {
    field.removeAttribute('aria-invalid');
    
    // Remover todas as classes de erro possíveis
    field.classList.remove('form-input--error', 'form-select--error', 'form-textarea--error');
    
    const errorElement = getFieldErrorElement(field);
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

  function getFieldErrorElement(field) {
    const group = field.closest('.form-group') || field.parentElement;
    if (group) {
      const errorInsideGroup = group.querySelector('.form-error');
      if (errorInsideGroup) {
        return errorInsideGroup;
      }
    }

    if (field.id) {
      const byId = document.getElementById(`${field.id}-error`);
      if (byId) {
        return byId;
      }
    }

    if (field.name) {
      const byName = document.getElementById(`${field.name}-error`);
      if (byName) {
        return byName;
      }
    }

    return null;
  }
}

