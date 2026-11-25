dominio: agents

# Questões de simulado

## agents-501
tipo: unica
skill: Agent Architecture

Uma seguradora processa 8.000 sinistros por dia. Todos passam por extração, checagem de apólice e cálculo, sempre nessa ordem. Em 6% deles, a checagem exige investigar documentos variados, com passos imprevisíveis. A auditoria quer rastrear cada decisão. Qual arquitetura atende melhor?

- [ ] Workflow em código que fixa a ordem das três etapas, com um agent na checagem de todos os sinistros
- [x] Workflow em código para todos, acionando um agent limitado só nos casos que exigem investigação
- [ ] Agent único para todos os sinistros, com instruções detalhadas sobre a ordem correta das três etapas
- [ ] Workflow em código para todos, com um prompt maior na checagem para prever os casos mais difíceis

> O caminho fixo fica previsível e auditável, e a autonomia entra só onde os passos são imprevisíveis. Um prompt maior não cria passos novos; agent para todos, em tudo ou só na checagem, paga custo e variação onde 94% não precisam.

## agents-502
tipo: unica
skill: Agent Architecture

Um time avalia um sistema de pesquisa com cinco subagents em paralelo. Comparado ao agent único, ele acerta 4% mais e gasta nove vezes mais tokens. As pesquisas são diárias, e o relatório é lido por analistas que corrigem falhas em minutos. O que recomendar?

- [ ] Adotar os cinco subagents com um modelo menor em todos, sem precisar repetir a avaliação
- [ ] Manter o agent único e dobrar o limite de turnos, o que tende a equivaler a cinco subagents
- [x] Manter o agent único e investigar o que falta nos 4%, pois o ganho não paga o custo aqui
- [ ] Adotar os cinco subagents e reduzir o custo com prompt caching, que o time ainda não ativou

> Multi-agent se justifica quando o valor da tarefa cobre o custo; aqui o erro é barato de corrigir. Trocar o modelo sem reavaliar ou dobrar turnos supõe um efeito que ninguém mediu. Paralelizar reduz o tempo, mas não os tokens. O cache pode baixar a conta, mas o ganho segue pequeno para o uso.

## agents-503
tipo: unica
skill: Agent Architecture

Um gerador de propostas usa um segundo modelo como crítico, em até três rodadas. As notas sobem na primeira rodada e ficam estáveis depois, mas o texto vai ficando mais longo e cauteloso. Os clientes preferem a versão da primeira rodada. Qual ajuste é o mais adequado?

- [ ] Aumentar para seis rodadas, dando ao crítico mais chances de perceber que o texto ficou longo demais
- [ ] Remover o crítico e deixar um gerador maior escrever sozinho, o que evita o crescimento entre rodadas
- [ ] Manter as três rodadas e pedir ao gerador que ignore as críticas quando o texto passar de uma página
- [x] Parar quando o critério for atendido e rever a rubrica do crítico com exemplos preferidos pelos clientes

> O ciclo só ajuda com critério de parada e rubrica alinhados ao usuário. Mais rodadas ampliam o desvio; remover descarta o ganho real da primeira; ignorar críticas esconde a rubrica errada. O gerador maior não foi medido.

## agents-504
tipo: unica
skill: Agent Patterns and Frameworks

Um agent de migração trabalha por horas em 300 arquivos. A cada compaction ele esquece quais já migrou e refaz alguns. Os testes do repositório são confiáveis. O time quer retomar de qualquer ponto, inclusive após queda do processo. Qual desenho resolve?

- [x] Manter um registro em disco do estado de cada arquivo, atualizado só depois que os testes passam
- [ ] Aumentar o limite que dispara a compaction, para que o histórico completo dure mais tempo na sessão
- [ ] Pedir no system prompt que o agent liste, a cada resposta, todos os arquivos que já foram migrados
- [ ] Dividir os arquivos entre subagents e deixar o agent principal guardar no contexto a lista do que foi feito

> Estado externo e verificado sobrevive a compaction e a quedas. Adiar a compaction e listar no contexto não resistem à queda; subagents reduzem o contexto, mas não registram o progresso. Uma lista mantida no contexto se perde com ele.

## agents-505
tipo: unica
skill: Agent Patterns and Frameworks

Em um loop próprio, o modelo devolve dois `tool_use`: `get_rate` e `book_hotel`. A primeira funciona e a segunda lança exceção de timeout, sem que se saiba se a reserva foi feita. O que o harness deve devolver ao modelo?

- [ ] Dois `tool_result` no mesmo turno, o segundo como erro que pede ao modelo chamar a tool de novo
- [x] Dois `tool_result` no mesmo turno, o segundo como erro que informa o estado incerto e como consultá-lo
- [ ] Só o `tool_result` que funcionou, repetindo a reserva internamente até obter uma resposta definitiva
- [ ] Dois `tool_result` no mesmo turno, o segundo como sucesso, pois a reserva provavelmente foi concluída

> Cada `tool_use` precisa do seu resultado, e o modelo precisa saber que o estado é incerto para consultar antes de repetir. Repetir sem consultar, no harness ou a pedido dele, pode duplicar a reserva; supor sucesso inventa um fato; encerrar o loop descarta a tarifa.

## agents-506
tipo: unica
skill: Agent Patterns and Frameworks

Um agent de atendimento usa memória persistente. Um cliente disse "sou diabético" e, meses depois, "aquilo era do meu pai". O agent continua evitando doces para o cliente. Que mudança na memória ataca a causa?

- [ ] Guardar fatos com origem e data, sempre acrescentando os novos sem alterar os antigos
- [ ] Aumentar o número de fatos carregados por sessão, para que o modelo perceba sozinho a contradição
- [x] Guardar fatos com origem e data, e atualizar ou invalidar o registro quando surgir uma correção
- [ ] Guardar a transcrição completa das conversas e carregá-la inteira no início de cada nova sessão

> Memória precisa de proveniência e de atualização. A transcrição inteira custa caro e mantém a contradição; só acrescentar deixa os dois fatos valendo; carregar mais fatos só espera que o modelo adivinhe.

## agents-507
tipo: multipla
skill: Agent Patterns and Frameworks

Um supervisor delega a um worker a tarefa "pesquise o concorrente". O worker volta com 12 páginas sobre a história da empresa, mas o usuário queria comparar preços. O supervisor só tem o resultado final. Quais mudanças no briefing atacam a falha? (Escolha 2)

- [x] Definir o formato do retorno, com os campos esperados e os limites de escopo
- [ ] Enviar ao worker a transcrição completa da conversa entre usuário e supervisor
- [ ] Dividir a pesquisa entre três workers, cada um com um período da atividade do concorrente
- [ ] Autorizar o worker a responder direto ao usuário, sem passar pelo supervisor
- [x] Informar o objetivo final do usuário e o que o resultado vai permitir decidir

> Faltaram objetivo e contrato de retorno. A transcrição completa traz ruído e custo; liberdade maior e resposta direta agravam o desvio. Dividir por período multiplica a mesma pesquisa mal orientada.

## agents-508
tipo: unica
skill: Agent Construction with Claude

Uma fintech de oito pessoas quer um agent que rode por horas, retome sessões e execute código isolado. Não há equipe de infraestrutura, e os dados podem ser processados e mantidos na nuvem do provedor, e um serviço em beta é aceitável. O prazo é de três semanas. Qual opção começa melhor?

- [x] Managed Agents, com sessões persistidas e ambiente de execução oferecidos pela plataforma
- [ ] Claude Agent SDK em servidores próprios, para manter o controle total do ambiente desde o início
- [ ] Messages API com loop escrito pelo time, por ser a opção com menor número de dependências
- [ ] Claude Code em modo headless, agendado em um servidor, com o estado salvo em arquivos de log

> Prazo curto, sem infraestrutura e sem restrição de dados apontam para a opção gerenciada. As outras funcionam, mas deixam com o time hospedagem, isolamento e persistência.

## agents-509
tipo: unica
skill: Agent Construction with Claude

Um agent no Claude Agent SDK roda em produção sem usuário no terminal. Leituras são livres, escritas em `/relatorios` são livres, e qualquer outra escrita depende de regra de negócio que muda por cliente. Como implementar a última parte?

- [ ] Um hook `PreToolUse` que pergunta a um segundo modelo se a escrita é compatível com a regra do cliente
- [x] Um callback de permissão da aplicação, que consulta a regra do cliente e devolve permitir ou negar
- [ ] Uma lista fixa de tools permitidas, aprovando todas as escritas e revisando os logs no fim do dia
- [ ] Um trecho no system prompt com as regras de cada cliente, pedindo que o agent as siga com rigor

> A decisão é dinâmica e precisa ser imposta por código. A lista fixa não distingue clientes; o prompt é orientação; um segundo modelo só estima uma regra que a aplicação conhece; ignorar permissões remove o controle.

## agents-510
tipo: unica
skill: Agent Construction with Claude

Um agent noturno tem `max_turns` de 40. Em 3% das execuções ele atinge o limite, e o sistema grava o relatório vazio como "concluído". O time propõe subir o limite para 100. O que fazer primeiro?

- [ ] Remover o limite de turnos e manter só um orçamento em dólares, que encerra a execução mais cedo
- [ ] Pedir ao agent que escreva um relatório parcial sempre que perceber que está perto do turno 40
- [x] Tratar o resultado de limite como falha visível e analisar os traces desses 3% antes de mexer no valor
- [ ] Subir o limite para 100 e acompanhar se a parcela de relatórios vazios cai nas semanas seguintes

> O defeito imediato é tratar limite como sucesso, e a causa dos 3% é desconhecida. Subir ou remover limites pode só encarecer o mesmo loop; o agent não controla de forma confiável seu próprio teto.

## agents-511
tipo: unica
skill: Agent Construction with Claude

Um agent de código tem três necessidades: todo arquivo alterado deve passar pelo linter, commits nunca podem conter segredos, e o estilo dos comentários deve seguir o guia do time, com desvios ocasionais toleráveis. O time quer o menor mecanismo adequado a cada uma. Qual combinação usar?

- [ ] Instruções no `CLAUDE.md` para as três, com as duas primeiras marcadas como obrigatórias
- [ ] Hooks para as três, usando um modelo como juiz que bloqueia qualquer comentário fora do guia
- [ ] Hooks para os segredos, e instruções no `CLAUDE.md` para o linter e o estilo dos comentários
- [x] Hooks para linter e segredos, e instruções no `CLAUDE.md` para o estilo dos comentários

> O que é obrigatório e verificável vai em hook; estilo é julgamento e cabe em instrução. Bloquear por juiz é pesado para estilo; um revisor opcional não garante nada. Só `CLAUDE.md` não impõe as obrigatórias.

## agents-512
tipo: multipla
skill: Agent Construction with Claude

Um agent que abre chamados foi aprovado em testes com tools sempre disponíveis. Em produção, o sistema de chamados fica lento às segundas, e o agent abre duplicatas e afirma ter concluído. Quais ações tratam o problema de ponta a ponta? (Escolha 2)

- [x] Incluir nos evals casos com lentidão e falha parcial das tools, medindo o resultado real
- [ ] Elevar o effort do modelo às segundas, para que ele pense mais antes de repetir
- [ ] Orientar no system prompt que o agent nunca abra dois chamados sobre o mesmo tema
- [ ] Aumentar o número de tentativas automáticas do harness até que o sistema responda
- [x] Tornar a abertura de chamado idempotente, com uma chave gerada por solicitação

> Idempotência impede o efeito duplicado e os evals passam a cobrir a condição real. Effort e prompt não garantem; mais tentativas sem idempotência pioram.
