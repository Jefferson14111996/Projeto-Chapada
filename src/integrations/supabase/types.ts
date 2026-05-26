export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          photo_url: string | null
          role: "admin" | "editor" | "visualizador" | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          photo_url?: string | null
          role?: "admin" | "editor" | "visualizador" | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          photo_url?: string | null
          role?: "admin" | "editor" | "visualizador" | null
          updated_at?: string
        }
        Relationships: []
      }
      linhas_de_acao: {
        Row: {
          id: number
          nome: string
          created_at: string
        }
        Insert: {
          id?: number
          nome: string
          created_at?: string
        }
        Update: {
          id?: number
          nome?: string
          created_at?: string
        }
        Relationships: []
      }
      tecnologias_sociais: {
        Row: {
          id: string
          linha_de_acao_id: number | null
          nome: string
          tipo_entrega: "Física" | "Metodológica"
          descricao: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          linha_de_acao_id?: number | null
          nome: string
          tipo_entrega: "Física" | "Metodológica"
          descricao?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          linha_de_acao_id?: number | null
          nome?: string
          tipo_entrega?: "Física" | "Metodológica"
          descricao?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tecnologias_sociais_linha_de_acao_id_fkey"
            columns: ["linha_de_acao_id"]
            referencedRelation: "linhas_de_acao"
            referencedColumns: ["id"]
          }
        ]
      }
      projetos: {
        Row: {
          id: string
          nome: string
          contrato: string
          financiador: string
          financiador_id: string | null
          inicio: string
          termino: string
          valor: number
          municipios: string[]
          publico_quant: number
          publico_caract: string | null
          status: "Em execução" | "Concluído" | "Suspenso"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          contrato: string
          financiador: string
          financiador_id?: string | null
          inicio: string
          termino: string
          valor?: number
          municipios?: string[]
          publico_quant?: number
          publico_caract?: string | null
          status?: "Em execução" | "Concluído" | "Suspenso"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          contrato?: string
          financiador?: string
          financiador_id?: string | null
          inicio?: string
          termino?: string
          valor?: number
          municipios?: string[]
          publico_quant?: number
          publico_caract?: string | null
          status?: "Em execução" | "Concluído" | "Suspenso"
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projetos_financiador_id_fkey"
            columns: ["financiador_id"]
            referencedRelation: "financiadores"
            referencedColumns: ["id"]
          }
        ]
      }
      projeto_tecnologias: {
        Row: {
          id: string
          projeto_id: string | null
          tecnologia_id: string | null
          quantidade: number
          unidade: string
          familias: number | null
          municipios: string | null
          comunidades: string | null
          data: string | null
          observacoes: string | null
        }
        Insert: {
          id?: string
          projeto_id?: string | null
          tecnologia_id?: string | null
          quantidade?: number
          unidade?: string
          familias?: number | null
          municipios?: string | null
          comunidades?: string | null
          data?: string | null
          observacoes?: string | null
        }
        Update: {
          id?: string
          projeto_id?: string | null
          tecnologia_id?: string | null
          quantidade?: number
          unidade?: string
          familias?: number | null
          municipios?: string | null
          comunidades?: string | null
          data?: string | null
          observacoes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projeto_tecnologias_projeto_id_fkey"
            columns: ["projeto_id"]
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_tecnologias_tecnologia_id_fkey"
            columns: ["tecnologia_id"]
            referencedRelation: "tecnologias_sociais"
            referencedColumns: ["id"]
          }
        ]
      }
      beneficiarios: {
        Row: {
          id: string
          documento_identificador: string
          nome_responsavel: string
          quantidade_familiares: number
          genero: "Masculino" | "Feminino" | "Outro"
          faixa_etaria: "Jovem" | "Adulto" | "Idoso"
          quilombola: boolean | null
          povo_originario: boolean | null
          comunidade: string | null
          comunidade_id: string | null
          municipio: string | null
          municipio_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          documento_identificador: string
          nome_responsavel: string
          quantidade_familiares?: number
          genero: "Masculino" | "Feminino" | "Outro"
          faixa_etaria: "Jovem" | "Adulto" | "Idoso"
          quilombola?: boolean | null
          povo_originario?: boolean | null
          comunidade?: string | null
          comunidade_id?: string | null
          municipio?: string | null
          municipio_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          documento_identificador?: string
          nome_responsavel?: string
          quantidade_familiares?: number
          genero?: "Masculino" | "Feminino" | "Outro"
          faixa_etaria?: "Jovem" | "Adulto" | "Idoso"
          quilombola?: boolean | null
          povo_originario?: boolean | null
          comunidade?: string | null
          comunidade_id?: string | null
          municipio?: string | null
          municipio_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "beneficiarios_comunidade_id_fkey"
            columns: ["comunidade_id"]
            referencedRelation: "comunidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "beneficiarios_municipio_id_fkey"
            columns: ["municipio_id"]
            referencedRelation: "municipios"
            referencedColumns: ["id"]
          }
        ]
      }
      atividades: {
        Row: {
          id: string
          projeto_id: string | null
          data: string
          tipo: string
          descricao: string
          local: string | null
          municipio: string | null
          municipio_id: string | null
          responsaveis: string | null
          indicadores: Json | null
          anexos: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          projeto_id?: string | null
          data: string
          tipo: string
          descricao: string
          local?: string | null
          municipio?: string | null
          municipio_id?: string | null
          responsaveis?: string | null
          indicadores?: Json | null
          anexos?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          projeto_id?: string | null
          data?: string
          tipo?: string
          descricao?: string
          local?: string | null
          municipio?: string | null
          municipio_id?: string | null
          responsaveis?: string | null
          indicadores?: Json | null
          anexos?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "atividades_projeto_id_fkey"
            columns: ["projeto_id"]
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atividades_municipio_id_fkey"
            columns: ["municipio_id"]
            referencedRelation: "municipios"
            referencedColumns: ["id"]
          }
        ]
      }
      atividade_beneficiarios: {
        Row: {
          atividade_id: string
          beneficiario_id: string
        }
        Insert: {
          atividade_id: string
          beneficiario_id: string
        }
        Update: {
          atividade_id?: string
          beneficiario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "atividade_beneficiarios_atividade_id_fkey"
            columns: ["atividade_id"]
            referencedRelation: "atividades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atividade_beneficiarios_beneficiario_id_fkey"
            columns: ["beneficiario_id"]
            referencedRelation: "beneficiarios"
            referencedColumns: ["id"]
          }
        ]
      }
      atividade_tecnologias: {
        Row: {
          atividade_id: string
          tecnologia_id: string
        }
        Insert: {
          atividade_id: string
          tecnologia_id: string
        }
        Update: {
          atividade_id?: string
          tecnologia_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "atividade_tecnologias_atividade_id_fkey"
            columns: ["atividade_id"]
            referencedRelation: "atividades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atividade_tecnologias_tecnologia_id_fkey"
            columns: ["tecnologia_id"]
            referencedRelation: "tecnologias_sociais"
            referencedColumns: ["id"]
          }
        ]
      }
      arquivos_midia: {
        Row: {
          id: string
          projeto_id: string | null
          atividade_id: string | null
          nome: string
          tipo_acao: string | null
          data: string | null
          local: string | null
          url: string
          tipo_arquivo: "imagem" | "documento" | null
          documento_pai_id: string | null
          versao: number | null
          categoria_id: string | null
          categoria: string | null
          tags: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          projeto_id?: string | null
          atividade_id?: string | null
          nome: string
          tipo_acao?: string | null
          data?: string | null
          local?: string | null
          url: string
          tipo_arquivo?: "imagem" | "documento" | null
          documento_pai_id?: string | null
          versao?: number | null
          categoria_id?: string | null
          categoria?: string | null
          tags?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          projeto_id?: string | null
          atividade_id?: string | null
          nome?: string
          tipo_acao?: string | null
          data?: string | null
          local?: string | null
          url?: string
          tipo_arquivo?: "imagem" | "documento" | null
          documento_pai_id?: string | null
          versao?: number | null
          categoria_id?: string | null
          categoria?: string | null
          tags?: string[] | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "arquivos_midia_projeto_id_fkey"
            columns: ["projeto_id"]
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arquivos_midia_atividade_id_fkey"
            columns: ["atividade_id"]
            referencedRelation: "atividades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arquivos_midia_documento_pai_id_fkey"
            columns: ["documento_pai_id"]
            referencedRelation: "arquivos_midia"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arquivos_midia_categoria_id_fkey"
            columns: ["categoria_id"]
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          }
        ]
      }
      auditoria: {
        Row: {
          id: string
          usuario_id: string | null
          acao: string
          tabela: string
          registro_id: string
          detalhes: Json | null
          timestamp: string
        }
        Insert: {
          id?: string
          usuario_id?: string | null
          acao: string
          tabela: string
          registro_id: string
          detalhes?: Json | null
          timestamp?: string
        }
        Update: {
          id?: string
          usuario_id?: string | null
          acao?: string
          tabela?: string
          registro_id?: string
          detalhes?: Json | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "auditoria_usuario_id_fkey"
            columns: ["usuario_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      notificacoes: {
        Row: {
          id: string
          usuario_id: string | null
          titulo: string
          mensagem: string
          lida: boolean
          link: string | null
          created_at: string
          tipo: string | null
          remetente: string | null
        }
        Insert: {
          id?: string
          usuario_id?: string | null
          titulo: string
          mensagem: string
          lida?: boolean
          link?: string | null
          created_at?: string
          tipo?: string | null
          remetente?: string | null
        }
        Update: {
          id?: string
          usuario_id?: string | null
          titulo?: string
          mensagem?: string
          lida?: boolean
          link?: string | null
          created_at?: string
          tipo?: string | null
          remetente?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notificacoes_usuario_id_fkey"
            columns: ["usuario_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      municipios: {
        Row: {
          id: string
          nome: string
          uf: string
          created_at: string
        }
        Insert: {
          id?: string
          nome: string
          uf?: string
          created_at?: string
        }
        Update: {
          id?: string
          nome?: string
          uf?: string
          created_at?: string
        }
        Relationships: []
      }
      comunidades: {
        Row: {
          id: string
          municipio_id: string | null
          nome: string
          created_at: string
        }
        Insert: {
          id?: string
          municipio_id?: string | null
          nome: string
          created_at?: string
        }
        Update: {
          id?: string
          municipio_id?: string | null
          nome?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comunidades_municipio_id_fkey"
            columns: ["municipio_id"]
            referencedRelation: "municipios"
            referencedColumns: ["id"]
          }
        ]
      }
      financiadores: {
        Row: {
          id: string
          nome: string
          cnpj: string | null
          contato: string | null
          created_at: string
        }
        Insert: {
          id?: string
          nome: string
          cnpj?: string | null
          contato?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          nome?: string
          cnpj?: string | null
          contato?: string | null
          created_at?: string
        }
        Relationships: []
      }
      categorias: {
        Row: {
          id: string
          nome: string
          tipo: "documento" | "tecnologia" | "geral"
          created_at: string
        }
        Insert: {
          id?: string
          nome: string
          tipo: "documento" | "tecnologia" | "geral"
          created_at?: string
        }
        Update: {
          id?: string
          nome?: string
          tipo?: "documento" | "tecnologia" | "geral"
          created_at?: string
        }
        Relationships: []
      }
      publicos: {
        Row: {
          id: string
          nome: string
          descricao: string | null
          created_at: string
        }
        Insert: {
          id?: string
          nome: string
          descricao?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          nome?: string
          descricao?: string | null
          created_at?: string
        }
        Relationships: []
      }
      projeto_municipios: {
        Row: {
          projeto_id: string
          municipio_id: string
        }
        Insert: {
          projeto_id: string
          municipio_id: string
        }
        Update: {
          projeto_id?: string
          municipio_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projeto_municipios_projeto_id_fkey"
            columns: ["projeto_id"]
            referencedRelation: "projetos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projeto_municipios_municipio_id_fkey"
            columns: ["municipio_id"]
            referencedRelation: "municipios"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
