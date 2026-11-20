import type { BimbySpeed, BimbyStep, Recipe } from '../types/recipe'

// ═════════════════════════════════════════════════════════════
// FEATURE 4: TYPE GUARDS
//
// O PROBLEMA:
// Os dados que lemos do localStorage vêm "de fora" do TypeScript.
// Quando a app corre, os tipos já não existem (lembra-te: desaparecem
// na compilação). Por isso o TS não tem como saber se aquilo que está
// guardado é mesmo um array de Recipe. Pode não ser:
//   • alguém editou o localStorage à mão (DevTools → Application);
//   • os dados foram guardados por uma versão ANTIGA da app. Imagina que
//     tínhamos guardado receitas na feature 2: tinham `usesBimby` e não
//     `kind`. O RecipeCard rebentava ao tentar ler `recipe.kind`.
//
// A SOLUÇÃO: verificar à mão, em tempo de execução, com JavaScript
// normal (typeof, Array.isArray...). E ensinar o TS a confiar nessas
// verificações: é isso que é um "type guard".
// ═════════════════════════════════════════════════════════════


// ─────────────────────────────────────────────────────────────
// 1. O QUE É UM TYPE GUARD
//
// Repara no tipo de retorno: não é `boolean`, é `value is string[]`.
// Em tempo de execução devolve true/false, como qualquer função.
// Mas o `value is string[]` diz ao TS:
//   "se esta função devolver true, então `value` é um string[]".
//
// É NARROWING (como o typeof da feature 3), mas com uma função NOSSA.
// Quem a usar ganha o narrowing:
//
//   const x: unknown = ...
//   if (isStringArray(x)) {
//     x   // ← aqui o TS sabe que é string[]
//   }
//
// Porque é que o parâmetro é `unknown`? Porque a função serve para
// perguntar sobre QUALQUER coisa, mesmo que não saibamos o que é.
// ─────────────────────────────────────────────────────────────
function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

// ─────────────────────────────────────────────────────────────
// 2. VERIFICAR UNIÕES DE LITERAIS
//
// Para um BimbySpeed, verificamos cada possibilidade.
// Repara que estamos a escrever as velocidades OUTRA VEZ (já estão no
// tipo e no array do formulário). É mesmo um incómodo: a feature 6
// (`as const`) vai resolvê-lo.
// ─────────────────────────────────────────────────────────────
function isBimbySpeed(value: unknown): value is BimbySpeed {
  if (value === 'colher' || value === 'turbo') return true
  return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 10
}

// ─────────────────────────────────────────────────────────────
// 3. VERIFICAR UM OBJETO
//
// Com `unknown` não se pode fazer `value.description`: o TS não deixa,
// porque `value` pode ser um número, null, qualquer coisa.
// Temos de ir "provando" ao TS o que ele é, passo a passo:
//
//   typeof value === 'object'   → é um objeto... ou null!
//                                  (lembras-te: typeof null === 'object')
//   value !== null              → agora sim, é um objeto
//   'description' in value      → o objeto TEM o campo description
//                                  (o TS passa a deixar-te ler value.description,
//                                   mas o tipo dele ainda é unknown)
//   typeof value.description === 'string'  → e é uma string
//
// Para os campos OPCIONAIS, a lógica muda: aceitamos que o campo não
// exista, ou que exista com o tipo certo.
// ─────────────────────────────────────────────────────────────
function isBimbyStep(value: unknown): value is BimbyStep {
  return (
    typeof value === 'object' &&
    value !== null &&
    'description' in value && typeof value.description === 'string' &&
    'durationSeconds' in value && typeof value.durationSeconds === 'number' &&
    'speed' in value && isBimbySpeed(value.speed) &&
    // opcionais: "não existe" OU "é undefined" OU "tem o tipo certo"
    (!('temperature' in value) || value.temperature === undefined || typeof value.temperature === 'number') &&
    (!('reverse' in value) || value.reverse === undefined || typeof value.reverse === 'boolean')
  )
}

// ─────────────────────────────────────────────────────────────
// 4. O TYPE GUARD PRINCIPAL: isRecipe
//
// Verifica os campos comuns e depois, consoante o `kind`, verifica os
// steps do lado certo da união discriminada. É a feature 3 outra vez,
// mas agora a decidir sobre dados desconhecidos.
//
// Exportado: é o único que o resto da app precisa.
// ─────────────────────────────────────────────────────────────
export function isRecipe(value: unknown): value is Recipe {
  if (typeof value !== 'object' || value === null) return false

  // A partir daqui o TS sabe que `value` é um objeto (passa o rato por cima).
  const hasCommonFields =
    'id' in value && typeof value.id === 'string' &&
    'title' in value && typeof value.title === 'string' &&
    'description' in value && typeof value.description === 'string' &&
    'prepTimeMinutes' in value && typeof value.prepTimeMinutes === 'number' &&
    'servings' in value && typeof value.servings === 'number' &&
    'ingredients' in value && isStringArray(value.ingredients) &&
    (!('notes' in value) || value.notes === undefined || typeof value.notes === 'string')

  if (!hasCommonFields) return false
  if (!('kind' in value) || !('steps' in value)) return false

  if (value.kind === 'bimby') {
    return Array.isArray(value.steps) && value.steps.every(isBimbyStep)
  }
  if (value.kind === 'traditional') {
    return isStringArray(value.steps)
  }
  // Um `kind` desconhecido (ex: o antigo `usesBimby`, ou 'airfryer'): não é uma Recipe.
  return false
}
