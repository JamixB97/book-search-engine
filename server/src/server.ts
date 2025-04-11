import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './schemas/typeDefs.js';
import { resolvers } from './schemas/resolvers.js';
import express from 'express';
import path from 'node:path';
import db from './config/connection.js';
import { authenticateToken } from './services/auth.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Function to start the Apollo Server
const startApolloServer = async () => {

  await server.start();
  await db;
  

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Middleware for GraphQL endpoint
  app.use(
    '/graphql',
    expressMiddleware(server, {
        context: authenticateToken as any
    }),
  );
  // Serve static files from the React app
  // if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../client/dist')));

    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });
  // }
  
  // Start the server
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });

};

startApolloServer();