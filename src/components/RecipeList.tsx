import type { Recipe } from '../types/recipe'
import { RecipeCard } from './RecipeCard'

// Mesmo raciocínio do RecipeCard, mas agora a prop é um ARRAY de receitas.
type RecipeListProps = {
  recipes: Recipe[]
}

export function RecipeList({ recipes }: RecipeListProps) {
  // `recipes.length` só é aceite porque o TS sabe que `recipes` é um array.
  if (recipes.length === 0) {
    return <p className="text-stone-500">Ainda não tens receitas.</p>
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Repara: não precisamos de dizer que `recipe` é Recipe.
          O TS deduz isso sozinho a partir de `recipes: Recipe[]` (inferência). */}
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  )
}
