import { prismaClient } from "@/lib/db";
import NextAuth from "next-auth/next";
import Google from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
  //   Google({
  //     clientId: process.env.GOOGLE_CLIENT_ID ?? '',
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
  //   }),
  // ],
  callbacks:{
   async signIn(params){
      try {
        console.log(params);
        if (!params.user?.email) {
          return false
        }
        await prismaClient.user.create({
          data:{
            email:params.user?.email,
            provider:"Google"
          }
        })
      } catch (error) {
        console.log(error);
      }
        return true
    }
  }
});


export {handler as GET , handler as POST}
