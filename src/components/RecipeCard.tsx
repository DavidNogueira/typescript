import type { Recipe } from '../types/recipe'

// ─────────────────────────────────────────────────────────────
// PORQUE UM TIPO PARA AS PROPS?
//
// Um componente React é só uma função que recebe UM objeto (as "props").
// Sem tipo, o TypeScript não sabe o que vem lá dentro, por isso não
// te avisa se escreveres `<RecipeCard receita={...} />` (nome errado)
// ou se te esqueceres de passar a receita.
//
// PORQUE AQUI E NÃO EM types/recipe.ts?
// `Recipe` é usado na app toda, por isso vive num ficheiro próprio.
// `RecipeCardProps` só interessa a ESTE componente, por isso fica ao
// lado dele. Regra prática: o tipo vive junto de quem o usa. Só sai
// para um ficheiro partilhado quando mais de um sítio precisa dele.
// ─────────────────────────────────────────────────────────────
type RecipeCardProps = {
  // O cartão recebe a receita INTEIRA, por isso reutilizamos o tipo
  // Recipe em vez de repetir id, title, description...
  recipe: Recipe
}

// `{ recipe }: RecipeCardProps` = "o objeto das props tem o tipo
// RecipeCardProps, e eu tiro logo de lá o `recipe` (destructuring)".
// Podemos usar `export function RecipeCard({ recipe }: {recipe: Recipe})` 
// se o tipo não for usado noutro lado e tiver apenas um ou dois campos,
// mas é mais limpo criar um tipo próprio.
export function RecipeCard({ recipe }: RecipeCardProps) {
  // A partir daqui o editor SABE o que é `recipe`. Escreve `recipe.` e
  // vê o autocomplete. Escreve `recipe.titel` e vê o erro.
  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <header className="mb-3 flex items-start justify-between gap-4">
        <h2 className="text-xl font-semibold text-stone-900">{recipe.title}</h2>
        {/* usesBimby é boolean, por isso pode ser usado diretamente na condição */}
        {recipe.usesBimby && (
          <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
            Bimby
          </span>
        )}
      </header>

      <p className="mb-4 text-stone-600">{recipe.description}</p>

      <div className="mb-4 flex gap-4 text-sm text-stone-500">
        <span>⏱ {recipe.prepTimeMinutes} min</span>
        <span>🍽 {recipe.servings} pessoas</span>
      </div>

      <h3 className="mb-1 font-medium text-stone-800">Ingredientes</h3>
      <ul className="mb-4 list-inside list-disc text-sm text-stone-700">
        {/* Como ingredients é string[], o TS sabe que cada `ingredient` é string */}
        {recipe.ingredients.map((ingredient) => (
          <li key={ingredient}>{ingredient}</li>
        ))}
      </ul>

      <h3 className="mb-1 font-medium text-stone-800">Preparação</h3>
      <ol className="list-inside list-decimal space-y-1 text-sm text-stone-700">
        {recipe.steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>

      {/* NOVO NA FEATURE 2:
          `recipe.notes` é `string | undefined` (passa o rato por cima).
          O `&&` garante que só mostramos o parágrafo quando as notas
          existem. Dentro do <p>, o TS já sabe que é string. */}
      {recipe.notes && (
        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">💡 {recipe.notes}</p>
      )}
    </article>
  )
}
