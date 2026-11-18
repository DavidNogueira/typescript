import { useState, type ChangeEvent, type SubmitEvent } from 'react'
import type { NewRecipe } from '../types/recipe'

// ─────────────────────────────────────────────────────────────
// 1. AS PROPS: UMA FUNÇÃO COMO PROP
//
// O formulário não guarda receitas. Só as cria e "entrega" a quem o
// usa (o App). Para isso recebe uma função, a `onAdd`.
//
// `(recipe: NewRecipe) => void` lê-se:
//   "uma função que recebe um NewRecipe e não devolve nada (void)".
//
// PORQUE TIPAR A FUNÇÃO?
// Assim o TS garante os dois lados do "contrato":
//   • aqui dentro, só posso chamar onAdd(...) com um NewRecipe válido;
//   • no App, só posso passar uma função que aceite um NewRecipe.
// ─────────────────────────────────────────────────────────────
type RecipeFormProps = {
  onAdd: (recipe: NewRecipe) => void
}

// ─────────────────────────────────────────────────────────────
// 2. PORQUE UM TIPO DIFERENTE PARA OS VALORES DO FORMULÁRIO?
//
// Era tentador usar NewRecipe para o estado do formulário. Mas:
//   • um <input> dá-te SEMPRE uma string, mesmo com type="number".
//     Se o utilizador apagar o campo, o valor é '' (e não um número).
//   • os ingredientes são escritos numa <textarea>, como UM texto
//     com várias linhas, e não como um array.
//
// Ou seja: o que está NO FORMULÁRIO tem uma forma diferente de uma
// receita. Em vez de enganar o TS, criamos um tipo que descreve a
// verdade, e convertemos para NewRecipe só no momento de submeter.
//
// Fica neste ficheiro porque só o formulário precisa dele.
// ─────────────────────────────────────────────────────────────
type RecipeFormValues = {
  title: string
  description: string
  prepTimeMinutes: string // string! vem de um <input>
  servings: string // string! vem de um <input>
  ingredients: string // um texto, uma linha por ingrediente
  steps: string // um texto, uma linha por passo
  usesBimby: boolean // checkbox → aqui sim, boolean
  notes: string // no formulário existe sempre (pode é estar vazio)
}

const emptyValues: RecipeFormValues = {
  title: '',
  description: '',
  prepTimeMinutes: '',
  servings: '',
  ingredients: '',
  steps: '',
  usesBimby: false,
  notes: '',
}

// Pequena função auxiliar: "texto com várias linhas" → string[]
// Os tipos dos parâmetros e do retorno são o "contrato" da função. isto quer dizer que,
// se alguém mudar a função para devolver um número, o TS dá erro AQUI e não lá longe no handleSubmit.
function linesToArray(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '')
}

export function RecipeForm({ onAdd }: RecipeFormProps) {
  // ─────────────────────────────────────────────────────────────
  // 3. useState<T>
  //
  // O `<RecipeFormValues>` diz ao useState que tipo de valor guarda.
  // Neste caso até era opcional: o TS inferia o tipo a partir de
  // `emptyValues` (que já está anotado). Escrevemo-lo para ser explícito.
  //
  // Onde é OBRIGATÓRIO? Quando o valor inicial não chega para o TS
  // perceber o tipo. Exemplo clássico:
  //   useState([])           → never[]  (array de "nada", inútil!)
  //   useState<string[]>([]) → string[] ✅
  // ─────────────────────────────────────────────────────────────
  const [values, setValues] = useState<RecipeFormValues>(emptyValues)

  // ─────────────────────────────────────────────────────────────
  // 4. TIPOS DE EVENTOS
  //
  // Quando a função de onChange está escrita DIRETAMENTE no JSX
  // (como nos inputs mais abaixo), o TS sabe sozinho o tipo do evento.
  //
  // Mas quando a separamos numa função própria, como aqui, o TS já não
  // sabe onde ela vai ser usada, por isso temos de lhe dizer:
  //   ChangeEvent<HTMLInputElement> = "evento de mudança num <input>"
  //
  // O <HTMLInputElement> é importante: é por causa dele que o TS sabe
  // que `event.target.checked` existe. (Uma <textarea> não tem `checked`!)
  // ─────────────────────────────────────────────────────────────
  function handleBimbyChange(event: ChangeEvent<HTMLInputElement>) {
    setValues({ ...values, usesBimby: event.target.checked })
  }

  // SubmitEvent<HTMLFormElement> = "evento de submissão de um <form>"
  // (Em código mais antigo vais ver FormEvent; está obsoleto nas versões
  // recentes do React e o editor mostra-o riscado.)
  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault() // impede o browser de recarregar a página

    // ─────────────────────────────────────────────────────────────
    // 5. A CONVERSÃO: RecipeFormValues → NewRecipe
    //
    // Anotar `: NewRecipe` aqui é o que nos protege: se nos esquecermos
    // de converter um campo (ex: deixar servings como string) ou de
    // incluir algum, o TS dá erro AQUI, e não lá longe no RecipeCard.
    // ─────────────────────────────────────────────────────────────
    const newRecipe: NewRecipe = {
      title: values.title.trim(),
      description: values.description.trim(),
      prepTimeMinutes: Number(values.prepTimeMinutes),
      servings: Number(values.servings),
      ingredients: linesToArray(values.ingredients),
      steps: linesToArray(values.steps),
      usesBimby: values.usesBimby,
      // Se as notas estiverem vazias, '' || undefined → undefined,
      // ou seja, a receita fica "sem notas" (em vez de notas vazias).
      notes: values.notes.trim() || undefined,
    }

    onAdd(newRecipe) // entrega a receita ao App
    setValues(emptyValues) // limpa o formulário
  }

  const inputClass =
    'w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:border-emerald-500 focus:outline-none'
  const labelClass = 'mb-1 block text-sm font-medium text-stone-700'

  return (
    <form onSubmit={handleSubmit} className="mb-10 space-y-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-stone-900">Nova receita</h2>

      <div>
        <label className={labelClass} htmlFor="title">Título</label>
        <input
          id="title"
          required
          className={inputClass}
          value={values.title}
          // Função escrita diretamente no JSX: passa o rato por cima do
          // `event` e vê que o TS já sabe que é ChangeEvent<HTMLInputElement>.
          onChange={(event) => setValues({ ...values, title: event.target.value })}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="description">Descrição</label>
        <input
          id="description"
          required
          className={inputClass}
          value={values.description}
          onChange={(event) => setValues({ ...values, description: event.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="prepTime">Tempo (min)</label>
          <input
            id="prepTime"
            type="number"
            min={1}
            required
            className={inputClass}
            value={values.prepTimeMinutes}
            // Mesmo com type="number", event.target.value é string!
            onChange={(event) => setValues({ ...values, prepTimeMinutes: event.target.value })}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="servings">Pessoas</label>
          <input
            id="servings"
            type="number"
            min={1}
            required
            className={inputClass}
            value={values.servings}
            onChange={(event) => setValues({ ...values, servings: event.target.value })}
          />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="ingredients">Ingredientes (um por linha)</label>
        <textarea
          id="ingredients"
          required
          rows={4}
          className={inputClass}
          value={values.ingredients}
          // Aqui o evento é ChangeEvent<HTMLTextAreaElement> (passa o rato por cima)
          onChange={(event) => setValues({ ...values, ingredients: event.target.value })}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="steps">Passos (um por linha)</label>
        <textarea
          id="steps"
          required
          rows={4}
          className={inputClass}
          value={values.steps}
          onChange={(event) => setValues({ ...values, steps: event.target.value })}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="notes">Notas (opcional)</label>
        <textarea
          id="notes"
          rows={2}
          className={inputClass}
          value={values.notes}
          onChange={(event) => setValues({ ...values, notes: event.target.value })}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-stone-700">
        <input type="checkbox" checked={values.usesBimby} onChange={handleBimbyChange} />
        Receita Bimby
      </label>

      <button
        type="submit"
        className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700"
      >
        Adicionar receita
      </button>
    </form>
  )
}
