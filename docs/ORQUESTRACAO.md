# Orquestração (método MegaBrain)

Baseado em <https://github.com/Lumantis/MegaBrain> (MIT, v1.0.0), lido em 24/11/2026.
Usado como **método**. Não instalamos o plugin nem geramos skills em `~/.claude/skills`, porque as skills geradas rodam sem confirmação e instalam dependências sozinhas.

## 1. DECODE
- intent: game · domínios: game-dev, engineering, content · complexidade: medium
- stack: HTML/CSS/JS puro + Node só para o build · restrições: offline, português, conteúdo em `.md`

## 2. ARCHITECT (dag-pipeline)
pesquisa → design → conteúdo → build/jogo → teste no navegador → revisão adversarial → correção

| Fase | Papel MegaBrain | Gate |
|---|---|---|
| Design | game-designer | toda mecânica em `docs/DESIGN.md` |
| Conteúdo | especialista de domínio | `node build.mjs` sem erro |
| Jogo | frontend-developer | console limpo, fluxos jogados |
| Revisão | revisor adversarial | achados corrigidos ou recusados com motivo |

## 3. Decisões
| Decisão | Motivo |
|---|---|
| Conteúdo em Markdown, jogo gerado | pedido do usuário: facilitar mudanças |
| Um único `index.html` sem servidor | abrir com duplo clique |
| Pesos de 7/12 como padrão | quem começa agora deve prestar a prova nova |
| Sem conversão "oficial" de nota | a Anthropic não publica a fórmula |

## 4. REVIEW – histórico
Ver `docs/REVISAO.md`.

## Fluxo para novas versões
Copie esta página, refaça as seções 1 e 2 e siga os gates.
