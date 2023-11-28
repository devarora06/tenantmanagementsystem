import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabaseIDKey = 'supabaseID';
  private supabase: SupabaseClient;
  constructor() {
    this.supabase = createClient(
      'https://lqviihvmwdkabqlpecxh.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxdmlpaHZtd2RrYWJxbHBlY3hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkzMzgxNDAsImV4cCI6MjAxNDkxNDE0MH0.970stIqUsgdhPxejzbb-6R39pDOAx3J4rIGWz_c6ZAM'
    );
  }

  setSupabaseID(supabaseID: string): void {
    localStorage.setItem(this.supabaseIDKey, supabaseID);
  }
  getSupabaseID(): string | null {
    return localStorage.getItem(this.supabaseIDKey);
  }
  clearSupabaseID(): void {
    localStorage.removeItem(this.supabaseIDKey);
  }
  signOut() {
    return this.supabase.auth.signOut();
  }
}
