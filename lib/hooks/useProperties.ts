import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { propertyService } from '../services/propertyService';
import { PropertySearchParams, PropertySearchResult, PropertySuggestion } from '../types/property';

/**
 * Standardized Query Key Factory for all Property Server State
 */
export const propertyKeys = {
  all: ['properties'] as const,
  lists: () => [...propertyKeys.all, 'list'] as const,
  list: (params: PropertySearchParams) => [...propertyKeys.lists(), params] as const,
  details: () => [...propertyKeys.all, 'detail'] as const,
  detail: (id: string) => [...propertyKeys.details(), id] as const,
  suggestions: (q: string) => [...propertyKeys.all, 'suggestions', q] as const,
};

/**
 * Hook for property discovery across categories (PG, flats, commercial)
 * Employs keepPreviousData to ensure seamless pagination and filtering without UI flicker.
 */
export function useProperties(params: PropertySearchParams) {
  return useQuery<PropertySearchResult, Error>({
    queryKey: propertyKeys.list(params),
    queryFn: ({ signal }) => propertyService.searchProperties(params),
    staleTime: 1000 * 60 * 2, // 2 minutes fresh cache
    gcTime: 1000 * 60 * 10, // 10 minutes cache lifetime
    placeholderData: keepPreviousData,
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx client errors
      if (error?.status >= 400 && error?.status < 500) return false;
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for autocomplete search suggestions with query cancellation support
 */
export function usePropertySuggestions(q: string) {
  const cleanQ = q.trim();
  return useQuery<PropertySuggestion[], Error>({
    queryKey: propertyKeys.suggestions(cleanQ),
    queryFn: () => propertyService.getSuggestions(cleanQ),
    enabled: cleanQ.length >= 2,
    staleTime: 1000 * 60 * 5,
  });
}
