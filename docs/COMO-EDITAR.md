# Como editar

Depois de qualquer mudança: `node build.mjs`.

## Arquivo de domínio
Começa com metadados, depois `# Briefing` (lista de ideias-chave) e `# Questões`.

    ## apps-21
    tipo: unica
    skill: Claude API Mechanics

    Enunciado. Aceita `código`, **negrito** e blocos de código cercados.

    - [x] alternativa correta
    - [ ] errada
    - [ ] errada
    - [ ] errada

    > Explicação mostrada após responder.

| tipo | Como escrever |
|---|---|
| `unica` | 4 alternativas, uma com `[x]` |
| `multipla` | 4 ou 5 alternativas, duas ou mais com `[x]` |
| `ordem` | itens `1.` `2.` `3.` na ordem certa (só nas estações e revisão; fora do simulado) |

O jogo embaralha alternativas: não escreva "todas as anteriores" nem "A e B".
Cada 5 questões formam uma estação, na ordem do arquivo. Novas questões entram no fim.
IDs são únicos e permanentes.

## Simulado
`content/simulado/*.md` começa com `dominio: agents` e usa o mesmo formato (sem `ordem`); o inglês fica em `content/simulado-en/`. IDs a partir de 501. Essas questões só aparecem no simulado (e na revisão, depois de respondidas).
- Cenário de 30 a 60 palavras, com uma restrição que muda a resposta.
- Alternativas de 10 a 20 palavras; ao menos duas defensáveis sem ler o cenário.
- A explicação diz por que cada errada perde.

## Inglês
Cada questão existe também em `content/dominios-en/`, com o mesmo ID e **as alternativas na mesma ordem** do português. Sem tipo nem `[x]`: o gabarito vem do português. Por isso, ao reordenar alternativas em um idioma, reordene no outro (o build não detecta troca de ordem).

    ## apps-21

    Stem. In `multipla`, end with "(Choose 2)".

    - option
    - option

    > Explanation.

`- =` sozinho repete as alternativas do português (nomes técnicos). O build falha se faltar tradução ou o número de alternativas divergir.
Texto novo na interface: `t('Texto em português {0}', valor)` no código e uma linha em `content/idiomas.md`.
