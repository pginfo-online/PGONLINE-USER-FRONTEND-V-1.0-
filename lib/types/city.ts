export interface City {
  _id: string;
  name: string;
  slug: string;
  state?: string;
  country?: string;
  description?: string;
  order?: number;
  aliases?: string[];
  image?: {
    url?: string | null;
    publicId?: string | null;
  };
}

export interface Area {
  _id: string;
  name: string;
  slug: string;
  order?: number;
  image?: string;
  pgCount?: number;
  city?: string;
}
