import { apiClient } from '../api/apiClient';
import { API_ENDPOINTS } from '../api/endpoints';
import { City } from '../types/city';

export const cityService = {
  /**
   * Fetch all active cities
   */
  async getCities(): Promise<City[]> {
    const res = await apiClient.get<{ success: boolean; data: { cities: City[] } }>(
      API_ENDPOINTS.CITIES
    );
    return res?.data?.cities || [];
  },

  /**
   * Fuzzy search cities by name or alias
   */
  async searchCities(q: string): Promise<City[]> {
    if (!q || q.trim().length === 0) {
      return this.getCities();
    }
    const res = await apiClient.get<{ success: boolean; data: { cities: City[] } }>(
      API_ENDPOINTS.CITIES_SEARCH,
      { q: q.trim() }
    );
    return res?.data?.cities || [];
  },
};
