---
name: tirar-cara-de-ia
description: "Método pra tirar a 'cara de IA' de um app, painel ou site (visual genérico de v0/Lovable/shadcn: emoji como ícone, card arredondado em tudo, Inter, roxo e degradê, tudo centralizado, texto de robô) e pra começar um produto novo que já nasce sem ela. Use sempre que pedirem pra refazer o visual, 'tirar cara de IA', 'deixar menos genérico', 'parecer produto de verdade', 'remake visual', 'faltou contraste', revisar telas geradas por IA, montar tokens, design system ou base de componentes, redesenhar um painel ou dashboard, ou começar um app, central ou painel do zero, mesmo sem essas palavras. Cobre auditoria contada por arquivo (script incluso), ponto de partida medido, referências por função, protótipo com voto item a item, tokens OKLCH, fonte, ícones, base de componentes, textos, prévia e deploy em etapas. Também em inglês: 'make this look less AI-generated', 'our UI looks like a template', 'redesign this app'."
---

# Tirar a cara de IA

Método que funcionou em três remakes reais em setembro de 2026: uma central pessoal (hábitos, água, notas), o hub
interno de uma empresa de educação e um CRM white-label pra clínicas. A cara de IA quase nunca é uma coisa só: é a
soma de sinais pequenos (emoji no lugar de ícone, o mesmo card em tudo, fonte padrão, várias cores brigando, texto
de robô). Por isso o trabalho começa contando, e não opinando.

## Como conversar com quem pediu

- Na língua de quem pediu. Recomendação com justificativa, nunca só uma lista de opções. Decisão com número na mão
  (KB, contagem, contraste medido).
- Bloco grande: plano antes, e aprovado o plano, executa em sequência sem microgerenciar.
- **Nada em produção sem a pessoa nomear a ação** ("deploy"). Prévia, protótipo e branch podem.
- Textos de tela sem travessão (—), sem "não é X, é Y" e sem muleta repetida. Se a pessoa tiver regras de texto
  próprias, elas valem por cima destas.
- Mostre antes de pedir aprovação: protótipo clicável ou prévia ao lado da produção, com itens numerados pra
  responder "1 fica, 4 sai".

## Escolha o modo

- **A. Refazer um app que já existe** (feito com IA ou não): siga "Modo A" abaixo.
- **B. Começar um produto novo**: siga "Modo B". É o Modo A sem a auditoria: a base nasce certa.
- **C. Tela nova num app que já passou pelo remake**: use a base que existe (tokens, componentes, ícones), rode o
  script de auditoria na pasta da tela nova e só entregue com os sinais zerados.

## Modo A: refazer um app que existe

1. **Auditar antes de propor.** Rode o script e depois abra as telas pra confirmar:
   `node ~/.claude/skills/tirar-cara-de-ia/scripts/auditar.mjs <pasta-do-front> --top 5`
   Ele conta os sinais por arquivo (emoji, card, centralizado, famílias de cor, hex fixo, travessão, rótulo, botão
   falso, alvo pequeno, campo pequeno, movimento). Número alto diz onde olhar; a leitura da tela confirma (emoji
   num seletor de emoji é legítimo). A lista completa dos sinais e o que conta como exceção está em
   `references/sinais.md`. Entregue a auditoria com arquivo e linha dos piores casos.
2. **Medir o ponto de partida.** JS e CSS em gzip do build real, fontes baixadas, libs de interface e de ícone,
   quantas telas, quantos componentes repetidos. Sem isso não dá pra dizer depois se ficou mais pesado.
3. **Mapear o que NÃO pode mudar**, e escrever isso no plano:
   - **Estrutura das telas de uso diário.** Quem atende o dia todo (caixa de conversa, kanban) já tem memória
     muscular: muda a pele, a estrutura fica. Referência famosa entra como acabamento, nunca como layout.
   - **Telas congeladas por terceiros** (análise de loja, App Review da Meta): ficam pra depois, ou mudam só com o
     texto e o fluxo idênticos.
   - **White-label ou multi-tema**: cor por cliente precisa ser token em runtime, não cor fixa no build.
4. **Referências por função.** Peça à pessoa os apps que ela gosta pra cada função. Se ela não passar, escolha você,
   com o porquê, uma por função (exemplos que funcionaram: Attio pra CRM, Linear pra densidade e ícones, WhatsApp
   Web pra conversa, Notion pra documento, Stripe Connect e Linear pra painel de gestão). Pra painel de
   operação/gestão, faça benchmark de 5 a 8 players e extraia padrões (ver "Painel de gestão" em
   `references/substituicoes.md`).
5. **Direções e decisão.** Duas formas, conforme o tamanho:
   - **Remake grande:** três direções numa prancheta, com telas reais e dados plausíveis, diferindo em estrutura,
     fonte e forma (três paletas do mesmo layout contam como uma). A pessoa pode misturar: monte a linha
     "Escolhida" antes de codar.
   - **Ajuste ou tela nova:** protótipo clicável com dados fictícios, claro e escuro, computador e celular, e
     **itens numerados pra votar** "fica" ou "sai", com um quadro de voto que copia a resposta.
6. **Plano em etapas, com as decisões da pessoa destacadas e o custo de cada lib em KB.** A ordem que funcionou:
   - Etapa 0: tokens, fonte, ícones, cache (`?v=` em arquivo sem hash).
   - Etapa 1: base de componentes + uma vitrine de dev com todos os estados.
   - Etapa 2: moldura (menu, topo) e as telas que aparecem em demonstração.
   - Etapa 3: o resto; congeladas por último.
   Dois deploys pequenos rendem mais que um grande: a pessoa testa no celular no meio.
7. **Construir com volta fácil.** Um commit por item votado (volta = `git revert` do item), build e testes em
   cada um. Tela aprovada fica **travada** contra mudança de token global (tokens próprios no escopo dela).
   O que pôr no lugar de cada sinal: `references/substituicoes.md`. Tokens prontos pra copiar: `assets/tokens.css`.
8. **Prévia antes do geral.** Publique numa versão de prévia que só uma conta ou cliente de teste enxerga, e peça
   pra comparar lado a lado com a produção. A resposta vira a lista do que fica.
9. **Deploy geral só com "deploy".** Sondas (página nova servida, bundle velho fora, rotas protegidas recusando
   sem sessão), log de alguns minutos sem erro, registro do que mudou e de como voltar. Volta = rollback pra versão
   anterior, anotada antes.

## Modo B: produto novo

O objetivo é nunca precisar do Modo A. No dia 1, antes da primeira tela:

1. **Nome e marca com história.** "Central X" e duas letras num quadrado são o primeiro sinal de genérico. Converse
   sobre o que o produto faz pela pessoa; a marca sai daí.
2. **Referências por função** (passo 4 do Modo A).
3. **Tokens** (`assets/tokens.css`): neutros com matiz, 3 níveis de superfície, um acento só, estados com matiz
   fixo, categorias com a mesma luminosidade, tema escuro trocando o valor das variáveis.
4. **Uma fonte própria no próprio domínio**, variável e em subset latin (IBM Plex Sans funcionou). Confira dígitos
   tabulares medindo.
5. **Ícones de um conjunto só**, gerados só com o par ícone+peso usado (Phosphor pelo `@phosphor-icons/core`, ~0,17 KB
   por desenho). Emoji fica só onde é conteúdo (seletor de emoji).
6. **Base de componentes com as regras embutidas**: botão de 44 px, campo de 16 px com rótulo ligado, botão de ícone
   com rótulo obrigatório, lista densa, gaveta, abas, estados (carregando, vazio, erro) alinhados à esquerda,
   "sem dado" no lugar de célula vazia. Tela nova nasce em cima da base, nunca com classe solta.
7. **Textos**: nome das coisas pelo que a pessoa vê (um número "mudo" soou como "não envia"; virou "sem receber").
8. **Verificação sem senha**: uma página de dev com a API em memória e os estados que importam; conferir em 390 px
   e no escuro; mesma CSP da produção antes de publicar lib nova.
9. **Rode o script de auditoria antes de cada entrega** e entregue com os sinais zerados.

## Lições que custaram caro (leia antes de propor)

- **"Faltou contraste" raramente é cor.** No CRM as cores novas contrastavam igual às antigas (medido). O chapado
  vinha de canto pequeno (8 px), menos caixas, números em seminegrito e título de seção pequeno, cinza e em caixa
  alta. Conserto: fundo um tom mais escuro com caixa branca pura, sombra leve só em caixa, canto de 12 px, cinzas
  de texto mais escuros (~6:1), título de seção normal e escuro, número em negrito. Meça antes de mexer.
- **App legado com muitas telas: remapeie a paleta na fonte.** No hub interno, trocar o `slate` e o acento direto
  no `tailwind.config` (cinza com matiz e contraste corrigido; acento = cor do logo) mudou o app inteiro de uma vez.
  Depois disso, família remapeada pra mesma cor não serve mais como cor de categoria.
- **Contraste de texto se mede em número** (247 textos do hub interno em 2,56:1; alvo ≥ 4,5:1, cinza claro só em
  borda).
- **Zero janela do navegador** (`confirm`, `alert`, `prompt`): diálogo do app com um host global acima das gavetas.
- **Peso também é cara de produto:** telas sob demanda por rota, safelist do Tailwind ancorada, lib de gráfico
  leve (Chart.js com o tema num arquivo só) no lugar de uma pesada.
- **A IA do próprio app também escreve:** ponha as regras de texto no prompt dela.
- **Largura importa.** Tela inicial estreita demais (max-w-3xl) pareceu vazia; voltou pra max-w-5xl.
- **Caixa em volta do número que é o ponto da tela**, mas nunca caixa dentro de caixa.
- **Tire o que ninguém usa.** Botão flutuante de IA que ninguém clicava saiu inteiro (componente, CSS e a folga que
  ele reservava na tela).
- **Painel de gestão:** regra fixa escrita no código vence nota de 0 a 100; o motivo vai escrito na linha ("WhatsApp
  Recepção caiu há 40 min: desconectado no provedor"), não só a cor; abas com contagem; "atualizado há X".
- **Ajuda e textos com número tiram o número do código da regra**, nunca digitado à mão: mudou a regra, o texto muda.
- **Quem votou "fica" pode tirar o item depois.** Remova inteiro (tela, API, migration), não só o card.
- **Cache e build:** arquivo sem hash no nome fica horas no aparelho; `?v=<sha do conteúdo>`. Se o deploy sai de
  outra pasta que o desenvolvimento, refaça o build lá (fim de linha muda o hash).
- **Falha calada é a pior.** Toda integração ganha um sinal de saúde visível; todo envio confere o retorno.

## Arquivos desta skill

- `scripts/auditar.mjs`: contagem dos sinais por arquivo (só leitura; `--json` pra comparar antes e depois).
- `references/sinais.md`: cada sinal, como achar, o que é exceção. Leia no passo 1.
- `references/substituicoes.md`: o que pôr no lugar de cada sinal, a base de componentes e as regras de texto.
  Leia no passo 7 ou no Modo B.
- `assets/tokens.css`: tokens OKLCH (claro, escuro, estados, categorias, marca por cliente) pra copiar.
