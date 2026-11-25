dominio: eval

# Questões de simulado

## eval-501
tipo: unica
skill: Evaluation Design

Um classificador de urgência hospitalar acerta 96%. Dos erros, quase todos são casos graves marcados como leves. A diretoria quer publicar, pois a meta era 95%. Qual recomendação é a mais sólida?

- [ ] Adiar e exigir 98% de acurácia geral, o que deixa menos espaço para erros de qualquer tipo
- [x] Adiar e definir meta separada para os casos graves, pois a acurácia geral esconde o erro que importa
- [ ] Publicar com monitoramento, pois a meta combinada foi atingida e mudá-la agora seria injusto
- [ ] Adiar e ampliar o conjunto com casos leves, para que a acurácia geral fique mais estável

> O custo dos erros é assimétrico: meça o recall da classe grave. Cumprir uma meta mal definida não reduz o risco; mais casos leves inflam o número; 98% geral ainda pode esconder os mesmos erros.

## eval-502
tipo: unica
skill: Evaluation Design

Um LLM-as-judge avalia respostas de suporte com uma única nota de 1 a 5. Em 60 casos conferidos por humanos, a concordância é baixa e as notas se concentram em 4. O time quer manter a automação. Qual passo é melhor?

- [ ] Calcular a média de cinco execuções do mesmo juiz, o que elimina a discordância observada
- [ ] Ampliar a escala para 1 a 10 com descrição por nível, e manter a nota única para cada resposta
- [x] Trocar a nota única por critérios objetivos de sim ou não e medir de novo a concordância
- [ ] Usar um modelo maior como juiz e aceitar as notas, que já seguem uma escala bem conhecida

> Critérios específicos reduzem subjetividade e a concordância diz se o juiz serve. Modelo maior sem medir é aposta; a média reduz variação, não viés; alterar o rótulo humano inverte a referência. Uma escala maior continua misturando vários critérios em uma nota.

## eval-503
tipo: multipla
skill: Evaluation Design

Um time ajustou o prompt por semanas contra os mesmos 80 casos e chegou a 98%. Em produção, a taxa observada é de 81%. Os casos foram escolhidos no início do projeto. Quais ações tratam as causas mais prováveis? (Escolha 2)

- [ ] Aumentar o número de exemplos no prompt, usando os 80 casos como fonte
- [x] Manter um conjunto separado, que não é usado durante os ajustes do prompt
- [x] Renovar os casos com amostras recentes e representativas da produção
- [ ] Repetir cada um dos 80 casos dez vezes, para tornar o 98% mais confiável
- [ ] Trocar o grader por um mais rigoroso, até a nota cair para perto de 81%

> Há sobreajuste e amostra velha. Repetir os mesmos casos confirma o engano; calibrar a nota para baixo não corrige; usar os casos no prompt contamina ainda mais.

## eval-504
tipo: unica
skill: Evaluation Design

Uma mudança de prompt corrige 12 casos reportados por clientes e piora 5 que funcionavam. A média do eval sobe de 88% para 90%. Entre os cinco, dois tratam de cancelamento, fluxo com exigência legal. O que decidir?

- [x] Não publicar assim: corrigir primeiro as regressões críticas, que a média não mostra
- [ ] Publicar, pois o saldo é positivo e as regressões podem ser tratadas na próxima versão
- [ ] Publicar para metade dos clientes, já que assim só metade verá as cinco regressões
- [ ] Publicar com monitoramento no fluxo de cancelamento e reverter se surgirem queixas na primeira semana

> Casos com exigência legal são bloqueantes, seja qual for a média. O saldo ignora a gravidade; liberar a metade ou esperar queixas ainda viola; descartar tudo perde 12 correções aproveitáveis.

## eval-505
tipo: unica
skill: Debugging and Error Handling

Um agent de estoque dá respostas erradas em 7% dos casos. Os traces mostram: tool correta, argumentos corretos, `tool_result` com a quantidade certa, e resposta final com outro número, sempre quando o resultado traz 300 linhas. Onde agir primeiro?

- [ ] No banco de dados, conferindo se a quantidade gravada corresponde ao que existe no depósito
- [x] No formato do resultado, devolvendo só as linhas e os campos necessários para a pergunta
- [ ] Na descrição da tool, deixando mais claro em que situações ela deve ou não ser chamada
- [ ] Na validação dos argumentos, para impedir que o modelo consulte o produto errado no estoque

> A falha aparece na leitura de um resultado enorme; reduza o ruído. Seleção, argumentos e dado de origem já foram descartados pelo trace.

## eval-506
tipo: unica
skill: Debugging and Error Handling

Depois de um deploy, a latência do assistente dobrou. O prompt não mudou, o modelo é o mesmo, e `cache_read_input_tokens` caiu a quase zero. O deploy passou a ordenar a lista de tools por frequência de uso, recalculada a cada requisição. Qual é a causa mais provável?

- [ ] O recálculo a cada requisição consome o limite de uso que antes ficava disponível para o assistente
- [ ] O cache de tools expira em uma hora, e a ordenação só tornou visível um limite que já existia
- [x] A ordem variável das tools muda o início do prefixo e invalida o cache em boa parte das chamadas
- [ ] A nova ordem faz o modelo escolher tools erradas, gerando mais turnos até chegar à resposta

> Tools vêm primeiro no prefixo: mudar a ordem invalida o que vem depois. Escolha errada não zeraria a leitura; recalcular não chama a API; nada indica expiração.

## eval-507
tipo: unica
skill: Debugging and Error Handling

Um pipeline tem quatro chamadas: extrair, normalizar, classificar, redigir. A saída final erra o prazo em 10% dos casos. Só há log da entrada e da saída final. O time quer trocar o modelo da última etapa. O que fazer antes?

- [ ] Trocar o modelo da última etapa, já que é nela que o prazo errado aparece para o usuário
- [ ] Registrar a saída final de mais cem casos com erro e procurar um padrão nos prazos
- [ ] Juntar as quatro etapas em uma só, eliminando os pontos em que o prazo poderia ser alterado
- [x] Registrar a saída de cada etapa nos casos com erro e achar a primeira em que o prazo muda

> Sem observar as etapas, qualquer troca é palpite. Onde o erro aparece não é onde nasce; mais saídas finais não mostram a etapa; juntar etapas reduz a visibilidade.
