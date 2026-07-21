import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, profile }) {
      if (profile) {
        token.provider = profile?.iss?.includes("accounts.google")
          ? "google"
          : "github";
      }
      return token;
    },

    async session({ session, token }) {
      session.user.provider = token.provider as string;
      return session;
    },
  },

  secret: process.env.AUTH_SECRET,
});