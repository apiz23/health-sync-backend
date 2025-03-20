import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import ical, { ICalEventRepeatingFreq, ICalAlarmType } from 'ical-generator';

@Injectable()
export class MedicationsService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and Service Role Key are required.');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async generateCalendar(userId: string): Promise<string> {
    try {
      const { data: medications, error } = await this.supabase
        .from('hs_medications')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        throw new Error('Failed to fetch medications');
      }

      // Generate the iCalendar content
      const calendar = ical({ name: 'HealthSync Medication Schedule' });

      medications?.forEach((med: any) => {
        const times = med.time_of_day;
        const startDate = new Date(med.start_date);
        const endDate = med.end_date ? new Date(med.end_date) : null;

        times.forEach((time: string) => {
          const [hours, minutes] = time.split(':');
          const eventStart = new Date(startDate);
          eventStart.setHours(parseInt(hours), parseInt(minutes), 0, 0);

          calendar.createEvent({
            start: eventStart,
            end: new Date(eventStart.getTime() + 30 * 60000),
            summary: `Take ${med.name}`,
            description: `Dosage: ${med.dosage}\nNotes: ${med.notes || 'None'}`,
            repeating: {
              freq: (med.frequency === 'daily'
                ? 'DAILY'
                : 'WEEKLY'
              ).toLowerCase() as ICalEventRepeatingFreq,
              until: endDate || undefined,
            },
            alarms: [{ type: 'audio' as ICalAlarmType, trigger: 900 }],
          });
        });
      });

      return calendar.toString();
    } catch (error) {
      console.error('Error generating calendar:', error);
      throw new Error('Failed to generate calendar');
    }
  }

  /**
   */
  async createMedication(data: any) {
    try {
      const startDate = new Date(data.startDate);
      const endDate = data.endDate ? new Date(data.endDate) : null;

      const { data: medication, error } = await this.supabase
        .from('hs_medications')
        .insert([
          {
            user_id: data.userId,
            name: data.name,
            dosage: data.dosage,
            frequency: data.frequency,
            time_of_day: data.times,
            start_date: startDate.toISOString(),
            end_date: endDate ? endDate.toISOString() : null,
            notes: data.notes || null,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error.message);
        throw new Error('Failed to create medication record');
      }

      return medication;
    } catch (error) {
      console.error('Error creating medication:', error);
      throw new Error('Failed to create medication record');
    }
  }

  /**
   * Fetches all medications for a given user.
   * @param userId - The ID of the user.
   * @returns A list of medications for the user.
   */
  async getMedications(userId: string) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const { data, error } = await this.supabase
      .from('hs_medications')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: true });

    if (error) {
      console.error('Error fetching medications:', error);
      throw new Error('Failed to fetch medications');
    }

    return data || [];
  }

  /**
   * Updates an existing medication record.
   * @param medicationId - The ID of the medication to update.
   * @param updates - The fields to update.
   * @returns The updated medication record.
   */
  async updateMedication(medicationId: string, updates: Partial<any>) {
    const { data, error } = await this.supabase
      .from('hs_medications')
      .update(updates)
      .eq('id', medicationId)
      .select()
      .single();

    if (error) {
      console.error('Error updating medication record:', error);
      throw new Error('Failed to update medication record');
    }

    return data;
  }

  /**
   * Deletes a medication record.
   * @param medicationId - The ID of the medication to delete.
   */
  async deleteMedication(medicationId: string) {
    const { error } = await this.supabase
      .from('hs_medications')
      .delete()
      .eq('id', medicationId);

    if (error) {
      console.error('Error deleting medication record:', error);
      throw new Error('Failed to delete medication record');
    }
  }
}
