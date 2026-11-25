dominio: code

# Questões de simulado

## code-501
tipo: unica
skill: Claude Code Operation

Um monorepo tem backend, app móvel e infraestrutura. O `CLAUDE.md` da raiz soma 700 linhas, metade sobre Terraform, e o Claude passou a ignorar convenções do backend. Todos usam o mesmo repositório. Qual reorganização é a mais adequada?

- [ ] Mover tudo para Skills, inclusive as regras comuns, para que nada carregue antes da hora
- [x] Deixar na raiz o que é comum e mover o resto para regras com `paths` ou Skills por área
- [ ] Dividir o arquivo em três e importar os três com `@` no `CLAUDE.md` da raiz do projeto
- [ ] Copiar o conteúdo para o `CLAUDE.md` pessoal de cada um, filtrado pela área de trabalho

> Carregar sob demanda reduz o ruído. Imports organizam, mas entram no contexto; cópias pessoais divergem; as regras comuns precisam estar sempre presentes.

## code-502
tipo: unica
skill: Claude Code Operation

Um job de CI usa `claude -p` para comentar PRs de um repositório público. Ele roda com um token que pode escrever no repositório e acesso à internet. Um PR de fora altera `.claude/settings.json`. Qual configuração reduz mais o risco?

- [ ] O mesmo ambiente, com a configuração do PR carregada e uma lista de comandos permitidos no prompt
- [ ] Um modelo maior, que reconhece melhor tentativas de injeção escondidas em código de terceiros
- [x] Ambiente isolado, sem carregar a configuração do PR, com token mínimo e permissões explícitas
- [ ] O mesmo ambiente, mas com uma instrução no prompt para ignorar alterações em arquivos `.claude`

> Configuração e conteúdo do PR são não confiáveis: isole, use privilégio mínimo e ignore a configuração do projeto. Prompt e modelo maior não impõem; em `-p` não há quem aprove na tela. A configuração do PR pode rodar hooks.

## code-503
tipo: unica
skill: Claude Code Operation

O time quer impedir leituras de `secrets/`. Um dev criou `allow: Read` e `deny: Read(secrets/**)`, mas percebeu que um script próprio, rodado via Bash, ainda lê os arquivos. Qual conclusão é correta?

- [ ] A regra allow mais ampla anulou a deny, então basta inverter a ordem das duas no arquivo
- [ ] O padrão do deny é relativo, então um caminho absoluto na regra também barraria o script próprio
- [ ] A regra deny precisa ser escrita também no `CLAUDE.md` para que o Bash passe a respeitá-la
- [x] A regra cobre o acesso por tools; scripts rodados no shell pedem controle próprio, como sandbox

> Regras por tool não garantem o mesmo dado por outro caminho; restrinja no nível do sistema. Mudar o caminho, a ordem ou o arquivo da regra não muda isso: deny já vence allow, vale também para subagents, e `CLAUDE.md` não impõe.

## code-504
tipo: unica
skill: Claude Code Operation

Uma tarefa envolve entender 60 arquivos legados e depois alterar três. Ao explorar tudo na conversa principal, a edição sai ruim e o contexto enche. O desenvolvedor quer manter as decisões à vista. O que fazer?

- [x] Delegar a exploração a um subagent que devolve um mapa curto e editar na conversa principal
- [ ] Explorar na conversa principal e usar `/clear` logo antes de começar a alterar os três arquivos
- [ ] Delegar a exploração e a edição a um mesmo subagent, pedindo que ele avise quando terminar
- [ ] Delegar a exploração a subagents que devolvem o conteúdo completo dos arquivos relevantes

> O subagent absorve o volume e a conversa principal guarda decisões. `/clear` apaga o que foi aprendido; delegar tudo esconde as decisões; devolver arquivos completos traz o ruído de volta.

## code-505
tipo: unica
skill: Claude Code Operation

Uma empresa tem um processo de release de 15 passos, com scripts. Ele é usado por seis repositórios, só deve começar por pedido humano e muda todo mês. Qual empacotamento atende melhor?

- [ ] Um hook `SessionStart` que injeta os quinze passos em todas as sessões dos repositórios
- [x] Uma Skill em um plugin compartilhado, com a invocação pelo modelo desativada
- [ ] Um trecho no `CLAUDE.md` de cada repositório, revisado pelo time todo início de mês
- [ ] Uma Skill em um plugin compartilhado, com descrição pedindo uso só a pedido humano

> Procedimento reutilizável e versionado pede Skill em plugin, e a invocação manual é configurável. Cópias divergem; a descrição orienta, mas não impede a invocação; o hook ocupa contexto sempre.

## code-506
tipo: unica
skill: Claude Code Operation

Um hook `PreToolUse` deveria barrar migrações no banco de produção. Ele detecta o comando, escreve o motivo no stderr e sai com código 1, mas a migração roda. O time também quer que Claude saiba o porquê. Qual correção atende aos dois pedidos?

- [ ] Sair com código 0 e escrever "bloqueado" no stdout, que Claude trata como uma negação
- [ ] Manter o código 1 e acrescentar no `CLAUDE.md` que migrações de produção são proibidas
- [x] Sair com código 2, mantendo o motivo no stderr, para bloquear e informar o Claude
- [ ] Mover a verificação para `PostToolUse`, que recebe o resultado e pode desfazer a migração

> Código 2 bloqueia e mostra o stderr; o 1 é erro não bloqueante por padrão. `PostToolUse` ocorre tarde demais; texto livre com código 0 não nega. `CLAUDE.md` orienta, mas não bloqueia.
