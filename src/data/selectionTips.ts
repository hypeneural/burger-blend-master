import type { BurgerStyle, GrindPass, GrindSize } from "@/data/constants";

export interface SelectionTip {
  title: string;
  definition: string;
  impact: string;
  recommended?: string;
  tips?: string[];
  caution?: string;
}

export const BURGER_STYLE_TIPS: Record<BurgerStyle, SelectionTip> = {
  Smash: {
    title: "Smash",
    definition: "Hamburguer prensado na chapa quente para crosta fina e crocante.",
    impact: "Maximiza Maillard e sabor tostado. Perde mais suco interno.",
    recommended: "Ideal: 20-25% gordura e moagem fina.",
    tips: ["Bolas de 80-100g", "Nao pressionar apos virar", "Sal na superficie"],
    caution: "Blend magro resseca rapido.",
  },
  Alto: {
    title: "Alto (Steak)",
    definition: "Hamburguer alto (180g+) com centro rosado e mordida suculenta.",
    impact: "Foco em suculencia e textura aerada. Ponto mal/ao ponto.",
    recommended: "Ideal: 18-22% gordura e moagem grossa.",
    tips: ["Nao apertar a carne", "Descansar 2-3 min", "Virar apenas 1x"],
  },
  Gourmet: {
    title: "Gourmet",
    definition: "Blends complexos com cortes nobres e foco em sabor sofisticado.",
    impact: "Prioriza perfil de sabor sobre textura. Permite combinacoes premium.",
    recommended: "Temperos minimalistas para nao mascarar a carne.",
    tips: ["Use 2-3 cortes no maximo", "Evite excesso de condimentos"],
  },
  Diner: {
    title: "Diner",
    definition: "Estilo lanchonete americana, textura uniforme e macia.",
    impact: "Mordida suave e consistente. Ideal para queijo derretido.",
    recommended: "Moagem dupla e mais fina. Blend de acem + peito.",
    tips: ["Disco fino 120-150g", "Pao de batata ou classico"],
  },
  Fit: {
    title: "Fit / Magro",
    definition: "Baixa gordura e alta proteina, foco em leveza.",
    impact: "Alto risco de ressecamento. Cozinhe rapido e evite bem passado.",
    recommended: "Nao passar de 15-18% gordura.",
    tips: ["Use cogumelos/cebola para umidade", "Chapa bem quente"],
    caution: "Se passar do ponto, fica seco.",
  },
  Veg: {
    title: "Veg / Plant",
    definition: "Base vegetal com leguminosas e fibras.",
    impact: "Estrutura e liga sao o desafio principal.",
    recommended: "Use ligas (farinhas, amidos) e crosta na chapa.",
    tips: ["Descansar a massa", "Fritar para criar casca"],
  },
};

export const GRIND_SIZE_TIPS: Record<GrindSize, SelectionTip> = {
  FINE: {
    title: "Fina (3mm)",
    definition: "Massa mais coesa e fechada.",
    impact: "Liga maxima. Ideal para smash e burgers finos.",
    recommended: "Use em blends com gordura alta.",
    tips: ["Evita que a carne se desfaca", "Textura mais elastica"],
  },
  MEDIUM: {
    title: "Media (5mm)",
    definition: "Equilibrio entre pedacos e liga.",
    impact: "O coringa das hamburguerias. Serve para quase tudo.",
    recommended: "Boa para chapas e burgers medios.",
    tips: ["Mantem suco entre fibras", "Boa estrutura"],
  },
  COARSE: {
    title: "Grossa (8mm)",
    definition: "Pedacos de carne visiveis.",
    impact: "Textura de steak. Mordida aerada e suculenta.",
    recommended: "Ideal para burger alto e grelha.",
    tips: ["Manipule pouco para nao esfarelar"],
    caution: "Excesso de manuseio pode quebrar o disco.",
  },
};

export const GRIND_PASS_TIPS: Record<GrindPass, SelectionTip> = {
  SINGLE: {
    title: "Simples (1x)",
    definition: "Carne passa uma unica vez no moedor.",
    impact: "Textura rustica com pedacos aparentes.",
    recommended: "Mais suculencia explosiva.",
    tips: ["Visual mais artesanal", "Sabor de carne destacado"],
  },
  DOUBLE: {
    title: "Dupla (2x)",
    definition: "Carne moida, misturada e moida novamente.",
    impact: "Homogeneidade e textura macia.",
    recommended: "Ideal para diner e blends uniformes.",
    tips: ["Cor uniforme", "Mordida mais macia"],
    caution: "Nao deixe a carne esquentar.",
  },
};

export const PREP_STYLE_TIPS: Record<string, SelectionTip> = {
  Chapa: {
    title: "Chapa",
    definition: "Calor por conducao direta em superficie plana.",
    impact: "Cozinha na propria gordura, crosta uniforme.",
    recommended: "Gordura mole (costela) funciona bem.",
    tips: ["Aqueca ate fumegar", "Nao mexa na primeira virada"],
  },
  Frigideira: {
    title: "Frigideira",
    definition: "Versao domestica da chapa.",
    impact: "Pode perder calor se for fina.",
    recommended: "Use ferro fundido e preaqueca.",
    tips: ["Aqueca bem antes de colocar a carne"],
  },
  Grelha: {
    title: "Grelha",
    definition: "Calor por radiacao e fumaca.",
    impact: "Gordura pinga no fogo, perde umidade mais rapido.",
    recommended: "Sugerir +5% gordura no blend.",
    tips: ["Use zona indireta para controle"],
  },
  Churrasqueira: {
    title: "Churrasqueira",
    definition: "Grelha com brasa e fumaca intensa.",
    impact: "Perda de gordura e risco de flare-up.",
    recommended: "Gordura dura (peito) ajuda a segurar suco.",
    tips: ["Mantenha altura da brasa", "Nao use gordura mole demais"],
  },
  Smash: {
    title: "Smash (chapa)",
    definition: "Chapa muito quente e prensagem forte.",
    impact: "Crosta intensa e burguer fino.",
    recommended: "Bolinha pequena e gordura 20-25%.",
    tips: ["Pressione apenas uma vez", "Nao tampe"],
  },
  Airfryer: {
    title: "Airfryer",
    definition: "Calor por conveccao (ar quente).",
    impact: "Seca a superficie antes do centro.",
    recommended: "Blend com gordura alta e pincel de oleo.",
    tips: ["Virar no meio do tempo", "Nao lotar a cesta"],
    caution: "Magro fica seco rapido.",
  },
};

const COMBINED_PREP_TIP: SelectionTip = {
  title: "Chapa ou grelha",
  definition: "Cozimento direto em chapa ou grelha.",
  impact: "Chapa cria crosta uniforme. Grelha perde mais gordura.",
  recommended: "Se usar grelha, aumente 2-5% de gordura.",
  tips: ["Chapa bem quente", "Grelha com zona indireta"],
};

export const getPrepStyleTip = (prepStyle?: string): SelectionTip | undefined => {
  if (!prepStyle) return undefined;
  const value = prepStyle.toLowerCase();
  if (value.includes("airfryer")) return PREP_STYLE_TIPS.Airfryer;
  if (value.includes("smash")) return PREP_STYLE_TIPS.Smash;
  if (value.includes("frigideira")) return PREP_STYLE_TIPS.Frigideira;
  if (value.includes("churrasqueira")) return PREP_STYLE_TIPS.Churrasqueira;
  if (value.includes("grelha") && value.includes("chapa")) return COMBINED_PREP_TIP;
  if (value.includes("grelha")) return PREP_STYLE_TIPS.Grelha;
  if (value.includes("chapa")) return PREP_STYLE_TIPS.Chapa;
  return undefined;
};




