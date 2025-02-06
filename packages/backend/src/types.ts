import { BaseContext } from '@apollo/server';
import { PrismaClient } from '@prisma/client';

export interface Context extends BaseContext {
  prisma: PrismaClient;
}
