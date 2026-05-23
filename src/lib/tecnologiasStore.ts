import { useSyncExternalStore } from "react";

export type CategoriaTec =
  | "hidrica"
  | "saneamento"
  | "ambiente"
  | "alimentacao"
  | "energia"
  | "agroecologia"
  | "inclusao"
  | "formacao"
  | "comunicacao";

export interface Tecnologia {
  id: string;
  categoria: CategoriaTec;
  nome: string;
  quantidade: number;
  unidade: string;
  familias?: number;
  municipios: string;
  comunidades?: string;
  projetoId?: string;
  data: string;
  observacoes?: string;
}

export const CATEGORIA_ORDEM: CategoriaTec[] = [
  "hidrica",
  "saneamento",
  "energia",
  "agroecologia",
  "alimentacao",
  "inclusao",
  "formacao",
  "ambiente",
  "comunicacao",
];

export const CATEGORIAS: Record<
  CategoriaTec,
  {
    label: string;
    emoji: string;
    color: string;
    exemplos: string[];
    unidades: string[];
    mostraFamilias?: boolean;
  }
> = {
  hidrica: {
    label: "Convivência com o Semiárido e Segurança Hídrica",
    emoji: "💧",
    color: "#1A9FD4",
    exemplos: [
      "Cisternas de consumo humano",
      "Cisternas calçadão",
      "Barreiro trincheira",
      "Reuso de águas cinzas",
      "Sistemas simplificados de irrigação",
      "Captação e armazenamento de água da chuva",
      "Barragens subterrâneas",
    ],
    unidades: ["unidades"],
  },
  saneamento: {
    label: "Saneamento Rural",
    emoji: "🚿",
    color: "#4CAF50",
    exemplos: ["Banheiro redondo"],
    unidades: ["unidades"],
  },
  ambiente: {
    label: "Meio Ambiente e Restauração Ecológica",
    emoji: "🌳",
    color: "#33691E",
    exemplos: [
      "Recuperação de áreas degradadas",
      "Produção de mudas nativas",
      "Plantio de mudas",
      "Manejo sustentável da Caatinga",
    ],
    unidades: ["hectares", "unidades"],
  },
  alimentacao: {
    label: "Segurança Alimentar e Nutricional",
    emoji: "🌽",
    color: "#E65100",
    exemplos: [
      "Hortas comunitárias",
      "Beneficiamento de alimentos",
      "Produção de polpas e derivados",
    ],
    unidades: ["unidades", "famílias"],
    mostraFamilias: true,
  },
  energia: {
    label: "Energias Renováveis",
    emoji: "⚡",
    color: "#F5A623",
    exemplos: [
      "Sistemas fotovoltaicos para produção agrícola",
      "Energia solar residencial",
      "Bombeamento solar",
      "Biodigestores",
    ],
    unidades: ["unidades"],
  },
  agroecologia: {
    label: "Agroecologia e Produção Sustentável",
    emoji: "🌱",
    color: "#2E7D32",
    exemplos: [
      "Quintais produtivos agroecológicos",
      "Sistemas agroflorestais (SAFs)",
      "Adubação verde",
      "Compostagem",
      "Biofertilizantes",
      "Produção agroecológica da mandioca",
      "Bancos comunitários de sementes crioulas",
      "Manejo ecológico do solo",
    ],
    unidades: ["unidades", "hectares", "famílias"],
    mostraFamilias: true,
  },
  inclusao: {
    label: "Inclusão Socioprodutiva e Economia Solidária",
    emoji: "🤝",
    color: "#7B1FA2",
    exemplos: [
      "Casas de farinha",
      "Agroindústrias familiares",
      "Apicultura sustentável",
      "Comercialização coletiva",
      "Grupos produtivos de mulheres e juventudes",
      "Feiras agroecológicas",
    ],
    unidades: ["unidades", "famílias"],
    mostraFamilias: true,
  },
  formacao: {
    label: "Formação, ATER e Gestão Social",
    emoji: "📚",
    color: "#1565C0",
    exemplos: [
      "Diagnóstico Rural Participativo (DRP)",
      "Intercâmbios de experiências",
      "Formação de agentes multiplicadores",
      "Dias de campo",
      "Planejamento participativo comunitário",
    ],
    unidades: ["unidades"],
  },
  comunicacao: {
    label: "Comunicação Popular e Mobilização Social",
    emoji: "📻",
    color: "#C62828",
    exemplos: [
      "Programas de rádio",
      "Produção de vídeos populares",
      "Sistematização de experiências",
    ],
    unidades: ["unidades"],
  },
};

let tecnologias: Tecnologia[] = [
  { id: "t1", categoria: "hidrica", nome: "Cisternas de placa", quantidade: 48, unidade: "unidades", municipios: "Araripina, Ouricuri", projetoId: "2", data: "2024-09-12" },
  { id: "t2", categoria: "hidrica", nome: "Cisternas calçadão", quantidade: 22, unidade: "unidades", municipios: "Bodocó, Granito", projetoId: "2", data: "2024-11-05" },
  { id: "t3", categoria: "saneamento", nome: "Banheiro Redondo", quantidade: 30, unidade: "unidades", municipios: "Trindade", projetoId: "1", data: "2025-01-20" },
  { id: "t4", categoria: "ambiente", nome: "Plantio de mudas nativas", quantidade: 12, unidade: "hectares", municipios: "Exu, Moreilândia", projetoId: "3", data: "2024-07-18" },
  { id: "t5", categoria: "alimentacao", nome: "Quintais produtivos", quantidade: 65, unidade: "unidades", familias: 65, municipios: "Trindade, Ouricuri", projetoId: "5", data: "2024-05-10" },
  { id: "t6", categoria: "alimentacao", nome: "Hortas comunitárias", quantidade: 8, unidade: "unidades", familias: 120, municipios: "Araripina", projetoId: "1", data: "2025-02-22" },

  // Energias Renováveis
  { id: "t7", categoria: "energia", nome: "Sistemas fotovoltaicos para produção agrícola", quantidade: 1, unidade: "unidades", municipios: "Araripina", projetoId: "1", data: "2024-10-05" },
  { id: "t8", categoria: "energia", nome: "Energia solar residencial", quantidade: 1, unidade: "unidades", municipios: "Ouricuri", projetoId: "1", data: "2024-11-15" },

  // Agroecologia e Produção Sustentável
  { id: "t9", categoria: "agroecologia", nome: "Quintais produtivos agroecológicos", quantidade: 20, unidade: "unidades", familias: 20, municipios: "Araripina", projetoId: "1", data: "2024-08-20" },
  { id: "t10", categoria: "agroecologia", nome: "Sistemas agroflorestais (SAFs)", quantidade: 5, unidade: "hectares", municipios: "Trindade", projetoId: "1", data: "2024-09-10" },
  { id: "t11", categoria: "agroecologia", nome: "Bancos comunitários de sementes crioulas", quantidade: 3, unidade: "unidades", municipios: "Ouricuri", projetoId: "1", data: "2025-01-12" },

  // Inclusão Socioprodutiva e Economia Solidária
  { id: "t12", categoria: "inclusao", nome: "Grupos produtivos de mulheres e juventudes", quantidade: 4, unidade: "grupos", municipios: "Araripina", projetoId: "3", data: "2024-06-18" },
  { id: "t13", categoria: "inclusao", nome: "Feiras agroecológicas", quantidade: 2, unidade: "feiras", municipios: "Trindade", projetoId: "5", data: "2024-07-22" },
  { id: "t14", categoria: "inclusao", nome: "Apicultura sustentável", quantidade: 10, unidade: "unidades", municipios: "Bodocó", projetoId: "1", data: "2024-10-30" },

  // Formação, ATER e Gestão Social
  { id: "t15", categoria: "formacao", nome: "Dias de campo", quantidade: 5, unidade: "eventos", municipios: "Araripina", projetoId: "1", data: "2024-09-25" },
  { id: "t16", categoria: "formacao", nome: "Intercâmbios de experiências", quantidade: 3, unidade: "eventos", municipios: "Ouricuri", projetoId: "3", data: "2024-11-08" },
  { id: "t17", categoria: "formacao", nome: "Diagnóstico Rural Participativo (DRP)", quantidade: 2, unidade: "eventos", municipios: "Trindade", projetoId: "5", data: "2024-05-14" },

  // Comunicação Popular
  { id: "t18", categoria: "comunicacao", nome: "Programas de rádio", quantidade: 12, unidade: "programas", municipios: "Araripina", projetoId: "1", data: "2024-12-01" },
  { id: "t19", categoria: "comunicacao", nome: "Produção de vídeos populares", quantidade: 4, unidade: "vídeos", municipios: "Ouricuri", projetoId: "3", data: "2025-01-20" },

  // Meio Ambiente — adicionais
  { id: "t20", categoria: "ambiente", nome: "Recuperação de áreas degradadas", quantidade: 8, unidade: "hectares", municipios: "Bodocó", projetoId: "3", data: "2024-08-12" },
  { id: "t21", categoria: "ambiente", nome: "Manejo sustentável da Caatinga", quantidade: 15, unidade: "hectares", municipios: "Exu", projetoId: "1", data: "2024-09-28" },

  // Segurança Alimentar — adicionais
  { id: "t22", categoria: "alimentacao", nome: "Beneficiamento de alimentos", quantidade: 2, unidade: "unidades", municipios: "Araripina", projetoId: "5", data: "2024-10-17" },
  { id: "t23", categoria: "alimentacao", nome: "Produção de polpas e derivados", quantidade: 1, unidade: "unidades", municipios: "Trindade", projetoId: "5", data: "2024-11-22" },
];

const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const emit = () => listeners.forEach((l) => l());

export const addTecnologia = (t: Omit<Tecnologia, "id">): string => {
  const id = `t${Date.now()}`;
  tecnologias = [{ ...t, id }, ...tecnologias];
  emit();
  return id;
};

export const updateTecnologia = (id: string, t: Omit<Tecnologia, "id">) => {
  tecnologias = tecnologias.map((it) => (it.id === id ? { ...t, id } : it));
  emit();
};

export const deleteTecnologia = (id: string) => {
  tecnologias = tecnologias.filter((it) => it.id !== id);
  emit();
};

export const useTecnologias = () =>
  useSyncExternalStore(
    subscribe,
    () => tecnologias,
    () => tecnologias,
  );

export const getTotalTecnologias = () =>
  tecnologias.reduce((acc, t) => acc + (Number(t.quantidade) || 0), 0);

export const useTotalTecnologias = () => {
  const list = useTecnologias();
  return list.reduce((acc, t) => acc + (Number(t.quantidade) || 0), 0);
};
