dominio: sec

# Questões de simulado

## sec-501
tipo: unica
skill: AI Application Security

Um assistente lê páginas web, acessa a caixa de e-mail do usuário e pode buscar qualquer URL. Uma página continha texto oculto que o fez colocar trechos de e-mail em uma URL externa. O produto precisa manter a leitura da web. Qual mudança reduz mais o risco?

- [ ] Separar a web e o e-mail em dois subagents que trocam entre si os textos completos
- [x] Restringir destinos de rede e separar a leitura da web do acesso ao e-mail em contextos isolados
- [ ] Acrescentar ao system prompt a ordem de nunca seguir instruções encontradas em páginas web
- [ ] Detectar texto oculto nas páginas com um classificador e bloquear as que forem suspeitas

> Quebrar a combinação de dado privado, conteúdo não confiável e canal de saída é estrutural. Prompt e classificador são camadas probabilísticas; subagents que trocam textos completos refazem a combinação.

## sec-502
tipo: unica
skill: AI Application Security

Uma tool `run_report(filtro)` monta SQL com o texto do modelo. Um teste mostrou acesso a dados de outra filial. O usuário está autenticado e a filial dele é conhecida pelo backend. Qual correção é a mais robusta?

- [ ] Instrução ao modelo para incluir sempre a filial do usuário no filtro que enviar
- [ ] Consulta parametrizada, com a filial informada pelo modelo como parâmetro obrigatório
- [x] Consulta parametrizada, com a filial obtida da sessão no backend e não do modelo
- [ ] Validação do texto do modelo por uma lista de palavras SQL proibidas na tool

> Autorização é imposta no backend, com a identidade da sessão. Lista de palavras é contornável; o parâmetro preenchido pelo modelo evita injeção, mas não o acesso a outra filial; instruções são probabilísticas.

## sec-503
tipo: unica
skill: Guardrails and Safe Deployment

Um agent financeiro executa pagamentos. Hoje tudo exige aprovação, e os analistas aprovam 400 por dia em segundos. Um pagamento fraudulento passou. A maioria é recorrente e de baixo valor. Qual desenho é melhor?

- [ ] Dupla aprovação em todos os pagamentos, para que um analista pegue o que o outro deixou passar
- [ ] Aprovação automática por um segundo modelo em todos, liberando os analistas para outras tarefas
- [ ] Manter a aprovação em tudo e exigir que o analista espere um minuto antes de clicar em aprovar
- [x] Limites em código para os recorrentes e aprovação detalhada só para valores altos ou favorecidos novos ou alterados

> Concentre a atenção humana onde há risco e imponha limites em código. Dupla aprovação e espera aumentam a fadiga; um modelo aprovando tudo remove o controle humano do que é crítico.

## sec-504
tipo: multipla
skill: Guardrails and Safe Deployment

Um chat público de uma loja vai ao ar em uma semana. A defesa atual é uma frase no system prompt pedindo respostas seguras. O time só consegue acrescentar dois controles no prazo. O chat pode consultar pedidos. Quais dois reduzem mais o risco? (Escolha 2)

- [ ] Um system prompt cinco vezes maior, cobrindo todos os abusos que o time imaginar
- [ ] Limite de uso por endereço IP, para frear quem tentar explorar o chat
- [ ] A troca do modelo por um maior, que tende a recusar melhor os pedidos abusivos
- [x] Autorização no backend, limitando a consulta aos pedidos do cliente autenticado
- [x] Checagem da saída e registro monitorado, com um jeito de desligar o chat depressa

> Controle de acesso impede o dano maior, e checar com monitoramento e desligamento limita o resto. Prompt maior e modelo maior seguem probabilísticos; o limite por IP reduz volume, e não acesso.

## sec-505
tipo: unica
skill: Identity, Secrets, and Key Management

Uma chave da API foi parar em um log público por duas horas. O time apagou o log e trocou o nível de registro. Não há sinal de uso indevido até agora. Qual é a ação seguinte mais importante?

- [ ] Trocar a chave na próxima janela programada e até lá restringi-la aos endereços IP de produção
- [x] Revogar e substituir a chave, revisar o uso no período e impedir que segredos cheguem aos logs
- [ ] Monitorar o consumo por uma semana e revogar a chave somente se aparecer algum uso anormal
- [ ] Reduzir o limite de gasto da chave e mantê-la, já que o log foi apagado antes de haver danos

> Segredo exposto é segredo comprometido, mesmo sem sinal de uso. Esperar ou limitar deixa a chave válida; renomear a variável não muda o segredo. A janela programada também deixa a chave válida até lá.

## sec-506
tipo: unica
skill: Claude Hooks

Um time usa um hook para bloquear comandos com `rm -rf`. Um agent apagou um diretório usando um script Python. O time quer proteger `/dados` contra perda, seja qual for o caminho. Qual medida é a mais efetiva?

- [ ] Acrescentar um hook `PreToolUse` que pergunta a um modelo se cada comando afeta o diretório
- [ ] Trocar o hook para `PostToolUse`, que percebe qualquer mudança feita no diretório e a registra
- [x] Rodar o agent em sandbox ou com um usuário do sistema que não possa escrever em `/dados`
- [ ] Ampliar o hook com uma lista maior de comandos e funções que apagam arquivos em várias linguagens

> Permissão do sistema vale para qualquer caminho. Lista de padrões sempre tem brechas; um modelo julgador também pode errar; `PostToolUse` ocorre depois da perda.
