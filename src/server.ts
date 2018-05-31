import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';
import { GraphQLSchema } from 'graphql';
import { importSchema } from 'graphql-import';
import { makeExecutableSchema } from 'graphql-tools';
import * as http from 'http';
import * as util from 'util';
import resolvers from './resolvers';

let app: express.Express;
let httpServer: http.Server;

export async function startServer(schema: GraphQLSchema): Promise<{}> {
  if (httpServer && httpServer.listening) {
    // Server is already started.
    return Promise.resolve({});
  }

  return new Promise((resolve, reject) => {
    app = express();
    app.use('/graphql', graphqlHTTP({ schema, graphiql: true }));
    httpServer = app.listen(4000, () => {
      console.log('Running a GraphQL API server at http://localhost:4000/graphql');
      resolve({});
    });
  });
}

export async function stopServer(): Promise<{}> {
  if (!httpServer || !httpServer.listening) {
    // Server is not started.
    return Promise.resolve({});
  }

  return new Promise((resolve, reject) => {
    httpServer.close(() => resolve({}));
  });
}
