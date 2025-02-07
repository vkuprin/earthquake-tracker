import express, { RequestHandler } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { json } from 'body-parser';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';

async function bootstrap() {
  const app = express();
  const prisma = new PrismaClient();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(
    '/',
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context: async () => ({ prisma }),
    }) as RequestHandler
  );

  const port = process.env.PORT || 4000;
  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`🚀 Server ready at http://localhost:${port}/`);
  });

  app.use(
    (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      console.error('Error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  );
}

bootstrap().catch((err) => {
  console.error('Bootstrap error:', err);
  process.exit(1);
});
