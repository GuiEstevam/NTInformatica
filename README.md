# Template Site Corporativo - Empresas de Tecnologia

> Template profissional e moderno para sites corporativos de empresas de tecnologia, suporte técnico e soluções em TI.

Um template completo, responsivo e otimizado para empresas que precisam de um site corporativo profissional com foco em apresentação de serviços, portfólio e captação de leads.

## Características Principais

### Design e UX

- **Design Moderno e Minimalista** - Estilo tech inspirado em grandes marcas, com paleta azul tech + preto/branco
- **Totalmente Responsivo** - Mobile-first, otimizado para todos os dispositivos
- **Dark Mode Nativo** - Suporte automático com detecção de preferência do sistema
- **Animações Suaves** - Transições e animações otimizadas para performance
- **Acessibilidade Completa** - WCAG AA, ARIA labels, navegação por teclado

### Funcionalidades

- **Formulário de Contato Completo** - Validação robusta, integração com Formspree/EmailJS
- **Sistema de Toast Global** - Notificações elegantes e não-intrusivas
- **SEO Otimizado** - Meta tags, Open Graph, Twitter Cards, Schema.org
- **Performance Otimizada** - Lazy loading, código modular, build otimizado
- **4 Páginas Completas** - Home, Sobre, Serviços e Contato

### Tecnologias Modernas

- **Vite 5** - Build tool rápido e moderno
- **SASS Moderno** - Sintaxe `@use` (não deprecated)
- **ES6+ Modules** - JavaScript modular e organizado
- **TypeScript Ready** - Estrutura preparada para migração

## Pré-requisitos

- Node.js 18+
- npm ou yarn

## Instalação

```bash
# Clone o repositório
git clone <seu-repositorio>

# Instale as dependências
npm install
```

## Desenvolvimento

```bash
# Inicie o servidor de desenvolvimento
npm run dev
```

O site estará disponível em `http://localhost:3000`

## Build para Produção

```bash
# Gere o build otimizado
npm run build
```

Os arquivos compilados estarão em `dist/` prontos para deploy em:

- GitHub Pages
- Netlify
- Vercel
- Qualquer servidor estático

## Estrutura do Projeto

```
template-site-corporativo/
├── index.html              # Página inicial (one-page)
├── servicos.html           # Página de serviços
├── sobre.html              # Página sobre a empresa
├── contato.html            # Página de contato
├── assets/
│   ├── css/                # Estilos CSS compilados
│   ├── js/                 # JavaScript modular
│   │   ├── app.js          # Entry point
│   │   ├── contact-form.js # Formulário de contato
│   │   ├── navigation.js   # Navegação
│   │   └── utils/          # Utilitários
│   ├── sass/               # Fonte SASS (modular)
│   └── images/             # Imagens e assets
├── partials/                # Componentes HTML reutilizáveis
│   ├── header.html
│   └── footer.html
├── public/                 # Arquivos públicos
└── dist/                   # Build de produção
```

## Customização

### Cores e Identidade Visual

As variáveis de cores estão em `assets/css/variables.css`:

```css
:root {
 --color-blue-primary: #0066cc;
 --color-blue-light: #0080ff;
 --color-accent: #00a8ff;
 /* ... */
}
```

### Conteúdo

1. **Textos**: Edite diretamente os arquivos HTML
2. **Imagens**: Substitua as imagens em `assets/images/`
3. **Serviços**: Edite a seção de serviços em `servicos.html`
4. **Formulário**: Configure o endpoint em `assets/js/contact-form.js`

### Configuração do Formulário

Edite `assets/js/contact-form.js` e configure o endpoint:

```javascript
const FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
// ou
const FORM_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send';
```

## Páginas Incluídas

### Home (`index.html`)

- Hero section com CTA
- Resumo de serviços
- Sobre a empresa
- Diferenciais/benefícios
- Depoimentos
- CTA de contato

### Serviços (`servicos.html`)

- Catálogo completo de serviços
- Processo de trabalho
- Planos e pacotes
- Casos de sucesso
- FAQ

### Sobre (`sobre.html`)

- História da empresa
- Timeline de marcos
- Estatísticas
- Missão, visão e valores
- CTA de contato

### Contato (`contato.html`)

- Canais de atendimento
- Formulário completo
- Informações de contato
- SLA e horários
- Cobertura geográfica
- FAQ

## Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilos modernos com variáveis CSS
- **SASS** - Pré-processador CSS (sintaxe moderna)
- **JavaScript ES6+** - Código modular e moderno
- **Vite 5** - Build tool e dev server
- **Font Awesome 6** - Ícones de marcas e redes sociais
- **Ionicons 7** - Ícones modernos para UI

## Responsividade

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## Acessibilidade

- WCAG AA compliant
- ARIA labels em todos os elementos interativos
- Navegação por teclado completa
- Suporte a screen readers
- Contraste adequado
- Skip links
- Suporte a `prefers-reduced-motion`

## Performance

- Lazy loading de imagens
- Animações otimizadas com `will-change`
- CSS e JS modularizados
- Build otimizado com Vite
- Fontes otimizadas (apenas Inter)

## SEO

- Meta tags completas
- Open Graph tags
- Twitter Cards
- Schema.org (LocalBusiness)
- Sitemap ready
- URLs amigáveis

## Ideal Para

- Empresas de suporte técnico
- Empresas de tecnologia
- Prestadores de serviços em TI
- Consultorias em tecnologia
- Empresas de segurança da informação
- Provedores de serviços cloud

## Licença

Este template está disponível para comercialização. Consulte os termos de licença para mais informações.

## Suporte

Para dúvidas, sugestões ou customizações, entre em contato através dos canais disponíveis.

## Documentação

Documentação técnica detalhada disponível na pasta `docs/` (não versionada).

---

**Desenvolvido para empresas de tecnologia**
