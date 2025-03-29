import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "correo@ejemplo.com" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        console.log("🔍 Buscando usuario en la base de datos...");
        const user = await prisma.user.findFirst({
            where: { email: credentials.email.trim().toLowerCase() }, // Normaliza el email
          });

        if (!user) {
          console.log("❌ Usuario no encontrado");
          throw new Error("Correo o contraseña incorrectos");
        }

        console.log("✅ Usuario encontrado:", user);

        const passwordMatch = await bcrypt.compare(credentials.password, user.password);
        console.log("🔍 Comparando contraseñas...");
        
        if (!passwordMatch) {
          console.log("❌ Contraseña incorrecta");
          throw new Error("Correo o contraseña incorrectos");
        }

        console.log("✅ Contraseña correcta, autenticando...");
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);

