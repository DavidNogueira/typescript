import { recipes as exampleRecipes } from '../data/recipes'
import type { Recipe } from '../types/recipe'
import { isRecipe } from '../validation/recipeGuards'

// ═════════════════════════════════════════════════════════════
// FEATURE 4: LER E GUARDAR RECEITAS NO localStorage
//
// O localStorage só guarda TEXTO. Por isso:
//   guardar → JSON.stringify(receitas)  (array → texto)
//   ler     → JSON.parse(texto)         (texto → ???)
//
// O "???" é o problema central desta feature.
// ═════════════════════════════════════════════════════════════

const STORAGE_KEY = 'recipes'

export function saveRecipes(recipes: Recipe[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes))
}

// O tipo de retorno `: Recipe[]` é uma PROMESSA a quem chama esta
// função: "devolvo-te SEMPRE um array de receitas válidas".
// Tudo o que está lá dentro serve para cumprir essa promessa.
export function loadRecipes(): Recipe[] {
  // ─────────────────────────────────────────────────────────────
  // 1. NARROWING DE null
  //
  // getItem devolve `string | null` (passa o rato por cima):
  // null quando ainda não há nada guardado (ex: primeira visita).
  // O TS não deixa usar `raw` como string sem tratares o null primeiro.
  // ─────────────────────────────────────────────────────────────
  const raw = localStorage.getItem(STORAGE_KEY)
  console.log('raw>>>', raw)
  if (raw === null) {
    return exampleRecipes
  }
  // Aqui o TS já sabe que `raw` é string.

  // ─────────────────────────────────────────────────────────────
  // 2. any vs unknown: A PARTE MAIS IMPORTANTE DESTA FEATURE
  //
  // JSON.parse devolve `any`. `any` significa "desliga o TypeScript":
  // podes fazer o que quiseres com o valor, e o TS não verifica NADA.
  //
  //   const data = JSON.parse(raw)   // data: any
  //   data.foo.bar.baz()             // ✅ o TS aceita... e rebenta no browser
  //   const r: Recipe[] = data       // ✅ o TS aceita... mesmo que seja lixo
  //
  // Por isso anotamos `: unknown`. `unknown` significa "não sei o que
  // é, por isso NÃO te deixo fazer nada até provares o que é":
  //
  //   const data: unknown = JSON.parse(raw)
  //   data.foo                       // ❌ erro
  //   const r: Recipe[] = data       // ❌ erro
  //
  // Os dois aceitam qualquer valor. A diferença:
  //   any     → "confia em tudo"    (o TS deixa de te proteger)
  //   unknown → "não confies em nada" (o TS obriga-te a verificar)
  //
  // Regra prática: quando não sabes o tipo de algo, usa `unknown`.
  // ─────────────────────────────────────────────────────────────
  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch (error) {
    // ───────────────────────────────────────────────────────────
    // 3. O ERRO DE UM catch TAMBÉM É unknown
    //
    // Em JavaScript pode-se fazer `throw` de QUALQUER coisa (um texto,
    // um número...), não só de objetos Error. Por isso o TS diz que
    // `error` é unknown. Para usar `error.message` temos de provar que
    // é um Error: `instanceof` é outra forma de narrowing.
    // ───────────────────────────────────────────────────────────
    const message = error instanceof Error ? error.message : String(error)
    console.warn('Dados guardados não são JSON válido:', message)
    return exampleRecipes
  }

  // ─────────────────────────────────────────────────────────────
  // 4. USAR OS TYPE GUARDS
  //
  // Array.isArray faz narrowing: depois disto, `data` é um array.
  // ─────────────────────────────────────────────────────────────
  if (!Array.isArray(data)) {
    console.warn('Dados guardados não são uma lista. A usar as receitas de exemplo.')
    return exampleRecipes
  }

  // ⚠️ ARMADILHA: passa o rato por cima de `data` na linha abaixo.
  // O Array.isArray transformou o nosso `unknown` em `any[]`!
  // (É assim que ele está definido nos tipos do próprio TypeScript.)
  // Um `any` "escondido" desliga as verificações sem darmos conta.
  // Por isso voltamos a pô-lo em `unknown[]`: "é um array, mas não sei
  // o que tem lá dentro". Aqui não é preciso `as`: qualquer array
  // é aceite como unknown[].
  const items: unknown[] = data

  // Um pormenor bonito: como isRecipe é um type guard (`value is Recipe`),
  // o `.filter` percebe-o e devolve Recipe[] em vez de unknown[].
  // Passa o rato por cima de `validRecipes`.
  // Experimenta trocar o tipo de retorno do isRecipe para `boolean`
  // e vê o erro que aparece no `return validRecipes`.
  const validRecipes = items.filter(isRecipe)

  const discarded = items.length - validRecipes.length
  if (discarded > 0) {
    console.warn(`${discarded} receita(s) inválida(s) foram ignoradas.`)
  }

  return validRecipes
}
