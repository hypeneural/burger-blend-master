# Tarefas e Prioridades - BlendLab Burger

Checklist atualizado com foco em UX/UI mobile-first, fluidez e robustez offline.

## P0 - UX/UI mobile-first (prioridade maxima)
- [x] **Resumo dinamico do blend no Builder:** card simples com base principal, status de gordura, alertas e dicas curtas.
- [ ] **Tooltips e micro-explicacoes consistentes:** textos curtos e claros em cada secao (blend, extras, equipamentos, target).
- [x] **Modo conexao lenta:** reduzir animacoes e graficos quando `saveData`/2G; manter experiencia leve.
- [ ] **Transicoes e layout fluido:** manter bottom sheets suaves e CTA sempre visivel sem cobrir conteudo.

## P0 - Offline e baixa conexao (prioridade maxima)
- [x] **Banner offline/baixa conexao:** informar usuario quando estiver sem rede ou com conexao lenta.
- [ ] **Fallback offline de conteudo:** garantir que Wiki, presets e blends abram sem internet.
- [ ] **Modo economia de dados:** esconder animacoes pesadas e explicar por que.

## P0 - Calculadora e explicacoes (core)
- [ ] **Inputs completos do Builder:** moagem (fina/media/grossa + simples/dupla), estilo do burger, alvo de gordura com presets + custom.
- [ ] **Modo avancado por gramas:** permitir editar ingredientes por gramas alem de porcentagem.
- [ ] **Explicacao matematica expandida:** detalhar formula e origem dos dados (fat range por corte).
- [ ] **Alertas inteligentes completos:** Coxao duro > 40% sem gordura, flare-up em grelha, excesso de gordura e ressecamento.

## P1 - Ferramentas e Cooking Mode
- [ ] **Ferramentas reais:** timers, finger test interativo, conversores, checklist de moagem e sal.
- [ ] **Cooking Mode completo:** Wake Lock + botao gigante + voz (Web Speech API) + vibracao.
- [ ] **Fluxo em 3 toques:** reduzir passos para chegar em blend, historico e ferramentas.

## P1 - Viralidade e onboarding
- [ ] **Onboarding rapido (3 telas):** explicar o valor do blend e como usar o app.
- [ ] **Templates de compartilhamento:** cards visuais para Instagram/WhatsApp.
- [ ] **Score simples do blend:** equilibrio/suculencia/textura com dicas de ajuste.

## P1 - Presets e WikiMeat (educacao)
- [ ] **Presets assinados com justificativa:** alvo de gordura, moagem, modo de cocao, por que funciona.
- [ ] **WikiMeat offline com ciencia curta:** Maillard, sal, descanso, flare-up, overworking.
- [ ] **Glossario rapido:** smash, carryover, doneness, etc.

## P2 - Builder visual avancado
- [ ] **Roda de sabores conectada a toppings/molhos reais.**
- [ ] **Stack do hamburguer com regras de estabilidade.**
- [ ] **Personalizacao de paes e molhos com impacto no radar.**

## P2 - Historico, badges e backup
- [ ] **Historico com feedback do usuario:** seco? ajustar gordura automaticamente.
- [ ] **Badges leves:** primeiro smash, alvo 22% perfeito, etc.
- [ ] **Export/import e backup local.**

## P2 - Qualidade e confianca
- [ ] **Acessibilidade:** contraste, targets >= 72px no Cooking Mode, labels.
- [ ] **Telemetria anonima (opcional).**

## P3 - Expansao futura
- [ ] **API de fornecedores:** precos e disponibilidade.
- [ ] **i18n PT/EN.**
- [ ] **Comunidade e ranking.**

## Estado atual (resumo rapido)
- Base de dados robusta com campos tecnicos, temperos inteligentes e pedido ao acougueiro.
- PWA com cache e IndexedDB funcionando, mas sem banner offline/low data.
- Builder com stepper e CTA fixo, mas faltam moagem, estilo e modo por gramas.
