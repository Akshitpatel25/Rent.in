import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { dbConnect } from "@/db/dbConnect";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";

 const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID! as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET! as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await dbConnect();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(
          Math.random().toString(36).slice(2),
          salt
        );

        const existingUser = await User.findOne({ email: profile?.email });
        if (!existingUser) {
          await User.create({
            email: profile!.email,
            password: hashedPassword,
            isGoogleSignedIn: true,
          });
        }
        return true;
      } catch (error:any) {
        console.error("Error saving user:", error);
        return false;
      }
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.email = profile.email;
        token.name = profile.name;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Directly use NextAuth as the handler for both GET and POST methods
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
