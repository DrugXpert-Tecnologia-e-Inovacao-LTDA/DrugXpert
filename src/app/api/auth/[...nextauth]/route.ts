import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginUser } from "@/lib/actions/user.actions";

const authOptions: AuthOptions = {
  providers: [
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
    strategy: "jwt", // Use string directly
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
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure this is set in your environment variables
};

// Define handlers for each HTTP method
const handler = NextAuth(authOptions);

// Export named handlers for GET and POST
export const GET = handler;
export const POST = handler;