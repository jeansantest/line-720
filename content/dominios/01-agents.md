id: agents
nome: Agents and Workflows
cor: #d4502f

# Briefing
- Comece pelo mais simples: uma chamada, depois workflow, só então agent.
- Workflow = caminho definido por código. Agent = modelo decide os próximos passos.
- O loop: enquanto `stop_reason` for `tool_use`, execute e devolva `tool_result`.
- Subagents isolam contexto; devolva ao pai só a conclusão.
- Regra que precisa valer sempre vai em hook ou código, não em prompt.

# Questões

## agents-01
tipo: unica
skill: Agent Architecture

Um sistema recebe faturas sempre no mesmo formato, extrai 6 campos, valida e grava. Os passos nunca mudam. Qual arquitetura escolher?

- [x] Workflow em código com chamadas a Claude nos passos de extração
- [ ] Agent autônomo com acesso ao banco e liberdade para planejar passos
- [ ] Manager com um subagent dedicado a cada campo da fatura
- [ ] Agent com memória persistente para lembrar faturas anteriores

> Passos previsíveis pedem workflow: mais barato, testável e previsível. Agents compensam quando o caminho não pode ser especificado antes.

## agents-02
tipo: multipla
skill: Agent Architecture

Quais condições favorecem um **agent** em vez de um workflow? (Escolha 2)

- [x] O número e a ordem dos passos dependem do que for descoberto
- [x] Erros podem ser detectados e corrigidos, por exemplo com testes
- [ ] A latência precisa ser mínima e constante em cada pedido
- [ ] A tarefa é uma classificação simples em cinco categorias

> Agents trocam custo e latência por flexibilidade. Precisam de complexidade, valor, viabilidade e erros recuperáveis.

## agents-03
tipo: ordem
skill: Agent Patterns and Frameworks

Ordene uma volta do loop manual de tool use.

1. Enviar mensagens e definições de tools para a API
2. Receber resposta com `stop_reason: "tool_use"`
3. Adicionar a resposta completa do assistant ao histórico
4. Executar as tools pedidas no seu ambiente
5. Enviar os blocos `tool_result` em uma mensagem user

> O conteúdo completo do assistant precisa entrar no histórico antes dos resultados, para os `tool_use_id` casarem.

## agents-04
tipo: unica
skill: Agent Patterns and Frameworks

Uma pesquisa em 40 arquivos enche o contexto do agent principal, que esquece o objetivo. Qual mudança ataca a causa?

- [x] Delegar a leitura a subagents que devolvem apenas as conclusões
- [ ] Repetir o objetivo em letras maiúsculas no system prompt
- [ ] Elevar `max_tokens` para dar mais espaço às respostas
- [ ] Pedir que o agent principal leia os arquivos em ordem alfabética

> Subagents têm contexto próprio. O conteúdo bruto fica neles e o pai recebe só o resumo.

## agents-05
tipo: unica
skill: Agent Construction with Claude

A equipe quer um agent que leia, edite arquivos e rode comandos **na própria infraestrutura**, com loop, permissões e subagents prontos. O que usar?

- [x] Claude Agent SDK
- [ ] Message Batches API
- [ ] Managed Agents em nuvem da Anthropic
- [ ] Token counting API

> O Agent SDK empacota o harness do Claude Code e você hospeda. Managed Agents roda o loop no lado da Anthropic.

## agents-06
tipo: unica
skill: Agent Construction with Claude

Qual é a diferença entre o **Tool Runner** do SDK da API e o **Claude Agent SDK**?

- [x] O Tool Runner automatiza o loop das tools que você define; o Agent SDK traz tools e harness prontos
- [ ] O Tool Runner roda em sandbox na nuvem da Anthropic; o Agent SDK só funciona com Message Batches assíncronos
- [ ] O Tool Runner serve só para MCP; o Agent SDK não aceita MCP
- [ ] São o mesmo pacote com nomes diferentes em Python e TypeScript

> Ambos são hospedados por você. Muda o escopo: loop fino sobre suas funções ou harness completo.

## agents-07
tipo: unica
skill: Agent Construction with Claude

Todo arquivo editado pelo agent precisa passar pelo formatter, sem exceção. Onde colocar a regra?

- [x] Em um hook executado após a edição
- [ ] No fim do system prompt, marcada como importante
- [ ] Em um exemplo few-shot com código formatado
- [ ] Na descrição da tool de edição de arquivos

> Hooks do tipo command rodam sempre que o evento ocorre. Instruções em prompt são seguidas na maioria das vezes, não garantidas.

## agents-08
tipo: unica
skill: Agent Architecture

Um pipeline recebe tickets e envia cada um ao prompt especializado: cobrança, técnico ou vendas. Qual padrão é esse?

- [x] Routing
- [ ] Prompt chaining
- [ ] Evaluator-optimizer
- [ ] Parallel voting

> Routing classifica a entrada e encaminha ao tratamento adequado.

## agents-09
tipo: unica
skill: Agent Architecture

Um modelo gera traduções, outro critica com critérios claros, e o ciclo repete até aprovar. Qual padrão é esse?

- [x] Evaluator-optimizer
- [ ] Routing
- [ ] Orchestrator-workers
- [ ] Sectioning paralelo

> Funciona quando há critérios claros e a iteração melhora o resultado de forma mensurável.

## agents-10
tipo: unica
skill: Agent Patterns and Frameworks

Claude devolve três blocos `tool_use` na mesma resposta. Como responder?

- [x] Com três `tool_result` juntos em uma única mensagem user
- [ ] Com três mensagens user separadas, uma para cada resultado
- [ ] Com apenas o primeiro resultado, esperando novos pedidos
- [ ] Com os três resultados unidos em um texto sem identificadores

> Cada resultado referencia seu `tool_use_id`, todos na mesma mensagem. Separar desestimula chamadas paralelas.

## agents-11
tipo: unica
skill: Agent Construction with Claude

Um time quer agent de longa duração sem hospedar loop nem sandbox, com sessões persistidas pelo provedor. Qual opção encaixa?

- [x] Managed Agents
- [ ] Loop manual na Messages API
- [ ] Tool Runner em um servidor próprio
- [ ] Agent SDK em contêiner próprio

> Em Managed Agents a Anthropic executa o loop e persiste as sessões; o sandbox pode ser na nuvem dela (o caso aqui) ou self-hosted. As demais são hospedadas por você.

## agents-12
tipo: multipla
skill: Agent Patterns and Frameworks

Seu agent às vezes entra em loop infinito. Quais controles o **harness** deve ter? (Escolha 2)

- [x] Limite de iterações ou orçamento por execução
- [x] Detecção de chamadas repetidas sem progresso
- [ ] Remoção de todos os erros devolvidos pelas tools
- [ ] Contexto vazio a cada nova iteração do loop

> Limites ficam no código. Esconder erros impede a recuperação e zerar o contexto elimina o progresso.

## agents-13
tipo: unica
skill: Agent Patterns and Frameworks

Um agent precisa retomar o trabalho amanhã, em uma sessão nova. O que funciona melhor?

- [x] Registrar estado e próximos passos em armazenamento persistente
- [ ] Reabrir com o mesmo modelo, que ainda lembrará da conversa anterior
- [ ] Aumentar o effort antes de encerrar a sessão
- [ ] Guardar o progresso no cache de prompt

> A API é stateless e o cache expira. Estado durável precisa de arquivo, banco ou memory tool.

## agents-14
tipo: unica
skill: Agent Architecture

Em uma estrutura supervisor/workers, qual briefing tende a funcionar melhor para um worker?

- [x] Objetivo, limites, contexto necessário e formato esperado do retorno
- [ ] O histórico completo do supervisor sem nenhuma instrução nova
- [ ] Uma frase curta, deixando o worker inferir todo o contexto
- [ ] A lista completa dos outros workers e todos os seus resultados parciais

> O worker não vê o contexto do pai. Precisa de um briefing autossuficiente, sem despejar tudo.

## agents-15
tipo: unica
skill: Agent Construction with Claude

Uma tool falha por timeout. O que o loop deve devolver ao modelo?

- [x] `tool_result` com `is_error: true` e uma mensagem útil
- [ ] Nada para esta chamada, seguindo para a próxima chamada pendente
- [ ] `tool_result` vazio como se tivesse dado certo
- [ ] Uma nova conversa sem a chamada que falhou

> Todo `tool_use` precisa de resultado. Um erro informativo permite tentar de novo ou mudar de plano.
