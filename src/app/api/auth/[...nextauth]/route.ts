import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import { dbConnect } from "@/db/dbConnect";
import User from "@/models/user.model";
import bcrypt from 'bcryptjs';

// Initialize database connection
dbConnect();

// Configure NextAuth options
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (!profile?.email) {
          console.error("Profile email is missing");
          return false;
        }

        await dbConnect();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Math.random().toString(36).slice(2), salt);

        const existingUser = await User.findOne({ email: profile.email });
        if (!existingUser) {
          await User.create({
            email: profile.email,
            password: hashedPassword,
            isGoogleSignedIn: true,
          });
        }
        return true;
      } catch (error) {
        console.error("Error in sign-in callback:", error);
        return false;
      }
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.email = profile.email ?? token.email;
        token.name = profile.name ?? token.name;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Create a handler for NextAuth
const handler = NextAuth(authOptions);

// Export HTTP methods
export { handler as GET, handler as POST };
