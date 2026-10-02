import { create } from 'zustand';
import { PropertyCategory, PropertySearchParams } from '../types/property';
import { City, Area } from '../types/city';

export interface SearchState {
  category: PropertyCategory;
  selectedCity: City | null;
  selectedArea: Area | null;
  textQuery: string;

  // PG filters
  pgGender: 'any' | 'male' | 'female';
  pgMinPrice: number | '';
  pgMaxPrice: number | '';
  pgSharingType: string;

  // Flat filters
  flatTenantType: 'any' | 'family' | 'bachelors_male' | 'bachelors_female';
  flatBhk: string; // e.g. "1BHK,2BHK"
  flatFurnishing: string;
  flatMinPrice: number | '';
  flatMaxPrice: number | '';

  // Commercial filters
  commercialPurpose: 'rent' | 'sale';
  commercialSubtype: string;
  commercialFitout: string;
  commercialMinPrice: number | '';
  commercialMaxPrice: number | '';

  // Actions
  setCategory: (category: PropertyCategory) => void;
  setSelectedCity: (city: City | null) => void;
  setSelectedArea: (area: Area | null) => void;
  setTextQuery: (query: string) => void;

  setPGFilters: (filters: Partial<Pick<SearchState, 'pgGender' | 'pgMinPrice' | 'pgMaxPrice' | 'pgSharingType'>>) => void;
  setFlatFilters: (filters: Partial<Pick<SearchState, 'flatTenantType' | 'flatBhk' | 'flatFurnishing' | 'flatMinPrice' | 'flatMaxPrice'>>) => void;
  setCommercialFilters: (filters: Partial<Pick<SearchState, 'commercialPurpose' | 'commercialSubtype' | 'commercialFitout' | 'commercialMinPrice' | 'commercialMaxPrice'>>) => void;

  resetFilters: () => void;
  buildQueryParams: () => PropertySearchParams;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  category: 'pg',
  selectedCity: null,
  selectedArea: null,
  textQuery: '',

  // Default PG
  pgGender: 'any',
  pgMinPrice: '',
  pgMaxPrice: '',
  pgSharingType: '',

  // Default Flat
  flatTenantType: 'any',
  flatBhk: '',
  flatFurnishing: '',
  flatMinPrice: '',
  flatMaxPrice: '',

  // Default Commercial
  commercialPurpose: 'rent',
  commercialSubtype: '',
  commercialFitout: '',
  commercialMinPrice: '',
  commercialMaxPrice: '',

  setCategory: (category) => set({ category }),
  setSelectedCity: (selectedCity) => set({ selectedCity, selectedArea: null }),
  setSelectedArea: (selectedArea) => set({ selectedArea }),
  setTextQuery: (textQuery) => set({ textQuery }),

  setPGFilters: (filters) => set((state) => ({ ...state, ...filters })),
  setFlatFilters: (filters) => set((state) => ({ ...state, ...filters })),
  setCommercialFilters: (filters) => set((state) => ({ ...state, ...filters })),

  resetFilters: () =>
    set({
      pgGender: 'any',
      pgMinPrice: '',
      pgMaxPrice: '',
      pgSharingType: '',
      flatTenantType: 'any',
      flatBhk: '',
      flatFurnishing: '',
      flatMinPrice: '',
      flatMaxPrice: '',
      commercialPurpose: 'rent',
      commercialSubtype: '',
      commercialFitout: '',
      commercialMinPrice: '',
      commercialMaxPrice: '',
      selectedArea: null,
      textQuery: '',
    }),

  buildQueryParams: () => {
    const s = get();
    const params: PropertySearchParams = {
      category: s.category,
      city: s.selectedCity?.name || undefined,
      area: s.selectedArea?.name || undefined,
      q: s.textQuery.trim() || undefined,
    };

    if (s.category === 'pg') {
      if (s.pgGender !== 'any') params.gender = s.pgGender;
      if (s.pgMinPrice !== '') params.minPrice = s.pgMinPrice;
      if (s.pgMaxPrice !== '') params.maxPrice = s.pgMaxPrice;
      if (s.pgSharingType) params.sharingType = s.pgSharingType;
    } else if (s.category === 'residential_rental') {
      if (s.flatBhk) params.bhk = s.flatBhk;
      if (s.flatFurnishing) params.furnishingStatus = s.flatFurnishing as any;
      if (s.flatMinPrice !== '') params.minPrice = s.flatMinPrice;
      if (s.flatMaxPrice !== '') params.maxPrice = s.flatMaxPrice;
    } else if (s.category === 'commercial') {
      params.purpose = s.commercialPurpose;
      if (s.commercialSubtype) params.commercialSubtype = s.commercialSubtype;
      if (s.commercialFitout) params.fitoutStatus = s.commercialFitout;
      if (s.commercialMinPrice !== '') params.minPrice = s.commercialMinPrice;
      if (s.commercialMaxPrice !== '') params.maxPrice = s.commercialMaxPrice;
    }

    return params;
  },
}));
