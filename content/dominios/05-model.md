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
