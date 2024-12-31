import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import { dbConnect } from "@/db/dbConnect";
import User from "@/models/user.model";
import bcrypt from 'bcryptjs'

// dbConnect();

export const authOptions: NextAuthOptions = {
  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    
  ],
  callbacks: {
    // here we get the user details from google and we can create a new user in our database
    // if user is not present in our database.
    async signIn({ user, account, profile }) {
      try {
        await dbConnect();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Math.random().toString(36).slice(2), salt);
        
        
        // Check if the user already exists
        const existingUser = await User.findOne({ email: profile.email });
        if (!existingUser) {
          await User.create({
            email: profile.email,
            password: hashedPassword,
            isGoogleSignedIn: true
          });
        }
        return true; // Allow sign-in
      } catch (error) {
        console.error("Error saving user:", error);
        return false; 
      }
    },

    async jwt({ token, account, profile }) {
      if (account && profile) {
        // token.id = profile.id;
        token.email = profile.email;
        token.name = profile.name;}
      return token;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
