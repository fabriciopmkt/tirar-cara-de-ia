# Tirar a cara de IA

Skill do Claude Code que tira o visual genérico de app feito com IA (emoji no lugar de ícone, card arredondado em
tudo, Inter, roxo com degradê, tudo centralizado, texto de robô) e ajuda a começar um produto novo que já nasce sem
ele.

O método saiu de três remakes reais: uma central pessoal, o hub interno de uma empresa e um CRM white-label pra
clínicas. Ele começa contando os sinais por arquivo, mede o ponto de partida e só depois propõe.

## O que vem dentro

- `SKILL.md`: o método em três modos (refazer um app, começar do zero, tela nova num app já refeito) e as lições
  que custaram caro.
- `scripts/auditar.mjs`: conta os sinais de "cara de IA" por arquivo e aponta onde eles mais aparecem. Só lê.
- `references/sinais.md`: cada sinal, como achar e o que conta como exceção.
- `references/substituicoes.md`: o que pôr no lugar de cada sinal, a base de componentes e as regras de texto.
- `assets/tokens.css`: tokens OKLCH prontos pra copiar (claro, escuro, estados, categorias, cor por cliente).

## Instalar

Clone direto na pasta de skills do Claude Code:

```bash
git clone https://github.com/fabriciopmkt/tirar-cara-de-ia ~/.claude/skills/tirar-cara-de-ia
```

No Windows a pasta fica em `%USERPROFILE%\.claude\skills\tirar-cara-de-ia` (o comando acima roda no Git Bash).

Depois é só pedir: "tira a cara de IA desse app", "deixa esse painel menos genérico", "vamos começar um app novo".
A skill entra sozinha, e também em inglês ("make this look less AI-generated").

Pra atualizar:

```bash
git -C ~/.claude/skills/tirar-cara-de-ia pull
```

## Usar só o script

Precisa de Node 18 ou mais novo, sem dependência.

```bash
node ~/.claude/skills/tirar-cara-de-ia/scripts/auditar.mjs ./src --top 5
```

Sai uma tabela com o total de cada sinal e os arquivos onde ele mais aparece. Com `--json` dá pra guardar o
resultado e comparar antes e depois. A contagem é heurística: número alto mostra onde olhar, e a leitura da tela
confirma.

## Licença

MIT. Feito por Fabricio Pereira.

## In English

A Claude Code skill (written in Portuguese) that strips the generic "AI-generated" look from apps, dashboards and
sites, and sets up new products so they never get it. It audits first (the bundled `scripts/auditar.mjs` counts
emoji-as-icons, rounded cards everywhere, centered layouts, color families, hard-coded hex, browser dialogs, small
tap targets and more, file by file), measures bundle weight, then moves through references, prototypes with
item-by-item voting, OKLCH tokens, one icon set, a component base, copy rules, preview and staged deploys.
Install with the `git clone` above. Claude answers in your language.
