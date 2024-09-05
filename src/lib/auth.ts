// import { NextAuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import { db } from "@/lib/db"; // Assuming your Prisma setup is in db.ts

// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(db), // Prisma adapter to use your Prisma setup
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID as string, // Your Google client ID
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, // Your Google client secret
//     }),


   
//   ],
  
//   callbacks: {
//     async jwt({ token, user}) {
//       if (user) {
//         token.id = user.id;
//       }
//       return token;
//     },
//     async session({ session, user }) {
      
//       session.user.id = user.id
//       return session;
//     },
//   },
//   session: {
//     strategy: "jwt",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   pages: {
//     signIn: "/auth/signin",
//   },
// };
