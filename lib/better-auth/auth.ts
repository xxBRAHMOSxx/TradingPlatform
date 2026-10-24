import { betterAuth, type BetterAuthOptions } from "better-auth";
import { mongodbAdapter} from "better-auth/adapters/mongodb";
import { connectToDatabase} from "@/database/mongoose";
import { nextCookies} from "better-auth/next-js";
import type { Db } from "mongodb";

let authInstance: ReturnType<typeof betterAuth> | null = null;

export const getAuth = async (): Promise<ReturnType<typeof betterAuth>> => {
    if(authInstance) return authInstance;

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    if(!db) throw new Error('MongoDB connection not found');

    const options: BetterAuthOptions = {
        database: mongodbAdapter(db as Db),
        secret: process.env.BETTER_AUTH_SECRET,
        baseURL: process.env.BETTER_AUTH_URL,
        emailAndPassword: {
            enabled: true,
            disableSignUp: false,
            requireEmailVerification: false,
            minPasswordLength: 8,
            maxPasswordLength: 128,
            autoSignIn: true,
        },
        plugins: [nextCookies()],
    };
    const instance = betterAuth(options);

    authInstance = instance;
    return instance;
}

export const auth = await getAuth();
