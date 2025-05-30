export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          full_name: string | null
          role: 'admin' | 'manager' | 'sales_rep'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          role: 'admin' | 'manager' | 'sales_rep'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          role?: 'admin' | 'manager' | 'sales_rep'
          created_at?: string
          updated_at?: string
        }
      }
      companies: {
        Row: {
          id: string
          name: string
          industry: string | null
          website: string | null
          address: string | null
          phone: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          industry?: string | null
          website?: string | null
          address?: string | null
          phone?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          industry?: string | null
          website?: string | null
          address?: string | null
          phone?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      contacts: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string | null
          phone: string | null
          job_title: string | null
          company_id: string | null
          owner_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email?: string | null
          phone?: string | null
          job_title?: string | null
          company_id?: string | null
          owner_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string | null
          phone?: string | null
          job_title?: string | null
          company_id?: string | null
          owner_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      deals: {
        Row: {
          id: string
          name: string
          amount: number | null
          currency: string
          pipeline_id: string | null
          stage_id: string | null
          owner_id: string | null
          company_id: string | null
          expected_close_date: string | null
          status: 'open' | 'won' | 'lost'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          amount?: number | null
          currency?: string
          pipeline_id?: string | null
          stage_id?: string | null
          owner_id?: string | null
          company_id?: string | null
          expected_close_date?: string | null
          status?: 'open' | 'won' | 'lost'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          amount?: number | null
          currency?: string
          pipeline_id?: string | null
          stage_id?: string | null
          owner_id?: string | null
          company_id?: string | null
          expected_close_date?: string | null
          status?: 'open' | 'won' | 'lost'
          created_at?: string
          updated_at?: string
        }
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
  }
} 