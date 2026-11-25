dominio: model

# Questões de simulado

## model-501
tipo: unica
skill: Model Selection and Tradeoffs

Um app de suporte tem 85% de perguntas simples e 15% de diagnósticos longos. Hoje tudo vai para o maior modelo. Um teste com o menor manteve a qualidade nas simples e caiu nas demais. O custo precisa cair pela metade. Qual próximo passo é o melhor?

- [ ] Manter o maior modelo e reduzir `max_tokens` à metade, o que corta o custo na mesma proporção
- [x] Testar um roteador, medindo também os erros dele e o custo por pergunta resolvida em cada rota
- [ ] Mover tudo para o menor modelo, pois ele atende à maioria e corta o custo mais que o exigido
- [ ] Rotear pelo tamanho da mensagem, que não custa nada, e lançar acompanhando o custo por chamada

> O perfil misto favorece roteamento, desde que o roteador seja avaliado. O menor piora 15%; tamanho não indica dificuldade e custo por chamada não mostra a qualidade; cortar `max_tokens` trunca respostas e não mexe na entrada.

## model-502
tipo: unica
skill: Model Selection and Tradeoffs

Um copiloto de trading usa Opus e precisa de respostas mais rápidas na tela. A qualidade atual é necessária, o custo é secundário e o tempo até o primeiro token já é bom: o que demora é o restante do texto. O que testar primeiro?

- [ ] Um modelo menor com effort máximo, que tende a igualar a qualidade com uma saída mais veloz
- [ ] O mesmo modelo com effort menor, pedindo no prompt respostas igualmente cuidadosas
- [x] Fast mode no modelo, se ele for compatível, comparando a velocidade de saída e o custo
- [ ] Prompt caching do histórico, que reduz o processamento da entrada e encurta a geração do texto

> O gargalo é a velocidade de saída, que é o alvo do fast mode. Cache atua na entrada; a equivalência do modelo menor não foi medida; effort menor pode reduzir a qualidade exigida.

## model-503
tipo: unica
skill: Model Selection and Tradeoffs

Dois modelos passam no eval de uma tarefa. A: custa 1 por chamada e resolve 70% na primeira; o resto vai para um humano, a 20 por caso. B: custa 4 por chamada e resolve 92%, com o mesmo destino para o resto. Qual é mais barato por caso?

- [ ] A, pois a chamada custa um quarto da de B e a maior parte dos casos nem chega ao humano
- [ ] Os dois se equivalem, pois a diferença de preço compensa a diferença na taxa de solução
- [ ] Não dá para saber, pois o custo humano não deve entrar na comparação entre dois modelos
- [x] B, pois custa cerca de 5,6 por caso, contra cerca de 7 do A, somando a parte humana

> A: 1 + 0,30 × 20 = 7. B: 4 + 0,08 × 20 = 5,6. Compare o custo por tarefa concluída, e não o da chamada. O custo humano faz parte de resolver o caso.

## model-504
tipo: unica
skill: Cost and Token Management

Um tutor envia, a cada turno: data e hora, nome do aluno, 25 mil tokens de apostila e a conversa. O cache está ativo no fim da apostila, mas quase não há leitura. Alunos trocam mensagens a cada minuto. Qual mudança traz mais ganho?

- [x] Pôr a apostila no início e deixar data, hora e nome depois do ponto de cache
- [ ] Usar o TTL de uma hora, pois o padrão expira entre as mensagens dos alunos
- [ ] Criar um ponto de cache em cada parágrafo da apostila, para aumentar os acertos
- [ ] Pôr a apostila na primeira mensagem, mantendo data, hora e nome no system prompt

> O conteúdo variável no início muda o prefixo. As mensagens chegam a cada minuto, então o TTL padrão basta; há limite de breakpoints; `system` vem antes das mensagens, e o prefixo seguiria mudando.

## model-505
tipo: multipla
skill: Cost and Token Management

Um agent de 60 turnos custa mais do que o previsto. O relatório mostra: 92% dos tokens são de entrada, sem leitura de cache; 40% da entrada são resultados antigos de busca; a saída é curta. Quais medidas atacam o maior custo? (Escolha 2)

- [x] Ativar prompt caching, para que o histórico repetido seja lido a um custo menor
- [x] Fazer as tools devolverem só o necessário, reduzindo o que se acumula no histórico
- [ ] Reduzir `max_tokens` por turno, já que a saída é multiplicada pelos 60 turnos
- [ ] Pedir respostas mais breves no system prompt, para encurtar o texto de cada turno
- [ ] Trocar o streaming por respostas completas, que consomem menos tokens de entrada

> O custo está na entrada repetida. Saída curta não é o alvo, e streaming não altera tokens. Cuidado ao podar o histórico já enviado: isso invalida o cache a partir dali.

## model-506
tipo: unica
skill: LLM Fundamentals

Um sistema de relatórios de auditoria exige que o mesmo documento gere o mesmo texto em qualquer data. O time pensou em fixar parâmetros de geração. O documento raramente muda, e os relatórios são consultados por anos. Qual desenho atende à exigência?

- [ ] Usar prompt caching com TTL longo, para que a resposta anterior seja devolvida sem alterações
- [ ] Guardar o prompt, a versão do modelo e os parâmetros, e gerar o texto de novo a cada consulta
- [x] Gerar uma vez, guardar o texto com a versão do documento e servir sempre o que foi guardado
- [ ] Fixar o modelo e os parâmetros de geração, o que torna a saída idêntica a cada nova execução

> Geração não garante saída idêntica; persistir o artefato garante. O cache guarda o processamento da entrada, e não a resposta; guardar os insumos não garante a mesma saída.

## model-507
tipo: unica
skill: LLM Fundamentals

Ao migrar para um modelo atual, um time mantém thinking adaptativo e recebe respostas vazias em alguns pedidos difíceis, com `stop_reason: "max_tokens"` e o limite em 1.000. As perguntas fáceis funcionam. Qual é a explicação mais provável e o ajuste?

- [ ] O modelo se recusou a responder; tratar o caso como recusa e reformular a pergunta original
- [ ] O contexto de entrada estourou; reduzir o histórico até que os pedidos difíceis caibam
- [ ] O thinking adaptativo falha em casos difíceis; desligá-lo em todos os pedidos da aplicação
- [x] O raciocínio também consome o teto de saída; aumentar `max_tokens` e calibrar o effort

> `max_tokens` limita o total gerado, inclusive o raciocínio. Recusa e estouro de contexto teriam outro `stop_reason`; desligar o thinking perde justamente onde ele ajuda.

## model-508
tipo: unica
skill: Technical Fundamentals

Um serviço Python assíncrono faz 500 chamadas com `gather` de uma vez. Funciona em teste, mas em produção surgem muitos 429 e a memória sobe. O prazo permite alguns minutos. Qual ajuste mantém a vazão sem esse problema?

- [x] Limitar a concorrência com um semáforo calibrado pelos limites da conta e manter o backoff
- [ ] Trocar `gather` por um laço com `await`, que faz uma chamada por vez e respeita os limites
- [ ] Manter o `gather` e subir os retries do SDK de 2 para 10 nos erros 429
- [ ] Abrir um processo Python por chamada, para que cada um tenha sua própria cota de requisições

> Concorrência limitada usa a capacidade sem ultrapassá-la. Em série perde vazão; mais retries não reduzem o pico nem a memória; a cota é da conta, e não do processo.
