# Design

**Fantasia:** um mapa de metrô. Cada domínio da prova é uma linha, cuja espessura é o peso na prova. O destino é a estação 720.

**Pilar:** toda mecânica ensina um conceito.

| Mecânica | Conceito |
|---|---|
| Janela de contexto enche a cada questão; cheia, a viagem acaba | Context window finita |
| Erro gasta muito mais tokens | Contexto poluído |
| 3 acertos seguidos = cache hit, questão custa pouco | Prompt caching |
| `/compact` libera espaço | Compaction |
| `grep` elimina 2 alternativas, mas gasta tokens | Tool call tem custo |
| `advisor` mostra a ideia-chave, gasta mais tokens | Consultar outro modelo |

**Modos**
1. *Estações*: 5 questões, feedback imediato, 1–3 estrelas; 60% libera a próxima.
2. *Revisão*: repetição espaçada (caixas Leitner; intervalos em `balanceamento.md`).
3. *Simulado*: pesos e tempo da prova, sem ajuda nem feedback até o fim.

**Nota de treino:** 100 + 900 × acerto. A Anthropic não publica a conversão real, então é só referência.

**Dados:** `localStorage`, chave `linha720`; exportar/importar na tela inicial.

## Recompensas visuais (v1.1)
Regra: **só aprender dispara recompensa**. Sem sorteio, sem moeda paga, sem perda por faltar um dia além de zerar a contagem.

| Recompensa | Dispara quando | Onde mudar |
|---|---|---|
| Janela acende na cidade (1 por questão) | último acerto da questão vale; errar depois apaga | `Cena.mapa` em `src/visual.js` |
| Farol no topo da torre | domínio inteiro aceso | idem |
| Vagão novo no trem | cada acerto da viagem | `Cena.estado` |
| Turbo, confete dourado, acorde | cache hit | `responder()` em `src/jogo.js` |
| Tom sobe a cada acerto seguido | sequência | `Som.certo` |
| Freada e tremor | erro | `Cena.erro` |
| 3 missões diárias | metas em `balanceamento.md` | `progresso()` |
| Trens novos | níveis 2, 4, 6, 8, 11 | `TRENS` em `src/visual.js` |

Simulado: sem cena e sem efeitos até a nota, para simular a prova. Som pode ser desligado no mapa; `prefers-reduced-motion` desliga o movimento.

## Chama, nível e missões (v1.2)
Marcação em `src/painel.js`, estilo no fim de `src/estilo.css`, regras em `src/jogo.js`.
- **Chama:** acende na 1ª questão do dia (momento em tela cheia). Cinza se ainda não jogou. Cores: laranja, rubra (7+ dias), azul (30+); ajuste em `CHAMAS`.
- **Semana:** últimos 7 dias, calculados da sequência atual.
- **Nível:** medalhão com anel de XP e o próximo trem. Aparece no mapa, na viagem e no resultado.
- **Missões:** selo ao cumprir; as barras enchem no resultado a partir do valor do início da viagem.

## Idioma e mapa (v1.3)
- Seletor PT/EN no topo da tela inicial. Trocar não altera progresso; primeira vez segue o idioma do navegador.
- Mapa: cada linha é um domínio, espessura = peso, trecho aceso = estações concluídas, estação amarela = próxima, cadeado = bloqueada. Todas descem até a estação 720, onde fica o simulado; a linha só acende até lá quando completa.
