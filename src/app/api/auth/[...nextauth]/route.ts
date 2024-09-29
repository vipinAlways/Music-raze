import { db } from "@/lib/db";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import Google from "next-auth/providers/google";

 export const authOptions :NextAuthOptions={ session:{
  strategy:'jwt'
},
providers: [
  Google({
    clientId: process.env.GOOGLE_CLIENT_ID ?? '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
  }),
],

callbacks:{
 async signIn(params){
    try {
      console.log(params);
      if (!params.user?.email) {
        return false
      }

      const existingUser =await  db.user.findFirst({
        where:{
          email:params.user.email
        }
      })

      if (existingUser) {
        return true
      }
      await db.user.create({
        data: {
          email: params.user?.email,
          provider: "Google",
          userName: params.user?.name ?? '',
          
        },
      });

      console.log();
      return true
    } catch (error) {
      console.log(error);
      return false
    }
  }
}} 
const handler = NextAuth(authOptions)


export {handler as GET , handler as POST,handler}
