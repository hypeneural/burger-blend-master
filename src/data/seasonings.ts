export type SeasoningKind = "base" | "secondary" | "chef" | "accent" | "avoid";
export type SeasoningUsage = "surface" | "mix" | "finish";

export interface Seasoning {
  id: string;
  name: string;
  kind: SeasoningKind;
  usage: SeasoningUsage;
  tags: string[];
  description: string;
}

export interface SeasoningProfile {
  base: string[];
  secondary?: string[];
  chef?: string[];
  accent?: string[];
  avoid?: string[];
  notes?: string;
}

export const seasonings: Seasoning[] = [
  {
    id: "sal-fino",
    name: "Sal fino",
    kind: "base",
    usage: "surface",
    tags: ["sal", "classico"],
    description: "Distribui rapido e realca o sabor base.",
  },
  {
    id: "sal-parrilla",
    name: "Sal parrilla",
    kind: "base",
    usage: "surface",
    tags: ["sal", "crosta"],
    description: "Grao grosso que cria micro-crosta na chapa.",
  },
  {
    id: "sal-marinho",
    name: "Sal marinho",
    kind: "base",
    usage: "surface",
    tags: ["sal", "marinho"],
    description: "Salgado limpo e elegante.",
  },
  {
    id: "pimenta-do-reino",
    name: "Pimenta do reino",
    kind: "secondary",
    usage: "surface",
    tags: ["picante", "classico"],
    description: "Aroma oleoso que se espalha bem na gordura.",
  },
  {
    id: "cebola-em-po",
    name: "Cebola em po",
    kind: "secondary",
    usage: "surface",
    tags: ["umami", "doce"],
    description: "Carameliza rapido e cria sabor de burger classico.",
  },
  {
    id: "alho-em-po",
    name: "Alho em po",
    kind: "secondary",
    usage: "surface",
    tags: ["umami", "aromatico"],
    description: "Sabor concentrado sem agua na carne.",
  },
  {
    id: "alho-granulado",
    name: "Alho granulado",
    kind: "secondary",
    usage: "surface",
    tags: ["aromatico", "rustico"],
    description: "Particulas maiores para crosta mais rustica.",
  },
  {
    id: "mostarda-em-po",
    name: "Mostarda em po",
    kind: "chef",
    usage: "surface",
    tags: ["acido", "umami"],
    description: "Acidez leve que desperta o paladar.",
  },
  {
    id: "paprica-doce",
    name: "Paprica doce",
    kind: "chef",
    usage: "surface",
    tags: ["doce", "cor"],
    description: "Dourado bonito e sabor suave.",
  },
  {
    id: "paprica-defumada",
    name: "Paprica defumada",
    kind: "secondary",
    usage: "surface",
    tags: ["defumado", "bbq"],
    description: "Traz o clima de churrasqueira sem fumaca.",
  },
  {
    id: "acucar-mascavo",
    name: "Acucar mascavo",
    kind: "chef",
    usage: "surface",
    tags: ["doce", "caramelo"],
    description: "Ajuda na crosta e corta gordura pesada.",
  },
  {
    id: "cominho",
    name: "Cominho",
    kind: "chef",
    usage: "surface",
    tags: ["terroso", "bbq"],
    description: "Terroso e quente, combina com carnes intensas.",
  },
  {
    id: "pimenta-caiena",
    name: "Pimenta caiena",
    kind: "chef",
    usage: "surface",
    tags: ["picante", "calor"],
    description: "Calor para limpar o paladar de blends gordos.",
  },
  {
    id: "pimenta-chili",
    name: "Pimenta chili",
    kind: "chef",
    usage: "surface",
    tags: ["picante", "rustico"],
    description: "Picancia seca para estilo texano.",
  },
  {
    id: "cafe-em-po",
    name: "Cafe em po",
    kind: "chef",
    usage: "surface",
    tags: ["terroso", "amargo"],
    description: "Nota amarga que combina com sabor ferroso.",
  },
  {
    id: "cogumelo-em-po",
    name: "Cogumelo em po",
    kind: "chef",
    usage: "surface",
    tags: ["umami", "terroso"],
    description: "Umami elegante e profundo.",
  },
  {
    id: "tomilho",
    name: "Tomilho",
    kind: "accent",
    usage: "finish",
    tags: ["herbal", "fresco"],
    description: "Erva fresca para levantar blends densos.",
  },
  {
    id: "salvia",
    name: "Salvia",
    kind: "accent",
    usage: "finish",
    tags: ["herbal", "resinoso"],
    description: "Aromatico forte que corta gordura pesada.",
  },
  {
    id: "chimichurri-seco",
    name: "Chimichurri seco",
    kind: "accent",
    usage: "finish",
    tags: ["herbal", "tradicional"],
    description: "Herbal leve para realcar carne nobre.",
  },
  {
    id: "lemon-pepper",
    name: "Lemon pepper",
    kind: "secondary",
    usage: "finish",
    tags: ["acido", "fresco"],
    description: "Citrico para cortar gordura densa.",
  },
  {
    id: "erva-doce",
    name: "Erva-doce",
    kind: "secondary",
    usage: "mix",
    tags: ["aniz", "suino"],
    description: "Aroma classico para blends suinos.",
  },
  {
    id: "pimenta-calabresa",
    name: "Pimenta calabresa",
    kind: "chef",
    usage: "surface",
    tags: ["picante", "suino"],
    description: "Calor seco que combina com porco.",
  },
  {
    id: "raspas-citricas",
    name: "Raspas citricas",
    kind: "accent",
    usage: "finish",
    tags: ["acido", "fresco"],
    description: "Leve acidez para blends ricos.",
  },
  {
    id: "molho-ingles",
    name: "Molho ingles",
    kind: "accent",
    usage: "mix",
    tags: ["umami", "ferroso"],
    description: "Excecao controlada para fraldinha e blends ferroso.",
  },
];

export const getSeasoningById = (id: string): Seasoning | undefined =>
  seasonings.find((seasoning) => seasoning.id === id);
