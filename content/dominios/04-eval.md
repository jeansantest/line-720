id: eval
nome: Eval, Testing, and Debugging
cor: #16806a

# Briefing
- Defina sucesso mensurável antes de mexer no prompt.
- Prefira graders em código; use LLM-as-judge para o subjetivo e calibre contra humanos.
- Leia traces para separar falha da integração de falha do modelo.
- Cada bug de produção vira um caso de regressão.

# Questões

## eval-01
tipo: unica
skill: Evaluation Design

O que é um *golden set* em evals?

- [x] Casos representativos com resultados esperados confiáveis
- [ ] As respostas mais longas que o modelo já gerou
- [ ] Os prompts que consomem menos tokens de entrada
- [ ] Uma amostra grande de produção sem resposta de referência

> É a referência para comparar versões. Deve incluir casos típicos e de borda.

## eval-02
tipo: unica
skill: Evaluation Design

Para medir se a classificação retornou um dos cinco rótulos corretos, qual grader escolher?

- [x] Comparação exata em código
- [ ] LLM-as-judge com nota de 1 a 10
- [ ] Revisão humana de todos os casos
- [ ] Contagem de tokens da resposta

> Se o código decide, use código: rápido, barato e determinístico.

## eval-03
tipo: unica
skill: Evaluation Design

Como saber se um LLM-as-judge é confiável antes de usá-lo em escala?

- [x] Medir a concordância dele com avaliações humanas
- [ ] Pedir ao judge uma nota de sua própria confiança
- [ ] Verificar se as notas médias são altas
- [ ] Usar o mesmo prompt do modelo avaliado

> Calibre com uma amostra rotulada por humanos; ajuste a rubrica onde houver divergência.

## eval-04
tipo: unica
skill: Evaluation Design

Uma mudança no prompt corrigiu um caso reportado. O que fazer antes do deploy?

- [x] Rodar a suíte de regressão completa
- [ ] Testar de novo só o caso corrigido
- [ ] Fazer o deploy e aguardar reclamações
- [ ] Aumentar o effort por garantia

> Correções pontuais podem quebrar outros casos.

## eval-05
tipo: unica
skill: Debugging and Error Handling

O trace mostra `tool_use` com argumentos corretos, mas o `tool_result` traz dados do cliente errado. Onde está o problema?

- [x] Na implementação da tool ou na integração
- [ ] Na escolha de argumentos feita pelo modelo
- [ ] No limite de tokens da resposta
- [ ] Na temperatura da geração

> O modelo pediu certo; a camada de integração devolveu errado. O trace localiza a origem.

## eval-06
tipo: unica
skill: Debugging and Error Handling

O trace mostra que o modelo chama `search_docs` quando deveria chamar `search_orders`. O que revisar primeiro?

- [x] Nomes e descrições das duas tools
- [ ] Timeout do banco de pedidos
- [ ] Política de retry do cliente HTTP
- [ ] Permissões da API key utilizada

> Seleção errada de tool costuma vir de descrições vagas ou sobrepostas.

## eval-07
tipo: ordem
skill: Debugging and Error Handling

Ordene um processo saudável para tratar uma falha de produção.

1. Coletar o trace e reproduzir a falha
2. Isolar a causa entre integração e modelo
3. Adicionar o caso à suíte de evals
4. Aplicar uma mudança específica
5. Rodar a regressão e só então publicar

> Registrar o caso antes de corrigir prova que o teste falha e depois passa.

## eval-08
tipo: unica
skill: Evaluation Design

Um eval passou uma vez, mas o app falha de vez em quando com a mesma entrada. O que faltou?

- [x] Rodar várias tentativas por caso e medir a taxa
- [ ] Usar um prompt diferente para cada caso testado
- [ ] Remover os casos que variam muito
- [ ] Reduzir a suíte para um único caso

> Saídas não são determinísticas. Uma tentativa esconde a taxa real de falha.

## eval-09
tipo: multipla
skill: Evaluation Design

Quais práticas evitam enganar a si mesmo com um eval? (Escolha 2)

- [x] Manter um conjunto de teste separado do usado para ajustar
- [x] Incluir casos de borda e entradas adversariais
- [ ] Ajustar o prompt olhando as respostas do teste final
- [ ] Manter só exemplos que o modelo já acerta

> Ajustar sobre o teste causa overfitting; só casos fáceis escondem regressões.

## eval-10
tipo: unica
skill: Debugging and Error Handling

Qual registro é o mais útil para depurar um agent em produção?

- [x] Trace com mensagens, tools, resultados, `stop_reason` e uso
- [ ] Resposta final enviada ao usuário, com data e hora de entrega
- [ ] Apenas o total mensal de tokens consumidos
- [ ] Apenas o status HTTP de cada requisição

> Falhas de agents surgem no meio da trajetória. Registre-a, com os dados pessoais protegidos.

## eval-11
tipo: unica
skill: Debugging and Error Handling

A API responde 529 em um pico. Qual estratégia de recuperação é a mais adequada?

- [x] Backoff com jitter, limite de tentativas e fallback planejado
- [ ] Correção do JSON Schema e reenvio imediato da mesma requisição
- [ ] Nova API key para cada tentativa realizada
- [ ] Redução do system prompt até o erro sumir

> 529 indica sobrecarga temporária: não é defeito do pedido.
