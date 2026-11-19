import type { BimbySpeed, BimbyStep, Recipe } from '../types/recipe'

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

// ── NOVO NA FEATURE 3 ────────────────────────────────────────
// Funções auxiliares para mostrar um passo de Bimby.
// Ficam aqui porque só o cartão as usa.

// 125 → "2 min 5 seg"
function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  if (minutes === 0) return `${seconds} seg`
  if (seconds === 0) return `${minutes} min`
  return `${minutes} min ${seconds} seg`
}

// NARROWING COM `typeof`:
// BimbySpeed é `'colher' | 1 | 2 | ... | 10 | 'turbo'`.
// Depois de `typeof speed === 'number'`, o TS sabe que dentro do `if`
// é um número (1 a 10). Fora dele, só sobram as strings 'colher' | 'turbo'.
// Passa o rato por cima do `speed` em cada linha e vê o tipo a "encolher".
function formatSpeed(speed: BimbySpeed): string {
  if (typeof speed === 'number') {
    return `vel ${speed}`
  }
  // Aqui o speed já só pode ser 'colher' | 'turbo'.
  return speed === 'colher' ? 'vel colher' : 'turbo'
}

// Um pequeno componente só para um passo de Bimby.
// Repara: recebe um BimbyStep, por isso NUNCA vai receber um passo
// tradicional (string) por engano. O TS não deixava.
function BimbyStepItem({ step }: { step: BimbyStep }) {
  const badge = 'rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-600'
  return (
    <li>
      <p>{step.description}</p>
      <div className="mt-1 flex flex-wrap gap-1">
        <span className={badge}>⏱ {formatDuration(step.durationSeconds)}</span>
        {/* temperature é opcional: `number | undefined`.
            Usamos `!== undefined` em vez de só `step.temperature &&`
            porque uma temperatura 0 seria tratada como "não existe". */}
        {step.temperature !== undefined && <span className={badge}>🌡 {step.temperature}°C</span>}
        <span className={badge}>⚙ {formatSpeed(step.speed)}</span>
        {step.reverse && <span className={badge}>↺ inversa</span>}
      </div>
    </li>
  )
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
        {recipe.kind === 'bimby' && (
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
        {recipe.ingredients.map((ingredient) => (
          <li key={ingredient}>{ingredient}</li>
        ))}
      </ul>

      <h3 className="mb-1 font-medium text-stone-800">Preparação</h3>
      {/* ═══════════════════════════════════════════════════════
          FEATURE 3: NARROWING PELA UNIÃO DISCRIMINADA

          Antes deste `if`, `recipe.steps` é `BimbyStep[] | string[]`
          (passa o rato por cima). Não podes usá-lo como nenhum dos dois.

          Depois de `recipe.kind === 'bimby'`, o TS sabe que a receita é
          uma BimbyRecipe, logo `recipe.steps` é BimbyStep[].
          No outro lado do `? :`, só pode ser TraditionalRecipe → string[].

          Experimenta: no lado tradicional, tenta usar `step.speed`.
          ═══════════════════════════════════════════════════════ */}
      {recipe.kind === 'bimby' ? (
        <ol className="list-inside list-decimal space-y-3 text-sm text-stone-700">
          {recipe.steps.map((step, index) => (
            <BimbyStepItem key={index} step={step} />
          ))}
        </ol>
      ) : (
        <ol className="list-inside list-decimal space-y-1 text-sm text-stone-700">
          {recipe.steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      )}

      {/* `recipe.notes` é `string | undefined` (campo opcional).
          O `&&` garante que só mostramos o parágrafo quando existem. */}
      {recipe.notes && (
        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">💡 {recipe.notes}</p>
      )}
    </article>
  )
}
