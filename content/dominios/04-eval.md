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

## eval-12
tipo: unica
skill: Debugging and Error Handling

Um Q&A com RAG erra o prazo de devolução. O trace mostra que o trecho certo **não** estava entre os recuperados. Onde atuar?

- [ ] No modelo, trocando por um de maior capacidade
- [ ] No prompt, pedindo mais precisão nas respostas
- [x] Na busca: chunking, índice ou consulta
- [ ] Na interface, com um aviso de possível erro

> O modelo não pode usar o que não recebeu. Se o trecho certo estivesse lá, a investigação iria para o prompt ou o modelo.

## eval-13
tipo: unica
skill: Debugging and Error Handling

Um RAG tem recuperação e geração. Como medir para saber **qual das duas** piorou?

- [x] Avaliar cada etapa com métricas próprias
- [ ] Usar só a nota final dada pelos usuários
- [ ] Contar os tokens médios de cada resposta
- [ ] Rodar o mesmo caso até a resposta acertar

> Métricas por etapa (o trecho certo veio? a resposta é fiel a ele?) localizam a regressão.

## eval-14
tipo: unica
skill: Evaluation Design

Qual é o primeiro passo ao criar evals para um app novo?

- [ ] Gerar mil casos sintéticos com outro modelo
- [ ] Comparar os preços de três modelos diferentes
- [x] Definir o que é sucesso em termos mensuráveis
- [ ] Escolher a ferramenta que vai rodar os testes

> Sem critério de sucesso, nenhum número do eval ajuda a decidir.

## eval-15
tipo: unica
skill: Evaluation Design

De onde tirar os casos **mais valiosos** para um eval de um app já em produção?

- [ ] De benchmarks públicos de uso geral
- [x] De falhas e pedidos reais, anonimizados
- [ ] Dos exemplos que estão no system prompt
- [ ] De perguntas que o modelo já acerta sempre

> Casos reais refletem a distribuição de uso. Exemplos do prompt contaminam a medida.

## eval-16
tipo: unica
skill: Evaluation Design

Um LLM-as-judge dá nota maior às respostas **mais longas**. Qual é a correção?

- [x] Rubrica por critério, calibrada com humanos
- [ ] Usar o mesmo juiz com mais tokens de saída
- [ ] Encurtar todas as respostas antes de julgar
- [ ] Somar a nota do juiz ao tamanho do texto

> Viés de verbosidade é comum. Critérios específicos e calibração o expõem e reduzem.

## eval-17
tipo: unica
skill: Evaluation Design

Ao comparar duas respostas, o juiz prefere quase sempre a **primeira**. Como reduzir o viés?

- [ ] Mostrar só a primeira das respostas
- [ ] Pedir que ele seja imparcial, por favor
- [ ] Aumentar o número de critérios
- [x] Julgar nas duas ordens e comparar

> Trocar a ordem revela viés de posição; inconsistências viram empate ou revisão.

## eval-18
tipo: unica
skill: Evaluation Design

Um eval de agent compara a sequência exata de tools com um gabarito e reprova soluções válidas. O que mudar?

- [ ] Aceitar qualquer execução que termine sem erro
- [ ] Remover tools até restar só um único caminho
- [x] Avaliar o resultado final e os limites violados
- [ ] Ensinar ao agent a sequência exata do gabarito

> Há vários caminhos válidos. Avalie o estado final e regras que não podem ser quebradas.

## eval-19
tipo: unica
skill: Evaluation Design

O eval tem 12 casos; a versão B acertou 10 e a A, 9. O que concluir?

- [ ] As duas são idênticas em qualidade real
- [x] Pouco: a diferença pode ser só variação
- [ ] B é melhor e já pode ir para produção
- [ ] A é melhor, pois errou em casos difíceis

> Amostra pequena e uma tentativa não separam melhora de ruído.

## eval-20
tipo: unica
skill: Evaluation Design

Um detector de fraude: 99% dos casos são legítimos e o modelo acerta 99% dizendo sempre "legítimo". Qual métrica expõe isso?

- [x] Recall da classe fraude
- [ ] Acurácia sobre o total
- [ ] Latência média por caso
- [ ] Tokens por resposta

> Com classes desbalanceadas, a acurácia engana. Veja precisão e recall da classe rara.

## eval-21
tipo: multipla
skill: Evaluation Design

Quais graders são **determinísticos**? (Escolha 2)

- [x] Rodar testes unitários no código gerado
- [ ] Um LLM avaliando o tom da resposta
- [ ] Um revisor humano dando uma nota
- [x] Validar o JSON contra o schema

> Prefira código quando o critério permite; use LLM ou humano para o que é subjetivo.

## eval-22
tipo: unica
skill: Evaluation Design

A nota do eval subiu, mas as reclamações também. Qual hipótese investigar primeiro?

- [ ] O modelo mudou a resposta por causa do horário
- [ ] O eval precisa de uma meta de nota mais alta
- [x] Os casos do eval não representam o uso real
- [ ] Os usuários estão usando o app de forma errada

> Um eval só vale se a distribuição e o grader refletem o que importa ao usuário.

## eval-23
tipo: unica
skill: Evaluation Design

Um teste A/B em produção complementa o eval offline porque:

- [ ] Garante que não haverá regressões
- [x] Mede o efeito em usuários e metas reais
- [ ] Dispensa definir critérios de sucesso
- [ ] É mais barato que qualquer eval offline

> O offline é rápido e seguro; o A/B confirma o impacto real.

## eval-24
tipo: unica
skill: Debugging and Error Handling

Durante um stream já iniciado com HTTP 200, o servidor falha. Como o erro chega?

- [x] Como um evento de erro dentro do stream
- [ ] Como um novo status HTTP 500 no header
- [ ] Como uma resposta vazia com `end_turn`
- [ ] Como um `tool_result` marcado com erro

> O status já foi enviado. O cliente deve tratar eventos de erro e interrupções.

## eval-25
tipo: unica
skill: Debugging and Error Handling

Ao abrir um chamado sobre uma resposta problemática da API, qual dado é o mais útil?

- [ ] A API key usada na chamada
- [ ] O preço do modelo utilizado
- [ ] O horário de abertura do app
- [x] O `request-id` da resposta

> O ID identifica a requisição. Nunca envie a API key.

## eval-26
tipo: unica
skill: Debugging and Error Handling

Uma resposta termina com `stop_reason: "pause_turn"` em um pedido com server tools. O que fazer?

- [ ] Enviar um `tool_result` vazio em nome da tool
- [ ] Trocar o modelo e recomeçar do início
- [x] Reenviar com a resposta anexada, para continuar
- [ ] Tratar como erro fatal e descartar a conversa

> O loop do servidor pausou. Anexe o conteúdo do assistant sem alterar e repita com as mesmas tools.

## eval-27
tipo: unica
skill: Debugging and Error Handling

Respostas 413 aparecem só em clientes com anexos grandes. O que isso indica?

- [ ] O modelo pedido não existe na conta
- [x] A requisição passou do limite de tamanho
- [ ] O limite de requisições por minuto estourou
- [ ] A API key não tem permissão para anexos

> 413 é `request_too_large`. Reduza, divida ou use a Files API.

## eval-28
tipo: unica
skill: Debugging and Error Handling

O modelo chama a tool certa com a data trocada (mês e dia). O trace mostra a descrição "data do pedido". O que corrigir?

- [x] Especificar o formato e dar um exemplo
- [ ] Trocar o dia e o mês no código da tool
- [ ] Remover o parâmetro data da tool
- [ ] Pedir mais atenção no system prompt

> Argumento ambíguo é problema do contrato da tool: descreva o formato e valide.

## eval-29
tipo: unica
skill: Debugging and Error Handling

Um bug aparece em 1 de cada 20 execuções. Como avaliar se a correção funcionou?

- [ ] Rodar uma vez e ver se o erro não aparece
- [ ] Pedir ao modelo que confirme a correção
- [ ] Esperar uma semana sem nenhuma reclamação
- [x] Rodar muitas vezes antes e depois e comparar

> Falha intermitente pede taxa, não anedota.

## eval-30
tipo: unica
skill: Debugging and Error Handling

Para isolar um erro em um pipeline de 5 chamadas, qual é o método mais eficiente?

- [ ] Trocar o modelo em todas as cinco etapas
- [ ] Juntar as cinco etapas em uma só chamada
- [x] Inspecionar entrada e saída de cada etapa
- [ ] Reescrever os cinco prompts de uma só vez

> Ache a primeira etapa cuja saída está errada com entrada certa; corrija ali.
