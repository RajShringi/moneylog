import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";
import Credentials from "next-auth/providers/credentials";

export const authConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        await dbConnect();
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }

        if (
          typeof credentials.email !== "string" ||
          typeof credentials.password !== "string"
        ) {
          return null;
        }

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user._id,
          username: user.username,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.email = token.email;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
};
