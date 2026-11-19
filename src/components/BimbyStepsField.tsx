import type { BimbySpeed } from '../types/recipe'
import { createEmptyStep, type BimbyStepFormValues } from './bimbyStepForm'

// ═════════════════════════════════════════════════════════════
// FEATURE 3: o "pedaço" do formulário para editar passos de Bimby.
//
// Separei-o do RecipeForm porque é uma parte autónoma (uma lista de
// linhas que se podem adicionar e remover) e o formulário já era grande.
//
// O tipo BimbyStepFormValues e as funções auxiliares estão em
// bimbyStepForm.ts (lê esse ficheiro primeiro).
// ═════════════════════════════════════════════════════════════


// ─────────────────────────────────────────────────────────────
// 1. AS VELOCIDADES PARA O <select>
//
// Repara num incómodo: as velocidades já estão escritas no tipo
// BimbySpeed (types/recipe.ts) e agora temos de as escrever OUTRA VEZ
// aqui, num array. Os tipos desaparecem quando a app corre, por isso
// não dá para "percorrer" um tipo para gerar as <option>.
//
// O `: BimbySpeed[]` pelo menos garante que não pomos aqui uma
// velocidade que não existe. Mas se te esqueceres de uma, o TS não diz
// nada. Na feature 6 (`as const`) vamos resolver isto de vez: escrever
// as velocidades UMA vez e DERIVAR o tipo a partir delas.
// ─────────────────────────────────────────────────────────────
const BIMBY_SPEEDS: BimbySpeed[] = ['colher', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 'turbo']


// ─────────────────────────────────────────────────────────────
// 2. DE string PARA BimbySpeed, SEM MENTIR AO TS
//
// O <select> dá-nos SEMPRE uma string: '5', 'colher'...
// Mas BimbySpeed tem o NÚMERO 5, não a string '5'.
//
// A tentação seria escrever:  event.target.value as BimbySpeed
// O `as` diz ao TS "confia em mim, isto é um BimbySpeed". Ele confia,
// e deixa de verificar. Mas seria MENTIRA: o valor real era a string '5'.
// Depois, no RecipeCard, `typeof speed === 'number'` daria false para
// '5', e a velocidade apareceria mal. Um bug que o TS não apanhava,
// porque nós o mandámos calar.
//
// Em vez disso, procuramos o valor verdadeiro na lista.
// O `.find()` devolve `BimbySpeed | undefined` (pode não encontrar!),
// e o TS obriga-nos a decidir o que fazer nesse caso: `?? 1` = "se não
// encontrares, usa 1".
// ─────────────────────────────────────────────────────────────
function parseSpeed(value: string): BimbySpeed {
  return BIMBY_SPEEDS.find((speed) => String(speed) === value) ?? 1
}


// ─────────────────────────────────────────────────────────────
// 3. AS PROPS
//
// Este componente não guarda estado: recebe os passos e avisa quem o
// usa quando mudam (outra vez uma função como prop, como o onAdd).
// ─────────────────────────────────────────────────────────────
type BimbyStepsFieldProps = {
  steps: BimbyStepFormValues[]
  onChange: (steps: BimbyStepFormValues[]) => void
}

export function BimbyStepsField({ steps, onChange }: BimbyStepsFieldProps) {
  // Substitui o passo na posição `index` por `updated`.
  function updateStep(index: number, updated: BimbyStepFormValues) {
    onChange(steps.map((step, i) => (i === index ? updated : step)))
  }

  function removeStep(index: number) {
    onChange(steps.filter((_, i) => i !== index))
  }

  const inputClass =
    'w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:border-emerald-500 focus:outline-none'
  const smallLabel = 'mb-1 block text-xs text-stone-500'

  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <fieldset key={step.key} className="space-y-2 rounded-lg border border-stone-200 p-3">
          <div className="flex items-center justify-between">
            <legend className="text-sm font-medium text-stone-700">Passo {index + 1}</legend>
            {steps.length > 1 && (
              <button type="button" onClick={() => removeStep(index)} className="text-xs text-red-600 hover:underline">
                Remover
              </button>
            )}
          </div>

          <input
            required
            placeholder="O que fazer (ex: Picar a cebola)"
            className={inputClass}
            value={step.description}
            onChange={(event) => updateStep(index, { ...step, description: event.target.value })}
          />

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div>
              <label className={smallLabel}>Min</label>
              <input type="number" min={0} className={inputClass} value={step.minutes}
                onChange={(event) => updateStep(index, { ...step, minutes: event.target.value })} />
            </div>
            <div>
              <label className={smallLabel}>Seg</label>
              <input type="number" min={0} max={59} className={inputClass} value={step.seconds}
                onChange={(event) => updateStep(index, { ...step, seconds: event.target.value })} />
            </div>
            <div>
              <label className={smallLabel}>Temp (°C)</label>
              <input type="number" min={0} max={120} className={inputClass} value={step.temperature}
                onChange={(event) => updateStep(index, { ...step, temperature: event.target.value })} />
            </div>
            <div>
              <label className={smallLabel}>Velocidade</label>
              <select
                className={inputClass}
                value={String(step.speed)}
                // event.target.value é string → parseSpeed converte com segurança
                onChange={(event) => updateStep(index, { ...step, speed: parseSpeed(event.target.value) })}
              >
                {BIMBY_SPEEDS.map((speed) => (
                  <option key={speed} value={String(speed)}>{speed}</option>
                ))}
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs text-stone-600">
            <input type="checkbox" checked={step.reverse}
              onChange={(event) => updateStep(index, { ...step, reverse: event.target.checked })} />
            Rotação inversa
          </label>
        </fieldset>
      ))}

      <button
        type="button"
        onClick={() => onChange([...steps, createEmptyStep()])}
        className="text-sm font-medium text-emerald-700 hover:underline"
      >
        + Adicionar passo
      </button>
    </div>
  )
}
