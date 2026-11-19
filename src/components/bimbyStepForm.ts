import type { BimbySpeed, BimbyStep } from "../types/recipe";

// ═════════════════════════════════════════════════════════════
// FEATURE 3: os valores de UM passo de Bimby no formulário.
//
// PORQUE UM FICHEIRO SÓ PARA ISTO?
// Dois ficheiros precisam destas coisas: o BimbyStepsField (que mostra
// os inputs) e o RecipeForm (que guarda o estado e converte no submit).
// Como só têm a ver com o FORMULÁRIO, não faz sentido irem para
// types/recipe.ts (que descreve receitas "a sério").
//
// (Podiam estar dentro de BimbyStepsField.tsx, mas o Vite prefere que
// ficheiros .tsx de componentes exportem SÓ componentes. Isto não tem a
// ver com TypeScript, é uma regra do recarregamento automático.)
// ═════════════════════════════════════════════════════════════

// A mesma ideia da feature 2: o que está NOS INPUTS (strings) é
// diferente de um BimbyStep (números). Por isso tem tipo próprio.
export type BimbyStepFormValues = {
  // Só para o React (`key`): identifica a linha quando se removem passos.
  // Não faz parte de uma receita, por isso NÃO existe em BimbyStep.
  key: string;
  description: string;
  minutes: string;
  seconds: string;
  temperature: string; // '' = sem temperatura
  speed: BimbySpeed; // aqui já guardamos o tipo certo (ver parseSpeed no BimbyStepsField)
  reverse: boolean;
};

export function createEmptyStep(): BimbyStepFormValues {
  return {
    key: crypto.randomUUID(),
    description: "",
    minutes: "",
    seconds: "",
    temperature: "",
    speed: 1,
    reverse: false,
  };
}

// Converte uma linha do formulário num BimbyStep "verdadeiro".
// O tipo de retorno `: BimbyStep` garante que não nos esquecemos de nada.
export function toBimbyStep(values: BimbyStepFormValues): BimbyStep {
  return {
    description: values.description.trim(),
    durationSeconds: Number(values.minutes) * 60 + Number(values.seconds),
    // '' → undefined (sem temperatura); '100' → 100
    temperature:
      values.temperature === "" ? undefined : Number(values.temperature),
    speed: values.speed,
    reverse: values.reverse,
  };
}
