import './App.css';
import { Outlet } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import Navbar from './components/Navbar';

// Create an HTTP link to the GraphQL server
const httpLink = createHttpLink({
  uri: '/graphql', // Adjust the URI if your server is hosted elsewhere
});

// Set up the authentication link to include the token in headers
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token'); // Retrieve the token from localStorage
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Create the Apollo Client
const client = new ApolloClient({
  link: authLink.concat(httpLink), // Combine the auth and HTTP links
  cache: new InMemoryCache(), // Use an in-memory cache for Apollo Client
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;