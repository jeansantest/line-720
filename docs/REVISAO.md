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
