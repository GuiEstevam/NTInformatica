# Template Site Corporativo - Empresas de Tecnologia

> Template profissional e moderno baseado em um caso real de sucesso. Demonstração completa com conteúdo da NT Informática, pronto para customização.

Um template completo, responsivo e otimizado para empresas de tecnologia. Inclui um exemplo funcional completo (NT Informática) que demonstra todas as funcionalidades e pode ser facilmente customizado para sua empresa.

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

## Sobre o Template

Este template inclui um **exemplo completo e funcional** baseado na empresa **NT Informática**, demonstrando todas as funcionalidades em um caso real de uso. Todo o conteúdo pode ser facilmente customizado para sua empresa.

### Exemplo Incluído

O template vem pré-configurado com:

- Conteúdo completo da NT Informática (exemplo)
- Todas as páginas funcionais
- Formulários configurados
- Estrutura de navegação completa
- SEO e meta tags configurados

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

1. **Textos**: Edite diretamente os arquivos HTML (substitua "NT Informática" pelo nome da sua empresa)
2. **Imagens**: Substitua as imagens em `assets/images/`
3. **Serviços**: Edite a seção de serviços em `servicos.html`
4. **Formulário**: Configure o endpoint em `assets/js/contact-form.js`
5. **Meta Tags**: Atualize as meta tags em cada arquivo HTML

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

Este template é distribuído sob uma **Licença Proprietária** (All Rights Reserved).

**Copyright (c) 2025 Guilherme Estevam de Lima** - Todos os direitos reservados.

### Termos de Uso

- **Uso único por projeto**: Cada compra permite o uso em um único projeto/website
- **Proibida redistribuição**: Não é permitido revender, redistribuir ou compartilhar o código-fonte
- **Modificações permitidas**: Você pode modificar o template para seu próprio uso
- **Uso comercial permitido**: Pode ser usado em projetos comerciais e pessoais

Para uso em múltiplos projetos ou licenciamento empresarial, entre em contato: **contato.estevamdelima@gmail.com**

**Consulte o arquivo `LICENSE` para os termos completos da licença.**

## Suporte

Para dúvidas, sugestões ou customizações, entre em contato:

**Email**: contato.estevamdelima@gmail.com

## Documentação

Documentação técnica detalhada disponível na pasta `docs/` (não versionada).

---

**Copyright (c) 2025 Guilherme Estevam de Lima**  
**Desenvolvido para empresas de tecnologia**

Para informações sobre licenciamento: contato.estevamdelima@gmail.com
