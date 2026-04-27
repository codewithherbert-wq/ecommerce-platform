import NextAuth, { type DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import {
  users,
  accounts,
  sessions,
  verificationTokens,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "customer" | "admin";
    } & DefaultSession["user"];
  }
  interface User {
    role?: "customer" | "admin";
  }
}

const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const providers = [];

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

// Email + password credentials provider (always enabled).
providers.push(
  Credentials({
    id: "credentials",
    name: "Email and password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    authorize: async (credentials) => {
      if (!credentials?.email || !credentials?.password) return null;
      const email = String(credentials.email).toLowerCase().trim();
      const password = String(credentials.password);

      const [existing] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      if (!existing || !existing.passwordHash) return null;
      const ok = await bcrypt.compare(password, existing.passwordHash);
      if (!ok) return null;
      return {
        id: existing.id,
        email: existing.email,
        name: existing.name,
        image: existing.image,
        role: existing.role as "customer" | "admin",
      };
    },
  })
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
  },
  providers,
  callbacks: {
    async signIn({ user }) {
      // Promote admins based on ADMIN_EMAILS env var.
      if (user.email && adminEmails.includes(user.email.toLowerCase())) {
        try {
          await db
            .update(users)
            .set({ role: "admin" })
            .where(eq(users.email, user.email));
        } catch {
          // Ignore during initial sign-in before adapter creates the row.
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role?: string }).role ?? "customer";
      }
      if (token.email && !token.role) {
        const row = await db
          .select({ id: users.id, role: users.role })
          .from(users)
          .where(eq(users.email, String(token.email)))
          .limit(1);
        if (row[0]) {
          token.id = row[0].id;
          token.role = row[0].role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? session.user.id;
        session.user.role =
          ((token.role as "customer" | "admin") ?? "customer");
      }
      return session;
    },
  },
});

export const enabledProviders = {
  google: Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET),
  credentials: true,
};
