# Jaguar Survivors — Plano de Execução do Produto

**Status:** PROPOSTA DE PLANEJAMENTO — requer revisão do Product Owner antes de ser usada como autorização de execução  
**Base:** Project Constitution; Product Decision Register; Workflow; Agent Roles; Change Control; GDD v0.3  
**Objetivo:** organizar o trabalho necessário para evoluir o projeto existente até o produto descrito no GDD, usando planos de execução por fase e Codex como orquestrador.

> Este roteiro organiza dependências e recomenda uma sequência. Não aprova escopo novo, não converte itens PROPOSED/TBD em requisitos e não autoriza alterações em código, documentação de produto, assets, áudio, vídeo, publicação ou dependências. Cada plano de fase deve receber autorização explícita antes da execução correspondente.

## 1. Resultado de produto e limites

O destino documentado é um jogo comercial independente de sátira política global, inicialmente com uma campanha americana completa de três estágios, final regional e gancho para a narrativa global. O VS-001 é um vertical slice focado no Ato II, The Political Machine; ele valida uma parte do produto e não equivale sozinho à campanha comercial completa.

O roteiro preserva como restrições aprovadas: Phaser 3.70.0, Vite 5.4.21, JavaScript ES Modules, navegador desktop, teclado/mouse/gamepad, evolução incremental da arquitetura e persistência local inicialmente. O produto mantém cidadãos comuns como protagonistas jogáveis, figuras políticas públicas predominantemente como antagonistas e o tom ácido aprovado. Conteúdo do Partido Missão permanece excluído do produto comercial; arquivos históricos não devem ser apagados por essa razão.

Decisões pendentes — incluindo identidade visual final, detalhes dos estágios 1 e 3, nomes finais, hazards/layouts, tuning, expansão de elenco, distribuição, monetização, direitos e estratégia de revisão jurídica — permanecem TBD ou PROPOSED conforme os documentos de autoridade. Um plano de fase deve parar o trabalho dependente quando essas decisões forem necessárias.

## 2. Como priorizar o backlog

Priorizar na seguinte ordem, justificando exceções no plano da fase:

1. **Bloqueios de decisão e risco:** conflito documental, requisito aprovado sem caminho de validação, risco legal/editorial de conteúdo identificável, ou TBD que bloqueia uma entrega.
2. **Bloqueios do caminho crítico:** itens sem os quais a próxima etapa de aceitação não pode ser demonstrada — por exemplo, execução de run, gamepad de referência, restart/cleanup e build carregando assets.
3. **Requisitos de aceitação aprovados:** primeiro o mínimo necessário para demonstrar o slice; depois os itens que completam a campanha americana aprovada.
4. **Qualidade e evidência:** estabilidade, desempenho, compreensão e repetibilidade, guiados por critérios do GDD e evidência de runtime/playtest.
5. **Polimento e expansão:** conteúdo, mídia e regiões adicionais somente após gates de escopo, decisão e capacidade.

Para cada item, registrar: fonte no GDD/decisão; status (APPROVED, PROPOSED, EXPERIMENTAL ou TBD); impacto na aceitação; dependências; risco; tamanho/estimativa se disponível; evidência de conclusão; e arquivos/artefatos previstos. Não inventar pontuações ou prazos quando não houver dados. Em caso de empate, favorecer desbloqueio de dependências e redução de risco sobre volume de conteúdo.

## 3. Fases propostas

As fases abaixo são uma sequência recomendada. Cada fase vira um plano de execução separado com tarefas pequenas, dono, escopo autorizado, critérios de aceitação e validação. Uma fase pode ser dividida em mais de um plano quando houver entregas independentes. Não iniciar automaticamente a fase seguinte ao concluir a anterior: revisar evidências, dependências e aprovações primeiro.

### Fase 0 — Preparação e baseline verificável

**Objetivo:** confirmar o ponto de partida e preparar execução rastreável.

**Trabalho de planejamento:** inventariar código, configuração e assets relevantes ao VS-001; confirmar build/execução e lacunas da auditoria estática; mapear referências e conteúdo legado sem reutilizá-los automaticamente; consolidar riscos e dependências; definir como registrar resultados de validação. Identificar o que exige decisão do Product Owner.

**Entregáveis:** baseline técnico com evidências; mapa de requisitos aprovados do VS-001 para sistemas/arquivos; lista priorizada de bloqueios e TBDs; plano de validação alinhado a D-007-08. A escolha de framework/dependência de testes é decisão separada e permanece TBD até aprovação.

**Gate de saída:** Product Owner aprova o escopo do primeiro plano de implementação e os bloqueios que serão resolvidos. Não fazer refatoração significativa antes de estabelecer a estratégia de testes requerida por PD-011 e TBD-T06.

### Fase 1 — Caminho técnico mínimo do VS-001

**Objetivo:** estabelecer uma run demonstrável no escopo autorizado, preservando arquitetura e conteúdo existentes quando tecnicamente apropriado.

**Ordem recomendada:** ciclo de cena e cleanup; fluxo de entrada/resultado/restart; movimento, dash e controles; combate e armas; inimigos; XP/upgrades; progressão/evento; boss e condições de vitória/derrota. A ordem detalhada depende das descobertas da Fase 0 e não deve exigir uma reescrita.

**Entregáveis:** incrementos funcionais ligados aos critérios de aceitação do VS-001, com evidência de validação por incremento. Usar representação placeholder não identificável para o boss até revisão editorial/jurídica.

**Gate de saída:** uma run completa pode ser validada segundo os critérios aprovados, incluindo teclado/mouse/XInput, restart/cleanup e limites de gameplay aplicáveis. Valores numéricos de combate continuam sujeitos a playtest; não declarar balanceamento aprovado sem evidência.

### Fase 2 — Graybox e clareza de gameplay

**Objetivo:** testar espaço, leitura de combate, ritmo e integração da sátira com mecânicas usando apresentação provisória.

**Trabalho:** aplicar somente o graybox permitido de 1500 × 1500; testar legibilidade de inimigos, telegraphs, áreas de ataque e feedback da Cabinet Crisis; avaliar as quatro janelas de escalada, evento aos 8:00 e entrada do boss aos 12:00; registrar hipóteses de tuning sem converter resultados isolados em novas regras de produto.

**Entregáveis:** layout e configuração de protótipo autorizados; registro de observações, problemas e propostas de tuning; lista de elementos de apresentação que precisam de decisão. Hazards, estruturas e layout final continuam TBD até aprovação.

**Gate de saída:** critérios de legibilidade e fluxo definidos para produção do slice; decisões necessárias para arte/conteúdo final encaminhadas ao Product Owner. Não reaproveitar assets legados sem revisão própria.

### Fase 3 — Conteúdo e produção audiovisual do VS-001

**Objetivo:** transformar o protótipo validado em apresentação provisória coerente e localizada para os idiomas aprovados no slice.

**Trilhas coordenadas:** direção visual; sprites/animações/VFX; UI e texto; áudio/feedback; localização EN e pt-BR; integração e preload. Toda tarefa de geração especifica uso, formato, dimensões/duração, estilo autorizado, referências, quantidade, localização e critérios de aceite antes de produzir.

**Gestão de mídia:** manter catálogo de assets com ID, arquivo, origem/ferramenta, autoria, licença/proveniência conhecida, finalidade, versão e estado de revisão. Inspecionar integração, legibilidade, desempenho e acessibilidade. Não afirmar licença ou liberação que não esteja comprovada. Assets, nomes, voz, likeness, marcas e conteúdo reconhecível de pessoa real exigem aprovação editorial/jurídica específica; a aprovação do boss como direção criativa não libera tais usos.

**Gate de saída:** assets e textos aprovados para o uso pretendido, carregando e funcionando no jogo; conteúdo identificável retido até as revisões aplicáveis. Identidade visual final permanece TBD; esta fase só pode assumir um escopo de arte provisória explicitamente autorizado.

### Fase 4 — Integração, validação e playtest do VS-001

**Objetivo:** avaliar o vertical slice de ponta a ponta contra a aceitação de produto, técnica e compreensão do jogador.

**Trabalho:** validação isolada onde prática; run completa; teclado, mouse e XInput; Chrome/Edge em Windows conforme referência aprovada; restart/cleanup; registro de média de FPS e P95 com hardware documentado; verificar limite inicial de 50 inimigos; playtest exploratório com cinco jogadores conforme D-006-21/D-006-26; reportar problemas, reprodução e evidências.

**Entregáveis:** matriz de aceitação preenchida; defeitos priorizados; resultados e limitações; recomendações de tuning; decisão de prontidão para avançar ou repetir trabalho. A meta de 4/5 é exploratória, não valida demanda comercial.

**Gate de saída:** Product Owner revisa evidências e decide se o VS-001 atende seu propósito ou precisa de ciclo adicional. Não alegar compatibilidade, desempenho ou aceitação além do que foi efetivamente medido.

### Fase 5 — Fechamento de design da campanha americana

**Objetivo:** preencher lacunas de produto que impedem produzir os três estágios e o final regional da primeira campanha comercial.

**Trabalho de design sujeito a aprovação:** definir conteúdo e objetivo de cada estágio; bosses dos estágios 1 e 3; relação narrativa entre os três atos e o gancho global; layouts, hazards, regras de progressão e recompensas; persistência/desbloqueios narrativos; escopo de elenco; identidade visual e limites editoriais aplicáveis. Resolver TBDs pertinentes no Registro de Decisões antes da implementação dependente.

**Entregáveis:** especificação de campanha aprovada, critérios de aceitação por estágio, matriz de conteúdo e riscos editoriais/jurídicos. Propostas de nomes/conceitos não são requisitos até aprovação.

**Gate de saída:** decisões e materiais de campanha necessários estão aprovados e consistentes com Constituição, Registro e GDD. Se o GDD precisar mudar, seguir Change Control e preservar histórico.

### Fase 6 — Produção incremental da campanha e integração

**Objetivo:** completar a campanha americana de três estágios apoiada pelos sistemas já validados no slice.

**Trabalho:** produzir cada estágio como plano autorizado, preferindo configurações e behaviors registrados quando compatíveis com a arquitetura existente; integrar progressão e persistência local aprovadas; produzir conteúdo e mídia após revisão; validar regressões no slice e nos demais estágios. Cada etapa detalha dependências e não copia mecânicas ou assets por presunção.

**Entregáveis:** três estágios jogáveis, conclusão regional e gancho global conforme especificação aprovada; evidências de integração; conteúdo e proveniência revisados.

**Gate de saída:** aceitação da campanha completa contra critérios aprovados, revisão dos riscos e decisão do Product Owner sobre preparação para uma etapa de publicação. Não iniciar outras regiões sem decisões de elenco/ordem/escopo correspondentes.

### Fase 7 — Prontidão comercial e publicação

**Objetivo:** preparar distribuição somente quando produto, mercado, direitos, plataforma e operação estiverem decididos.

**Pré-requisitos:** decisões de monetização, formato premium/gratuito, demo/early access, loja/distribuição e jurisdições; revisão legal/editorial dos conteúdos e direitos; requisitos de plataforma e divulgação; plano de suporte, build e release. Esses itens estão TBD ou requerem avaliação atualizada.

**Entregáveis:** plano de publicação, disclosure e checklist de lançamento alinhados às decisões aprovadas; build candidata e evidências finais de QA, sob autorização explícita.

**Gate de saída:** Product Owner autoriza explicitamente release/publicação. Nenhum plano ou aprovação de conteúdo substitui essa autorização.

## 4. Modelo de plano por fase

Antes de executar uma fase, o Codex Lead prepara um documento ou mensagem de plano com:

1. **Objetivo e resultado observável.**
2. **Escopo incluído e excluído**, com referências exatas ao GDD e às decisões.
3. **Status de cada requisito:** aprovado, proposta, experimental ou TBD.
4. **Pré-requisitos e decisões bloqueadoras.**
5. **Etapas ordenadas**, tarefas pequenas, responsável e arquivos/artefatos autorizados.
6. **Critérios de aceitação e validação**, incluindo ambiente e evidências esperadas.
7. **Riscos** de produto, código, direitos, plataforma, reputação, performance e integração.
8. **Aprovação requerida** antes de qualquer ação que exceda autorização existente.
9. **Relatório de fechamento:** alterações, verificações realizadas, limitações, decisões pendentes e recomendação do próximo gate.

Uma aprovação de plano deve indicar claramente a fase e as ações autorizadas. Se o escopo mudar durante a execução, pausar apenas o trabalho dependente, relatar impacto e solicitar a decisão pertinente; trabalho independente autorizado pode continuar.

## 5. Orquestração recomendada pelo Codex

### Responsabilidade do Codex Lead

Atuar como Product Lead na descoberta e decomposição de requisitos dentro da tarefa autorizada; como orquestrador, manter fonte de verdade, dependências e estado do trabalho; e como Lead Engineer quando a tarefa envolver decisões técnicas. Essas funções não transferem autoridade de produto do Product Owner.

### Uso de agentes especialistas

Delegar somente tarefas delimitadas e independentes quando agentes estiverem disponíveis e agregarem valor. Exemplos: auditoria read-only de um sistema; revisão de critérios de aceitação; análise de referências/licença de uma coleção; ou proposta de plano de testes. Cada atribuição declara objetivo, contexto aprovado, limites, modo de edição, entregável e prazo/condição de retorno.

Um agente não aprova decisões, não expande seu escopo e não modifica arquivos compartilhados fora da atribuição. Evitar dois agentes editando o mesmo arquivo. O Codex Lead verifica achados importantes e integra as recomendações; relatório de agente não é autorização.

### Ordem de execução dentro de uma tarefa

**Ler instruções e estado do workspace → confirmar escopo/decisões → planejar dependências → obter aprovação necessária → executar alterações autorizadas → validar conforme pedido → revisar diff/artefatos → relatar.** Não instalar/atualizar dependências, criar mídia, alterar gameplay ou publicar sem autorização explícita para essas ações.

## 6. Prompts operacionais

Os prompts reutilizáveis ficam em [`project-management/Prompts/`](../Prompts/README.md). Use o prompt adequado ao estado do trabalho. Prompt de planejamento não autoriza implementação; prompt de execução deve receber autorização explícita e escopo concreto.

## 7. Referências de controle

- [Project Constitution](../00-governance/PROJECT-CONSTITUTION.md)
- [Product Decision Register](../00-governance/PRODUCT-DECISIONS.md)
- [Project Workflow](../00-governance/WORKFLOW.md)
- [Agent and Contributor Roles](../00-governance/AGENT-ROLES.md)
- [Change Control](../00-governance/CHANGE-CONTROL.md)
- [Game Design Document v0.3](../05-game-design/GAME-DESIGN-DOCUMENT.md)

