import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import vitePluginPartial from 'vite-plugin-partial';

// Obter __dirname em ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Determinar base path baseado no ambiente
// '/' para Vercel (deploy na raiz)
// '/NTInformatica/' para GitHub Pages (subpasta)
// './' para desenvolvimento local
const isProduction = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1';
const basePath = !isProduction ? './' : isVercel ? '/' : '/NTInformatica/';

export default defineConfig({
  root: '.',
  // Base path configurado dinamicamente
  base: basePath,
  plugins: [
    vitePluginPartial.default ? vitePluginPartial.default() : vitePluginPartial(),
    // Plugin completo para garantir que CSS seja servido corretamente
    (() => {
      // Função helper para remover crossorigin de forma robusta
      function removeCrossoriginFromCSS(html) {
        let result = html;
        
        // Padrão 1: crossorigin="anonymous" ou crossorigin='anonymous' depois de rel="stylesheet"
        result = result.replace(
          /<link([^>]*?rel\s*=\s*["']stylesheet["'][^>]*?)\s+crossorigin\s*=\s*["'][^"']*["']\s*([^>]*?)>/gi,
          '<link$1$2>'
        );
        
        // Padrão 2: crossorigin="anonymous" ou crossorigin='anonymous' antes de rel="stylesheet"
        result = result.replace(
          /<link([^>]*?)crossorigin\s*=\s*["'][^"']*["']\s+([^>]*?rel\s*=\s*["']stylesheet["'][^>]*?)>/gi,
          '<link$1$2>'
        );
        
        // Padrão 3: crossorigin sem aspas (crossorigin ou crossorigin=anonymous)
        result = result.replace(
          /<link([^>]*?rel\s*=\s*["']stylesheet["'][^>]*?)\s+crossorigin(?:\s*=\s*["']?[^"'\s>]*["']?)?\s*([^>]*?)>/gi,
          '<link$1$2>'
        );
        
        // Padrão 4: crossorigin sem aspas antes de rel="stylesheet"
        result = result.replace(
          /<link([^>]*?)\s+crossorigin(?:\s*=\s*["']?[^"'\s>]*["']?)?\s+([^>]*?rel\s*=\s*["']stylesheet["'][^>]*?)>/gi,
          '<link$1$2>'
        );
        
        // Padrão 5: crossorigin no meio de outros atributos (mais genérico)
        result = result.replace(
          /<link([^>]*?rel\s*=\s*["']stylesheet["'][^>]*?)\s+crossorigin\s*=\s*["'][^"']*["']([^>]*?)>/gi,
          '<link$1$2>'
        );
        
        // Limpar espaços duplos e espaços antes de >
        result = result.replace(/\s{2,}/g, ' ');
        result = result.replace(/\s+>/g, '>');
        
        return result;
      }

      return {
        name: 'fix-css-for-github-pages',
        enforce: 'post',
        // Processar HTML durante transformação
        transformIndexHtml: {
          enforce: 'post',
          transform(html, ctx) {
            if (isProduction) {
              return removeCrossoriginFromCSS(html);
            }
            return html;
          }
        },
        // Processar após build completo (garantir que todos os HTMLs sejam processados)
        writeBundle(options, bundle) {
          if (isProduction) {
            const jsFiles = Object.keys(bundle).filter(key => key.endsWith('.js'));
            jsFiles.forEach(fileName => {
              const file = bundle[fileName];
              if (file.type === 'chunk' && file.code) {
                if (file.code.includes('.scss') || file.code.includes('main.scss')) {
                  console.error(`[Vite Plugin] ❌ ERRO CRÍTICO: ${fileName} contém referências a .scss!`);
                  console.error(`[Vite Plugin] Isso indica que o Vite não processou o import do SCSS corretamente.`);
                  console.error(`[Vite Plugin] O build está INCORRETO e não deve ser deployado!`);
                  process.exit(1);
                }
              }
            });
            
            // Processar todos os arquivos HTML gerados
            const htmlFiles = ['index.html', 'servicos.html', 'sobre.html', 'contato.html'];
            
            htmlFiles.forEach(fileName => {
              const filePath = resolve(__dirname, 'dist', fileName);
              
              if (existsSync(filePath)) {
                let html = readFileSync(filePath, 'utf-8');
                
                // Verificar se há referências a .scss (não deveria ter)
                if (html.includes('.scss') || html.includes('main.scss')) {
                  console.error(`[Vite Plugin] ❌ ERRO CRÍTICO: ${fileName} contém referências a .scss!`);
                  console.error(`[Vite Plugin] Isso indica que o Vite não processou o import do SCSS corretamente.`);
                  console.error(`[Vite Plugin] O build está INCORRETO e não deve ser deployado!`);
                  // Mostrar onde está a referência
                  const scssMatch = html.match(/[^"']*\.scss[^"']*/gi);
                  if (scssMatch) {
                    console.error(`[Vite Plugin] Referências encontradas:`, scssMatch);
                  }
                  process.exit(1); // Falhar o build se houver referências a SCSS
                }
                
                // Remover crossorigin de CSS usando função helper
                const before = html;
                html = removeCrossoriginFromCSS(html);
                
                if (html !== before) {
                  writeFileSync(filePath, html, 'utf-8');
                }
                
                // VALIDAÇÃO FINAL: Verificar se crossorigin ainda está presente
                const hasCrossorigin = /<link[^>]*rel\s*=\s*["']stylesheet["'][^>]*crossorigin[^>]*>/gi.test(html);
                if (hasCrossorigin) {
                  console.error(`[Vite Plugin] ❌ ERRO CRÍTICO: ${fileName} ainda contém crossorigin após processamento!`);
                  console.error(`[Vite Plugin] O build está INCORRETO e não deve ser deployado!`);
                  process.exit(1); // Falhar o build se crossorigin ainda estiver presente
                }
                
                const cssLinks = html.match(/href=["']([^"']*\.css[^"']*)["']/gi);
                if (!cssLinks || cssLinks.length === 0) {
                  console.warn(`[Vite Plugin] ⚠️ ${fileName} NÃO tem links CSS!`);
                }
              }
            });
          }
        }
      };
    })()
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

