import { Context } from '../types';
import { Prisma } from '@prisma/client';

interface EarthquakeFilter {
  minMagnitude?: number;
  maxMagnitude?: number;
  fromDate?: string;
  toDate?: string;
  location?: string;
}

interface PaginationInput {
  skip?: number;
  take?: number;
}

export const resolvers = {
  Query: {
    earthquakes: async (
      _parent: unknown,
      args: {
        filter?: EarthquakeFilter;
        pagination?: PaginationInput;
      },
      context: Context
    ) => {
      const where: Prisma.EarthquakeWhereInput = {};

      if (args.filter) {
        const { minMagnitude, maxMagnitude, fromDate, toDate, location } =
          args.filter;

        if (minMagnitude !== undefined || maxMagnitude !== undefined) {
          where.magnitude = {};
          if (minMagnitude !== undefined) where.magnitude.gte = minMagnitude;
          if (maxMagnitude !== undefined) where.magnitude.lte = maxMagnitude;
        }

        if (fromDate || toDate) {
          where.date = {};
          if (fromDate) where.date.gte = new Date(fromDate);
          if (toDate) where.date.lte = new Date(toDate);
        }

        if (location) {
          where.location = { contains: location, mode: 'insensitive' };
        }
      }

      const totalCount = await context.prisma.earthquake.count({ where });

      const skip = args.pagination?.skip || 0;
      const take = args.pagination?.take || 10;

      const earthquakes = await context.prisma.earthquake.findMany({
        where,
        orderBy: { date: 'desc' },
        skip,
        take,
      });

      const formattedEarthquakes = earthquakes.map((eq) => ({
        ...eq,
        date: eq.date.toISOString(),
        createdAt: eq.createdAt.toISOString(),
        updatedAt: eq.updatedAt.toISOString(),
      }));

      return {
        edges: formattedEarthquakes,
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
      const earthquake = await context.prisma.earthquake.findUnique({
        where: { id },
      });

      if (!earthquake) return null;

      return {
        ...earthquake,
        date: earthquake.date.toISOString(),
        createdAt: earthquake.createdAt.toISOString(),
        updatedAt: earthquake.updatedAt.toISOString(),
      };
    },
  },

  Mutation: {
    createEarthquake: async (
      _parent: unknown,
      {
        input,
      }: { input: { location: string; magnitude: number; date: string } },
      context: Context
    ) => {
      const earthquake = await context.prisma.earthquake.create({
        data: {
          ...input,
          date: new Date(input.date),
        },
      });

      return {
        ...earthquake,
        date: earthquake.date.toISOString(),
        createdAt: earthquake.createdAt.toISOString(),
        updatedAt: earthquake.updatedAt.toISOString(),
      };
    },

    deleteEarthquake: async (
      _parent: unknown,
      { id }: { id: string },
      context: Context
    ) => {
      const earthquake = await context.prisma.earthquake.delete({
        where: { id },
      });

      return {
        ...earthquake,
        date: earthquake.date.toISOString(),
        createdAt: earthquake.createdAt.toISOString(),
        updatedAt: earthquake.updatedAt.toISOString(),
      };
    },
  },
};
