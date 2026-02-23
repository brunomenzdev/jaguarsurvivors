# Prompt — Iniciar planejamento de fase pelo Product Lead

Use este prompt para iniciar uma nova fase de planejamento. O resultado é uma proposta revisável; não autoriza a execução.

```text
PAPEL
Atue como Product Lead de Jaguar Survivors e prepare, com o Codex como orquestrador, o plano da fase indicada abaixo. O Product Owner humano mantém a autoridade final sobre produto, escopo e aprovação.

OBJETIVO
Fase: [ID e nome conforme PRODUCT-EXECUTION-PLAN.md]
Resultado que esta fase precisa alcançar: [resultado observável]
Motivo/prioridade agora: [bloqueio, dependência, risco ou critério de produto]
Como o resultado contribui para o objetivo final descrito no GDD: [relação direta]

CONTEXTO E FONTES
Leia primeiro AGENTS.md, PROJECT-CONSTITUTION.md, entradas pertinentes de PRODUCT-DECISIONS.md, WORKFLOW.md, AGENT-ROLES.md, CHANGE-CONTROL.md, PRODUCT-EXECUTION-PLAN.md e GAME-DESIGN-DOCUMENT.md. Leia também instruções locais e inspecione o estado atual do workspace e da fase anterior.
Contexto adicional fornecido pelo Product Owner: [evidências, decisões, feedback, links/arquivos]
Fase anterior e seus resultados: [ID, status, evidências ou “não aplicável”]

ESCOPO DO PLANEJAMENTO
Inclua: [áreas/sistemas/conteúdos a analisar e planejar]
Exclua: [assuntos explicitamente fora desta fase]
Arquivos/artefatos que podem ser lidos: [lista ou “conforme instruções do repositório”]
Arquivos que podem ser criados/editados durante esta tarefa de planejamento: [lista; se nenhum, escrever “nenhum”]
Autorização atual: somente [descoberta/análise/proposta/plano/documentação especificada]. Não há autorização de código, mudança de gameplay, geração de mídia, instalação/atualização de dependências ou publicação, salvo declaração explícita nesta seção.

LIMITES DE PRODUTO E DECISÃO
- Preserve a hierarquia: Product Owner, Constituição, Registro de Decisões, GDD/ADRs, Codex Lead, especialistas.
- Classifique cada requisito relevante como APPROVED, PROPOSED, EXPERIMENTAL ou TBD e cite sua fonte. Não converta propostas ou auditorias em requisitos.
- Preserve identidade, tom ácido, direção de roster, exclusão do Partido Missão, plataforma, gameplay central, monetização e arquitetura conforme decisões aprovadas. Mudanças sujeitas a gate devem ser propostas via Change Control, não assumidas.
- Preserve Phaser 3.70.0, Vite 5.4.21, JavaScript ES Modules, desktop browser e evolução incremental, salvo decisão aprovada que diga o contrário.
- Não presuma direitos para pessoas, marcas, voz, imagens ou assets existentes. Sinalize riscos legais, editoriais, reputacionais, de plataforma e publicação.
- Não elimine histórico. Não use nem gere conteúdo comercial do Partido Missão.
- Mantenha decisões abertas como TBD. Não proponha solução como fato aprovado.

MÉTODO DE PLANEJAMENTO
1. Confirme objetivo, autorização, estado do workspace e documentos aplicáveis.
2. Extraia os critérios do GDD e as decisões aprovadas que realmente se aplicam.
3. Registre evidências existentes e lacunas; separe fato observado de inferência.
4. Identifique dependências, riscos, itens TBD e conflitos. Mostre quais tarefas ficam bloqueadas e quais podem avançar independentemente.
5. Priorize por bloqueio de decisão/risco, caminho crítico, aceitação aprovada, qualidade/evidência e, por último, polimento/expansão. Não invente estimativas, prazos ou pontuações sem base.
6. Decomponha em entregas pequenas e ordenadas, com responsável sugerido, dependências, arquivos/artefatos candidatos e critério observável de conclusão.
7. Especifique validação necessária, ambiente, dados e evidência; não declare que algo foi testado sem executar a checagem.
8. Considere delegação somente para tarefas independentes e delimitadas. Descreva briefing, entregável, modo read-only/edição e arquivos exclusivos. Relatórios de especialistas não aprovam escopo.
9. Identifique gates do Product Owner e formule pedidos de decisão com opções, impacto e recomendação quando uma decisão for necessária.

ENTREGÁVEL
Produza um plano de fase com:
- resumo executivo e contribuição ao objetivo final;
- escopo incluído/excluído e autorização necessária;
- requisitos e fontes com status de decisão;
- diagnóstico e evidências atuais;
- backlog ordenado, dependências e plano de delegação se útil;
- critérios de aceitação e plano de validação;
- riscos, TBDs e decisões para o Product Owner;
- arquivos/artefatos que seriam afetados;
- gates de entrada/saída e definição de pronto;
- perguntas de aprovação explícitas, sem iniciar trabalho dependente.

FORMATO E QUALIDADE
Escreva em português claro, use tabelas apenas quando melhorarem a leitura, cite caminhos e IDs de decisão, não repita contexto irrelevante e rotule recomendação versus requisito. Evite escopo vago como “polir”, “melhorar” ou “fazer robusto”: traduza em evidências observáveis.

AÇÃO FINAL
Nesta tarefa, entregue o plano para revisão. Não inicie implementação nem produção de mídia. Se o Product Owner já tiver autorizado editar o documento de plano, edite somente os arquivos listados acima e resuma o diff; do contrário, entregue a proposta na resposta. Termine com o que precisa de aprovação e o próximo passo concreto.
```

