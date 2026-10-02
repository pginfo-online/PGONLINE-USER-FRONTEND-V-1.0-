import { useQuery } from '@tanstack/react-query';
import { areaService } from '../services/areaService';
import { Area } from '../types/city';

export const AREA_QUERY_KEYS = {
  byCity: (cityId: string, q?: string) => ['areas', cityId, q || ''] as const,
};

export function useAreas(cityId?: string, q?: string) {
  return useQuery<Area[], Error>({
    queryKey: AREA_QUERY_KEYS.byCity(cityId || '', q),
    queryFn: () => areaService.getAreasByCity(cityId!, q),
    enabled: Boolean(cityId),
    staleTime: 1000 * 60 * 10, // 10 minutes cache
    gcTime: 1000 * 60 * 30,
  });
}
