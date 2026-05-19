import { useSyncExternalStore } from "react";
import { atividadesMock, type Atividade } from "./mockData";

export interface AtividadeIndicadores {
  participantes?: number;
  mulheres?: number;
  jovens?: number;
  quilombolas?: number;
  povosOriginarios?: number;
  comunidadesTradicionais?: number;
  tecnologiasSociais?: number;
}

export interface AtividadeFull extends Atividade {
  municipio?: string;
  anexos?: { nome: string; dataUrl: string }[];
  indicadores?: AtividadeIndicadores;
}

let atividades: AtividadeFull[] = [...atividadesMock];

const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const emit = () => listeners.forEach((l) => l());

export const addAtividade = (a: Omit<AtividadeFull, "id">) => {
  atividades = [{ ...a, id: `a${Date.now()}` }, ...atividades].sort((x, y) =>
    y.data.localeCompare(x.data),
  );
  emit();
};

export const useAtividades = () =>
  useSyncExternalStore(
    subscribe,
    () => atividades,
    () => atividades,
  );

export const useAtividadesIndicadores = () => {
  const list = useAtividades();
  return list.reduce(
    (acc, a) => {
      const i = a.indicadores;
      if (!i) return acc;
      acc.participantes += i.participantes ?? 0;
      acc.mulheres += i.mulheres ?? 0;
      acc.jovens += i.jovens ?? 0;
      acc.quilombolas += i.quilombolas ?? 0;
      acc.povosOriginarios += i.povosOriginarios ?? 0;
      acc.comunidadesTradicionais += i.comunidadesTradicionais ?? 0;
      acc.tecnologiasSociais += i.tecnologiasSociais ?? 0;
      return acc;
    },
    {
      participantes: 0,
      mulheres: 0,
      jovens: 0,
      quilombolas: 0,
      povosOriginarios: 0,
      comunidadesTradicionais: 0,
      tecnologiasSociais: 0,
    },
  );
};
