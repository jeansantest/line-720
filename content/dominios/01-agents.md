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

## agents-16
tipo: unica
skill: Agent Patterns and Frameworks

Um agent de viagens usa três workers: voos, hotéis e vistos. Cada um devolve sua parte. O que cabe ao **supervisor**?

- [ ] Refazer cada busca para confirmar o trabalho dos workers
- [ ] Treinar os workers com os erros de cada conversa
- [x] Dividir o pedido, delegar e juntar as partes
- [ ] Repassar ao usuário as três respostas, sem alterações

> O supervisor decompõe, encaminha e consolida; inclusive resolve conflitos entre as partes.

## agents-17
tipo: unica
skill: Agent Construction with Claude

Um agent noturno no **Claude Agent SDK** não pode passar de 30 turnos nem de US$ 2. Como impor isso e saber que o limite foi atingido?

- [x] Definir `max_turns` e `max_budget_usd` e ler o `subtype` do resultado
- [ ] Pedir no prompt que pare em 30 turnos e procurar "FIM" no texto
- [ ] Confiar no limite padrão de turnos que o SDK aplica a todo agent
- [ ] Reduzir `max_tokens` até o loop terminar por falta de saída

> Por padrão o SDK não limita turnos nem custo. Ao bater no limite, o resultado traz `error_max_turns` ou `error_max_budget_usd`. O custo é estimado e pode passar um pouco do teto. Em `query()` de disparo único, uma exceção vem depois desse resultado: trate-a.

## agents-18
tipo: unica
skill: Agent Construction with Claude

Ao escolher **Managed Agents** em vez de hospedar o próprio loop, de qual vantagem você abre mão?

- [ ] Da possibilidade de usar tools personalizadas
- [x] De parte do controle sobre o runtime e o ambiente
- [ ] Da execução de tarefas com mais de um turno
- [ ] Do uso de servidores MCP pelo agent

> A troca é controle por menos operação: o harness vem pronto e, no padrão em nuvem, o provedor também cuida do sandbox. Há opções auto-hospedadas.

## agents-19
tipo: unica
skill: Agent Patterns and Frameworks

Um tutor lembra o nível de cada aluno entre sessões. Hoje ele reenvia **todas** as conversas passadas e o custo explodiu. Qual desenho é melhor?

- [ ] Reenviar só as conversas em que o aluno tirou boas notas
- [ ] Aumentar `max_tokens` para caber mais histórico
- [ ] Deixar o modelo deduzir o nível a cada nova sessão
- [x] Guardar fatos em memória externa e carregar os relevantes

> Memória durável fica fora do modelo; no contexto entra só o que a sessão precisa.

## agents-20
tipo: multipla
skill: Agent Architecture

Três análises independentes do mesmo contrato (fiscal, trabalhista, privacidade) rodam em sequência. Quais afirmações sobre **paralelizar** são corretas? (Escolha 2)

- [x] A latência total se aproxima da análise mais lenta
- [ ] O custo em tokens cai para um terço do original
- [ ] As análises passam a ver as conclusões umas das outras
- [x] É preciso uma etapa que consolide os três resultados

> Paralelizar corta tempo, não tokens, e exige uma etapa de agregação. Só serve quando as partes não dependem entre si.

## agents-21
tipo: unica
skill: Agent Architecture

Um relatório passa sempre por: esboço, checagem automática, redação. Se a checagem reprova, o fluxo para. Qual padrão é esse?

- [ ] Agent autônomo com memória
- [ ] Votação entre modelos
- [ ] Routing por categoria
- [x] Prompt chaining com gate

> Etapas fixas encadeadas, com verificação em código entre elas.

## agents-22
tipo: unica
skill: Agent Architecture

Três chamadas iguais analisam o mesmo código, e um alerta é aceito se duas o apontarem. Qual padrão?

- [ ] Orchestrator-workers
- [ ] Prompt chaining
- [x] Votação (paralelização)
- [ ] Evaluator-optimizer

> Rodar a mesma tarefa várias vezes e agregar aumenta a confiança, a um custo maior.

## agents-23
tipo: unica
skill: Agent Architecture

Em que caso **orchestrator-workers** é melhor que paralelização fixa?

- [ ] A resposta precisa sair com a menor latência possível
- [x] As subtarefas só são conhecidas em tempo de execução
- [ ] As subtarefas são sempre as mesmas e independentes
- [ ] A tarefa cabe com folga em uma única chamada simples

> O orquestrador decide a divisão conforme a entrada. Se a divisão é fixa, código basta.

## agents-24
tipo: unica
skill: Agent Architecture

Um time quer um agent para converter CSV em JSON. Qual é a melhor recomendação?

- [x] Código comum, sem LLM
- [ ] Agent com tool de arquivos
- [ ] Workflow com três prompts
- [ ] Dois agents que se revisam

> Transformação determinística não pede modelo: código é mais barato e exato.

## agents-25
tipo: multipla
skill: Agent Architecture

Antes de dar autonomia a um agent, quais perguntas são decisivas? (Escolha 2)

- [x] Dá para verificar o resultado?
- [ ] O modelo é o mais recente?
- [ ] Há pelo menos cinco tools?
- [x] Qual é o custo de um erro?

> Autonomia compensa quando o erro é barato ou reversível e há como verificar.

## agents-26
tipo: unica
skill: Agent Architecture

Dois subagents editam o **mesmo** arquivo em paralelo e um apaga o trabalho do outro. Como prevenir?

- [ ] Aumentar o contexto disponível para ambos
- [ ] Trocar o modelo do segundo subagent
- [x] Dividir por arquivos ou isolar em worktrees
- [ ] Pedir que os dois trabalhem com cuidado

> Paralelize só o que não compartilha estado, ou isole e integre depois.

## agents-27
tipo: unica
skill: Agent Architecture

Um sistema multi-agent gasta muito mais tokens que um agent único. Quando isso se justifica?

- [ ] Tarefa em que todos precisam do mesmo contexto
- [x] Tarefa valiosa, ampla e divisível em partes
- [ ] Tarefa curta, com passos que dependem entre si
- [ ] Tarefa simples, repetida milhões de vezes ao dia

> Multi-agent brilha em exploração paralela de alto valor; dependências fortes o atrapalham.

## agents-28
tipo: unica
skill: Agent Architecture

O que diferencia **handoff** de **delegação** entre agents?

- [x] No handoff, o outro agent assume a conversa
- [ ] No handoff, o outro agent só devolve um resumo
- [ ] Na delegação, o histórico é sempre apagado
- [ ] Na delegação, o usuário troca de aplicativo

> Na delegação o agent principal mantém o controle e recebe o resultado.

## agents-29
tipo: unica
skill: Agent Patterns and Frameworks

Qual condição encerra normalmente o loop de um agent feito à mão com a Messages API?

- [ ] O texto da resposta conter a palavra "pronto"
- [ ] A resposta trazer menos de cem tokens de saída
- [ ] O modelo devolver dois blocos de texto seguidos
- [x] `stop_reason` igual a `end_turn`, sem tool pendente

> `tool_use` e `pause_turn` pedem outra volta. `max_tokens` e `refusal` também param o loop, mas não são término normal: trate cada um.

## agents-30
tipo: unica
skill: Agent Patterns and Frameworks

Um agent repete a mesma busca falha dez vezes. Além de limitar, o que ajuda o modelo a mudar de rumo?

- [ ] Um prompt que proíba qualquer nova busca
- [ ] Um número maior de tokens de saída por turno
- [x] Um resultado que explique a falha e as opções
- [ ] Um resultado vazio para ele perceber sozinho

> O resultado da tool é a principal evidência que ele tem do ambiente.

## agents-31
tipo: unica
skill: Agent Patterns and Frameworks

Em uma tarefa de 6 horas, o agent marca itens como feitos sem testar. Qual mudança ataca isso?

- [ ] Encurtar a lista para parecer mais realizável
- [x] Exigir verificação executável antes de concluir
- [ ] Aumentar o número de itens da lista de tarefas
- [ ] Pedir que o agent escreva com mais confiança

> Testes ou checagens que o harness executa valem mais que autoavaliação.

## agents-32
tipo: unica
skill: Agent Patterns and Frameworks

O que deve ir em um arquivo de progresso para que **outra sessão** continue o trabalho?

- [x] Decisões, estado atual e próximos passos
- [ ] A transcrição inteira de todas as mensagens
- [ ] Só a lista das ferramentas disponíveis
- [ ] O conteúdo completo dos arquivos lidos

> Boas notas de passagem são curtas e acionáveis; o resto pode ser relido sob demanda.

## agents-33
tipo: unica
skill: Agent Patterns and Frameworks

Um subagent devolve 30 mil tokens de log ao agent principal. Qual é o problema?

- [ ] Impede o uso de streaming no agent principal
- [ ] Faz o subagent perder as próprias tools
- [ ] Obriga o principal a trocar de modelo
- [x] Anula o isolamento de contexto que se buscava

> Peça conclusões com referências; o detalhe fica no contexto descartável.

## agents-34
tipo: multipla
skill: Agent Patterns and Frameworks

Quais informações um subagent com contexto novo **não** tem, a menos que você passe? (Escolha 2)

- [ ] As tools que foram liberadas para ele
- [ ] O próprio system prompt dele
- [x] As decisões tomadas na conversa principal
- [x] O formato em que você quer o resultado

> Contexto isolado é via de mão dupla: o briefing precisa ser completo.

## agents-35
tipo: unica
skill: Agent Patterns and Frameworks

Um agent faz 40 chamadas em sequência para somar valores de 40 arquivos. O que é mais eficiente?

- [ ] Elevar o limite de turnos para oitenta
- [x] Dar a ele execução de código para agregar
- [ ] Pedir que ele some de cabeça no final
- [ ] Dividir a soma entre quarenta subagents

> Código processa os dados fora do contexto e devolve só o total, com exatidão.

## agents-36
tipo: unica
skill: Agent Construction with Claude

Um protótipo precisa de **duas** tools próprias e um loop simples, em Python. O que evita escrever o loop à mão?

- [x] Tool Runner do SDK
- [ ] Message Batches API
- [ ] Um servidor MCP remoto
- [ ] Um plugin do Claude Code

> O Tool Runner executa suas funções e repete até o fim do turno.

## agents-37
tipo: unica
skill: Agent Construction with Claude

Em Managed Agents, qual é a diferença entre **agent** e **session**?

- [ ] Agent é uma execução; session é só o seu histórico
- [ ] Agent é o modelo; session é a chave de acesso
- [ ] Agent é o sandbox; session é o arquivo de saída
- [x] Agent é a configuração; session é uma execução dela

> A configuração é reutilizável e versionada; cada sessão roda a partir dela.

## agents-38
tipo: unica
skill: Agent Construction with Claude

Arquivos regulados e a execução de comandos devem ficar na sua rede; só trechos aprovados podem ir ao modelo. Qual desenho considerar?

- [ ] Enviar os dados só por streaming
- [ ] Usar um modelo menor na nuvem pública
- [x] Executar as tools na sua infraestrutura
- [ ] Aumentar o effort no sandbox hospedado

> Com as tools na sua infraestrutura, arquivos e execução ficam na rede. Mas o resultado devolvido ao modelo sai dela: filtre-o.

## agents-39
tipo: unica
skill: Agent Construction with Claude

No Claude Agent SDK, um app sem humano no terminal precisa decidir sobre ações **não** pré-aprovadas. O que usar?

- [ ] Um `max_tokens` menor em cada turno
- [x] Um callback de permissão da aplicação
- [ ] Um prompt pedindo bom senso ao agent
- [ ] Uma lista maior de exemplos few-shot

> O código da aplicação decide, com contexto e auditoria, em vez de aceitar tudo.

## agents-40
tipo: unica
skill: Agent Construction with Claude

Um agent de suporte precisa **escalar** para um humano. Como implementar de forma confiável?

- [x] Uma tool de escalonamento com critérios claros
- [ ] Uma frase combinada que o atendente procura
- [ ] Um limite de palavras por resposta do agent
- [ ] Uma nota de confiança que o modelo inventa

> Uma tool torna a escalada um evento estruturado que o sistema trata; reforce casos obrigatórios em código.

## agents-41
tipo: multipla
skill: Agent Construction with Claude

Quais itens pertencem ao **harness**, e não ao modelo? (Escolha 2)

- [x] Aplicar limites de custo
- [ ] Escolher a próxima palavra
- [ ] Interpretar o pedido do usuário
- [x] Executar as tools

> O modelo propõe; o harness executa, limita, registra e controla permissões.

## agents-42
tipo: unica
skill: Agent Construction with Claude

Um agent de longa duração deve sobreviver à queda do processo. O que o desenho precisa ter?

- [ ] Uma janela de contexto maior para o agent
- [ ] Um único turno longo com toda a tarefa
- [x] Estado salvo fora do processo e passos retomáveis
- [ ] Um prompt que peça para não parar de executar

> Persistência e idempotência permitem retomar sem repetir efeitos.

## agents-43
tipo: unica
skill: Agent Construction with Claude

Um agent precisa de credencial de produção para uma API. Onde ela **não** deve aparecer?

- [ ] No proxy que injeta o header
- [x] No contexto do modelo
- [ ] No secret manager
- [ ] No serviço que executa a tool

> A tool ou um proxy usa a credencial; o modelo não precisa vê-la.

## agents-44
tipo: unica
skill: Agent Construction with Claude

Ao testar um agent, por que simular tools com falhas e lentidão?

- [x] Para ver se ele se recupera ou age errado
- [ ] Para reduzir o preço por token do modelo
- [ ] Para treinar o modelo com os erros vistos
- [ ] Para aumentar a taxa de acerto do cache

> O caminho feliz não revela como o agent lida com erros, que são comuns em produção.

## agents-45
tipo: unica
skill: Agent Construction with Claude

Um agent recebe 15 documentos e deve citar a origem de cada afirmação. O que o harness deve preservar?

- [ ] Um resumo único dos quinze documentos
- [ ] Só o texto, sem metadados que gastem tokens
- [ ] A data em que cada documento foi lido
- [x] O identificador da fonte junto de cada trecho

> Sem a proveniência no contexto, não há como citar ou auditar.
