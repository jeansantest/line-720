id: code
nome: Claude Code
cor: #7a4fa3

# Briefing
- `CLAUDE.md` = contexto persistente; `settings.json` = configuração aplicada pelo harness.
- Skill: procedimento carregado sob demanda. Subagent: contexto separado. Hook: ação determinística. Plugin: pacote distribuível.
- `claude -p` roda sem interface, útil em CI.
- `/clear` zera a conversa; `/compact` a resume.

# Questões

## code-01
tipo: unica
skill: Claude Code Operation

Onde colocar comandos de build e convenções que todo o time e o Claude Code devem conhecer?

- [x] No `CLAUDE.md` do projeto, versionado no git
- [ ] No `~/.claude/CLAUDE.md` de um desenvolvedor
- [ ] Em um hook que bloqueia toda edição
- [ ] No histórico de uma sessão compartilhada

> O arquivo do projeto é compartilhado. O do diretório do usuário vale só para ele.

## code-02
tipo: unica
skill: Claude Code Operation

Qual mecanismo é aplicado pelo harness, e não pelo modelo, para bloquear comandos como `rm -rf` no Claude Code?

- [x] Regra de permissão deny ou hook `PreToolUse`
- [ ] Instrução enfática e detalhada no `CLAUDE.md`
- [ ] Pedido no início de cada sessão
- [ ] Skill de boas práticas no shell

> Permissões e hooks são aplicados pelo harness; instruções só orientam o modelo. Uma regra deny para `rm` não cobre variantes como `bash -c`: para garantia forte, use sandbox. O hook bloqueia com exit 2 ou decisão deny; exit 1 não bloqueia.

## code-03
tipo: unica
skill: Claude Code Operation

O time quer rodar o Claude Code em um job de CI, sem interação. O que usar?

- [x] `claude -p` com formato de saída estruturado
- [ ] `/compact` antes de cada commit
- [ ] `/clear` em um loop no terminal
- [ ] Uma sessão interativa mantida aberta no runner

> `-p` é o modo headless. `--output-format json` ou `stream-json` facilita a integração.

## code-04
tipo: unica
skill: Claude Code Operation

Um procedimento de release de 200 linhas só é necessário às vezes. Onde ele deve ficar?

- [x] Em uma Skill, carregada quando for relevante
- [ ] No `CLAUDE.md` raiz, carregado em toda sessão
- [ ] Em um hook de início de sessão
- [ ] Em um comentário no topo do código

> Skills usam progressive disclosure: descrição sempre visível, corpo só quando preciso.

## code-05
tipo: unica
skill: Claude Code Operation

Você terminou uma tarefa e vai começar outra, sem relação, na mesma sessão. Qual comando usar?

- [x] `/clear`
- [ ] `/compact`
- [ ] `/init`
- [ ] `/resume`

> `/clear` começa com contexto limpo. `/compact` é para continuar o mesmo trabalho com histórico resumido.

## code-06
tipo: unica
skill: Claude Code Operation

O que `/init` faz em um repositório?

- [x] Analisa o código e gera um `CLAUDE.md` inicial
- [ ] Cria um repositório git com a branch principal
- [ ] Instala todos os plugins recomendados
- [ ] Apaga as sessões antigas do projeto

> É o ponto de partida. Revise e mantenha enxuto.

## code-07
tipo: unica
skill: Claude Code Operation

Como distribuir juntos skills, commands, agents, hooks e servidores MCP entre vários repositórios?

- [x] Empacotar tudo em um plugin
- [ ] Copiar tudo em um único `CLAUDE.md`
- [ ] Salvar uma sessão e compartilhá-la
- [ ] Criar um subagent para cada repositório

> Plugins agrupam extensões em uma unidade versionada e instalável.

## code-08
tipo: unica
skill: Claude Code Operation

Um desenvolvedor quer uma preferência só sua neste projeto, fora do git. Qual arquivo usar?

- [x] `.claude/settings.local.json`
- [ ] `.claude/settings.json`
- [ ] `~/.claude/settings.json`
- [ ] `.mcp.json`

> `settings.local.json` é pessoal do projeto; `settings.json` é compartilhado; o do home vale em todos os projetos.

## code-09
tipo: multipla
skill: Claude Code Operation

Quais situações pedem um **subagent** no Claude Code? (Escolha 2)

- [x] Explorar muitos arquivos sem poluir a conversa principal
- [x] Revisar com tools restritas e instruções próprias
- [ ] Formatar sempre o arquivo após cada edição
- [ ] Guardar a credencial do banco de dados

> Subagents isolam contexto e permissões. Formatar sempre é tarefa de hook; segredos não vão em agents.

## code-10
tipo: unica
skill: Claude Code Operation

O `CLAUDE.md` chegou a 900 linhas e regras vêm sendo ignoradas. Qual é a melhor ação?

- [x] Enxugar e mover detalhes para rules com escopo e Skills
- [ ] Duplicar as regras mais importantes no fim
- [ ] Dividir em imports com `@`, todos carregados no início
- [ ] Copiar o arquivo para cada subdiretório

> Contexto permanente compete por atenção. Mantenha só o que vale quase sempre.

## code-11
tipo: unica
skill: Claude Code Operation

Um hook `PreToolUse` deve **barrar** um comando. Com qual código de saída ele bloqueia e devolve o motivo a Claude?

- [ ] Qualquer código diferente de zero
- [x] Código 2, com o motivo no stderr
- [ ] Código 1, com o motivo no stdout
- [ ] Código 0, com o motivo no stderr

> Em eventos bloqueáveis, o código 2 impede a ação e mostra o stderr. O código 1, por padrão, é erro não bloqueante: a ação segue.

## code-12
tipo: unica
skill: Claude Code Operation

Um time pôs em `PostToolUse` um hook que "impede" editar `prod.yml`, mas o arquivo continua mudando. Por quê?

- [x] O evento ocorre depois que a tool já rodou
- [ ] O hook precisa ser escrito em JavaScript
- [ ] Hooks não enxergam o nome dos arquivos
- [ ] O evento só dispara para comandos de shell

> `PostToolUse` serve para reagir (formatar, testar). Para impedir, use `PreToolUse` ou uma regra deny.

## code-13
tipo: unica
skill: Claude Code Operation

As permissões têm `allow: Bash(git push *)` e `deny: Bash(git *)`. O que acontece com `git push origin main`?

- [ ] É permitido, pois a regra é mais específica
- [ ] Pede confirmação, pois as regras conflitam
- [ ] É permitido, pois allow foi listado antes
- [x] É negado, pois deny é avaliado primeiro

> A ordem é deny, ask, allow. A especificidade não muda isso.

## code-14
tipo: unica
skill: Claude Code Operation

A empresa precisa de uma política do Claude Code que nenhum desenvolvedor possa sobrepor. Onde defini-la?

- [ ] Em `~/.claude/settings.json`
- [ ] No `CLAUDE.md` da raiz
- [x] Em managed settings
- [ ] Em `.claude/settings.json`

> Managed settings têm a maior precedência. `CLAUDE.md` é contexto, não imposição.

## code-15
tipo: unica
skill: Claude Code Operation

Regras de SQL só importam ao editar `db/**`. Como evitar que ocupem contexto nas outras tarefas?

- [ ] Colocá-las no topo do `CLAUDE.md` de cada usuário
- [x] Regra em `.claude/rules` com `paths` no frontmatter
- [ ] Um `@import` dessas regras no `CLAUDE.md` da raiz
- [ ] Repeti-las na descrição de cada commit do time

> Regras com `paths` carregam quando arquivos correspondentes entram em cena. `@import` organiza, mas não economiza contexto.

## code-16
tipo: unica
skill: Claude Code Operation

Após `/compact`, Claude Code esqueceu uma convenção. Qual é a causa mais provável?

- [x] Ela foi dita só na conversa, não no `CLAUDE.md`
- [ ] O `CLAUDE.md` da raiz é apagado ao compactar
- [ ] O `/compact` desativa as regras de permissão
- [ ] O comando troca o modelo usado na sessão

> O `CLAUDE.md` da raiz é relido após compactar; instruções só de conversa podem se perder no resumo.

## code-17
tipo: unica
skill: Claude Code Operation

Antes de uma mudança arriscada, você quer que Claude explore o código e proponha um caminho **sem editar**. O que usar?

- [ ] Modo acceptEdits
- [ ] `claude --continue`
- [ ] Um hook `Stop`
- [x] Plan mode

> Em plan mode Claude lê e investiga, e apresenta um plano para aprovação.

## code-18
tipo: unica
skill: Claude Code Operation

Um script precisa ler a resposta de `claude -p` como um único objeto com metadados da sessão. Qual opção usar?

- [ ] `--output-format stream-json`
- [ ] `--allowedTools json`
- [x] `--output-format json`
- [ ] `--output-format text`

> `json` devolve um objeto; `stream-json` emite eventos conforme ocorrem.

## code-19
tipo: unica
skill: Claude Code Operation

Um time usa `--allowedTools "Read"` achando que isso **proíbe** todo o resto. Qual é o efeito real?

- [ ] Vale só para sessões interativas no terminal
- [x] Pré-aprova Read; o resto segue as permissões
- [ ] Remove do modelo todas as outras ferramentas
- [ ] Bloqueia qualquer leitura fora do projeto atual

> A opção é uma lista de aprovação automática. Para proibir, use deny ou remova a tool.

## code-20
tipo: unica
skill: Claude Code Operation

Todo o time deve usar o mesmo servidor MCP neste repositório. Onde configurá-lo?

- [x] No `.mcp.json` da raiz, versionado
- [ ] No `~/.claude.json` de cada pessoa
- [ ] Em uma Skill com a URL do servidor
- [ ] No `CLAUDE.md`, como instrução

> O escopo project fica em `.mcp.json` e vai no git. Local e user são pessoais.

## code-21
tipo: unica
skill: Claude Code Operation

O `.mcp.json` precisa de um token diferente por pessoa, sem ir para o git. Qual é a forma adequada?

- [ ] Gravar o token e pôr o arquivo no README
- [ ] Codificar o token em base64 no arquivo
- [ ] Pedir que Claude solicite o token no chat
- [x] Referenciar uma variável como `${CRM_TOKEN}`

> Variáveis de ambiente são expandidas na configuração; o segredo fica fora do repositório.

## code-22
tipo: unica
skill: Claude Code Operation

Uma Skill de deploy **nunca** deve ser acionada por iniciativa do modelo, só por `/deploy`. O que configurar?

- [ ] Uma descrição vazia no arquivo
- [ ] Mover a Skill para o `CLAUDE.md`
- [x] `disable-model-invocation: true`
- [ ] `allowed-tools: none`

> O campo impede a invocação automática e mantém o comando manual.

## code-23
tipo: unica
skill: Claude Code Operation

Um subagent revisor não deve alterar arquivos. Qual configuração garante isso melhor?

- [ ] Escolher um modelo menor para o subagent
- [x] Campo `tools` só com ferramentas de leitura
- [ ] Pedir no prompt que ele não edite nada
- [ ] Dar a ele o mesmo contexto do principal

> A lista de tools é aplicada pelo harness; o prompt é só orientação. Atenção: Bash também permite escrever.

## code-24
tipo: unica
skill: Claude Code Operation

Por que checkpoints e `/rewind` não substituem o git?

- [x] Não cobrem tudo, como arquivos mudados só via Bash
- [ ] Apagam o histórico de commits a cada restauração
- [ ] Só funcionam em arquivos menores que 1 MB
- [ ] Exigem uma branch separada para cada prompt

> Checkpoints rastreiam edições das file tools. Mudanças só por Bash ou externas podem ficar de fora.

## code-25
tipo: unica
skill: Claude Code Operation

Um job de CI roda `claude -p` em PRs de **desconhecidos**. Qual risco considerar primeiro?

- [ ] O modo `-p` sempre ignora a configuração do projeto
- [ ] O PR fica privado até o fim da execução do job
- [ ] O modo `-p` não consegue ler arquivos do repositório
- [x] O repositório pode trazer hooks e servidores MCP

> Sem isolamento, a configuração do projeto vale sem diálogo de confiança. Restrinja segredos e permissões; `--bare` ignora hooks, MCP e `CLAUDE.md`.
