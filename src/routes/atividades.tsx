import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Plus, Paperclip, Calendar, MapPin, User, ChevronDown, X } from "lucide-react";
import { projetosMock, formatDate, MUNICIPIOS } from "@/lib/mockData";
import { addAtividade, useAtividades } from "@/lib/atividadesStore";
import { toast } from "sonner";

export const Route = createFileRoute("/atividades")({
  head: () => ({ meta: [{ title: "Atividades — CHAPADA" }] }),
  component: AtividadesPage,
});

const PAGE_SIZE = 10;
const TIPOS = ["Oficina", "Encontro", "Entrega", "Visita Técnica", "Capacitação", "Reunião"];

interface Anexo { nome: string; dataUrl: string }

const emptyForm = {
  projetoId: "",
  data: "",
  tipo: "",
  descricao: "",
  local: "",
  municipio: "",
  responsaveis: "",
  participantes: "",
  mulheres: "",
  jovens: "",
  quilombolas: "",
  povosOriginarios: "",
  comunidadesTradicionais: "",
  tecnologiasSociais: "",
};

function AtividadesPage() {
  const ordenadas = useAtividades();
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [anexos, setAnexos] = useState<Anexo[]>([]);

  const total = ordenadas.length;
  const items = ordenadas.slice(0, visible);
  const hasMore = visible < total;
  const projetoMap = new Map(projetosMock.map((p) => [p.id, p]));

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);
    setTimeout(() => {
      setVisible((v) => Math.min(v + PAGE_SIZE, total));
      setLoading(false);
    }, 300);
  }, [loading, hasMore, total]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0]?.isIntersecting) loadMore(); },
      { rootMargin: "200px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore, hasMore]);

  const setF = (k: keyof typeof emptyForm) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const onAnexos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setAnexos((arr) => [...arr, { nome: file.name, dataUrl: String(reader.result) }]);
      reader.readAsDataURL(file);
    });
  };

  const intOrUndef = (s: string) => {
    if (!s) return undefined;
    const n = parseInt(s, 10);
    return Number.isFinite(n) && n >= 0 ? n : undefined;
  };

  const handleSave = () => {
    if (!form.projetoId || !form.data || !form.tipo || !form.descricao) {
      toast.error("Preencha Projeto, Data, Tipo de Ação e Descrição.");
      return;
    }
    addAtividade({
      projetoId: form.projetoId,
      data: form.data,
      tipo: form.tipo,
      descricao: form.descricao,
      local: form.local,
      municipio: form.municipio,
      responsaveis: form.responsaveis,
      anexos,
      indicadores: {
        participantes: intOrUndef(form.participantes),
        mulheres: intOrUndef(form.mulheres),
        jovens: intOrUndef(form.jovens),
        quilombolas: intOrUndef(form.quilombolas),
        povosOriginarios: intOrUndef(form.povosOriginarios),
        comunidadesTradicionais: intOrUndef(form.comunidadesTradicionais),
        tecnologiasSociais: intOrUndef(form.tecnologiasSociais),
      },
    });
    toast.success("Atividade registrada.");
    setForm(emptyForm);
    setAnexos([]);
    setOpen(false);
  };

  return (
    <AppLayout
      title="Registro de Atividades"
      subtitle="Histórico de ações realizadas nos projetos"
      actions={
        <Button className="gap-2" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> Nova Atividade
        </Button>
      }
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold">Atividades recentes</h3>
            <Badge variant="secondary">{items.length} de {total}</Badge>
          </div>

          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Nenhuma atividade registrada ainda.</p>
          ) : (
            <ol className="relative border-l-2 border-border ml-3 space-y-5">
              {items.map((a) => {
                const projeto = projetoMap.get(a.projetoId);
                return (
                  <li key={a.id} className="ml-6">
                    <span className="absolute -left-[9px] h-4 w-4 rounded-full bg-primary border-2 border-background" />
                    <div className="bg-muted/40 rounded-lg p-4">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {projeto && (
                          <Badge className="bg-primary/10 text-primary border border-primary/30 hover:bg-primary/15">{projeto.nome}</Badge>
                        )}
                        <Badge variant="outline">{a.tipo}</Badge>
                        <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" />{formatDate(a.data)}
                        </span>
                      </div>
                      <p className="text-sm">{a.descricao}</p>
                      <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{a.local}</span>
                        <span className="inline-flex items-center gap-1"><User className="h-3 w-3" />{a.responsaveis}</span>
                        {a.anexos && a.anexos.length > 0 && (
                          <span className="inline-flex items-center gap-1"><Paperclip className="h-3 w-3" />{a.anexos.length} anexo(s)</span>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}

          {hasMore && (
            <>
              <div ref={sentinelRef} aria-hidden="true" className="h-1" />
              <div className="mt-6 flex justify-center">
                <Button variant="outline" onClick={loadMore} disabled={loading} className="gap-2">
                  <ChevronDown className="h-4 w-4" />
                  {loading ? "Carregando..." : "Carregar mais"}
                </Button>
              </div>
            </>
          )}

          {!hasMore && items.length > PAGE_SIZE && (
            <div className="mt-6 text-center text-xs text-muted-foreground">Você chegou ao fim do histórico.</div>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Atividade</DialogTitle>
            <DialogDescription>Registre uma nova atividade do projeto.</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Projeto *</Label>
              <Select value={form.projetoId} onValueChange={setF("projetoId")}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {projetosMock.map((p) => <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Data da Atividade *</Label>
              <Input type="date" value={form.data} onChange={(e) => setF("data")(e.target.value)} />
            </div>
            <div>
              <Label>Tipo de Ação *</Label>
              <Select value={form.tipo} onValueChange={setF("tipo")}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {TIPOS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Município</Label>
              <Select value={form.municipio} onValueChange={setF("municipio")}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {MUNICIPIOS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Local / Comunidade</Label>
              <Input value={form.local} onChange={(e) => setF("local")(e.target.value)} placeholder="Ex: Comunidade Olho d'Água" />
            </div>
            <div className="md:col-span-2">
              <Label>Descrição detalhada *</Label>
              <Textarea rows={3} value={form.descricao} onChange={(e) => setF("descricao")(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label>Responsáveis</Label>
              <Input value={form.responsaveis} onChange={(e) => setF("responsaveis")(e.target.value)} placeholder="Nomes separados por vírgula" />
            </div>

            <div className="md:col-span-2 mt-2">
              <div className="border-t pt-4">
                <h4 className="font-display font-semibold text-sm mb-3">Indicadores da Atividade</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {([
                    ["participantes", "Participantes (total)"],
                    ["mulheres", "Mulheres"],
                    ["jovens", "Jovens (até 29 anos)"],
                    ["quilombolas", "Público Quilombola"],
                    ["povosOriginarios", "Povos Originários"],
                    ["comunidadesTradicionais", "Comunidades Tradicionais"],
                    ["tecnologiasSociais", "Tecnologias Sociais"],
                  ] as const).map(([key, label]) => (
                    <div key={key}>
                      <Label className="text-xs">{label}</Label>
                      <Input
                        type="number"
                        min={0}
                        step={1}
                        value={form[key]}
                        onChange={(e) => setF(key)(e.target.value.replace(/[^\d]/g, ""))}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <Label>Anexos (fotos e documentos)</Label>
              <Input type="file" multiple onChange={onAnexos} />
              {anexos.length > 0 && (
                <ul className="mt-2 space-y-1 text-xs">
                  {anexos.map((a, i) => (
                    <li key={i} className="flex items-center justify-between bg-muted/40 rounded px-2 py-1">
                      <span className="truncate">{a.nome}</span>
                      <button type="button" onClick={() => setAnexos((arr) => arr.filter((_, idx) => idx !== i))}>
                        <X className="h-3 w-3" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar Atividade</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
