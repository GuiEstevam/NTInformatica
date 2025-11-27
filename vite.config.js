import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import vitePluginPartial from 'vite-plugin-partial';

// Obter __dirname em ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
    // Plugin completo para garantir que CSS seja servido corretamente
    {
      name: 'fix-css-for-github-pages',
      enforce: 'post',
      // Processar HTML durante transformação
      transformIndexHtml: {
        enforce: 'post',
        transform(html, ctx) {
          if (isProduction) {
            // Remover crossorigin de links stylesheet (múltiplos padrões)
            let result = html;
            
            // Padrão 1: crossorigin depois de rel="stylesheet"
            result = result.replace(
              /<link([^>]*?rel\s*=\s*["']stylesheet["'][^>]*?)\s+crossorigin\s*=\s*["'][^"']*["']\s*([^>]*?)>/gi,
              '<link$1$2>'
            );
            
            // Padrão 2: crossorigin antes de rel="stylesheet"
            result = result.replace(
              /<link([^>]*?)crossorigin\s*=\s*["'][^"']*["']\s+([^>]*?rel\s*=\s*["']stylesheet["'][^>]*?)>/gi,
              '<link$1$2>'
            );
            
            // Padrão 3: crossorigin sem aspas
            result = result.replace(
              /<link([^>]*?rel\s*=\s*["']stylesheet["'][^>]*?)\s+crossorigin\s*([^>]*?)>/gi,
              '<link$1$2>'
            );
            
            // Limpar espaços duplos
            result = result.replace(/\s{2,}/g, ' ');
            
            return result;
          }
          return html;
        }
      },
      // Processar após build completo (garantir que todos os HTMLs sejam processados)
      writeBundle(options, bundle) {
        if (isProduction) {
          // Processar todos os arquivos HTML gerados
          const htmlFiles = ['index.html', 'servicos.html', 'sobre.html', 'contato.html'];
          
          htmlFiles.forEach(fileName => {
            const filePath = resolve(__dirname, 'dist', fileName);
            
            if (existsSync(filePath)) {
              let html = readFileSync(filePath, 'utf-8');
              
              // Remover crossorigin de CSS
              const before = html;
              html = html.replace(
                /<link([^>]*?rel\s*=\s*["']stylesheet["'][^>]*?)\s+crossorigin\s*=\s*["'][^"']*["']\s*([^>]*?)>/gi,
                '<link$1$2>'
              );
              html = html.replace(
                /<link([^>]*?)crossorigin\s*=\s*["'][^"']*["']\s+([^>]*?rel\s*=\s*["']stylesheet["'][^>]*?)>/gi,
                '<link$1$2>'
              );
              
              if (html !== before) {
                html = html.replace(/\s{2,}/g, ' ');
                writeFileSync(filePath, html, 'utf-8');
                console.log(`[Vite Plugin] Crossorigin removido de ${fileName}`);
              }
            }
          });
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
    // Configurações para evitar crossorigin desnecessário
    assetsInlineLimit: 0, // Não inline assets pequenos
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        servicos: resolve(__dirname, 'servicos.html'),
        sobre: resolve(__dirname, 'sobre.html'),
        contato: resolve(__dirname, 'contato.html')
      },
      output: {
        // Configurar para não adicionar crossorigin automaticamente
        assetFileNames: (assetInfo) => {
          // CSS deve ser servido sem crossorigin
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
    cssCodeSplit: false,
    // Minificar mas manter estrutura legível para debug
    minify: isProduction ? 'esbuild' : false
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

