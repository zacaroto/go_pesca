export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          fishing_tags: string[];
          home_region: string | null;
          social_links: Record<string, string>;
          favorite_spots: string[];
          is_admin: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          fishing_tags?: string[];
          home_region?: string | null;
          social_links?: Record<string, string>;
          favorite_spots?: string[];
          is_admin?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          fishing_tags?: string[];
          home_region?: string | null;
          social_links?: Record<string, string>;
          favorite_spots?: string[];
          is_admin?: boolean;
          created_at?: string;
        };
      };
      species: {
        Row: {
          id: number;
          name_es: string;
          name_en: string;
          scientific_name: string;
          habitat: "freshwater" | "saltwater" | "brackish";
          description_es: string | null;
          description_en: string | null;
          reference_photo_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          name_es: string;
          name_en: string;
          scientific_name: string;
          habitat: "freshwater" | "saltwater" | "brackish";
          description_es?: string | null;
          description_en?: string | null;
          reference_photo_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          name_es?: string;
          name_en?: string;
          scientific_name?: string;
          habitat?: "freshwater" | "saltwater" | "brackish";
          description_es?: string | null;
          description_en?: string | null;
          reference_photo_url?: string | null;
          created_at?: string;
        };
      };
      catches: {
        Row: {
          id: string;
          user_id: string;
          species_id: number;
          photo_url: string;
          latitude: number;
          longitude: number;
          location_name: string | null;
          catch_date: string;
          weight_kg: number | null;
          length_cm: number | null;
          bait_lure: string | null;
          weather: string | null;
          tide: string | null;
          time_of_day: string | null;
          notes: string | null;
          is_public: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          species_id: number;
          photo_url: string;
          latitude: number;
          longitude: number;
          location_name?: string | null;
          catch_date?: string;
          weight_kg?: number | null;
          length_cm?: number | null;
          bait_lure?: string | null;
          weather?: string | null;
          tide?: string | null;
          time_of_day?: string | null;
          notes?: string | null;
          is_public?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          species_id?: number;
          photo_url?: string;
          latitude?: number;
          longitude?: number;
          location_name?: string | null;
          catch_date?: string;
          weight_kg?: number | null;
          length_cm?: number | null;
          bait_lure?: string | null;
          weather?: string | null;
          tide?: string | null;
          time_of_day?: string | null;
          notes?: string | null;
          is_public?: boolean;
          created_at?: string;
        };
      };
      catch_reactions: {
        Row: {
          id: string;
          user_id: string;
          catch_id: string;
          reaction_type: "fish" | "fire" | "trophy" | "wow" | "respect";
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          catch_id: string;
          reaction_type: "fish" | "fire" | "trophy" | "wow" | "respect";
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          catch_id?: string;
          reaction_type?: "fish" | "fire" | "trophy" | "wow" | "respect";
          created_at?: string;
        };
      };
      species_suggestions: {
        Row: {
          id: string;
          user_id: string;
          common_name: string;
          photo_url: string | null;
          latitude: number | null;
          longitude: number | null;
          notes: string | null;
          status: "pending" | "approved" | "rejected";
          created_at: string;
          reviewed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          common_name: string;
          photo_url?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          notes?: string | null;
          status?: "pending" | "approved" | "rejected";
          created_at?: string;
          reviewed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          common_name?: string;
          photo_url?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          notes?: string | null;
          status?: "pending" | "approved" | "rejected";
          created_at?: string;
          reviewed_at?: string | null;
        };
      };
    };
  };
};
