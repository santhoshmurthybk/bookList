/* istanbul ignore file */

const {
  ApolloServer
} = require('apollo-server-express');
const fs = require('fs');
const express = require('express');
const resolvers = require('./resolvers');
const connectDB = require('./dbConnection/connection')

const serverStartUp = async () => {
  let typeDefs;
  try {
    typeDefs = fs.readFileSync('./schema/schema.graphql', {
      encoding: 'utf-8'
    });
  } catch (error) {
    throw new Error(`Error while reading the file schema.graphql due to ${error.message}`);
  }

  const apollo = new ApolloServer({
    typeDefs,
    resolvers
  })

  const app = express();
  apollo.applyMiddleware({
    app
  });

  await connectDB();

  app.listen({
      port: 4000
    }, () =>
    console.log(`Server ready at http://localhost:4000`)
  );
}

serverStartUp()
  .then()
  .catch(err => {
    console.error(err)
  })