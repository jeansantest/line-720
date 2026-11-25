# Revisão adversarial – 24/11/2026

Revisor lendo as 112 questões contra a referência da API e os docs de Claude Code e MCP. Nenhum gabarito apontava a opção errada; todos os achados foram aplicados.

| Questão | Problema | Correção |
|---|---|---|
| model-12 | podar histórico pode invalidar o cache e custar mais | opção e explicação trocadas |
| code-02 | regra deny não cobre todas as variantes | enunciado e explicação |
| apps-24 | existia opção AWS com paridade quase total | enunciado fixado em Bedrock |
| tools-08, apps-11 | faltavam exceções `refusal`/`max_tokens` | explicação |
| apps-01, agents-11, agents-07 | explicações incompletas | explicação |

Também: 57 distratores reescritos (correta mais longa caiu de 69% para 15%).

## Não conferidas em fonte (só por raciocínio)
- Prática geral: agents-01, 02, 04, 08, 09, 12–14; apps-15–22; eval-01–10; model-05, 09, 11; prompt-01–04, 07–15; sec-01–05, 07–11; tools-01, 03, 04, 10, 11
- Fatos de API plausíveis: apps-12–14; model-07, 10, 13, 14; tools-07, 12; code-07

# Segunda revisão – 24/11/2026 (168 questões novas)
Revisor independente respondeu às cegas (em inglês): 168/168, nenhum gabarito errado. O acerto total também indica que várias saem por eliminação.
- Texto do gabarito corrigido: agents-29 (`pause_turn` não encerra o loop), sec-25 e agents-16 (redação PT).
- Enunciado: agents-38, tools-17. Explicação: agents-17, 18, 29, 30, 32, 38; apps-41; model-15; sec-13, 24; tools-16, 20.
- 14 distratores fracos trocados: agents-25, 45; model-23, 29, 30; prompt-34, 35.
- prompt-32 substituída: repetia apps-11.
- Conferir depois, distratores ainda fáceis: agents-40, 41; apps-53; prompt-28; tools-22; eval-25.
- Só por raciocínio: a maior parte das questões de princípio (design, evals, prompting, segurança); técnicas com risco maior: apps-27, 32, 40, 45; tools-13.

# Terceira revisão – 24/11/2026 (70 cenários do simulado)
- Revisor às cegas: 70/70 com o enunciado, nenhum gabarito errado. Só com as alternativas, sem enunciado, também 70/70: fáceis demais por eliminação.
- Corrigidos: agents-508, 510–512; apps-502, 509, 511, 513; eval-506; sec-503; textos e explicações. Mais de 50 distratores trocados por quase-certos.
- Reteste com modelo menor (Haiku, um só), sem enunciado: 67/70 nas nossas (96%) e 46/49 no PDF de referência (94%; uma das três falhas é erro de impressão do PDF). Dificuldade por eliminação parecida; não prova equivalência com a prova real.
- Só por raciocínio: tools-504, quotas por conta, retries padrão do SDK, Files API/PDF.
- O PDF é de terceiros; a prova real pode ser mais difícil.
