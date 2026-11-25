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
