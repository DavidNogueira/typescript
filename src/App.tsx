import { useEffect, useState } from 'react'
import { RecipeForm } from './components/RecipeForm'
import { RecipeList } from './components/RecipeList'
import { loadRecipes, saveRecipes } from './storage/recipeStorage'
import type { NewRecipe, Recipe } from './types/recipe'

function App() {
  // ── NOVO NA FEATURE 2 ──────────────────────────────────────
  // As receitas passam a ser ESTADO (podem mudar: vamos adicionar).
  // `<Recipe[]>`: "este estado é sempre um array de receitas".
  // Agora o TS impede-te de fazer, por exemplo, setRecipes('olá').
  //
  // ── FEATURE 4 ──────────────────────────────────────────────
  // Repara: passamos `loadRecipes` (a FUNÇÃO), não `loadRecipes()`.
  // O useState aceita as duas coisas. O tipo do parâmetro é, de forma
  // simplificada, `T | (() => T)`: "um valor do tipo T, OU uma função
  // que devolve um T". Uma union, mais uma vez!
  // Com a função, o React só a chama na primeira renderização, em vez
  // de ler o localStorage sempre que o componente renderiza.
  // loadRecipes without "()" is called (lazy initialization)
  const [recipes, setRecipes] = useState<Recipe[]>(loadRecipes) 

  // Sempre que `recipes` muda, guardamos no localStorage.
  // `saveRecipes` só aceita Recipe[], por isso nunca guardamos lixo.
  useEffect(() => {
    saveRecipes(recipes)
  }, [recipes])

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
