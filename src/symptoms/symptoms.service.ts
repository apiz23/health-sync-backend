import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SymptomsService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and Service Role Key are required.');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async addSymptom(userId: string, description: string) {
    const { data, error } = await this.supabase
      .from('hs_symptoms')
      .insert([{ user_id: userId, description }]);

    if (error) throw new Error(error.message);
    return data;
  }

  async getUserSymptoms(userId: string) {
    console.log('Fetching symptoms for user:', userId);

    const { data, error } = await this.supabase
      .from('hs_symptoms')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Supabase error:', error.message);
      throw new Error(error.message);
    }

    console.log('Symptoms data:', data);
    return data;
  }
}
