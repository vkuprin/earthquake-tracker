import express, { Router, RequestHandler } from 'express';
import { ApolloServer } from '@apollo/server';
import {
  expressMiddleware,
  ExpressContextFunctionArgument,
} from '@apollo/server/express4';
import { json } from 'body-parser';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';

interface Context {
  prisma: PrismaClient;
}

async function bootstrap() {
  const app = express();
  const router = Router();
  const prisma = new PrismaClient();

  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
  });

  await server.start();

  const apolloMiddleware = expressMiddleware(server, {
    context: async (_: ExpressContextFunctionArgument): Promise<Context> => ({
      prisma,
    }),
  }) as RequestHandler;

  router.use(cors, json, apolloMiddleware);

  app.use('/graphql', router);

  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
  });

  return { app, server };
}

bootstrap().catch((err) => {
  console.error('Bootstrap error:', err);
  process.exit(1);
});
