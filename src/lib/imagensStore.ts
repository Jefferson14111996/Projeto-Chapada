import { useSyncExternalStore } from "react";

export interface ImagemItem {
  id: string;
  projeto: string;
  local: string;
  tipo: string;
  date: string; // dd/mm/yyyy
  dataUrl: string; // base64 image
  nomeArquivo: string;
}

const seed: ImagemItem[] = [
  {
    id: "img-ex1",
    projeto: "Cisternas para a Vida",
    local: "Araripina",
    tipo: "Entrega",
    date: "15/03/2025",
    dataUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzRGQzNGNyIvPjxyZWN0IHg9IjUwIiB5PSIxODAiIHdpZHRoPSIxMjAiIGhlaWdodD0iODAiIHJ4PSIxMCIgZmlsbD0iI0UxRjVGRSIgb3BhY2l0eT0iMC42Ii8+PGNpcmNsZSBjeD0iMzIwIiBjeT0iODAiIHI9IjQwIiBmaWxsPSIjRkZGMTc2IiBvcGFjaXR5PSIwLjgiLz48cGF0aCBkPSJNMCAyMjAgUTIwMCAxODAgNDAwIDIyMCBMNDAwIDMwMCBMMCAzMDAgWiIgZmlsbD0iIzgxQzc4NCIgb3BhY2l0eT0iMC41Ii8+PC9zdmc+",
    nomeArquivo: "placeholder-cisternas-araripina.svg",
  },
  {
    id: "img-ex2",
    projeto: "Sementes do Sertão",
    local: "Ouricuri",
    tipo: "Oficina",
    date: "22/04/2025",
    dataUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzhENkU2MyIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE1MCIgcj0iODAiIGZpbGw9IiM1RDQwMzciIG9wYWNpdHk9IjAuNSIvPjxyZWN0IHg9IjEwMCIgeT0iMjAwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjQTE4ODdGIiByeD0iNSIvPjxjaXJjbGUgY3g9IjgwIiBjeT0iODAiIHI9IjI1IiBmaWxsPSIjRDdDQ0M4IiBvcGFjaXR5PSIwLjQiLz48L3N2Zz4=",
    nomeArquivo: "placeholder-sementes-ouricuri.svg",
  },
  {
    id: "img-ex3",
    projeto: "Mulheres da Caatinga",
    local: "Trindade",
    tipo: "Encontro",
    date: "10/02/2025",
    dataUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI0ZGOEE4MCIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNjAiIGZpbGw9IiNGRjUyNTIiIG9wYWNpdHk9IjAuNCIvPjxjaXJjbGUgY3g9IjMwMCIgY3k9IjIwMCIgcj0iODAiIGZpbGw9IiNGRjUyNTIiIG9wYWNpdHk9IjAuMyIvPjxyZWN0IHg9IjE1MCIgeT0iMjQwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRkZFQkVFIiBvcGFjaXR5PSIwLjUiIHJ4PSI1Ii8+PC9zdmc+",
    nomeArquivo: "placeholder-mulheres-trindade.svg",
  },
  {
    id: "img-ex4",
    projeto: "Quintais Produtivos",
    local: "Bodocó",
    tipo: "Capacitação",
    date: "05/01/2025",
    dataUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzY2QkI2QSIvPjxyZWN0IHg9IjUwIiB5PSIxNTAiIHdpZHRoPSIzMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjMzg4RTNDIiBvcGFjaXR5PSIwLjQiIHJ4PSIxMCIvPjxjaXJjbGUgY3g9IjgwIiBjeT0iODAiIHI9IjMwIiBmaWxsPSIjQzhFNkM5IiBvcGFjaXR5PSIwLjUiLz48Y2lyY2xlIGN4PSIzMjAiIGN5PSI5MCIgcj0iMjUiIGZpbGw9IiNDOEU2QzkiIG9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==",
    nomeArquivo: "placeholder-quintais-bodoco.svg",
  },
  {
    id: "img-ex5",
    projeto: "Juventude do Araripe",
    local: "Exu",
    tipo: "Visita Técnica",
    date: "18/03/2025",
    dataUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI0ZGRDU0RiIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE1MCIgcj0iMTAwIiBmaWxsPSIjRjU3RjE3IiBvcGFjaXR5PSIwLjMiLz48cmVjdCB4PSIxMjAiIHk9IjIwMCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iI0ZGRjhFMSIgb3BhY2l0eT0iMC42IiByeD0iOCIvPjxwYXRoIGQ9Ik0wIDI1MCBRMTAwIDIyMCAyMDAgMjUwIFQ0MDAgMjUwIEw0MDAgMzAwIEwwIDMwMCBaIiBmaWxsPSIjRjlBODI1IiBvcGFjaXR5PSIwLjQiLz48L3N2Zz4=",
    nomeArquivo: "placeholder-juventude-exu.svg",
  },
  {
    id: "img-ex6",
    projeto: "Cisternas para a Vida",
    local: "Salgueiro",
    tipo: "Entrega",
    date: "02/04/2025",
    dataUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzREQjZBQyIvPjxyZWN0IHg9IjYwIiB5PSIxNjAiIHdpZHRoPSIxMDAiIGhlaWdodD0iOTAiIHJ4PSIxMiIgZmlsbD0iI0UwRjJGMSIgb3BhY2l0eT0iMC41Ii8+PGNpcmNsZSBjeD0iMzAwIiBjeT0iNzAiIHI9IjQ1IiBmaWxsPSIjRkZGNTlEIiBvcGFjaXR5PSIwLjciLz48cGF0aCBkPSJNMCAyMzAgUTE1MCAyMDAgMzAwIDIzMCBUNDAwIDIzMCBMNDAwIDMwMCBMMCAzMDAgWiIgZmlsbD0iIzAwODk3QiIgb3BhY2l0eT0iMC40Ii8+PC9zdmc+",
    nomeArquivo: "placeholder-cisternas-salgueiro.svg",
  },
];

let imagens: ImagemItem[] = seed;

const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};
const emit = () => listeners.forEach((l) => l());

export const addImagem = (img: Omit<ImagemItem, "id">) => {
  imagens = [{ ...img, id: `img${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }, ...imagens];
  emit();
};

export const updateImagem = (id: string, patch: Partial<Omit<ImagemItem, "id" | "dataUrl" | "nomeArquivo">>) => {
  imagens = imagens.map((i) => (i.id === id ? { ...i, ...patch } : i));
  emit();
};

export const removeImagem = (id: string) => {
  imagens = imagens.filter((i) => i.id !== id);
  emit();
};

export const useImagens = () =>
  useSyncExternalStore(
    subscribe,
    () => imagens,
    () => imagens,
  );
