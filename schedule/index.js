const {ApolloServer, gql} = require('apollo-server');
const {buildSubgraphSchema} = require('@apollo/subgraph');
const fs = require('fs');
require("./opentelemetry.js");

let slots = JSON.parse(fs.readFileSync('../wednesday.json')).slots;


const typeDefs = gql`
type Slot {
    roomId: ID!
    slotId: ID!
    talk: Talk
    roomSetup: String
}

type Talk {
    trackId: String
    talkType: String
    talkId: ID!
    title: String
}

type Query {
    slots: [Slot]
}
`

const resolvers = {
    Query: {
        slots(_, __, ___) {
            return slots;
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
    })
});

const port = 4002;
const subgraphName = 'schedule';

server
  .listen({port})
  .then(({url}) => {
    console.log(`🚀 Subgraph ${subgraphName} running at ${url}`);
  })
  .catch(err => {
    console.error(err);
  });