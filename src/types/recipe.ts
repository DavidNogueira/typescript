// ─────────────────────────────────────────────────────────────
// PORQUE É QUE ESTE FICHEIRO EXISTE?
//
// Uma receita aparece em vários sítios da app: nos dados (data/recipes.ts),
// no cartão (RecipeCard), na lista (RecipeList)... Se cada sítio
// "adivinhasse" a forma da receita, bastava um typo (ex: `recipe.titel`)
// para dar um bug que só vias no browser.
//
// Por isso definimos a FORMA de uma receita UMA vez, aqui, e todos os
// outros ficheiros importam-na. É um "contrato": qualquer objeto que diga
// ser uma Recipe TEM de ter exatamente estes campos, com estes tipos.
//
// Nota: este ficheiro não gera código JavaScript nenhum. Os tipos
// desaparecem quando o código é compilado. Servem só para o editor e o
// compilador te avisarem dos erros ANTES de correres a app.
// ─────────────────────────────────────────────────────────────

// `type` vs `interface`: ver src/playground/type-vs-interface.ts.
// Neste projeto usamos `type` por defeito. E é NESTE ficheiro, na
// feature 3, que vais ver porquê: quase tudo o que está abaixo
// (unions, literais) só se consegue escrever com `type`.


// ═════════════════════════════════════════════════════════════
// FEATURE 3: BIMBY vs TRADICIONAL
//
// O PROBLEMA:
// Na feature 1/2 tínhamos:
//
//   usesBimby: boolean
//   steps: string[]
//
// Mas um passo de Bimby tem tempo, temperatura e velocidade, e um passo
// tradicional é só texto. Uma primeira ideia seria:
//
//   usesBimby: boolean
//   steps: string[] | BimbyStep[]
//
// Isto NÃO resolve: o TS não sabe que os dois campos estão LIGADOS.
// Aceitaria `usesBimby: true` com passos em texto, e mesmo depois de
// verificares `if (recipe.usesBimby)`, continuaria a achar que `steps`
// pode ser qualquer um dos dois. O boolean não "diz" nada sobre os passos.
//
// A SOLUÇÃO: uma "discriminated union" (união discriminada).
// Em vez de UMA receita com campos "talvez", temos DOIS tipos de receita
// bem definidos, e um campo (`kind`) que diz qual deles é.
// ═════════════════════════════════════════════════════════════


// ─────────────────────────────────────────────────────────────
// 1. LITERAL TYPES + UNION
//
// `'colher'` aqui não é uma string qualquer: é um TIPO que só aceita
// exatamente o texto 'colher'. O mesmo para 1, 2, 3...
// O `|` junta-os: "a velocidade é UM destes valores, e mais nenhum".
//
// PORQUE NÃO `speed: number`?
// Porque deixaria passar 37, -2 ou 3.14. A Bimby não tem essas
// velocidades. Assim o TS só aceita velocidades que existem.
//
// Repara que a union mistura strings e números. Isso vai ser útil no
// RecipeCard para mostrar "vel 5" vs "vel colher" (ver formatSpeed).
// ─────────────────────────────────────────────────────────────
export type BimbySpeed = 'colher' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 'turbo'

// ─────────────────────────────────────────────────────────────
// 2. A FORMA DE UM PASSO DE BIMBY
// ─────────────────────────────────────────────────────────────
export type BimbyStep = {
  description: string
  // Em segundos e não em "texto" ('3 min'), para podermos fazer contas
  // (ex: somar o tempo total). Formatamos só na hora de mostrar.
  durationSeconds: number
  // Opcional: picar ou triturar não aquece.
  temperature?: number
  speed: BimbySpeed
  // Opcional: só alguns passos usam a rotação inversa.
  reverse?: boolean
}

// ─────────────────────────────────────────────────────────────
// 3. O QUE É COMUM A TODAS AS RECEITAS
//
// Em vez de repetir estes campos nos dois tipos de receita, ficam aqui.
// Não é exportado: ninguém fora deste ficheiro precisa dele.
// ─────────────────────────────────────────────────────────────
type RecipeBase = {
  id: string
  title: string
  description: string
  prepTimeMinutes: number
  servings: number
  ingredients: string[]
  notes?: string
}

// ─────────────────────────────────────────────────────────────
// 4. OS DOIS "SABORES" DE RECEITA
//
// `&` (interseção, como no playground): "tudo o que está em RecipeBase
// E mais isto".
//
// O campo `kind` é o DISCRIMINANTE. Repara no tipo: não é `string`,
// é o literal 'bimby' (ou 'traditional'). Cada tipo de receita tem o
// seu valor fixo, e é isso que permite ao TS distingui-las.
// ─────────────────────────────────────────────────────────────
export type BimbyRecipe = RecipeBase & {
  kind: 'bimby'
  steps: BimbyStep[]
}

export type TraditionalRecipe = RecipeBase & {
  kind: 'traditional'
  steps: string[]
}

// ─────────────────────────────────────────────────────────────
// 5. A UNIÃO DISCRIMINADA
//
// "Uma Recipe é uma BimbyRecipe OU uma TraditionalRecipe."
//
// O resto da app continua a usar só `Recipe`, como até aqui.
// A magia acontece quando escreves:
//
//   if (recipe.kind === 'bimby') {
//     recipe.steps   // ← o TS SABE que é BimbyStep[]
//   } else {
//     recipe.steps   // ← o TS SABE que é string[]
//   }
//
// A isto chama-se NARROWING ("estreitar"): ao verificar o `kind`, o TS
// estreita a Recipe para o tipo concreto. Vê no RecipeCard.
// ─────────────────────────────────────────────────────────────
export type Recipe = BimbyRecipe | TraditionalRecipe

// Em vez de escrever outra vez 'bimby' | 'traditional', perguntamos à
// Recipe que valores pode ter o `kind` dela. Se um dia acrescentares um
// terceiro tipo de receita, isto atualiza-se sozinho.
// (Lê-se: "o tipo do campo kind da Recipe".)
export type RecipeKind = Recipe['kind']

// ─────────────────────────────────────────────────────────────
// 6. NewRecipe: CUIDADO COM O Omit EM UNIÕES!
//
// Na feature 2 tínhamos `Omit<Recipe, 'id'>`. Agora que Recipe é uma
// união, isso já NÃO funciona como esperado: o Omit "achata" a união
// num só objeto e perde a ligação entre `kind` e `steps` (voltávamos
// ao problema do boolean!).
//
// Por isso aplicamos o Omit a CADA lado da união, separadamente.
// (Vamos voltar a este detalhe na feature 5, com os utility types.)
// ─────────────────────────────────────────────────────────────
export type NewRecipe = Omit<BimbyRecipe, 'id'> | Omit<TraditionalRecipe, 'id'>
