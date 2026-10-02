import { useQuery } from '@tanstack/react-query';
import { propertyService } from '../services/propertyService';
import { Property } from '../types/property';
import { propertyKeys } from './useProperties';

export function usePropertyDetails(id?: string) {
  return useQuery<Property, Error>({
    queryKey: propertyKeys.detail(id || ''),
    queryFn: () => propertyService.getPropertyById(id!),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5, // 5 minutes fresh
    gcTime: 1000 * 60 * 15,
    retry: 1,
  });
}
