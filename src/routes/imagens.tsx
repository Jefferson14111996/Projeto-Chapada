import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Download, MapPin, Calendar, Tag, FolderOpen, Trash2, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { addImagem, removeImagem, updateImagem, useImagens, type ImagemItem } from "@/lib/imagensStore";
import { projetosMock, MUNICIPIOS } from "@/lib/mockData";
import { addNotification } from "@/lib/notificationsStore";
import { useGlobalSearch } from "@/contexts/SearchContext";
import { canEdit, denyToast, getOwnership, makeOwnership, removeOwnership, setOwnership, useOwnership } from "@/lib/ownershipStore";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { CollaboratorsSection } from "@/components/CollaboratorsSection";
import { toast } from "sonner";

export const Route = createFileRoute("/imagens")({
  head: () => ({ meta: [{ title: "Banco de Imagens — CHAPADA" }] }),
  component: ImagensPage,
});

const TIPOS = ["Oficina", "Encontro", "Entrega", "Visita Técnica", "Capacitação", "Mobilização", "Plantio", "Roda de conversa"];

interface PendingFile {
  file: File;
  dataUrl: string;
}

const emptyForm = { projeto: "", local: "", tipo: "", date: "" };

function ImagensPage() {
  const imgs = useImagens();
  const { query } = useGlobalSearch();
  const { email: currentEmail, name: currentName } = useCurrentUser();
  const [selected, setSelected] = useState<ImagemItem | null>(null);
  const [toDelete, setToDelete] = useState<ImagemItem | null>(null);
  const [editing, setEditing] = useState<ImagemItem | null>(null);
  const editingOwnership = useOwnership("imagem", editing?.id ?? "");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<PendingFile | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return imgs;
    return imgs.filter((i) =>
      [i.projeto, i.local, i.tipo, i.date, i.nomeArquivo].join(" ").toLowerCase().includes(q),
    );
  }, [imgs, query]);

  const openPicker = () => fileInputRef.current?.click();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Formato inválido. Use JPG, PNG ou WEBP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Imagem muito grande (máx. 5MB).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPending({ file, dataUrl: String(reader.result) });
      const today = new Date();
      setForm({
        projeto: "",
        local: "",
        tipo: "",
        date: `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!pending) return;
    if (!form.projeto || !form.local || !form.tipo || !form.date) {
      toast.error("Preencha todos os campos.");
      return;
    }
    const newId = addImagem({
      projeto: form.projeto,
      local: form.local,
      tipo: form.tipo,
      date: form.date,
      dataUrl: pending.dataUrl,
      nomeArquivo: pending.file.name,
    });
    setOwnership("imagem", newId, makeOwnership(currentEmail, currentName));
    addNotification({
      type: "imagem",
      title: "Nova imagem enviada",
      body: `${form.projeto} — ${form.local}`,
    });
    toast.success("Imagem adicionada à galeria.");
    setPending(null);
  };

  const openEdit = (img: ImagemItem) => {
    if (!canEdit("imagem", img.id, currentEmail)) { denyToast(); return; }
    setEditing(img);
    setForm({ projeto: img.projeto, local: img.local, tipo: img.tipo, date: img.date });
  };

  const handleEditSave = () => {
    if (!editing) return;
    if (!canEdit("imagem", editing.id, currentEmail)) { denyToast(); return; }
    if (!form.projeto || !form.local || !form.tipo || !form.date) {
      toast.error("Preencha todos os campos.");
      return;
    }
    updateImagem(editing.id, { ...form });
    toast.success("Imagem atualizada.");
    setEditing(null);
  };

  const requestDelete = (img: ImagemItem) => {
    if (!canEdit("imagem", img.id, currentEmail)) { denyToast(); return; }
    setToDelete(img);
  };

  const handleDelete = () => {
    if (!toDelete) return;
    if (!canEdit("imagem", toDelete.id, currentEmail)) { denyToast(); setToDelete(null); return; }
    removeImagem(toDelete.id);
    removeOwnership("imagem", toDelete.id);
    setToDelete(null);
    toast.success("Imagem excluída.");
  };

  const handleDownload = (img: ImagemItem) => {
    const a = document.createElement("a");
    a.href = img.dataUrl;
    a.download = img.nomeArquivo || `chapada-${img.id}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const editorOpen = !!pending || !!editing;
  const isEditMode = !!editing;

  return (
    <AppLayout
      title="Banco de Imagens"
      subtitle="Galeria de fotos das atividades realizadas"
      actions={
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={onFileChange}
          />
          <Button onClick={openPicker} className="gap-2">
            <Upload className="h-4 w-4" /> Enviar Imagens
          </Button>
        </>
      }
    >
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground text-sm">
            {query
              ? "Nenhuma imagem encontrada para esta busca."
              : 'Nenhuma imagem na galeria. Clique em "Enviar Imagens" para começar.'}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((img) => (
            <Card
              key={img.id}
              className="overflow-hidden group cursor-pointer hover:shadow-[var(--shadow-elevated)] transition-shadow relative"
            >
              <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEdit(img);
                  }}
                  className="h-8 w-8 grid place-items-center rounded-md bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
                  aria-label="Editar imagem"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    requestDelete(img);
                  }}
                  className="h-8 w-8 grid place-items-center rounded-md bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90"
                  aria-label="Excluir imagem"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div
                onClick={() => setSelected(img)}
                className="aspect-square relative bg-muted overflow-hidden"
              >
                <img
                  src={img.dataUrl}
                  alt={`${img.projeto} - ${img.tipo}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </div>
              <CardContent className="p-3" onClick={() => setSelected(img)}>
                <div className="text-sm font-medium truncate">{img.projeto}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {img.local} · {img.date}
                </div>
                <Badge variant="secondary" className="text-[10px] mt-2">
                  {img.tipo}
                </Badge>
                {(() => { const o = getOwnership("imagem", img.id); return o ? <div className="text-[10px] text-muted-foreground mt-1">Criado por {o.ownerName}</div> : null; })()}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de upload/edição */}
      <Dialog open={editorOpen} onOpenChange={(o) => { if (!o) { setPending(null); setEditing(null); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Editar Imagem" : "Nova Imagem"}</DialogTitle>
            <DialogDescription>
              {isEditMode ? "Atualize os dados desta imagem." : "Preencha os dados da imagem enviada."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="aspect-video rounded-md overflow-hidden bg-muted">
              <img
                src={pending?.dataUrl ?? editing?.dataUrl ?? ""}
                alt="preview"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <Label>Projeto</Label>
              <Select value={form.projeto} onValueChange={(v) => setForm((f) => ({ ...f, projeto: v }))}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {projetosMock.map((p) => (
                    <SelectItem key={p.id} value={p.nome}>{p.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Município / Local</Label>
              <Select value={form.local} onValueChange={(v) => setForm((f) => ({ ...f, local: v }))}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {MUNICIPIOS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tipo de Ação</Label>
              <Select value={form.tipo} onValueChange={(v) => setForm((f) => ({ ...f, tipo: v }))}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {TIPOS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Data</Label>
              <Input
                placeholder="dd/mm/aaaa"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              />
            </div>
            {isEditMode && editing && editingOwnership && (
              <CollaboratorsSection type="imagem" id={editing.id} ownership={editingOwnership} currentEmail={currentEmail} />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setPending(null); setEditing(null); }}>Cancelar</Button>
            <Button onClick={isEditMode ? handleEditSave : handleSave}>
              {isEditMode ? "Salvar alterações" : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lightbox */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden">
          <DialogTitle className="sr-only">
            {selected ? `Imagem: ${selected.projeto}` : "Imagem"}
          </DialogTitle>
          {selected && (
            <div className="grid md:grid-cols-[1fr_320px]">
              <div className="relative bg-black grid place-items-center min-h-[320px] md:min-h-[520px]">
                <img src={selected.dataUrl} alt={selected.projeto} className="max-h-[520px] max-w-full object-contain" />
              </div>
              <div className="p-6 flex flex-col gap-4 bg-card">
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Atividade</div>
                  <h2 className="font-display text-xl font-semibold leading-tight">{selected.projeto}</h2>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <FolderOpen className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                    <div><div className="text-xs text-muted-foreground">Projeto</div><div className="font-medium">{selected.projeto}</div></div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                    <div><div className="text-xs text-muted-foreground">Local</div><div className="font-medium">{selected.local}</div></div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                    <div><div className="text-xs text-muted-foreground">Data</div><div className="font-medium">{selected.date}</div></div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Tag className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                    <div><div className="text-xs text-muted-foreground">Tipo de ação</div><Badge variant="secondary" className="mt-0.5">{selected.tipo}</Badge></div>
                  </div>
                </div>
                <Button onClick={() => handleDownload(selected)} className="gap-2 mt-auto w-full">
                  <Download className="h-4 w-4" /> Baixar Imagem
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja excluir esta imagem?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
