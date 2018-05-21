import * as graphqlHTTP from 'express-graphql';
import {
  GraphQLFieldConfigMap,
  GraphQLInt,
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLString,
  Kind,
} from 'graphql';
import * as _ from 'lodash';

import * as express from 'express';
import { Account } from './account';
import { Block } from './block';
import { DecodedTransaction, Erc20TransactionType } from './transaction';
import { web3 } from './web3';

const schema = new GraphQLSchema({
  types: [DecodedTransaction, Erc20TransactionType],
  query: new GraphQLObjectType({
    name: 'Query',
    description: 'Query root',
    fields: {
      account: {
        type: Account,
        args: { address: { type: GraphQLString } },
        resolve: (obj, { address }) => ({ address }),
      },
      block: {
        type: Block,
        args: { number: { type: GraphQLInt }, hash: { type: GraphQLString } },
        resolve: (obj, { number, hash }) => number ? web3.eth.getBlock(number, true) : web3.eth.getBlock(hash, true)
      },
      blocks: {
        type: new GraphQLList(Block),
        args: { from: { type: GraphQLInt }, to: { type: GraphQLInt }, numbers: { type: new GraphQLList(GraphQLInt) }, hashes: { type: new GraphQLList(GraphQLString) } },
        resolve: (obj, { from, to, hashes, numbers }) => {
          if (hashes) {
            console.log(hashes);
            return Promise.all(hashes.map(i => web3.eth.getBlock(i, true)));
          }
          if (numbers) {
            console.log(numbers);
            return Promise.all(numbers.map(i => web3.eth.getBlock(i, true)));
          }
          return Promise.all(_.range(from, to + 1).map(i => web3.eth.getBlock(i, true)));
        },
      },
    },
  })
});

const app = express();
app.use('/graphql', graphqlHTTP({ schema, graphiql: true }));

app.listen(4000);

console.log('Running a GraphQL API server at http://localhost:4000/graphql');
