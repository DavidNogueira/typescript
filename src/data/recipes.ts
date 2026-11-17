// `import type`: estamos a importar SÓ um tipo, não código.
// Diz ao compilador "isto pode ser apagado no JavaScript final".
import type { Recipe } from '../types/recipe'

// `: Recipe[]` é a anotação de tipo. Diz: "esta variável é um array de Recipe".
//
// PORQUE ANOTAR AQUI? Sem a anotação o TypeScript também adivinharia o
// tipo (chama-se "inferência"), mas adivinharia a partir dos dados.
// Se te esquecesses de um campo numa receita, ele não se queixava,
// limitava-se a inferir um tipo diferente.
// Com `: Recipe[]` invertemos a lógica: os dados têm de obedecer ao
// contrato. Experimenta apagar o `servings` de uma receita ou escrever
// `prepTimeMinutes: '30'` e vê o erro que aparece.
export const recipes: Recipe[] = [
  {
    id: '1',
    title: 'Sopa de legumes',
    description: 'Sopa cremosa e reconfortante, perfeita para o inverno.',
    prepTimeMinutes: 30,
    servings: 4,
    ingredients: ['2 cenouras', '1 batata', '1 courgette', '1 cebola', 'Azeite q.b.', 'Sal q.b.'],
    steps: [
      'Colocar a cebola no copo e picar 5 seg/vel 5.',
      'Adicionar o azeite e refogar 3 min/120°C/vel 1.',
      'Juntar os restantes legumes, água e sal e cozinhar 20 min/100°C/vel 1.',
      'Triturar 1 min/vel 5-10 progressivamente.',
    ],
    usesBimby: true,
  },
  {
    id: '2',
    title: 'Bolo de iogurte',
    description: 'O clássico bolo de iogurte, fofo e simples.',
    prepTimeMinutes: 50,
    servings: 8,
    ingredients: ['1 iogurte natural', '3 ovos', '2 copos de açúcar', '3 copos de farinha', '1 copo de óleo', '1 c. chá de fermento'],
    steps: [
      'Pré-aquecer o forno a 180°C.',
      'Bater os ovos com o açúcar até ficar esbranquiçado.',
      'Juntar o iogurte e o óleo e misturar.',
      'Envolver a farinha com o fermento.',
      'Levar ao forno numa forma untada durante 40 minutos.',
    ],
    usesBimby: false,
  },
  {
    id: '3',
    title: 'Arroz de tomate',
    description: 'Arroz malandrinho de tomate, acompanhamento perfeito.',
    prepTimeMinutes: 25,
    servings: 4,
    ingredients: ['250 g de arroz', '1 lata de tomate pelado', '1 cebola', '2 dentes de alho', '700 g de água', 'Azeite q.b.'],
    steps: [
      'Picar a cebola e o alho 5 seg/vel 5.',
      'Refogar com azeite 5 min/120°C/vel 1.',
      'Adicionar o tomate e triturar 10 seg/vel 7.',
      'Juntar a água e o arroz e cozinhar 15 min/100°C/colher inversa/vel colher.',
    ],
    usesBimby: true,
  },
]
