// ═════════════════════════════════════════════════════════════
// FEATURE 1.1 — LABORATÓRIO: `type` vs `interface`
//
// Este ficheiro NÃO é usado pela app. Serve só para experimentar.
// Passa o rato por cima dos nomes para veres o que o TS deduz.
//
// Sobre o `// @ts-expect-error`:
// é um comentário especial que diz ao TS "eu SEI que a linha seguinte
// tem um erro". Se a linha tiver mesmo erro, fica tudo OK. Se NÃO tiver,
// o TS queixa-se. Usamo-lo aqui para provar que certas coisas dão erro.
// Experimenta apagar um deles para veres a mensagem de erro real.
// ═════════════════════════════════════════════════════════════


// ─────────────────────────────────────────────────────────────
// 1. PARA DESCREVER UM OBJETO, SÃO EQUIVALENTES
// ─────────────────────────────────────────────────────────────

export type UtensilT = {
  name: string
  price: number
}

// Diferenças de sintaxe: `interface` não leva `=`.
export interface UtensilI {
  name: string
  price: number
}

// E como o TS compara FORMAS (não nomes), um é aceite onde se pede o outro:
const fromType: UtensilT = { name: 'Espátula', price: 5 }
export const asInterface: UtensilI = fromType // ✅ mesma forma, tudo bem


// ─────────────────────────────────────────────────────────────
// 2. "ACRESCENTAR CAMPOS" A UM TIPO QUE JÁ EXISTE
//    interface usa `extends`, type usa `&` (interseção)
//    O resultado é o mesmo: composição de peças, não hierarquia de classes.
// ─────────────────────────────────────────────────────────────

export interface ElectricUtensilI extends UtensilI {
  watts: number
}

export type ElectricUtensilT = UtensilT & {
  watts: number
}

export const bimby: ElectricUtensilI = { name: 'Bimby TM7', price: 1600, watts: 1500 }
export const bimby2: ElectricUtensilT = bimby // ✅ mesma forma outra vez


// ─────────────────────────────────────────────────────────────
// 3. O QUE SÓ O `type` CONSEGUE FAZER
//    Uma interface descreve SEMPRE um objeto.
//    Um type pode dar nome a QUALQUER tipo.
// ─────────────────────────────────────────────────────────────

// 3a. "Isto OU aquilo" (union) → vamos usar MUITO na feature 3
export type Difficulty = 'fácil' | 'média' | 'difícil'

export const d1: Difficulty = 'fácil' // ✅
// @ts-expect-error  → 'impossível' não é uma das opções
export const d2: Difficulty = 'impossível'

// Com interface não há forma de escrever isto:
// interface Difficulty = 'fácil' | 'média' | 'difícil'   ← nem sequer é sintaxe válida

// 3b. Dar nome a um tipo simples (só para tornar o código mais legível)
export type Minutes = number

// 3c. Tipos derivados de outros (Omit, Pick... feature 5)
export type UtensilWithoutPrice = Omit<UtensilT, 'price'>


// ─────────────────────────────────────────────────────────────
// 4. O QUE SÓ A `interface` FAZ: "declaration merging"
//    Se declarares a MESMA interface duas vezes, o TS JUNTA as duas.
// ─────────────────────────────────────────────────────────────

export interface Ingredient {
  name: string
}

// ... imagina que isto está noutro ficheiro, escrito por outro developer ...
export interface Ingredient {
  quantity: number
}

// Agora Ingredient tem name E quantity:
export const egg: Ingredient = { name: 'Ovo', quantity: 3 }

// @ts-expect-error  → falta o `quantity`, que veio da "segunda" declaração
export const flour: Ingredient = { name: 'Farinha' }

// Com `type`, declarar o mesmo nome duas vezes é simplesmente um erro:
//   type Tool = { name: string }
//   type Tool = { size: number }   ← ❌ Duplicate identifier 'Tool'
//
// Isto é BOM ou MAU?
//   • Útil para bibliotecas: permite "acrescentar" campos a tipos de outros
//     (ex: adicionar uma propriedade ao `window`).
//   • Perigoso numa app: alguém pode alterar o teu tipo sem dares conta,
//     só por usar o mesmo nome. Com `type` isso é impossível.
