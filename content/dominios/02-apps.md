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

## apps-25
tipo: unica
skill: Understanding Requirements

Objetivo: responder propostas em até uma hora. Qual item é um requisito de **infraestrutura** derivado dele?

- [ ] O sistema deve gerar um rascunho para cada proposta
- [x] Suportar 200 chamadas simultâneas no pico, em 2 zonas
- [ ] A empresa quer fechar 15% mais contratos no próximo ano
- [ ] O texto das respostas deve seguir o tom da marca

> Infraestrutura trata de capacidade e disponibilidade. Os outros são função, objetivo de negócio e estilo.

## apps-26
tipo: multipla
skill: Understanding Requirements

Quais são requisitos **não funcionais** de um assistente de clínica? (Escolha 2)

- [x] Estar disponível 99,9% do mês
- [ ] Agendar consultas pelo chat
- [x] Isolar os dados de cada paciente
- [ ] Enviar lembrete na véspera

> Não funcional é qualidade do sistema (disponibilidade, segurança). Agendar e lembrar são funções.

## apps-27
tipo: unica
skill: Claude API Mechanics

Um app de manutenção envia ao Claude a string `"C:/fotos/painel.jpg"` e o modelo responde que não vê imagem. Qual é a correção?

- [ ] Pedir no prompt que o modelo abra o arquivo no disco
- [ ] Converter a foto em texto com OCR, pois a API só lê texto
- [ ] Usar streaming, que permite enviar arquivos binários
- [x] Enviar um bloco `image` em base64, URL ou `file_id`

> A API não lê seu disco. Imagens vão como blocos de conteúdo, junto do texto.

## apps-28
tipo: unica
skill: Software Engineering Foundations

Um job traduz 400 fichas em um `for` serial e leva 2 horas. O usuário espera o resultado em **minutos**. O que fazer?

- [ ] Juntar as 400 fichas em uma única requisição
- [ ] Mover tudo para a Message Batches API
- [x] Enviar em paralelo, com limite de concorrência
- [ ] Ativar streaming para acelerar cada resposta

> Itens independentes paralelizam bem. Batches pode levar até 24 horas; streaming só muda a entrega.

## apps-29
tipo: unica
skill: Systems Life Cycle

Um app está no ar há meses. A equipe acompanha custo, corrige prompts e planeja trocar de modelo. Que fase é essa?

- [ ] Análise de requisitos da solução
- [x] Operação e manutenção
- [ ] Desenho da arquitetura
- [ ] Implementação inicial do sistema

> Monitorar, corrigir e evoluir um sistema em produção é operação e manutenção.

## apps-30
tipo: unica
skill: Claude API Mechanics

Um time quer escrever um loop próprio de retry para 429 em volta do **SDK oficial**. O que verificar antes?

- [x] O SDK já faz retries; talvez baste ajustar `max_retries`
- [ ] O SDK não faz retries; o loop próprio é obrigatório
- [ ] Um 429 invalida a conversa, então retry não funciona
- [ ] Retries só existem na Batches API; é preciso migrar

> O SDK repete sozinho erros transitórios (2 vezes por padrão). Um loop por fora multiplica as tentativas.

## apps-31
tipo: unica
skill: Claude API Mechanics

Uma requisição define `stop_sequences: ["FIM"]` e termina nela. Qual `stop_reason` a resposta traz?

- [ ] `pause_turn`
- [x] `stop_sequence`
- [ ] `end_turn`
- [ ] `max_tokens`

> A sequência encontrada vem no campo `stop_sequence` da resposta.

## apps-32
tipo: unica
skill: Claude API Mechanics

O código lê `response.content[0].text` e quebra quando thinking ou tools estão ativos. Por quê?

- [x] `content` é uma lista de blocos de vários tipos
- [ ] `content` vira uma string quando há tools ativas
- [ ] O texto passa a ser devolvido no header HTTP
- [ ] O primeiro bloco de texto vem criptografado

> Percorra os blocos e filtre pelo `type`.

## apps-33
tipo: unica
skill: Claude API Mechanics

Um resultado de batch vem com tipo `expired`. O que significa?

- [ ] O resultado ficou disponível, mas foi cobrado em dobro
- [ ] O modelo recusou o pedido por política de uso
- [ ] O `custom_id` repetia o de um outro pedido
- [x] O pedido não foi processado dentro de 24 horas

> Pedidos expirados não são cobrados; reenvie os que faltaram.

## apps-34
tipo: unica
skill: Claude API Mechanics

Em um batch, 3 de 10 mil pedidos retornam `errored` por entrada inválida. Qual é a ação?

- [ ] Descartar os resultados dos dez mil
- [ ] Repetir os três até que funcionem
- [x] Corrigir e reenviar só esses três
- [ ] Reenviar o batch inteiro sem mudanças

> Cada pedido é independente. Entrada inválida não se resolve repetindo igual.

## apps-35
tipo: multipla
skill: Claude API Mechanics

Quais recursos **não** combinam com a Message Batches API? (Escolha 2)

- [ ] System prompt
- [x] Streaming da resposta
- [x] Fast mode
- [ ] Uso de tools

> Batch é assíncrono: não há stream nem modo rápido.

## apps-36
tipo: unica
skill: Claude API Mechanics

Um batch terminou há dois meses e o time quer baixar os resultados. O que esperar?

- [x] Podem não estar mais disponíveis para download
- [ ] Ficam guardados para sempre na conta da empresa
- [ ] São reenviados por e-mail ao abrir o painel
- [ ] Precisam ser pagos novamente para o download

> A retenção é limitada (29 dias na documentação consultada). Guarde os resultados no seu sistema.

## apps-37
tipo: unica
skill: Claude API Mechanics

A API responde 404 `not_found_error` logo após uma mudança de configuração. O que verificar primeiro?

- [ ] O saldo disponível de tokens por minuto
- [ ] O tamanho em bytes do corpo enviado
- [ ] O valor do header `retry-after`
- [x] O ID do modelo ou do recurso usado

> 404 indica recurso inexistente, muitas vezes um ID digitado errado ou aposentado.

## apps-38
tipo: unica
skill: Claude API Mechanics

Diferença entre 401 e 403 na API:

- [ ] 401 é limite de uso; 403, servidor sobrecarregado
- [ ] 401 é pedido grande; 403, formato de JSON inválido
- [x] 401 é credencial inválida; 403, falta de permissão
- [ ] 401 é falta de permissão; 403, credencial inválida

> Nenhum dos dois se resolve com retry.

## apps-39
tipo: unica
skill: Claude API Mechanics

Um cliente quer PDFs com **gráficos** analisados. O que é correto?

- [ ] Colar o PDF em base64 dentro do texto
- [x] Enviar o PDF como bloco `document`
- [ ] Extrair só o texto, pois imagens são ignoradas
- [ ] Converter o PDF em áudio antes do envio

> O bloco `document` permite usar texto e conteúdo visual das páginas, dentro dos limites.

## apps-40
tipo: unica
skill: Claude API Mechanics

Uma conversa multi-turno via API ficou cara a cada mensagem. Qual é a causa estrutural?

- [x] O histórico inteiro é enviado de novo a cada turno
- [ ] A API cobra uma taxa fixa por usuário conectado
- [ ] O modelo reprocessa os turnos de outros clientes
- [ ] O system prompt dobra de tamanho a cada resposta

> A API é stateless. Caching, compaction e janelas reduzem o custo.

## apps-41
tipo: unica
skill: Claude API Mechanics

Ao usar **citations** e `output_config.format` na mesma requisição, o que acontece?

- [ ] As citações viram campos do JSON
- [ ] O schema é ignorado em silêncio
- [ ] A resposta sai em duas partes
- [x] A API rejeita com erro 400

> Os recursos são incompatíveis. Escolha um deles, separe em duas chamadas ou veja na documentação o padrão para dados estruturados com citações.

## apps-42
tipo: multipla
skill: Claude API Mechanics

Com structured outputs ativo, em quais casos a saída ainda pode **não** seguir o schema? (Escolha 2)

- [ ] Uso de streaming
- [ ] Prompt em português
- [x] Corte por `max_tokens`
- [x] Recusa do modelo

> Cheque o `stop_reason` antes de confiar no JSON.

## apps-43
tipo: unica
skill: Claude Application Design

Um chat mostra a resposta em streaming e o usuário clica em "parar". O que o backend deve fazer?

- [ ] Enviar a mesma pergunta de novo, sem streaming
- [x] Cancelar a requisição e guardar o parcial marcado
- [ ] Deixar o stream seguir e ocultar o restante dele
- [ ] Apagar a conversa e iniciar uma outra sessão

> Cancelar poupa recursos; marcar como parcial evita tratá-lo como resposta completa.

## apps-44
tipo: unica
skill: Claude Application Design

O app atende 5 idiomas. Como decidir o idioma da resposta de forma previsível?

- [x] Regra no system prompt, com o idioma da conta
- [ ] Deixar o modelo escolher a cada mensagem
- [ ] Traduzir cada resposta para os cinco idiomas
- [ ] Usar um modelo diferente para cada idioma

> Regra explícita e dado confiável da aplicação dão previsibilidade.

## apps-45
tipo: unica
skill: Claude Application Design

Um assistente jurídico deve mostrar de onde veio cada afirmação. Qual desenho é mais verificável?

- [ ] Uma lista de links escrita pelo modelo de memória
- [ ] Uma nota de confiança de zero a cem por frase
- [ ] Um aviso de que a resposta pode conter erros
- [x] Citations ligadas ao trecho exibido ao usuário

> Citações estruturadas apontam para o documento fornecido; links de memória podem ser inventados.

## apps-46
tipo: unica
skill: Claude Application Design

Uma tela faz 4 chamadas ao modelo em sequência e demora 20 s. Duas não dependem das outras. O que fazer?

- [ ] Aumentar o `max_tokens` de todas as chamadas
- [ ] Repetir as chamadas mais lentas duas vezes
- [x] Paralelizar as independentes e mostrar parciais
- [ ] Trocar as quatro chamadas por um batch noturno

> Ataque o caminho crítico e a latência percebida.

## apps-47
tipo: unica
skill: Configuration Management

Prompt, modelo e schema mudam juntos em um release. Como permitir rollback **seguro**?

- [ ] Manter cada um em um painel editável à mão
- [x] Versioná-los como um conjunto e implantar juntos
- [ ] Guardar só o prompt, pois o resto pouco importa
- [ ] Anotar as mudanças em um documento do time

> A combinação testada é a unidade que deve voltar atrás.

## apps-48
tipo: multipla
skill: Configuration Management

Quais valores devem variar por **ambiente**, fora do código? (Escolha 2)

- [x] Credenciais de acesso
- [x] Limites de concorrência
- [ ] A lógica de validação do JSON
- [ ] O nome das funções internas

> Configuração por ambiente fica fora do código; segredos, em um secret manager.

## apps-49
tipo: unica
skill: Configuration Management

Um experimento com um novo prompt deve atingir 5% dos usuários e poder ser desligado na hora. O que usar?

- [ ] Uma branch que o time publica à noite
- [ ] Um aviso para os usuários recarregarem
- [ ] Um segundo sistema com outro domínio
- [x] Feature flag com métricas por variante

> Flags separam o deploy da liberação e permitem comparação e desligamento imediato.

## apps-50
tipo: unica
skill: Systems Life Cycle

Antes de aposentar um modelo em uso, o fornecedor anuncia a data. Qual plano é adequado?

- [ ] Trocar o ID direto em produção e observar
- [ ] Copiar as respostas antigas para um cache
- [x] Rodar evals no substituto e migrar com folga
- [ ] Esperar o último dia para evitar retrabalho

> Depreciação é evento previsto do ciclo de vida: inventário, eval, migração e rollback.

## apps-51
tipo: unica
skill: Systems Life Cycle

Em que fase devem surgir os critérios de aceite de um app com LLM?

- [ ] Durante a troca do primeiro modelo
- [x] Nos requisitos, antes da construção
- [ ] Depois do primeiro incidente grave
- [ ] Na documentação final do projeto

> Critérios cedo orientam design e evals; tarde, viram racionalização.

## apps-52
tipo: unica
skill: Software Engineering Foundations

Um worker recebe SIGTERM no meio de uma chamada de 40 s. Qual comportamento é correto?

- [x] Parar de aceitar tarefas e concluir ou reenfileirar
- [ ] Encerrar na hora, ignorando as tarefas em curso
- [ ] Reiniciar a chamada do zero até ela terminar
- [ ] Bloquear o sinal para nunca ser encerrado

> Graceful shutdown evita perda e duplicação de trabalho.

## apps-53
tipo: unica
skill: Software Engineering Foundations

Testes unitários de um app chamam a API real a cada commit: lentos e instáveis. O que fazer?

- [ ] Remover os testes que dependem de respostas
- [ ] Rodar os testes só uma vez por trimestre
- [ ] Repetir cada teste até ele passar
- [x] Simular a API neles e deixar evals à parte

> Teste a lógica com dublês; meça a qualidade do modelo em evals separados.

## apps-54
tipo: unica
skill: Software Engineering Foundations

Claude gerou um PR de 2.000 linhas que passa nos testes. Qual é a prática adequada?

- [ ] Aprovar, pedindo que Claude revise a si mesmo
- [ ] Recusar sempre, por ter sido gerado por IA
- [x] Dividir e revisar como código de qualquer pessoa
- [ ] Aprovar, já que os testes passaram sem nenhum erro

> Autoria não dispensa revisão; mudanças menores são revisáveis.

## apps-55
tipo: unica
skill: Understanding Requirements

O cliente pede "respostas 100% corretas". Como transformar em requisito útil?

- [ ] Incluir a frase exata no system prompt
- [x] Definir meta medida e o que fazer ao errar
- [ ] Prometer, desde que se use o maior modelo
- [ ] Retirar o tema para não criar expectativas

> Combine limite aceitável por tipo de erro com verificação, abstenção e escalada.
