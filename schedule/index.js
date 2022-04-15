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
    speakers: [Speaker]
}

extend type Speaker @key(fields: "link { href }") {
  link: Link @external
}

type Link {
    href: String
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

    Talk: {
        speakers(talk) {
            return talk.speakers.map(speaker => {
                if (speaker !== undefined && speaker.link !== undefined) {
                    return {link:  { href: speaker.link.href } };
                } else {
                    return {};
                }
            });
        }
    }
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