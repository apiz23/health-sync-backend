import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class DiseasesService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and Service Role Key are required.');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async findByUserId(userId: string) {
    const { data, error } = await this.supabase
      .from('hs_diseases')
      .select('*')
      .eq('user_id', userId);

    if (error) throw new Error(error.message);
    return data;
  }

  async addDisease(
    userId: string,
    name: string,
    category: string,
    description?: string,
  ) {
    try {
      if (!userId || !name || !category) {
        throw new HttpException(
          'User ID, Name, and Category are required fields.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const { data, error } = await this.supabase
        .from('hs_diseases')
        .insert([
          {
            user_id: userId,
            name: name,
            category: category,
            description: description || null,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase Insert Error:', error);
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return data;
    } catch (error) {
      console.error('Error in addDisease:', error);
      throw new HttpException(
        'Failed to add disease',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
