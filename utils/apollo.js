const ApolloClient = require('apollo-boost').ApolloClient;
const InMemoryCache = require('apollo-cache-inmemory').InMemoryCache;
const createHttpLink = require('apollo-link-http').createHttpLink;
const fetch = require('cross-fetch/polyfill').fetch;


const apollo_client = new ApolloClient({
    link: createHttpLink({
        uri: 'http://localhost:8080/v1/graphql',
        fetch: fetch,
        headers: {
            "content-type": "application/json",
            "x-hasura-admin-secret": "thisismyadminsecret" 
        }
    }),
    cache: new InMemoryCache()
})

module.exports = apollo_client;