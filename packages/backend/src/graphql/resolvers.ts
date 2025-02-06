import { Context } from '../types';

export const resolvers = {
  Query: {
    earthquakes: async (
      _parent: unknown,
      _args: unknown,
      { prisma }: Context
    ) => {
      return prisma.earthquake.findMany({
        orderBy: { date: 'desc' },
      });
    },
    earthquake: async (
      _parent: unknown,
      { id }: { id: string },
      { prisma }: Context
    ) => {
      return prisma.earthquake.findUnique({
        where: { id },
      });
    },
  },
  Mutation: {
    createEarthquake: async (
      _parent: unknown,
      {
        input,
      }: { input: { location: string; magnitude: number; date: string } },
      { prisma }: Context
    ) => {
      return prisma.earthquake.create({
        data: {
          ...input,
          date: new Date(input.date),
        },
      });
    },
    updateEarthquake: async (
      _parent: unknown,
      {
        id,
        input,
      }: {
        id: string;
        input: { location?: string; magnitude?: number; date?: string };
      },
      { prisma }: Context
    ) => {
      return prisma.earthquake.update({
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
      { prisma }: Context
    ) => {
      return prisma.earthquake.delete({
        where: { id },
      });
    },
  },
};
