import { defineConfig } from 'vite';
import { resolve } from 'path';
import vitePluginPartial from 'vite-plugin-partial';

// Determinar base path baseado no ambiente
// '/NTInformatica/' para produção (subpasta no GitHub Pages)
// './' para desenvolvimento local
const isProduction = process.env.NODE_ENV === 'production';
const basePath = isProduction ? '/NTInformatica/' : './';

export default defineConfig({
  root: '.',
  // Base path configurado dinamicamente
  base: basePath,
  plugins: [
    vitePluginPartial.default ? vitePluginPartial.default() : vitePluginPartial(),
    // Plugin para remover crossorigin do CSS (pode causar problemas no GitHub Pages)
    {
      name: 'remove-css-crossorigin',
      enforce: 'post', // Executar depois de outros plugins
      transformIndexHtml: {
        enforce: 'post',
        transform(html, context) {
          // Remover crossorigin do link CSS em produção
          if (isProduction) {
            // Remover crossorigin de qualquer link stylesheet (qualquer ordem de atributos)
            let result = html.replace(
              /<link([^>]*rel=["']stylesheet["'][^>]*)\s+crossorigin=["'][^"']*["']([^>]*)>/gi,
              '<link$1$2>'
            );
            result = result.replace(
              /<link([^>]*)crossorigin=["'][^"']*["']\s+([^>]*rel=["']stylesheet["'][^>]*)>/gi,
              '<link$1$2>'
            );
            // Limpar espaços duplos e quebras de linha
            result = result.replace(/\s+/g, ' ').replace(/>\s+</g, '><');
            return result;
          }
          return html;
        }
      }
    }
  ],
  css: {
    preprocessorOptions: {
      scss: {
        // Usar modern-compiler para evitar warnings de legacy API
        api: 'modern-compiler'
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        servicos: resolve(__dirname, 'servicos.html'),
        sobre: resolve(__dirname, 'sobre.html'),
        contato: resolve(__dirname, 'contato.html')
      }
    },
    cssCodeSplit: false
  },
  publicDir: 'public',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'assets')
    }
  },
  server: {
    port: 3000,
    open: true,
    // Configurar para servir corretamente em subpastas
    middlewareMode: false,
    fs: {
      strict: false
    }
  }
});

