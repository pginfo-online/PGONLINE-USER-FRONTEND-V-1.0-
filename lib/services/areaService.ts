import { apiClient } from '../api/apiClient';
import { API_ENDPOINTS } from '../api/endpoints';
import { Area } from '../types/city';

export const areaService = {
  /**
   * Search active areas for a city with optional partial-match text query
   */
  async getAreasByCity(cityId: string, q?: string): Promise<Area[]> {
    if (!cityId) return [];
    const params: Record<string, any> = { cityId };
    if (q && q.trim()) {
      params.q = q.trim();
    }
    const res = await apiClient.get<{ success: boolean; data: { areas: Area[] } }>(
      API_ENDPOINTS.AREAS,
      params
    );
    return res?.data?.areas || [];
  },
};
