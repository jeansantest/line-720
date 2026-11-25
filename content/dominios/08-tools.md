id: tools
nome: Tools and MCPs
cor: #00838f

# Briefing
- A descrição da tool é prompt: diga o que faz, quando usar e quando não.
- Client tool: você executa. Server tool: a Anthropic executa.
- MCP padroniza integrações reutilizáveis; Skill ensina um procedimento.
- MCP expõe tools, resources e prompts; transportes: stdio e Streamable HTTP.
- Muitas tools: menos sobreposição e carregamento sob demanda.

# Questões

## tools-01
tipo: unica
skill: Tool Implementation

Qual descrição de tool é a melhor?

- [x] "Busca pedidos por ID. Use para status de entrega; não use para estoque."
- [ ] "Função de pedidos do sistema, versão final e revisada pelo time."
- [ ] "get_order: recebe dados e devolve dados do banco de produção."
- [ ] "Use sempre esta tool em qualquer pergunta feita pelo usuário."

> Diga o que faz, quando usar e os limites.

## tools-02
tipo: unica
skill: Tool Implementation

Quem executa uma **client tool** definida por você?

- [x] Sua aplicação, após receber o bloco `tool_use`
- [ ] A Anthropic, no momento da geração
- [ ] A API, em um sandbox criado para a requisição
- [ ] O servidor MCP, mesmo sem configuração

> O modelo só pede. Seu código executa e devolve `tool_result`. Server tools rodam na Anthropic.

## tools-03
tipo: unica
skill: Agentic Customization

Uma integração com o CRM deve servir a vários apps com Claude e ter manutenção independente. O que criar?

- [x] Um servidor MCP
- [ ] Um system prompt longo
- [ ] Uma Skill com os dados atuais
- [ ] Uma client tool copiada em cada app

> MCP expõe a capacidade uma vez para muitos clientes.

## tools-04
tipo: unica
skill: Agentic Customization

Claude já tem acesso às tools, mas precisa seguir o passo a passo de fechamento mensal da empresa. O que criar?

- [x] Uma Skill com o procedimento
- [ ] Um novo servidor MCP
- [ ] Uma tool com schema vazio
- [ ] Um transporte stdio

> Skill ensina *como* fazer; MCP e tools dão acesso ao que é feito.

## tools-05
tipo: unica
skill: MCP Server Development

Um servidor MCP local deve ser iniciado como subprocesso pelo cliente. Qual transporte usar?

- [x] stdio
- [ ] Streamable HTTP
- [ ] SMTP
- [ ] FTP

> stdio para processos locais; Streamable HTTP para servidores remotos.

## tools-06
tipo: multipla
skill: MCP Server Development

Quais são primitivas que um servidor MCP expõe? (Escolha 3)

- [x] Tools
- [x] Resources
- [x] Prompts
- [ ] Hooks
- [ ] Subagents

> Tools são ações, resources são dados, prompts são modelos reutilizáveis. Hooks e subagents são do harness.

## tools-07
tipo: unica
skill: MCP Server Development

Um servidor MCP via stdio quebra quando se adiciona `print("debug")`. Por quê?

- [x] O stdout carrega as mensagens do protocolo
- [ ] O MCP não permite nenhum tipo de log
- [ ] O cliente aceita apenas mensagens em XML
- [ ] O stdio exige uma conexão HTTPS ativa

> Em stdio, o stdout é o canal JSON-RPC. Envie logs ao stderr.

## tools-08
tipo: unica
skill: Tool Implementation

O modelo envia argumentos fora do schema da tool. Qual recurso garante a conformidade?

- [x] `strict: true` na definição da tool
- [ ] `stream: true` na requisição
- [ ] `tool_choice` fixo na requisição
- [ ] `cache_control` na tool

> Strict tool use restringe o input ao schema. Confira `stop_reason`: em `max_tokens` ou `refusal` o input pode vir incompleto e não deve ser executado. Valide ainda as regras de negócio.

## tools-09
tipo: unica
skill: Tool Implementation

Com 120 tools carregadas, o modelo erra a escolha e o contexto cresce. O que fazer?

- [x] Usar tool search e unificar tools sobrepostas
- [ ] Encurtar todas as descrições para uma só palavra
- [ ] Nomear as tools com números em sequência
- [ ] Duplicar as tools mais importantes

> Carregar definições sob demanda economiza contexto e melhora a seleção.

## tools-10
tipo: unica
skill: Tool Implementation

Uma tool de transferência bancária deve ser chamada pelo agent. Qual padrão aplicar?

- [x] Aprovação humana no harness antes de executar
- [ ] Execução direta, com aviso na descrição
- [ ] Execução direta e estorno posterior em caso de erro
- [ ] Aprovação decidida pelo mesmo modelo

> Ações irreversíveis pedem portão de aprovação fora do modelo.

## tools-11
tipo: unica
skill: Tool Implementation

Qual `tool_result` ajuda mais o modelo a se recuperar?

- [x] "Data inválida: use AAAA-MM-DD, por exemplo 2026-03-01"
- [ ] "Erro 500"
- [ ] "Exception na linha 381 de orders_service_impl.py, módulo interno"
- [ ] "Falhou, tente outra coisa"

> Erro acionável diz o que houve e como corrigir.

## tools-12
tipo: unica
skill: Agentic Customization

O app precisa de resultados atuais da web, sem manter infraestrutura de busca. Qual é a opção mais simples?

- [x] A server tool de web search
- [ ] Um servidor MCP próprio de busca
- [ ] Uma Skill com links salvos
- [ ] Um crawler exposto como client tool

> Se a tool pronta resolve, use-a antes de construir.

## tools-13
tipo: unica
skill: MCP Server Development

Um servidor MCP roda em um host central e atende centenas de clientes remotos. Qual transporte usar?

- [ ] stdio, iniciado em cada máquina cliente
- [x] Streamable HTTP, no servidor central
- [ ] Arquivos em uma pasta de rede comum
- [ ] Nenhum, pois MCP é só um protocolo local

> stdio serve a um processo local. Para um serviço remoto compartilhado, use Streamable HTTP.

## tools-14
tipo: unica
skill: Tool Implementation

Quando o estoque está fora do ar, a tool devolve `""` e o agent inventa quantidades. Qual retorno corrige isso?

- [ ] Um objeto JSON vazio, que é mais fácil de ler
- [ ] O último estoque conhecido, sem avisar o agent
- [ ] Nenhum: basta encerrar o agent a cada falha
- [x] Um erro com a causa e o que tentar em seguida

> Vazio parece "sem dados", não "falhou". Dado antigo sem aviso é pior que um erro honesto.

## tools-15
tipo: multipla
skill: Tool Implementation

Você vai expor uma API interna de 60 endpoints a um agent. Quais escolhas ajudam? (Escolha 2)

- [x] Poucas tools, cada uma com um papel claro
- [ ] Uma tool por endpoint, para dar flexibilidade
- [x] Retornos só com os campos que o agent usa
- [ ] Nomes neutros, como `op_1`, para evitar viés

> Toolset é uma interface curada: sem sobreposição, com nomes claros e retornos enxutos.

## tools-16
tipo: unica
skill: Tool Implementation

Um extrator precisa **sempre** retornar dados pela tool `save_invoice`, mas às vezes o modelo responde em texto. Em modelos que aceitam, qual ajuste força a chamada?

- [x] `tool_choice` do tipo `tool` com esse nome
- [ ] `tool_choice` do tipo `auto` com esse nome
- [ ] Uma descrição de tool escrita em maiúsculas
- [ ] `max_tokens` menor para evitar texto livre

> `tool` força uma tool específica; `any` força alguma. Vários modelos recentes rejeitam forçar com 400: neles use `auto` com `strict`, ou structured outputs se só quer o JSON.

## tools-17
tipo: unica
skill: Tool Implementation

O app deve responder **sem** chamar tools em um turno, mantendo as definições na requisição. Qual opção usar?

- [ ] `tool_choice: any`
- [ ] `stop_reason: none`
- [ ] `strict: false`
- [x] `tool_choice: none`

> `none` impede novas chamadas sem remover as definições.

## tools-18
tipo: unica
skill: Tool Implementation

A API retorna 400 após um `tool_use`. O próximo turno user trazia só o texto "ok, continue". O que faltou?

- [ ] Um bloco `thinking` escrito pela aplicação
- [ ] Uma segunda mensagem assistant vazia
- [x] O `tool_result` com o `tool_use_id` correspondente
- [ ] Uma nova definição da tool no system prompt

> Todo `tool_use` precisa do seu `tool_result` no turno user seguinte.

## tools-19
tipo: unica
skill: Tool Implementation

Uma tool tem parâmetro com estrutura aninhada incomum, e o modelo erra o formato. Além da descrição, o que ajuda?

- [ ] Um limite maior de tokens de saída
- [x] Exemplos de entrada válidos na definição
- [ ] Um nome de tool mais curto e genérico
- [ ] Um `tool_result` com mais campos

> `input_examples` mostra o uso correto; cada exemplo precisa obedecer ao schema.

## tools-20
tipo: unica
skill: Tool Implementation

Em um loop com thinking ativado, o que fazer com os blocos `thinking` ao devolver um `tool_result`?

- [x] Reenviá-los sem qualquer alteração
- [ ] Removê-los para economizar tokens
- [ ] Resumi-los em um bloco de texto
- [ ] Movê-los para o system prompt

> Os blocos do turno devem voltar exatamente como recebidos, inclusive a assinatura; alterá-los pode gerar erro 400.

## tools-21
tipo: unica
skill: Tool Implementation

Uma tool de busca devolve 8 MB de JSON. Qual desenho é melhor?

- [ ] Cortar o JSON em um ponto qualquer
- [ ] Devolver tudo e confiar no compact
- [ ] Dividir o JSON em oito `tool_result`
- [x] Paginação e filtros, com padrão enxuto

> Retorno enxuto e pedido sob demanda preserva contexto e continua válido.

## tools-22
tipo: unica
skill: Tool Implementation

O modelo chama `create_ticket` duas vezes por causa de um retry. Como evitar duplicatas?

- [ ] Nome de tool no singular
- [ ] Resposta final mais curta
- [x] Chave de idempotência na tool
- [ ] Descrição pedindo só uma chamada

> Efeitos colaterais devem ser seguros para repetir; isso se garante no código.

## tools-23
tipo: multipla
skill: Tool Implementation

Quais são boas **descrições** de parâmetro? (Escolha 2)

- [ ] "Usar corretamente"
- [x] "Moeda ISO 4217, por exemplo BRL"
- [x] "Período em dias, de 1 a 90"
- [ ] "Valor do campo"

> Formato, unidade, limites e exemplo tiram o modelo da adivinhação.

## tools-24
tipo: unica
skill: MCP Server Development

Um servidor MCP quer expor documentos que o **host** escolhe anexar ao contexto, sem ação. Qual primitiva usar?

- [x] Resource
- [ ] Tool
- [ ] Prompt
- [ ] Elicitation

> Resources são dados controlados pela aplicação; tools são ações escolhidas pelo modelo; prompts, modelos de mensagem escolhidos pelo usuário.

## tools-25
tipo: unica
skill: MCP Server Development

Uma tool MCP recebe um CEP inválido. Como o servidor deve sinalizar para o modelo se corrigir?

- [ ] Erro de protocolo JSON-RPC sem mensagem
- [ ] Encerramento da conexão com o cliente
- [ ] Resultado vazio, como se fosse sucesso
- [x] Resultado com `isError: true` e explicação

> Falhas de execução vão no resultado. Erros de protocolo são para coisas como tool desconhecida.

## tools-26
tipo: unica
skill: MCP Server Development

Um servidor MCP de terceiros anota sua tool como "somente leitura". Como o cliente deve tratar isso?

- [ ] Como permissão para rodar sem nenhum registro
- [ ] Como sinal de que a tool não acessa a rede
- [x] Como dica não confiável, sem dispensar controles
- [ ] Como garantia, dispensando a aprovação do usuário

> Anotações de servidores não confiáveis não são garantia de comportamento.

## tools-27
tipo: unica
skill: MCP Server Development

Um servidor MCP HTTP recebe um token válido, mas emitido para **outro** serviço. O que fazer?

- [ ] Aceitar só nas tools de leitura
- [x] Rejeitar, pois a audiência não é a dele
- [ ] Aceitar, pois a assinatura é válida
- [ ] Aceitar e repassar o token adiante

> O servidor deve validar a audiência; repassar tokens cria o *confused deputy*.

## tools-28
tipo: unica
skill: MCP Server Development

Durante uma tool, o servidor MCP precisa de um dado que só o **usuário** tem. Qual recurso do protocolo serve?

- [x] Elicitation
- [ ] Resource
- [ ] Prompt
- [ ] Transporte stdio

> Elicitation pede informação ao usuário por meio do cliente, que controla a interação.

## tools-29
tipo: unica
skill: Agentic Customization

Você quer que a Messages API use um servidor MCP direto, pelo **MCP connector**. Qual requisito o servidor tem de cumprir?

- [ ] Rodar via stdio no seu notebook
- [ ] Expor somente prompts e resources
- [ ] Estar no mesmo processo do app
- [x] Ser acessível por URL https

> O connector fala com servidores remotos e usa só tools. Servidor stdio local pede um cliente MCP seu.

## tools-30
tipo: unica
skill: Agentic Customization

Uma Skill com ótimo conteúdo quase nunca é acionada. O que revisar primeiro?

- [ ] A ordem dos títulos dentro do arquivo
- [ ] O nome da pasta onde o projeto está
- [x] A descrição: o que faz e quando usar
- [ ] O tamanho dos scripts que ela contém

> Só nome e descrição ficam visíveis antes; é por eles que o modelo decide carregar.
