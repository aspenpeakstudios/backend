import { createAuth } from '@keystone-next/auth';
import { config, createSchema } from '@keystone-next/keystone/schema';
import 'dotenv/config';
import {
  withItemData,
  statelessSessions,
} from '@keystone-next/keystone/session';
import { User } from './schemas/User';
import { Product } from './schemas/Product';

const databaseURL =
  process.env.DATABASE_URL || 'mongodb://localhost/keystone-sick-fits-tutorial';

// generate session cookie
const sessionConfig = {
  // maxAge: 60 * 60 * 24 * 360, // How long should they stay signed in?  360 days
  maxAge: 60 * 60 * 24 * 1, // 1 day
  secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
    // TODO: Add in initial roles here
  },
});

export default withAuth(
  config({
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL],
        credentials: true,
      },
    },
    db: {
      adapter: 'mongoose',
      url: databaseURL,
      // TODO: Add data seeding here
    },
    lists: createSchema({
      // Schema items go in here
      User,
      Product,
    }),
    ui: {
      // TODO: change this for roles.
      // Show UI only for people who pass this test.
      isAccessAllowed: ({ session }) =>
        // console.log(session);
        !!session?.data,
    },
    // TODO:  Add session values here
    session: withItemData(statelessSessions(sessionConfig), {
      // GraphQL query
      User: 'id name email',
    }),
  })
);
