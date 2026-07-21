import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { supabaseAdmin } from "@/lib/supabase-admin";

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
	async signIn({ user, account }) {

	  const payload = {
		email: user.email,
		name: user.name,
		avatar_url: user.image,
		provider: account?.provider,
		last_login: new Date().toISOString(),
	  };

	  console.log("UPSERT PAYLOAD:", payload);

	  const { data, error } = await supabaseAdmin
		.from("users_meta")
		.upsert(payload, {
		  onConflict: "email",
		})
		.select();

	  console.log("UPSERT DATA:", data);
	  console.log("UPSERT ERROR:", error);

	  return true;
	},  

    async jwt({ token, account }) {
      console.log("JWT CALLBACK");

      if (account?.provider) {
        token.provider = account.provider;
      }

      console.log("Token:", token);

      return token;
    },

    async session({ session, token }) {
      console.log("SESSION CALLBACK");
      console.log("Session:", session);
      console.log("Token:", token);

      (session.user as any).provider = token.provider;

      return session;
    },
  },

  secret: process.env.AUTH_SECRET,
});