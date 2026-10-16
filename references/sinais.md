# Os sinais de "cara de IA": como achar e o que é exceção

O script (`scripts/auditar.mjs`) conta os sinais marcados com [script]. Os outros pedem abrir a tela.
Entregue a auditoria assim: sinal, total, os 3 a 5 piores arquivos com linha, e uma frase do efeito na tela.

## Ícone e forma
- **Emoji ou Unicode fazendo papel de ícone** [script] (⚙ ✓ 🔥 💧 ▾ ✕ ☀️). Renderiza diferente em Windows, Android
  e iPhone e grita "gerado". Exceção: seletor de emoji e conteúdo que a pessoa digitou.
- **Mapas de `<path>` copiados à mão** em vários arquivos (ícone Lucide colado): procure `d="M` repetido fora de
  um arquivo gerado de ícones.
- **O mesmo card arredondado em tudo** [script: rounded-lg/xl/2xl/3xl]: um card por item de lista, card dentro de
  card (3 níveis é comum em tela inicial e relatório). Confira na tela: lista de 30 itens com 30 cards é o sinal.
- **Sombra em tudo** [script: shadow solto]. Sombra por token (`shadow-caixa`) não conta.
- **Pílula e selo em todo canto** [script: rounded-full + text-xs]: "✨ Sugestão da IA", "🔥 quente" em todo card.
- **Faixa colorida na borda esquerda do card** [script].

## Cor
- **Muitas famílias de cor** [script: famílias do Tailwind]. Acima de 6 ou 7 famílias é sinal de acento sem
  intenção. Funil com uma cor por etapa, cada uma com luminosidade diferente, briga com tudo.
- **Hex fixo em código de tela** [script]. Fura o tema escuro e o white-label.
- **Azul ou roxo genérico como acento, degradê de fundo** [script: degradê].

## Tipografia
- **Fonte do sistema, Inter, Roboto ou Arial** [script], hierarquia só por peso.
- **Fonte da marca pedida e nunca carregada** (nome em CSS sem `@font-face`): cai em system-ui sem ninguém ver.
- **Número que dança** em coluna: tabela sem `tabular-nums`.
- **Fonte órfã** no disco que ninguém referencia (peso morto).

## Layout
- **Tudo centralizado** [script: text-center, justify-center], principalmente estado vazio e carregando com ícone
  gigante no meio.
- **Número e estatística que ninguém pediu**: KPI gigante com emoji colorido e contador animado, anel de
  porcentagem decorativo.
- **Configuração despejada no fim** num bloco "Configurar ▾".
- **Tela inicial estreita** que deixa as margens vazias no computador.

## Texto
- **Travessão** [script, sem comentário]. Também como célula vazia ("—"): troque por "–" (meia-risca)
  em tabela densa, ou "sem dado" onde couber.
- **Contraste baixo de texto**: cinza claro (tipo `slate-300/400`) em texto corrido. Meça a razão; abaixo de 4,5:1 é
  sinal (um hub interno tinha 247 textos em 2,56:1).
- **"não é X, é Y"** [script] e "deixou de ser X, agora é Y".
- **"Bem-vindo de volta!"** [script], "Torre de comando", tour com emoji por slide.
- **Rótulo**: placeholder fazendo papel de rótulo [script: placeholder vs label vs htmlFor]; formulário sem
  rótulo; rótulo comprido.
- **Nome de estado pelo que o sistema faz, não pelo que a pessoa vê** ("mudo", "webhook", "provisionando").

## Interação e acessibilidade
- **Janela do navegador** [script: confirm/alert/prompt]: parece protótipo, não dá pra estilizar e some no tema escuro.
- **Botão que é `div`/`span`/`tr` com onClick** [script], sem `role="button"` e sem teclado.
- **Alvo de toque menor que 44 px** [script: h-6/h-7/h-8 em botão]; topo inteiro com 36 px.
- **Campo com texto menor que 16 px** [script]: o iPhone dá zoom ao focar.
- **Botão só de ícone sem rótulo** (leitor de tela lê "botão").
- **Movimento**: zero, ou animação em tudo; sem `prefers-reduced-motion` [script].

## Marca e produto
- **Nome genérico** ("Central X", "Painel Pro") e **duas letras num quadrado** como logo.
- **Botão flutuante de IA** que ninguém usa, cobrindo o botão de enviar no celular.
- **Mockup com barra de status falsa.**

## Leitura do resultado
- Some por tela, não só por arquivo: o dono vê a tela. Comece pelas telas que aparecem em demonstração e pela
  moldura (menu e topo aparecem em 100% das telas).
- Rode de novo depois de cada etapa e mostre antes e depois (`--json` e compare).
