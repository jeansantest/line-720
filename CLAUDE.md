# Line 720 – instruções para o Claude

- `index.html` é GERADO. Nunca edite à mão: mude `content/` ou `src/` e rode `node build.mjs` (valida tudo e falha com arquivo/ID).
- Sem dependências npm e sem rede em tempo de execução; tem de abrir via `file://`.
- Interface em português e inglês: textos via `t('...')` + `content/idiomas.md`; toda questão nova precisa da versão em `content/dominios-en/`; termos técnicos da prova ficam em inglês.
- `src/visual.js` só desenha e toca; regras ficam em `src/jogo.js`. Recompensa só por aprendizado (ver DESIGN).
- Nunca mude o ID de uma questão existente: o progresso do jogador usa o ID.
- Não copie questões de provas reais, dumps ou simulados de terceiros. Escreva cenários próprios.
- Fato volátil (preço, nome de modelo, beta header): confira a documentação oficial antes e prefira testar o princípio.
- Alternativas com tamanho parecido; a correta não pode ser sempre a mais longa (o build avisa).
- Leia `docs/COMO-EDITAR.md` antes de criar questões e `docs/DESIGN.md` antes de mudar mecânicas.
