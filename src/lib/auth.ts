import { db } from "@/lib/db";
import { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        // Ensure user email exists
        if (!user?.email) {
          console.log('No email found for the user.');
          return false; // Prevent sign-in
        }

        // Check if user already exists in the database
        const existingUser = await db.user.findFirst({
          where: {
            email: user.email,
          },
        });

        if (existingUser) {
          console.log('User already exists. Signing in.');
          return true;
        }

        // Create a new user in the database
        await db.user.create({
          data: {
            email: user.email,
            provider: "Google",
            userName: user.name ?? '', // Use empty string if name is undefined
          },
        });

        console.log('New user created successfully.');
        return true;
      } catch (error) {
        console.error('Error during signIn callback:', error);
        return false; 
      }
    },
  },
};
