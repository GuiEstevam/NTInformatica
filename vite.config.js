import { defineConfig } from 'vite';
import { resolve } from 'path';
import vitePluginPartial from 'vite-plugin-partial';

// Determinar base path
// Usar caminho relativo para funcionar em qualquer subpasta
const basePath = './';

export default defineConfig({
  root: '.',
  // Base path: '/NTInformatica/' para produção (subpasta no GitHub Pages)
  // './' para desenvolvimento local
  base: basePath,
  plugins: [
    vitePluginPartial.default ? vitePluginPartial.default() : vitePluginPartial(),
    // Plugin para substituir caminhos relativos de public files com base path em produção
    {
      name: 'replace-public-paths',
      transformIndexHtml(html) {
        if (process.env.NODE_ENV === 'production' && basePath !== './') {
          // Substituir caminhos relativos de arquivos public por caminhos absolutos
          return html.replace(
            /src="\.\/js\/([^"]+)"/g,
            `src="${basePath}js/$1"`
          );
        }
        return html;
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

