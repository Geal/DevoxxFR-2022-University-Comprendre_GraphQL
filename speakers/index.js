const {ApolloServer, gql} = require('apollo-server');
const {buildSubgraphSchema} = require('@apollo/subgraph');
const fs = require('fs');
require("./opentelemetry.js");

let data = JSON.parse(fs.readFileSync('../speakers.json'));
const typeDefs = gql`
type Speaker @key(fields: "link { href }") {
    firstName: String
    lastName: String
    twitter: String
    link: Link
}

type Query {
    speakers: [Speaker]
}

type Link {
    href: String
}
`

const resolvers = {
    Query: {
        speakers: (parent, args, context, info) => {
            return data;
        }
    },

    Speaker: {
        __resolveReference({link}, _) {
            return data.find(speaker => speaker.links[0].href == link.href);
        }
    }
};

const server = new ApolloServer({
    schema: buildSubgraphSchema({
        typeDefs,
        resolvers,
        dataSources: () => {
            return {
                speakers: data
            };
        },
    })
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