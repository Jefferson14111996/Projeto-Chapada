import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserPlus, Pencil, UserX } from "lucide-react";

export const Route = createFileRoute("/usuarios")({
  head: () => ({ meta: [{ title: "Usuários — CHAPADA" }] }),
  component: UsuariosPage,
});

const usuarios = [
  { nome: "Maria Conceição", email: "maria@chapada.org.br", role: "Admin", ativo: true, lastSignIn: "2025-04-26T14:32:00" },
  { nome: "José Pedro Lima", email: "jose.pedro@chapada.org.br", role: "Editor", ativo: true, lastSignIn: "2025-04-25T09:15:00" },
  { nome: "Ana Beatriz Souza", email: "ana@chapada.org.br", role: "Editor", ativo: true, lastSignIn: "2025-04-24T17:48:00" },
  { nome: "Carlos Henrique", email: "carlos@chapada.org.br", role: "Visualizador", ativo: true, lastSignIn: "2025-04-20T11:02:00" },
  { nome: "Lúcia Ferreira", email: "lucia@chapada.org.br", role: "Visualizador", ativo: false, lastSignIn: null as string | null },
];

const formatLastSignIn = (iso: string | null) => {
  if (!iso) return "Nunca acessou";
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const roleColor: Record<string, string> = {
  Admin: "bg-terracotta/15 text-terracotta border-terracotta/30",
  Editor: "bg-primary/10 text-primary border-primary/30",
  Visualizador: "bg-ocre/20 text-ocre-foreground border-ocre/40",
};

function UsuariosPage() {
  return (
    <AppLayout
      title="Controle de Usuários"
      subtitle="Gestão de acessos e permissões da equipe"
      actions={
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" /> Convidar Usuário
        </Button>
      }
    >
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Último Acesso</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios.map((u) => (
                <TableRow key={u.email}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {u.nome
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{u.nome}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] border ${roleColor[u.role]}`}
                    >
                      {u.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatLastSignIn(u.lastSignIn)}
                  </TableCell>
                  <TableCell>
                    {u.ativo ? (
                      <Badge variant="secondary" className="bg-savanna/15 text-savanna">
                        Ativo
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-muted-foreground">
                        Inativo
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <UserX className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
