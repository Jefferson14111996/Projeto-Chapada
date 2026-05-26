import { useSyncExternalStore } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DIRECTORY, userNameByEmail } from "./usersDirectory";

export type EntityType = "projeto" | "atividade" | "imagem" | "tecnologia";

export interface Collaborator {
  email: string;
  name: string;
}

export interface Ownership {
  ownerEmail: string;
  ownerName: string;
  allowAll: boolean;
  collaborators: Collaborator[];
}

const STORAGE_KEY = "chapada.ownership.v2";
const SEED_FLAG = "chapada.ownership.seeded.v2";

type Map = Record<string, Ownership>;

const keyOf = (t: EntityType, id: string) => `${t}:${id}`;

const load = (): Map => {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
};

let map: Map = load();
const listeners = new Set<() => void>();
const persist = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  }
};
const emit = () => {
  persist();
  listeners.forEach((l) => l());
};

const sub = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};

export const setOwnership = (t: EntityType, id: string, o: Ownership) => {
  map = { ...map, [keyOf(t, id)]: o };
  emit();
};

export const updateOwnership = (
  t: EntityType,
  id: string,
  patch: Partial<Ownership>,
) => {
  const k = keyOf(t, id);
  const cur = map[k];
  if (!cur) return;
  map = { ...map, [k]: { ...cur, ...patch } };
  emit();
};

export const removeOwnership = (t: EntityType, id: string) => {
  const k = keyOf(t, id);
  if (!map[k]) return;
  const next = { ...map };
  delete next[k];
  map = next;
  emit();
};

export const getOwnership = (t: EntityType, id: string): Ownership | undefined =>
  map[keyOf(t, id)];

export const canEdit = (
  t: EntityType,
  id: string,
  email?: string | null,
): boolean => {
  const o = map[keyOf(t, id)];
  if (!o) return true; // unowned (shouldn't happen after seed)
  if (!email) return false;
  const e = email.toLowerCase();
  if (o.ownerEmail.toLowerCase() === e) return true;
  if (o.allowAll) return true;
  return o.collaborators.some((c) => c.email.toLowerCase() === e);
};

export const useOwnership = (t: EntityType, id: string): Ownership | undefined =>
  useSyncExternalStore(
    sub,
    () => map[keyOf(t, id)],
    () => undefined,
  );

export const denyToast = () =>
  toast.error(
    "⚠️ Você não tem permissão para realizar esta ação. Apenas o criador ou colaboradores autorizados podem editar ou excluir este registro.",
  );

export const makeOwnership = (
  email: string,
  name?: string,
): Ownership => ({
  ownerEmail: email.toLowerCase(),
  ownerName: name || userNameByEmail(email),
  allowAll: false,
  collaborators: [],
});

// ---- Seeding ----
const E = {
  teste: "teste@ongchapada.org.br",
  maria: "maria@chapada.org.br",
  jose: "jose.pedro@chapada.org.br",
  ana: "ana@chapada.org.br",
  carlos: "carlos@chapada.org.br",
  lucia: "lucia@chapada.org.br",
};

const own = (email: string): Ownership => makeOwnership(email);

export const seedOwnership = async () => {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(SEED_FLAG)) return;

  try {
    const seed: Map = { ...map };

    // 1. Resolver Projetos
    const { data: dbProjs } = await supabase.from("projetos").select("id, nome");
    const projOwners: Record<string, string> = {
      "Sementes do Sertão": E.teste,
      "Cisternas para a Vida": E.teste,
      "Mulheres da Caatinga": E.maria,
      "Juventude do Araripe": E.jose,
      "Quintais Produtivos": E.ana,
    };

    const projIdToOwner: Record<string, string> = {};

    if (dbProjs) {
      dbProjs.forEach((p) => {
        const ownerEmail = projOwners[p.nome] || E.carlos;
        seed[keyOf("projeto", p.id)] = own(ownerEmail);
        projIdToOwner[p.id] = ownerEmail;
      });
    }

    // 2. Resolver Atividades
    const { data: dbAtvs } = await supabase
      .from("atividades")
      .select("id, projeto_id")
      .order("data", { ascending: false });

    if (dbAtvs) {
      dbAtvs.forEach((a, idx) => {
        const ownerEmail =
          idx < 3
            ? E.teste
            : (a.projeto_id ? projIdToOwner[a.projeto_id] : E.carlos) || E.carlos;
        seed[keyOf("atividade", a.id)] = own(ownerEmail);
      });
    }

    // 3. Resolver Tecnologias (projeto_tecnologias)
    const { data: dbTechs } = await supabase
      .from("projeto_tecnologias")
      .select("id, projeto_id");

    if (dbTechs) {
      dbTechs.forEach((t) => {
        const ownerEmail =
          (t.projeto_id ? projIdToOwner[t.projeto_id] : E.carlos) || E.carlos;
        seed[keyOf("tecnologia", t.id)] = own(ownerEmail);
      });
    }

    // 4. Resolver Imagens (arquivos_midia)
    const { data: dbImgs } = await supabase
      .from("arquivos_midia")
      .select("id")
      .eq("tipo_arquivo", "imagem");

    if (dbImgs) {
      dbImgs.forEach((img, idx) => {
        const ownerEmail = idx % 2 === 0 ? E.teste : E.lucia;
        seed[keyOf("imagem", img.id)] = own(ownerEmail);
      });
    }

    map = seed;
    persist();
    localStorage.setItem(SEED_FLAG, "1");
    listeners.forEach((l) => l());
  } catch (err) {
    console.error("[ownershipStore] error during seeding:", err);
  }
};

// Expose directory for collaborator lookup convenience
export { DIRECTORY };
