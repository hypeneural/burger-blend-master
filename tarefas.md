# Tarefas e Prioridades - BlendLab Burger (nova rodada)

Checklist revisado para elevar UX mobile, performance e clareza didatica.

## P0 - Performance mobile real (startup + fluidez)
- [ ] **Lazy load de tabs e modais pesados**: carregar Wiki/Grill/Tools e modais (IngredientPicker, ExtraPicker, PriceEditor) apenas quando abrir, com prefetch no idle.
- [ ] **Split de bundles por feature**: separar recharts/html2canvas/jspdf/framer-motion em chunks dedicados via `manualChunks` para reduzir o JS inicial.
- [ ] **Otimizacao de fontes**: reduzir pesos do Playfair, garantir `font-display: swap` e fallback imediato para evitar FOIT.
- [ ] **Animacoes leves em listas longas**: desativar motion item-a-item quando `lowData` ou quando lista > N itens, mantendo apenas transicoes simples.
- [ ] **Skeletons consistentes**: placeholders para listas, cards e relatorio para evitar saltos de layout no primeiro paint.

## P0 - Icones e mini-badges por opcao
- [ ] **Mapa de icones por selecao**: adicionar icones nos botoes de estilo/moagem/equipamento (crosta, suculencia, risco).
- [ ] **Badges de impacto rapido**: chips padronizados (Crosta, Suculencia, Risco, Tempo) visiveis nas opcoes e no resumo.
- [ ] **Badges tecnicos por corte**: icons + cor para gordura, colageno, custo e funcao no blend, reutilizados em Picker e Wiki.

## P1 - UX educacional (amador + pro)
- [ ] **Camada "Por que" por etapa**: abrir explicacao curta e tecnica para estilo, moagem, equipamento, extras e alertas.
- [ ] **Modo Iniciante/Pro**: toggle para simplificar a tela (iniciante) ou mostrar dados avancados (pro).
- [ ] **Glossario rapido**: acesso em 1 toque para termos como Maillard, smear, flare-up, moagem dupla.

## P1 - Fluxo e navegacao mobile
- [ ] **Barra de acoes fixa**: salvar, compartilhar e exportar sempre acessiveis sem rolagem.
- [ ] **Edicao rapida no resumo**: botao "Editar" por bloco (Base/Blend/Extras) para voltar direto na etapa.
- [ ] **Historico de alteracoes**: desfazer/refazer ultima mudanca do blend para evitar perda de ajustes.

## P1 - Offline e resiliencia visivel
- [ ] **Fallback offline in-app por tab**: estado offline dentro do app com CTA para abrir salvos/presets.
- [ ] **Prompt de update do service worker**: notificar nova versao e botao "Atualizar agora".
- [ ] **Progresso de download por categoria**: mostrar percentual e tempo estimado para baixar offline.

## P2 - Qualidade, acessibilidade e confianca
- [ ] **Testes de custo e proporcao reversa**: cobrir CMV, sugestao de preco e calculo 2 cortes.
- [ ] **A11y mobile**: targets min 56-72px, labels em icones, foco visivel e contraste validado.
- [ ] **Higiene de dados**: validacao de input (grams/%), estados vazios e mensagens de erro claras.

## P3 - Diferenciais premium
- [ ] **Biblioteca de presets assinados**: colecao com historias e justificativas tecnicas (pro).
- [ ] **Simulador de venda**: margem alvo, preco sugerido e custo por lote com comparativo.
- [ ] **Ficha tecnica avancada**: export com rastreio, metodo, yield e checklist de operacao.
