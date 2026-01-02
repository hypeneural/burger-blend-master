# Tarefas e Prioridades - BlendLab Burger (Refactor + Performance)

Checklist atualizado com foco em mobile-first, performance e offline.

## P0 - Mobile first e performance real
- [x] **Refatorar Index.tsx em secoes menores**: separar Builder, Wiki, Grill e Tools em componentes memoizados para reduzir re-render e manter a UI fluida.
- [x] **Lazy load agressivo de features pesadas**: exportacao PDF (html2canvas/jspdf) e graficos devem carregar apenas ao abrir a tela/acao.
- [x] **Virtualizar listas grandes**: WikiMeat e listas de ingredientes com renderizacao incremental (load more) para evitar travadas em aparelhos fracos.
- [x] **Modo economia persistente**: salvar preferencia de conexao lenta e desligar animacoes/graficos automaticamente em futuras sessoes.
- [x] **Reducao de bundle e fontes**: carregar apenas subsets de fontes e ativar font-display swap para acelerar o first paint.

## P0 - Offline e resiliencia
- [x] **Indicador de cache e ultima sincronizacao**: mostrar quando o app esta 100% pronto offline.
- [x] **Fallback offline por rota**: garantir que Wiki, Presets e Relatorio tenham conteudo local mesmo sem rede.
- [x] **Precache seletivo por categoria**: baixar conteudo mais acessado primeiro (bovinos/presets) e expandir sob demanda.

## P1 - UX mobile nativa (template)
- [x] **Agrupar blocos por etapas**: reduzir scroll e mostrar somente a proxima decisao do usuario.
- [x] **Resumo sticky inteligente**: card compacto fixo no topo com gordura, custo e total da receita.
- [x] **Feedback de acao instantaneo**: toasts curtos para salvar/compartilhar/exportar e erros de validacao.

## P1 - Profissional (padronizacao e operacao)
- [x] **Substituicao inteligente de cortes**: sugerir troca (Acem -> Paleta) mantendo gordura e custo.
- [x] **Ficha tecnica exportavel**: gerar PDF simples apenas com pesos, moagem e checklist operacional.
- [x] **Campos de rastreabilidade**: origem da carne, fornecedor e lote na receita final.

## P2 - Qualidade e confianca
- [ ] **Testes para custos e proporcao reversa**: cobrir formulas de CMV e 2 cortes.
- [ ] **Acessibilidade completa**: contraste validado e targets >= 72px em todas as telas.

## P3 - Expansao futura
- [ ] **API de fornecedores**: precos reais e disponibilidade por regiao.
- [ ] **i18n PT/EN**.
- [ ] **Comunidade e ranking**.
