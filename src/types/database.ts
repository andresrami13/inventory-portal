export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'user' | 'admin'
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          role?: 'user' | 'admin'
          created_at?: string
        }
        Update: {
          full_name?: string
          role?: 'user' | 'admin'
        }
        Relationships: []
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          image_url: string | null
          stock: number
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          image_url?: string | null
          stock?: number
          active?: boolean
          created_at?: string
        }
        Update: {
          name?: string
          description?: string | null
          price?: number
          image_url?: string | null
          stock?: number
          active?: boolean
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity?: number
          created_at?: string
        }
        Update: {
          quantity?: number
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          id: string
          user_id: string
          user_email: string
          action: string
          entity: string
          entity_id: string | null
          detail: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          user_email: string
          action: string
          entity: string
          entity_id?: string | null
          detail?: Json | null
          created_at?: string
        }
        Update: Record<string, never>
        Relationships: []
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type CartItem = Database['public']['Tables']['cart_items']['Row']
export type AuditLog = Database['public']['Tables']['audit_log']['Row']
