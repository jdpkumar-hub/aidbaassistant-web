import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/lib/auth-validation";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { getRequestMeta } from "@/lib/security";

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
    Credentials({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        const meta = await getRequestMeta();

        if (!parsed.success) {
          await writeAuditLog({
            action: "LOGIN_FAILED",
            ...meta,
            metadata: { reason: "invalid_payload" },
          });
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user?.passwordHash) {
          await writeAuditLog({
            action: "LOGIN_FAILED",
            ...meta,
            metadata: { email: parsed.data.email, reason: "unknown_user" },
          });
          return null;
        }

        if (user.status === "DISABLED") {
          await writeAuditLog({
            userId: user.id,
            action: "LOGIN_FAILED",
            ...meta,
            metadata: { reason: "disabled_user" },
          });
          return null;
        }

        if (!user.emailVerified) {
          await writeAuditLog({
            userId: user.id,
            action: "LOGIN_FAILED",
            ...meta,
            metadata: { reason: "email_not_verified" },
          });
          return null;
        }

        const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!valid) {
          await writeAuditLog({
            userId: user.id,
            action: "LOGIN_FAILED",
            ...meta,
            metadata: { reason: "invalid_password" },
          });
          return null;
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date(), status: "ACTIVE" },
        });
        await writeAuditLog({ userId: user.id, action: "LOGIN_SUCCESS", ...meta });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          status: "ACTIVE",
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "credentials") return true;
      if (!user.email) return false;

      const meta = await getRequestMeta();
      const dbUser = await prisma.user.upsert({
        where: { email: user.email.toLowerCase() },
        update: {
          name: user.name,
          image: user.image,
          emailVerified: new Date(),
          status: "ACTIVE",
          lastLoginAt: new Date(),
        },
        create: {
          email: user.email.toLowerCase(),
          name: user.name,
          firstName: user.name?.split(" ")[0],
          lastName: user.name?.split(" ").slice(1).join(" ") || undefined,
          image: user.image,
          emailVerified: new Date(),
          status: "ACTIVE",
          subscription: {
            create: {
              plan: "Free",
              status: "TRIALING",
            },
          },
        },
      });

      if (dbUser.status === "DISABLED") return false;

      await prisma.account.upsert({
        where: {
          provider_providerAccountId: {
            provider: account?.provider ?? "unknown",
            providerAccountId: account?.providerAccountId ?? profile?.sub ?? dbUser.id,
          },
        },
        update: {
          access_token: account?.access_token,
          refresh_token: account?.refresh_token,
          expires_at: account?.expires_at,
          token_type: account?.token_type,
          scope: account?.scope,
          id_token: account?.id_token,
        },
        create: {
          userId: dbUser.id,
          type: account?.type ?? "oauth",
          provider: account?.provider ?? "unknown",
          providerAccountId: account?.providerAccountId ?? profile?.sub ?? dbUser.id,
          access_token: account?.access_token,
          refresh_token: account?.refresh_token,
          expires_at: account?.expires_at,
          token_type: account?.token_type,
          scope: account?.scope,
          id_token: account?.id_token,
        },
      });

      await writeAuditLog({ userId: dbUser.id, action: "LOGIN_SUCCESS", ...meta });
      return true;
    },
    async jwt({ token, user }) {
      const email = user?.email ?? token.email;
      if (email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
          select: { id: true, role: true, status: true },
        });
        if (dbUser) {
          token.appUserId = dbUser.id;
          token.role = dbUser.role;
          token.status = dbUser.status;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.appUserId ?? token.sub ?? "";
        session.user.role = token.role ?? "USER";
        session.user.status = token.status ?? "ACTIVE";
      }
      return session;
    },
  },

  secret: process.env.AUTH_SECRET,
});