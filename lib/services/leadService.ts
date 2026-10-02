import { apiClient } from '../api/apiClient';
import { API_ENDPOINTS } from '../api/endpoints';

export interface BookVisitPayload {
  propertyId?: string;
  pgId?: string;
  scheduledDate: string;
  scheduledTime: string;
  message?: string;
}

export const leadService = {
  /**
   * Save property to wishlist (creates lead of type 'wishlist')
   */
  async toggleWishlist(propertyId: string): Promise<{ success: boolean; message: string }> {
    const res = await apiClient.post<{ success: boolean; message: string }>(
      API_ENDPOINTS.LEADS,
      {
        propertyId,
        pgId: propertyId,
        pg: propertyId,
        type: 'wishlist',
      }
    );
    return res;
  },

  /**
   * Get user's saved wishlist properties
   */
  async getMyWishlist(): Promise<any[]> {
    const res = await apiClient.get<{ success: boolean; data: { leads: any[] } }>(
      API_ENDPOINTS.MY_LEADS
    );
    const leads = res?.data?.leads || [];
    return leads.filter((l: any) => l.type === 'wishlist');
  },

  /**
   * Schedule property visit
   */
  async bookVisit(payload: BookVisitPayload): Promise<any> {
    const res = await apiClient.post(API_ENDPOINTS.VISITS, {
      ...payload,
      propertyId: payload.propertyId || payload.pgId,
      pgId: payload.pgId || payload.propertyId,
    });
    return res;
  },

  /**
   * Get user's scheduled visits
   */
  async getMyVisits(): Promise<any[]> {
    const res = await apiClient.get<{ success: boolean; data: { visits: any[] } }>(
      API_ENDPOINTS.MY_VISITS
    );
    return res?.data?.visits || [];
  },
};
