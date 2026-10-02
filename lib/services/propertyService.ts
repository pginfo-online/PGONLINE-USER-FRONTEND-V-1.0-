import { apiClient } from '../api/apiClient';
import { API_ENDPOINTS } from '../api/endpoints';
import {
  Property,
  PropertySearchParams,
  PropertySearchResult,
  PropertySuggestion,
} from '../types/property';

export const propertyService = {
  /**
   * Search properties across categories (PG, Flats, Commercials)
   */
  async searchProperties(params: PropertySearchParams): Promise<PropertySearchResult> {
    try {
      const res = await apiClient.get<{
        success: boolean;
        data: Property[];
        pagination: PropertySearchResult['pagination'];
      }>(API_ENDPOINTS.PROPERTIES, params);

      return {
        properties: res?.data || [],
        pagination: res?.pagination || {
          total: res?.data?.length || 0,
          page: Number(params.page) || 1,
          limit: Number(params.limit) || 12,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };
    } catch (err) {
      // If /properties fails (e.g. legacy backend only running /pg endpoint), fallback gracefully
      console.warn('[propertyService] /properties failed, attempting fallback to /pg', err);
      const pgRes = await apiClient.get<{
        success: boolean;
        data: any[];
        pagination: PropertySearchResult['pagination'];
      }>(API_ENDPOINTS.PG, params);

      return {
        properties: (pgRes?.data || []).map((p: any) => ({
          ...p,
          title: p.name || p.title,
          category: p.category || 'pg',
          purpose: p.purpose || 'rent',
          pricing: p.pricing || { expectedPrice: p.rent?.single || p.minRent || 5000 },
        })),
        pagination: pgRes?.pagination || {
          total: pgRes?.data?.length || 0,
          page: Number(params.page) || 1,
          limit: Number(params.limit) || 12,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };
    }
  },

  /**
   * Get single property details by ID
   */
  async getPropertyById(id: string): Promise<Property> {
    try {
      const res = await apiClient.get<{ success: boolean; data: { property: Property } }>(
        API_ENDPOINTS.PROPERTY_BY_ID(id)
      );
      if (res?.data?.property) return res.data.property;
    } catch (e) {
      console.warn('[propertyService] /properties/:id failed, falling back to /pg/:id', e);
    }

    const fallbackRes = await apiClient.get<{ success: boolean; data: { pg: any } | any }>(
      API_ENDPOINTS.PG_BY_ID(id)
    );
    const pgData = fallbackRes?.data?.pg || fallbackRes?.data;
    return {
      ...pgData,
      title: pgData?.name || pgData?.title,
      category: pgData?.category || 'pg',
      purpose: pgData?.purpose || 'rent',
      pricing: pgData?.pricing || { expectedPrice: pgData?.rent?.single || pgData?.minRent || 5000 },
    };
  },

  /**
   * Autocomplete search suggestions
   */
  async getSuggestions(q: string): Promise<PropertySuggestion[]> {
    if (!q || q.trim().length < 2) return [];
    try {
      const res = await apiClient.get<{
        success: boolean;
        data: { suggestions: PropertySuggestion[] };
      }>(API_ENDPOINTS.PROPERTY_SUGGESTIONS, { q: q.trim() });
      return res?.data?.suggestions || [];
    } catch {
      return [];
    }
  },
};
