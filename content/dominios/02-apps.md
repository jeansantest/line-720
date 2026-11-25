id: apps
nome: Applications and Integration
cor: #1667b7

# Briefing
- Por padrão, a Messages API é stateless: você reenvia o histórico.
- Confira `stop_reason` antes de usar o conteúdo.
- 429 = rate limit, 529 = sobrecarga: backoff com jitter e respeito a `retry-after`. 400 não se resolve com retry.
- Batch: assíncrono, até 24 h, metade do preço, resultados em qualquer ordem.
- Fixe versões de modelo e versione prompts como código.

# Questões

## apps-01
tipo: unica
skill: Claude API Mechanics

Um chat "esquece" o que o usuário disse no turno anterior. O código envia só a última mensagem. Qual a correção?

- [x] Reenviar o histórico de mensagens em cada requisição
- [ ] Definir o mesmo `user_id` em todas as requisições do chat
- [ ] Ativar streaming para manter a conexão aberta
- [ ] Aumentar `max_tokens` para guardar mais turnos

> Por padrão, a Messages API é stateless: o contexto é o que você envia. Message threads (beta) guarda a conversa por pouco tempo, mas a aplicação ainda precisa manter sua cópia.

## apps-02
tipo: unica
skill: Claude API Mechanics

A API retorna 429 com o header `retry-after`. Qual é a reação correta?

- [x] Aguardar o tempo indicado e repetir com backoff
- [ ] Repetir na hora, em paralelo, até alguma passar
- [ ] Trocar a API key e repetir a requisição
- [ ] Descartar a requisição como inválida

> 429 é rate limit. Respeite `retry-after` e use backoff com jitter. Os SDKs já repetem algumas vezes.

## apps-03
tipo: multipla
skill: Claude API Mechanics

Quais erros normalmente **não** se resolvem repetindo a mesma requisição? (Escolha 2)

- [x] 400 `invalid_request_error`
- [x] 401 `authentication_error`
- [ ] 429 `rate_limit_error`
- [ ] 529 `overloaded_error`

> 400 e 401 exigem corrigir pedido ou credencial. 429 e 529 são transitórios.

## apps-04
tipo: unica
skill: Claude API Mechanics

O JSON da resposta vem cortado no meio e `stop_reason` é `max_tokens`. O que aconteceu?

- [x] A saída atingiu o limite definido na requisição
- [ ] O modelo concluiu a resposta e omitiu o fechamento
- [ ] O rate limit interrompeu a geração
- [ ] A chave da API expirou durante a chamada

> Em `max_tokens` a resposta está truncada. Aumente o limite ou reduza o pedido; não processe como completa.

## apps-05
tipo: unica
skill: Claude API Mechanics

50 mil avaliações precisam ser classificadas até amanhã, com o menor custo. O que usar?

- [x] Message Batches API
- [ ] Streaming em paralelo
- [ ] Fast mode em requisições síncronas
- [ ] Uma sessão de chat com todas as avaliações

> Sem urgência e alto volume: Batches, com 50% de desconto e janela de até 24 h.

## apps-06
tipo: unica
skill: Claude API Mechanics

Ao ler os resultados de um batch, o time associa cada um pela posição e os dados saem trocados. Como corrigir?

- [x] Associar cada resultado pelo `custom_id`
- [ ] Ordenar os resultados pelo horário de término
- [ ] Enviar um batch por requisição
- [ ] Ler os resultados com streaming

> A ordem não é garantida. `custom_id` existe para isso.

## apps-07
tipo: unica
skill: Claude API Mechanics

Uma interface de chat parece travada por 20 segundos antes de mostrar a resposta longa. O que melhora a percepção primeiro?

- [x] Streaming via server-sent events
- [ ] Message Batches API
- [ ] Aumento de `max_tokens` na requisição
- [ ] Retries mais agressivos

> Streaming reduz o tempo até o primeiro texto visível, mesmo que o total seja parecido.

## apps-08
tipo: ordem
skill: Claude API Mechanics

Ordene os eventos de um stream com um único bloco de texto.

1. `message_start`
2. `content_block_start`
3. `content_block_delta`
4. `content_block_stop`
5. `message_delta`
6. `message_stop`

> `message_delta` traz o `stop_reason` e o uso final, logo antes de `message_stop`.

## apps-09
tipo: unica
skill: Claude API Mechanics

A conexão cai no meio de um stream, sem `message_stop`. O que a aplicação deve fazer?

- [x] Tratar a resposta como incompleta e aplicar recuperação
- [ ] Salvar o texto parcial como resposta final, já que houve HTTP 200
- [ ] Assumir `end_turn`, pois houve texto
- [ ] Executar tools com o JSON parcial recebido

> HTTP 200 só indica que o stream começou. Sem o evento final, a resposta é parcial; nunca execute input incompleto.

## apps-10
tipo: unica
skill: Claude API Mechanics

O mesmo PDF é usado em dezenas de requisições. Como evitar reenviar os bytes?

- [x] Subir pela Files API e referenciar o `file_id`
- [ ] Converter em base64 e comprimir a cada requisição
- [ ] Colar o nome do arquivo no prompt
- [ ] Guardar o PDF no campo de metadados

> Com a Files API você envia uma vez e referencia o ID. Os tokens do conteúdo ainda contam no contexto.

## apps-11
tipo: unica
skill: Claude Application Design

O app precisa de JSON que siga exatamente um schema. Qual é a opção mais robusta?

- [x] Structured outputs com o JSON Schema em `output_config.format`
- [ ] Pedir "responda apenas com JSON" e usar regex
- [ ] Prefill com `{` na última mensagem do assistant e parser tolerante
- [ ] Temperatura zero com um exemplo no prompt

> Structured outputs restringe a geração ao schema, exceto em `refusal` ou `max_tokens`, que devem ser tratados. Prefill do último turno é rejeitado em modelos recentes.

## apps-12
tipo: unica
skill: Claude Application Design

Respostas precisam apontar o trecho exato do documento que as sustenta. O que usar?

- [x] Blocos `document` com citations habilitadas
- [ ] Temperatura baixa e pedido de honestidade
- [ ] Pergunta repetida até as respostas coincidirem
- [ ] Um modelo maior sem enviar o documento

> Citations devolve trechos com localização. Também instrua o modelo a dizer quando a resposta não está na fonte.

## apps-13
tipo: unica
skill: Claude Application Design

Onde devem ficar papel e regras permanentes do assistente em um app via API?

- [x] No parâmetro `system`
- [ ] No nome da API key
- [ ] No `custom_id` da requisição
- [ ] Na última resposta do assistant

> O system prompt define papel e regras do operador; o conteúdo do usuário vai nos turnos user.

## apps-14
tipo: unica
skill: Claude Application Design

Um prompt que funciona no claude.ai se comporta diferente via API. Qual a causa mais provável?

- [x] A API não inclui o system prompt e as ferramentas do claude.ai
- [ ] A API aplica um system prompt oculto mais restritivo que o do site
- [ ] A API usa sempre modelos com menos contexto
- [ ] A API ignora a formatação em Markdown

> Cada superfície tem instruções e tools próprias. Na API, você precisa fornecer as suas.

## apps-15
tipo: unica
skill: Claude Application Design

Uma sessão misturou três tarefas sem relação e a qualidade caiu. Qual prática de *session hygiene* ajuda mais?

- [x] Começar uma sessão limpa para cada tarefa
- [ ] Manter tudo junto para acumular contexto
- [ ] Reenviar todos os arquivos em cada turno
- [ ] Trocar de modelo a cada mensagem enviada

> Contexto irrelevante distrai e custa. Separe tarefas e leve só o que for necessário.

## apps-16
tipo: unica
skill: Configuration Management

Um prompt em produção foi editado direto no painel e a qualidade caiu. O que teria facilitado voltar atrás?

- [x] Prompts versionados no repositório, com revisão e evals
- [ ] Um backup diário do banco de dados usado pela aplicação
- [ ] Um aumento no número de retries da aplicação
- [ ] Uma API key separada para cada desenvolvedor

> Prompt é código: versão, review, eval e rollback.

## apps-17
tipo: unica
skill: Configuration Management

Por que fixar a versão do modelo em produção em vez de seguir automaticamente a mais nova?

- [x] Para mudar só depois de rodar evals e checar breaking changes
- [ ] Para garantir respostas idênticas a cada execução do mesmo prompt
- [ ] Para que a versão fixada nunca seja descontinuada
- [ ] Para eliminar o custo dos tokens de entrada

> Modelos novos podem mudar comportamento e parâmetros. Fixe, teste, migre; e acompanhe o calendário de descontinuação.

## apps-18
tipo: unica
skill: Understanding Requirements

O cliente pede "um chatbot com IA". O que definir **antes** de escolher o modelo?

- [x] Casos de uso, critérios de sucesso e limites de custo e latência
- [ ] O nome do assistente, a personalidade e os textos de boas-vindas
- [ ] A quantidade de subagents da arquitetura
- [ ] O maior valor possível para `max_tokens`

> Modelo e arquitetura derivam de requisitos mensuráveis.

## apps-19
tipo: multipla
skill: Systems Life Cycle

Após lançar um app com Claude, o que deve ser monitorado? (Escolha 3)

- [x] Qualidade amostrada das respostas
- [x] Uso de tokens e custo
- [x] Latência e taxa de erros
- [ ] Pesos internos do modelo
- [ ] Cor do tema escolhido

> Operação inclui qualidade, custo e confiabilidade, realimentando os evals com falhas reais.

## apps-20
tipo: unica
skill: Software Engineering Foundations

Um job async dispara 2.000 chamadas simultâneas e recebe muitos 429. Qual ajuste é o mais adequado?

- [x] Limitar a concorrência com semáforo ou fila
- [ ] Dividir o job em processos sem limite comum
- [ ] Aumentar o timeout para uma hora
- [ ] Desativar os retries do SDK

> Controle a concorrência conforme seus limites. Retries sozinhos só repetem a rajada.

## apps-21
tipo: unica
skill: Software Engineering Foundations

Retentar uma operação que cobra o cliente pode duplicar a cobrança. Qual padrão protege?

- [x] Chave de idempotência por operação
- [ ] Prompt pedindo para não duplicar
- [ ] Streaming da resposta de cobrança
- [ ] Log detalhado de cada tentativa

> Idempotência garante que repetir tenha o mesmo efeito de executar uma vez.

## apps-22
tipo: unica
skill: Software Engineering Foundations

Claude fará um refactoring grande em código legado. Qual é o primeiro passo mais seguro?

- [x] Criar testes que capturem o comportamento atual
- [ ] Pedir a reescrita completa em um único commit
- [ ] Desativar o CI até o refactoring terminar
- [ ] Remover o código que parece não ser usado

> Testes de caracterização dão sinal verificável; depois avance em passos pequenos e revisáveis.

## apps-23
tipo: unica
skill: Claude API Mechanics

A resposta chega com HTTP 200 e `stop_reason: "refusal"`. O que o código deve fazer?

- [x] Tratar a recusa em um caminho próprio antes de ler o conteúdo
- [ ] Repetir a mesma requisição com backoff até que ela seja aceita
- [ ] Considerar sucesso, já que o status é 200
- [ ] Reportar uma falha de autenticação ao usuário

> Nem todo resultado não ideal vira exceção HTTP. Ramifique pelo `stop_reason`.

## apps-24
tipo: unica
skill: Claude API Mechanics

Sua empresa exige que o acesso ao Claude passe pelo Amazon Bedrock, com IAM. O que considerar?

- [x] Usar o cliente do provedor e checar a disponibilidade de recursos
- [ ] Usar a chave da Anthropic dentro do header do IAM
- [ ] Supor paridade total de recursos e IDs de modelo
- [ ] Usar o cliente padrão da Anthropic trocando somente a URL de base

> Bedrock, Vertex e Foundry diferem em autenticação, IDs e recursos disponíveis. Claude Platform on AWS é outra opção: usa IAM, mas é operado pela Anthropic.
