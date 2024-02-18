export interface Database {
  public: {
    Tables: {
      videos: {
        Row: {
          id: number;
          url: string;
        };
        Insert: {
          id?: number;
          url: string;
        };
        Update: {
          id?: number;
          url: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
