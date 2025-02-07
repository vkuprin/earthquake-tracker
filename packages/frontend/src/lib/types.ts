export interface Earthquake {
  id: string;
  location: string;
  magnitude: number;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EarthquakeEdge {
  node: Earthquake;
}

export interface FilterState {
  location?: string;
  magnitude?: number;
  date?: string;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
  totalCount: number;
}

export interface FormData {
  location: string;
  magnitude: number;
  date: string;
}

export interface EarthquakesResponse {
  earthquakes: {
    edges: Earthquake[];
    pageInfo: PageInfo;
  };
}

export interface EarthquakeMutationResponse {
  createEarthquake: Earthquake;
}

export interface UpdateEarthquakeMutationResponse {
  updateEarthquake: Earthquake;
}
