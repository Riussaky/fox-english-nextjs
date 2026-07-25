import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Resend from "next-auth/providers/resend";
import { db } from "@/lib/db";

const resendProvider = Resend({
  apiKey: process.env.RESEND_API_KEY,
  from: process.env.RESEND_FROM_EMAIL,
});

// Sin RESEND_API_KEY (desarrollo local) imprimimos el link mágico en la
// consola del servidor en vez de mandar un email real.
const emailProvider = process.env.RESEND_API_KEY
  ? resendProvider
  : {
      ...resendProvider,
      async sendVerificationRequest({ identifier, url }: { identifier: string; url: string }) {
        console.log(`\n🦊 Link mágico para ${identifier}:\n${url}\n`);
      },
    };

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [emailProvider],
  session: { strategy: "database" },
  pages: {
    signIn: "/login",
    verifyRequest: "/login/revisa-tu-email",
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});
