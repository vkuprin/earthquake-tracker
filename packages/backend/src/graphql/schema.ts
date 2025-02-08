export const typeDefs = `#graphql
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
    earthquakes(
        filter: EarthquakeFilter
        pagination: PaginationInput
    ): EarthquakesResponse!
    earthquake(id: ID!): Earthquake
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

type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    totalCount: Int!
}

type EarthquakesResponse {
    edges: [Earthquake!]!
    pageInfo: PageInfo!
}

type Mutation {
    createEarthquake(input: EarthquakeInput!): Earthquake!
    updateEarthquake(id: ID!, input: UpdateEarthquakeInput!): Earthquake!
    deleteEarthquake(id: ID!): Earthquake
}
`;

import { Context } from '../types';

export const resolvers = {
  Query: {
    earthquakes: async (_parent: unknown, args: any, context: Context) => {
      const { filter = {}, pagination = {} } = args;
      const { skip = 0, take = 10 } = pagination;
      const where: any = {};

      if (filter.minMagnitude || filter.maxMagnitude) {
        where.magnitude = {};
        if (filter.minMagnitude) where.magnitude.gte = filter.minMagnitude;
        if (filter.maxMagnitude) where.magnitude.lte = filter.maxMagnitude;
      }

      if (filter.fromDate || filter.toDate) {
        where.date = {};
        if (filter.fromDate) where.date.gte = new Date(filter.fromDate);
        if (filter.toDate) where.date.lte = new Date(filter.toDate);
      }

      if (filter.location) {
        where.location = { contains: filter.location };
      }

      const [earthquakes, totalCount] = await Promise.all([
        context.prisma.earthquake.findMany({
          where,
          orderBy: { date: 'desc' },
          skip,
          take,
        }),
        context.prisma.earthquake.count({ where }),
      ]);

      return {
        edges: earthquakes,
        pageInfo: {
          hasNextPage: skip + take < totalCount,
          hasPreviousPage: skip > 0,
          totalCount,
        },
      };
    },
    earthquake: async (
      _parent: unknown,
      { id }: { id: string },
      context: Context
    ) => {
      return context.prisma.earthquake.findUnique({
        where: { id },
      });
    },
  },
  Mutation: {
    createEarthquake: async (
      _parent: unknown,
      { input }: any,
      context: Context
    ) => {
      return context.prisma.earthquake.create({
        data: {
          ...input,
          date: new Date(input.date),
        },
      });
    },
    updateEarthquake: async (
      _parent: unknown,
      { id, input }: any,
      context: Context
    ) => {
      return context.prisma.earthquake.update({
        where: { id },
        data: {
          ...input,
          date: input.date ? new Date(input.date) : undefined,
        },
      });
    },
    deleteEarthquake: async (
      _parent: unknown,
      { id }: { id: string },
      context: Context
    ) => {
      return context.prisma.earthquake.delete({
        where: { id },
      });
    },
  },
};
