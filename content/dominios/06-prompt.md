id: prompt
nome: Prompt and Context Engineering
cor: #c23a78

# Briefing
- Seja claro e direto; explique o porquê das restrições.
- Separe instruções de dados, por exemplo com tags XML.
- Documento longo primeiro, pergunta no fim.
- Contexto é recurso finito: pode, compacte e isole.
- Valide toda saída; JSON válido ainda pode estar errado.

# Questões

## prompt-01
tipo: unica
skill: Prompt Engineering

"Resuma bem este texto" gera resultados inconsistentes. Qual revisão ajuda mais?

- [x] Definir público, tamanho, pontos obrigatórios e formato
- [ ] Adicionar "seja um redator experiente e faça um trabalho excelente"
- [ ] Repetir a mesma instrução três vezes seguidas
- [ ] Trocar "resuma" por uma palavra mais rara

> Critérios explícitos eliminam ambiguidade.

## prompt-02
tipo: unica
skill: Prompt Engineering

Como delimitar o documento do usuário para não confundi-lo com instruções?

- [x] Envolvê-lo em tags XML descritivas
- [ ] Escrevê-lo em letras maiúsculas
- [ ] Colocá-lo dentro do system prompt
- [ ] Remover toda a sua pontuação

> Tags como `<documento>` separam dados de instruções. Ajudam, mas sozinhas não impedem injection.

## prompt-03
tipo: unica
skill: Prompt Engineering

Com um documento de 80 mil tokens, onde colocar a pergunta para melhorar a qualidade?

- [x] No fim, depois do documento
- [ ] No meio do documento
- [ ] No nome do arquivo enviado
- [ ] Somente antes do documento

> Dados longos no topo e pergunta no fim costumam dar melhores respostas.

## prompt-04
tipo: unica
skill: Prompt Engineering

Os exemplos few-shot eram todos reclamações, e o modelo passou a ver reclamação em tudo. Como corrigir?

- [x] Diversificar os exemplos e cobrir casos de borda
- [ ] Adicionar mais exemplos do mesmo tipo que já existe
- [ ] Remover os rótulos de cada exemplo
- [ ] Aumentar `max_tokens` da resposta

> O modelo generaliza padrões acidentais. Exemplos devem ser relevantes e diversos.

## prompt-05
tipo: unica
skill: Context Engineering

Um agent longo acumula resultados antigos e enormes de tools. Qual técnica é a mais específica para isso?

- [x] Limpar resultados antigos com context editing
- [ ] Elevar o effort em cada nova etapa
- [ ] Repetir o system prompt no começo de cada turno
- [ ] Pedir respostas em outro idioma

> Context editing remove tool results antigos. Compaction resume o histórico. São ferramentas diferentes.

## prompt-06
tipo: unica
skill: Context Engineering

Qual afirmação descreve *compaction*?

- [x] Substitui o histórico antigo por um resumo para continuar
- [ ] Remove do histórico apenas os resultados antigos das tools
- [ ] Remove somente as definições de tools
- [ ] Salva a conversa completa em um banco

> Libera espaço preservando o essencial, mas detalhes podem se perder: guarde fatos críticos fora.

## prompt-07
tipo: multipla
skill: Context Engineering

Quais são sinais de *context bloat*? (Escolha 2)

- [x] O agent repete buscas que já fez
- [x] O custo sobe e as regras iniciais são ignoradas
- [ ] O cache hit cresce a cada turno
- [ ] A resposta termina com `end_turn`

> Excesso de conteúdo irrelevante dilui a atenção e encarece cada turno.

## prompt-08
tipo: unica
skill: Output Handling

O JSON segue o schema, mas `total` não bate com a soma dos itens. O que isso mostra?

- [x] É preciso validar regras de negócio além do schema
- [ ] Structured outputs foi configurado de forma errada
- [ ] O schema deveria usar apenas campos de texto
- [ ] O modelo ignorou o limite de `max_tokens`

> Schema garante forma, não verdade. Calcule ou valide em código.

## prompt-09
tipo: unica
skill: Output Handling

Claude cita com segurança uma função de biblioteca que você não conhece. O que fazer?

- [x] Verificar na documentação ou executar um teste
- [ ] Pedir ao modelo que confirme a própria resposta
- [ ] Perguntar ao modelo se ele tem certeza
- [ ] Aceitar se a explicação for longa

> Fluência e confiança não são evidência. Verifique com uma fonte externa.

## prompt-10
tipo: unica
skill: Output Handling

Qual instrução reduz respostas inventadas em um Q&A sobre documentos?

- [x] Usar só o material fornecido e dizer quando não houver resposta
- [ ] Responder sempre da forma mais completa possível, sem deixar lacunas
- [ ] Escrever com bastante confiança e detalhes técnicos
- [ ] Priorizar conhecimento geral sobre o documento

> Permitir "não sei" e exigir grounding diminui alucinações.

## prompt-11
tipo: unica
skill: Prompt Engineering

Você mudou tom, exemplos e formato ao mesmo tempo, e a nota do eval caiu. Qual é o problema do método?

- [x] Não dá para atribuir a queda a uma mudança
- [ ] O eval deveria ter sido desligado
- [ ] O prompt ficou pequeno para o modelo
- [ ] A nota de um eval nunca deveria cair

> Itere em mudanças pequenas e medidas.

## prompt-12
tipo: unica
skill: Prompt Engineering

Qual instrução tende a funcionar melhor para evitar listas?

- [x] "Escreva em parágrafos corridos, pois o texto será lido em voz alta"
- [ ] "NUNCA use listas em hipótese alguma"
- [ ] "Não faça formatação ruim"
- [ ] "É EXTREMAMENTE importante não usar listas nem marcadores na resposta"

> Diga o que fazer e por quê: o modelo generaliza a partir da intenção.

## prompt-13
tipo: unica
skill: Context Engineering

O agent precisa consultar 300 documentos, mas cada pergunta usa 3. Qual abordagem é melhor?

- [x] Recuperar sob demanda só os trechos relevantes
- [ ] Enviar os 300 documentos com prompt caching ativo
- [ ] Resumir os 300 documentos em uma frase
- [ ] Criar 300 system prompts diferentes

> Recuperação just-in-time mantém o contexto enxuto.

## prompt-14
tipo: unica
skill: Prompt Engineering

Uma tarefa faz extração, análise e redação em um só prompt, e a análise sai fraca. O que tentar?

- [x] Dividir em etapas encadeadas com saídas verificáveis
- [ ] Juntar mais tarefas para dar mais contexto
- [ ] Retirar a etapa de análise do prompt
- [ ] Pedir que pense mais sobre as três tarefas ao mesmo tempo

> Prompt chaining dá foco a cada etapa e permite validar entre elas.

## prompt-15
tipo: unica
skill: Prompt Engineering

A instrução "toda resposta deve citar a política interna" vale para todas as conversas do app. Onde colocá-la?

- [x] No system prompt
- [ ] Na primeira mensagem de cada usuário
- [ ] Na descrição de uma tool qualquer
- [ ] No resultado de uma tool

> Regras estáveis do operador ficam no system. Isso também favorece o cache.
