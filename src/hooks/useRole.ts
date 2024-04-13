import { useSession } from 'next-auth/react'

export const useRole = () => {
    const session = useSession();

    return session.data?.user?.role
}