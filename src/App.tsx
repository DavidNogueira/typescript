import { RecipeList } from './components/RecipeList'
import { recipes } from './data/recipes'

// O App não tem props, por isso não precisa de nenhum tipo.
// Os tipos só aparecem onde há informação a "passar a fronteira"
// entre partes do código.
function App() {
  return (
    <main className="min-h-screen bg-stone-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-bold text-stone-900">As minhas receitas</h1>
        <RecipeList recipes={recipes} />
      </div>
    </main>
  )
}

export default App
