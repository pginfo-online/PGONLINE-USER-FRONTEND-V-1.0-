import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { leadService } from '../services/leadService';
import { useUIStore } from '../store/uiStore';

export const WISHLIST_QUERY_KEY = ['wishlist'] as const;

export function useMyWishlist(enabled = true) {
  return useQuery({
    queryKey: WISHLIST_QUERY_KEY,
    queryFn: () => leadService.getMyWishlist(),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();
  const addToast = useUIStore((s) => s.addToast);

  return useMutation({
    mutationFn: (propertyId: string) => leadService.toggleWishlist(propertyId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
      addToast(data.message || 'Updated wishlist!', 'success');
    },
    onError: (err: any) => {
      addToast(err?.message || 'Could not update wishlist', 'error');
    },
  });
}
