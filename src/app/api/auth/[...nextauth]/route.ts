/* eslint-disable react-hooks/rules-of-hooks */
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { dbConnect } from "@/db/dbConnect";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { useRouter } from "next/navigation";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await dbConnect();
        const router = useRouter();

        if (!profile?.email) {
          console.error("No email found in profile during sign-in.");
          return false;
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email: profile.email });

        if (!existingUser) {
          // Generate a random password for Google users
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(
            Math.random().toString(36).slice(2),
            salt
          );

          // Create a new user
          await User.create({
            email: profile.email,
            password: hashedPassword,
            isGoogleSignedIn: true,
          });

          router.push("/dashboard");
        }

        return true; // Proceed with sign-in
      } catch (error: any) {
        console.error("Error during sign-in:", error);
        return false; // Reject sign-in
      }
    },
    async jwt({ token, account, profile }) {
      // Add user details to the token
      if (account && profile) {
        token.email = profile.email;
        token.name = profile.name;
      }
      return token;
    },
    async session({ session, token }) {
      // Add custom properties to the session
      session.user = {
        email: token.email,
        name: token.name,
      };
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to the dashboard after sign-in
      return "/dashboard";
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
