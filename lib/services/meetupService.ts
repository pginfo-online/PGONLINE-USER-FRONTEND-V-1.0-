import { apiClient } from '../api/apiClient';
import { API_ENDPOINTS } from '../api/endpoints';
import { MeetupItem } from '../../components/MeetupCard';

export interface MeetupSearchParams {
  city?: string;
  category?: string;
  sort?: string;
  limit?: number;
  page?: number;
  upcoming?: boolean;
}

export const meetupService = {
  /**
   * Get meetups list with optional filtering
   */
  async getMeetups(params?: MeetupSearchParams): Promise<MeetupItem[]> {
    try {
      const res = await apiClient.get<{
        success: boolean;
        data: MeetupItem[];
      }>(API_ENDPOINTS.MEETUPS, params);

      return res?.data || [];
    } catch (error) {
      console.warn('[meetupService] getMeetups failed:', error);
      return [];
    }
  },

  /**
   * Get single meetup by ID
   */
  async getMeetupById(id: string): Promise<MeetupItem | null> {
    try {
      const res = await apiClient.get<{
        success: boolean;
        data: MeetupItem;
      }>(API_ENDPOINTS.MEETUP_BY_ID(id));

      return res?.data || null;
    } catch (error) {
      console.warn(`[meetupService] getMeetupById(${id}) failed:`, error);
      return null;
    }
  },

  /**
   * Get all active meetup categories
   */
  async getCategories(): Promise<any[]> {
    try {
      const res = await apiClient.get<{
        success: boolean;
        data: { categories: any[] } | any[];
      }>(API_ENDPOINTS.MEETUP_CATEGORIES, { flat: true });

      if (Array.isArray(res?.data)) return res.data;
      if (res?.data && 'categories' in res.data) return res.data.categories;
      return [];
    } catch (error) {
      console.warn('[meetupService] getCategories failed:', error);
      return [];
    }
  },

  /**
   * Join a meetup (requires user auth)
   */
  async joinMeetup(id: string): Promise<any> {
    return apiClient.post(API_ENDPOINTS.MEETUP_JOIN(id));
  },

  /**
   * Cancel participation in a meetup
   */
  async cancelParticipation(id: string): Promise<any> {
    return apiClient.delete(API_ENDPOINTS.MEETUP_JOIN(id));
  },

  /**
   * Toggle user interest in a meetup
   */
  async toggleInterest(id: string): Promise<any> {
    return apiClient.post(API_ENDPOINTS.MEETUP_INTEREST(id));
  },
};
