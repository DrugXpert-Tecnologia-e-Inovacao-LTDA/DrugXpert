import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"; // Import Google provider
import { loginUser, createOrUpdateUserWithGoogle } from "@/lib/actions/user.actions"; // Import your user actions

const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      async profile(profile) {
        // Map Google profile to your user schema
        return {
          id: profile.id,
          email: profile.email,
          name: profile.name,
          picture: profile.picture,
          given_name: profile.given_name,
          family_name: profile.family_name,
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials?.email && credentials?.password) {
          const user = await loginUser(credentials.email, credentials.password);
          if (user) {
            return user;
          }
        }
        return null; // Return null if user is not found
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Attach user ID to the token
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.id = token.id; // Attach token ID to the session
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        // If the user is signing in with Google, create or update the user
        const googleUser = await createOrUpdateUserWithGoogle(user);
        if (googleUser) {
          return true; // Allow sign-in
        }
        return false; // Deny sign-in if user creation fails
      }
      return true; // Allow sign-in for other providers
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export const GET = handler;
export const POST = handler;
