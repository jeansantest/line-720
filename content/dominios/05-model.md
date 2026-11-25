id: model
nome: Model Selection and Optimization
cor: #b8860b

# Briefing
- Escolha pelo eval: o modelo mais barato que atende à qualidade.
- Cache é por prefixo: conteúdo estável primeiro, volátil no fim.
- Ordem do prefixo: `tools` → `system` → `messages`.
- Effort ajusta profundidade e gasto; `max_tokens` é teto rígido.
- Meça custo por tarefa concluída, não por requisição.

# Questões

## model-01
tipo: unica
skill: Model Selection and Tradeoffs

Milhões de mensagens curtas por dia precisam de classificação simples e rápida. Por onde começar o teste?

- [x] Haiku, validando a qualidade com um eval
- [ ] Opus em effort máximo, por segurança
- [ ] Opus coordenando subagents Sonnet por mensagem
- [ ] O modelo com maior context window

> Volume alto e tarefa simples favorecem o modelo menor. O eval diz se basta.

## model-02
tipo: unica
skill: Cost and Token Management

O cache nunca acerta. O system prompt começa com `Agora são 14:03:22`. O que fazer?

- [x] Mover o horário para depois do conteúdo cacheado
- [ ] Aumentar o TTL do cache para uma hora
- [ ] Adicionar mais breakpoints após o horário
- [ ] Trocar o formato do horário para UTC

> Cache é correspondência exata de prefixo. Qualquer mudança no início invalida o que vem depois.

## model-03
tipo: ordem
skill: Cost and Token Management

Ordene o conteúdo para maximizar prompt caching.

1. Definições de tools, estáveis
2. System prompt fixo
3. Documento de referência compartilhado
4. Histórico da conversa
5. Pergunta nova do usuário

> Do mais estável ao mais volátil, na ordem `tools`, `system`, `messages`.

## model-04
tipo: unica
skill: Cost and Token Management

Como confirmar que o prompt caching está funcionando?

- [x] Conferir `usage.cache_read_input_tokens` nas respostas
- [ ] Conferir se `input_tokens` permanece igual nas respostas
- [ ] Conferir se o status HTTP mudou para 304
- [ ] Conferir se `output_tokens` caiu para zero

> Leituras do cache aparecem em `usage`. Zero em chamadas repetidas indica invalidador silencioso ou prefixo curto demais.

## model-05
tipo: unica
skill: LLM Fundamentals

Por que a mesma entrada pode gerar respostas diferentes?

- [x] A geração amostra o próximo token de uma distribuição
- [ ] O modelo é ajustado com o feedback de chamadas anteriores
- [ ] A API guarda e altera o prompt anterior
- [ ] O tokenizer escolhe idiomas ao acaso

> A geração é probabilística. Projete validação e evals para tolerar variação.

## model-06
tipo: unica
skill: LLM Fundamentals

Qual é a relação entre `max_tokens` e effort?

- [x] `max_tokens` é um teto rígido; effort orienta quanto o modelo se aprofunda
- [ ] São dois nomes para o mesmo limite de tokens de saída
- [ ] Effort é um teto rígido de raciocínio; `max_tokens` orienta o estilo da resposta
- [ ] `max_tokens` limita a entrada e effort limita a saída

> Atingir `max_tokens` trunca. Effort influencia o gasto, mas não é um corte.

## model-07
tipo: unica
skill: LLM Fundamentals

Nos modelos recentes, o que *adaptive thinking* significa?

- [x] O modelo decide quando e quanto raciocinar conforme a tarefa
- [ ] O desenvolvedor fixa um orçamento exato de tokens de raciocínio
- [ ] O modelo aprende permanentemente com cada conversa
- [ ] A API troca de modelo a cada pergunta difícil

> Substitui o orçamento fixo nos modelos recentes; use effort para ajustar.

## model-08
tipo: unica
skill: Model Selection and Tradeoffs

Ao migrar de um modelo antigo, requisições com prefill do assistant passam a retornar 400. Qual a lição?

- [x] Ler o guia de migração e testar antes de trocar o modelo
- [ ] Repetir a requisição até o novo modelo aceitar
- [ ] Migrar primeiro em produção e corrigir os erros que surgirem
- [ ] Esconder o erro e devolver uma resposta vazia

> Versões podem remover parâmetros. Structured outputs costuma substituir o prefill de formato.

## model-09
tipo: unica
skill: Cost and Token Management

Um modelo custa metade por token, mas precisa de três tentativas por tarefa. Como comparar?

- [x] Pelo custo total por tarefa concluída
- [ ] Pelo preço por milhão de tokens
- [ ] Pelo número de tokens da primeira tentativa
- [ ] Pelo tamanho da context window

> Retries e turnos extras podem anular o preço menor.

## model-10
tipo: unica
skill: Cost and Token Management

Como estimar os tokens de um prompt para Claude antes de enviá-lo?

- [x] Com o endpoint de token counting da API
- [ ] Com o tokenizer de outro fornecedor
- [ ] Dividindo os caracteres sempre por dois
- [ ] Somando apenas as palavras do usuário

> Tokenizers diferem entre fornecedores e até entre gerações do Claude.

## model-11
tipo: unica
skill: LLM Fundamentals

Uma tarefa com formato incomum falha só com instruções. Qual técnica tentar em seguida?

- [x] Multi-shot, com exemplos variados do formato
- [ ] Um modelo com context window maior, sem exemplos
- [ ] Zero-shot repetido várias vezes
- [ ] Streaming da resposta completa

> Exemplos diversos mostram o padrão que instruções não conseguiram descrever.

## model-12
tipo: multipla
skill: Cost and Token Management

Quais medidas reduzem custo **sem** trocar de modelo? (Escolha 3)

- [x] Cachear o prefixo grande e repetido
- [x] Usar Batches no que não é urgente
- [x] Limitar o tamanho dos resultados de tools na origem
- [ ] Ativar fast mode em todas as chamadas
- [ ] Elevar effort em tarefas triviais

> Fast mode custa mais por token; effort alto gasta mais tokens. Reduza resultados na origem: limpar histórico já enviado libera contexto, mas invalida o cache a partir daquele ponto e pode sair mais caro.

## model-13
tipo: unica
skill: Technical Fundamentals

Qual é uma vantagem do SDK oficial sobre chamadas HTTP manuais?

- [x] Tipos, retries e helpers de streaming prontos
- [ ] Modelos exclusivos que o REST não oferece
- [ ] Cache automático e gratuito de todas as respostas
- [ ] Histórico da conversa salvo no servidor

> O SDK envolve a mesma API REST e poupa código repetitivo.

## model-14
tipo: unica
skill: Technical Fundamentals

Para receber texto de Claude em streaming pela Messages API, qual mecanismo é usado?

- [x] Server-sent events sobre HTTP
- [ ] WebSocket em conexão persistente
- [ ] Transferência por FTP
- [ ] Webhook por cada token

> Com `stream: true`, os eventos chegam por SSE na resposta HTTP.

## model-15
tipo: unica
skill: LLM Fundamentals

A auditoria exige respostas **byte a byte idênticas** para a mesma entrada. O que é correto dizer?

- [ ] Basta usar streaming para estabilizar a saída
- [ ] Fixar `max_tokens` garante a mesma resposta
- [ ] O prompt caching repete a resposta anterior
- [x] Não há garantia; valide e tolere variação

> Nenhum parâmetro garante saída idêntica. Se precisa repetir, guarde a resposta na sua aplicação. Modelos e versões recentes da API nem aceitam `temperature`.

## model-16
tipo: unica
skill: LLM Fundamentals

Em um modelo **recente**, a entrada cabe na janela, mas entrada + `max_tokens` passa dela. O que acontece?

- [ ] A API corta o começo da entrada para caber
- [x] A API aceita e pode parar ao encher a janela
- [ ] A API muda para um modelo de janela maior
- [ ] A API cobra em dobro os tokens que excedem

> Entrada e saída dividem a janela. Dos modelos 4.5 em diante a requisição é aceita e pode terminar com `model_context_window_exceeded`; nos anteriores é erro de validação. Se só a entrada já não cabe, é 400 em todos.

## model-17
tipo: multipla
skill: Cost and Token Management

Quais afirmações sobre o custo do **prompt caching** são corretas? (Escolha 2)

- [x] Gravar no cache custa mais que a entrada comum
- [ ] O cache também dá desconto nos tokens de saída
- [x] Ler do cache custa bem menos que a entrada comum
- [ ] O que foi gravado fica disponível para sempre

> Paga-se um adicional na gravação e economiza-se nas leituras, dentro do TTL (5 minutos por padrão, renovado a cada uso).

## model-18
tipo: unica
skill: Cost and Token Management

Um prefixo de 30 mil tokens é usado **uma vez por dia**. Vale cacheá-lo com o TTL padrão?

- [ ] Sim, pois toda leitura futura terá desconto
- [ ] Sim, pois a gravação é sempre gratuita
- [ ] Não, pois o cache aceita só textos pequenos
- [x] Não, pois ele expira antes de ser relido

> Sem releitura dentro do TTL, você paga o adicional da gravação e nunca colhe o desconto.

## model-19
tipo: unica
skill: Model Selection and Tradeoffs

Um copiloto ao vivo precisa da qualidade do Opus, mas a saída é lenta. O custo é secundário. Qual opção testar?

- [ ] Message Batches API para ganhar vazão
- [ ] Mais effort para o modelo pensar melhor
- [x] Fast mode, em um modelo que o aceite
- [ ] Prompt caching dos tokens de saída

> Fast mode acelera a saída do mesmo modelo, por um preço maior. Não funciona em Batches.

## model-20
tipo: unica
skill: LLM Fundamentals

Um app antigo fixa `budget_tokens` para o raciocínio. Ao migrar para um modelo atual, qual é o equivalente recomendado?

- [ ] Aumentar `budget_tokens` até a qualidade subir
- [x] Adaptive thinking, com effort para ajustar
- [ ] Fast mode, que reduz o tempo de raciocínio
- [ ] Pedir no prompt o número exato de tokens

> Nos modelos atuais o orçamento fixo é rejeitado ou obsoleto: o modelo decide quando pensar e o effort orienta o quanto.

## model-21
tipo: unica
skill: Cost and Token Management

`usage` mostra `input_tokens: 40` e `cache_read_input_tokens: 9000`. Qual foi a entrada total?

- [ ] 40, pois o cache não conta como entrada
- [ ] 9.000, pois os 40 já estão incluídos neles
- [ ] 8.960, pois os 40 são descontados do cache
- [x] 9.040, mais o que tiver sido gravado no cache

> Total = `input_tokens` + `cache_creation_input_tokens` + `cache_read_input_tokens`.

## model-22
tipo: unica
skill: Cost and Token Management

O caching está ativo em um prompt curto, sem erro, mas gravação e leitura ficam em **zero**. Por quê?

- [ ] O cache exige pelo menos três mensagens
- [ ] O prompt contém exemplos few-shot
- [x] O prefixo está abaixo do mínimo do modelo
- [ ] O cache só funciona com streaming ativo

> Abaixo do mínimo, a requisição roda sem cache e sem erro. O mínimo varia por modelo.

## model-23
tipo: unica
skill: Cost and Token Management

Um app acrescenta uma tool no **início** da lista e o cache zera. Por quê?

- [ ] A nova tool muda o modelo usado na requisição
- [x] As tools vêm antes de system e messages no prefixo
- [ ] As tools ficam fora do cache em qualquer situação
- [ ] O cache guarda só a última tool da lista

> A ordem é tools, system, messages: mudar um nível invalida ele e os seguintes.

## model-24
tipo: unica
skill: Cost and Token Management

Um agent espera aprovação humana por 20 a 40 minutos entre turnos. Qual ajuste de cache avaliar?

- [x] TTL de 1 hora, se as releituras compensarem
- [ ] TTL padrão, pois ele dura o dia inteiro
- [ ] Nenhum cache, pois há humano no processo
- [ ] Quatro breakpoints no mesmo bloco de texto

> O TTL padrão expiraria. O de 1 hora custa mais para gravar; faça a conta.

## model-25
tipo: unica
skill: Cost and Token Management

Qual tende a ser o maior desperdício em um agent de 50 turnos **sem** caching?

- [ ] Gerar o texto final da última resposta
- [ ] Definir o nome das tools na primeira vez
- [ ] Abrir a conexão HTTP com o servidor
- [x] Reprocessar o mesmo histórico a cada turno

> A entrada acumulada cresce a cada turno; o prefixo repetido é o alvo do cache.

## model-26
tipo: unica
skill: Model Selection and Tradeoffs

Um sistema tem 90% de pedidos fáceis e 10% difíceis. Qual desenho costuma equilibrar custo e qualidade?

- [ ] Usar sempre o menor modelo em todos os pedidos
- [ ] Sortear o modelo a cada um dos pedidos
- [x] Rotear por dificuldade, com evals por rota
- [ ] Usar sempre o maior modelo em todos os pedidos

> Roteamento só vale se o classificador e cada rota forem medidos.

## model-27
tipo: unica
skill: Model Selection and Tradeoffs

Antes de subir para um modelo mais caro, o que testar primeiro?

- [ ] Remover os evals para poupar tokens
- [x] Melhorar prompt, contexto e effort no atual
- [ ] Trocar o idioma de todos os prompts do app
- [ ] Dobrar o `max_tokens` das requisições

> Muitas falhas são de contexto ou instrução. Meça antes de pagar mais.

## model-28
tipo: unica
skill: Model Selection and Tradeoffs

Um benchmark público aponta o modelo X como o melhor. Qual é o uso correto desse dado?

- [x] Como pista, confirmada com o seu próprio eval
- [ ] Como prova, já que o ranking é independente
- [ ] Como motivo para trocar o modelo hoje mesmo
- [ ] Como substituto dos testes de regressão

> Sua distribuição de tarefas pode diferir da medida pelo benchmark.

## model-29
tipo: multipla
skill: Model Selection and Tradeoffs

Quais critérios devem entrar na escolha do modelo? (Escolha 2)

- [x] Latência exigida pelo usuário
- [ ] Posição em um ranking público
- [ ] Data de lançamento do modelo
- [x] Qualidade medida na sua tarefa

> Some custo por tarefa concluída e recursos necessários (visão, contexto, tools).

## model-30
tipo: unica
skill: LLM Fundamentals

Por que pedir ao modelo a contagem de letras ou caracteres pode falhar?

- [ ] O `max_tokens` corta a contagem no meio
- [ ] O effort padrão é baixo para contar
- [x] Ele processa tokens, não letras isoladas
- [ ] Ele não foi exposto a textos com letras

> Para contagem exata, use código ou uma tool.

## model-31
tipo: unica
skill: LLM Fundamentals

O modelo responde com segurança sobre um evento de **ontem**, sem tools. Como tratar?

- [ ] Como recusa disfarçada do modelo
- [x] Como não confiável: falta fonte atual
- [ ] Como correta, pois o tom é seguro
- [ ] Como correta, se ele repetir a resposta

> O conhecimento tem data de corte; forneça a informação por busca ou contexto.

## model-32
tipo: unica
skill: LLM Fundamentals

Uma tarefa **simples** de formatação está lenta e cara com effort alto. O que testar?

- [x] Reduzir o effort e conferir no eval
- [ ] Aumentar `max_tokens` para acelerar
- [ ] Ativar mais tools no mesmo pedido
- [ ] Repetir a instrução três vezes

> Effort é a alavanca de profundidade versus custo e tempo.

## model-33
tipo: unica
skill: LLM Fundamentals

Zero-shot, one-shot e few-shot diferem em quê?

- [ ] No número de chamadas feitas à API
- [ ] No número de tokens que o modelo gera
- [ ] No número de modelos usados em paralelo
- [x] No número de exemplos dados no prompt

> Comece simples; acrescente exemplos quando o eval mostrar ganho.

## model-34
tipo: unica
skill: Technical Fundamentals

Duas corrotinas Python fazem chamadas, mas rodam uma após a outra: `await a(); await b()`. Como torná-las concorrentes?

- [ ] `time.sleep(0)` entre as duas chamadas
- [ ] Trocar `async def` por `def`
- [x] `await asyncio.gather(a(), b())`
- [ ] `await a() and await b()`

> Aguardar em série não é concorrência; `gather` as agenda juntas.

## model-35
tipo: unica
skill: Technical Fundamentals

Um cliente HTTP próprio recebe um stream SSE e faz `JSON.parse` de **cada pedaço** de rede. Por que falha às vezes?

- [ ] A rede sempre entrega dois eventos por vez
- [x] Um evento pode chegar dividido em vários pedaços
- [ ] O SSE manda os eventos em formato binário
- [ ] O JSON do SSE usa aspas simples nas chaves

> Acumule em buffer e separe por evento antes de interpretar; o SDK já faz isso.
