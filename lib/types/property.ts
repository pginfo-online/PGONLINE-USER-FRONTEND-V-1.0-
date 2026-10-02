export type PropertyCategory = 'pg' | 'residential_rental' | 'commercial';
export type PropertyPurpose = 'rent' | 'sale';

export interface PropertyPhoto {
  _id?: string;
  url: string;
  publicId?: string;
  caption?: string;
  isMain?: boolean;
  order?: number;
}

export interface NearbyPlace {
  placeType: string;
  name: string;
  distance?: number;
  walkTime?: number;
}

export interface PropertyPricing {
  expectedPrice: number;
  pricePerSqFt?: number;
  securityDeposit?: number;
  maintenanceCharges?: number;
  maintenanceType?: 'included' | 'monthly_fixed' | 'per_sqft_monthly' | 'quarterly' | 'yearly' | 'none';
  pricingNegotiable?: boolean;
}

export interface RoomConfig {
  _id?: string;
  shareType: 'single' | 'double' | 'triple' | 'four' | 'dormitory' | 'studio';
  rent: number;
  depositAmount?: number;
  totalBeds?: number;
  availableBeds?: number;
  roomSize?: string;
  acIncluded?: boolean;
  bathroomType?: 'attached' | 'shared' | 'common-floor';
  amenities?: string[];
}

export interface PGDetails {
  propertySubtype?: 'PG' | 'Hostel' | 'Co-living' | 'Student Accommodation' | 'Working Men PG' | 'Working Women PG';
  roomConfigs?: RoomConfig[];
  gender: 'male' | 'female' | 'any';
  food?: 'veg' | 'nonveg' | 'both' | 'none';
  foodIncluded?: boolean;
  ac?: boolean;
  preferredTenants?: string[];
  rules?: {
    smokingAllowed?: boolean;
    alcoholAllowed?: boolean;
    curfewTime?: string;
    guestsAllowed?: boolean;
  };
  noticePeriod?: number;
  minStay?: number;
}

export interface ResidentialDetails {
  propertySubtype?: 'apartment_flat' | 'independent_house' | 'villa' | 'builder_floor' | 'studio_apartment' | 'penthouse';
  bhk: '1RK' | '1BHK' | '2BHK' | '2.5BHK' | '3BHK' | '3.5BHK' | '4BHK' | '5BHK+';
  bedrooms?: number;
  bathrooms?: number;
  balconies?: number;
  carpetAreaSqFt: number;
  superBuiltUpAreaSqFt?: number;
  furnishingStatus: 'unfurnished' | 'semi_furnished' | 'fully_furnished';
  preferredTenants?: ('family' | 'bachelors_male' | 'bachelors_female' | 'company_lease' | 'any')[];
  societyName?: string;
  gatedSecurity?: boolean;
  powerBackup?: string;
  parking?: number;
}

export interface CommercialDetails {
  commercialSubtype:
    | 'office_space'
    | 'retail_shop'
    | 'showroom'
    | 'warehouse_godown'
    | 'co_working'
    | 'industrial_shed_factory'
    | 'commercial_building_floor';
  carpetAreaSqFt: number;
  superBuiltUpAreaSqFt?: number;
  fitoutStatus: 'bare_shell' | 'warm_shell' | 'fully_furnished_plug_and_play';
  cabinsCount?: number;
  workstationsCount?: number;
  conferenceRoomsCount?: number;
  privateWashrooms?: number;
  centralAirConditioning?: boolean;
  coveredParkingSlots?: number;
}

export interface PropertyOwner {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  profilePhoto?: string;
}

export interface Property {
  _id: string;
  title: string;
  slug?: string;
  description?: string;
  category: PropertyCategory;
  purpose: PropertyPurpose;
  city: string;
  cityId?: string;
  area: string;
  address: string;
  landmark?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  pricing: PropertyPricing;
  photos: PropertyPhoto[];
  amenities: string[];
  contactPhone?: string;
  contactWhatsapp?: string;
  nearbyPlaces?: NearbyPlace[];
  status: string;
  isVerified?: boolean;
  isFeatured?: boolean;
  dataQualityScore?: number;
  views?: number;
  inquiries?: number;
  wishlistCount?: number;
  owner?: PropertyOwner;
  isPublicPreview?: boolean;
  
  // Category specific fields
  pgDetails?: PGDetails;
  residentialDetails?: ResidentialDetails;
  commercialDetails?: CommercialDetails;

  // Compatibility virtuals
  name?: string;
  minRent?: number;
  maxRent?: number;
  propertyType?: string;
  availableBeds?: number;
  totalBeds?: number;
}

export interface PropertySearchParams {
  category?: PropertyCategory | 'all';
  purpose?: PropertyPurpose | 'all';
  city?: string;
  area?: string;
  areas?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  q?: string;
  isVerified?: boolean | string;
  isFeatured?: boolean | string;
  sort?: 'popular' | 'price_asc' | 'price_desc' | 'newest';
  page?: number;
  limit?: number;

  // PG filters
  gender?: 'male' | 'female' | 'any';
  food?: 'veg' | 'nonveg' | 'both' | 'none';
  ac?: boolean | string;
  sharingType?: string;

  // Flat filters
  bhk?: string;
  furnishingStatus?: 'unfurnished' | 'semi_furnished' | 'fully_furnished';
  residentialSubtype?: string;

  // Commercial filters
  commercialSubtype?: string;
  fitoutStatus?: string;
}

export interface PropertySearchResult {
  properties: Property[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PropertySuggestion {
  id: string;
  title: string;
  area: string;
  city: string;
  category: PropertyCategory;
  purpose: PropertyPurpose;
  price?: number;
  image?: string | null;
}
