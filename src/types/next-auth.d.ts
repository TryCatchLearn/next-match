import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface User {
        profileComplete: boolean;
    }

    interface Session {
        user: {
            profileComplete: boolean;
        } & DefaultSession['user']
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        profileComplete: boolean
    }
}