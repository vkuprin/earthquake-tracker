export const typeDefs = `#graphql
type Earthquake {
    id: ID!
    location: String!
    magnitude: Float!
    date: String!
    createdAt: String!
    updatedAt: String!
}

type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    totalCount: Int!
}

type EarthquakeConnection {
    edges: [Earthquake!]!
    pageInfo: PageInfo!
}

input EarthquakeInput {
    location: String!
    magnitude: Float!
    date: String!
}

input EarthquakeFilter {
    minMagnitude: Float
    maxMagnitude: Float
    fromDate: String
    toDate: String
    location: String
}

input PaginationInput {
    skip: Int
    take: Int
}

type Query {
    earthquakes(
        filter: EarthquakeFilter
        pagination: PaginationInput
    ): EarthquakeConnection!
    earthquake(id: ID!): Earthquake
}

type Mutation {
    createEarthquake(input: EarthquakeInput!): Earthquake!
    deleteEarthquake(id: ID!): Earthquake
}
`;
