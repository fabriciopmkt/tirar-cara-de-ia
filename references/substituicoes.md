# O que pôr no lugar

## Cor e superfície (tokens em `assets/tokens.css`)
- **Um acento só, com intenção**: ação principal, progresso, item ativo. Em white-label, o acento é a cor do
  cliente, injetada em runtime como 3 números OKLCH (matiz, croma, luminosidade) no `<html>`; a rampa inteira sai
  em CSS. Teste a base com 2 ou 3 marcas bem diferentes antes de refazer tela.
- **Neutros com matiz** (um cinza levemente frio ou quente, nunca cinza morto), 3 níveis de superfície, divisória
  fina. Fundo um tom mais escuro que a caixa: é o que dá contraste sem precisar de borda grossa.
- **Estados** (ok, aviso, erro, info) com matiz fixo e as mesmas luminosidades pros quatro: fundo, texto, linha.
- **Categoria** (etapa de funil, tag, canal): mesma luminosidade e croma, muda só o matiz. Dez etapas viram uma
  família. Cor que vem do banco vai pro matiz mais próximo da paleta.
- **Tema escuro trocando o VALOR das variáveis** (`html.dark { --fundo: ... }`), nunca classe `dark:` no JSX. No
  escuro a sombra some e a superfície mais clara separa a caixa.
- **OKLCH** porque a luminosidade é perceptual: um matiz rende tons claros e escuros que não queimam.

- **Atalho pra app legado com muitas telas**: remapeie as famílias do Tailwind na fonte
  (`theme.extend.colors.slate = {...cinzas com matiz e contraste corrigido}`, acento antigo = cor da marca). O app
  inteiro muda num commit; depois migre tela por tela pros tokens. Reserve famílias distintas pra categoria.

## Forma
- Raio pequeno em controle (6 px), maior em caixa (12 px). Canto de 8 px em tudo deixou a tela chapada.
- Sombra leve só na caixa que fica sobre o fundo, e sombra de flutuar em menu e janela. Nada mais.
- **Lista densa numa superfície só**, com divisória entre as linhas, no lugar de um card por item.
- **Caixa em volta do que é o ponto da tela** (o número principal, as taxas do funil), sem caixa dentro de caixa.
- **Painel lateral ou gaveta** pra detalhe e edição (desktop: direita; celular: sobe do rodapé). `<dialog>` nativo
  resolve foco, Esc e fundo sem lib.
- Cada módulo ganha UM elemento próprio que ninguém mais tem (na central pessoal: o copo que enche; no painel de operação: o
  motivo escrito na linha).

## Tipografia
- Uma fonte própria no domínio, variável, subset latin (IBM Plex Sans: 45,7 KB no lugar de ~97 KB de Inter
  estática). Fonte da marca em subset só com as letras do nome (1,4 KB).
- Título de seção em letra normal, maior e escuro (caixa alta pequena e cinza some). Número que importa em negrito,
  tabular.
- Segunda fonte só onde trabalha e só baixa lá.

## Ícones
- Um conjunto só (Phosphor), gerado com os pares ícone+peso usados: cheio no ativo, contorno no resto, bold em
  glifo pequeno (seta, x, mais). Script gerador: ler `@phosphor-icons/core/assets/<peso>/<nome>.svg` e gravar um
  objeto `{ Nome: { regular: [paths], fill: [...] } }` + um componente por nome.

## Base de componentes (nasce antes das telas)
- Botão (marca, neutro, contraste, perigo, fantasma; 44 px, 36 só em linha densa de desktop), botão de ícone com
  rótulo obrigatório, campo com rótulo ligado por `htmlFor` e texto de 16 px, segmento, chave, abas com contagem,
  lista e linha, chip e ponto de categoria, indicador (rótulo, valor, comparativo dizendo se foi bom), gaveta,
  estados (esqueleto, carregando, vazio com a ação que resolve, aviso nos 4 tons, falha com "tentar de novo").
- Uma vitrine de dev mostrando cada componente em todos os estados, claro e escuro.
- Regra que a base carrega sozinha é regra que ninguém esquece: alvo, rótulo, token, raio.

## Diálogos, gráficos e peso
- **Diálogo do app no lugar de `confirm`/`alert`/`prompt`**: funções globais (`confirmar`, `avisar`, `pedirTexto`,
  `pedirCampos`) com um host montado uma vez no App, em z-index acima das gavetas.
- **Gráfico com tema num arquivo só** (fonte, eixo, grade, tooltip, cor da série que lê nos dois temas) e troca de
  tema redesenhando. Chart.js é leve; Recharts pesa (118 KB numa tela de um app real).
- **Telas sob demanda** (`React.lazy` por rota) e **safelist do Tailwind ancorada**: o app fica leve, e leve também
  é cara de produto.
- **Fonte sem os pesos 500/600**: confira que `font-medium` e `font-semibold` caem num peso que existe.

## Movimento
- Só em CSS e só onde conta: entrada de tela de ~300 ms, gaveta deslizando, número rolando no KPI principal,
  botão que afunda no toque. Respeitar "reduzir movimento". Lib de animação quase nunca paga o peso (+30 a 45 KB).

## Texto
- Sem travessão, sem "não é X, é Y", sem "Bem-vindo de volta".
- Botão diz o que acontece ("Suspender", "Gerar link"); aviso rápido diz o que aconteceu ("Link copiado").
- Erro diz o que deu errado e como resolver, sem desculpas.
- Estado pelo que a pessoa vê: "sem receber há 14 h" e não "mudo"; "ligado direto" e não "binding".
- Célula sem valor: "sem dado", discreto (em branco parece defeito; travessão é sinal).
- Estado vazio alinhado à esquerda, com a frase do que fazer e o botão que resolve.
- Número em texto de ajuda sai do código da regra (importe a constante), nunca digitado.

## Painel de gestão ou operação (benchmark de 28/09)
- Tabela com bolinha de estado e **motivo escrito na linha**; cartões no celular.
- Faixa no topo com o que precisa de atenção agora, e um clique filtra.
- Abas com contagem (Todas, Atenção, De olho, Implantação, Suspensas).
- 4 ou 5 números no topo, com comparativo contra a média da própria base.
- Gaveta por item com o porquê da cor, linha do tempo e as ações.
- Regra fixa no código, limites num objeto só; nada de nota de 0 a 100 com pesos.
- "Atualizado há X" e botão de ler de novo; leitura sozinha a cada poucos minutos com a aba visível.
- Link "O que fazer" de cada motivo pra um artigo de ajuda curto.

## Verificação
- Página de dev sem senha, com a API em memória e os estados que importam (vazio, meio, erro, cheio).
- 1440 e 390 px, claro e escuro, sem rolagem lateral no celular.
- Mesma CSP da produção, console sem erro.
- Script de auditoria antes e depois; build real medido em gzip.
