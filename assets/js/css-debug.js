// Debug: Verificar se CSS está carregando
(function() {
  'use strict';
  
  function checkCSS() {
    const testEl = document.createElement('div');
    testEl.id = 'css-debug-indicator';
    testEl.style.cssText = 'position:fixed;top:10px;right:10px;background:#ef4444;color:#fff;padding:15px;z-index:999999;font-size:12px;border-radius:4px;max-width:350px;box-shadow:0 4px 6px rgba(0,0,0,0.3);font-family:monospace;';
    
    const computedStyle = window.getComputedStyle(document.body);
    const fontFamily = computedStyle.fontFamily || '';
    const color = computedStyle.color || '';
    
    // Verificar se há link CSS no documento
    const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
    const viteCssLink = Array.from(cssLinks).find(link => 
      link.href && (link.href.includes('/assets/') || link.href.includes('style-'))
    );
    
    console.log('[DEBUG CSS] Font family:', fontFamily);
    console.log('[DEBUG CSS] Color:', color);
    console.log('[DEBUG CSS] CSS Links encontrados:', cssLinks.length);
    
    if (viteCssLink) {
      console.log('[DEBUG CSS] Link CSS do Vite:', viteCssLink.href);
      console.log('[DEBUG CSS] Link CSS completo:', viteCssLink.outerHTML);
      
      // Verificar se tem crossorigin (pode estar bloqueando)
      const hasCrossorigin = viteCssLink.hasAttribute('crossorigin');
      console.log('[DEBUG CSS] Tem crossorigin:', hasCrossorigin);
      
      // Se tiver crossorigin, remover
      if (hasCrossorigin) {
        console.log('[DEBUG CSS] Removendo crossorigin do link CSS...');
        viteCssLink.removeAttribute('crossorigin');
        console.log('[DEBUG CSS] Crossorigin removido!');
      }
      
      // Verificar se o CSS carregou
      const linkSheet = viteCssLink.sheet || viteCssLink.styleSheet;
      console.log('[DEBUG CSS] CSS Sheet:', linkSheet ? 'Existe' : 'Não existe');
      
      // Se o link aponta para SCSS, tentar encontrar o CSS compilado
      let cssHref = viteCssLink.href;
      if (cssHref.includes('main.scss')) {
        // Tentar encontrar o CSS compilado
        const cssFiles = Array.from(cssLinks).filter(link => 
          link.href && link.href.includes('style-') && link.href.endsWith('.css')
        );
        if (cssFiles.length > 0) {
          cssHref = cssFiles[0].href;
          console.log('[DEBUG CSS] CSS compilado encontrado:', cssHref);
        } else {
          // Tentar construir o caminho do CSS compilado
          const basePath = cssHref.substring(0, cssHref.lastIndexOf('/'));
          cssHref = basePath + '/style-BY4pF7rG.css'; // Nome padrão do Vite
          console.log('[DEBUG CSS] Tentando CSS compilado:', cssHref);
        }
      }
      
      // Tentar verificar se o arquivo existe
      fetch(cssHref, { method: 'HEAD' })
        .then(response => {
          console.log('[DEBUG CSS] Fetch response:', response.status, response.statusText, cssHref);
          if (response.ok) {
            testEl.innerHTML = '⚠️ CSS NÃO CARREGADO<br><br>' +
              '<strong>Font:</strong> ' + (fontFamily || 'undefined') + '<br>' +
              '<strong>Color:</strong> ' + (color || 'undefined') + '<br><br>' +
              '<strong>CSS Link:</strong><br>' +
              cssHref + '<br><br>' +
              '✅ Arquivo existe (Status: ' + response.status + ')<br>' +
              '❌ Mas CSS não aplicado!<br><br>' +
              (hasCrossorigin ? '⚠️ Crossorigin removido!' : '');
            testEl.style.background = '#f59e0b';
            
            // Tentar carregar CSS manualmente sem crossorigin
            const testLink = document.createElement('link');
            testLink.rel = 'stylesheet';
            testLink.href = cssHref;
            testLink.onerror = function() {
              console.error('[DEBUG CSS] Erro ao carregar CSS manualmente');
            };
            testLink.onload = function() {
              console.log('[DEBUG CSS] CSS carregado manualmente com sucesso!');
              testEl.style.background = '#10b981';
              testEl.innerHTML = '✅ CSS CARREGADO MANUALMENTE<br>Recarregue a página';
              setTimeout(function() {
                testEl.remove();
              }, 5000);
            };
            document.head.appendChild(testLink);
          } else {
            testEl.innerHTML = '❌ Arquivo não encontrado (Status: ' + response.status + ')<br>' + cssHref;
          }
        })
        .catch(error => {
          console.error('[DEBUG CSS] Erro ao verificar CSS:', error);
          testEl.innerHTML = '❌ Erro ao verificar: ' + error.message;
        });
    } else {
      testEl.innerHTML = '❌ Link CSS do Vite não encontrado!';
    }
    
    // Verificar se CSS foi aplicado (font não é serif padrão)
    const isCSSLoaded = fontFamily && 
                       !fontFamily.includes('serif') && 
                       fontFamily !== 'initial' &&
                       fontFamily !== '';
    
    if (!isCSSLoaded && viteCssLink) {
      document.body.appendChild(testEl);
    } else if (isCSSLoaded) {
      testEl.style.background = '#10b981';
      testEl.innerHTML = '✅ CSS CARREGADO<br>Font: ' + fontFamily.substring(0, 40);
      document.body.appendChild(testEl);
      setTimeout(function() {
        testEl.remove();
      }, 3000);
    }
  }
  
  // Executar após DOM carregar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkCSS);
  } else {
    // DOM já carregou, executar após um pequeno delay para garantir que CSS carregou
    setTimeout(checkCSS, 1000);
  }
})();

