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

## prompt-16
tipo: unica
skill: Prompt Engineering

Qual instrução dá ao modelo mais condições de acertar em casos não previstos?

- [x] "Evite jargão, pois os leitores são pacientes leigos"
- [ ] "Nunca use jargão em nenhuma hipótese, é PROIBIDO"
- [ ] "Escreva da melhor forma que você puder sempre"
- [ ] "Siga o estilo que for o mais adequado possível"

> Explicar o porquê permite generalizar. Ênfase sem motivo não.

## prompt-17
tipo: unica
skill: Prompt Engineering

Um prompt antigo tem 14 regras em maiúsculas com "CRÍTICO". No modelo novo, ele aplica as regras em excesso. O que fazer?

- [ ] Acrescentar mais um aviso em maiúsculas
- [ ] Repetir as 14 regras no fim do prompt
- [ ] Voltar em definitivo ao modelo antigo
- [x] Reescrever em tom normal e medir o efeito

> Modelos recentes seguem instruções mais de perto; ênfase antiga pode exagerar o efeito.

## prompt-18
tipo: unica
skill: Prompt Engineering

Duas regras do prompt se contradizem: "seja breve" e "explique tudo em detalhe". Qual é a correção?

- [ ] Colocar a mais importante em negrito
- [ ] Repetir as duas regras no final
- [x] Dizer quando cada uma se aplica
- [ ] Deixar que o modelo escolha sempre

> Resolva conflitos com condição ou prioridade explícita.

## prompt-19
tipo: unica
skill: Prompt Engineering

Como pedir que uma análise separe **fatos** do documento de **inferências**?

- [ ] Enviar o documento duas vezes no prompt
- [x] Definir seções distintas e o que cabe em cada
- [ ] Pedir que o modelo tenha bastante cuidado
- [ ] Pedir uma resposta com no máximo 100 palavras

> Estrutura explícita torna a separação verificável.

## prompt-20
tipo: unica
skill: Prompt Engineering

Um prompt de papel ("você é auditor fiscal") ajuda principalmente a:

- [x] Ajustar foco, vocabulário e perspectiva
- [ ] Dar ao modelo dados que ele não conhece
- [ ] Garantir que os cálculos sejam corretos
- [ ] Impedir toda tentativa de prompt injection

> Papel orienta a abordagem; não acrescenta fatos nem garantias.

## prompt-21
tipo: unica
skill: Prompt Engineering

Nos exemplos few-shot, todas as respostas têm 3 itens, e o modelo sempre dá 3, mesmo quando há 7. Por quê?

- [ ] Ele tem um limite interno de três itens
- [ ] Ele ignorou por completo os exemplos dados
- [ ] Ele precisa de um `max_tokens` bem maior
- [x] Ele imitou um padrão acidental dos exemplos

> Varie o que não deve ser copiado.

## prompt-22
tipo: multipla
skill: Prompt Engineering

Para extrair dados de e-mails, quais exemplos valem mais no prompt? (Escolha 2)

- [ ] O mesmo e-mail repetido três vezes
- [ ] Um e-mail idêntico ao caso mais fácil
- [x] Um e-mail sem o dado procurado
- [x] Um e-mail com dois valores em conflito

> Casos de borda ensinam a decisão; repetição não acrescenta.

## prompt-23
tipo: unica
skill: Prompt Engineering

O modelo inventa um CNPJ quando a nota não traz um. Qual ajuste é melhor?

- [ ] Campo de texto livre, sem nenhuma regra
- [x] Campo que aceita nulo e a regra de quando usá-lo
- [ ] Campo obrigatório e um aviso para não inventar
- [ ] Campo removido e CNPJ deduzido pelo nome

> Se o schema obriga um valor, ele pressiona a inventar. Ofereça uma saída legítima.

## prompt-24
tipo: unica
skill: Prompt Engineering

Um pedido único "leia, critique e reescreva" sai raso. Qual encadeamento é o mais útil?

- [x] Crítica primeiro; reescrita usando essa crítica
- [ ] Reescrita primeiro; crítica do texto original
- [ ] Três reescritas iguais e a escolha da maior
- [ ] Uma só chamada com a instrução repetida

> Uma etapa de crítica explícita alimenta a revisão e pode ser inspecionada.

## prompt-25
tipo: unica
skill: Prompt Engineering

Por que testar um prompt com entradas **adversariais** e vazias?

- [ ] Para reduzir os tokens de cada requisição
- [ ] Para ensinar o modelo a evitar esses casos
- [ ] Para atender ao mínimo de casos do cache
- [x] Para conhecer o comportamento fora do ideal

> Produção traz entradas ruins; o prompt precisa dizer o que fazer com elas.

## prompt-26
tipo: unica
skill: Context Engineering

Qual princípio guia o que colocar no contexto?

- [ ] Todo o histórico, para nunca perder nenhum dado
- [ ] Só a última mensagem enviada pelo usuário
- [x] O mínimo de tokens com alto sinal para a tarefa
- [ ] O máximo de informação que couber na janela

> Contexto é recurso finito; ruído disputa atenção com o que importa.

## prompt-27
tipo: unica
skill: Context Engineering

Em vez de carregar 200 arquivos, o agent recebe uma lista de caminhos e lê os que precisar. Como se chama essa abordagem?

- [ ] Prefill da resposta do assistant
- [x] Recuperação sob demanda (just-in-time)
- [ ] Compaction do histórico da conversa
- [ ] Few-shot com exemplos dinâmicos

> Referências leves e tools de leitura mantêm o contexto enxuto.

## prompt-28
tipo: unica
skill: Context Engineering

Após compaction, um agent perdeu o motivo de uma decisão e a refez. Como reduzir esse risco?

- [x] Gravar decisões em notas fora do contexto
- [ ] Desativar a compaction para todo o sempre
- [ ] Compactar com mais frequência que antes
- [ ] Pedir ao agent que tenha boa memória

> Resumo perde detalhe; o que é crítico deve ser persistido.

## prompt-29
tipo: unica
skill: Context Engineering

Um RAG devolve trechos corretos, mas cortados no meio de tabelas. O que ajustar?

- [ ] O tom do system prompt da aplicação
- [ ] O número máximo de tokens de saída
- [ ] O nome dado ao índice de busca
- [x] O chunking, respeitando a estrutura

> Dividir por estrutura e acrescentar contexto ao trecho preserva o sentido.

## prompt-30
tipo: unica
skill: Context Engineering

Uma busca semântica falha em códigos exatos como `ERR-4471`. O que acrescentar?

- [ ] Um modelo de resposta com mais effort
- [ ] Um trecho maior em cada resultado
- [x] Busca por palavra-chave, em modo híbrido
- [ ] Mais documentos sobre outros assuntos

> Embeddings captam sentido; termos exatos pedem busca lexical. Combine e reordene.

## prompt-31
tipo: unica
skill: Context Engineering

Um documento recuperado é de 2019 e contradiz outro de 2025. Como ajudar o modelo?

- [ ] Juntar os dois textos em um só parágrafo
- [x] Incluir data e fonte, e a regra de prioridade
- [ ] Embaralhar os dois para evitar preferência
- [ ] Enviar apenas o documento que for maior

> Metadados e regra explícita permitem resolver conflito e informá-lo.

## prompt-32
tipo: unica
skill: Output Handling

O modelo classifica tickets em 4 rótulos, mas alguns não se encaixam e recebem um rótulo **errado**. O que mudar na saída?

- [x] Um rótulo "outro", com a regra de quando usá-lo
- [ ] Um quinto rótulo sorteado entre os existentes
- [ ] A lista de rótulos em ordem alfabética
- [ ] Uma resposta em texto livre, sem nenhum rótulo

> Se nenhuma opção legítima serve, o modelo escolhe a menos ruim. Dê uma saída definida e acompanhe quanto ela é usada.

## prompt-33
tipo: unica
skill: Output Handling

A validação do JSON falhou por uma regra de negócio. Qual fluxo de reparo é razoável?

- [ ] Repetir o mesmo pedido até a regra ser atendida
- [ ] Aceitar o JSON e corrigir os dados à noite
- [ ] Descartar o pedido sem registrar o ocorrido
- [x] Devolver o erro ao modelo, com tentativas limitadas

> Mensagem específica ajuda a corrigir; o limite evita loop, e depois vem o fallback.

## prompt-34
tipo: unica
skill: Output Handling

Um app grava o comando sugerido pelo modelo e o executa. O que falta entre a saída e a ação?

- [ ] Um registro do comando em log, após a execução
- [ ] Uma regra no prompt pedindo comandos seguros
- [x] Validação contra uma lista de ações permitidas
- [ ] Uma segunda opinião do mesmo modelo

> Saída de modelo é entrada não confiável para o próximo sistema.

## prompt-35
tipo: multipla
skill: Output Handling

Como reduzir a chance de a resposta ser **cortada** em relatórios longos? (Escolha 2)

- [ ] Ativar streaming da resposta
- [x] Definir `max_tokens` compatível
- [x] Gerar por seções
- [ ] Reduzir os exemplos do prompt

> E sempre cheque `stop_reason` para detectar o corte.
