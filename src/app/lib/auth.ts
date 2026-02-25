import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role, Status } from "../../generated/prisma/enums";
import { bearer, emailOTP } from "better-auth/plugins";
import { sendEmail } from "../utils/email";
import { envVars } from "../../config/env";
// import ms, { StringValue } from "ms";
// import { envVars } from "../../config/env";


export const auth = betterAuth({
    baseURL: envVars.BETTER_AUTH_URL,
    secret: envVars.BETTER_AUTH_SECRET,
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true
    },
    // ! Google Config with better auth  
    socialProviders: {
        google: {
            clientId: envVars.GOOGLE_CLINET_ID,
            clientSecret: envVars.GOOGLE_SECRET,
            // !  mapProfileToUser Usign for only default data provide with user
            mapProfileToUser: () => {
                return {
                    role: Role.PATIENT,
                    status: Status.ACTIVE,
                    needPasswordChange: false,
                    emailVerified: true,
                    isDeleted: false,
                    deletedAt: null

                }
            },
        }
    },
    emailVerification: {
        sendOnSignIn: true,
        sendOnSignUp: true,
        autoSignInAfterVerification: true
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: Role.PATIENT
            },
            status: {
                type: "string",
                required: true,
                defaultValue: Status.ACTIVE
            },
            needPasswordChange: {
                type: "boolean",
                required: true,
                defaultValue: false
            },
            isDeleted: {
                type: "boolean",
                required: true,
                defaultValue: false
            },
            deletedAt: {
                type: "date",
                required: false,
                defaultValue: null
            }

        }
    },
    plugins: [
        bearer(),
        emailOTP({
            overrideDefaultEmailVerification: true,
            async sendVerificationOTP({ email, otp, type }) {
                if (type === "email-verification") {
                    const user = await prisma.user.findUnique({
                        where: {
                            email
                        }
                    })
                    if (user && !user.emailVerified) {
                        sendEmail({
                            to: email,
                            subject: "Verify your email",
                            templateName: "otp",
                            templateData: {
                                name: user.name,
                                otp
                            }
                        })
                    }
                }
                else if (type === "forget-password") {
                    const user = await prisma.user.findUnique({
                        where: {
                            email
                        }
                    })
                    if (user) {
                        sendEmail({
                            to: email,
                            subject: "Password Reset otp",
                            templateName: "otp",
                            templateData: {
                                name: user.name,
                                otp
                            }
                        })
                    }
                }
            },
            expiresIn: 2 * 60,
            otpLength: 6

        })
    ],
    session: {
        // expiresIn: Number(ms(envVars.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN as StringValue)),
        expiresIn: 60 * 60 * 60 * 24, // 1 days
        // updateAge: Number(ms(envVars.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE as StringValue)),
        updateAge: 60 * 60 * 60 * 24,
        cookieCache: {
            enabled: true,
            // maxAge: Number(ms(envVars.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN as StringValue))
            maxAge: 60 * 60 * 60 * 24
        }
    },
    redirectURLs: {
        signIn: `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success`
    },
    // ! trusted origin 
    trustedOrigins: [
        process.env.BETTER_AUTH_URL || "http://localhost:5000", envVars.FRONTEND_URL || "http://localhost:3000"
    ],
    advanced: {
        useSecureCookies: false,
        cookies: {
            state: {
                attributes: {
                    sameSite: "none",
                    secure: true,
                    httpOnly: true,
                    path: "/"
                },


            }, sessionToken: {
                attributes: {
                    sameSite: "none",
                    secure: true,
                    httpOnly: true,
                    path: "/"
                }
            }
        }
    }

});