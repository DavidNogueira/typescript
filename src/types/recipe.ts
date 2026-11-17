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

// `type` vs `interface`: para descrever a forma de um objeto, os dois
// fazem praticamente o mesmo. Podias escrever:
//
//   interface Recipe { id: string; title: string; ... }
//
// Neste projeto vamos usar `type` por defeito, porque mais à frente
// (feature 3) vamos precisar de coisas que só o `type` consegue fazer
// (ex: "isto OU aquilo"). Usar sempre o mesmo evita a pergunta
// "porque é que aqui é interface e ali é type?".
export type Recipe = {
  // string e não number: os ids normalmente vêm de fora (base de dados,
  // crypto.randomUUID()...) e não fazemos contas com eles.
  id: string
  title: string
  description: string

  // number: aqui sim queremos fazer contas (ex: somar tempos, ordenar).
  prepTimeMinutes: number
  servings: number

  // string[] = "um array em que cada elemento é uma string".
  // (Também se pode escrever Array<string>; é exatamente o mesmo.)
  ingredients: string[]
  steps: string[]

  // boolean: só há duas respostas possíveis, sim ou não.
  // (Na feature 3 vamos ver porque é que isto vai deixar de chegar...)
  usesBimby: boolean
}
