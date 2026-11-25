dominio: tools

# Questões de simulado

## tools-501
tipo: unica
skill: Tool Implementation

Um agent tem `search_customers` e `find_client`, criadas por times diferentes sobre a mesma base. Ele alterna entre as duas, e os resultados têm campos distintos. As duas têm usuários em outros sistemas. O que fazer no agent?

- [ ] Expor só a mais antiga e, quando ela falhar, orientar o usuário a procurar o outro time
- [x] Expor uma só tool, com nome e descrição claros, que unifica as duas por trás da interface
- [ ] Expor as duas com descrições mais longas, deixando o modelo escolher conforme a pergunta
- [ ] Expor as duas e acrescentar uma terceira tool, que decide qual delas deve ser chamada

> Tools sobrepostas geram escolha sem critério; unificar na interface do agent não afeta os outros sistemas. Descrições não eliminam a redundância, e uma tool roteadora só acrescenta um passo. Manter só a mais antiga perde os dados da outra.

## tools-502
tipo: unica
skill: Tool Implementation

Uma tool de voos devolve 400 opções com 60 campos. O agent escolhe bem, mas o contexto enche em poucas buscas, e o usuário costuma pedir detalhes só da opção escolhida. Qual desenho atende melhor?

- [ ] Devolver um resumo em prosa das 400 opções, escrito por outro modelo a cada busca realizada
- [ ] Devolver todas as opções, mas só com os dez campos que mais pesam na decisão
- [x] Devolver poucas opções com os campos de decisão e um ID, e oferecer outra tool de detalhes
- [ ] Devolver tudo e limpar o resultado do contexto logo depois que o agent responder ao usuário

> Resultado enxuto com ID permite aprofundar sob demanda. Limpar depois ainda paga o volume; prosa perde dados exatos; 400 opções ainda enchem o contexto.

## tools-503
tipo: unica
skill: Tool Implementation

Um extrator usa uma tool com schema só para obter JSON, forçando-a com `tool_choice`. Ao migrar para um modelo mais recente, a chamada retorna 400. A saída estruturada é tudo o que o app precisa. Qual mudança é a mais direta?

- [ ] Voltar ao modelo anterior e fixá-lo, até que o novo volte a aceitar a escolha forçada
- [ ] Manter a tool em `auto` e descrever, em maiúsculas, que ela precisa ser chamada sempre
- [ ] Remover o schema e pedir o JSON no prompt, com um parser tolerante do lado da aplicação
- [x] Usar structured outputs em `output_config.format`, já que não há ação nenhuma a executar

> Alguns modelos recentes rejeitam forçar tools; para só obter JSON, o recurso próprio é structured outputs. Fixar o antigo adia o problema; `auto` com ênfase e parser tolerante não garantem.

## tools-504
tipo: unica
skill: MCP Server Development

Uma equipe publica um servidor MCP remoto com dados de clientes, usado por três apps. Hoje ele aceita qualquer token assinado pelo provedor de identidade da empresa, inclusive os emitidos para outros serviços. Qual correção é prioritária?

- [x] Validar que o token foi emitido para esse servidor, além de conferir a assinatura e os escopos
- [ ] Trocar o transporte por stdio, que dispensa tokens e elimina o risco de uso indevido deles
- [ ] Registrar em log todos os tokens recebidos, para investigar depois quais serviços os usaram
- [ ] Conferir os escopos em cada tool, mantendo a assinatura válida como prova de origem do token

> Sem checar a audiência, um token de outro serviço abre os dados. stdio não serve a apps remotos; registrar tokens expõe segredos; escopo e assinatura não dizem para qual serviço o token foi emitido.

## tools-505
tipo: unica
skill: MCP Server Development

Um servidor MCP de chamados oferece a tool `close_ticket`. Se o chamado já está fechado, o servidor lança um erro de protocolo, e o agent encerra a tarefa sem explicação. O esperado é que ele siga com os outros chamados. Qual ajuste fazer?

- [ ] Devolver sucesso sem mensagem, já que o estado final do chamado é o mesmo que se pedia
- [x] Devolver um resultado com `isError: true` e a situação do chamado, para o modelo se adaptar
- [ ] Devolver um resultado com `isError: true` e um texto genérico de que a operação falhou
- [ ] Manter o erro de protocolo e aumentar o número de tentativas do cliente para essa tool

> Falha de negócio vai no resultado, visível ao modelo. Um texto genérico não diz ao modelo o que fazer; repetir não muda o estado; sucesso mudo esconde que nada foi feito agora.

## tools-506
tipo: multipla
skill: Agentic Customization

Um escritório quer que o Claude siga seu padrão de petições, com modelos e checklist, e também consulte processos em um sistema interno. Há quatro apps que usam Claude. Quais peças usar? (Escolha 2)

- [ ] Uma Skill que traga a senha do sistema interno e as instruções de consulta
- [ ] Um system prompt com o padrão completo e uma cópia diária dos processos
- [x] Uma Skill com o padrão, os modelos e o checklist, carregada quando for relevante
- [x] Um servidor MCP que exponha a consulta de processos para os quatro apps
- [ ] Um servidor MCP cujas tools devolvem o texto do padrão a cada petição redigida

> Procedimento pede Skill; acesso a sistema pede MCP. Servir procedimento por tool é desvio; senha em Skill expõe segredo; cópia diária fica velha e enche o contexto.

## tools-507
tipo: unica
skill: Agentic Customization

Um app precisa de notícias atuais citando a fonte. O time planeja um servidor MCP próprio com um buscador pago, em dois meses. Não há exigência de fontes exclusivas, e a entrega é em duas semanas. O que recomendar?

- [ ] Começar o servidor MCP com escopo reduzido, entregando uma fonte em duas semanas e o resto depois
- [ ] Usar uma Skill com uma lista de sites confiáveis, atualizada pelo time no início de cada semana
- [ ] Dispensar a busca e usar o modelo mais recente, cujo conhecimento cobre as notícias do período
- [x] Começar pela server tool de busca na web e criar algo próprio só se um requisito não for atendido

> A tool pronta cobre o requisito no prazo. MCP próprio é custo sem necessidade demonstrada; a Skill não busca nada; conhecimento de treino não cobre notícias atuais. Escopo menor ainda constrói o que não é preciso.
