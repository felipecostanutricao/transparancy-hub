export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      air_travel: {
        Row: {
          airline: string | null
          created_at: string | null
          event_name: string | null
          id: string
          other_expenses_amount: number | null
          passenger_name: string
          passenger_type: string | null
          ticket_amount: number | null
          travel_date_raw: string | null
        }
        Insert: {
          airline?: string | null
          created_at?: string | null
          event_name?: string | null
          id?: string
          other_expenses_amount?: number | null
          passenger_name: string
          passenger_type?: string | null
          ticket_amount?: number | null
          travel_date_raw?: string | null
        }
        Update: {
          airline?: string | null
          created_at?: string | null
          event_name?: string | null
          id?: string
          other_expenses_amount?: number | null
          passenger_name?: string
          passenger_type?: string | null
          ticket_amount?: number | null
          travel_date_raw?: string | null
        }
        Relationships: []
      }
      comentarios_nutri: {
        Row: {
          comentario: string
          criado_em: string | null
          crn: string
          email: string
          id: string
          nome: string
          status_moderacao: string | null
          termo_aceite: boolean
        }
        Insert: {
          comentario: string
          criado_em?: string | null
          crn: string
          email: string
          id?: string
          nome: string
          status_moderacao?: string | null
          termo_aceite: boolean
        }
        Update: {
          comentario?: string
          criado_em?: string | null
          crn?: string
          email?: string
          id?: string
          nome?: string
          status_moderacao?: string | null
          termo_aceite?: boolean
        }
        Relationships: []
      }
      comments: {
        Row: {
          author: string
          created_at: string | null
          id: string
          text: string
        }
        Insert: {
          author: string
          created_at?: string | null
          id?: string
          text: string
        }
        Update: {
          author?: string
          created_at?: string | null
          id?: string
          text?: string
        }
        Relationships: []
      }
      crns_banidos: {
        Row: {
          banido_em: string
          crn: string
          motivo: string | null
        }
        Insert: {
          banido_em?: string
          crn: string
          motivo?: string | null
        }
        Update: {
          banido_em?: string
          crn?: string
          motivo?: string | null
        }
        Relationships: []
      }
      daily_allowances: {
        Row: {
          amount: number | null
          created_at: string | null
          event_description: string | null
          expense_type: string | null
          id: string
          origin_city: string | null
          payment_date: string | null
          person_name: string
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          event_description?: string | null
          expense_type?: string | null
          id?: string
          origin_city?: string | null
          payment_date?: string | null
          person_name: string
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          event_description?: string | null
          expense_type?: string | null
          id?: string
          origin_city?: string | null
          payment_date?: string | null
          person_name?: string
        }
        Relationships: []
      }
      despesas_cfn: {
        Row: {
          atualizado_em: string | null
          categoria: string | null
          data_despesa: string | null
          favorecido: string | null
          fonte_tabela: string | null
          id_empenho: string
          valor: number | null
        }
        Insert: {
          atualizado_em?: string | null
          categoria?: string | null
          data_despesa?: string | null
          favorecido?: string | null
          fonte_tabela?: string | null
          id_empenho: string
          valor?: number | null
        }
        Update: {
          atualizado_em?: string | null
          categoria?: string | null
          data_despesa?: string | null
          favorecido?: string | null
          fonte_tabela?: string | null
          id_empenho?: string
          valor?: number | null
        }
        Relationships: []
      }
      diarias_deslocamentos: {
        Row: {
          Acao: string | null
          AjusteEstorno: string | null
          Cidade: string | null
          CodigoProcesso: string | null
          created_at: string | null
          DataAjuste: string | null
          DataPagamento: string | null
          EventosConcatenados: string | null
          ExibirTotalizadores: string | null
          Id: string | null
          id_pk: number
          IdAjusteDespesa: string | null
          IdDespesaPadrao: string | null
          IdProcesso: string | null
          IdProcessoDespesa: string | null
          MostraTextoInformativo: string | null
          NomeDespesaPadrao: string | null
          NomeEvento: string | null
          NomePassageiro: string | null
          OrigemPassageiro: string | null
          PeriodoDeslocamentoFormatado: string | null
          Quantidade: string | null
          QuantidadeAjuste: string | null
          TextoInformativo: string | null
          ValorAjuste: string | null
          ValorTotal: string | null
          ValorUnitario: string | null
        }
        Insert: {
          Acao?: string | null
          AjusteEstorno?: string | null
          Cidade?: string | null
          CodigoProcesso?: string | null
          created_at?: string | null
          DataAjuste?: string | null
          DataPagamento?: string | null
          EventosConcatenados?: string | null
          ExibirTotalizadores?: string | null
          Id?: string | null
          id_pk?: number
          IdAjusteDespesa?: string | null
          IdDespesaPadrao?: string | null
          IdProcesso?: string | null
          IdProcessoDespesa?: string | null
          MostraTextoInformativo?: string | null
          NomeDespesaPadrao?: string | null
          NomeEvento?: string | null
          NomePassageiro?: string | null
          OrigemPassageiro?: string | null
          PeriodoDeslocamentoFormatado?: string | null
          Quantidade?: string | null
          QuantidadeAjuste?: string | null
          TextoInformativo?: string | null
          ValorAjuste?: string | null
          ValorTotal?: string | null
          ValorUnitario?: string | null
        }
        Update: {
          Acao?: string | null
          AjusteEstorno?: string | null
          Cidade?: string | null
          CodigoProcesso?: string | null
          created_at?: string | null
          DataAjuste?: string | null
          DataPagamento?: string | null
          EventosConcatenados?: string | null
          ExibirTotalizadores?: string | null
          Id?: string | null
          id_pk?: number
          IdAjusteDespesa?: string | null
          IdDespesaPadrao?: string | null
          IdProcesso?: string | null
          IdProcessoDespesa?: string | null
          MostraTextoInformativo?: string | null
          NomeDespesaPadrao?: string | null
          NomeEvento?: string | null
          NomePassageiro?: string | null
          OrigemPassageiro?: string | null
          PeriodoDeslocamentoFormatado?: string | null
          Quantidade?: string | null
          QuantidadeAjuste?: string | null
          TextoInformativo?: string | null
          ValorAjuste?: string | null
          ValorTotal?: string | null
          ValorUnitario?: string | null
        }
        Relationships: []
      }
      log_acessos: {
        Row: {
          data_acesso: string | null
          hora_acesso: string | null
          id: string
        }
        Insert: {
          data_acesso?: string | null
          hora_acesso?: string | null
          id?: string
        }
        Update: {
          data_acesso?: string | null
          hora_acesso?: string | null
          id?: string
        }
        Relationships: []
      }
      public_comments: {
        Row: {
          author: string
          content: string
          created_at: string | null
          id: string
        }
        Insert: {
          author: string
          content: string
          created_at?: string | null
          id?: string
        }
        Update: {
          author?: string
          content?: string
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          categoria: string | null
          codigo_processo: string | null
          companhia_aerea: string | null
          created_at: string | null
          data_evento: string | null
          descricao_evento: string | null
          destino: string | null
          id: string
          nome_pessoa: string
          origem: string | null
          tipo_pessoa: string | null
          valor: number
        }
        Insert: {
          categoria?: string | null
          codigo_processo?: string | null
          companhia_aerea?: string | null
          created_at?: string | null
          data_evento?: string | null
          descricao_evento?: string | null
          destino?: string | null
          id?: string
          nome_pessoa: string
          origem?: string | null
          tipo_pessoa?: string | null
          valor: number
        }
        Update: {
          categoria?: string | null
          codigo_processo?: string | null
          companhia_aerea?: string | null
          created_at?: string | null
          data_evento?: string | null
          descricao_evento?: string | null
          destino?: string | null
          id?: string
          nome_pessoa?: string
          origem?: string | null
          tipo_pessoa?: string | null
          valor?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      viagens_despesas: {
        Row: {
          Acao: string | null
          CiaAerea: string | null
          CodigoProcesso: string | null
          created_at: string | null
          DataHoraIda: string | null
          DataldaEVoltaFormatada: string | null
          id: string
          IdDespesa: string | null
          IdProcesso: string | null
          IdProcessoPassagem: string | null
          IdProcessoPassagemTrecho: string | null
          Localizador: string | null
          MostraTextoInformativo: string | null
          MostraTotalPassageiro: string | null
          NomeDespesaPadrao: string | null
          NomeEventoFormatado: string | null
          NomePassageiro: string | null
          OrigemDestinoFormatado: string | null
          ProcessoDespesas: string | null
          Quantidade: string | null
          Situacao: string | null
          TextoInformativo: string | null
          TipoPassageiro: string | null
          TotalTarifas: string | null
          TotalTarifasComDesconto: string | null
          Valor: string | null
          ValorTotal: string | null
          ValorTotalDespesas: string | null
        }
        Insert: {
          Acao?: string | null
          CiaAerea?: string | null
          CodigoProcesso?: string | null
          created_at?: string | null
          DataHoraIda?: string | null
          DataldaEVoltaFormatada?: string | null
          id?: string
          IdDespesa?: string | null
          IdProcesso?: string | null
          IdProcessoPassagem?: string | null
          IdProcessoPassagemTrecho?: string | null
          Localizador?: string | null
          MostraTextoInformativo?: string | null
          MostraTotalPassageiro?: string | null
          NomeDespesaPadrao?: string | null
          NomeEventoFormatado?: string | null
          NomePassageiro?: string | null
          OrigemDestinoFormatado?: string | null
          ProcessoDespesas?: string | null
          Quantidade?: string | null
          Situacao?: string | null
          TextoInformativo?: string | null
          TipoPassageiro?: string | null
          TotalTarifas?: string | null
          TotalTarifasComDesconto?: string | null
          Valor?: string | null
          ValorTotal?: string | null
          ValorTotalDespesas?: string | null
        }
        Update: {
          Acao?: string | null
          CiaAerea?: string | null
          CodigoProcesso?: string | null
          created_at?: string | null
          DataHoraIda?: string | null
          DataldaEVoltaFormatada?: string | null
          id?: string
          IdDespesa?: string | null
          IdProcesso?: string | null
          IdProcessoPassagem?: string | null
          IdProcessoPassagemTrecho?: string | null
          Localizador?: string | null
          MostraTextoInformativo?: string | null
          MostraTotalPassageiro?: string | null
          NomeDespesaPadrao?: string | null
          NomeEventoFormatado?: string | null
          NomePassageiro?: string | null
          OrigemDestinoFormatado?: string | null
          ProcessoDespesas?: string | null
          Quantidade?: string | null
          Situacao?: string | null
          TextoInformativo?: string | null
          TipoPassageiro?: string | null
          TotalTarifas?: string | null
          TotalTarifasComDesconto?: string | null
          Valor?: string | null
          ValorTotal?: string | null
          ValorTotalDespesas?: string | null
        }
        Relationships: []
      }
      viagens_passagens: {
        Row: {
          Acao: string | null
          CiaAerea: string | null
          CodigoProcesso: string | null
          created_at: string | null
          DataHoraIda: string | null
          DataIdaEVoltaFormatada: string | null
          Id: string | null
          id_pk: number
          IdDespesa: string | null
          IdProcesso: string | null
          IdProcessoPassagem: string | null
          IdProcessoPassagemTrecho: string | null
          Localizador: string | null
          MostraTextoInformativo: string | null
          MostraTotalPassageiro: string | null
          NomeDespesaPadrao: string | null
          NomeEventoFormatado: string | null
          NomePassageiro: string | null
          OrigemDestinoFormatado: string | null
          ProcessoDespesas: string | null
          Quantidade: string | null
          Situacao: string | null
          TextoInformativo: string | null
          TipoPassageiro: string | null
          TotalTarifas: string | null
          TotalTarifasComDesconto: string | null
          Valor: string | null
          ValorTotal: string | null
          ValorTotalDespesas: string | null
        }
        Insert: {
          Acao?: string | null
          CiaAerea?: string | null
          CodigoProcesso?: string | null
          created_at?: string | null
          DataHoraIda?: string | null
          DataIdaEVoltaFormatada?: string | null
          Id?: string | null
          id_pk?: number
          IdDespesa?: string | null
          IdProcesso?: string | null
          IdProcessoPassagem?: string | null
          IdProcessoPassagemTrecho?: string | null
          Localizador?: string | null
          MostraTextoInformativo?: string | null
          MostraTotalPassageiro?: string | null
          NomeDespesaPadrao?: string | null
          NomeEventoFormatado?: string | null
          NomePassageiro?: string | null
          OrigemDestinoFormatado?: string | null
          ProcessoDespesas?: string | null
          Quantidade?: string | null
          Situacao?: string | null
          TextoInformativo?: string | null
          TipoPassageiro?: string | null
          TotalTarifas?: string | null
          TotalTarifasComDesconto?: string | null
          Valor?: string | null
          ValorTotal?: string | null
          ValorTotalDespesas?: string | null
        }
        Update: {
          Acao?: string | null
          CiaAerea?: string | null
          CodigoProcesso?: string | null
          created_at?: string | null
          DataHoraIda?: string | null
          DataIdaEVoltaFormatada?: string | null
          Id?: string | null
          id_pk?: number
          IdDespesa?: string | null
          IdProcesso?: string | null
          IdProcessoPassagem?: string | null
          IdProcessoPassagemTrecho?: string | null
          Localizador?: string | null
          MostraTextoInformativo?: string | null
          MostraTotalPassageiro?: string | null
          NomeDespesaPadrao?: string | null
          NomeEventoFormatado?: string | null
          NomePassageiro?: string | null
          OrigemDestinoFormatado?: string | null
          ProcessoDespesas?: string | null
          Quantidade?: string | null
          Situacao?: string | null
          TextoInformativo?: string | null
          TipoPassageiro?: string | null
          TotalTarifas?: string | null
          TotalTarifasComDesconto?: string | null
          Valor?: string | null
          ValorTotal?: string | null
          ValorTotalDespesas?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
