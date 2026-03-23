## auth.ts
This is a NextAuth/Auth.js v5 config file that uses Prisma as the adapter and CredentialsProvider for email/password login. It verifies users manually in authorize(), uses JWT sessions, custom sign-in pages, and exports handlers, auth, signIn, and signOut using the v5 API.

**References**
- https://next-auth.js.org/configuration/options
- https://next-auth.js.org/providers/credentials

## route.ts
- This file will use handlers from auth.ts