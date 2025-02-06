import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Earthquake {
    id: ID!
    location: String!
    magnitude: Float!
    date: String!
    createdAt: String!
    updatedAt: String!
  }

  input EarthquakeInput {
    location: String!
    magnitude: Float!
    date: String!
  }

  input UpdateEarthquakeInput {
    location: String
    magnitude: Float
    date: String
  }

  type Query {
    earthquakes: [Earthquake!]!
    earthquake(id: ID!): Earthquake
  }

  type Mutation {
    createEarthquake(input: EarthquakeInput!): Earthquake!
    updateEarthquake(id: ID!, input: UpdateEarthquakeInput!): Earthquake!
    deleteEarthquake(id: ID!): Earthquake!
  }
`;
