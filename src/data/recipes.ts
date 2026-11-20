// `import type`: estamos a importar SÓ um tipo, não código.
// Diz ao compilador "isto pode ser apagado no JavaScript final".
import type { Recipe } from "../types/recipe";

// `: Recipe[]` é a anotação de tipo. Diz: "esta variável é um array de Recipe".
//
// PORQUE ANOTAR AQUI? Sem a anotação o TypeScript também adivinharia o
// tipo (chama-se "inferência"), mas adivinharia a partir dos dados.
// Se te esquecesses de um campo numa receita, ele não se queixava,
// limitava-se a inferir um tipo diferente.
// Com `: Recipe[]` invertemos a lógica: os dados têm de obedecer ao
// contrato.
//
// FEATURE 3: repara que cada receita é verificada de acordo com o seu
// `kind`. Experimenta:
//   • na sopa (bimby), trocar um passo por um texto simples;
//   • no bolo (traditional), pôr `speed: 5` num passo;
//   • mudar uma velocidade para `speed: 11` ou `speed: 'rápido'`.
export const recipes: Recipe[] = [
  {
    id: "1",
    kind: "bimby",
    title: "Bolonhesa de carne",
    description:
      "Molho de bolonhesa caseiro com carne picada mista, tomate, vinho branco, louro e orégãos. Ideal para acompanhar esparguete.",
    prepTimeMinutes: 45,
    servings: 4,
    ingredients: [
      "1 cenouraaaa",
      "1/2 knorr de carne",
      "1/4 de pimento",
      "500 g de carne picada mista (vaca e porco)",
      "150 g de cebola",
      "2 dentes de alho",
      "40 g de azeite",
      "300 g de polpa de tomate",
      "50 g de vinho branco",
      "1 folha de louro",
      "1 lata pequena de cogumelos laminados (opcional)",
      "1 c. chá de sal",
      "Pimenta q.b.",
      "1 c. chá de orégãos",
    ],
    notes:
      "Servir com esparguete cozido à parte e queijo ralado. Se o molho ficar demasiado líquido, prolongar a cozedura alguns minutos sem o copo medida, colocando o cesto sobre a tampa.",
    steps: [
      {
        description: "Colocar a cebola e os alhos no copo e picar.",
        durationSeconds: 5,
        speed: 5,
      },
      {
        description: "Adicionar o azeite e refogar.",
        durationSeconds: 300,
        temperature: 120,
        speed: "colher",
      },
      {
        description:
          "Adicionar a carne picada, a cenoura, o sal e a pimenta. Envolver com a espátula para soltar a carne.",
        durationSeconds: 1800,
        speed: "colher",
        reverse: true,
      },
      {
        description:
          "Adicionar a polpa de tomate, o vinho branco, a folha de louro, pimento verde, knorr de carne. Cozinhar para apurar o molho.",
        durationSeconds: 300,
        temperature: 100,
        speed: 1,
      },
      {
        description:
          "Cozinhar a carne para apurar os sabores, com o cesto sobre a tampa em vez do copo medida.",
        durationSeconds: 1500,
        temperature: 100,
        speed: "colher",
        reverse: true,
      },
      {
        description:
          "Adicionar os orégãos e os cogumelos. Envolver e deixar apurar.",
        durationSeconds: 300,
        temperature: 100,
        speed: "colher",
        reverse: true,
      },
    ],
  },
  {
    id: "2",
    kind: "bimby",
    title: "Sopa de legumes",
    description: "Sopa cremosa e reconfortante, perfeita para o inverno.",
    prepTimeMinutes: 30,
    servings: 4,
    ingredients: [
      "2 cenouras",
      "1 batata",
      "1 courgette",
      "1 cebola",
      "Azeite q.b.",
      "Sal q.b.",
    ],
    steps: [
      {
        description: "Colocar a cebola no copo e picar.",
        durationSeconds: 5,
        speed: 5,
      },
      {
        description: "Adicionar o azeite e refogar.",
        durationSeconds: 180,
        temperature: 120,
        speed: 1,
      },
      {
        description: "Juntar os restantes legumes, água e sal e cozinhar.",
        durationSeconds: 1200,
        temperature: 100,
        speed: 1,
      },
      {
        description: "Triturar, aumentando a velocidade progressivamente.",
        durationSeconds: 60,
        speed: 10,
      },
    ],
  },
  {
    id: "3",
    kind: "traditional",
    title: "Bolo de iogurte",
    description: "O clássico bolo de iogurte, fofo e simples.",
    prepTimeMinutes: 50,
    servings: 8,
    ingredients: [
      "1 iogurte natural",
      "3 ovos",
      "2 copos de açúcar",
      "3 copos de farinha",
      "1 copo de óleo",
      "1 c. chá de fermento",
    ],
    steps: [
      "Pré-aquecer o forno a 180°C.",
      "Bater os ovos com o açúcar até ficar esbranquiçado.",
      "Juntar o iogurte e o óleo e misturar.",
      "Envolver a farinha com o fermento.",
      "Levar ao forno numa forma untada durante 40 minutos.",
    ],
    notes: "Usa o copo do iogurte como medida para os outros ingredientes.",
  },
  {
    id: "4",
    kind: "bimby",
    title: "Arroz de tomate",
    description: "Arroz malandrinho de tomate, acompanhamento perfeito.",
    prepTimeMinutes: 25,
    servings: 4,
    ingredients: [
      "250 g de arroz",
      "1 lata de tomate pelado",
      "1 cebola",
      "2 dentes de alho",
      "700 g de água",
      "Azeite q.b.",
    ],
    steps: [
      { description: "Picar a cebola e o alho.", durationSeconds: 5, speed: 5 },
      {
        description: "Juntar o azeite e refogar.",
        durationSeconds: 300,
        temperature: 120,
        speed: 1,
      },
      {
        description: "Adicionar o tomate e triturar.",
        durationSeconds: 10,
        speed: 7,
      },
      {
        description: "Juntar a água e o arroz e cozinhar.",
        durationSeconds: 900,
        temperature: 100,
        speed: "colher",
        reverse: true,
      },
    ],
  },
];
