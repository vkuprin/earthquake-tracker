export interface Earthquake {
  id: string;
  location: string;
  magnitude: number;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FormData {
  location: string;
  magnitude: number;
  date: string;
}

export interface UpdateEarthquakeInput {
  location?: string;
  magnitude?: number;
  date?: string;
}

export interface EarthquakeMutationResponse {
  createEarthquake: Earthquake;
}

export interface UpdateEarthquakeMutationResponse {
  updateEarthquake: Earthquake;
}
