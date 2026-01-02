# BlendLab Burger

Criado por Anderson Marques Vieira da Hype Neural para amadores de hamburguer apaixonados e profissionais.

BlendLab Burger e um app mobile-first para criar blends de carne com precisao tecnica e linguagem simples, mantendo o foco em suculencia, textura e resultado final. O app funciona offline, entrega explicacoes claras e guia o usuario do blend ate a receita completa.

## Objetivo
- Ajudar qualquer pessoa a montar blends profissionais com alvo de gordura correto.
- Ensinar o "por que" de cada escolha (cortes, gordura, moagem e preparo).
- Entregar uma receita completa com lista de compras e pedido ao acougueiro.

## Publico-alvo
- Amadores que querem acertar o hamburger na primeira tentativa.
- Chefs, churrasqueiros e profissionais que precisam de repeticao e qualidade.

## Principais funcionalidades
- Builder de blend com stepper, alvo de gordura e alertas tecnicos.
- Selecionar cortes, ajustar percentuais e ver gordura em tempo real.
- Extras separados do % principal (bacon, queijo, tutano, etc).
- Temperos sugeridos por corte com personalizacao manual.
- Relatorio final com lista de compras e pedido ao acougueiro.
- Graficos (donut de gordura e radar de sabor).
- Salvar blends e historico local (IndexedDB).
- PWA offline-first com cache de conteudo.
- Modo de conexao lenta com reducao de animacoes.

## Stack tecnica
- React + TypeScript + Vite
- UI: Tailwind CSS + shadcn/ui + Radix
- Estado global: Zustand
- Persistencia: IndexedDB (Dexie)
- Graficos: Recharts (donut + radar)
- Animacoes: Framer Motion
- PWA: vite-plugin-pwa (service worker)
- Exportacao: html2canvas + jsPDF + Web Share API
- Icones: Lucide

## Estrutura do projeto
- `src/pages`: telas principais e fluxo do app.
- `src/components`: componentes de UI e blocos do Builder.
- `src/data`: cuts, ingredientes, temperos e presets (seed local).
- `src/domain`: regras e logica do blend (engine de calculos e temperos).
- `src/lib`: helpers, matematica, storage e utilitarios.
- `src/store`: Zustand store para o estado do app.
- `src/hooks`: hooks utilitarios (wake lock, network status, etc).

## Dados e calculos
- Gordura calculada por media ponderada dos ingredientes.
- Alvo de gordura com Target Lock e sugestao automatica de ajuste.
- Estimativa nutricional por hamburger (calorias, proteina, gordura).
- Alertas inteligentes (magro, excesso, risco de flare-up, etc).

## Offline e baixa conexao
- Conteudo de cuts, ingredientes e presets salva em IndexedDB.
- PWA instalavel com cache de assets e dados.
- Banner de offline e de conexao lenta.
- Reducao de animacoes em modo economia de dados.

## UX/UI mobile-first
- Interface pensada para celular, com CTA fixo e stepper.
- Cards com resumo + "Ler mais" para informacao detalhada.
- Explicacoes curtas com linguagem simples e objetiva.

## Scripts
```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run test
```

## Reset de dados locais
Se precisar limpar os dados locais, apague o IndexedDB `blendMasterDB` no navegador.

## Roadmap
Consulte `tarefas.md` para o backlog e prioridades.

## Creditos
BlendLab Burger e uma criacao de Anderson Marques Vieira (Hype Neural).
