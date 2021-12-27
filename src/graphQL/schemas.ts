import { makeExecutableSchema } from '@graphql-tools/schema';

import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';

export const executableSchema = makeExecutableSchema({
    typeDefs,
    resolvers
});