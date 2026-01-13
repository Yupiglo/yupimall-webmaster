import Credentials from "next-auth/providers/credentials";
import axios from "axios";
import { type NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                try {
                    const response = await axios.post(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/signin`,
                        {
                            username: credentials?.email,
                            password: credentials?.password,
                        }
                    );

                    if (response.data.status === 200 && response.data.user.token) {
                        // Restriction: Only Webmaster users allowed in this panel
                        if (response.data.user.role !== 'webmaster') {
                            throw new Error("Accès refusé. Réservé au profil Webmaster.");
                        }

                        return {
                            id: response.data.user.id.toString(),
                            name: response.data.user.username,
                            email: response.data.user.email,
                            role: response.data.user.role,
                            country: response.data.user.country,
                            accessToken: response.data.user.token,
                        };
                    }
                    return null;
                } catch (error: any) {
                    console.error("Authorize error:", error.message);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }: { token: any; user: any }) {
            if (user) {
                token.role = user.role;
                token.country = user.country;
                token.accessToken = user.accessToken;
            }
            return token;
        },
        async session({ session, token }: { session: any; token: any }) {
            if (session.user) {
                session.user.role = token.role;
                session.user.country = token.country;
                session.accessToken = token.accessToken;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.AUTH_SECRET,
};
