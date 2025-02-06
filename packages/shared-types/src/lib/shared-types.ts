export interface Earthquake {
  id: string;
  location: string;
  magnitude: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface EarthquakeInput {
  location: string;
  magnitude: number;
  date: string;
}

export interface UpdateEarthquakeInput {
  location?: string;
  magnitude?: number;
  date?: string;
}
