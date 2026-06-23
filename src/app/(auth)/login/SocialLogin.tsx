import { authClient } from "@/lib/auth-client"
import { Button } from "@heroui/react"
import { FaGithub, FaGoogle } from "react-icons/fa"

export default function SocialLogin() {
    const signIn = async (provider: 'github' | 'google') => {
        await authClient.signIn.social({
            provider,
            callbackURL: '/members'
        })
    }

    return (
        <div className="flex items-center w-full gap-2">
            <Button
                size="lg"
                className='w-full'
                variant="outline"
                onClick={() => signIn('github')}
            >
                <FaGithub size={20} />
            </Button>
            <Button
                size="lg"
                variant="outline"
                className='w-full'
                onClick={() => signIn('google')}
            >
                <FaGoogle size={20} />
            </Button>
        </div>
    )
}