# Certificação CCDV-F – fatos e fontes (verificado em 24/11/2026)

| | Até 6/12/2026 | A partir de 7/12/2026 |
|---|---|---|
| Questões | 53 | 70 (60 valem nota, 10 não) |
| Tempo | 120 min | 120 min |
| Corte | 720 (100–1000, escalado) | 720 |

Preço US$ 125, Pearson VUE, validade 12 meses, sem pré-requisitos.

## Confiança
- **Oficial, lido:** Exam Guide v1.0 (jul/2026): formato, 25 skills e pesos antigos. <https://everpath-course-content.s3-accelerate.amazonaws.com/instructor/6nizmqk8tpzpfjvt6qmmav7rh/public/1783542875/Claude+Certified+Developer+%E2%80%93+Foundations+Exam+Guide.pdf>
- **Oficial, lido:** Pearson confirma conteúdo novo em 7/12. <https://www.pearsonvue.com/us/en/anthropic.html>
- **Secundário:** pesos novos e 70 questões. <https://www.timolabs.dev/claude-certification-exam-changes>, parcialmente confirmado por <https://www.claudecertifiedarchitects.com/blog/claude-exam-update-december-2026/>. O guia v1.1 ainda NÃO foi lido na fonte; a página oficial recusou acesso automático.

**A fazer:** baixar o v1.1 em <https://anthropic-partners.skilljar.com/page/partner-certifications> e conferir `content/prova.md`.

## Temas que entram no guia novo (secundário)
Desenho de evals (golden sets, regressão, LLM-as-judge calibrado), falhas de integração (fim de stream, 429/529, retry/fallback), extensão do Claude Code, grounding com citações, custo/cache breakpoints, Managed Agents, Files API.
Deixam de ser citados: Strands, LangGraph, PydanticAI.

As questões se baseiam nas skills do guia v1.0, nesses temas e na referência da API Claude (nov/2026).

## Material de apoio
Questões de prática de Matthew Purcell (v1.0, jul/2026, 53 questões, PDF em `fontes/`, fora do git). Autorais dele e sem licença de cópia: usado só como mapa de temas. As 24 questões novas (agents-16–20, apps-25–30, eval-12–13, model-15–20, sec-12–13, tools-13–15) têm cenários próprios.
Divergências do PDF com a documentação atual (conferida em 24/11/2026):
- 5.2 (janela): dos modelos 4.5 em diante, entrada + `max_tokens` acima da janela é aceito. Fonte: <https://platform.claude.com/docs/en/build-with-claude/context-windows>
- 5.1 (temperature 0): a conclusão vale, mas modelos recentes rejeitam `temperature`.
- 5.9 (fast mode): gabarito impresso com erro ("CA, D"; o certo é C); o beta header só é exigido em modelos anteriores. Fonte: <https://platform.claude.com/docs/en/build-with-claude/fast-mode>
- 1.7 (limites do Agent SDK): confirmado. Fonte: <https://code.claude.com/docs/en/agent-sdk/agent-loop>
- 1.8 (Strands, LangGraph, PydanticAI): deixa de ser citado na prova nova; não virou questão.

## Ampliação para 280 questões (24/11/2026)
144 questões próprias novas. Fatos voláteis conferidos em code.claude.com (hooks, permissions, settings, memory, headless, mcp, sub-agents, skills, checkpointing), platform.claude.com (caching, batch, stop reasons, tools, structured outputs, citations, MCP connector, errors, thinking) e na especificação MCP 2026-07-28. Partes longas dessas páginas foram lidas em resumo.
Evitado de propósito: sampling e roots do MCP (obsoletos na spec 2026-07-28), preços e betas.
Revisão: ver docs/REVISAO.md.
