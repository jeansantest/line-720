dominio: apps

# Questões de simulado

## apps-501
tipo: unica
skill: Claude API Mechanics

Um editor jurídico faz streaming de cláusulas para a tela e, ao final, grava o texto no contrato. Usuários relataram contratos com cláusulas cortadas no meio. Os logs mostram HTTP 200 em todas. Qual verificação faltou antes de gravar?

- [ ] Confirmar que a contagem de tokens de saída ficou próxima da média das outras cláusulas
- [x] Confirmar que o stream terminou e que o `stop_reason` indica um fim normal da resposta
- [ ] Confirmar que o status HTTP foi 200 e que o tempo total ficou abaixo do limite do cliente
- [ ] Confirmar que a conexão do stream fechou sem erro de rede e que algum texto foi recebido

> O 200 chega antes do conteúdo. Só o fim do stream e o `stop_reason` distinguem resposta completa de corte por `max_tokens` ou queda; as outras são pistas, não prova. Fechar sem erro não descarta corte pelo limite de tokens.

## apps-502
tipo: unica
skill: Claude API Mechanics

Uma varejista reclassifica 900 mil produtos todo fim de semana: os dados ficam prontos no sábado ao meio-dia e o resultado é para segunda às 8h. O job usa chamadas síncronas, disputa limite com o chat dos clientes e às vezes o derruba. Qual mudança resolve melhor?

- [ ] Aumentar a concorrência do job, para que ele termine antes de o movimento do chat crescer
- [ ] Juntar cem produtos em cada chamada síncrona, reduzindo a contagem de requisições por minuto
- [x] Enviar em vários lotes pela Message Batches API, casando os resultados por `custom_id`
- [ ] Manter chamadas síncronas, mas com streaming, para liberar mais cedo a capacidade usada pelo chat

> Há prazo folgado, volume alto e ninguém esperando: é o perfil de Batches. Streaming não libera capacidade; mais concorrência piora a disputa; juntar produtos mexe na qualidade e ainda compete por tokens.

## apps-503
tipo: unica
skill: Claude API Mechanics

Um serviço usa o SDK oficial com a configuração padrão e, por fora, um decorator que repete cinco vezes qualquer exceção. Em um pico de 429, o volume de tentativas explodiu e a fila travou. Qual é a melhor correção?

- [ ] Desligar os retries do SDK e manter o decorator como está, com cinco tentativas por exceção
- [ ] Aumentar o timeout do SDK, para que cada tentativa tenha mais tempo até receber a resposta
- [ ] Trocar o decorator por um laço que espera sempre um segundo antes de cada nova tentativa
- [x] Deixar o retry em uma só camada, com backoff, teto de tentativas e só para erros transitórios

> Camadas multiplicam tentativas. Manter o decorator repetiria 400 e 401; timeout não reduz chamadas; espera fixa sincroniza clientes e ignora o `retry-after`.

## apps-504
tipo: multipla
skill: Claude API Mechanics

Um portal recebe contratos em PDF, alguns digitalizados e com tabelas. Vinte perguntas são feitas sobre o mesmo arquivo em uma hora, e o time reenvia o base64 a cada uma. Quer menos tráfego e menos custo de entrada. O que combinar? (Escolha 2)

- [ ] Extrair o texto com OCR próprio, pois a API não interpreta páginas digitalizadas
- [ ] Colocar a pergunta antes do documento, para que o modelo leia só o trecho útil
- [ ] Pedir respostas mais curtas, o que reduz os tokens cobrados pela leitura do PDF
- [x] Enviar o PDF pela Files API e referenciar o `file_id` em um bloco `document`
- [x] Usar prompt caching no prefixo que contém o documento, antes da pergunta

> A Files API evita reenviar bytes, mas não reduz os tokens de entrada: isso é papel do cache. A pergunta variável antes do documento quebraria o prefixo. O suporte a PDF já lê páginas digitalizadas; o tamanho da resposta não muda os tokens de entrada.

## apps-505
tipo: unica
skill: Claude API Mechanics

Um formulário médico usa structured outputs. Em produção, 0,4% das respostas quebram o parser. A investigação mostra dois grupos: respostas cortadas e respostas com recusa. Qual tratamento é o mais correto?

- [ ] Aumentar `max_tokens` e repetir a chamada nos dois casos, até o limite de três tentativas
- [x] Checar o `stop_reason` antes do parse e dar um caminho próprio a cada um dos dois casos
- [ ] Trocar por um prompt que peça JSON, já que structured outputs não cumpriu o que prometia
- [ ] Envolver o parse em um bloco de exceção e gravar um formulário vazio quando ele falhar

> Corte e recusa são exceções conhecidas e têm respostas diferentes: aumentar o limite ou encaminhar. Formulário vazio perde dado em silêncio; aumentar o limite não resolve recusa; JSON por prompt perde o schema e ainda pode ser cortado ou recusado.

## apps-506
tipo: unica
skill: Claude Application Design

Um assistente de RH responde sobre políticas internas. O protótipo no claude.ai agradou, mas a versão via API ignora o tom formal e às vezes fala de outras empresas. O time pensa em trocar de modelo. Qual passo vem antes?

- [ ] Fazer fine-tuning com as conversas do protótipo, para recuperar o comportamento que agradou
- [ ] Acrescentar exemplos do tom formal na mensagem do usuário, mantendo o modelo e o resto como estão
- [x] Escrever no `system` o papel, o tom e os limites, que no protótipo vinham do produto e do chat
- [ ] Migrar para o maior modelo disponível, porque a API costuma usar versões mais simples por padrão

> A API começa sem as instruções do produto: recrie-as no `system`. Não há versão inferior por padrão; fine-tuning é prematuro. Exemplos ajudam no tom, mas deixam papel e limites indefinidos.

## apps-507
tipo: unica
skill: Claude Application Design

Um app de viagem monta um roteiro com cinco chamadas em sequência e leva 25 segundos. Clima e câmbio não dependem de nada; hotéis dependem do clima; texto final depende de tudo. O produto quer sensação de rapidez sem perder qualidade. O que fazer?

- [ ] Trocar todas as chamadas por um modelo menor e mais rápido, revisando a qualidade depois do lançamento
- [ ] Juntar as cinco etapas em um único prompt, para que o modelo resolva as dependências por conta própria
- [ ] Rodar clima e câmbio em paralelo e mostrar o roteiro quando o texto inteiro estiver completo
- [x] Rodar em paralelo o que é independente e transmitir em streaming o texto final à medida que sai

> Paralelizar só o independente corta o caminho crítico e o streaming reduz a espera percebida. Modelo menor sem medir e prompt único arriscam qualidade; esperar o texto completo mantém a espera percebida.

## apps-508
tipo: unica
skill: Claude Application Design

Um help desk mantém uma conversa por cliente há meses. Cada chamado novo herda chamados antigos, e o modelo mistura produtos. Às vezes, porém, o histórico é necessário para entender reincidência. Qual desenho equilibra os dois?

- [x] Uma sessão por chamado, com resumo do cliente e busca de chamados anteriores sob demanda
- [ ] Uma conversa única com janela maior, já que o histórico completo às vezes se mostra necessário
- [ ] Uma sessão por chamado, carregando no início o texto completo de todos os anteriores
- [ ] Uma conversa única com a instrução de ignorar o que não for do produto citado no chamado

> Sessão limpa evita contaminação e a busca traz a reincidência quando importa. Janela maior aumenta o ruído; carregar tudo repete a mistura; mandar ignorar não remove o conteúdo.

## apps-509
tipo: multipla
skill: Understanding Requirements

Um banco pede um assistente que "explique tarifas com clareza". Na oficina surgem: responder em até 4 segundos; ligar cada resposta à tabela oficial de tarifas; filtrar tarifas por tipo de conta; reduzir em 30% as ligações; não expor dados de outro correntista. Quais são requisitos não funcionais? (Escolha 2)

- [ ] Ligar cada resposta à tabela oficial de tarifas
- [x] Responder em até 4 segundos
- [x] Não expor dados de outro correntista
- [ ] Reduzir em 30% as ligações
- [ ] Filtrar tarifas por tipo de conta

> Tempo de resposta e isolamento são qualidades do sistema. Reduzir ligações é objetivo de negócio; ligar e filtrar são funções do sistema.

## apps-510
tipo: unica
skill: Understanding Requirements

Um diretor quer lançar em um mês um assistente que aprova reembolsos sozinho. O time não sabe quanto custa uma aprovação indevida nem tem casos históricos rotulados. Qual próximo passo é o mais útil?

- [ ] Escolher o modelo com melhor desempenho público em finanças e usar os benchmarks como critério
- [ ] Fixar com o diretor a meta de 95% de acerto e reunir casos de teste depois que a interface ficar pronta
- [x] Levantar o custo dos erros e rotular casos reais para definir critérios de aceite e o grau de autonomia
- [ ] Construir o protótipo completo no prazo, para descobrir em produção quais erros de fato aparecem

> Sem custo do erro e sem casos, não há critério para autonomia. Meta fixada antes de conhecer o custo é arbitrária; descobrir em produção transfere o risco ao cliente; benchmark público não representa o caso; recusar ignora desenhos com aprovação humana.

## apps-511
tipo: unica
skill: Configuration Management

Produção, homologação e desenvolvimento usam prompts copiados à mão e o mesmo alias de modelo que muda sozinho. Após uma queda de qualidade, ninguém sabe se a causa foi prompt ou modelo. Qual prática teria isolado a causa?

- [ ] Restringir a edição de prompts a uma pessoa, que registra as mudanças em uma planilha do time
- [ ] Usar o mesmo alias em todos os ambientes, para que a mudança de modelo apareça em todos juntos
- [ ] Salvar cópias diárias das respostas de produção, para comparar o texto antes e depois da queda
- [x] Versionar o prompt com um ID fixo de modelo e promover o mesmo par testado entre os ambientes

> Uma combinação explícita e promovida permite comparar e reverter. Planilha não amarra o que rodou; alias comum muda tudo ao mesmo tempo; cópias mostram o efeito, não a causa. Um responsável único não versiona o modelo.

## apps-512
tipo: unica
skill: Systems Life Cycle

Um resumidor de prontuários está estável há um ano. O provedor anuncia a aposentadoria do modelo em 90 dias. O substituto é mais barato e vai melhor em benchmarks. O time tem 200 casos rotulados. Qual plano é o mais adequado?

- [x] Rodar os 200 casos no substituto, ajustar o prompt se preciso e migrar aos poucos com rollback
- [ ] Trocar o ID agora em produção, já que o substituto é superior nos benchmarks e custa menos
- [ ] Rodar benchmarks públicos da área médica e migrar todo o tráfego 30 dias antes do prazo
- [ ] Migrar todo o tráfego de uma vez e rodar os 200 casos depois, com as respostas reais já geradas

> O eval próprio é o portão e a migração gradual limita o dano. Benchmark não mede a sua tarefa; esperar elimina a folga; avaliar depois transforma pacientes em teste.

## apps-513
tipo: unica
skill: Software Engineering Foundations

Um worker lê pedidos de uma fila, chama o Claude e envia um e-mail ao cliente por um serviço que aceita chaves de idempotência. Após uma queda entre o envio do e-mail e a confirmação na fila, alguns clientes receberam dois e-mails. Qual mudança resolve a causa?

- [ ] Registrar o envio em uma tabela depois de cada e-mail e consultá-la antes de enviar de novo
- [x] Enviar com o ID do pedido como chave de idempotência, para que um reenvio não tenha efeito
- [ ] Confirmar a mensagem na fila antes de chamar o Claude, para que ela nunca seja reprocessada
- [ ] Aumentar o prazo de visibilidade da fila, dando ao worker mais tempo até concluir cada pedido

> Entrega ao menos uma vez pede efeito idempotente. Confirmar antes perde pedidos na queda; mais prazo não cobre a queda; a tabela gravada depois do envio ainda falha se a queda vier entre os dois.

## apps-514
tipo: unica
skill: Software Engineering Foundations

O Claude vai reescrever um módulo de cobrança com poucos testes e muitas exceções históricas. O time tem duas semanas e dados reais anonimizados de um ano. Qual sequência reduz mais o risco?

- [ ] Criar testes a partir da especificação, reescrever de uma vez e comparar com dados reais no fim
- [ ] Reescrever em uma branch longa e, no fim, testar manualmente os cenários mais comuns de cobrança
- [x] Criar testes a partir dos dados reais, mudar em passos pequenos e comparar as saídas a cada passo
- [ ] Pedir a reescrita completa, gerar testes sobre o código novo e publicar quando todos passarem

> Fixar o comportamento atual e avançar em passos verificáveis revela regressões. Testes feitos sobre o código novo validam o próprio erro; especificação e teste manual não cobrem as exceções, e comparar só no fim dificulta achar a causa.
