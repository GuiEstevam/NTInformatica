/**
 * FAQ Accordion - NT Informática
 */

function closeFaqItem(item) {
 const trigger = item.querySelector('.faq-item__trigger');
 const content = item.querySelector('.faq-item__content');

 if (!trigger || !content) return;

  if (item._faqResizeObserver) {
    item._faqResizeObserver.disconnect();
    item._faqResizeObserver = null;
  }

 trigger.setAttribute('aria-expanded', 'false');
 item.classList.remove('is-open');
 content.style.maxHeight = null;
}

function openFaqItem(item) {
 const trigger = item.querySelector('.faq-item__trigger');
 const content = item.querySelector('.faq-item__content');

 if (!trigger || !content) return;

 trigger.setAttribute('aria-expanded', 'true');
 item.classList.add('is-open');
 content.style.maxHeight = `${content.scrollHeight}px`;

 // Atualiza altura quando o conteúdo (imagens, fontes) muda
 const resizeObserver = new ResizeObserver(() => {
  if (item.classList.contains('is-open')) {
   content.style.maxHeight = `${content.scrollHeight}px`;
  }
 });

 resizeObserver.observe(content);

 // Guarda o observer para cancelar depois
 item._faqResizeObserver = resizeObserver;
}

export function initFaqAccordion() {
 const faqItems = document.querySelectorAll('.faq-item');

 if (!faqItems.length) {
  return;
 }

 let activeItem = null;

 faqItems.forEach((item) => {
  const trigger = item.querySelector('.faq-item__trigger');
  const content = item.querySelector('.faq-item__content');

  if (!trigger || !content) {
   return;
  }

  const handleToggle = () => {
   const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

   if (activeItem && activeItem !== item) {
    closeFaqItem(activeItem);
   }

   if (isExpanded) {
    closeFaqItem(item);
    activeItem = null;
    return;
   }

   openFaqItem(item);
   activeItem = item;
  };

  trigger.addEventListener('click', handleToggle);

  trigger.addEventListener('keydown', (event) => {
   if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleToggle();
   }
  });

  closeFaqItem(item);
 });
}

