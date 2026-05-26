import { useSyncExternalStore, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type NotificationType =
  | "atividade"
  | "projeto"
  | "imagem"
  | "tecnologia"
  | "mensagem";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body?: string;
  createdAt: number;
  read: boolean;
  from?: string; // sender name for messages
}

let items: AppNotification[] = [];

const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};
const emit = () => listeners.forEach((l) => l());

function rowToNotification(row: any): AppNotification {
  return {
    id: row.id,
    type: (row.tipo as NotificationType) || "mensagem",
    title: row.titulo ?? "",
    body: row.mensagem ?? "",
    createdAt: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
    read: row.lida ?? false,
    from: row.remetente ?? undefined,
  };
}

let fetchPromise: Promise<void> | null = null;

export const fetchNotifications = async () => {
  if (fetchPromise) return fetchPromise;

  fetchPromise = (async () => {
    try {
      const { data, error } = await supabase
        .from("notificacoes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("[NotificationsStore] error loading from Supabase:", error);
        return;
      }

      if (data) {
        items = data.map(rowToNotification);
        emit();
      }
    } catch (err) {
      console.error("[NotificationsStore] exception loading notifications:", err);
    } finally {
      fetchPromise = null;
    }
  })();

  return fetchPromise;
};

export const addNotification = async (n: Omit<AppNotification, "id" | "createdAt" | "read">) => {
  try {
    // Busca todos os perfis cadastrados para enviar a notificação para todos os membros da equipe
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id");

    if (profilesError) throw profilesError;

    if (profiles && profiles.length > 0) {
      const inserts = profiles.map((p) => ({
        usuario_id: p.id,
        titulo: n.title,
        mensagem: n.body || "",
        tipo: n.type,
        remetente: n.from || null,
        lida: false,
      }));

      const { error } = await supabase.from("notificacoes").insert(inserts);
      if (error) throw error;
    }
  } catch (err) {
    console.error("[NotificationsStore] error adding notification:", err);
  }
};

export const markAllRead = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("notificacoes")
      .update({ lida: true })
      .eq("usuario_id", user.id);

    if (error) throw error;
    await fetchNotifications();
  } catch (err) {
    console.error("[NotificationsStore] error marking read:", err);
  }
};

export const clearAll = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("notificacoes")
      .delete()
      .eq("usuario_id", user.id);

    if (error) throw error;
    await fetchNotifications();
  } catch (err) {
    console.error("[NotificationsStore] error clearing notifications:", err);
  }
};

export const useNotifications = () => {
  useEffect(() => {
    fetchNotifications();

    // Ouvir atualizações em tempo real das notificações da tabela public.notificacoes
    const channel = supabase
      .channel("notificacoes-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notificacoes" },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => items,
    () => items,
  );
};
