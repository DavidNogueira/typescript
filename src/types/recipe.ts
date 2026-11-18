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

  // ── NOVO NA FEATURE 2 ──────────────────────────────────────
  // O `?` torna o campo OPCIONAL: uma receita pode ter notas ou não.
  //
  // PORQUE OPCIONAL E NÃO `notes: string`?
  // Porque muitas receitas não têm notas. Sem o `?` terias de escrever
  // `notes: ''` em todas, um valor "falso" só para calar o TS (lembra-te
  // da conversa do id vazio).
  //
  // Na prática `notes?: string` significa "o campo pode nem existir,
  // e se existir é uma string". Quando o leres, o TS diz que o tipo é
  // `string | undefined` e obriga-te a lidar com o caso de não existir.
  notes?: string
}

// ── NOVO NA FEATURE 2 ────────────────────────────────────────
// Uma receita acabada de criar no formulário ainda NÃO tem id
// (o id só é gerado quando a guardamos). É a conversa que tivemos!
//
// PORQUE AQUI E NÃO NO FORMULÁRIO?
// Porque é usado em dois sítios: o formulário (que o produz) e o App
// (que o recebe e lhe dá um id). Lembra-te da regra: quando mais de
// um sítio precisa de um tipo, ele vai para um ficheiro partilhado.
export type NewRecipe = Omit<Recipe, 'id'>
