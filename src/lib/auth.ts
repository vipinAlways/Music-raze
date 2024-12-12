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
     
        if (!user?.email) {
          console.log('No email found for the user.');
          return false; 
        }

       
        const existingUser = await db.user.findFirst({
          where: {
            email: user.email,
          },
        });

        if (existingUser) {
          console.log('User already exists. Signing in.');
          return true;
        }

       
        await db.user.create({
          data: {
            email: user.email,
            provider: "Google",
            userName: user.name ?? '', 
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
