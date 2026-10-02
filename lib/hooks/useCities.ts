import { useQuery } from '@tanstack/react-query';
import { cityService } from '../services/cityService';
import { City } from '../types/city';

export const CITY_QUERY_KEYS = {
  all: ['cities'] as const,
  search: (q: string) => ['cities', 'search', q] as const,
};

export function useCities() {
  return useQuery<City[], Error>({
    queryKey: CITY_QUERY_KEYS.all,
    queryFn: () => cityService.getCities(),
    staleTime: 1000 * 60 * 30, // 30 minutes cache for cities
    gcTime: 1000 * 60 * 60, // 1 hour memory
  });
}

export function useCitySearch(q: string) {
  return useQuery<City[], Error>({
    queryKey: CITY_QUERY_KEYS.search(q),
    queryFn: () => cityService.searchCities(q),
    enabled: q.trim().length > 0,
    staleTime: 1000 * 60 * 10,
  });
}
