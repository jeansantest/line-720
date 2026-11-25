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
