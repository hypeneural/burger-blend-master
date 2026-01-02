# Tarefas e Prioridades - BlendLab Burger

Checklist atualizado conforme o estado atual do app.

## P0 - UX/UI mobile-first (prioridade maxima)
- [x] **Resumo dinamico do blend no Builder** com status de gordura e dicas curtas.
- [x] **Tooltips padronizados** e micro-explicacoes por secao (blend, alvo, moagem, estilo).
- [x] **Modo economia de dados** com reducao de animacoes e graficos ocultos.
- [x] **Ajustes finos de layout** (espacamento e consistencia visual em telas pequenas).
- [x] **Thresholds ajustados** (Smash/Airfryer/Fit/Alto) com base em feedback.
- [x] **Painel de calibracao de alertas** (ajuste manual por feedback real).

## P0 - Offline e baixa conexao (prioridade maxima)
- [x] **Banner offline/baixa conexao** avisando o usuario.
- [x] **Fallback offline completo** (pagina offline + textos especificos).
- [x] **Cache agressivo de conteudo** (Wiki/presets) com validacao.
- [x] **Cache SWR por categoria** (Wiki/presets) + fallback por rota.

## P0 - Builder completo (core do produto)
- [x] **Inputs completos** (moagem, estilo do burger, alvo com presets + custom, equipamento).
- [x] **Modo avancado por gramas** (editar ingredientes por peso, nao so porcentagem).
- [x] **Normalizar para 100%** ajustando o ultimo item sem arredondamento.
- [x] **Explicacao matematica expandida** no "Por que deu esse numero?".
- [x] **Alertas inteligentes completos** (coxao duro > 40%, flare-up em grelha, etc).
- [x] **Alertas adicionais por equipamento/estilo** (smash/airfryer, fit/alto).

## P1 - Ferramentas e Cooking Mode
- [ ] **Ferramentas reais** (timers, finger test, checklist de moagem e sal).
- [ ] **Cooking Mode completo** (voz, vibracao, botao gigante).
- [ ] **Fluxo em 3 toques** para chegar em blend, historico e ferramentas.

## P1 - Profissional (CMV, escala e padronizacao)
- [x] **Simulador de custo/CMV em tempo real** (custo por burger + preco sugerido).
- [x] **Edicao manual de precos por corte** (ajuste por regiao).
- [x] **Calculadora de proporcao reversa** (meta de gordura com 2 cortes).
- [x] **Ficha tecnica operacional** (gramas por lote, moagem, preparo, rendimento).
- [x] **Conversor de escala (batch)** 4 -> 50 burgers com 1 toque.
- [x] **Estimativa de yield/encolhimento** por metodo de cocao.
- [ ] **Substituicao inteligente de cortes** (ex: acem -> paleta) com impacto.

## P1 - Viralidade e onboarding
- [ ] **Onboarding rapido (3 telas)** com CTA direto para o laboratorio.
- [ ] **Templates de compartilhamento** (cards para WhatsApp/Instagram).
- [ ] **Score do blend** (equilibrio, suculencia, textura) com dicas.
- [ ] **Gerador de copy e nomes** para blends de assinatura.
- [ ] **Rastreabilidade/historia do corte** (origem da carne e storytelling).

## P1 - Presets e WikiMeat
- [ ] **Presets assinados** com alvo de gordura, moagem e por que funciona.
- [ ] **WikiMeat offline** com ciencia curta (Maillard, sal, descanso, flare-up).
- [ ] **Glossario rapido** (smash, carryover, doneness).

## P2 - Builder visual avancado
- [ ] **Roda de sabores ligada a toppings reais.**
- [ ] **Stack do hamburguer com regras de estabilidade.**
- [ ] **Personalizacao de paes e molhos.**

## P2 - Historico e backup
- [ ] **Historico com feedback do usuario** (ajuste automatico).
- [ ] **Badges leves** (primeiro smash, alvo 22% perfeito).
- [ ] **Export/import e backup local.**
- [ ] **Feedback real para calibrar alertas** (smash/airfryer/fit/alto).

## P2 - Qualidade e confianca
- [ ] **Acessibilidade** (contraste, targets >= 72px, labels).
- [ ] **Telemetria anonima (opcional).**

## P3 - Expansao futura
- [ ] **API de fornecedores** (precos e disponibilidade).
- [ ] **i18n PT/EN.**
- [ ] **Comunidade e ranking.**
