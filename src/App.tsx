import { useState } from 'react'
import { RecipeForm } from './components/RecipeForm'
import { RecipeList } from './components/RecipeList'
import { recipes as initialRecipes } from './data/recipes'
import type { NewRecipe, Recipe } from './types/recipe'

function App() {
  // ── NOVO NA FEATURE 2 ──────────────────────────────────────
  // As receitas passam a ser ESTADO (podem mudar: vamos adicionar).
  // `<Recipe[]>`: "este estado é sempre um array de receitas".
  // Agora o TS impede-te de fazer, por exemplo, setRecipes('olá').
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes)

  // Esta função tem de "encaixar" no tipo da prop `onAdd` do formulário:
  //   (recipe: NewRecipe) => void
  // Se mudares o parâmetro para `(recipe: Recipe)`, o TS dá erro no
  // <RecipeForm onAdd={...}>, porque o formulário não tem id para dar.
  function handleAdd(newRecipe: NewRecipe) {
    // Aqui é o único sítio onde um NewRecipe "ganha" um id e passa a ser
    // uma Recipe completa. Exatamente o que tínhamos falado:
    // "dá-me uma receita sem id, eu transformo-a numa receita com id".
    const recipe: Recipe = { ...newRecipe, id: crypto.randomUUID() }
    setRecipes([recipe, ...recipes])
  }

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-bold text-stone-900">As minhas receitas</h1>
        <RecipeForm onAdd={handleAdd} />
        <RecipeList recipes={recipes} />
      </div>
    </main>
  )
}

export default App
