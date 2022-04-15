const {ApolloServer, gql} = require('apollo-server');
const {buildSubgraphSchema} = require('@apollo/subgraph');
const fs = require('fs');
require("./opentelemetry.js");

let data = JSON.parse(fs.readFileSync('../speakers.json'));

const typeDefs = gql``

const resolvers = {
    Query: {
        operation(parent, args, context, info) {
            return data;
        }
    },

    /*
    MyEntity: {
      __resolveReference(reference, context,info) {
          return data
      }
    }
    */
};

const server = new ApolloServer({
    schema: buildSubgraphSchema({
        typeDefs,
        resolvers,
        datasources: () => {
            return {
                speakers: data
            }
        }})
});

const port = 4001;
const subgraphName = 'speakers';

server
  .listen({port})
  .then(({url}) => {
    console.log(`🚀 Subgraph ${subgraphName} running at ${url}`);
  })
  .catch(err => {
    console.error(err);
  });