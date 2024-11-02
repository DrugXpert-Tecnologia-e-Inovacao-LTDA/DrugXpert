import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { loginUser, createOrUpdateUserWithGoogle } from "@/lib/actions/user.actions";

const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        // Mapear o campo 'sub' como 'id' para compatibilidade com NextAuth
        return {
          id: profile.sub,
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
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 horas
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Adiciona o ID do usuário ao token
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.id = token.id; // Adiciona o ID do token à sessão
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        // Cria ou atualiza o usuário ao fazer login com Google
        const googleUser = await createOrUpdateUserWithGoogle(user);
        if (googleUser) {
          return true;
        }
        return false;
      }
      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };



