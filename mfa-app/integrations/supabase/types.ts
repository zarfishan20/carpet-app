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
      customers: {
        Row: {
          address: string | null
          address_line1: string
          address_line2: string | null
          city: string
          created_at: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string
          postcode: string
        }
        Insert: {
          address?: string | null
          address_line1: string
          address_line2?: string | null
          city: string
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone: string
          postcode: string
        }
        Update: {
          address?: string | null
          address_line1?: string
          address_line2?: string | null
          city?: string
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string
          postcode?: string
        }
        Relationships: []
      }
      job_logs: {
        Row: {
          action: string | null
          created_at: string | null
          id: string
          job_id: string | null
          new_status: string | null
          old_status: string | null
          user_id: string | null
        }
        Insert: {
          action?: string | null
          created_at?: string | null
          id?: string
          job_id?: string | null
          new_status?: string | null
          old_status?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string | null
          created_at?: string | null
          id?: string
          job_id?: string | null
          new_status?: string | null
          old_status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_logs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          assigned_fitter_id: string | null
          created_at: string | null
          customer_id: string | null
          id: string
          invoice_url: string | null
          jobsheet_url: string | null
          labour_cost: number | null
          latitude: number | null
          longitude: number | null
          notes: string | null
          quote_url: string | null
          scheduled_date: string | null
          status: Database["public"]["Enums"]["job_status"] | null
          subtotal: number | null
          surveyor_id: string | null
          total_price: number | null
        }
        Insert: {
          assigned_fitter_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          invoice_url?: string | null
          jobsheet_url?: string | null
          labour_cost?: number | null
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          quote_url?: string | null
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["job_status"] | null
          subtotal?: number | null
          surveyor_id?: string | null
          total_price?: number | null
        }
        Update: {
          assigned_fitter_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          invoice_url?: string | null
          jobsheet_url?: string | null
          labour_cost?: number | null
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          quote_url?: string | null
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["job_status"] | null
          subtotal?: number | null
          surveyor_id?: string | null
          total_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_assigned_fitter_id_fkey"
            columns: ["assigned_fitter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_surveyor_id_fkey"
            columns: ["surveyor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          job_id: string | null
          message: string | null
          recipient: string | null
          status: string | null
          type: Database["public"]["Enums"]["notification_type"] | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          job_id?: string | null
          message?: string | null
          recipient?: string | null
          status?: string | null
          type?: Database["public"]["Enums"]["notification_type"] | null
        }
        Update: {
          created_at?: string | null
          id?: string
          job_id?: string | null
          message?: string | null
          recipient?: string | null
          status?: string | null
          type?: Database["public"]["Enums"]["notification_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number | null
          created_at: string | null
          id: string
          job_id: string | null
          paid_at: string | null
          payment_method: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          id?: string
          job_id?: string | null
          paid_at?: string | null
          payment_method?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          id?: string
          job_id?: string | null
          paid_at?: string | null
          payment_method?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
        }
        Relationships: []
      }
      rooms: {
        Row: {
          area: number | null
          carpet_type: string | null
          created_at: string | null
          id: string
          job_id: string | null
          length: number | null
          name: string | null
          notes: string | null
          price_per_sqm: number | null
          sketch_url: string | null
          width: number | null
        }
        Insert: {
          area?: number | null
          carpet_type?: string | null
          created_at?: string | null
          id?: string
          job_id?: string | null
          length?: number | null
          name?: string | null
          notes?: string | null
          price_per_sqm?: number | null
          sketch_url?: string | null
          width?: number | null
        }
        Update: {
          area?: number | null
          carpet_type?: string | null
          created_at?: string | null
          id?: string
          job_id?: string | null
          length?: number | null
          name?: string | null
          notes?: string | null
          price_per_sqm?: number | null
          sketch_url?: string | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "rooms_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      uploads: {
        Row: {
          created_at: string | null
          id: string
          job_id: string | null
          type: Database["public"]["Enums"]["upload_type"] | null
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          job_id?: string | null
          type?: Database["public"]["Enums"]["upload_type"] | null
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          job_id?: string | null
          type?: Database["public"]["Enums"]["upload_type"] | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "uploads_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: { Args: never; Returns: string }
    }
    Enums: {
      job_status:
        | "SURVEY_SUBMITTED"
        | "QUOTE_SENT"
        | "APPROVED"
        | "ASSIGNED"
        | "EN_ROUTE"
        | "COMPLETED"
        | "INVOICED"
      notification_type: "sms" | "whatsapp" | "email"
      payment_status: "pending" | "paid" | "failed"
      upload_type: "photo" | "signature" | "sketch"
      user_role: "admin" | "surveyor" | "fitter"
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
      job_status: [
        "SURVEY_SUBMITTED",
        "QUOTE_SENT",
        "APPROVED",
        "ASSIGNED",
        "EN_ROUTE",
        "COMPLETED",
        "INVOICED",
      ],
      notification_type: ["sms", "whatsapp", "email"],
      payment_status: ["pending", "paid", "failed"],
      upload_type: ["photo", "signature", "sketch"],
      user_role: ["admin", "surveyor", "fitter"],
    },
  },
} as const
