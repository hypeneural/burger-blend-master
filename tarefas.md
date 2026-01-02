# Tarefas e Prioridades - BlendLab Burger

Checklist focado em viralidade, UX/UI explicativa e estrutura robusta, considerando o estado atual do app.

## P0 - Fundacao tecnica e arquitetura (obrigatorio)
- [x] **P0 - Estado global com Zustand (ou Redux Toolkit):** centralizar Builder, presets, preferencias e historico em um store unico para reduzir acoplamento do `Index.tsx`, evitar props profundas, facilitar persistencia e testes.
- [x] **P0 - Camada de dominio/calculos isolada:** criar modulo de engenharia do blend (peso, gordura, target lock, alertas, moagem) com testes unitarios; hoje as regras estao espalhadas em componentes.
- [ ] **P0 - Persistencia Dexie completa + migracoes:** validar schema, indices e migracoes; adicionar `history`, `preferences` e export/import; hoje Dexie existe, mas falta versionamento real e politicas de limpeza.
- [ ] **P0 - PWA offline-first real:** cachear conteudo da Wiki e presets em IndexedDB; adicionar fallback offline e pagina offline; hoje o SW cacheia assets, mas nao garante conteudo dinamico.
- [ ] **P0 - Code splitting e performance mobile:** separar graficos e PDF em `lazy()`; reduzir bundle para evitar travamentos em celulares antigos; build alerta chunk grande.

## P0 - Base de dados (materia-prima) e schema tecnico
- [x] **P0 - Modelos Cut/Ingredient completos:** criar `Cut` e `Ingredient` com campos técnicos (fat range, collagen, myoglobin, texture tags, flavor notes, warnings, grind, cooking best). Isso eh base para educacao e calculos.
- [x] **P0 - Seed inicial robusto (BR + EN):** incluir cortes obrigatorios (Acem, Peito/Brisket, Costela, Fraldinha, Coxao duro, Alcatra, Picanha, Pescoco) com equivalentes EN e tags regionais.
- [ ] **P0 - Normalizacao e consistencia dos dados:** padronizar nomes, IDs, traducoes e unidades; evitar string solta e manter `enum` para categorias e funcoes.

## P0 - Calculadora e explicacoes (core do produto)
- [ ] **P0 - Inputs completos do Builder:** incluir moagem (fina/media/grossa + simples/dupla), equipamento, estilo do burger, alvo de gordura com presets + custom; hoje parte disso nao existe.
- [ ] **P0 - Modo avancado por gramas:** permitir editar por gramas alem de porcentagem; essencial para blends profissionais.
- [ ] **P0 - Explicacao "Por que deu esse numero?" expandida:** incluir passo a passo matematico e origem do dado (fat range do corte) para educar o usuario e gerar confianca.
- [ ] **P0 - Alertas inteligentes com justificativa tecnica:** padronizar mensagens, incluir regra para Coxao duro > 40% sem compensacao, e flare-up em grelha; ja existe base mas falta cobertura completa e referencias de dados.

## P1 - UX/UI mobile explicativa e viral
- [ ] **P1 - Onboarding rapido em 3 telas:** explicar o que eh blend, por que alvo de gordura importa e como usar o app; reduz churn.
- [ ] **P1 - Templates de compartilhamento (viral):** gerar cards de receita com visual forte (nome, % gordura, foto/icone, selo) para Instagram/WhatsApp; aumentar viralidade.
- [ ] **P1 - Pontuacao/score do blend:** score simples (equilibrio, suculencia, textura) com explicacao para motivar ajustes e compartilhamento.
- [ ] **P1 - Feedback imediato e micro interacoes:** reforcar mudancas em graficos e alertas com animacoes suaves e cores de estado; hoje existe, mas sem padrao global.
- [ ] **P1 - Dark mode automatico:** importante para cozinha noturna e contraste alto; necessario para UX em ambiente hostil.

## P1 - Navegacao rasa e ferramentas
- [ ] **P1 - Ferramentas reais:** timers, finger test interativo, conversores, checklist de moagem e sal; hoje a aba Ferramentas eh placeholder.
- [ ] **P1 - Cooking Mode completo:** Wake Lock ja existe, mas precisa botao gigante, voz (Web Speech API), vibração, e modo noturno automatico.
- [ ] **P1 - Navegacao em 3 toques:** mapear caminhos e reduzir passos para chegar em blend, historico e ferramentas; garantir CTA principal sempre visivel.

## P1 - Presets assinados (conteudo inicial)
- [ ] **P1 - Presets com justificativa tecnica:** incluir alvo de gordura, moagem, modo de cocao, e "por que funciona"; hoje presets sao simples.
- [ ] **P1 - Presets por objetivo:** iniciante, premium, economico, smash, fit, veg; cada um com alertas e dicas de sal/maillard.

## P1 - WikiMeat (educacao offline)
- [ ] **P1 - Cards tecnicos de cortes:** anatomia, funcao, gordura, colageno, sabor, riscos; offline-first.
- [ ] **P1 - Ciencia de cocao:** Maillard, sal, descanso, flare-up, overworking; com exemplos curtos.
- [ ] **P1 - Glossario rapido:** smash, carryover, doneness, etc.

## P2 - Builder visual avancado
- [ ] **P2 - Roda de sabores baseada em toppings/molhos reais:** hoje o radar usa heuristica; precisa ligar a dados de toppings e molhos.
- [ ] **P2 - Stack do hamburguer com regras de estabilidade:** permitir camadas de pao/molho/toppings e emitir alertas (tomate direto no pao, molho demais).
- [ ] **P2 - Personalizacao de paes e molhos:** efeitos no radar de sabores e alertas de estabilidade.

## P2 - Historico, badges e comunidade
- [ ] **P2 - Historico de cozinhadas com feedback:** permitir nota do usuario (ficou seco?), gerar sugestao de ajuste para proxima vez.
- [ ] **P2 - Badges leves:** "Primeiro Smash", "Alvo 22% perfeito", etc.; motor simples de gamificacao.
- [ ] **P2 - Export/import e backup:** permitir exportar blends/historico e importar em outro dispositivo.

## P2 - Qualidade e confianca
- [x] **P2 - Testes unitarios dos calculos:** cobrir target lock, media ponderada e alertas.
- [ ] **P2 - Telemetria anonima (opcional):** entender onde o usuario cai no funil e ajustar UX.
- [ ] **P2 - Acessibilidade:** contrastes, tamanhos de toque >= 72px no Cooking Mode, labels de acessibilidade.

## P3 - Expansao futura (apenas depois do core)
- [ ] **P3 - API externa de fornecedores:** precos e disponibilidade.
- [ ] **P3 - Multilanguage PT/EN:** ja existe a necessidade no schema, falta i18n.
- [ ] **P3 - Comunidade:** blends publicados, curtidas e ranking.

## Observacoes do estado atual
- Base de dados ainda simples (faltam atributos tecnicos e equivalentes EN).
- Estado global e regras de negocio ainda estao dentro do `Index.tsx`.
- Ferramentas (timers, finger test, checklist) e Web Speech API ainda nao existem.
- Presets e Wiki precisam de conteudo tecnico completo.
