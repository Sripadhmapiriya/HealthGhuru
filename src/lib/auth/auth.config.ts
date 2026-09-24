/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { DefaultSession, CredentialsSignin, NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { sql } from '@/lib/db';
import bcrypt from 'bcryptjs';

class SuspendedAccountError extends CredentialsSignin {
  code = "suspended";
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      tier?: string;
      adsEnabled?: boolean;
      isSubscribed?: boolean;
    } & DefaultSession["user"];
  }
  interface User {
    role?: string;
    tier?: string;
    adsEnabled?: boolean;
    isSubscribed?: boolean;
  }
}

export const authConfig: NextAuthConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET || "7f3e8f9d6c4a2b1e5a9d8f3c7e6b5a4d3c2b1e0f9d8c7b6a5d4e3f2a1b0c9d8",
  providers: [],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      try {
        const urlObj = new URL(url);
        const baseObj = new URL(baseUrl);
        if (urlObj.origin === baseObj.origin) {
          return url;
        }
      } catch {
        // Fallback to relative pathname if possible
      }
      return baseUrl;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.tier = (user as any).tier || 'free';
        token.adsEnabled = (user as any).adsEnabled ?? true;
        token.isSubscribed = (user as any).isSubscribed ?? false;
      }

      if (trigger === 'update' && session) {
        if (session.tier !== undefined) token.tier = session.tier;
        if (session.adsEnabled !== undefined) token.adsEnabled = session.adsEnabled;
        if (session.isSubscribed !== undefined) token.isSubscribed = session.isSubscribed;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.tier = (token.tier as string) || 'free';
        session.user.adsEnabled = (token.adsEnabled as boolean) ?? true;
        session.user.isSubscribed = (token.isSubscribed as boolean) ?? false;
      }
      return session;
    }
  }
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const cleanEmail = (credentials.email as string).trim().toLowerCase();
        
        const users = await sql`
          SELECT id, name, email, password_hash, role, status
          FROM users 
          WHERE LOWER(email) = ${cleanEmail}
        `;
        
        const user = users[0];
        if (!user) return null;
        if (user.status === 'suspended') {
          throw new SuspendedAccountError();
        }
        
        const passwordsMatch = await bcrypt.compare(
          credentials.password as string, 
          user.password_hash
        );
        
        if (passwordsMatch) {
          // Asynchronously record last login
          try {
            await sql`UPDATE users SET last_login_at = NOW() WHERE id = ${user.id}::uuid`;
          } catch {
            // Non-blocking
          }

          let tier = 'free';
          let adsEnabled = true;
          let isSubscribed = false;

          try {
            const plans = await sql`
              SELECT tier, ads_enabled 
              FROM user_plans 
              WHERE user_id = ${user.id}::uuid
            `;
            if (plans.length > 0) {
              tier = plans[0].tier || 'free';
              adsEnabled = plans[0].ads_enabled ?? true;
              isSubscribed = tier !== 'free' && adsEnabled === false;
            }
          } catch {
            // Non-blocking fallback
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            tier,
            adsEnabled,
            isSubscribed,
          };
        }
        
        return null;
      }
    })
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt(params) {
      const { token, trigger } = params;
      let updatedToken = await authConfig.callbacks!.jwt!(params);

      // Refresh plan from database if needed or on session update
      if (updatedToken?.id && (trigger === 'update' || updatedToken.tier === undefined)) {
        try {
          const plans = await sql`
            SELECT tier, ads_enabled 
            FROM user_plans 
            WHERE user_id = ${updatedToken.id as string}::uuid
          `;
          if (plans.length > 0) {
            const planTier = plans[0].tier || 'free';
            const planAdsEnabled = plans[0].ads_enabled ?? true;
            updatedToken.tier = planTier;
            updatedToken.adsEnabled = planAdsEnabled;
            updatedToken.isSubscribed = planTier !== 'free' && planAdsEnabled === false;
          }
        } catch {
          // Non-blocking
        }
      }

      return updatedToken;
    }
  }
});

